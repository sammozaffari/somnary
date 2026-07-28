# Remedy grade-state audit

**Status:** Phase A audit complete; Phase B implemented on `fix/publication-states`  
**Date:** 28 July 2026  
**Scope:** 31 remedy records at repository HEAD `ffc072b00647522aa3ac5c64bbdf9c4a55a58292`  
**Repository inspected:** `/Users/sammozaffari/Desktop/PROJECTS/somnary`  
**Implementation commits:** `ba958c5`, `390d7f3`, `6f61b46` plus the final surface commit that follows this document

## Executive finding

The repository contains three different truths about publication:

- **9 remedies explicitly say their grade is provisional and pending final owner sign-off:** Apigenin, Bacopa, CBN, Iron, Jujube, Reishi, Saffron, Vitamin D, and Zinc.
- **2 remedies explicitly say their grade is owner-ratified:** Lemon verbena and Taurine.
- **20 remedies have no explicit human-ratification signal.** Fifteen mention a second review or second-review decision; five do not. A second review is not assumed to be human sign-off.
- **All 31 are published in practice.** No remedy declares `draft`; the schema defaults `draft` to `false`, and the primary content-collection surfaces use `!e.data.draft`.

This means there are **9 records with affirmative evidence of being unratified**, **20 records whose ratification is unknown**, and only **2 records with affirmative evidence of owner ratification**. The content model nevertheless says every tier value is owner-ratified (`src/content.config.ts:16-18`), which is directly contradicted by the nine HUMAN-GATE records.

The ranking cascade depends on whether “unknown” is honoured:

- Removing only the 9 explicitly pending remedies leaves **22** records on the tier board and changes **none** of the seven outcome pages, because none of those nine is present in the hand-maintained outcome map.
- Requiring affirmative ratification leaves only **2** records on the tier board and **0** records on every outcome page. Neither of the surviving records is currently assigned to an outcome.
- The sole S grade (CBT-I) and sole A grade (Melatonin) are both **unknown**, not explicitly ratified. None of the seven S/A/B grades has an explicit owner-ratification signal.

## Audit method and inference rules

This audit reports content signals; it does not reassess the studies or change a grade.

- **Workflow inference** uses only explicit editorial wording. `in_review` means the file says HUMAN-GATE/provisional/pending final sign-off. `ratified` means it says owner-ratified. `unknown` means neither is present. The parenthetical “route-published” records the current technical publication fact separately, because the present implementation can publish an `in_review` record.
- **Epistemic inference** follows the file’s own characterization of its evidence. `established` is used where the file describes clear, replicated, guideline-backed, or strong evidence (including clear evidence of no benefit or of a safety-driven F). `provisional` is used for a real but narrow/low-quality/secondary signal. `disputed` is used where the file foregrounds conflicting or inconsistent findings. `insufficient` is used where it says evidence is absent, non-standalone, single-source, manufacturer-only/unreplicated, or otherwise inadequate.
- **Freshness inference** is `current*` for all 31 because every file has a July 2026 `reviewDate`, every change log calls the record an initial publication, and no file says review-due, superseded, or withdrawn. The asterisk is important: “current” here means “the latest view represented by this repository,” not “current under an explicit review cadence.” No cadence or `reviewDueAt` exists.
- **Unknown remains first-class.** “Initial publication,” `researchStatus: live`, a second review, and a live route are not treated as proof of human ratification.

Cross-corpus checks:

- 31/31 have `reviewDate`.
- 31/31 have an “Initial publication” change-log entry.
- 0/31 declare `draft`; the schema supplies `false` (`src/content.config.ts:155-160`).
- 0/31 contain TODO, TBD, FIXME, review-due, superseded, or withdrawn markers.
- All review dates fall from 3–9 July 2026.
- All 31 are marked `researchStatus: live` in `src/data/content-index.json`.

## A1. Actual content state of all 31 remedies

