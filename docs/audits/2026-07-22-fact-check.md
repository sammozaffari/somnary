# Somnary corpus fact-check — 2026-07-22

Full-corpus run of the `fact-check-corpus` workflow — all 31 remedies audited. Completed across four scoped batches (18 + 6 + 6 + 4 remedies, run sequentially to stay under the session token limit that truncated the first attempt). Supersedes the earlier partial version of this report.

**Deterministic gates passed clean:** `check-citations --online`, `check-tokens`, `check-forbidden-framing`, `check-botanical-completeness` — every citation in the corpus carries a resolvable identifier and every checked link is live. No fabricated or dead citations.

**How to read a finding.** Most are **"overstated"**: the page's claim is directionally right but states a specific number, subgroup, or conclusion the *accessible* portion of the cited source (usually the abstract; full text often paywalled) does not carry. Overstated is not the same as wrong — several may be substantiated in paywalled full text. A smaller set is **"unsupported" (high severity)**: the accessible source is silent on, or directly contradicts, the claim. Two of these (tart cherry) are notable because the page is *under*-stating what its own cited source shows. Each is a claim to re-source, re-word, or confirm against full text — not an instruction to change a grade, which stays `[HUMAN-GATE]`.

## Scorecard

| Metric | Count |
|---|---|
| Remedies audited | 31 / 31 |
| Claims checked | 124 |
| Supported | 100 |
| Findings — high severity (unsupported) | 3 |
| Findings — medium severity (overstated) | 13 |
| — of which confirmed / contested | 13 / 3 |
| Findings dropped by refuters | 4 |
| Inaccessible sources (reCAPTCHA / paywall) | 4 |
| Myth-buster rows (studiesShow: null, not verifiable claims) | 33 |
| Deterministic gate failures | 0 |

Findings tagged **[HUMAN-GATE]** bear on efficacy and may touch the tier grade — only the owner rules on grades.

## Findings (16)

### Melatonin — claims[3] · unsupported (high) **[HUMAN-GATE]**
- **Page says:** "Trials find the benefit at low doses (often 0.5–5 mg); taking more has not been shown to work better, and larger doses mainly raise the odds of next-day grogginess."
- **Claim addressed (myth):** Take 5 or 10 mg, because more melatonin works better.
- **Source(s):** `pmid:23691095` — Meta-analysis: melatonin for the treatment of primary sleep disorders; `pmid:28648359` — Evidence for the efficacy of melatonin in the treatment of primary adult sleep disorders
- **Why flagged:** The assertion claims higher melatonin doses have not been shown to work better, but pmid:23691095 states the opposite: "Trials with longer duration and using higher doses of melatonin demonstrated greater effects on decreasing sleep latency and increasing total sleep time." Neither source mentions a 0.5–5 mg benefit range or next-day grogginess, and pmid:28648359 addresses no dose-response or side-effect claim at all.
- **Source quote:** "Trials with longer duration and using higher doses of melatonin demonstrated greater effects on decreasing sleep latency and increasing total sleep time."
- **Refuters:** 0/2 refuted

### Tart cherry — claims[0] · unsupported (high) **[HUMAN-GATE]**
- **Page says:** "The one meta-analysis that pooled the trials found no significant effect on sleep efficiency or total sleep time. The individual positive studies were small and didn't survive pooling."
- **Claim addressed (myth):** Tart cherry juice is clinically proven to fix your sleep.
- **Source(s):** `doi:10.1007/s40675-023-00261-w` — Too Sour to be True? Tart Cherries (Prunus cerasus) and Sleep: a systematic review and meta-analysis
- **Why flagged:** The page claims the meta-analysis found "no significant effect on sleep efficiency or total sleep time" and that positive studies "didn't survive pooling," but the cited source reports the opposite for OBJECTIVE measures: pooled objective sleep efficiency (ES 0.63, 95% CI 0.29–0.97, P<0.01) and objective total sleep time (ES 1.21, 95% CI 0.83–1.58, P<0.01) were both significant, and it concludes tart cherry produces "significant improvements to total sleep time and sleep efficiency." Only the subjectively recalled measures were non-significant, so the assertion contradicts the source.
- **Source quote:** "Meta-analysis of subjectively recalled sleep efficiency (SE) and total sleep time (TST) were not significant. Objective SE, however, was significantly higher in the cherry cohort when compared to placebo with an effect size of 0.63 (95% CI 0.29–0.97, P < 0.01). ... Objective TST was significantly higher in the cherry cohorts, with a pooled effect size of 1.21 (95% CI 0.83–1.58, P < 0.01)."
- **Refuters:** 0/2 refuted

