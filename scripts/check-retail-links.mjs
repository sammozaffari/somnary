#!/usr/bin/env node
/**
 * Retail-link checker. Every `retail_links[].url` is a promise to a reader that a button will
 * take them somewhere real; a dead one wastes their time at the exact moment they decided to act.
 *
 * WHY THIS EXISTS: on 20 August 2026 **all 37 Chemist Warehouse links were dead at once** — the
 * retailer changed its URL scheme and every `/buy/{id}` became a 404. Nothing noticed, because
 * nothing was watching. Links rot silently; that is their nature. This watches.
 *
 * THE 403 TRAP, and why this script does not treat 403 as dead:
 * iHerb answers a scripted request with **403 Forbidden** while the page is perfectly alive in a
 * browser — it is bot protection, not a missing product. A checker that calls 403 "dead" would
 * have deleted 32 healthy links. So:
 *   · 2xx / 3xx        → alive
 *   · 403 / 429        → BLOCKED, reported, never failed on (bot protection)
 *   · 404 / 410        → DEAD, fails the run
 *   · timeout / DNS    → reported as unreachable, never failed on (could be the network here)
 * Anything ambiguous is reported for a human to open in a real browser, never auto-deleted.
 *
 * Networked, so it is NOT wired into the build or the pre-commit hook — a build must not depend
 * on a retailer being up. Run it deliberately:
 *
 *   node scripts/check-retail-links.mjs            # check every link
 *   node scripts/check-retail-links.mjs --retailer amazon
 */
import { readdir, readFile } from 'node:fs/promises';

const DIR = 'src/content/products';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const only = process.argv.includes('--retailer')
  ? process.argv[process.argv.indexOf('--retailer') + 1]
  : null;

const links = [];
for (const f of (await readdir(DIR)).filter((f) => f.endsWith('.json'))) {
  const p = JSON.parse(await readFile(`${DIR}/${f}`, 'utf8'));
  for (const l of p.retail_links ?? []) {
    if (only && l.retailer !== only) continue;
    links.push({ product: p.id, retailer: l.retailer, url: l.url });
  }
}

if (links.length === 0) {
  console.log('retail-link check: no links to check.');
  process.exit(0);
}
console.log(`retail-link check · ${links.length} link(s)\n`);

const check = async (l) => {
  try {
    const res = await fetch(l.url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html' },
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 403 || res.status === 429) return { ...l, state: 'blocked', code: res.status };
    if (res.status === 404 || res.status === 410) return { ...l, state: 'dead', code: res.status };
    if (res.ok) return { ...l, state: 'alive', code: res.status };
    return { ...l, state: 'odd', code: res.status };
  } catch (e) {
    return { ...l, state: 'unreachable', code: e?.name ?? 'error' };
  }
};

// modest concurrency — this is someone else's server
const results = [];
const queue = [...links];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let l = queue.shift(); l; l = queue.shift()) results.push(await check(l));
  })
);

const by = (s) => results.filter((r) => r.state === s);
const tally = {};
for (const r of results) tally[r.retailer] = tally[r.retailer] ?? { alive: 0, dead: 0, blocked: 0, other: 0 };
for (const r of results) {
  const t = tally[r.retailer];
  if (r.state === 'alive') t.alive += 1;
  else if (r.state === 'dead') t.dead += 1;
  else if (r.state === 'blocked') t.blocked += 1;
  else t.other += 1;
}
for (const [retailer, t] of Object.entries(tally))
  console.log(`  ${retailer.padEnd(18)} ${t.alive} alive · ${t.dead} dead · ${t.blocked} bot-blocked · ${t.other} other`);

const dead = by('dead');
if (dead.length) {
  console.error(`\n✖ ${dead.length} DEAD link(s) — a reader clicking these lands on a 404:`);
  for (const r of dead) console.error(`   ${r.product}  ${r.code}  ${r.url}`);
  console.error('\nOpen one in a real browser to confirm, then fix or remove it. Do not guess a');
  console.error('replacement URL: linking to the wrong product is worse than linking to none —');
  console.error('the product page has an honest "no retailer on record" state for exactly this.');
  process.exit(1);
}

const odd = [...by('blocked'), ...by('unreachable'), ...by('odd')];
if (odd.length) {
  console.log(`\n  ${odd.length} link(s) could not be confirmed from a script (bot protection or network).`);
  console.log('  These are NOT failures. Spot-check them in a real browser if you want certainty.');
}
console.log('\n✓ retail-link check: no dead links.');
