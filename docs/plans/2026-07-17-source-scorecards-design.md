# Source Scorecards — design (ratified in brainstorming session 2026-07-17)

**Status:** owner-validated design; implementation not started.
**Pilot:** melatonin.
**Gate class:** `[HUMAN-GATE]` — brand verdicts are gated like tier grades, always.

## What this is

A per-remedy "Where to source it" page that rates **products/suppliers** (not the
remedy — evidence tiers already do that) on a six-dimension scorecard, with
direct non-affiliate links. Modeled on the methodology-first trust pattern of
shoe-review sites (RunRepeat): publish the rules and the raw measurements, and
the verdict earns trust on its own.

Rulebook fit: this is **not** an affiliate "best product" page (deprioritized
pattern) — no affiliate links, no brand money, no composite ranking, no #1
crown. It passes the rulebook's own test: *"Would this still be credible with
no affiliate revenue?"* — there is none, ever (D2).

## Owner decisions made in this session

1. **Verdict shape: dimension scorecard, no #1.** Per-dimension dot scores +
   plain-language verdict per product. Users can sort by any dimension; we
   never crown a single "best" (a ranking functionally says "take this one" —
   forbidden framing).
2. **Lab testing: aggregate now, own tests later.** Phase 1 scores use only
   verifiable third-party data (certifications, published assays, regulator
   lab findings). A self-commissioned ISO-17025 assay pilot is a separate,
   later, human-gated phase. The testing dimension always says whose test it was
   (real-promises rule: never imply testing we didn't do).
3. **Pilot: melatonin.** Best-documented label-accuracy failures in the space
   (measured content −83% to +478% of label claim — Erland & Saxena 2017,
   J Clin Sleep Med; replicated for gummies, JAMA 2023). The "why sourcing
   matters" narrative is already peer-reviewed.
4. **Rubric: six scored dimensions as listed below**, sentiment and
   trial-usage shown but never scored.
5. **Storage: Supabase from day one** (owner override of the repo-YAML
   recommendation). Auditability preserved via repo-side migrations + committed
   build snapshots (see Storage).

## The rubric — six scored dimensions (0–5, every point traceable to a document)

1. **Testing & purity** — third-party certification (USP Verified, NSF,
   Informed Choice, TGA AUST L), published COAs; later our own assays.
2. **Label accuracy** — published assay results vs. label claim; COA batch
   transparency.
3. **Additives & formulation** — checked against a maintained, cited additive
   watchlist (e.g. titanium dioxide, artificial dyes, proprietary blends hiding
   doses) plus mega-dosing beyond the remedy's `studiedDose`.
4. **Regulatory record** — FDA warning letters, recalls, TGA alerts, FTC
   actions; time-decayed (older issues weigh less).
5. **Transparency** — batch-level COAs public; actual manufacturer identifiable
   (vs. white-label); sourcing disclosed.
6. **Marketing honesty** — the brand's own copy checked against an FTC-style
   forbidden-claims list ("cures insomnia", "clinically proven" with no trial).

**Displayed, never scored** (community non-negotiable):
- **Community read** — sentiment themes from Reddit/open forums with links to
  example threads; visually walled, labeled unscored.
- **Used in published trials** — factual flag when an RCT used that exact
  branded product (cited).

**Inverse content:** a cited **"Claims to ignore"** section on the same page —
viral dosing myths, influencer product claims, pseudoscience marketing, each
debunked with sources.

Scoring is mechanical where possible (published rubric: cert present = defined
points). Draft scores + verdicts go to the owner as a `[HUMAN-GATE]` review.
No agent ratifies a score.

## Data gathering pipeline (per remedy)

Everything lands as auditable dossiers in `docs/research/sources/<remedy>/`
before any score is drafted.

- **Stage 0 — Product universe.** ~10–15 candidates with documented inclusion
  criteria (single-ingredient first; US + AU availability; deliberate mix of
  certified and uncertified products). The universe list itself is human-gated
  so selection can't be accused of cherry-picking.
- **Stage 1 — Hard data harvest** (parallel agents):
  - Certification directories: USP Verified, NSF, Informed Choice, TGA ARTG.
  - Regulator records: FDA warning-letter + recall databases, CAERS adverse
    events, TGA alerts, FTC actions.
  - Published brand-named assays via PubMed; ConsumerLab/Labdoor results
    **cited with attribution, never republished** (proprietary).
  - Label panels captured from manufacturer sites, parsed against the additive
    watchlist.
  - ClinicalTrials.gov / PubMed for branded products used in trials.
- **Stage 2 — Sentiment read.** Reddit public API and open forums only.
  **Facebook and Amazon review scraping are excluded — ToS violations** — and
  the methodology page says so. We summarize themes with links to example
  threads (same pattern as `communityRead`); we never launder star ratings
  into data.
- **Stage 3 — Scoring.** Rubric applied; draft goes to owner as
  `[HUMAN-GATE]`.
- **Stage 4 — Publication.** Page + methodology + changelog + review date +
  corrections link.

## Storage (owner decision: Supabase canonical from day one)

- Reuse the CHK-4.2 Supabase project (env-gated; owner holds keys).
- Tables (one row = one product-for-a-remedy): `source_products`
  { slug, remedy_slug, brand, product_name, form, dose, serving_type,
  links (manufacturer + retailers, clean URLs), review_date },
  plus child tables: `source_certifications`, `source_assays`
  { source: pmid|doi|our-lab, claimed, measured, year }, `source_regulatory`
  { type, agency, date, url, summary }, `source_additives`,
  `source_marketing_flags`, `source_scores` { six dimensions, verdict,
  **ratified_at / ratified_by — unratified rows never publish** },
  `source_sentiment` (separate table = the "separate store" wall),
  `source_changelog`.
- **Auditability pairing (required):** schema migrations checked into git, and
  a build-time JSON snapshot committed with each content PR so citation-auditor
  and CI have a diffable target. Citations remain data.
- Site stays fully SSG: the Astro build pulls from Supabase at build time;
  nothing client-fetched. No new runtime infra.
- Later dynamic piece (only one): a scheduled link-rot/freshness checker.

## Presentation

- Route: `/sources/<remedy>` (pilot `/sources/melatonin`), linked prominently
  from the remedy hub. Methodology at `/about/source-methodology`, published
  with the pilot.
- Page order: cited "what we found" narrative → scorecard grid (one card per
  product: six dot-rows readable without color alone, plain-language verdict,
  direct links with disclosure line **"No affiliate links — Somnary earns
  nothing if you buy"**, `rel="nofollow"`) → walled community-read strip →
  "Claims to ignore" → review date + corrections link.
- One island: sort/filter (by dimension, certification, form, additive-free).
- Tokens only; scorecard visuals must not be confusable with evidence-tier
  grades (design-guardian check).

## Legal risk (named, not hand-waved)

Negatively scoring named brands is the most defamation-exposed content on the
site. Mitigations baked in:
- every negative datum links to a primary document;
- flag language stays factual ("received FDA warning letter, March 2024" —
  never "shady"); regulator language quoted, not paraphrased;
- corrections policy doubles as right-of-reply;
- methodology page + first scorecard set are `[HUMAN-GATE]`; this feature
  class sits alongside tier grades in the gate list permanently.

## Phasing

- **A** — methodology + rubric doc + additive watchlist + Supabase schema
  (owner ratifies all four).
- **B** — melatonin deep-research fan-out; dossiers to
  `docs/research/sources/melatonin/`.
- **C** — data entry + page build + sort/filter island.
- **D** — reviewer agents (citation-auditor, compliance-reviewer,
  design-guardian) → owner gate → publish pilot.
- **E** — repeat per remedy; own-lab-assay pilot as its own later gated phase.