### Passionflower — claims[3] · unsupported (high)
- **Page says:** "The proposed mechanism (boosting GABA activity) comes mainly from rat and test-tube studies, not human outcomes. Biologically plausible, not proven in people."
- **Claim addressed (myth):** The calming effect is well understood.
- **Source(s):** `pmid:33352740` — Passiflora incarnata in Neuropsychiatric Disorders — A Systematic Review
- **Why flagged:** PMID 33352740 is a systematic review of nine human randomized clinical trials assessing Passiflora incarnata's anxiety outcomes; its abstract contains no discussion of mechanism, GABA activity, or any animal/in-vitro-versus-human-evidence distinction, so it does not address the assertion's central claim that the GABA mechanism comes mainly from rat/test-tube studies and is unproven in people.
- **Refuters:** 1/2 refuted — contested (kept)

### CBD — claims[1] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "Most positive reports are case series or CBD:THC combination products; only a couple of studies isolate CBD for insomnia, and the controlled ones are null for CBD by itself."
- **Claim addressed (myth):** There are studies proving it works.
- **Source(s):** `pmid:36149724` — Use of cannabidiol in the management of insomnia: a systematic review
- **Why flagged:** The review supports that only ~2 of 34 studies focused on insomnia (1 a case report) and that evidence is weak, but its conclusion is cautiously positive ("CBD alone... may be beneficial") and 4 of 7 CBD-predominant arms showed significant improvement. It never reports the insomnia-specific controlled study as null, so the assertion's key claim that "the controlled ones are null for CBD by itself" is stronger than, and directionally opposite to, what the source shows.
- **Source quote:** "The results of our systematic review suggest that CBD alone or with equal quantities of THC may be beneficial in alleviating the symptoms of insomnia."
- **Refuters:** 0/2 refuted

### Chamomile — claims[2] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "The sleep-quality benefit comes largely from special populations like postpartum women and older adults. The trials vary a lot, and the outcome is subjective quality, not measured sleep."
- **Claim addressed (myth):** It works for everyone's sleep.
- **Source(s):** `pmid:31006899` — Therapeutic efficacy and safety of chamomile for state anxiety, generalized anxiety disorder, insomnia, and sleep quality: a systematic review and meta-analysis of randomized and quasi-randomized trials
- **Why flagged:** The readable abstract supports the skeleton — a significant sleep-quality benefit (SMD −0.73, P<0.005) and an insomnia null ("only one RCT... found no significant change in insomnia severity index") — but it never states the assertion's load-bearing specifics: that the benefit "comes largely from" postpartum women and older adults, that "trials vary a lot" (no heterogeneity statement), or that the outcome is "subjective quality, not measured sleep." Those details live in the full-text tables (paywalled Elsevier), so the source as accessible does not substantiate the assertion as written.
- **Source quote:** "Chamomile appears to be efficacious and safe for sleep quality and GAD. ... there is only one RCT that evaluated the effect of chamomile on insomnia and it found no significant change in insomnia severity index (P > 0.05)."
- **Refuters:** 0/2 refuted

