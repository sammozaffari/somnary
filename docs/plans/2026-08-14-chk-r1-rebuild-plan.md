# CHK-R1 — Rebuild plan (salvage check · rebuild sequence · launch gate)

> **For Claude:** APPROVED IN FULL by the owner, 14 August 2026 — all three artifacts,
> the CHK-B numbering and mapping, the charter commit at B1, and both deliberate
> re-orders. The ratification block below records the owner's rulings; each decided
> item is also annotated in place. Next sessions unblocked: CHK-E0 (salvage
> extraction) immediately; CHK-E3 sourcing early (medical-review long pole); CHK-B1
> once the owner-exported handoff bundle lands in the repo.

## Ratification record (owner, 14 August 2026)

- **Ambiguous items decided:** (1) ramelteon → SALVAGE as draft for a future
  non-supplement entry; (2) content-index `sourceTarget`/`notes` → KEEP — grading
  provenance feeding E6 ratification; (3) `SAFETY_INTERACTION_THRESHOLD` → WRITE OFF;
  (4) scorecard tier thresholds → the dated code comment IS the record; (5)
  `lens_demand` → KEEP the table, don't reset.
- **Threshold decisions:** full `measuresSleepOutcome` triage for all 133 sources (no
  cited-only fallback); stubs ARE included in the sitemap; the ten-remedy list stands
  as proposed; Rprod.4 to be ratified during the E-track, with the
  no-verdict-sentence fallback only if still open at gate time.
- **Owner actions in flight:** export + deliver the design-system handoff bundle
  (unblocks CHK-B1); begin E-track owner work alongside (rubric E1, bucket
  ratifications E6, Rprod.4).

**Goal:** retire the old presentation layer entirely and regenerate every page from
structured data through the design system, on a greenfield URL structure, with a launch
gate that is a content date rather than an engineering date.

**Session gate (verified this session):** CHK-R0 is merged and pushed — `main` in sync
with origin (0/0), repo-wide `PENDING-MERGE` grep returns zero.

---

## Divergences found (flagged, not silently fixed)

1. **The rebuild charter is not in REDESIGN.md.** The owner's brief describes it as
   "already recorded in REDESIGN.md's rebuild charter". It is not: REDESIGN.md's v5
   banner covers the re-scope (design done through Step 8, Steps 9–15 active, editorial
   fill the critical path) but nowhere states full presentation-layer retirement,
   nothing-migrated / nothing-redirects, or the greenfield URL scheme
   (`/remedies/{slug}`, `/products/{brand-slug}-{product-slug}`, `/brands/{slug}`,
   `/problems/{slug}`, `/safety`, `/how-we-grade`). No committed doc or prior session
   contains it (episodic search confirms). **Proposed fix on approval:** commit the
   charter verbatim into REDESIGN.md as a v6 amendment in the CHK-B1 session — not
   re-added here per instruction.
2. **No CHK-B or CHK-E numbering exists anywhere in the repo.** BUILD_CHECKLIST.md
   carries CHK-Rfill.1–5, CHK-Rpage.1–2, CHK-Rprod.1–4, CHK-Rui.1–3, plus a pointer
   that "Steps 9–15 remain the active build order". The only prior CHK-B1 reference is
   the owner's spoken confirmation at CHK-R0 (Onest swap lands with CHK-B1). So there is
   no existing CHK-B numbering to conflict with — this plan **proposes** the numbering
   and a mapping from the existing CHK-R\* items (tables below). Approving this plan
   approves the re-sequencing; the checklist edit itself happens at CHK-B1.
3. **Two deliberate re-orders vs REDESIGN's step order** (flagged per the brief):
   share images / OG move up from Step 15 into launch SEO (first crawler contact), and
   the citation-popover component rides the remedy page (first use) rather than waiting
   for its own Step-14 slot. Details in Artifact 2.

---

# Artifact 1 — The salvage check

One pass over the old presentation layer (`src/pages`, `src/components`, `src/layouts`,
`src/styles`, presentation-side `src/lib`), three thorough sweeps, PMIDs verified
against the collections by grep. After extraction of the list below, deletion at
cutover is safe.

## 1a. Salvage list — data trapped in pages, extract as drafts

