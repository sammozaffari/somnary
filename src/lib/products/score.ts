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

/** PLACEHOLDER RULE — `[HUMAN-GATE]`, no owner ruling yet (CHK-Rprod.4 / CLAUDE.md human gates).
 *  "Passes" = at least this many of the four checks. The criteria are almost certainly NOT
 *  equally weighted (dose-match outranks label disclosure), so this threshold is a placeholder
 *  and must be settled editorially before any assessed product content ships (CHK-E8).
 *  ONE definition, here; every consumer imports it — never a second copy. */
export const PASSES_THRESHOLD = 3;

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
 *  Rank: assessed products first, most checks passed first; then label-known; then
 *  not-in-database. Brand A–Z survives ONLY as the documented tiebreak WITHIN equal rank — a
 *  deterministic, non-commercial way to settle ties, not a user-facing sort (the Brand A–Z
 *  control was cut deliberately at every scale). Product name breaks a brand's internal tie so
 *  the order is stable across builds. */
export function listRank(p: Product): number {
  switch (completeness(p)) {
    case 'assessed':
      return checksPassed(p);
    case 'label-known':
      return -1;
    case 'not-in-db':
      return -2;
  }
}

export function byChecksPassed(a: Product, b: Product): number {
  return listRank(b) - listRank(a) || a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name);
}
