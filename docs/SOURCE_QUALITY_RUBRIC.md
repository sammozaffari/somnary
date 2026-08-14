# Source quality rubric — making bucket assignments defensible

*Status: **proposed**, owner ratification pending — a `[HUMAN-GATE]` before any evidence
bucket ships as final (CLAUDE.md "Human gates"). Once ratified this is binding for every
`studyQuality` value in `sources[]` and is published, in plain language, on the
how-we-grade page.*

*Re-scoped at CHK-R0 merge (RULES.md Process): the study field is a nested bar, not a
scatter — `studyQuality` is **no longer a render input** and is **not filled for the whole
corpus**. It exists to make evidence-bucket assignments defensible, so it is populated
only for the papers that determine a remedy's bucket.*

## What this rates, and what it does not

`studyQuality` answers one question: **how much weight can the paper(s) behind a bucket
assignment honestly bear?** It is a property of a single *source*, not of a remedy. It
never sets or influences a bucket by itself — bucketing stays `[HUMAN-GATE]` and reflects
the whole body of human evidence, not one paper's rating. What it does is make the human
bucket decision *re-derivable*: anyone reading the determining papers' ratings should be
able to see why the bucket is what it is.

It carries **no safety signal**. Safety is the separate flag introduced in Step 1
(none / caution / serious concern) and is never encoded at the source level.

**Scope:** only the sources that determine a remedy's bucket carry a rating — typically
the human sleep-outcome papers (`measuresSleepOutcome: true`) the grader leaned on. Every
other source (safety, mechanism, label, guideline, off-target, and sleep-outcome papers
that didn't drive the decision) stays `studyQuality: null`. The field is optional in the
schema and the gates; a null is the normal case, not a gap.

## The rule: three levels, re-derivable by any reader

Exactly three levels. A reader must be able to re-derive any rating from the study type
plus the stated flags — no rating is assigned "by feel". The top band is *defined by* the
established instruments (Cochrane **Risk of Bias 2** for trials, **AMSTAR 2** for
reviews), so the rubric cites the standards while still covering designs those
instruments do not score (case series, narrative reviews, observational work).

| Level | What earns it |
|---|---|
| **high** | A pre-registered randomised controlled trial judged **low risk of bias on RoB 2**; **or** a systematic review / meta-analysis of RCTs rated **high confidence on AMSTAR 2** (with a Cochrane review counted here on methodology). |
| **moderate** | An RCT with real limitations — small sample, unblinded, surrogate/secondary outcome, or industry-designed/-funded — i.e. "some concerns" on RoB 2; **or** a systematic review of mixed-quality trials, or one without pooled effect estimates. |
| **low** | Uncontrolled, open-label or observational studies; case series/reports; narrative reviews; manufacturer-only or non-peer-reviewed data. (Observational/cohort papers can support the middle buckets but can never alone reach the top bucket — RULES.md.) |

### Applying it (decision order)

1. **Is this paper one the bucket assignment leans on?** No → `studyQuality: null` (the
   normal case). Yes → continue.
2. **RCT?** Apply RoB 2. Low risk → `high`. Some concerns/high risk, or small/unblinded/
   industry-designed → `moderate`.
3. **Systematic review / meta-analysis?** Apply AMSTAR 2. High confidence → `high`.
   Mixed-quality evidence base or no pooled estimate → `moderate`.
4. **Anything else** (cohort, case series, open-label, manufacturer) → `low`.

### Worked examples (from the pilot)

- Ferracioli-Oda 2013 — meta-analysis of 19 RCTs (1,683 subjects), sound methodology → **high**.
- Brzezinski 2005 — meta-analysis but small pooled sample (284) and older methods → **moderate**.
- Lemon-verbena RCT (Pérez-Piñero 2024) — double-blind, placebo-controlled, but n=71 and three
  authors employed by the manufacturer → **moderate**.

### Honesty notes

- **Industry involvement caps a trial at `moderate`** unless independently replicated — an
  otherwise clean RCT whose protocol was manufacturer-designed or authored is never `high`.
- The rating describes the *study*, not the *finding*. A high-quality trial that found no
  effect is still `high` with `effectDirection: didnt-help` — and bucket 4 ("Tested —
  doesn't seem to help sleep") specifically requires papers that measured a sleep outcome
  and found no effect.