All carry sources and are **absent from the collections** (verified). Proposed
destination: a new **`src/content/salvage/` draft store** (one file per topic,
frontmatter `status: draft`, source ids carried; excluded from builds; consumed later
by the problem-page and safety-page content sessions, then retired). Extraction is the
first act after approval (proposed **CHK-E0**), not this session.

**Behavioral / environmental evidence** (from `sleep-habits.astro`; feeds problem pages
and the "non-supplement things with better evidence" beat) — file:line · claim · source:

| # | Location | Claim (short) | Source |
|---|---|---|---|
| 1 | sleep-habits.astro:252 | Caffeine taken even 6 h before bed disrupts sleep (controlled trial) | PMID 24235903 |
| 2 | sleep-habits.astro:320 | Alcohol shortens onset but delays first REM at all doses; second half of night disrupted | PMID 23347102 |
| 3 | sleep-habits.astro:377 | eReader before bed vs print: melatonin suppressed, onset lengthened (P=0.009), clock phase-delayed | PMID 25535358 |
| 4 | sleep-habits.astro:404 | Room light <200 lux pre-bed delayed melatonin onset in 99% of participants; ~90 min shorter production | PMID 21193540 |
| 5 | sleep-habits.astro:433 | Sleep regularity predicts mortality more strongly than duration (observational) | PMID 37738616 |
| 6 | sleep-habits.astro:543 | +10 dB night traffic noise ≈ 2.5× odds of high sleep disturbance | PMID 35857401 |
| 7 | sleep-habits.astro:578 | Regular exercise: small benefit to sleep time/efficiency, moderate to quality (meta-analysis, 66 studies) | PMID 25596964 |
| 8 | sleep-habits.astro:578 | Evening exercise does not harm sleep; slight slow-wave increase (meta-analysis, 23 studies) | PMID 30374942 |

**Population / drug-class safety evidence** (from context pages; feeds the safety page
and future non-supplement entries):

| # | Location | Claim (short) | Source |
|---|---|---|---|
| 9 | older-adults.astro:99 | Diphenhydramine/doxylamine listed AVOID for older adults, 2023 AGS Beers Criteria | PMID 37139824 |
| 10 | older-adults.astro:146 | Sedative-hypnotics 60+: ~25 min benefit vs NNH 6 / NNT 13; cognitive events 4.78×, psychomotor 2.61× | PMID 16284208 |
| 11 | otc-antihistamines.astro:169 | Tolerance to diphenhydramine sedation complete by day 3–4 (RCT) | PMID 12352276 |
| 12 | otc-antihistamines.astro:180 | Cumulative anticholinergic exposure → dementia HR ~1.54 (observational, dose-response) | PMID 25621434 |

**Structured mappings trapped in lib code** (no external sources of their own; extract
to the data layer so the guide/problem rebuild reads data, not retired code):

| # | Location | What | Destination |
|---|---|---|---|
| 13 | src/lib/outcomes.ts | The 7-outcome → remedy mapping (single source of truth) | data layer (e.g. `src/data/outcomes.yaml`) |
| 14 | src/lib/habits.ts | HABIT_SUMMARIES — 8 compliance-reviewed habit one-liners + strength labels (citations live in items 1–8 above) | data layer, cross-referenced to salvage items 1–8 |
| 15 | products.astro:299 | Melatonin is prescription-only in Australia (TGA regulatory statement) | salvage draft, cite ARTG/TGA properly at extraction |

## 1b. Ambiguous — owner decides (not classified)

1. **Ramelteon page / AASM guideline split** (ramelteon.astro:71): melatonin.mdx holds
   PMID 27998379 for the "against OTC melatonin" half; the "weak recommendation FOR
   ramelteon" half is unique to this page. Ramelteon is a prescription drug outside the
   remedy corpus — salvage as a draft for a future non-supplement entry, or write off
   with the page? **Decided 2026-08-14: SALVAGE as draft (future non-supplement
   entry) — joins the CHK-E0 extraction list as item 16.**
2. **content-index.json `sourceTarget` + `notes` fields** — human-authored memos on why
   each planned grade exists (e.g. magnesium: "the honesty test case…"). Canonical
   grading provenance (keep, feeds bucket ratification) or scratch notes (write off)?
   **Decided 2026-08-14: KEEP — grading provenance feeding E6 ratification.**
