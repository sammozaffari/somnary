// Problem-page definitions (CHK-B12). Situations people arrive with, and the non-supplement
// findings that belong beside them.
//
// PROVENANCE AND THE REVIEW BAR. The findings below came from the CHK-E0 salvage store, which
// extracted them verbatim from the retiring `sleep-habits` page before deletion. The salvage
// README is explicit that its contents are DRAFTS "until the consuming session takes each claim
// through review". This is that session, and each claim below was re-verified against the
// paper's own abstract via the NCBI E-utilities API on 19 August 2026 — resolved, title matched,
// and the wording checked against what the abstract actually states.
//
// TWO THINGS WERE CUT IN THAT REVIEW, and they are the reason the bar is worth having:
//  · the night-noise item carried "+10 dB ≈ 2.5× odds of high sleep disturbance". That figure is
//    not in the abstract, so only the qualitative finding is published here.
//  · the exercise item (PMID 25596964) could not be confirmed from its abstract in this pass, so
//    it is NOT published. It stays a salvage draft for CHK-E7.
// Nothing may be added to this file that has not been through the same check.
//
// These are NOT health advice and none of them is framed as a recommendation: each states what a
// study found and what it does not show, which is the same bar the remedy corpus is held to.

export interface Finding {
  /** what it is about, in the reader's words */
  topic: string;
  /** what the paper found — plain language, no technical vocabulary (RULES.md Language) */
  found: string;
  /** the anti-hype beat: what it does NOT show. Mandatory, same as the corpus. */
  notShown: string;
  pmid: string;
  /** journal · year, for the citation chip */
  cite: string;
  year: number;
  /** plain study-type words (RULES.md: "trial" / "review of several studies" / "observational study") */
  kind: string;
}

export interface Problem {
  slug: string;
  /** the situation in the first person, as someone would say it */
  title: string;
  /** what the page is, in one sentence */
  intro: string;
  /** the outcome tag this problem maps to in the remedy corpus — used to order remedies */
  outcome: string;
  /** when this particular situation is a reason to see someone, phrased as routing not diagnosis */
  seeSomeone: string;
  findings: Finding[];
}

export const PROBLEMS: Problem[] = [
  {
    slug: 'cant-fall-asleep',
    title: "I can't fall asleep",
    intro:
      "Lying awake at the start of the night is the most common reason people go looking for a sleep remedy. Before the supplements, two ordinary things have better evidence behind them than most of what's on the shelf.",
    outcome: 'fall asleep faster',
    seeSomeone:
      "If this has been going on most nights for months, a doctor is the right next step — long-running insomnia has treatments that work better than anything you can buy, and they aren't supplements.",
    findings: [
      {
        topic: 'Caffeine, much earlier than you think',
        found:
          'In a controlled trial, a 400 mg dose of caffeine — roughly two to three strong coffees — disrupted sleep even when it was taken six hours before bed. Taken at bedtime, three hours before, or six hours before, all three significantly disturbed sleep compared with a dummy pill.',
        notShown:
          "It doesn't set a personal cut-off time. That was one fixed dose in a modest number of people, and how fast you clear caffeine varies a lot from person to person. Six hours is what the study found, not a rule for you.",
        pmid: '24235903',
        cite: 'Journal of Clinical Sleep Medicine, 2013',
        year: 2013,
        kind: 'trial',
      },
      {
        topic: 'Light in the evening',
        found:
          'People reading on a backlit screen before bed took longer to fall asleep, produced less melatonin, had their body clock shift later, and were less alert the next morning than when they read a printed book. Ordinary room lighting does it too: light before bedtime delayed the start of melatonin in 99% of people tested and shortened it by about 90 minutes.',
        notShown:
          "Neither study tested whether dimming your lights fixes insomnia — they measured what light does to the body clock, not whether changing it cures a sleep problem. And blue-light filtering glasses are a separate question with much weaker evidence.",
        pmid: '25535358',
        cite: 'Proceedings of the National Academy of Sciences, 2015',
        year: 2015,
        kind: 'trial',
      },
    ],
  },
  {
    slug: 'waking-in-the-night',
    title: 'I keep waking in the night',
    intro:
      'Falling asleep fine and then surfacing at two or three in the morning is a different problem from not getting off to sleep, and it has different causes. Two of the most common ones are things you can check tonight.',
    outcome: 'stay asleep',
    seeSomeone:
      "Waking with a gasp, a snort, or a racing heart — or being told you stop breathing in your sleep — is worth a doctor's appointment rather than a supplement. So is waking every night alongside a new medication.",
    findings: [
      {
        topic: 'Alcohol, and the second half of the night',
        found:
          'A review of the studies on alcohol and normal sleep found the same pattern at every dose: you fall asleep faster and the first half of the night is more settled, but the second half is disrupted, and the first stretch of dreaming sleep is pushed back.',
        notShown:
          "It's a review of healthy volunteers, not people with insomnia, and it doesn't say what a single drink does to you specifically. It also isn't a claim that alcohol causes long-term sleep problems — only what it does to a night's sleep.",
        pmid: '23347102',
        cite: 'Alcoholism: Clinical and Experimental Research, 2013',
        year: 2013,
        kind: 'review of several studies',
      },
      {
        topic: 'Night-time noise',
        found:
          'A World Health Organization review of environmental noise and sleep found that traffic noise at night — road, rail and aircraft — raises the chance of being badly sleep-disturbed, with the risk climbing as the noise gets louder.',
        notShown:
          "It measures how disturbed people report being at a given noise level, not whether earplugs or glazing fix it. It's also about outdoor noise levels across populations, which may not describe your bedroom.",
        pmid: '35857401',
        cite: 'Environmental Health Perspectives, 2022',
        year: 2022,
        kind: 'review of several studies',
      },
    ],
  },
  {
    slug: 'cant-switch-off',
    title: "I can't switch my head off",
    intro:
      "A mind that speeds up the moment the light goes off is its own kind of sleeplessness. Most of what's sold for it is aimed at sedation; the thing with the strongest evidence behind it isn't sold at all.",
    outcome: 'wind down before bed',
    seeSomeone:
      "If the racing thoughts are worry you can't put down, or they're there in the daytime too, that's worth raising with a doctor. It's a common and treatable thing, and a supplement is not the treatment for it.",
    findings: [
      {
        topic: 'Going to bed and getting up at consistent times',
        found:
          'In a large study following people over time, how regular someone’s sleep was predicted their risk of dying more strongly than how long they slept. Regularity did more work than duration.',
        notShown:
          "This is a study that watched what people already did, not one that changed anything — so it shows regularity and outcomes travel together, not that making your sleep more regular causes the benefit. And it says nothing about whether a regular schedule quiets a racing mind.",
        pmid: '37738616',
        cite: 'Sleep, 2024',
        year: 2024,
        kind: 'observational study',
      },
    ],
  },
];

export const problemBySlug = (slug: string) => PROBLEMS.find((p) => p.slug === slug);
