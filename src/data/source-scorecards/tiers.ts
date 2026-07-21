// Source-scorecard TIERS — a fast, at-a-glance grouping of products by how well-SOURCED and
// TRANSPARENT they are. Ratified by the owner 2026-07-21.
//
// IMPORTANT framing (compliance): a tier rates how much you can TRUST WHAT'S ON THE LABEL and whether
// there's a documented red flag — NOT whether you should buy the product or whether it works for you.
// A scorecard is about what's in the bottle; efficacy is the separate evidence grade (/r/<remedy>).
// The tier is DERIVED deterministically from the six owner-ratified dimension scores + the displayed
// safety flags, so it introduces no new judgement — the thresholds themselves are the ratified rule.
//
// The rule (first match wins):
//   ⚠️ Heads-up      — any documented red flag: a regulatory deduction (recall/enforcement naming the
//                      product), a marketing deduction (a claim that doesn't hold up), or an added-
//                      ingredient safety flag (vitamin B6). Read this before deciding.
//   ✅ Well-documented — no red flags AND (transparency 5  OR  independently tested, testing ≥ 2).
//   👍 Reasonable      — no red flags AND transparency 4.
//   🤔 Bare-bones      — no red flags AND transparency ≤ 3.
//
// Note: the ingredient-wide safety notes (liver advisory, import "no AU warning", root+leaf) are a
// SEPARATE always-on layer shown on the cards; they do NOT set the tier, because they apply to the
// whole ingredient equally and shouldn't rank one brand above another. Vitamin B6 IS a tier trigger
// because it's an ADDED extra, specific to the product, not inherent to the herb.

export type TierKey = 'well-documented' | 'reasonable' | 'bare-bones' | 'heads-up';

export interface TierMeta {
  key: TierKey;
  label: string;
  icon: string;
  blurb: string;
}

// Display order, best-documented first; "Heads-up" last because it needs a careful read.
export const TIER_ORDER: TierKey[] = ['well-documented', 'reasonable', 'bare-bones', 'heads-up'];

export const TIERS: Record<TierKey, TierMeta> = {
  'well-documented': {
    key: 'well-documented',
    label: 'Well-documented',
    icon: '✅',
    blurb:
      'Names a studied form and tells you its strength, and/or has been independently tested — with no red flags. The most you can verify in this category.',
  },
  reasonable: {
    key: 'reasonable',
    label: 'Reasonable',
    icon: '👍',
    blurb: 'Discloses the basics and has nothing alarming — but no independent lab test of the product.',
  },
  'bare-bones': {
    key: 'bare-bones',
    label: 'Bare-bones',
    icon: '🤔',
    blurb: 'Generic, or doesn’t tell you much — you’re largely trusting the brand.',
  },
  'heads-up': {
    key: 'heads-up',
    label: 'Heads-up',
    icon: '⚠️',
    blurb:
      'A documented red flag worth knowing before you decide — a recall, an added ingredient like vitamin B6, or a claim that doesn’t hold up. Not necessarily "bad", but read the reason.',
  },
};

// Derive a product's tier from its (ratified) six scores + whether it carries a vitamin-B6 flag.
// Accepts any object whose values expose a numeric `score` (all the product types share this shape).
export function computeTier(
  scores: Record<string, { score: number }>,
  hasB6 = false,
): TierKey {
  const flagged =
    scores.regulatory.score < 5 || scores.marketing_honesty.score < 5 || hasB6;
  if (flagged) return 'heads-up';
  if (scores.transparency.score >= 5 || scores.testing_purity.score >= 2) return 'well-documented';
  if (scores.transparency.score === 4) return 'reasonable';
  return 'bare-bones';
}

// Group an array of products into tier buckets (in TIER_ORDER), dropping empty tiers.
// `getB6` lets callers whose product type has a `b6` field opt in.
export function groupByTier<T extends { scores: Record<string, { score: number }> }>(
  products: T[],
  getB6: (p: T) => boolean = () => false,
  sortWithin: (a: T, b: T) => number = () => 0,
): { tier: TierMeta; items: T[] }[] {
  return TIER_ORDER.map((key) => ({
    tier: TIERS[key],
    items: products
      .filter((p) => computeTier(p.scores, getB6(p)) === key)
      .sort(sortWithin),
  })).filter((g) => g.items.length > 0);
}