### Glycine — claims[0] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "The human trials that reported a benefit are all small, judged at high risk of bias, and come from a single manufacturer; an independent review couldn't even pool them because they were too heterogeneous, and rated the overall evidence limited."
- **Claim addressed (myth):** Glycine is clinically proven to improve sleep.
- **Source(s):** `pmid:37851316` — The effect of glycine administration on the characteristics of physiological systems in human adults: a systematic review
- **Why flagged:** The source verbatim supports the load-bearing claim — the sleep-benefit trials were "small sample sizes with a high risk of bias" — and its call for larger, more rigorous studies matches "limited" evidence. But it does not state the trials came from "a single manufacturer" nor that the review "couldn't pool them because they were too heterogeneous"; the abstract makes no mention of heterogeneity, pooling feasibility, or manufacturer origin, so the assertion attributes procedural specifics the source (as retrievable) does not carry.
- **Source quote:** "While longer-term glycine administration improved sleep in healthy populations, these studies had small sample sizes with a high risk of bias."
- **Refuters:** 0/2 refuted

### Iron — claims[1] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "No. Every trial that worked enrolled people with low or low-normal ferritin. Iron corrects a deficiency; it is not a sedative, and there is no evidence it improves sleep in people whose iron is already normal. The guidelines set explicit ferritin thresholds (oral iron for ferritin ≤75 µg/L) precisely because iron is treatment for a deficiency, not a general sleep aid."
- **Claim addressed (myth):** Everyone should take iron to sleep better.
- **Source(s):** `pmid:29425576` — Evidence-based and consensus clinical practice guidelines for the iron treatment of restless legs syndrome/Willis-Ekbom disease in adults and children: an IRLSSG task force report; `pmid:30609006` — Iron for the treatment of restless legs syndrome
- **Why flagged:** The explicit threshold ("oral iron for ferritin ≤75 µg/L") is verbatim from PMID 29425576, but the assertion's stronger generalizations exceed the sources: the same guideline gives Class I ratings to IV ferric-carboxymaltose trials in people with ferritin <300 µg/L (including normal iron stores), and the Cochrane review (PMID 30609006) reports that low-ferritin inclusion "did not show significant subgroup differences," so neither source supports "every trial that worked enrolled low/low-normal ferritin" or "no evidence it improves sleep in normal-iron people."
- **Source quote:** "Ferric carboxymaltose (1000 mg) is effective for treating moderate to severe RLS in those with serum ferritin <300 μg/l and could be used as first-line treatment for RLS in adults. Oral iron (65 mg elemental iron) is possibly effective for treating RLS in those with serum ferritin ≤75 μg/l."
- **Refuters:** 0/2 refuted

### Lemon balm — claims[1] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "No trial has tested it in diagnosed insomnia. The sleep evidence is in distressed, anxious poor sleepers, and the sleep improvement tracks the anxiety improvement."
- **Claim addressed (myth):** It works for insomnia.
- **Source(s):** `pmid:37927585` — The possible 'calming effect' of subchronic supplementation of a standardised Melissa officinalis extract in healthy adults with emotional distress and poor sleep: a randomised, double-blind, placebo-controlled trial
- **Why flagged:** The source supports that no diagnosed-insomnia trial exists and that the sleep evidence comes from distressed/anxious poor sleepers (100 healthy adults with moderate depression/anxiety/stress or PSQI >5, not diagnosed insomnia). But the third clause — that sleep improvement "tracks the anxiety improvement" — asserts a correlation/mediation relationship the abstract does not report; it lists sleep, stress, and affect as separately improved outcomes with no linking analysis.
- **Source quote:** "100 healthy adults complaining of a moderate degree of depression, anxiety, or stress"
- **Refuters:** 0/2 refuted

