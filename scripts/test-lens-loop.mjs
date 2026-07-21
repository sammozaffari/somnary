#!/usr/bin/env node
/**
 * Lens human-grade loop firewall + privacy suite (CHK-7.3c) — the regression-proof gate that the
 * nomination/demand backlog can NEVER touch a grade, and that the demand logger stores ONLY a
 * normalized name (never free text, question input, refused/short-circuit runs, or an IP), fail-open.
 *
 * Fully OFFLINE, no network, no Supabase: it parses the migration SQL as text, statically scans imports,
 * and drives the REAL demand logger with an injected mock/throwing client. Same style as test-lens.mjs.
 *
 * Proves:
 *   (a) FIREWALL — SQL: 0003_lens_backlog.sql has NO foreign key / join into any corpus/remedy/grade/
 *       tier/scorecard table. The two tables are structurally unable to reference a graded row.
 *   (b) FIREWALL — imports: NO grading/corpus/tier/scorecard module statically imports demand-log.ts or
 *       nominate.ts, and none reference the table names `lens_demand` / `review_nominations`.
 *   (c) PRIVACY — the demand logger refuses question / refused / short-circuit / empty runs, and for an
 *       assessed ingredient writes ONLY the normalized subject via lens_demand_bump — the captured RPC
 *       call carries no raw-text/IP/question field.
 *   (d) FAIL-OPEN — an injected THROWING client leaves the assessment response byte-identical.
 *   (e) NO READ — no .astro page or build script reads `lens_demand` / `review_nominations` (grep).
 *
 *   node scripts/test-lens-loop.mjs   # deterministic, fully offline.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const imp = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

let pass = 0;
let fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

// Recursively collect files under a dir matching a predicate.
async function walk(dir, pred, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      await walk(full, pred, acc);
    } else if (pred(full)) {
      acc.push(full);
    }
  }
  return acc;
}

// The backlog table names + the loop modules the firewall forbids grading code from touching.
const BACKLOG_TABLES = ['lens_demand', 'review_nominations'];
const LOOP_MODULES = ['demand-log', 'nominate'];

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
console.log('\n(a) FIREWALL — migration SQL references no corpus/grade table');
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
{
  const sql = await readFile(join(ROOT, 'supabase/migrations/0003_lens_backlog.sql'), 'utf8');

  // Strip block comments, line comments, AND single-quoted string literals so the firewall comment PROSE
  // and the `comment on table … is '…'` docstrings (which legitimately name "grade"/"remedy" to EXPLAIN
  // the firewall) never count as a real reference. We assert on executable DDL identifiers only.
  const code = sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((l) => l.replace(/--.*$/, ''))
    .join('\n')
    .replace(/'(?:[^']|'')*'/g, "''"); // collapse every string literal to an empty one

  // No `references <corpus/grade/...>` FK anywhere in executable SQL.
  const fkRe = /\breferences\b/i;
  ok('no FOREIGN KEY (references) in executable SQL', !fkRe.test(code), 'a `references` clause would let a nomination/demand row point at a graded row');

  // No `join` into another table in executable SQL (there are no reads at all here).
  ok('no JOIN in executable SQL', !/\bjoin\b/i.test(code), 'the backlog never joins any table');

  // None of these corpus/grade/tier/scorecard table identifiers appear in executable SQL.
  const forbiddenTables = ['remed', 'source_products', 'source_scores', 'source_scorecards', 'tier', 'grade', 'scorecard', 'profiles', 'saved_maps', 'auth.users'];
  for (const t of forbiddenTables) {
    ok(`executable SQL never names \`${t}\``, !new RegExp(`\\b${t.replace('.', '\\.')}`, 'i').test(code), `found a reference to ${t} in executable SQL`);
  }

  // The two backlog tables ARE created, and RLS is enabled on both with no create-policy.
  for (const t of BACKLOG_TABLES) {
    ok(`creates \`${t}\``, new RegExp(`create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${t}\\b`, 'i').test(code));
    ok(`RLS enabled on \`${t}\``, new RegExp(`alter\\s+table\\s+public\\.${t}\\s+enable\\s+row\\s+level\\s+security`, 'i').test(code));
  }
  ok('no CREATE POLICY (no public access path)', !/create\s+policy/i.test(code), 'a policy would open the anon key onto the backlog');

  // The firewall comment is present verbatim-ish (the non-negotiable, so the intent survives edits).
  ok('firewall intent documented (STRUCTURALLY INCAPABLE / no FK)', /STRUCTURALLY INCAPABLE|no foreign key|NO foreign key/i.test(sql));
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
console.log('\n(b) FIREWALL — no grading/corpus/tier/scorecard module imports the loop');
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
{
  // Identify grading/corpus/tier/scorecard source by path. This is the code that must NEVER learn about
  // nomination/demand data. We scan the whole src/ tree and select by name so new files are caught too.
  const isGradingModule = (full) => {
    const rel = relative(ROOT, full).replace(/\\/g, '/');
    if (!/\.(ts|astro)$/.test(rel)) return false;
    if (rel.includes('scripts/') || rel.includes('/test')) return false;
    return (
      /(^|\/)(tiers?|grade|scorecard|corpus|content-index)\b/i.test(rel) ||
      rel.includes('src/data/source-scorecards/') ||
      rel.includes('src/content.config') ||
      /Remedy|Tier|Grade|Scorecard/i.test(rel.split('/').pop() ?? '')
    );
  };

  const gradingFiles = await walk(join(ROOT, 'src'), isGradingModule);
  ok('found grading/corpus/tier/scorecard modules to guard', gradingFiles.length >= 5, `only ${gradingFiles.length} found`);

  let leaks = [];
  for (const f of gradingFiles) {
    const text = await readFile(f, 'utf8');
    for (const m of LOOP_MODULES) {
      if (new RegExp(`import[^\\n]*['"\`][^'"\`]*${m}['"\`]`).test(text) || new RegExp(`from\\s+['"\`][^'"\`]*${m}['"\`]`).test(text)) {
        leaks.push(`${relative(ROOT, f)} imports ${m}`);
      }
    }
    for (const t of BACKLOG_TABLES) {
      if (text.includes(t)) leaks.push(`${relative(ROOT, f)} references table ${t}`);
    }
  }
  ok('no grading module imports demand-log/nominate or names a backlog table', leaks.length === 0, leaks.join('; '));

  // Symmetric direction: demand-log.ts must not import any grading/corpus/tier/scorecard module — it
  // only knows the LensAssessment TYPE and the supabase admin. (A type import of engine.ts is allowed.)
  const demandText = await readFile(join(ROOT, 'src/lib/lens/demand-log.ts'), 'utf8');
  const gradeImportRe = /from\s+['"`][^'"`]*(tiers|scorecard|content-index|source-scorecards|content\.config)['"`]/i;
  ok('demand-log.ts imports no grading/corpus module', !gradeImportRe.test(demandText), 'the logger must not reach into grading code');
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
console.log('\n(c) PRIVACY — the demand logger refuses the four cases + writes ONLY the name');
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
{
  const { logLensDemand, deriveDemandSubject } = await imp('src/lib/lens/demand-log.ts');

  // A tiny mock client capturing every rpc() call, so we can assert EXACTLY what was written.
  const makeMock = () => {
    const calls = [];
    return {
      calls,
      client: {
        async rpc(fn, args) {
          calls.push({ fn, args });
          return { error: null };
        },
      },
    };
  };

  // Build a minimal LensAssessment for a given kind/normalized/status (only fields the logger reads).
  const mk = (kind, normalized, status) => ({ input: { kind, normalized }, status });

  // 1) question-kind → NEVER logged (normalized is raw user text).
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('question', 'does melatonin help my anxiety and heart palpitations at night', 'assessed'), client);
    ok('question-kind logs NOTHING (raw text never stored)', calls.length === 0, `wrote: ${JSON.stringify(calls)}`);
  }

  // 2) refused status → NEVER logged.
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('ingredient', 'melatonin', 'refused'), client);
    ok('refused status logs NOTHING', calls.length === 0);
  }

  // 3) short-circuit status → NEVER logged (already a graded corpus page).
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('ingredient', 'valerian', 'short-circuit'), client);
    ok('short-circuit status logs NOTHING', calls.length === 0);
  }

  // 4) empty subject → NEVER logged.
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('ingredient', '   ', 'assessed'), client);
    ok('empty subject logs NOTHING', calls.length === 0);
  }

  // 4b) multi-line 'product' (a pasted panel's raw normalized) → NEVER logged as a subject.
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('product', 'supplement facts\nmelatonin 10 mg\nvitamin b6 2 mg\nother ingredients: gelatin', 'assessed'), client);
    ok('multi-line panel product logs NOTHING (raw label text never stored)', calls.length === 0, `wrote: ${JSON.stringify(calls)}`);
  }

  // 5) assessed ingredient → logs EXACTLY the normalized subject, nothing else.
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('ingredient', 'Ashwagandha', 'assessed'), client);
    ok('assessed ingredient logs exactly one bump', calls.length === 1 && calls[0].fn === 'lens_demand_bump');
    const args = calls[0]?.args ?? {};
    ok('bump carries ONLY p_subject', Object.keys(args).length === 1 && 'p_subject' in args, `args: ${JSON.stringify(args)}`);
    ok('subject is normalized (lowercased/trimmed name)', args.p_subject === 'ashwagandha', `got: ${JSON.stringify(args.p_subject)}`);
    // Regression guard: no field carries raw text, a question, or an IP.
    const forbiddenKeys = ['ip', 'ip_address', 'question', 'raw', 'text', 'query', 'input', 'normalized', 'email'];
    const hasForbidden = Object.keys(args).some((k) => forbiddenKeys.includes(k.toLowerCase()));
    ok('bump carries NO ip/question/raw/text/query field', !hasForbidden, `args: ${JSON.stringify(args)}`);
  }

  // 6) assessed 'product' single-line name → logged (a clean product name is fine).
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('product', 'Brand X Sleep Gummies', 'assessed'), client);
    ok('assessed single-line product logs its normalized name', calls.length === 1 && calls[0].args.p_subject === 'brand x sleep gummies');
  }

  // 7) inconclusive ingredient → logged (inconclusive is still a research run).
  {
    const { client, calls } = makeMock();
    await logLensDemand(mk('ingredient', 'Apigenin', 'inconclusive'), client);
    ok('inconclusive ingredient logs its name', calls.length === 1 && calls[0].args.p_subject === 'apigenin');
  }

  // 8) null client (unconfigured deploy) → no-op, no throw.
  {
    let threw = false;
    try {
      await logLensDemand(mk('ingredient', 'l-theanine', 'assessed'), null);
    } catch {
      threw = true;
    }
    ok('null client → silent no-op (env-gated)', !threw);
  }

  // deriveDemandSubject unit checks (pure).
  ok('deriveDemandSubject: question → null', deriveDemandSubject(mk('question', 'is magnesium safe', 'assessed')) === null);
  ok('deriveDemandSubject: refused → null', deriveDemandSubject(mk('ingredient', 'melatonin', 'refused')) === null);
  ok('deriveDemandSubject: short-circuit → null', deriveDemandSubject(mk('ingredient', 'melatonin', 'short-circuit')) === null);
  ok('deriveDemandSubject: assessed ingredient → normalized name', deriveDemandSubject(mk('ingredient', '  Magnesium Glycinate ', 'assessed')) === 'magnesium glycinate');
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
console.log('\n(d) FAIL-OPEN — a throwing client leaves the assessment byte-identical');
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
{
  const { logLensDemand } = await imp('src/lib/lens/demand-log.ts');

  const assessment = { input: { kind: 'ingredient', normalized: 'ashwagandha' }, status: 'assessed', verdictLine: 'x' };
  const before = JSON.stringify(assessment);

  const throwingClient = {
    async rpc() {
      throw new Error('supabase exploded');
    },
  };

  let threw = false;
  try {
    await logLensDemand(assessment, throwingClient);
  } catch {
    threw = true;
  }
  ok('throwing client does NOT throw out of logLensDemand', !threw);
  ok('assessment object unchanged after a throwing log (fail-open)', JSON.stringify(assessment) === before);
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
console.log('\n(e) NO READ — no page/build script reads the backlog tables');
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
{
  const pages = await walk(join(ROOT, 'src/pages'), (f) => f.endsWith('.astro'));
  const buildScripts = await walk(join(ROOT, 'scripts'), (f) => f.endsWith('.mjs') && !f.endsWith('test-lens-loop.mjs'));
  const targets = [...pages, ...buildScripts];

  // Strip comments (JS/CSS block + line, and Astro/HTML comments) so a code COMMENT naming a table for
  // documentation never counts. A genuine READ is a Supabase query — `.from('<table>')` or an rpc/select
  // that names the table — so we look for the table name in a query-ish context, on executable lines.
  const stripComments = (text) =>
    text
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .split('\n')
      .map((l) => l.replace(/\/\/.*$/, ''))
      .join('\n');

  let readers = [];
  for (const f of targets) {
    const code = stripComments(await readFile(f, 'utf8'));
    for (const t of BACKLOG_TABLES) {
      // Any surviving mention in executable code is a red flag (pages/build scripts must never name a
      // backlog table at all — there is no legitimate read or write of it from here).
      if (new RegExp(`\\b${t}\\b`).test(code)) readers.push(`${relative(ROOT, f)} names ${t}`);
    }
  }
  ok('no .astro page or build script reads lens_demand/review_nominations', readers.length === 0, readers.join('; '));
}

// ---------------------------------------------------------------------------------------------------
console.log(`\n${fail === 0 ? '✓' : '✗'} lens-loop suite: ${pass} passed, ${fail} failed.`);
process.exit(fail === 0 ? 0 : 1);
