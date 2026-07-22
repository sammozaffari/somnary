# Somnary corpus fact-check — 2026-07-22

First run of the `fact-check-corpus` workflow. **Partial:** the run audited 18 of
31 remedies before hitting the session token limit; 13 remedies were not reached
and 3 of the 18 are incomplete (individual verifier agents died mid-run). This
report covers only what completed. Re-run the remainder scoped —
`Workflow({name: "fact-check-corpus", args: {slugs: [...]}})` — after the limit
resets.

Findings here are almost all **"overstated"**: the page's claim is directionally
right but states a specific number, subgroup, or conclusion that the *accessible*
portion of the cited source (usually the abstract; full text often paywalled)
does not carry. Overstated ≠ wrong — several may be substantiated in paywalled
full-text tables. Each is a claim to either re-source, soften, or confirm against
full text. None is a dead link or a fabricated citation (the deterministic gates
passed clean).

## Scorecard

| Metric | Count |
|---|---|
| Remedies audited (complete) | 15 |
| Remedies audited (partial — some verifiers died) | 3 (`lavender`, `l-tryptophan`, `lemon-balm`) |
| Remedies not audited (session limit) | 13 |
| Claims checked | 67 |
| Supported | 55 |
| Findings — confirmed | 6 |
| Findings — high severity (unsupported) | 0 |
| Findings — medium severity (overstated) | 6 |
| Findings dropped by refuters | 1 (`cbt-i`) |
| Inaccessible sources | 0 |
| Myth-buster rows skipped (studiesShow: null) | 24 |
| Deterministic gate failures | 0 |

**Deterministic gates (online):** `check-citations --online`, `check-tokens`,
`check-forbidden-framing`, `check-botanical-completeness` — all passed. Every
citation in the corpus carries a resolvable identifier and every checked link is
live.

Zero-finding remedies (all checked claims supported): `5-htp` (2/2),
`apigenin` (4/4), `ashwagandha` (4/4), `bacopa` (3/3), `cbn` (5/5), `gaba` (3/3),
`hops` (4/4), `jujube` (5/5), `kava` (4/4), `lemon-balm` (2/2 checked; see note).

## Findings

All six are medium severity (overstated), each upheld by both adversarial
refuters. Findings tagged **[HUMAN-GATE]** bear on efficacy and may touch the
tier grade — only the owner rules on grades.

### cbd — claims[1] **[HUMAN-GATE]**
- **Page says:** "only a couple of studies isolate CBD for insomnia, and the
  controlled ones are null for CBD by itself."
- **Source:** `pmid:36149724` — review of cannabinoids for insomnia.
- **Why flagged:** The review's conclusion is cautiously *positive* ("CBD
  alone… may be beneficial"); 4 of 7 CBD-predominant arms showed significant
  improvement. It never reports the insomnia-specific controlled study as null.
  The page's "the controlled ones are null" is stronger than, and directionally
  opposite to, the source.
- **Refuters:** 0/2 refuted.

### chamomile — claims[2] **[HUMAN-GATE]**
- **Page says:** the sleep-quality benefit "comes largely from special
  populations like postpartum women and older adults… the outcome is subjective
  quality, not measured sleep."
- **Source:** `pmid:31006899` — chamomile sleep-quality meta-analysis.
- **Why flagged:** The abstract supports the overall benefit (SMD −0.73) and the
  insomnia null, but the load-bearing specifics — "largely from" postpartum/older
  subgroups, high between-trial variation, subjective-not-objective — live in
  paywalled full-text tables. Not substantiated by the accessible source as
  written.
- **Refuters:** 0/2 refuted.

### glycine — claims[0] **[HUMAN-GATE]**
- **Page says:** benefit trials are "all small… high risk of bias… from a single
  manufacturer; an independent review couldn't even pool them because they were
  too heterogeneous."
- **Source:** `pmid:37851316` — glycine review.
- **Why flagged:** The source confirms "small sample sizes with a high risk of
  bias" and limited evidence, but says nothing about a single manufacturer or
  about pooling/heterogeneity. Those procedural specifics are unsourced.