### Lemon verbena — claims[1] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "No trial has tested it in diagnosed insomnia. The populations were healthy adults with poor sleep or moderate stress, and the sleep improvement tracked a fall in perceived stress and cortisol."
- **Claim addressed (myth):** It works for insomnia.
- **Source(s):** `pmid:38794761` — Dietary Supplementation with an Extract of Aloysia citrodora (Lemon verbena) Improves Sleep Quality in Healthy Subjects: A Randomized Double-Blind Controlled Study; `pmid:35011093` — Anxiolytic Effect and Improved Sleep Quality in Individuals Taking Lippia citriodora Extract
- **Why flagged:** The population half is well-supported: 38794761 studied "healthy subjects with sleep disturbances" and 35011093 studied adults "with difficulties in managing stress," so no diagnosed-insomnia trial exists. But the assertion's claim that "the sleep improvement tracked a fall in perceived stress and cortisol" overstates the sources: 35011093 reports the stress/cortisol drop and the sleep gains as separate findings without establishing they co-varied, and 38794761 links its sleep improvement to a rise in nocturnal melatonin (reporting no cortisol result), not to cortisol.
- **Source quote:** "the group taking the lemon verbena extract significantly reduced their perception of stress after 8 weeks, which was corroborated by a significant decrease in cortisol levels"
- **Refuters:** 0/2 refuted

### Tart cherry — claims[1] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "This part is genuinely true: tart cherry contains melatonin, and a week of it measurably raised urinary melatonin in a trial. But that measurable melatonin bump hasn't translated into a reliable sleep effect."
- **Claim addressed (myth):** It's basically natural melatonin.
- **Source(s):** `pmid:22038497` — Effect of tart cherry juice (Prunus cerasus) on melatonin levels and enhanced sleep quality
- **Why flagged:** The source supports the melatonin half (total melatonin significantly elevated, P<0.05), but the assertion's second clause—that the melatonin bump "hasn't translated into a reliable sleep effect"—is directly contradicted by this same trial, which found significant increases in time in bed, total sleep time, and sleep efficiency (P<0.05) and concluded the melatonin increase improved sleep. This single cited source does not jointly carry the assertion's "no reliable sleep effect" conclusion; that would need other (null) trials.
- **Source quote:** "Total melatonin content was significantly elevated (P < 0.05) in the cherry juice group, whilst no differences were shown between baseline and placebo trials."
- **Refuters:** 0/2 refuted

### Zinc — claims[0] · overstated (medium) **[HUMAN-GATE]**
- **Page says:** "A 2024 systematic review pooled 8 randomized trials (~951 people) and found only limited, inconsistent evidence: several trials using 30 mg/day or more reported better sleep quality, but trials in premenstrual syndrome and depression found nothing, the populations and doses varied widely, and the authors explicitly called for more research before drawing conclusions."
- **Claim addressed (myth):** Zinc is a proven natural sleep aid.
- **Source(s):** `pmid:39377022` — Effects of zinc supplementation on sleep quality in humans: A systematic review of randomized controlled trials
- **Why flagged:** The cited review is real and on-topic (8 RCTs on zinc and sleep quality; "no consensus"; "more research... is needed"), matching the assertion's overall "inconsistent, inconclusive" thrust. But the abstract I could read does not carry the assertion's specifics — no ~951 total participants, no "30 mg/day or more" dose threshold, and no PMS/depression null-finding populations (it gives a 10–73.3 mg dose range) — and it actually says "the majority of the evidence... pointed to the significant improvement effect of zinc supplementation on sleep quality in adults," which the assertion recasts as merely "several trials." The assertion adds unverifiable numbers/populations and understates the review's positive-leaning summary.
- **Source quote:** "However, there was no consensus about these findings. This systematic review suggests that zinc supplementation may lead to improvements in sleep quality. However, more research, primarily clinical trials, is needed to clarify the beneficial effects."
- **Refuters:** 1/2 refuted — contested (kept)

### L-theanine — claims[2] · overstated (medium)
- **Page says:** "It's non-sedating: the effect is on relaxation and subjective quality (and objectively on sleep efficiency), not a knock-out. You can take it in the daytime for calm without drowsiness."
- **Claim addressed (myth):** It sedates you like a sleeping pill.
- **Source(s):** `pmid:31623400` — Effects of L-theanine administration on stress-related symptoms and cognitive functions in healthy adults: a randomized controlled trial
- **Why flagged:** The RCT reports improved subjective sleep quality (PSQI: latency, disturbances, medication use), reduced stress/anxiety, and improved cognition, which only indirectly bear on non-sedation; it never states L-theanine is "non-sedating," measures no objective "sleep efficiency" (PSQI is subjective), and does not test daytime calm-without-drowsiness. The assertion's specific claims ("objectively on sleep efficiency," daytime use) exceed what this source shows.
- **Refuters:** 0/2 refuted

