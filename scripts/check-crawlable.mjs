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

  if (misses.length) {
    console.error(`\n✖ crawlability: ${misses.length} problem(s) — content may be client-only:\n`);
    for (const m of misses) console.error('   • ' + m);
    console.error('');
    process.exit(1);
  }
  console.log(`✓ crawlability: ${checked} remedy pages + key routes carry their content in static HTML.`);
}

main();