3. **`SAFETY_INTERACTION_THRESHOLD = 3`** (src/lib/evidence-map.ts:59) — comment says
   chosen from the observed 0–5 interaction distribution. Empirical analysis worth
   preserving, or a retired-map design choice that dies with the Evidence×Safety map?
   **Decided 2026-08-14: WRITE OFF.**
4. **Source-scorecard tier thresholds** (src/data/source-scorecards/tiers.ts:71–76) —
   code says "owner-ratified 2026-07-21". The code IS in the surviving data layer; is
   there an external ratification memo that should be cross-referenced, or is the code
   comment the record? **Decided 2026-08-14: the dated code comment IS the record.**
5. **Lens demand log** (Supabase `lens_demand`) — aggregate lookup counts that were
   meant to drive research prioritisation. Load-bearing (keep the table) or reset?
   **Decided 2026-08-14: KEEP the table, don't reset.**

## 1c. Write-off list (one line each; grouped)

- **Seven melatonin/context article pages** (anxiety-and-sleep, jet-lag-shift-work,
  medications-and-sleep-aids, melatonin-children, melatonin-dose-timing,
  melatonin-gummies, melatonin-long-term): every cited fact verified already held in
  melatonin.mdx / kava.mdx / cbt-i.mdx; the prose is authored copy in the old voice.
- **when-to-see-a-doctor, safety, guide, start-here, sleep-blends, outcome/[slug]**:
  navigational/routing/explainer copy; the one citation (27998379) already held.
- **CBT-I benchmark trio in sleep-habits** (PMIDs 27136449 / 33164742 / 26054060):
  verified already in cbt-i.mdx — only the comparison *framing* dies.
- **index, search, tiers, compare, lens, label-checker, changelog, request-a-review,
  submit-a-claim, account, dispatch**: UI copy, live-derived stats, retired-model
  surfaces (S–F machinery, Lens headline surface, label-checker hero, stat rows).
- **Melatonin ">5 mg" rule constant** (src/lib/label-rules.ts:410): the underlying
  "studied 0.5–5 mg" fact is held in melatonin.mdx `doses[]` (verified) — the new build
  derives the rule from the collection instead of a constant.
