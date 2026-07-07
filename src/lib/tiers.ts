import type { GateId } from './evidence-gates';

/**
 * The S–F tier system (PLAN §3.1; methodology page §2). Single source of truth: the
 * methodology rubric, the tier board, the tier badge, remedy pages, and the search index all
 * read this file. The grade answers one question — how strong is the human evidence that this
 * actually helps you sleep — not effect size, not popularity.
 *
 * `oneLiner` is the verbatim one-line definition shown in the rubric row. `typicalGates`
 * references gate ids in ./evidence-gates (chips render their label from there, never
 * duplicated here). `examples` are plain remedy names (no claims); they link to remedy pages
 * once those exist. Nuances in the §2 table that aren't formal gates ("small/underpowered
 * trials", "no credible human evidence") live in the prose oneLiner, not as chips.
 */
export type TierId = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface Tier {
  id: TierId;
  letter: TierId; // glyph shown in the badge
  name: string; // tier word (lowercase)
  oneLiner: string; // verbatim one-line definition
  decisionTranslation: string; // verbatim "decision translation" line (strategy doc 03) — the plain-language "so what should I do" after the grade
  typicalGates: GateId[]; // ids into evidence-gates.ts
  examples: string[]; // plain remedy names (illustrative)
  emptyNote?: string; // shown when a tier intentionally has no examples (S)
  serious?: boolean; // F → renders with .sev-serious tinted emphasis (DESIGN §2.12/§3.5)
}

export const TIERS: readonly Tier[] = [
  {
    id: 'S',
    letter: 'S',
    name: 'proven',
    oneLiner:
      'multiple large human RCTs and meta-analyses agree on a clinically meaningful sleep benefit, with well-characterized safety.',
    decisionTranslation: 'make this the default pathway before supplements when relevant.',
    typicalGates: [
      'meta-analysis-exists',
      'rct-n100',
      'effect-size-reported',
      'independent-replication',
      'no-safety-signal',
    ],
    examples: [],
    emptyNote:
      'honestly, few if any natural sleep remedies reach S. when none qualify, we say so and leave the tier empty rather than promote something to fill it.',
  },
  {
    id: 'A',
    letter: 'A',
    name: 'strong',
    oneLiner:
      'several RCTs and meta-analytic support; the effect is real even if modest, and safety is good.',
    decisionTranslation: 'reasonable to discuss or consider for the studied use case.',
    typicalGates: ['meta-analysis-exists', 'rct-n100', 'effect-size-reported', 'no-safety-signal'],
    examples: ['melatonin (sleep-onset latency / circadian timing)'],
  },
  {
    id: 'B',
    letter: 'B',
    name: 'viable',
    oneLiner:
      'at least one decent RCT, or several smaller consistent trials. human data is present but thin.',
    decisionTranslation: 'plausible but modest; expectations should be low.',
    typicalGates: ['rct-n100', 'effect-size-reported', 'no-safety-signal'],
    examples: ['magnesium', 'L-theanine', 'tart cherry', 'ashwagandha'],
  },
  {
    id: 'C',
    letter: 'C',
    name: 'mixed',
    oneLiner:
      'interesting mechanism, but human data is small, underpowered, or conflicting. popular beyond what the evidence supports.',
    decisionTranslation: 'interesting but uncertain; do not rely on it.',
    typicalGates: ['heterogeneous-trials', 'no-safety-signal'],
    examples: ['valerian', 'glycine', 'lemon balm'],
  },
  {
    id: 'D',
    letter: 'D',
    name: 'weak',
    oneLiner:
      'minimal human evidence. the claims outrun the data; most support is animal or in-vitro.',
    decisionTranslation: 'claims outrun evidence; avoid spending meaningful money.',
    typicalGates: ['mechanism-only', 'little-no-human-data'],
    examples: ['passionflower', 'most “sleep blend” botanicals'],
  },
  {
    id: 'F',
    letter: 'F',
    name: 'avoid / caution',
    oneLiner:
      'documented safety concerns, or effectively zero rigorous human evidence behind the active claim.',
    decisionTranslation: 'risk, regulatory, or evidence problem is the headline.',
    typicalGates: ['safety-signal-present', 'little-no-human-data'],
    examples: ['kava (hepatotoxicity history)', 'high-dose stacks with interaction risk'],
    serious: true,
  },
] as const;

const TIER_INDEX: Record<TierId, Tier> = Object.fromEntries(
  TIERS.map((t) => [t.id, t]),
) as Record<TierId, Tier>;

export function getTier(id: TierId): Tier {
  return TIER_INDEX[id];
}
