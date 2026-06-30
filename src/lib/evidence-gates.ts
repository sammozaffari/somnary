/**
 * Evidence gates — the specific, checkable tests behind every grade (PLAN §3.1; methodology
 * page §3). Single source of truth: the methodology page's gate glossary, the tier rows'
 * typical-gates chips, and every remedy page's evidence chips all read this file. A gate is
 * either met or it isn't — no vibes.
 *
 * variant maps to DESIGN_SYSTEM §2.3 chip variants:
 *   positive → sage tint   ·   caution → tier-c tint   ·   neutral → sunken
 */
export type GateVariant = 'positive' | 'caution' | 'neutral';

export type GateId =
  | 'meta-analysis-exists'
  | 'rct-n100'
  | 'effect-size-reported'
  | 'independent-replication'
  | 'standardized-extract'
  | 'studied-dose-matches-market'
  | 'no-safety-signal'
  | 'effect-size-small'
  | 'heterogeneous-trials'
  | 'unstandardized'
  | 'dose-mismatch'
  | 'safety-signal-present'
  | 'mechanism-only'
  | 'little-no-human-data';

export interface EvidenceGate {
  id: GateId;
  label: string; // exact chip text
  variant: GateVariant;
  meaning: string; // glossary definition (verbatim from methodology §3)
}

export const GATES: readonly EvidenceGate[] = [
  // --- positive ---
  {
    id: 'meta-analysis-exists',
    label: 'meta-analysis exists',
    variant: 'positive',
    meaning:
      'at least one systematic review or meta-analysis has pooled the human trials for this remedy and sleep.',
  },
  {
    id: 'rct-n100',
    label: 'RCT · n≥100',
    variant: 'positive',
    meaning:
      'at least one randomized controlled trial with 100 or more participants tested it for sleep.',
  },
  {
    id: 'effect-size-reported',
    label: 'effect size reported',
    variant: 'positive',
    meaning:
      'the trials report how much it helped (e.g. minutes of sleep-onset latency reduced), not just “significant.”',
  },
  {
    id: 'independent-replication',
    label: 'independent replication',
    variant: 'positive',
    meaning:
      'more than one independent research group found a consistent effect — not a single lab’s result.',
  },
  {
    id: 'standardized-extract',
    label: 'standardized extract',
    variant: 'positive',
    meaning:
      'the studied product quantifies its active constituent (e.g. withanolide %), so the dose is reproducible.',
  },
  {
    id: 'studied-dose-matches-market',
    label: 'studied dose matches market',
    variant: 'positive',
    meaning: 'the dose proven in trials is the dose typically sold — not a fraction of it.',
  },
  {
    id: 'no-safety-signal',
    label: 'no major safety signal',
    variant: 'positive',
    meaning: 'no serious safety concern in the human literature at studied doses.',
  },
  // --- caution ---
  {
    id: 'effect-size-small',
    label: 'effect size small',
    variant: 'caution',
    meaning: 'the benefit is real but modest — worth knowing before you expect much.',
  },
  {
    id: 'heterogeneous-trials',
    label: 'heterogeneous trials',
    variant: 'caution',
    meaning: 'trials disagree or use very different methods, so the picture is muddy.',
  },
  {
    id: 'unstandardized',
    label: 'unstandardized',
    variant: 'caution',
    meaning: 'the active constituent isn’t quantified, so potency varies bottle to bottle.',
  },
  {
    id: 'dose-mismatch',
    label: 'dose mismatch',
    variant: 'caution',
    meaning: 'products commonly sell less (or more) than the dose that was actually studied.',
  },
  {
    id: 'safety-signal-present',
    label: 'safety signal present',
    variant: 'caution',
    meaning:
      'there is a documented safety concern — read the safety section before anything else.',
  },
  // --- neutral ---
  {
    id: 'mechanism-only',
    label: 'mechanism only',
    variant: 'neutral',
    meaning: 'support is biological plausibility or animal/in-vitro work — not human outcomes.',
  },
  {
    id: 'little-no-human-data',
    label: 'little/no human data',
    variant: 'neutral',
    meaning: 'few or no human sleep trials exist for this remedy.',
  },
] as const;

const GATE_INDEX: Record<GateId, EvidenceGate> = Object.fromEntries(
  GATES.map((g) => [g.id, g]),
) as Record<GateId, EvidenceGate>;

export function getGate(id: GateId): EvidenceGate {
  return GATE_INDEX[id];
}
