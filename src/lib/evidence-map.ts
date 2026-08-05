import type { TierId } from './tiers';

/**
 * Evidence × Safety map placement (replaces the S–F leaderboard on /tiers).
 *
 * Two CATEGORICAL bands per remedy, derived ONLY from existing, human-authored
 * structured fields — no schema change, no new content, no re-graded tier. The map
 * separates the two questions the single letter conflates: "how sure are we it
 * works?" (evidence, X) and "how risky is it?" (safety, Y). Effect magnitude is NOT
 * an axis — it stays in each remedy's own `oneLineVerdict` on the node.
 *
 * Bands are deliberately discrete (not continuous coordinates): we have no
 * structured effect/confidence numbers, so a scatter would imply false precision.
 */

export type EvidenceBand = 0 | 1 | 2 | 3 | 4; // x0 (weakest) … x4 (strongest)
export type SafetyBand = 0 | 1 | 2; // y0 (general caution) … y2 (serious)

export interface MapPlacement {
  evidenceBand: EvidenceBand;
  safetyBand: SafetyBand;
}

/**
 * X axis — evidence strength, driven ONLY by the human-ratified `tier` (weak→strong).
 * S and A share the strongest band by DESIGN_SYSTEM §3 intent (both live at the green
 * end; the letter disambiguates them, never color). `epistemicState` is shown as a
 * within-band micro-label elsewhere but NEVER moves a remedy up a band — that would
 * round weak evidence up (CLAUDE.md: weak-labeled-weak).
 */
const EVIDENCE_BAND_BY_TIER: Record<TierId, EvidenceBand> = {
  F: 0,
  D: 1,
  C: 2,
  B: 3,
  A: 4,
  S: 4,
};

/** Column captions, weakest → strongest. Index === EvidenceBand. */
export const EVIDENCE_BAND_LABELS = [
  'Little / against it',
  'Weak',
  'Mixed',
  'Viable',
  'Strong / Proven',
] as const;

/** Row captions, safest → riskiest. Index === SafetyBand. */
export const SAFETY_BAND_LABELS = ['General caution', 'Notable interactions', 'Serious caution'] as const;

/**
 * Display threshold: a `caution`-severity remedy with this many drug/condition
 * interactions (or more) is grouped as "notable interactions" (y1) rather than
 * "general caution" (y0). This is a PRESENTATION band computed from the existing
 * `safety.interactions` list — it is not a grade and changes no content. Chosen
 * from the observed 0–5 interaction distribution as the natural break.
 */
export const SAFETY_INTERACTION_THRESHOLD = 3;

/**
 * Place a remedy on the map from existing fields. `serious` severity always wins the
 * Y axis regardless of interaction count (a documented hepatotoxicity history
 * outranks "how many interactions").
 */
export function placeOnMap(input: {
  tier: TierId;
  severity: 'caution' | 'serious';
  interactionCount: number;
}): MapPlacement {
  const evidenceBand = EVIDENCE_BAND_BY_TIER[input.tier];
  let safetyBand: SafetyBand;
  if (input.severity === 'serious') {
    safetyBand = 2;
  } else if (input.interactionCount >= SAFETY_INTERACTION_THRESHOLD) {
    safetyBand = 1;
  } else {
    safetyBand = 0;
  }
  return { evidenceBand, safetyBand };
}