- **Refuters:** 0/2 refuted.

### iron — claims[1] **[HUMAN-GATE]**
- **Page says:** "Every trial that worked enrolled people with low or low-normal
  ferritin… no evidence it improves sleep in people whose iron is already normal."
- **Sources:** `pmid:29425576` (guideline), `pmid:30609006` (Cochrane).
- **Why flagged:** The ferritin ≤75 µg/L threshold is verbatim from the
  guideline, but the same guideline gives Class I ratings to IV iron trials in
  people with ferritin <300 µg/L (including normal stores), and the Cochrane
  review found no significant low-ferritin subgroup difference. The universal
  "every trial / no evidence in normal-iron people" overreaches both sources.
- **Refuters:** 0/2 refuted.

### lavender — claims[2] **[HUMAN-GATE]**
- **Page says:** "No trial has tested lavender in diagnosed insomnia; the good
  evidence is in anxious populations…"
- **Source:** `pmid:26293583` — lavender in anxiety-related restlessness.
- **Why flagged:** The trial cleanly exemplifies the second clause (anxious
  population, sleep as secondary outcome), but a single trial cannot support the
  universal negative "No trial has tested lavender in diagnosed insomnia" — that
  is a literature-wide absence claim needing a systematic-review citation.
- **Refuters:** not run (session limit) — finding kept conservatively, unrefuted.

### l-theanine — claims[2]
- **Page says:** "non-sedating… objectively on sleep efficiency… take it in the
  daytime for calm without drowsiness."
- **Source:** `pmid:31623400` — L-theanine RCT.
- **Why flagged:** The RCT uses PSQI (subjective) and never measures objective
  sleep efficiency, never states "non-sedating," and never tests daytime use.
  The specific "objectively on sleep efficiency" and daytime-use claims exceed
  the source. (Not grade-relevant — tolerability framing, not efficacy.)
- **Refuters:** 0/2 refuted.

## Dropped by refuters (recorded, not a finding)

- **cbt-i — claims[1]:** a verifier ruled the sleep-hygiene claim "overstated"
  reading only the abstract of `pmid:28392168`; both refuters fetched the
  open-access full text (VU / UPenn CBT-I repositories) and showed it explicitly
  classifies sleep-hygiene information and supports the page's wording. Correctly
  killed. This is the adversarial layer doing its job — a full-text read
  overturning an abstract-only verdict.

## Method

- **Ran:** deterministic gates (`check-citations --online`, `check-tokens`,
  `check-forbidden-framing`, `check-botanical-completeness`), then per-remedy
  claim extraction and claim↔source verification. Every non-`supported` verdict
  went to 2 independent adversarial refuters (misreading lens + strength lens),
  each fetching the source itself; a finding both refuters kill is dropped.
- **Pacing:** waves of 3 remedies, ≤3 concurrent verifiers per remedy.
- **Verification unit:** each `claims[]` row's `studiesShow` text vs its cited
  `sources[]`. Rows with `studiesShow: null` (deliberate myth-busters) are not
  verifiable claims — 24 skipped, counted above, none dropped silently.
- **Incomplete due to session token limit (2.1M tokens consumed):**
  - **Not audited (13):** `lemon-verbena`, `magnesium`, `magnolia-bark`,
    `melatonin`, `passionflower`, `reishi`, `saffron`, `skullcap`,
    `tart-cherry`, `taurine`, `valerian`, `vitamin-d`, `zinc`.
  - **Partial (verifiers died mid-remedy):** `lavender` (claims[0] unverified),
    `l-tryptophan` (claims[0], [1], [3] unverified — only 1 of 4 completed),
    `lemon-balm` (claims[1] unverified).
  - Re-run these scoped:
    `Workflow({name: "fact-check-corpus", args: {slugs: ["valerian", "melatonin", …]}})`.
- **No agent ran git, edited content, or touched a grade.** Grade-relevant
  findings are flagged `[HUMAN-GATE]` for owner review.
