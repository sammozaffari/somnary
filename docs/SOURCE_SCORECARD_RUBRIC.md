# Source Scorecard Rubric (v1 — pending owner ratification)

**Status:** `[HUMAN-GATE]` — this rubric is not in force until the owner ratifies it.
**Scope:** scores *products/suppliers* on source-scorecard pages (`/sources/<remedy>`).
It never touches evidence tiers, which grade the *remedy* and live in
`docs/strategy/06-decision-frameworks-operating-system.md` + `/methodology`.
**Design authority:** `docs/plans/2026-07-17-source-scorecards-design.md`.

Every point awarded or deducted must trace to a document a reader can open:
a certification-directory listing, a published assay (pmid/doi), a regulator
record (linked primary document), a captured label, or the brand's own page
(archived with capture date). If there is no document, there is no point —
in either direction.

There is **no composite score and no ranking**. Six dimensions, each 0–5,
each sortable. A ranking is a recommendation, and Somnary does not make
product recommendations (rulebook: forbidden framings).

---

## Dimension 1 — Testing & purity

Measures: whether anyone independent of the brand has verified what is in
the bottle. Does NOT measure: whether the remedy works (that is the evidence
tier's job).

Cumulative, capped at 5:

| Evidence | Points |
|---|---|
| Current USP Verified certification (directory-listed) | +2 |
| Current NSF Contents Certified / NSF Certified for Sport | +2 |
| Current Informed Choice / Informed Sport certification | +2 |
| TGA AUST L(A) listing (ARTG-listed, AU market) | +1 |
| Published independent assay of this product meeting label claim (pmid/doi), no certification held | +2 |

Rules:
- "Current" means verifiable in the certifier's public directory at review
  date. A lapsed certification earns nothing and is noted as lapsed.
- Brand-commissioned COAs do not earn points in this dimension (they count
  under Transparency). Independence is the point of this dimension.
- Score 0 renders as **"no independent testing found"** — a factual absence,
  never an accusation.

## Dimension 2 — Label accuracy

Measures: measured content vs. label claim, from assays that name this
product. Anchor (take the most recent product-naming assay):

| Evidence | Points |
|---|---|
| Assay within ±10% of label claim | 5 |
| Assay within ±20% of label claim | 3 |
| Assay within ±50% | 1 |
| Assay beyond ±50% | 0 |
| Batch-level COA publicly posted (adds to any assay-based score) | +1 (cap 5) |

Rules:
- Multiple assays: use the most recent; note older results in the changelog.
- **No product-naming assay exists → the dimension displays "no assay data"
  and is scored on COA transparency alone, capped at 2** (public batch COA = 2,
  COA on request = 1, neither = 0). The cap exists so absence of data can
  never read as passing. The scorecard states which case applies.

## Dimension 3 — Additives & formulation

Measures: what is in the product besides the active, and whether the dose is
honest. Governed by `src/data/additive-watchlist.yaml` (cited; ratified with
this rubric). Start at 5, deduct:

| Finding | Deduction |
|---|---|
| Watchlist additive, severity `flag` | −1 each |
| Watchlist additive, severity `concern` | −2 each |
| Proprietary blend hiding the per-ingredient dose of the active | −2 |
| Active dose > 2× the remedy's `studiedDose` upper bound | −1 |

Floor 0. Rules:
- Only watchlist entries deduct. Benign excipients (silicon dioxide,
  magnesium stearate) are explicitly not deductible — the watchlist's
  `not_flagged` section is normative. Clean-label theater is not evidence.
- Deductions cite the captured label (image + capture date).
- The `studiedDose` bound comes from the remedy's corpus entry and is cited
  there; the deduction links to it.

## Dimension 4 — Regulatory record

Measures: the manufacturer's compliance history with FDA, FTC, and TGA.
Start at 5, deduct per event; every deduction links the primary regulator
document (warning letter, recall notice, enforcement action, alert):

| Event | Deduction |
|---|---|
| FDA warning letter (manufacturing/labeling of supplements) | −3 |
| Recall (FDA or TGA, this brand's supplement products) | −3 |
| FTC enforcement action (advertising of supplements) | −2 |
| TGA alert / cancellation | −2 |

Time decay: a deduction halves after 3 years from the event date, quarters
after 6 (round to nearest integer; a −3 becomes −2 after 3y, −1 after 6y).
Floor 0.

Rules:
- Events attach to the responsible legal entity. White-label products
  inherit the contract manufacturer's events when the regulator document
  names that facility.
- Wording on the scorecard quotes or tightly paraphrases the regulator and
  always dates the event: "received FDA warning letter, March 2024 (link)".
  Adjectives are banned.

## Dimension 5 — Transparency

Measures: whether a reader can find out who makes the product and verify a
batch. Cumulative, capped at 5:

| Evidence | Points |
|---|---|
| Actual manufacturer identifiable (named facility or own-manufacture; not anonymous white-label) | +2 |
| Batch/lot COA publicly posted per batch | +2 |
| Batch/lot COA available on request (documented response; superseded by public) | +1 |
| Ingredient origin/sourcing disclosed | +1 |

Rule: "on request" is verified by actually requesting one during research;
the response (or 30-day silence) is logged in the dossier.

## Dimension 6 — Marketing honesty

Measures: what the brand's own copy claims. Start at 5, deduct:

| Claim class (brand's own site/label/ads) | Deduction |
|---|---|
| Disease claim ("treats/cures insomnia", "replaces medication") | −2 each |
| "Clinically proven"/"doctor recommended" with no citable trial of this product | −1 each |
| Fear-based ingredient claim about competitors contradicted by evidence | −1 each |

Floor 0. Rules:
- Claims are quoted **verbatim**, with URL and capture date, in
  `source_marketing_flags`. We never characterize; we quote.
- Distinct claims deduct separately; the same claim repeated across pages
  deducts once.
- This dimension penalizes lying about products — including lying *about*
  additives. A brand fear-marketing "no toxic magnesium stearate" loses a
  point here precisely because that additive is not flag-worthy.

---

## Never scored (displayed only)

- **Community read** — sentiment themes from Reddit/open forums, with links
  to example threads. Rendered in a visually walled strip labeled unscored.
  **No scoring path reads community data. Community/anecdote data never
  influences or displays as setting any score** (CLAUDE.md non-negotiable).
- **Used in published trials** — a factual, cited flag when an RCT used this
  exact branded product. It is context, not credit: trial use is not a
  quality endorsement, and the flag's tooltip says so.

## Ratification protocol

1. Scores are drafted mechanically from this rubric by the research
   pipeline; drafts live in `source_scores` with `ratified_at = NULL`.
2. **Unratified scores never publish.** The build reads only the
   `source_scorecards_published` view (WHERE `ratified_at IS NOT NULL`).
3. Only the owner ratifies (`ratified_at`, `ratified_by`). **No agent
   ratifies, edits a ratified score, or re-drafts one without a re-review
   trigger.** This is the same gate class as tier grades.
4. Verdict sentences (the plain-language line on each card) are part of the
   ratified object.

## Re-review triggers

A ratified scorecard goes back to draft when any of these occur:
- new regulator event naming the brand/facility;
- new published assay naming the product;
- certification lapse or new certification;
- formulation/label change (new capture differs from scored capture);
- 12 months since `review_date` (staleness ceiling);
- a corrections-inbox challenge with a document attached.

## Defamation guardrails (binding on all scorecard copy)

- Negative statements only from primary documents, linked.
- Regulator language quoted, not editorialized. Event + date + link; no
  adjectives, no motive attribution.
- Absence of data is stated as absence ("no independent testing found"),
  never insinuation.
- The corrections policy doubles as right-of-reply: a brand that supplies a
  document (COA, cert, corrected label) gets a re-review under the same
  rubric, logged in the changelog like any other change.

## Change control

This rubric is versioned. Any change to point values, dimensions, decay, or
the watchlist is `[HUMAN-GATE]`, bumps the version, and triggers re-scoring
of every published scorecard under the new version before republication.
