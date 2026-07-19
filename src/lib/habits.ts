/**
 * Habit summaries (CHK-6.6 content → CHK-6.8a router) — the SINGLE source of truth for the
 * machine-quotable one-liner + evidence-strength label per sleep-habit anchor.
 *
 * Extracted verbatim from the sleep-habits hub so BOTH surfaces read one structure (CLAUDE.md
 * "never duplicate content"): src/pages/sleep-habits.astro renders it, and the guide router
 * (src/lib/guide/router.ts) pulls the exact same summaries into the deterministic habits checklist.
 * No model prose ever touches these — they are cited, compliance-reviewed corpus copy.
 *
 * STABLE ANCHOR CONTRACT (frozen for CHK-6.8 — do NOT rename these ids):
 *   caffeine · alcohol · light · schedule · naps · environment · exercise · hygiene-vs-cbti
 *
 * Erasable TS so the CI runner (scripts/test-guide.mjs) can import it directly.
 */

export interface HabitSummary {
  id: string;
  label: string;
  summary: string;
}

export const HABIT_SUMMARIES: HabitSummary[] = [
  {
    id: 'caffeine',
    label: 'Moderate–strong evidence',
    summary:
      'A controlled trial found a standard caffeine dose disrupted sleep even when taken six hours before bed, so cutting off caffeine well before evening is one of the better-evidenced habits.',
  },
  {
    id: 'alcohol',
    label: 'Moderate evidence',
    summary:
      'Review evidence shows alcohol delays REM sleep and fragments the second half of the night, so a nightcap tends to lighten and break up later sleep rather than deepen it.',
  },
  {
    id: 'light',
    label: 'Mixed: light timing moderate, blue-light gadgets weak',
    summary:
      'Evening light — especially bright, blue-rich screen light — can suppress melatonin and delay sleep, while the evidence that blue-light glasses or filters fix sleep is weak and inconsistent.',
  },
  {
    id: 'schedule',
    label: 'Moderate evidence, largely observational',
    summary:
      'Large cohort data link a more regular sleep–wake schedule to better health outcomes, though most of this evidence is associational rather than proof that fixing your timing causes better sleep.',
  },
  {
    id: 'naps',
    label: 'Mixed / depends on your sleep',
    summary:
      'For good sleepers a short nap is generally fine, but for people with insomnia daytime sleep can erode the sleep drive that helps them sleep at night, which is why CBT-I often limits it.',
  },
  {
    id: 'environment',
    label: 'Weak–moderate evidence',
    summary:
      'A cool, dark, quiet room is reasonable and night noise is measurably disruptive, but direct human trials that a cooler or darker room causes better sleep are thinner than the confident advice implies.',
  },
  {
    id: 'exercise',
    label: 'Moderate evidence, myth-correcting',
    summary:
      'Regular exercise is associated with better sleep quality, and the blanket rule against evening exercise is largely overturned for most people — with vigorous exercise right before bed the main exception.',
  },
  {
    id: 'hygiene-vs-cbti',
    label: 'Candor: hygiene weak as a package; CBT-I is the strong intervention',
    summary:
      'Standalone sleep hygiene is weaker than assumed — it is the control condition CBT-I is measured against and is not recommended as a solo treatment for chronic insomnia — while multicomponent CBT-I is the strongest-graded intervention.',
  },
];

/** id → summary lookup for the router's frozen signal map. */
export const HABIT_SUMMARY_BY_ID: Record<string, HabitSummary> = Object.fromEntries(
  HABIT_SUMMARIES.map((h) => [h.id, h]),
);
