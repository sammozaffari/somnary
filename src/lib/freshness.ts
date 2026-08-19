// Freshness (CHK-B17). How old a page's last check is, and what to say about it.
//
// The rule (rebuild plan / REDESIGN Step 15): a page flagged at THREE YEARS, quarantined at SIX.
// The point is not decoration — research moves and formulations change, so a page that hasn't
// been looked at in years is making a claim about the present using evidence from the past. The
// honest response is to SAY SO on the page rather than let the date sit in small print and hope
// the reader does the arithmetic.
//
// TIME IS AN INPUT, NOT AN AMBIENT FACT. `now` is passed in so this is a pure function: a build
// is reproducible, and the thresholds are testable without mocking the clock.

export type Freshness = 'current' | 'stale' | 'quarantined';

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
export const STALE_YEARS = 3;
export const QUARANTINE_YEARS = 6;

export function ageInYears(checked: string, now: Date): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checked)) return null;
  const then = new Date(checked + 'T00:00:00Z').getTime();
  if (Number.isNaN(then)) return null;
  return (now.getTime() - then) / YEAR_MS;
}

export function freshness(checked: string | null | undefined, now: Date): Freshness | null {
  if (!checked) return null; // no date held — the page says that, rather than implying freshness
  const age = ageInYears(checked, now);
  if (age === null) return null;
  if (age >= QUARANTINE_YEARS) return 'quarantined';
  if (age >= STALE_YEARS) return 'stale';
  return 'current';
}

/** The sentence a reader sees. Plain, specific, and never alarming for its own sake. */
export function freshnessNote(state: Freshness | null): string | null {
  switch (state) {
    case 'stale':
      return `We haven't re-checked this page in over ${STALE_YEARS} years. The research may have moved since — treat it as a starting point and check the date on anything that matters.`;
    case 'quarantined':
      return `This page hasn't been re-checked in over ${QUARANTINE_YEARS} years. That's long enough that we don't stand behind it as current, and it's queued for review.`;
    default:
      return null; // 'current' and "no date held" both say nothing extra
  }
}

/** Dates render "14 July 2026" everywhere user-facing (RULES.md Identity) — never ISO. */
export function longDate(iso: string | null | undefined): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
