/**
 * Outcome taxonomy — CHK-5.2 (PLAN §2.3). The standardized goal-first entry set, and the single
 * source of truth mapping each outcome to the remedies with evidence for it. Ranking on the outcome
 * page is BY EVIDENCE (the remedy's own tier), never by anecdote — this file only lists which
 * remedies are *relevant* to each goal; the page sorts them by grade.
 *
 * A remedy appears under an outcome only if it has real (even if weak) human evidence pointing at
 * that specific goal — e.g. l-tryptophan under "stay asleep" (its meta-analytic effect was on wake
 * after sleep onset, not latency). cbd is deliberately absent everywhere: its controlled evidence is
 * null, so it isn't recommended for any goal. kava appears under anxiety only, and its F badge +
 * verdict carry the hepatotoxicity warning with it.
 */
export interface Outcome {
  id: string;
  title: string;
  dek: string; // one line, goal-first
  measuring: string; // "what we're measuring" definition
  remedies: string[]; // relevant remedy slugs; the page ranks these by tier
}

export const OUTCOMES: readonly Outcome[] = [
  {
    id: 'fall-asleep-faster',
    title: 'fall asleep faster',
    dek: 'cut the time it takes to drop off',
    measuring:
      'sleep-onset latency — how long it takes to fall asleep once the lights are out. the remedies here have human evidence aimed at that specific measure.',
    remedies: [
      'melatonin',
      'magnesium',
      'ashwagandha',
      'valerian',
      'tart-cherry',
      'gaba',
      'glycine',
      'hops',
      'passionflower',
    ],
  },
  {
    id: 'stay-asleep',
    title: 'stay asleep',
    dek: 'reduce waking through the night',
    measuring:
      'wake after sleep onset — time spent awake once you have already fallen asleep. fewer remedies target this than target falling asleep.',
    remedies: ['ashwagandha', 'l-tryptophan', 'tart-cherry', 'valerian'],
  },
  {
    id: 'sleep-quality',
    title: 'better sleep quality',
    dek: 'how rested and satisfied your sleep feels overall',
    measuring:
      'subjective sleep quality, usually the Pittsburgh Sleep Quality Index (PSQI). a softer, self-reported measure — real, but easier to move with expectation than the objective ones.',
    remedies: [
      'ashwagandha',
      'l-theanine',
      'magnesium',
      'chamomile',
      'lemon-balm',
      'lavender',
      'valerian',
      'tart-cherry',
      'skullcap',
    ],
  },
  {
    id: 'anxiety-driven-insomnia',
    title: 'anxiety-driven insomnia',
    dek: 'when a racing, anxious mind is what keeps you up',
    measuring:
      'sleep trouble that is secondary to anxiety — so the calming evidence matters as much as the sleep evidence. several of these are proven anxiolytics whose sleep benefit rides on the calm.',
    remedies: [
      'ashwagandha',
      'l-theanine',
      'lavender',
      'lemon-balm',
      'chamomile',
      'passionflower',
      'magnolia-bark',
      'gaba',
      'kava',
    ],
  },
  {
    id: 'jet-lag-shift-work',
    title: 'jet lag & shift work',
    dek: 'resetting a body clock that is out of sync with the day',
    measuring:
      'circadian timing — shifting *when* you feel sleepy, not just sedating you. this is where the evidence is most concentrated in one remedy.',
    remedies: ['melatonin', 'tart-cherry'],
  },
  {
    id: 'next-day-grogginess',
    title: 'avoiding next-day grogginess',
    dek: 'sleep help that does not leave you foggy the next morning',
    measuring:
      'next-day alertness and function — which options are least likely to leave a sedative "hangover". a short list, and honest about it.',
    remedies: ['l-theanine', 'melatonin', 'glycine'],
  },
  {
    id: 'vivid-dreams-rem',
    title: 'vivid dreams & REM',
    dek: 'remedies that noticeably affect dreaming or REM sleep',
    measuring:
      'effects on dream intensity and REM sleep — sometimes a wanted effect, often an unwanted side effect worth knowing about before you take something.',
    remedies: ['melatonin', '5-htp'],
  },
] as const;

export function getOutcome(id: string): Outcome | undefined {
  return OUTCOMES.find((o) => o.id === id);
}
