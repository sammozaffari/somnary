#!/usr/bin/env node
/**
 * Design-rule gate (audit WF-2) — makes falsifiable a §4 rule the token linter (check-tokens) does
 * NOT cover: radius discipline. Every `border-radius` must come from a radius token
 * (`var(--r-*)`), or be one of the sanctioned non-token shapes — `999px` (pill), `50%` (circle),
 * or `0`. A raw px literal like `border-radius: 24px` is exactly the drift the v4 radius step
 * (4/8/10/12/16) was meant to end, and the token linter's spacing check ignores border-radius.
 *
 *   node scripts/check-design-rules.mjs            → exit 0 clean, exit 1 on any raw-radius literal.
 *   node scripts/check-design-rules.mjs --selftest → asserts a seeded `border-radius: 24px` is caught.
 *
 * Token DEFINITION files legitimately hold literal radii and are exempt (global.css defines --r-*).
 * The codebase is currently fully tokenized (zero literals) — this locks that in going forward.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = 'src';
const EXT = /\.(astro|css)$/;
const EXEMPT = new Set(['src/styles/global.css']); // token definitions live here

// A border-radius value is OK iff every token in it is a var(--…), a keyword, 0, 50%, or 999px.
// Any other explicit px/rem/em length (e.g. 24px, 1rem) is a raw literal → violation.
const RAW_LEN = /(?<![\w-])(\d*\.?\d+)(px|rem|em)(?![\w-])/g;
function violations(value) {
  const bad = [];
  for (const m of value.matchAll(RAW_LEN)) {
    const lit = m[0];
    if (lit === '999px') continue; // sanctioned pill
    bad.push(lit);
  }
  return bad;
}

async function files(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await files(full)));
    else if (EXT.test(e.name)) out.push(full);
  }
  return out;
}

/** Pure scanner over text → [{line, value, bad}] — exposed so --selftest can exercise it. */
function scan(text) {
  const hits = [];
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const m = line.match(/border-radius:\s*([^;{}]+)/);
    if (!m) return;
    const bad = violations(m[1]);
    if (bad.length) hits.push({ line: i + 1, value: m[1].trim(), bad });
  });
  return hits;
}

async function main() {
  if (process.argv.includes('--selftest')) {
    const hits = scan('.x { border-radius: var(--r-md); }\n.y { border-radius: 24px; }\n.z{border-radius:999px}');
    if (hits.length === 1 && hits[0].bad[0] === '24px') {
      console.log('✓ design-rule self-test: seeded raw border-radius literal caught (pill/token allowed).');
      return;
    }
    console.error('✗ design-rule self-test FAILED:', JSON.stringify(hits));
    process.exit(1);
  }

  const all = await files(ROOT);
  const failures = [];
  for (const f of all) {
    const rel = relative('.', f);
    if (EXEMPT.has(rel)) continue;
    for (const h of scan(await readFile(f, 'utf8'))) {
      failures.push(`  • ${rel}:${h.line}  border-radius: ${h.value} — use a radius token var(--r-*) (or 999px/50%), not ${h.bad.join(', ')}`);
    }
  }

  if (failures.length === 0) {
    console.log(`\n✓ design rules: radius discipline holds — every border-radius across ${all.length} file(s) uses a token, 999px, or 50%.\n`);
    return;
  }
  console.error('\n✗ design-rule gate: raw border-radius literals (use var(--r-*)):\n');
  console.error(failures.join('\n'));
  console.error('\n');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
