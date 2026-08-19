// Remedy-page derivations (CHK-B5). RULES.md Evidence display: the nested bar renders from
// `sources[]` counts ONLY — cited ⊇ measured a sleep outcome ⊇ published results we could verify.
// EMPTINESS IS DERIVED FROM THE DATA, never hardcoded per remedy (the bundle's deriveEmpty rule).
import type { CollectionEntry } from 'astro:content';

type Source = CollectionEntry<'remedies'>['data']['sources'][number];
type Safety = CollectionEntry<'remedies'>['data']['safety'];

export interface StudyCounts {
  cited: number;
  sleep: number;
  verifiable: number;
  helped: number | null;
  // triaged = every source has an adjudicated measuresSleepOutcome. NEVER-INVENT RULE at render
  // time (its render-time form — it has now caught two bugs, the remedy page + the browse thumb):
  //   sleep=0 means adjudicated-zero; null means still checking; NEVER render the second as the first.
  // Until the whole corpus is triaged (CHK-E2), a remedy with any `null` cannot honestly show a
  // "measured sleep" count — counting only the known-true ones would UNDERCOUNT and quietly invent a
  // lower number. So callers must gate on `triaged`: draw the bar/caption only when true, else state
  // "still checking" and draw NO bar. The unknown is shown as unknown (same discipline as a null bucket).
  triaged: boolean;
}

export function studyCounts(sources: Source[]): StudyCounts {
  const cited = sources.length;
  const triaged = sources.every((s) => s.measuresSleepOutcome === true || s.measuresSleepOutcome === false);
  const sleepSources = sources.filter((s) => s.measuresSleepOutcome === true);
  const sleep = sleepSources.length;
  const verifiableSources = sleepSources.filter((s) => s.effectDataStatus === 'complete');
  const verifiable = verifiableSources.length;
  // direction is honest only when EVERY verifiable source has a recorded direction
  const allHaveDir = verifiable > 0 && verifiableSources.every((s) => s.effectDirection != null);
  const helped = allHaveDir ? verifiableSources.filter((s) => s.effectDirection === 'helped').length : null;
  return { cited, sleep, verifiable, helped, triaged };
}

export interface SafetyInfo {
  serious: boolean;
  level: 'caution' | 'serious';
  lead: string;
}
export function safetyInfo(safety: Safety): SafetyInfo {
  return { serious: safety.severity === 'serious', level: safety.severity, lead: safety.lead };
}

// The three source groups the "research" section lists (RULES.md: papers never disappear —
// grouped, not hidden). Plain study-type words come from the schema `type` via typeWords().
export function groupSources(sources: Source[]) {
  const verified = sources.filter((s) => s.measuresSleepOutcome === true && s.effectDataStatus === 'complete');
  const measuredOnly = sources.filter((s) => s.measuresSleepOutcome === true && s.effectDataStatus !== 'complete');
  const didntMeasure = sources.filter((s) => s.measuresSleepOutcome === false);
  const untriaged = sources.filter((s) => s.measuresSleepOutcome === null || s.measuresSleepOutcome === undefined);
  return { verified, measuredOnly, didntMeasure, untriaged };
}

// Plain study-type words — RULES.md: "trial" / "review of several studies" / "observational
// study", never "RCT" or "cohort" in the interface.
const TYPE_WORDS: Record<string, string> = {
  'meta-analysis': 'review of several studies',
  'systematic-review': 'review of several studies',
  review: 'review of several studies',
  rct: 'trial',
  guideline: 'clinical guideline',
  cohort: 'observational study',
  'case-series': 'observational study',
  registry: 'trial registry entry',
  animal: 'animal study',
  'in-vitro': 'lab study',
  other: 'study',
};
export const typeWords = (t: string): string => TYPE_WORDS[t] ?? 'study';


/**
 * The PLAIN-LANGUAGE line for a study, built from the structured fields (CHK-conformance).
 *
 * RULES.md Language is explicit: technical vocabulary — meta-analysis, randomised controlled
 * trial, placebo-controlled, effect size, sleep-onset latency — lives ONLY inside the "see the
 * study" popover and the how-we-grade page. The remedy page was rendering the source's `finding`
 * field as body copy, and `finding` is written in exactly that register ("Pooled randomized
 * trials: melatonin reduced sleep-onset latency by ~7 minutes"). That put research vocabulary on
 * 17 remedy pages and duplicated the popover's own text directly above it.
 *
 * So body copy is composed here from the structured fields, in everyday words, and `finding`
 * stays where the charter puts it: one tap deeper. Nothing is invented — every part is a field
 * that was editorially entered, and a field we don't hold is simply left out of the sentence.
 */
export function plainFinding(s: Source, remedyName: string): string {
  const kind = typeWords(s.type);
  const article = /^[aeiou]/i.test(kind) ? 'An' : 'A';
  const people = s.sampleSize ? ` in ${s.sampleSize.toLocaleString()} people` : '';

  // `effectSize` is the plain magnitude, entered by hand off the paper — always preferred.
  if (s.effectSize) return `${article} ${kind}${people} found people ${s.effectSize}.`;

  // No magnitude recorded: say the direction, which is still a real finding, and no more.
  switch (s.effectDirection) {
    case 'helped':
      return `${article} ${kind}${people} found ${remedyName.toLowerCase()} helped, though we don't have a plain figure for how much.`;
    case 'no-clear-effect':
      return `${article} ${kind}${people} found no clear effect on sleep.`;
    case 'didnt-help':
      return `${article} ${kind}${people} found it didn't help sleep.`;
    default:
      return `${article} ${kind}${people} measured sleep; we haven't recorded what it found in plain terms yet.`;
  }
}
