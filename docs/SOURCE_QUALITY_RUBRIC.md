# Source quality rubric — the study-field brightness axis

*Status: **proposed**, owner ratification pending (REDESIGN step 2). Once ratified this is
binding for every `studyQuality` value in `sources[]` and is published, in plain language, on
the how-we-grade page.*

## What this rates, and what it does not

`studyQuality` sets one thing only: **how brightly a study renders as a point of light in the
study field** (REDESIGN Reference C2 / step 11). It is a property of a single *source*, not of
a remedy. It never sets or influences a tier grade — grading stays `[HUMAN-GATE]` and reflects
the whole body of human evidence, not one paper's brightness.

It carries **no safety signal**. Safety is the separate flag introduced in Step 1
(none / caution / serious concern) and is never encoded at the source level.

Only sources that measure a **human sleep outcome** (`measuresSleepOutcome: true`) render as
points and therefore carry a quality rating. Safety, mechanism, label, guideline and
off-target sources are not points and are left `studyQuality: null`.

## The rule: three levels, re-derivable by any reader

Brightness has exactly three levels. A reader must be able to re-derive any rating from the
study type plus the stated flags — no rating is assigned "by feel". The top band is *defined by*
the established instruments (Cochrane **Risk of Bias 2** for trials, **AMSTAR 2** for reviews),
so the rubric cites the standards while still covering the ~46% of our corpus (case series,
narrative reviews, animal, in-vitro) that those instruments do not score.

| Level | Brightness | What earns it |
|---|---|---|
| **high** | brightest | A pre-registered randomised controlled trial judged **low risk of bias on RoB 2**; **or** a systematic review / meta-analysis of RCTs rated **high confidence on AMSTAR 2** (with a Cochrane review counted here on methodology). |
| **moderate** | mid | An RCT with real limitations — small sample, unblinded, surrogate/secondary outcome, or industry-designed/-funded — i.e. "some concerns" on RoB 2; **or** a systematic review of mixed-quality trials, or one without pooled effect estimates. |
| **low** | dimmest | Uncontrolled, open-label or observational studies; case series/reports; narrative reviews; animal or in-vitro work; manufacturer-only or non-peer-reviewed data. (Most of these are non-sleep sources and won't be points at all — but when a low-tier design *does* report a human sleep outcome, this is its brightness.) |

### Applying it (decision order)

1. **Is it a human sleep-outcome source?** No → not a point; `studyQuality: null`. Yes → continue.
2. **RCT?** Apply RoB 2. Low risk → `high`. Some concerns/high risk, or small/unblinded/
   industry-designed → `moderate`.
3. **Systematic review / meta-analysis?** Apply AMSTAR 2. High confidence → `high`.
   Mixed-quality evidence base or no pooled estimate → `moderate`.
4. **Anything else** (cohort, case series, open-label, animal, in-vitro, manufacturer) → `low`.

### Worked examples (from the pilot)

- Ferracioli-Oda 2013 — meta-analysis of 19 RCTs (1,683 subjects), sound methodology → **high**.
- Brzezinski 2005 — meta-analysis but small pooled sample (284) and older methods → **moderate**.
- Lemon-verbena RCT (Pérez-Piñero 2024) — double-blind, placebo-controlled, but n=71 and three
  authors employed by the manufacturer → **moderate**.

### Honesty notes

- **Industry involvement caps a trial at `moderate`** unless independently replicated — an
  otherwise clean RCT whose protocol was manufacturer-designed or authored is never `high`.
- The rating describes the *study*, not the *finding*. A high-quality trial that found no effect
  is still `high` brightness with `effectDirection: didnt-help`.