### Magnesium — claims[3] · overstated (medium)
- **Page says:** "Trials used specific forms and doses; forms differ substantially in absorption. Magnesium oxide is poorly absorbed (about 4% of the dose), while glycinate and citrate absorb far better. And the studied form isn't always what's sold as a "sleep" product."
- **Claim addressed (myth):** Any magnesium supplement works the same.
- **Source(s):** `pmid:33865376` — Oral magnesium supplementation for insomnia in older adults: a systematic review & meta-analysis; `pmid:11794633` — Bioavailability of US commercial magnesium preparations
- **Why flagged:** Source 11794633 verbatim supports "magnesium oxide... 4% absorption" and that forms differ substantially, but it explicitly did NOT test glycinate or citrate (it tested chloride, lactate, aspartate) — so the assertion's specific claim that "glycinate and citrate absorb far better" is not carried by either cited source. Source 33865376 confirms trials used oral magnesium under 1g doses but gives no form/absorption detail. The core oxide figure is solid; the named-forms comparison overreaches the evidence.
- **Source quote:** "relatively poor bioavailability of magnesium oxide (fractional absorption 4 per cent)"
- **Refuters:** 0/2 refuted

### Magnesium — claims[5] · overstated (medium)
- **Page says:** "It's well tolerated, but loose stools / diarrhoea are common (especially oxide and citrate), and it can be dangerous in kidney disease. Safe is not the same as inert."
- **Claim addressed (myth):** Magnesium is completely side-effect free.
- **Source(s):** `pmid:33865376` — Oral magnesium supplementation for insomnia in older adults: a systematic review & meta-analysis; `pmid:26404370` — Magnesium in prevention and therapy
- **Why flagged:** Both fetched PubMed abstracts are topically related to magnesium but neither states the assertion's specifics: the insomnia meta-analysis (33865376) only notes "adverse events" as an outcome with no detail, and the review (26404370) abstract discusses magnesium's enzymatic/disease-prevention roles with no text on diarrhoea, oxide/citrate laxative effect, or renal danger (only an untethered "Magnesium / adverse effects" MeSH tag). No verbatim passage carries the loose-stools or kidney-disease claims, so the assertion outruns what the cited abstracts support.
- **Refuters:** 1/2 refuted — contested (kept)

### Magnolia bark — claims[4] · overstated (medium)
- **Page says:** "Short-term use in combination products was reasonably tolerated, but standalone human safety data (including at higher doses and over the long term) is thin, and it should be avoided in pregnancy."
- **Claim addressed (myth):** It's completely safe.
- **Source(s):** `pmid:23924268` — Effect of Magnolia officinalis and Phellodendron amurense (Relora) on cortisol and psychological mood state in moderately stressed subjects
- **Why flagged:** PMID 23924268 is a real, on-topic 4-week RCT of the Magnolia+Phellodendron combination product (Relora), which loosely supports the "short-term use in combination products" framing, but the abstract reports only efficacy outcomes (cortisol, mood) and contains no tolerability, adverse-event, or safety statement, and says nothing about standalone safety, higher doses, long-term use, or pregnancy. The source is weaker than the assertion: it cannot carry the "reasonably tolerated" tolerability claim or any of the safety caveats as written.
- **Refuters:** 0/2 refuted

