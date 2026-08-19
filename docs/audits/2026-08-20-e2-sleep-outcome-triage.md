# CHK-E2 — `measuresSleepOutcome` triage, all 133 sources

**Done 20 August 2026.** Every source in the corpus is now adjudicated: **133 cited · 65 measured
a sleep outcome in humans · 68 did not**. Before this pass, 116 of 133 were `null`, which is why
28 of 31 remedies rendered "still checking which measured sleep" instead of a study bar.

## How each call was made

Abstracts were fetched from the **NCBI E-utilities API** (`efetch`, `rettype=abstract`) — PubMed's
own consent wall makes the HTML unfetchable, and the API returns the abstract text directly. 111
of 116 resolved by PMID; the rest were decided from the source record's own recorded finding.

The question is narrow and the schema states it: **did this paper measure a sleep outcome in
humans?** Not "is it about sleep", not "is it good evidence" — those are separate fields and, for
the bucket, a separate human decision.

## The precedent this pass followed

The 17 sources adjudicated earlier (melatonin, lemon-verbena, taurine) set a consistent line, and
this pass matched it rather than inventing a new one:

| Kind | Call | Why |
|---|---|---|
| Animal / in-vitro | **false** | A bucket reflects published *human* evidence (schema, explicit) |
| Clinical guideline | **false** | Precedent: melatonin's AASM guideline is false. A guideline synthesises; it measures nothing |
| Narrative review | **false** | Precedent: taurine's reviews. No outcome of its own |
| Label / product analysis, poison-control report, case series | **false** | Measures a product or a harm, not sleep |
| RCT / meta-analysis / systematic review **whose outcome is sleep** | **true** | The measurement exists and is human |
| RCT / meta-analysis **whose outcome is something else** | **false** | Anxiety, cognition, depression, hypothyroidism, RLS severity |

## Judgment calls worth re-checking

These are the ones where a reasonable reviewer might differ. Each is recorded so it can be
challenged rather than buried:

- **Iron / restless-legs trials** (38625730, 19230757, 28643901) → **false**. Their endpoints are
  RLS severity (IRLS score), which is a symptom scale, not a sleep outcome. The Cochrane review
  (30609006) → **true**, because it separately reports subjective sleep quality and sleep
  efficiency.
- **34468204 (cannabinol and sleep)** → **false**. It is *about* sleep but is a narrative review
  that measures nothing and concludes the evidence is insufficient.
- **26293583 (lavender/Silexan)** and **31623400 (L-theanine)** → **true**. Both are anxiety or
  stress trials, but both name the PSQI as a measured outcome variable.
- **34453310 (serum zinc)** → **true**. Observational, and its outcome is sleep duration.
- **29113075 (zinc as a sleep modulator)** → **false**. A review spanning mice and humans; it
  measures nothing itself.

## What this does and does not unblock

**Unblocked:** every remedy page and browse row now renders a real study bar; kava and taurine's
worked examples on `/how-we-grade` are made from live counts instead of hedged prose; the RULES.md
audit line is re-derived from `sources[]` and no longer historical.

**Still open — the second half of E2:** only **6 of the 65** sleep-outcome sources carry the
`sampleSize` and `effectDirection` that `effectDataStatus: complete` requires, so the bar's third
segment ("reported enough to verify") is still nearly empty. That fill needs each paper's numbers
read off the paper, one at a time.

**Not affected:** no bucket was assigned or changed by this pass. Bucketing is `[HUMAN-GATE]`
(CHK-E6) and nothing here touches it. Triage tells you what a paper measured; it does not tell you
what the remedy deserves.
