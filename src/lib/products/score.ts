// The product score — "does this bottle deliver what was studied?" (CLAUDE.md signal 3).
// Built at CHK-B6 (first use: the products list); CHK-B7's product page imports the SAME
// definitions. This module is the ONE home for the four checks, the pass threshold and the
// list order — never a second copy anywhere.
//
// RULES.md "The structure — two questions plus a flag, never merged": the ingredient evidence
// bucket, the safety flag and this product score are THREE SEPARATE SIGNALS. Nothing in this
// file reads a bucket or a safety flag, and nothing here may ever be combined with one.

import type { CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>['data'];

/** The four product-score checks, in fixed order. `short` is the in-place label the row's
 *  2×2 dot grid renders; `label` is the full sentence (used as the accessible name and by the
 *  product page's working-shown breakdown). Transcribed from the bundle kit
 *  (components/verdicts/ProductScoreBadge.jsx CRITERIA). */
export const CRITERIA = [
  { key: 'dose', short: 'Dose', label: 'Dose matches what studies used' },
  { key: 'tested', short: 'Tested', label: 'Independently tested by a third party' },
  { key: 'disclosed', short: 'Full label', label: 'Label discloses everything' },
  { key: 'form', short: 'Studied form', label: 'The form that was actually studied' },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]['key'];

/* ══ THE PRODUCT VERDICT — owner-ratified 17 August 2026, closing CHK-Rprod.4 ══════════════
 *
 * There is NO weighting and NO threshold. A threshold was the wrong shape for this question:
 * "at least N of 4" lets a bottle with the WRONG DOSE be called worth buying on the strength of
 * three bookkeeping checks, which is precisely the case the rule exists to get right.
 *
 * The four checks are not four instances of one thing. They divide into two kinds:
 *   · THE CORE PAIR — dose-match and studied-form — are claims about what the bottle IS.
 *     A bottle that fails either one is not the thing the studies tested, and no amount of
 *     paperwork changes that.
 *   · THE TRUST PAIR — independent testing and label disclosure — are claims about whether we
 *     can BELIEVE what the bottle says about itself. Failing these does not make it the wrong
 *     product; it makes it an unverified one.
 * Conflating the two is what a count does, and why a count cannot answer this.
 *
 * So the verdict is three-valued and DERIVED — never a score, never a number, and never merged
 * with the ingredient's evidence bucket or its safety flag (RULES.md "never merged": these are
 * three separate signals and this function reads exactly one of them).
 *
 * The plain-language explanation of this rule belongs on /how-we-grade (CHK-B13).
 * ═══════════════════════════════════════════════════════════════════════════════════════════ */

/** The core pair: what the bottle IS. Failing either is fatal to the verdict, alone. */
const CORE: CriterionKey[] = ['dose', 'form'];
/** The trust pair: whether we can believe what it says about itself. */
const TRUST: CriterionKey[] = ['tested', 'disclosed'];

export type VerdictKey = 'delivers' | 'unverified' | 'falls-short';

/** Each verdict's PERMANENT sentence (the product page renders this in full) and the compressed
 *  label the list row's pill carries. The pill is a compression of the sentence, never a
 *  different claim; the full sentence also rides in the row's visually-hidden text so a screen
 *  reader gets the whole verdict, not the abbreviation. */
export const VERDICTS: Record<VerdictKey, { sentence: string; pill: string }> = {
  delivers: {
    sentence: 'This bottle gives you what was studied.',
    pill: 'Delivers what was studied',
  },
  unverified: {
    sentence: "Matches what was studied — but we can't fully verify it.",
    pill: 'Matches, but unverified',
  },
  'falls-short': {
    sentence: "This bottle doesn't give you what was studied.",
    pill: 'Not what was studied',
  },
};

/**
 * The ruled verdict. Returns `null` when the checks are not all resolved — an unassessed product
 * gets NO verdict sentence at all, never a provisional or hedged one (CLAUDE.md: report, don't
 * guess). Order matters: the core failure is tested FIRST and short-circuits, so a bottle with a
 * dose mismatch is "doesn't give you what was studied" no matter how many other checks it passes.
 */
export function verdictState(p: Product): VerdictKey | null {
  const v = checkValues(p);
  if (CRITERIA.some((c) => v[c.key] === null)) return null; // not assessed → no verdict
  if (CORE.some((k) => v[k] === false)) return 'falls-short'; // fatal alone, regardless of the rest
  if (TRUST.some((k) => v[k] === false)) return 'unverified'; // the right thing, unverified
  return 'delivers';
}

/** The three completeness states a product row renders in (CLAUDE.md `assessment_state`).
 *  'not-in-db' can never come from this collection — a product we hold no record of has no
 *  entry to render. It exists here because the row is shared with the surfaces that CAN
 *  produce it (search's not-in-database result, CHK-B14; the product page's own miss state),
 *  and because a state the row silently cannot express is a state that drifts. */
export type Completeness = 'assessed' | 'label-known' | 'not-in-db';

export function completeness(p: Product): Completeness {
  if (p.assessment_state === 'fully assessed') return 'assessed';
  if (p.assessment_state === 'not in database') return 'not-in-db';
  return 'label-known';
}

/** The four checks resolved to true / false / null for one product.
 *  NEVER-GUESS RULE (CLAUDE.md "report, don't guess"): `null` means we have not assessed it,
 *  and is rendered as such — it is never collapsed into `false`. `third_party_tested` is an
 *  object-or-null on the schema: an absent organisation on an ASSESSED product is a real "no"
 *  (not third-party tested is an answer), but on an unassessed product it is still unknown. */
export function checkValues(p: Product): Record<CriterionKey, boolean | null> {
  const assessed = completeness(p) === 'assessed';
  return {
    dose: p.dose_match,
    tested: p.third_party_tested ? true : assessed ? false : null,
    disclosed: p.label_discloses_all,
    form: p.form_matches_studied,
  };
}

/** How many of the four this bottle passes. Only meaningful for an assessed product. */
export function checksPassed(p: Product): number {
  const v = checkValues(p);
  return CRITERIA.filter((c) => v[c.key] === true).length;
}

/** RULES.md Interface economy: "No sort controls; checks-passed is the fixed order." The order
 *  is set by our own published criteria and NEVER by anything commercial — no price, no
 *  retailer, no brand relationship is read here or anywhere in this file.
 *
 *  ORDER FOLLOWS THE VERDICT, THEN THE COUNT — a derived consequence of the Rprod.4 ruling,
 *  FLAGGED FOR OWNER CONFIRMATION. RULES.md wrote "checks-passed is the fixed order" when the
 *  verdict WAS a count. It no longer is, and ordering on the raw count re-introduces the exact
 *  error the ruling removes. The forcing case is real, not hypothetical:
 *    · a bottle passing the core pair but neither trust check → 2 checks, verdict `unverified`
 *    · a bottle failing dose-match but passing the other three → 3 checks, verdict `falls-short`
 *  A pure count puts the second ABOVE the first, so the page would list "Not what was studied"
 *  above "Matches, but unverified" — ordering against its own published rule. Verdict first,
 *  then checks-passed WITHIN a verdict (so RULES.md's rule survives as the within-group order),
 *  then the documented brand A–Z tiebreak. If the owner prefers the literal count order, this
 *  comparator is the single place to change it.
 *
 *  Rank: assessed products by verdict (delivers → unverified → falls-short); then label-known;
 *  then not-in-database. Brand A–Z survives ONLY as the tiebreak WITHIN equal rank — a
 *  deterministic, non-commercial way to settle ties, not a user-facing sort (the Brand A–Z
 *  control was cut deliberately at every scale). Product name breaks a brand's internal tie so
 *  the order is stable across builds. */
const VERDICT_RANK: Record<VerdictKey, number> = {
  delivers: 3,
  unverified: 2,
  'falls-short': 1,
};

export function listRank(p: Product): number {
  switch (completeness(p)) {
    case 'assessed': {
      const v = verdictState(p);
      return v ? VERDICT_RANK[v] : 0; // assessed-but-unresolved sorts below every real verdict
    }
    case 'label-known':
      return -1;
    case 'not-in-db':
      return -2;
  }
}

export function byChecksPassed(a: Product, b: Product): number {
  return (
    listRank(b) - listRank(a) ||
    checksPassed(b) - checksPassed(a) || // RULES.md's checks-passed order, WITHIN a verdict
    a.brand.localeCompare(b.brand) ||
    a.name.localeCompare(b.name)
  );
}
