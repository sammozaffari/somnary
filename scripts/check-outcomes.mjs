#!/usr/bin/env node
/**
 * Outcome-coverage gate (audit WF-6). A remedy is wired into the site in three places — its
 * `.mdx` file, the `lib/outcomes` goal→remedy map, and `data/content-index.json` — and a slug
 * that's mistyped or left behind in one of them fails SILENTLY: `outcome/[slug].astro` filters
 * unresolved slugs to null, so a remedy just quietly vanishes from its goal page with no error.
 * This gate makes that impossible to ship.
 *
 *   node scripts/check-outcomes.mjs            → per-check PASS/gap; exit 0 all pass, exit 1 on any gap.
 *   node scripts/check-outcomes.mjs --selftest → asserts the checker catches a seeded dangling slug.
 *
 * Two checks, and it INVENTS NO DATA:
 *   A · every slug in OUTCOMES[].remedies resolves to a real, non-draft remedy .mdx (the silent-drop).
 *   B · every non-draft remedy is registered in content-index.json (else it has no category and
 *       drops out of search/browse).
 * It does NOT require every remedy to appear in an outcome — some (e.g. cbd) are deliberately absent
 * (no controlled evidence), which is a content decision, not a coverage bug.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const CONTENT_DIR = process.env.SOMNARY_CONTENT_DIR || 'src/content/remedies';
const INDEX_PATH = fileURLToPath(new URL('../src/data/content-index.json', import.meta.url));
const OUTCOMES_PATH = fileURLToPath(new URL('../src/lib/outcomes.ts', import.meta.url));

/**
 * Read the goal→remedy map by TEXT-PARSING lib/outcomes.ts (each Outcome is `id: '…' … remedies:
 * ['…', …]`). Deliberately not an import: this must run on any Node version in the build pipeline
 * without TS-execution flags (the Vercel build uses Node 22). The interface's `remedies: string[]`
 * can't match — the pattern needs a `[` immediately after `remedies:`.
 */
async function loadOutcomes() {
  const src = await readFile(OUTCOMES_PATH, 'utf8');
  const out = [];
  const objRe = /id:\s*'([^']+)'[\s\S]*?remedies:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = objRe.exec(src))) {
    out.push({ id: m[1], remedies: [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]) });
  }
  return out;
}

async function mdxFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await mdxFiles(full)));
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/** Live (non-draft) remedy slugs, from the same corpus the citation resolver scans. */
async function liveRemedySlugs() {
  const files = await mdxFiles(CONTENT_DIR);
  const slugs = new Set();
  for (const f of files) {
    const { data } = matter(await readFile(f, 'utf8'));
    if (data.draft === true) continue;
    slugs.add(basename(f, '.mdx'));
  }
  return slugs;
}

/** The pure checker — pass the corpus in so --selftest can exercise it with synthetic data. */
function findGaps({ outcomes, liveSlugs, indexedSlugs }) {
  const dangling = []; // A: outcome ref → no live remedy
  for (const o of outcomes) {
    for (const slug of o.remedies) {
      if (!liveSlugs.has(slug)) dangling.push({ outcome: o.id, slug });
    }
  }
  const unregistered = [...liveSlugs].filter((s) => !indexedSlugs.has(s)); // B
  return { dangling, unregistered };
}

async function main() {
  if (process.argv.includes('--selftest')) {
    const { dangling } = findGaps({
      outcomes: [{ id: 'fake-goal', remedies: ['melatonin', 'mispeled-slug'] }],
      liveSlugs: new Set(['melatonin']),
      indexedSlugs: new Set(['melatonin']),
    });
    if (dangling.length === 1 && dangling[0].slug === 'mispeled-slug') {
      console.log('✓ outcome-coverage self-test: seeded dangling slug caught.');
      return;
    }
    console.error('✗ outcome-coverage self-test FAILED: seeded dangling slug not caught.');
    process.exit(1);
  }

  const outcomes = await loadOutcomes();
  if (outcomes.length === 0) {
    console.error('✗ outcome-coverage gate: parsed 0 outcomes from lib/outcomes.ts — parser may be stale.');
    process.exit(1);
  }
  const liveSlugs = await liveRemedySlugs();
  const index = JSON.parse(await readFile(INDEX_PATH, 'utf8'));
  const indexedSlugs = new Set(index.map((e) => e.slug));

  const { dangling, unregistered } = findGaps({ outcomes, liveSlugs, indexedSlugs });

  if (dangling.length === 0 && unregistered.length === 0) {
    console.log(
      `\n✓ outcome coverage: ${outcomes.length} outcomes, ${liveSlugs.size} live remedies — every ` +
        `goal→remedy slug resolves and every remedy is registered.\n`,
    );
    return;
  }

  console.error('\n✗ outcome-coverage gate failed:\n');
  for (const d of dangling) {
    console.error(`  • lib/outcomes "${d.outcome}" references remedy "${d.slug}" — no live remedy .mdx (silent drop).`);
  }
  for (const s of unregistered) {
    console.error(`  • remedy "${s}" is not in content-index.json — it has no category and drops out of search/browse.`);
  }
  console.error('\nfix the slug (or register the remedy) so no page silently omits a remedy.\n');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
