#!/usr/bin/env node
/**
 * Search-index self-test (search-first Phase 2) — the offline gate for the ONE build-time search
 * index that now spans remedies + product scorecards + the additive watchlist.
 *
 * Two layers, no network, no npm dep (Node built-ins only):
 *   1. PURE RANKER — drives the real ranker (src/lib/search-rank.ts) against an inline fixture that
 *      contains a remedy, a product and an additive doc. Proves the corpus short-circuit precedence
 *      (a graded remedy out-ranks a same-name product) and the empty/no-match path the later Lens
 *      card depends on. This layer runs with or without a build.
 *   2. BUILT INDEX (if present) — asserts the real dist/search-index.json actually carries all three
 *      kinds with resolvable URLs. Skipped (not failed) when dist hasn't been built yet, so the test
 *      is meaningful pre-build and stronger post-build.
 *
 * NOTE: the built-index layer only reflects the CURRENT code immediately after `npm run build` (it
 * reads the last-emitted dist). CI is safe because it rebuilds before this gate; run it after a build
 * locally too, or a stale dist will assert against old data.
 *
 *   node scripts/test-search-index.mjs   # deterministic, fully offline.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const { searchDocsScored } = await import(
  pathToFileURL(join(ROOT, 'src/lib/search-rank.ts')).href
);

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

// --- fixture: one of each kind, incl. a melatonin remedy AND a melatonin product ------------------
const doc = (over) => ({
  slug: 'x',
  url: '/r/x',
  name: 'X',
  kind: 'remedy',
  tier: 'A',
  category: '',
  latin: null,
  keyCompound: null,
  aliases: [],
  outcomes: [],
  symptoms: [],
  oneLiner: '',
  ...over,
});

const fixture = [
  doc({ slug: 'melatonin', url: '/r/melatonin', name: 'Melatonin', kind: 'remedy', tier: 'A' }),
  doc({
    slug: 'nature-made-melatonin-3mg',
    url: '/sources/melatonin/nature-made-melatonin-3mg',
    name: 'Nature Made Melatonin',
    kind: 'product',
    tier: null,
    category: 'Product · Nature Made',
    aliases: ['Nature Made', 'Melatonin', 'melatonin'],
    oneLiner: 'USP Verified melatonin tablet.',
  }),
  doc({
    slug: 'titanium-dioxide',
    url: '/sources/additives#titanium-dioxide',
    name: 'titanium dioxide',
    kind: 'additive',
    tier: null,
    category: 'Additive · concern',
    aliases: ['titanium dioxide', 'E171', 'CI 77891'],
    oneLiner: 'On the additive watchlist (stronger evidence).',
  }),
];

console.log('search-rank (pure) — fixture:');

// A graded remedy must out-rank any melatonin product (corpus short-circuit precedence).
const melRanked = searchDocsScored('melatonin', fixture);
ok(
  "'melatonin' ranks the remedy /r/melatonin FIRST",
  melRanked.length > 0 && melRanked[0].doc.url === '/r/melatonin',
  `top was ${melRanked[0]?.doc.url ?? '(none)'}`,
);

// A product is still findable by its own brand/name.
const brandRanked = searchDocsScored('nature made', fixture);
ok(
  "'nature made' finds the product doc",
  brandRanked.some((r) => r.doc.kind === 'product' && r.doc.url === '/sources/melatonin/nature-made-melatonin-3mg'),
);

// An additive is findable by an alias.
const addRanked = searchDocsScored('E171', fixture);
ok(
  "'E171' finds the additive doc via alias",
  addRanked.some((r) => r.doc.kind === 'additive' && r.doc.url.startsWith('/sources/additives#')),
);

// No-match query returns [] on the fixture (drives the later no-hit Lens path).
ok("'zzzquil' returns [] (no match)", searchDocsScored('zzzquil', fixture).length === 0);

// --- built index (if present) --------------------------------------------------------------------
// Astro's Vercel adapter emits the /search-index.json endpoint under dist/client (with a mirror in
// .vercel/output/static); try both so the test runs after a plain `npm run build`.
const CANDIDATES = [
  join(ROOT, 'dist', 'client', 'search-index.json'),
  join(ROOT, 'dist', 'search-index.json'),
];
let raw = null;
for (const p of CANDIDATES) {
  try {
    raw = await readFile(p, 'utf8');
    break;
  } catch {
    /* try next */
  }
}

if (!raw) {
  console.log('\nbuilt index — search-index.json not found; run `npm run build` first (skipped, not failed).');
} else {
  console.log('\nbuilt index (dist/search-index.json):');
  const docs = JSON.parse(raw);
  ok('index is a non-empty array', Array.isArray(docs) && docs.length > 0, `len=${docs?.length}`);

  const byKind = (k) => docs.filter((d) => d.kind === k);
  const remedies = byKind('remedy');
  const products = byKind('product');
  const additives = byKind('additive');
  ok('≥ 31 remedy docs', remedies.length >= 31, `got ${remedies.length}`);
  ok('≥ 65 product docs', products.length >= 65, `got ${products.length}`);
  ok('≥ 8 additive docs (the flagged set)', additives.length >= 8, `got ${additives.length}`);

  // A known additive is present by its exact anchor URL — catches an anchor-format or DISPLAY-name
  // regression (e.g. if the id→title map drifts from the /sources/additives headings).
  const titanium = additives.find((d) => d.url === '/sources/additives#titanium-dioxide');
  ok('titanium-dioxide additive present by anchor url', !!titanium, 'no doc with that url');
  ok(
    "titanium-dioxide title matches the page heading ('Titanium dioxide')",
    titanium?.name === 'Titanium dioxide',
    `name was ${JSON.stringify(titanium?.name)}`,
  );

  const urlOk = (u) =>
    /^\/r\//.test(u) || /^\/sources\/.+\/.+/.test(u) || /^\/sources\/additives#/.test(u);
  const badUrls = docs.filter((d) => !urlOk(d.url));
  ok('every doc url is /r/*, /sources/*/*, or /sources/additives#*', badUrls.length === 0, badUrls.slice(0, 3).map((d) => d.url).join(', '));

  // Real built index must preserve the same corpus short-circuit precedence.
  const melBuilt = searchDocsScored('melatonin', docs);
  ok(
    "built: 'melatonin' ranks /r/melatonin FIRST",
    melBuilt.length > 0 && melBuilt[0].doc.url === '/r/melatonin',
    `top was ${melBuilt[0]?.doc.url ?? '(none)'}`,
  );

  // Products carry no tier (no grade); remedies keep theirs.
  ok('every product/additive doc has tier === null', [...products, ...additives].every((d) => d.tier === null));
  ok('every remedy doc has a non-null tier', remedies.every((d) => d.tier != null));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
