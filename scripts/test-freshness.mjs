#!/usr/bin/env node
/**
 * Freshness tests (CHK-B17). These matter precisely BECAUSE no live page can exercise them: the
 * whole corpus was reviewed weeks ago, so every page is 'current' and the stale and quarantine
 * branches would sit unexecuted for three years before anyone found out whether they worked.
 * A pure function plus a passed-in clock is what makes them testable today.
 *
 *   node --experimental-strip-types scripts/test-freshness.mjs
 */
import { freshness, freshnessNote, ageInYears, longDate, STALE_YEARS, QUARANTINE_YEARS } from '../src/lib/freshness.ts';

let failed = 0;
const check = (label, cond, detail = '') => {
  console.log(`  ${cond ? '✓' : '✗'} ${label}${cond ? '' : ` — ${detail}`}`);
  if (!cond) failed += 1;
};

const NOW = new Date('2026-08-19T00:00:00Z');
const yearsAgo = (y) => {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - Math.round(y * 365.25));
  return d.toISOString().slice(0, 10);
};

console.log('freshness\n');

check('a page checked last month is current', freshness(yearsAgo(0.1), NOW) === 'current');
check(`just under ${STALE_YEARS} years is still current`, freshness(yearsAgo(STALE_YEARS - 0.05), NOW) === 'current', freshness(yearsAgo(STALE_YEARS - 0.05), NOW));
check(`just over ${STALE_YEARS} years is stale`, freshness(yearsAgo(STALE_YEARS + 0.05), NOW) === 'stale', freshness(yearsAgo(STALE_YEARS + 0.05), NOW));
check(`just under ${QUARANTINE_YEARS} years is still only stale`, freshness(yearsAgo(QUARANTINE_YEARS - 0.05), NOW) === 'stale');
check(`just over ${QUARANTINE_YEARS} years is quarantined`, freshness(yearsAgo(QUARANTINE_YEARS + 0.05), NOW) === 'quarantined');

// the honest-absence cases — a missing date must never read as a fresh one
check('no date returns null, not "current"', freshness(null, NOW) === null);
check('empty string returns null', freshness('', NOW) === null);
check('a malformed date returns null rather than guessing', freshness('July 2026', NOW) === null);
check('an ISO datetime (not a plain date) returns null rather than half-parsing', freshness('2026-07-03T10:00:00Z', NOW) === null);

// the notes
check('current says nothing extra', freshnessNote('current') === null);
check('no-date says nothing extra', freshnessNote(null) === null);
check('stale explains itself', (freshnessNote('stale') ?? '').includes(String(STALE_YEARS)));
check('quarantined says we do not stand behind it', (freshnessNote('quarantined') ?? '').includes("don't stand behind"));

// a future date must not read as ancient
check('a future date is current, not quarantined', freshness('2027-01-01', NOW) === 'current', freshness('2027-01-01', NOW));
check('age is negative for a future date', (ageInYears('2027-01-01', NOW) ?? 0) < 0);

// dates render in the house format, never ISO (RULES.md Identity)
check('longDate renders "3 July 2026"', longDate('2026-07-03') === '3 July 2026', longDate('2026-07-03'));
check('longDate refuses a malformed value rather than inventing one', longDate('03/07/2026') === null);

console.log(failed === 0 ? '\n✓ freshness: all cases pass.' : `\n✖ freshness: ${failed} case(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
