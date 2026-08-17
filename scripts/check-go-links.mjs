#!/usr/bin/env node
/**
 * Retail-link gate (CHK-B4; REDESIGN Step 9 / A3). Raw retailer URLs must NEVER appear in page
 * content — every buy link is routed through /go/{id} (goHref / RetailLink) so the raw URLs live
 * ONLY in each product's structured `retail_links[]` (the registry the /go endpoint reads), and
 * adding affiliate tags later stays a one-file change. FATAL (exit 1) on any raw retailer URL in a
 * scanned content/markup/page file.
 *
 *   node scripts/check-go-links.mjs            # scan
 *   node scripts/check-go-links.mjs --selftest # prove it catches a seeded raw URL
 *
 * Scanned: src/content/**.mdx (prose), src/pages, src/components, src/layouts (markup/templates).
 * NOT scanned (raw URLs legitimately live here, or this IS the redirect plumbing):
 *   - src/content/products / src/content/brands JSON — the retail_links registry (not .mdx);
 *   - src/pages/go, src/lib/go, src/components/RetailLink.astro — they emit /go, never a raw URL;
 *   - src/data/source-scorecards — the RETIRING product data (deleted at CHK-B18), not page content.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// raw retailer URL = an http(s) URL on a known retail host. Retailer domains present in the corpus.
const RETAILER_URL = /https?:\/\/[^\s"'`)]*(?:chemistwarehouse|iherb|amazon\.[a-z]{2,3}(?:\.[a-z]{2,3})?)/i;

/** Pure detector — also the unit under --selftest. Returns matched raw URLs in `text`. */
export function findRawRetailerUrls(text) {
  const out = [];
  text.split('\n').forEach((line, i) => {
    const m = line.match(RETAILER_URL);
    if (m) out.push({ line: i + 1, url: m[0] });
  });
  return out;
}

if (process.argv.includes('--selftest')) {
  const bad = 'Buy it at https://au.iherb.com/pr/thing/123 today';
  const good = 'Buy it via <RetailLink productId="x" retailer="iherb" /> or /go/x?to=iherb';
  const caughtBad = findRawRetailerUrls(bad).length === 1;
  const passesGood = findRawRetailerUrls(good).length === 0;
  if (caughtBad && passesGood) {
    console.log('✓ go-links self-test: catches a seeded raw retailer URL, passes a /go link.');
    process.exit(0);
  }
  console.error(`✖ go-links self-test FAILED (caughtBad=${caughtBad}, passesGood=${passesGood})`);
  process.exit(1);
}

const ROOTS = ['src/content', 'src/pages', 'src/components', 'src/layouts'];
const EXT = /\.(astro|ts|tsx|js|mjs|md|mdx)$/;
const EXEMPT = [
  'src/content/products/', // retail_links registry (JSON, not scanned by ext, but belt-and-suspenders)
  'src/content/brands/',
  'src/pages/go/', // the redirect endpoint itself
  'src/lib/go/', // the go plumbing (not under ROOTS, but explicit)
  'src/components/RetailLink.astro', // the sanctioned buy-link component
  'src/data/source-scorecards/', // retiring product data (deleted at CHK-B18), not page content
];

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (EXEMPT.some((x) => p.startsWith(x))) continue;
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const fails = [];
for (const root of ROOTS) {
  for (const file of await walk(root)) {
    if (EXEMPT.some((x) => file.startsWith(x))) continue;
    const src = await readFile(file, 'utf8');
    for (const { line, url } of findRawRetailerUrls(src)) {
      fails.push(`${file}:${line}  raw retailer URL "${url}" — route it through /go (goHref / RetailLink)`);
    }
  }
}

if (fails.length) {
  console.error(`\n✖ go-links gate: ${fails.length} raw retailer URL(s) in page content\n`);
  for (const f of fails) console.error('   ' + f);
  console.error('\nEmit buy links with /go/{id} via goHref()/RetailLink; raw URLs live only in retail_links[].\n');
  process.exit(1);
}
console.log('✓ go-links gate: no raw retailer URLs in page content (all routed through /go).');