### Skullcap — claims[3] · overstated (medium)
- **Page says:** "They're different species. Scutellaria lateriflora (American, the one with the weak sleep trial) versus Scutellaria baicalensis (Chinese), with different traditional uses, evidence, and safety."
- **Claim addressed (myth):** American and Chinese skullcap are the same thing.
- **Source(s):** `pmid:22855699` — Herbal hepatotoxicity from Chinese skullcap: a case report
- **Why flagged:** The source is a case report of hepatotoxicity from Chinese skullcap (Scutellaria baicalensis) and names that species, so it supports the safety-difference angle and confirms S. baicalensis as the Chinese species. But it never mentions S. lateriflora / American skullcap, never compares the two species, and says nothing about the "weak sleep trial" or the different traditional uses/evidence — so it does not carry the assertion's core "they're different species with different uses and evidence" claim as written.
- **Source quote:** "Keywords: Chinese skullcap; Hepatotoxicity; Herbal supplements; Scutellaria baicalensis."
- **Refuters:** 0/2 refuted

## Inaccessible sources (4)

Reported, never guessed at. Each is a claim whose load-bearing source could not be read (mostly NCBI/PMC reCAPTCHA walls under automated fetch). Re-check by hand or with a full-text mirror.

- **L-tryptophan claims[1]** — sources `pmid:3090582`, `pmid:33942088`: The first source (pmid:3090582) cleanly supports clause 1 — its abstract states verbatim that in "younger situational insomniacs... L-tryptophan is effective in reducing sleep onset time on the first night of administration in doses ranging from 1 to 15 g." But clause 2 (the modern meta-analysis found "no pooled effect on sleep latency") rests entirely on pmid:33942088, which I could not read: every NCBI/PMC route returned a reCAPTCHA page after more than one retry. The assertion's load-bearing modern conclusion is therefore unverifiable from a fetched source.
- **Saffron claims[1]** — sources `pmid:36141931`, `pmid:34438361`: The affron/melatonin source (pmid:34438361) — which carries the load-bearing "evening melatonin rise" and "builds over ~4 weeks" claims — returned only a reCAPTCHA page after a retry, so I could not read it. The one source I could read (pmid:36141931) reports only subjective outcomes (sleep quality/duration/insomnia severity via questionnaires) and never reports objective sleep latency or efficiency, so it does not itself substantiate the assertion's specific "no significant change in objective sleep latency or efficiency" claim; jointly I cannot confirm the assertion as written.
- **Skullcap claims[0]** — sources `pmid:40362800`: The Europe PMC abstract confirms the design (randomized, single-center, crossover, double-blind, n=66) and a significant PSQI improvement, but it does NOT carry the assertion's load-bearing discrediting claims: no flagged carryover effect, no statement that the 28-day washout was too short, no post-treatment PSQI value showing sleep "stayed in the poor range," and no manufacturer-supplied funding disclosure — the abstract instead concludes the extract is "safe and effective." Those specific claims would live in the full-text methods/limitations/funding sections, which I could not read (MDPI returned HTTP 403 and the Europe PMC HTML returned only a navigation shell after one retry each).
- **Valerian claims[0]** — sources `pmid:17145239`, `pmid:25644982`: Source 17145239 was fully readable and verbatim supports the first two clauses: RR of improved sleep = 1.8 (95% CI 1.2-2.9), plus explicit publication-bias and "significant methodologic problems" caveats. But the third clause — the "most rigorous synthesis found no herbal medicine, valerian included, outperformed placebo on any of thirteen efficacy measures" — is uniquely carried by source 25644982, which returned only a reCAPTCHA/navigation page on the canonical URL, a retry, and a Europe PMC mirror. I cannot verify the "thirteen measures / no herbal beat placebo" claim and must not guess at it.

## Dropped by refuters (4) — recorded, not findings

A verifier flagged these reading only the abstract; the adversarial refuters fetched the open-access full text and showed the page's wording is fine. Kept here for transparency — the audit's own false positives, caught by the second pass.