| Remedy | Current tier | Signals found in content | Inferred workflow | Inferred epistemic | Inferred freshness |
|---|---:|---|---|---|---|
| 5-HTP | D | “APPROVED by second review”; two pending fixes are said to be applied (`src/content/remedies/5-htp.mdx:2-7`). Review 2026-07-03 and “Initial publication — tier D” (`:9-13`). Prose says standalone human sleep evidence is “essentially absent” (`:19-27`). | **unknown** (route-published) | **insufficient** | **current*** |
| Apigenin | D | HUMAN-GATE, provisional D, pending final owner sign-off; owner only “pre-approved” it (`src/content/remedies/apigenin.mdx:2-12`). Review 2026-07-09; change log also says provisional (`:14-18`). Verdict repeats “no adequate human trial” and “provisional D” (`:23-32`). | **in_review** (route-published) | **insufficient** | **current*** |
| Ashwagandha | B | “APPROVED by second review with fix applied” (`src/content/remedies/ashwagandha.mdx:2-5`). Review 2026-07-03 and unqualified initial tier B publication (`:7-11`). Prose calls the benefit real and meta-analytically supported (`:20-26`). | **unknown** (route-published) | **established** | **current*** |
| Bacopa | D | HUMAN-GATE, owner-approved **provisional** D, pending final owner sign-off (`src/content/remedies/bacopa.mdx:2-9`). Review 2026-07-09; provisional publication note (`:11-15`). The only direct sleep trial missed its primary outcome and the verdict remains provisional (`:22-31`). | **in_review** (route-published) | **insufficient** | **current*** |
| CBD | D | “Tier D (clean, not a hedge) by second-review call” (`src/content/remedies/cbd.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Prose says the controlled evidence is clear and points down (`:19-25`). | **unknown** (route-published) | **established** | **current*** |
| CBN | D | HUMAN-GATE, owner-approved provisional D, pending final ratification (`src/content/remedies/cbn.mdx:2-10`). Review 2026-07-09; provisional publication note (`:12-16`). Verdict calls the trials preliminary (`:25-32`), and the body explicitly says the final grade is pending owner sign-off (`:272-279`). | **in_review** (route-published) | **insufficient** | **current*** |
| CBT-I | S | “Grade confirmed by second review” (`src/content/remedies/cbt-i.mdx:2-7`). Review 2026-07-06 and unqualified initial publication (`:9-13`). Prose calls it the best-evidenced treatment and cites agreement across independent meta-analyses and guidelines (`:24-32`). | **unknown** (route-published) | **established** | **current*** |
| Chamomile | C | Tier C by second-review call, revised upward after verification (`src/content/remedies/chamomile.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Positive pooled subjective quality conflicts with a null diagnosed-insomnia trial (`:21-28`). | **unknown** (route-published) | **disputed** | **current*** |
| GABA | D | Tier D by second-review call after a C/D coin-flip was broken downward (`src/content/remedies/gaba.mdx:2-4`). Review 2026-07-03 and unqualified initial publication (`:7-11`). Prose calls the mechanism uncertain/contradictory and the one positive trial weak (`:20-24`). | **unknown** (route-published) | **disputed** | **current*** |
| Glycine | D | Tier D by second-review call, down from proposed C; evidence described as manufacturer-only and unreplicated (`src/content/remedies/glycine.mdx:2-7`). Review 2026-07-03 and unqualified initial publication (`:9-13`). Verdict repeats the lack of independent replication (`:19-27`). | **unknown** (route-published) | **insufficient** | **current*** |
| Hops | D | Unqualified tier D; source-first, “honest D,” almost never tested alone (`src/content/remedies/hops.mdx:2-5`). Review 2026-07-03 and unqualified initial publication (`:7-11`). Verdict calls it barely tested solo (`:21-24`). | **unknown** (route-published) | **insufficient** | **current*** |
| Iron | B | HUMAN-GATE, provisional scoped B, pending final owner sign-off (`src/content/remedies/iron.mdx:2-8`). Review 2026-07-09 and provisional publication note (`:11-15`). Prose says the narrowly scoped RLS/low-iron evidence is genuinely good and guideline-backed (`:24-35`). | **in_review** (route-published) | **established** | **current*** |
| Jujube | D | HUMAN-GATE, provisional D, pending final owner sign-off (`src/content/remedies/jujube.mdx:2-7`). Review 2026-07-09 and provisional publication note (`:10-14`). Prose says standalone evidence is one 12-person feasibility study (`:23-32`) and the grade is held for owner sign-off (`:233-237`). | **in_review** (route-published) | **insufficient** | **current*** |
| Kava | F | “APPROVED by second review”; F is safety-driven (`src/content/remedies/kava.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Prose describes documented serious liver injury outweighing an unproven sleep benefit (`:19-26`). | **unknown** (route-published) | **established** | **current*** |
| L-theanine | B | “APPROVED by second review”; real but context-specific effect, explicitly thin (`src/content/remedies/l-theanine.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:9-13`). Verdict says the signal is limited to specific groups and not ordinary insomnia (`:21-28`). | **unknown** (route-published) | **provisional** | **current*** |
| L-tryptophan | C | “second-review-approved” (`src/content/remedies/l-tryptophan.mdx:2-5`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Verdict describes a narrow, modest finding on thin, mostly non-insomnia evidence (`:18-25`). | **unknown** (route-published) | **provisional** | **current*** |
| Lavender | C | “second-review-approved”; oral evidence is the strong half, sleep is secondary, aromatherapy weak (`src/content/remedies/lavender.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Verdict preserves the oral/aromatherapy split (`:20-28`). | **unknown** (route-published) | **provisional** | **current*** |
| Lemon balm | C | “second-review-approved,” corrected upward after verification (`src/content/remedies/lemon-balm.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Prose says the sleep benefit is secondary to calming and not tested in diagnosed insomnia (`:20-24`). | **unknown** (route-published) | **provisional** | **current*** |
| Lemon verbena | D | Explicit **OWNER-RATIFIED 2026-07-09** (`src/content/remedies/lemon-verbena.mdx:2-9`). The review date and owner-ratified change-log entry are dated 2026-07-08 (`:12-16`), one day before the stated ratification. Evidence is manufacturer-only and unreplicated (`:23-33`). | **ratified** (route-published) | **insufficient** | **current*** |
| Magnesium | B | Unqualified tier B; page says a real but small effect from thin/low-quality evidence (`src/content/remedies/magnesium.mdx:2-5`). Review 2026-07-03 and unqualified initial publication (`:7-11`). Verdict repeats that the evidence is a few small, low-quality trials (`:22-29`). | **unknown** (route-published) | **provisional** | **current*** |
| Magnolia bark | D | Unqualified tier D; strong preclinical mechanism but no standalone human sleep trial (`src/content/remedies/magnolia-bark.mdx:2-5`). Review 2026-07-03 and unqualified initial publication (`:7-11`). Verdict repeats that the only human work is combination/stress evidence (`:19-25`). | **unknown** (route-published) | **insufficient** | **current*** |
| Melatonin | A | Unqualified tier A; sources verified and consumed by all major grade surfaces (`src/content/remedies/melatonin.mdx:2-5`). Review 2026-07-03 (`:7`) and unqualified initial publication (`:32-35`). Verdict calls it the strongest natural-aid evidence but distinguishes circadian use from chronic insomnia (`:13-18`). | **unknown** (route-published) | **established** | **current*** |
| Passionflower | D | Unqualified tier D; content calls the evidence essentially one small subjective trial (`src/content/remedies/passionflower.mdx:2-4`). Review 2026-07-03 and unqualified initial publication (`:7-11`). Verdict calls the human evidence remarkably thin (`:18-25`). | **unknown** (route-published) | **insufficient** | **current*** |
| Reishi | D | HUMAN-GATE, owner-approved **provisional** D, pending final owner sign-off (`src/content/remedies/reishi.mdx:2-8`). Review 2026-07-09 and provisional publication note (`:11-15`). Prose says no adequate human sleep trial exists (`:22-30`). | **in_review** (route-published) | **insufficient** | **current*** |
| Saffron | B | HUMAN-GATE, owner-pre-approved **provisional** B, pending final owner sign-off (`src/content/remedies/saffron.mdx:2-11`). Review 2026-07-08 and provisional publication note (`:14-18`). Prose says multiple syntheses find consistent results, with funding and measurement caveats (`:29-38`). | **in_review** (route-published) | **established** | **current*** |
| Skullcap | D | “final second-review verdict,” described as the closest call in the catalogue (`src/content/remedies/skullcap.mdx:2-8`). Review 2026-07-03 and unqualified initial publication (`:10-14`). A positive result conflicts with serious design and independence limitations (`:23-31`). | **unknown** (route-published) | **disputed** | **current*** |
| Tart cherry | C | “second-review-approved” after confirming the null pooled result (`src/content/remedies/tart-cherry.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Individual positive pilots conflict with a null pooled effect (`:20-26`). | **unknown** (route-published) | **disputed** | **current*** |
| Taurine | F | Explicit **OWNER-RATIFIED 2026-07-09** (`src/content/remedies/taurine.mdx:2-8`). Review and owner-ratified change-log entry both dated 2026-07-09 (`:10-14`). Prose says there are zero standalone human sleep trials (`:20-29`). | **ratified** (route-published) | **insufficient** | **current*** |
| Valerian | C | “APPROVED by second review” (`src/content/remedies/valerian.mdx:2-6`). Review 2026-07-03 and unqualified initial publication (`:8-12`). Positive subjective syntheses conflict with bias, weak quality, and a rigorous null synthesis (`:23-30`). | **unknown** (route-published) | **disputed** | **current*** |
| Vitamin D | C | HUMAN-GATE, owner-pre-approved **provisional** C, pending final owner sign-off (`src/content/remedies/vitamin-d.mdx:2-10`). Review 2026-07-08 and provisional publication note (`:12-16`). Evidence is described as consistent but correlational, heterogeneous, subjective, and population-specific (`:23-32`). | **in_review** (route-published) | **provisional** | **current*** |
| Zinc | D | HUMAN-GATE, owner-approved **provisional** D, still pending final ratification; “grade set by owner” does not say ratified (`src/content/remedies/zinc.mdx:2-10`). Review 2026-07-09 and provisional publication note (`:12-16`). Trials are explicitly small, inconsistent, heterogeneous, and partly confounded (`:23-35`). | **in_review** (route-published) | **disputed** | **current*** |

### A1 counts

| Axis | Inferred state | Count |
|---|---|---:|
| Workflow | `in_review` (explicitly pending) | 9 |
| Workflow | `ratified` (explicit owner-ratification) | 2 |
| Workflow | `unknown` (no human-ratification signal) | 20 |
| Technical publication | route-published | 31 |
| Epistemic | `established` | 7 |
| Epistemic | `provisional` | 6 |
| Epistemic | `disputed` | 6 |
| Epistemic | `insufficient` | 12 |
| Freshness | `current*` | 31 |
| Freshness | `review_due` | 0 |
| Freshness | `superseded` | 0 |

### A1 inconsistencies

1. **The schema comment claims ratification that the records deny.** It says the tier value “is owner-ratified, never set by tooling” (`src/content.config.ts:16-18`), while nine records explicitly say pending final owner sign-off.
2. **Publication is treated as a draft boolean, not an editorial state.** `draft` defaults to `false` (`src/content.config.ts:155-160`), and remedy routes publish every non-draft record (`src/pages/r/[slug].astro:25-27`). No remedy supplies `draft`, so all 31 pass.
3. **The public change log calls pending grades “Published.”** Every initial entry has `type: review`; the route maps that type to “Published” (`src/pages/changelog.astro:22-40`). The nine notes still say “provisional,” but only in body text.
4. **Lemon verbena’s dates do not agree.** The file says owner-ratified on 9 July, but its `reviewDate` and owner-ratified publication entry are dated 8 July (`src/content/remedies/lemon-verbena.mdx:2,12-16`).
5. **`plannedTier` is documented as a provisional research hypothesis but rendered publicly as an ingredient grade.** The warning is explicit (`src/lib/content-index.ts:15-19`); `/sleep-blends` reads `plannedTier` into a `TierBadge` (`src/pages/sleep-blends.astro:14-17,168-188`). The values currently happen to match all 31 content tiers, so this is a semantic inconsistency rather than a current letter mismatch.

## A2. Every grade surface

“Rank” below means grade determines relative order or a “highest/best” claim. “Filter” means grade/state controls inclusion. Merely matching a search query is not grade ranking.

| Surface | Displays grade? | Sorts/ranks by grade? | Filters by grade/state? | What it does now |
|---|---|---|---|---|
| Remedy route publication — `src/pages/r/[slug].astro:25-27` | Indirectly | No | **Only `draft`** | Creates a route for every record whose defaulted `draft` is false. It cannot see ratification, epistemic state, freshness, withdrawal, or supersession. |
| Remedy page assembly — `src/pages/r/[slug].astro:60-81,154-163` | **Yes, four times** | No | No | Passes `d.tier` to `RemedyHero`/`GradeStamp`, `RemedyLeadBlock`, `VerdictBand`, and `MetadataCard`. A HUMAN-GATE D is indistinguishable from a ratified D. |
| `GradeStamp.astro:18-37` | **Yes** | No | No | Renders letter + tier word only. Its API accepts only `tier`; no state can be expressed. Used by remedy heroes and tier-board cards. |
| `RemedyHero.astro:21-26,55-59` | **Yes** | No | No | Displays `GradeStamp` beside the remedy name. |
| `RemedyLeadBlock.astro:21-32,39-43,73-76` | **Yes** | No | No | Displays “Grade X · tier-name” and review date, but no workflow/epistemic/freshness state. |
| `VerdictBand.astro:10-29` | **Yes** | No | No | Displays “Graded X” and describes it as published human evidence. No state. |
| `MetadataCard.astro:10-33` | **Yes** | No | No | Displays both a tier badge and “grade X.” No state. |
| Shared cards/badges — `RemedyCard.astro:18-41`; `TierBadge.astro:9-55` | **Yes** | No | No | `RemedyCard` announces and stamps the grade; `TierBadge` carries only the letter. These components propagate the same indistinguishability to boards, outcome rows, compare, and search. |
| Tier board — `src/pages/tiers.astro:31-46,72-125,129-153` | **Yes** | **Yes; default canonical order S→F** | No state filter | Includes all 31 non-draft records, counts them by tier, emits grade rank into each row, and defaults to grade sorting. Name/category controls only reorder the same set. This is the largest direct ranking harm. |
| Outcome pages — `src/pages/outcome/[slug].astro:11-25,61-78` | **Yes** | **Yes; “best evidence first”** | Relevance map only, no state | Sorts each hand-maintained `OUTCOMES` list by tier and numbers the result. None of the nine explicitly pending records is currently in that map, despite those files carrying their own `outcomes` fields. |
| Compare — `src/pages/compare.astro:44-68,131-182` | **Yes** | **Yes; canonical S→F order** | Goal/category only, no state | Includes all 31 non-draft records, defaults to grade order, and displays the badge, letter/name, and tier-derived decision translation. |
| Search projection — `src/lib/search.ts:22-44`; `src/lib/search-rank.ts:9-22,38-80` | **Carries grade** | **No; tier explicitly never boosts** | Only `draft`, no state | Projects `tier` for all 31. Lexical search ranks by field match, not grade. No workflow/epistemic/freshness field is available. |
| Search JSON/page/palette — `src/pages/search-index.json.ts:1-15`; `src/pages/search.astro:60-83`; `src/components/SearchPalette.astro:429-450` | **Yes** | No grade rank | No state | The JSON ships the bare grade; the page and global palette render it with no state. A provisional result is visually and semantically identical to a ratified result. |
| Homepage carousel — `src/pages/index.astro:19-27,76-79`; `src/components/HeroCarousel.astro:31-33,61-112,155-199` | **Yes** | Curated, not grade-sorted | Only `draft`; curated slug list | The current remedy slides are Magnesium B and Valerian C. Both have unknown ratification. The carousel calls the value an “Evidence grade” and exposes it in visible and accessible text. |
| Sleep-blends ingredient list — `src/pages/sleep-blends.astro:14-17,168-188` | **Yes** | No | `researchStatus: live`, `kind: remedy`, non-null `plannedTier` | Displays 30 supplement remedy grades (CBT-I is an intervention) from `plannedTier`, not from remedy content. `plannedTier` is documented as provisional and not the published grade (`src/lib/content-index.ts:15-19`). |
| Evidence change log — `src/pages/changelog.astro:22-40,59-79` | **Yes, in notes and grade-change badges** | Date, not grade | Only `draft` | Publicly exposes the nine “provisional tier” notes, but labels their `review` event “Published.” For grade changes it renders from/to badges; initial records show the grade only in prose. |
| Ask corpus and page assistant — `src/lib/ask/from-collection.ts:11-30`; `src/lib/ask/corpus.ts:39-69,118-130`; `src/lib/ask/prompt.ts:25-29,46-62`; `src/pages/ask-corpus.json.ts:1-15` | **Carries and can state grade** | No | Only `draft`; page scope | All 31 grades enter the public corpus and the model context as `SOMNARY GRADE`. The allowed response framing explicitly says “Somnary grades this as …”. No state accompanies it. |
| Guide/reading map — `src/lib/guide/router.ts:157-188,284-320,403-443` | **Yes** | **Yes rhetorically for CBT-I** | Safety screeners, not grade state | The guide calls CBT-I the “highest-graded intervention,” inserts its grade, and inserts a grade for every remedy the user says they tried. CBT-I’s ratification is unknown. Outcome links inherit the outcome-page rankings. |
| Label-checker index — `src/lib/label-data.ts:17-51`; `src/lib/label-rules.ts:16-30,119-137`; `src/pages/label-index.json.ts:1-15` | Carries grade in JSON; does **not** display it | No | Only `draft`; no state | `tier` is projected and validated for all 31 but is not used by the current checker rules or UI. It is a latent grade surface and another state-less public data projection. |
| Per-remedy Open Graph images — `src/pages/r/[slug]/og.png.ts:12-39,54-66` | **Yes, letter only** | No | Only `draft` | Generates a share image for all 31 non-draft remedies with a large grade letter and no state label. |
| Structured data — `src/lib/seo.ts:14-57`; `src/pages/r/[slug].astro:46-59` | **No structured grade field** | No | Follows route publication | JSON-LD includes verdict, description, claims, and citations but not `tier`. Provisional wording may leak through free text for some records, but state is not machine-readable. |
| Sitemap — `astro.config.mjs:9-22` | No grade metadata | No | Follows generated routes | `@astrojs/sitemap` includes all generated remedy routes, so all 31 are discoverable. It has no grade or editorial-state representation. |
| RSS/feed | No | No | No | No RSS or feed source exists in the repository. |

Generic S–F rubric displays on methodology/start-here pages are not remedy-record grade surfaces: they explain the scale but do not attach a grade to a remedy.

## A3. Cascade

### A3.1 Ratification counts

| Question | Count | Records |
|---|---:|---|
| Explicit signals saying **not yet ratified** | **9** | Apigenin, Bacopa, CBN, Iron, Jujube, Reishi, Saffron, Vitamin D, Zinc |
| Explicit owner-ratification | **2** | Lemon verbena, Taurine |
| No positive or negative human-ratification signal | **20** | Every other remedy |
| Not evidenced as ratified (pending + unknown) | **29** | All except Lemon verbena and Taurine |
| Route-published today | **31** | All remedies |

### A3.2 Tier-board effect

| Tier | Current | After removing only 9 explicitly pending | Requiring affirmative ratification |
|---:|---:|---:|---:|
| S | 1 | 1 | 0 |
| A | 1 | 1 | 0 |
| B | 5 | 3 | 0 |
| C | 7 | 6 | 0 |
| D | 15 | 9 | 1 |
| F | 2 | 2 | 1 |
| **Total** | **31** | **22** | **2** |

The narrow nine-record separation removes 29% of the board. The positive-ratification interpretation removes 94% of it.

### A3.3 Outcome-page effect

None of the nine explicitly pending remedies appears in `OUTCOMES` (`src/lib/outcomes.ts:21-108`). Therefore the narrow separation changes no outcome list:

| Outcome page | Current | After removing 9 explicitly pending | Requiring affirmative ratification |
|---|---:|---:|---:|
| Fall asleep faster | 9 | 9 | 0 |
| Stay asleep | 4 | 4 | 0 |
| Better sleep quality | 9 | 9 | 0 |
| Anxiety-driven insomnia | 9 | 9 | 0 |
| Jet lag & shift work | 2 | 2 | 0 |
| Avoiding next-day grogginess | 3 | 3 | 0 |
| Vivid dreams & REM | 2 | 2 | 0 |

No page **drops** below a useful count under the narrow nine-record separation because no page changes. Two pages already contain only two remedies. Under affirmative ratification, every outcome page becomes empty because neither explicitly ratified remedy (Lemon verbena or Taurine) is mapped to an outcome.

### A3.4 Highest grades

- No explicitly pending remedy is S or A.
- The highest explicitly pending grade is **B**: Iron and Saffron. They are 2 of the 5 B-tier records.
- The only S grade, CBT-I, has a second-review confirmation but no explicit owner-ratification signal.
- The only A grade, Melatonin, has no explicit sign-off signal.
- The other three B grades — Ashwagandha, L-theanine, and Magnesium — also have no explicit owner-ratification signal.
- Therefore **0 of the 7 S/A/B grades is affirmatively owner-ratified in content**.

That is the material cascade: separating the nine known-pending grades does not gut the top of the board, but enforcing the already-decided rule that absence of ratification is not ratification does.

## Implementation handoff

Phase B is implemented on `fix/publication-states`:

- All 31 records have explicit workflow, epistemic, freshness, and validity metadata.
- Default rankings admit only `owner_ratified` + `current` records. Other current records remain
  visible in a separate A–Z “Under author review” group.
- Grade stamps expose one collapsed review label. Epistemic and freshness labels appear only on
  remedy detail pages and the methodology explanation.
- Search, cards, the homepage carousel, outcome pages, compare, change log, Ask, Guide, the label
  corpus, and remedy Open Graph cards carry the collapsed workflow meaning without displaying the
  epistemic or freshness axes.
- Withdrawn/superseded records are excluded from ordinary discovery while their direct archive
  routes remain available.

Verification completed:

- `verify:publication-states`: 31 explicit records
- Ask: 59/59
- Guide: 70/70
- Label checker: passed
- Token policy: passed (32 pre-existing spacing warnings)
- Production build: passed
- `astro check`: one pre-existing error remains at `src/lib/lens/websearch.ts:199`

Copy audit findings corrected:

- Homepage and default social image: “Independent · evidence-graded” → “Single-author · evidence-graded”
- Disclaimer and terms: “independent educational reference” → “single-author educational reference”
- Terms: plural “authors” → singular “author”
- CBN: “a reviewer” and owner-sign-off gate copy → explicit final author-review wording
- Methodology/changelog/disclosure: team-like grading/review wording → author or Somnary wording
- Source-scorecard promotion: bare “Independent” label → explicit no-affiliate/no-brand-money wording

Contextual uses of *independent*, *reviewers*, and *authors* remain where they describe study
replication, systematic-review authors, third-party product testing, or brand-independent lab work;
they do not describe Somnary’s review process.

Remaining handoff work:

1. Capture and compare after screenshots at 375, 768, and 1440 for `/tiers`,
   `/outcome/fall-asleep-faster`, `/r/cbn`, and `/search?q=cbn`.
2. Record the visual differences beside the existing before screenshots under
   `docs/evidence/publication-states/before/`.
3. Optionally fix the unrelated Lens type diagnostic, then rerun `npm run check`.
