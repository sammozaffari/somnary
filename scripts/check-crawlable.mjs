#!/usr/bin/env node
/**
 * Crawlability gate (CHK-0.5) — proves core content is SERVER-RENDERED into the HTML,
 * not injected by client JS (a CLAUDE.md non-negotiable: "All content pages are SSR/SSG.
 * Never ship core content client-only."). Greps the BUILT output for content that must be
 * present in the static HTML.
 *
 *   node scripts/check-crawlable.mjs     # run AFTER `astro build`. exit 1 on any miss.
 *
 * For every non-draft remedy it asserts /r/<slug>/index.html exists and contains the
 * remedy name, a grade signal, and a citation/source — the exact things a JS-only render
 * would hide from crawlers. Also spot-checks the home and tier-board routes.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = 'src/content/remedies';
const DIST = 'dist/client';

const exists = (p) => access(p).then(() => true, () => false);

async function main() {
  const misses = [];

  if (!(await exists(DIST))) {
    console.error(`✖ crawlability: ${DIST} not found — run \`npm run build\` first.`);
    process.exit(1);
  }

  // Per-remedy: the rendered page must carry its own content in the static HTML.
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.mdx'));
  let checked = 0;
  for (const f of files) {
    const { data } = matter(await readFile(join(CONTENT_DIR, f), 'utf8'));
    if (data.draft) continue;
    const slug = f.replace(/\.mdx$/, '');
    const html = join(DIST, 'r', slug, 'index.html');
    if (!(await exists(html))) {
      misses.push(`r/${slug}: no built HTML at ${html}`);
      continue;
    }
    const body = await readFile(html, 'utf8');
    checked++;
    // name (the page's own subject), a grade signal, and a citation must be in the HTML.
    if (data.name && !body.includes(data.name)) misses.push(`r/${slug}: name "${data.name}" not in server-rendered HTML`);
    if (!/grade/i.test(body)) misses.push(`r/${slug}: no "grade" text in HTML (grade not server-rendered?)`);
    if (!body.includes('pubmed.ncbi.nlm.nih.gov') && !body.includes('doi.org') && !/sources/i.test(body)) {
      misses.push(`r/${slug}: no citation/source signal in HTML`);
    }
  }

  // Key routes must render their hero content statically.
  const routes = [
    { path: 'index.html', needle: 'evidence', label: 'home' },
    { path: join('tiers', 'index.html'), needle: 'grade', label: 'tier board' },
  ];
  for (const r of routes) {
    const p = join(DIST, r.path);
    if (!(await exists(p))) { misses.push(`${r.label}: no built HTML at ${p}`); continue; }
    const body = await readFile(p, 'utf8');
    if (!new RegExp(r.needle, 'i').test(body)) misses.push(`${r.label}: "${r.needle}" not in server-rendered HTML`);
  }

  // Label checker (CHK-4.1): the tool is a client island, but its RULES DOCUMENTATION, privacy
  // promise, and allowed-framing note MUST be server-rendered — the checker can never be a black
  // box. Assert each of those is present in the static HTML (proof it survives with JS off).
  const lcPath = join(DIST, 'label-checker', 'index.html');
  if (!(await exists(lcPath))) {
    misses.push(`label-checker: no built HTML at ${lcPath}`);
  } else {
    const body = await readFile(lcPath, 'utf8');
    const needles = [
      { re: /rules this checker applies/i, why: 'rules documentation heading' },
      { re: /proprietary blend/i, why: 'R1 rationale' },
      { re: /studied range/i, why: 'R2 rationale' },
      { re: /standardized extract/i, why: 'R4 rationale' },
      { re: /interaction cautions/i, why: 'R5 rationale' },
      { re: /never leaves your device|never sent to Somnary/i, why: 'privacy promise' },
      { re: /it doesn.t tell you what to take|describes problems a label can have/i, why: 'allowed-framing note' },
    ];
    for (const n of needles) {
      if (!n.re.test(body)) misses.push(`label-checker: ${n.why} not in server-rendered HTML`);
    }
    // R3 rule id must be documented too (the five rules are all present server-side).
    for (const id of ['R1', 'R2', 'R3', 'R4', 'R5']) {
      if (!body.includes(id)) misses.push(`label-checker: rule ${id} not documented in static HTML`);
    }
  }

  // Compare tool (CHK-6.1, rebuilt L-01 as a difference-first PAIR): the IA is now two tiers —
  //   (1) /compare, the crawlable PICKER/index: every reviewed remedy + its grade, the D4
  //       "comparing ≠ combining" framing, and the medical disclaimer, all server-rendered; and
  //   (2) /compare/[a]-vs-[b], one SSG page per pair carrying the FULL comparison (both remedies,
  //       grade, D4 framing, the per-remedy interaction section + its routing to the medications
  //       page, disclaimer) in static HTML.
  // Both must survive with JS off — the picker is an enhancement, the pair content is the payload.
  const cmpPath = join(DIST, 'compare', 'index.html');
  if (!(await exists(cmpPath))) {
    misses.push(`compare: no built HTML at ${cmpPath}`);
  } else {
    const body = await readFile(cmpPath, 'utf8');
    // Every non-draft remedy name must be in the static index HTML (the crawlable remedy list).
    for (const f of files) {
      const { data } = matter(await readFile(join(CONTENT_DIR, f), 'utf8'));
      if (data.draft) continue;
      if (data.name && !body.includes(data.name)) {
        misses.push(`compare: remedy "${data.name}" not in server-rendered picker HTML`);
      }
    }
    const needles = [
      { re: /grade/i, why: 'grade signal (grades not server-rendered?)' },
      { re: /not a tool for combining/i, why: 'D4 comparing-≠-combining framing' },
      { re: /educational, not medical advice/i, why: 'medical disclaimer' },
    ];
    for (const n of needles) {
      if (!n.re.test(body)) misses.push(`compare: ${n.why} not in server-rendered picker HTML`);
    }
  }

  // Representative pair page: the full comparison must be server-rendered, not a client island.
  const pairDir = 'magnesium-vs-melatonin';
  const pairPath = join(DIST, 'compare', pairDir, 'index.html');
  if (!(await exists(pairPath))) {
    misses.push(`compare pair: no built HTML at ${pairPath} (pair pages not pre-rendered?)`);
  } else {
    const body = await readFile(pairPath, 'utf8');
    const needles = [
      { re: /Magnesium/, why: 'first remedy name' },
      { re: /Melatonin/, why: 'second remedy name' },
      { re: /grade/i, why: 'grade signal' },
      { re: /not a tool for combining/i, why: 'D4 comparing-≠-combining framing' },
      { re: /Interaction classes/i, why: 'per-remedy interaction section' },
      { re: /\/medications-and-sleep-aids/i, why: 'interaction routing to medications page' },
      { re: /educational, not medical advice/i, why: 'medical disclaimer' },
    ];
    for (const n of needles) {
      if (!n.re.test(body)) misses.push(`compare pair (${pairDir}): ${n.why} not in server-rendered HTML`);
    }
  }

  if (misses.length) {
    console.error(`\n✖ crawlability: ${misses.length} problem(s) — content may be client-only:\n`);
    for (const m of misses) console.error('   • ' + m);
    console.error('');
    process.exit(1);
  }
  console.log(`✓ crawlability: ${checked} remedy pages + key routes carry their content in static HTML.`);
}

main();