- **CBT-I claims[1]** (verifier said overstated): The verifier judged only the abstracts: the open-access full text of PMID 28392168 (fetched from the VU repository) explicitly classifies sleep-hygiene information as a "minimal intervention" non-active control — not a CBTI component — and identifies sleep restriction, stimulus control, and challenging dysfunctional thoughts (plus relaxation/paradoxical intention) as the components whose efficacy it pools, which is precisely the page's claim that sleep hygiene doesn't carry the effect while those components do. Combined with PMID 30264137 confirming SHE as the beaten control in the largest trial (which the verifier already conceded), both halves of the assertion are carried by the cited sources, so the "overstated" ruling rests on a missed full-text section.
- **Lemon balm claims[2]** (verifier said overstated): The verifier read only the abstract's results-sentence enumeration (which omits PSQI by name) and concluded sleep quality was merely an enrollment criterion; but the full paper's Figure 3A explicitly reports the treatment vs. placebo effect on "sleep quality (PSQI)" as a measured outcome with significant group differences, so the page's claim that the 100-person trial "improved sleep-quality scores" is carried by the source as written.
- **Passionflower claims[1]** (verifier said overstated): The verifier read only the abstract, but the review (PMC7766837, Molecules 2020;25:5952) is open-access and its Table 1 carries every load-bearing number: nine trials, exactly one sleep study (Ngan & Conduit 2011, n=41, in healthy adults with mild sleep fluctuations, not diagnosed insomnia), the rest anxiety-focused, with sample sizes ranging from 16 (Dimpfel) to 128 (Azimaraghi) — matching "16–128 people" exactly. The assertion is fully supported by the full text; the "overstated" ruling stems from missing the full-text table, not from any misreading in the page.
- **Saffron claims[4]** (verifier said overstated): The verifier read only the abstract; the full text (PMC9517076) explicitly states "Five out of 8 studies (and all that contributed to the primary outcome) declared funding from pharmaceutical and nutraceutical companies," directly supporting the industry-funding caveat the verifier claimed was absent. The single-research-group point is also grounded — the review flags Lopresti et al. duplicate reporting, and the Lopresti group is the dominant source of saffron-sleep RCTs — so the page's assertion is fine as written.

## Zero-finding remedies (17)

- **5-HTP** — 2 checked, 2 supported
- **Apigenin** — 4 checked, 4 supported
- **Ashwagandha** — 4 checked, 4 supported
- **Bacopa** — 3 checked, 3 supported
- **CBN** — 5 checked, 5 supported
- **CBT-I** — 6 checked, 5 supported (1 dropped)
- **GABA** — 3 checked, 3 supported
- **Hops** — 4 checked, 4 supported
- **Jujube** — 5 checked, 5 supported
- **Kava** — 4 checked, 4 supported
- **L-tryptophan** — 4 checked, 3 supported (1 inaccessible)
- **Lavender** — 2 checked, 2 supported
- **Reishi** — 4 checked, 4 supported
- **Saffron** — 5 checked, 3 supported (1 inaccessible, 1 dropped)
- **Taurine** — 4 checked, 4 supported
- **Valerian** — 5 checked, 4 supported (1 inaccessible)
- **Vitamin D** — 4 checked, 4 supported

## Method

- **Ran:** deterministic gates (`check-citations --online`, `check-tokens`, `check-forbidden-framing`, `check-botanical-completeness`), then per-remedy claim extraction and claim↔source verification. Every non-`supported` verdict went to 2 independent adversarial refuters (misreading lens + strength lens), each re-fetching the source; a finding both refuters kill is dropped.
- **Verification unit:** each `claims[]` row's `studiesShow` text vs its cited `sources[]`. Rows with `studiesShow: null` (deliberate myth-busters) are not verifiable claims — 33 skipped, counted above, none dropped silently.
- **Batched to respect the session token limit:** 4 sequential runs (first run 18 remedies before hitting the limit; then `report:false` batches of 6, 6, 4). ~4.6M subagent tokens total across ~127 agents. Re-run any remedy with `Workflow({name:"fact-check-corpus", args:{slugs:[...]}})`.
- **No agent ran git, edited content, or touched a grade.** Grade-relevant findings are flagged `[HUMAN-GATE]` for owner review.