- **All components + layouts + tiers.ts / evidence-gates.ts / evidence-map.ts /
  remedy-state.ts / compare-\* / cite.ts / label-data.ts**: presentation logic and
  authored UI strings; band labels and gate glossaries are derived from the retired
  S–F model; no unsourced factual claims trapped (SafetyCallout itself is clean — the
  drift lives in remedy `safety[]` data, which is CHK-E3's job, not salvage).
- **Legal pages** (privacy, terms, disclaimer, disclosure): must be rewritten under
  legal review for the new site, never migrated (HG).
- **styles/global.css + OG pipeline visuals**: v3 oxblood tokens + Instrument Sans —
  superseded wholesale by the handoff bundle at CHK-B1.

## 1d. Load-bearing confirmation

Nothing else in the old presentation layer is load-bearing. What survives does so
**outside** it: the 31-remedy collection + schema/gates (`content.config.ts`,
`check-source-fields/displaynames/fonts/tokens`), `src/data/` (source-scorecards ≈50
products — the sole holder of product research; additive-watchlist.yaml, sourced;
content-index.json pending ambiguous #2), the citation resolver CI, the Supabase schema
+ API endpoints (subscribe / submit-claim / nominate / auth / rate-limit / saved-maps),
the ask/lens engines (engines, not surfaces, per C5), and the satori OG machinery
(re-skinned at CHK-B16). The ask/lens **frontends** die with the presentation layer;
the endpoints idle until a post-launch surface decision. After CHK-E0 extraction,
deletion at cutover is safe.

---

# Artifact 2 — The rebuild sequence (proposed CHK-B track)

A fresh app shell in Astro idiom. Handoff-bundle values and behaviour are
authoritative, transcribed into DESIGN_SYSTEM.md (never referenced or pasted as JSX);
named tokens only; reject-don't-launder. Components are built at first use (standing
rule), so primitives ride the first page that needs them. Every chrome/template item
carries the mandatory rendered-visual + keyboard pass at 390/768/1440.

**Blocking fact:** the handoff bundle is not in the repo (only a reference PNG).
**CHK-B1 cannot start until the owner delivers the bundle export.**

| Item | Scope | Template source | RULES.md rules enforced | Depends on |
|---|---|---|---|---|
| **CHK-B1** | Tokens + both themes: transcribe bundle → DESIGN_SYSTEM.md; day + dusk token sets; Onest self-hosted woff2 (`--font-sans`); letterform-"S" favicon/wordmark assets (replace ALL icon assets, add manifest/apple-touch); commit the rebuild charter to REDESIGN.md | Bundle: design system (REDESIGN Step 4) | Identity (type, mark, dates); Colour (colour-means-data, no `--accent`, gradient ban); Accessibility floors | Bundle delivery; HG on any missing token |
| **CHK-B2** | App shell: Base layout, three-item nav (Remedies · Products · Safety) + ever-present search field (form-GET shell; engine at B14), breadcrumbs ("‹ Parent" mobile), footer with the one quiet independence sentence, disclaimer band | Bundle: chrome across all pages (Steps 5–8) | Interface economy (3-item nav, breadcrumbs-as-back); Language (banned phrases, sentence case); a11y floors | B1 |
| **CHK-B3** | Product + brand schema build: content types per CLAUDE.md model incl. CHK-Rprod.1 fields and CHK-Rprod.2 deliveryForm/releaseProfile; migrate ~50 scorecard products with honest `assessment_state`; brand type + recalls[] | REDESIGN Step 3 + C2 | Products (controlled vocabulary, form ≠ release); three-signals separation in schema | HG (schema; Rprod.2 §7 owner decisions owed) — parallel with B1/B2 |
| **CHK-B4** | `/go/{id}` redirect + click log (no personal data) + build check failing on raw retailer URLs in content | REDESIGN Step 9 / A3 / C3 | Products (links never commercial-ordered) | B3 (product ids) |
| **CHK-B5** | **Remedy page** `/remedies/{slug}` + first-use primitives: bucket badge (shape+colour+plain sentence), safety flag, nested-bar study field at hero+thumbnail (Step 11 rescoped), "see the study" chip + popover (Step 14 component half), safety callout, plain stat line, dose section (studied vs market), sources list, sticky question-form contents. **Includes the honest-stub state as a template requirement (Artifact 3).** | Bundle: melatonin remedy page (Step 6) | Evidence display (whole section); structure (serious flag outranks; no PairedVerdict on own page); Language (question headings, popover-only jargon); Colour | B1–B2 |
| **CHK-B6** | **Products list** `/products`: product card (3 completeness states), checks-passed fixed order, chrome-by-scale (CHK-Rui.1) | Bundle: product browse (Step 7) | Interface economy (chrome-by-scale, no sort controls, ✓ ownership); Products | B3, B5 (badges) |
| **CHK-B7** | **Product page** `/products/{brand-slug}-{product-slug}`: paired verdict first, four checks with working shown, per-ingredient bucket badges → remedy links, additive flags, dose diagram from per-remedy dose context, where-to-buy row via `/go` (identical treatment, warning intact), placeholder-imagery object, no-retailer state, decision narrative (no TOC, one "Where to buy ↓" jump) | Bundle: product page (Step 7) | Products (whole section); structure #2; three-signals | B3, B4, B5; verdict line gated on CHK-Rprod.4 (HG) |
| **CHK-B8** | **Remedies browse** `/remedies`: four bucket groups, deliberate sparse-top note, outcome filters + Grouped/A–Z toggle (Rui.1 carve-out) | Bundle: browse (Step 8) | Interface economy; Evidence display (thumbnails) | B5 |
| **CHK-B9** | **Home** `/`: one-sentence hero + search field as largest object, quiet safety route, six situation cards, six most-asked remedy cards, one honest number + chip, footer | Bundle: home (Step 5) | Language (no manifesto/stat row); A6 IA | B5, B8 |
| **CHK-B10** | **Safety page** `/safety` (CHK-Rpage.1): triage by situation, per-situation interactions, derived flags listing, escalation block | Bundle: safety page (Step 8) | Colour (amber register); Language | B5; content = E3 + medical-review HG |
| **CHK-B11** | **Brand page** `/brands/{slug}` (CHK-Rpage.2): derived count summary (never a grade), product rows, conditional recalls row | Bundle: brand page (Step 8) | Products; interface economy | B3, B6; HG (framing) |
| **CHK-B12** | **Problem page** `/problems/{slug}`: situation explainer, calm see-a-doctor prominence, honest remedy ordering, doesn't-hold-up reveal, non-supplement comparisons (salvage items 1–8) | Bundle: problem page (Step 8) | Language; evidence display | B5, B8; content = E7 |
| **CHK-B13** | **How-we-grade** `/how-we-grade`: deep-linked from every bucket badge + footer; layered plain→technical; rubric pointer | Bundle: how-we-grade (Step 8) | Language (the one page allowed terminology, introduced plainly) | B5; E1 ratified before "final" wording |
| **CHK-B14** | **Search** (Step 12 / CHK-Rui.2): one index (remedies/products/brands/problems/safety), answer/routes/more tiers, category-count rule, product-intent rule, no-match/did-you-mean; browse works without JS | Bundle: search open state (Step 5) | Interface economy (never a member sample; never commercially ordered) | B3, B5–B12 |
| **CHK-B15** | **Dusk mode mechanics** (Step 13): sunset keying, stored override, prefers-color-scheme fallback, no-flash head script | Bundle: dusk set (Step 4) | Colour (designed night theme; the one gradient exception); AA in dusk | B1 (tokens exist from B1; every component verified both themes) |
| **CHK-B16** | **Launch SEO hygiene** (first crawler contact — deliberately promoted from Step 15): canonicals, sitemap, robots, per-page metadata, OG/share images via satori+resvg from the nested-bar components, JSON-LD only where honest (re-derived, not migrated), citation-resolver last-verified write-back (Step 14 CI half) | C3 (share images) | Language rules apply to meta/OG text | B5–B13; per-page meta is ALSO an acceptance criterion inside each page item |
| **CHK-B17** | **Freshness** (Step 15): 3-year flag / 6-year quarantine, "last checked {date}" site-wide | C3 | Identity (date format) | B3, B7 |
| **CHK-B18** | **Cutover**: delete the old presentation layer (safe per Artifact 1 + CHK-E0), greenfield URLs only, all validation gates live (Rui.3: placeholder-fails-build, safety-source-id, name-strength, deliveryForm vocab, additive-flag source), full rendered-visual pass, **launch gate (Artifact 3) satisfied** | — | Everything | all above + gate |

**Numbering conflicts flagged (not silently resolved):**
- No CHK-B numbering pre-exists (divergence #2) — this table is the proposal.
- Existing items mapping: CHK-Rpage.1→B10 · CHK-Rpage.2→B11 · CHK-Rprod.1/.2→B3 ·
  CHK-Rprod.3→B7 (+E5) · CHK-Rprod.4→HG gate on B7 · CHK-Rui.1→B6/B8 · CHK-Rui.2→B14 ·
  CHK-Rui.3→B18 · REDESIGN Steps 9/10/11/12/13/14/15 → B4/B1/B5/B14/B15/B5+B16/B16+B17.
  On approval, BUILD_CHECKLIST.md is re-sequenced to this and the "Steps 9–15 remain
  the active build order" note is superseded.
- Deliberate order changes: share-images/OG promoted (Step 15 → B16); citation popover
  built at first use on the remedy page (Step 14 → B5+B16); search field shell ships
  with the nav at B2 while the engine lands at B14.

---

# Artifact 3 — The launch gate (minimum honest launch)

The placeholder-fails-build and safety-requires-source-id gates make launch a content
threshold. Engineering (CHK-B) can be done and the site still must not cut over until
the content below exists. **The cutover date is a content date.**

## Proposed CHK-E track (maps CHK-Rfill.\* + new items)

| Item | Scope (maps from) | HG? |
|---|---|---|
| CHK-E0 | Salvage extraction per Artifact 1 (drafts, never promoted without review) | — |
| CHK-E1 | Source-quality rubric ratification (Rfill.1) | **HG** |
| CHK-E2 | `measuresSleepOutcome` triage for all 133 sources + direction/sampleSize fill for full-page remedies; re-derive the RULES.md audit line from `sources[]` at the melatonin pilot (Rfill.2) | — |
| CHK-E3 | Safety copy sourcing — every safety string carries a source id (Rfill.3) — **then medical review of all launch-visible safety copy** | **HG (medical)** |
| CHK-E4 | `howToTake` dose protocols from studies (Rfill.4) | — |
| CHK-E5 | Documented-concern additive list, WHO-2023 sweetener citation verified (Rfill.5; seed = additive-watchlist.yaml, already sourced) | — |
| CHK-E6 | Bucket migration + ratification, all 31 remedies (S–F → four buckets; safety flag confirmed alongside) | **HG (every grade)** |
| CHK-E7 | Problem-page content, sourced (consumes E0 drafts) | — |
| CHK-E8 | Product data fill for launch products (four checks, prices + checked dates, honest assessment_state) | — |
| CHK-E9 | Legal pages rewritten for the new site | **HG (legal)** |

## The threshold (concrete proposal)

1. **Melatonin hub complete** — full remedy page, its products assessed, its problem
   cross-links live. Depends: E1, E2 (pilot done: 8 cited / 5 measured / effect data
   complete), E3, E4, E6 (melatonin bucket), E8.
2. **Ten remedies with full pages** — proposed list = the six most-asked (melatonin,
   magnesium, valerian, L-theanine, ashwagandha, chamomile) + saffron, iron, reishi
   (coverage leaders: 7–8 sources each) + kava (the worked safety example). Owner may
   swap members. Depends: E1, E2 (direction/sampleSize for these ten), E3, E4, E6.
3. **All 31 remedies render at least the honest stub** — depends: **E6 for all 31**
   (every stub shows a bucket badge → every bucket is ratified; currently only 2 of 31
   reviews are owner-ratified) and **E2's triage phase for all 133 sources** (today
   only melatonin + lemon-verbena + taurine are adjudicated; 29 remedies carry
   `measuresSleepOutcome: null`, so no honest bar can render for them). Triage is a
   bounded editorial job (~116 abstracts, boolean + status only). *Fallback if the
   owner prefers a faster cutover: the stub bar renders the cited count only, with
   "we're still checking which of these measured sleep" — honest but weaker; owner's
   call, default is full triage.* **Decided 2026-08-14: full triage of all 133
   sources; no cited-only fallback.**
4. **Safety page sourced and medically reviewed** — depends: E3 + its medical-review
   HG, B10. **This is the likeliest long pole.**
5. **Documented-concern list seeded** — depends: E5. Blocks any non-neutral additive
   flag on product pages (gate: flag without source id fails the build).
6. **Product layer honest at launch** — the ~50 migrated products live with honest
   `assessment_state`; the melatonin set fully assessed (E8). The "worth buying"
   verdict line renders **only if CHK-Rprod.4 is ratified**; otherwise product pages
   ship the four checks with working shown and no verdict sentence (owner decides
   which at gate time).
7. **Legal pages rewritten** (E9) — footer links must resolve at cutover.

## The honest-stub template (a CHK-B5 template requirement, not a content fallback)

A remedy without its full fill renders, **from structured data only**: `displayName` ·
bucket badge with its permanent plain sentence · nested bar from real `sources[]`
counts with its standalone caption · safety flag (serious-concern visually outranking
the bar) · one plain forward line — proposed copy: **"The full write-up is coming. The
grade and safety flag above are current."** · review date + correction link ·
breadcrumbs + per-page metadata/OG like any page. Never old copy, never body prose,
and any `"[Placeholder"` string fails the production build. Stubs are included in the
sitemap (they carry the site's core answer; flag to owner if thin-content SEO caution
is preferred). **Decided 2026-08-14: stubs in the sitemap. The ten-remedy list also
stands as proposed, and Rprod.4 is ratified during the E-track — the
no-verdict-sentence fallback applies only if still open at gate time.**

## What is blocked on humans, not engineering

- **Medical review** (E3 gate): safety page, per-remedy safety strings, pregnancy/
  children boundaries — the long pole; start E3 sourcing immediately after approval.
- **Owner HG**: bucket ratification ×31 (E6), rubric (E1), product verdict rule
  (Rprod.4), brand-page framing (B11), missing tokens (B1), legal (E9).
- **Owner delivery**: the design-system handoff bundle export (blocks CHK-B1, and with
  it the whole B track).

---

*Session ends here per the brief. CHK-B1 and CHK-E1 are separate sessions, both gated
on owner approval of this plan.*
