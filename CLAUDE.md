# CLAUDE.md — Somnary agent operating contract (v2, post-pivot)

## LOCKED DECISIONS (owner-ratified 2026-07-06 — do not revisit, do not re-ask)
- **D1 Framework: Astro.** SSG-first, content collections for the corpus, islands
  only where interactivity is required (label checker, compare tool, assistant).
- **D2 Monetization: tools-first, reader-funded.** No membership paywall on the
  wiki. Revenue candidates in order: clinician handout exports, label-checker
  pro features, supporter tier. No brand money, no paid placement, and no score
  ever influenced by a commercial relationship. Any ads must pass the ad
  framework in the rulebook (source-backed, no treatment claims). *(Amended by
  owner 2026-08-08 per REDESIGN A2/A3: the flat "no affiliate, ever" ban is
  dropped — retail links are allowed on every product via `/go/{id}`, and
  affiliate tags are a possible future, but they never change a score or the
  order of results. See non-negotiable 1.)*
- **D3 Brand: "Somnary", capitalized**, in prose, UI, and wordmark. Retire all
  lowercase-only styling; update any doc or design asset that says otherwise when
  touched. *(Amended by owner 2026-07-08: the trailing-period mark is dropped —
  the wordmark is "Somnary" (no period), and the crescent-moon disc is the brand
  symbol. The earlier `Somnary.` trailing-period form is retired.)* *(Further
  amended by owner 2026-08-14 — brand **mark** superseded: the symbol is now a
  **capital-"S" letterform** (Onest 600, outlined paths, drawn at 16px first), NOT
  the crescent-moon disc. Mark chronology, three artifacts: (1) the crescent-moon
  disc — this one DID pass through a design track: logo-brief rounds 1–3
  (`docs/plans/2026-07-14-logo-brief.md`; commits `9576e6d` "moon-counter" →
  `ddc7acf` "moon out of the O" → `f66813e` "integrated crescent, narrowed"),
  shipped owner-directed as the standalone nav mark in PR #33 (`f6cb3e7`); (2) a
  dot-field favicon drawn from the study-field scatter, retired when the scatter
  was retired; (3) the capital-"S" letterform, which supersedes both. The crescent
  is retired on **charter grounds**, not only coherence: Somnary systematically
  removes sleep-cliché costume (no literal moons/stars in the study field, lavender
  palette and dusk-sky accent cut for the same reason) and a crescent brand mark is
  that costume at maximum visibility. See RULES.md Identity. The live nav wordmark
  and favicon still render the crescent until the letterform redraw lands — the
  redraw was never code on the type branch (merged at CHK-R0); it arrives from
  the design handoff bundle with the design-system wiring, REDESIGN Step 10.)*
- **D4 Stack builder: killed.** Never build combine-your-stack features or CTAs.
  Salvage only the interaction-warning engine, surfaced through the compare tool
  and safety router. AI never recommends supplement combinations.
- **Rulebook: `/docs/strategy/06-decision-frameworks-operating-system.md` is
  binding** for all content, design, ads, AI framing, and product decisions.
- **Design charter: `/docs/RULES.md` is binding** for identity, colour,
  typography, evidence display, product/additive presentation, interface economy,
  navigation, and accessibility floors — the design-side companion to the
  rulebook. Where a design, IA, or user-facing-copy question isn't settled in this
  file, RULES.md settles it. The repo copy is canonical: if the Claude Design
  handoff bundle's copy ever diverges, the repo wins and the bundle is updated to
  match (see the provenance note at the top of RULES.md).

Somnary is an independent, evidence-graded reference for natural sleep remedies.
This repo is run by an agent team in Claude Code. The human owner reviews at
phase boundaries and human-gated items only. This file is the constitution;
`/docs/strategy/06-decision-frameworks-operating-system.md` is the standing
rulebook for every content, design, AI, ad, and product decision.

## Precedence of documents
1. This file (non-negotiables + gates).
2. `/docs/strategy/` package (01–07) — current strategy. Where it conflicts with
   PROJECT_PLAN.md, the strategy package wins.
3. `/docs/DESIGN_SYSTEM.md` — the ONLY source of visual tokens (evidence-teal
   system from the v3 prototype). Never invent a value; if a token is missing,
   open a `[HUMAN-GATE]` question.
4. `/docs/PROJECT_PLAN.md` — historical rationale; superseded sections are marked.
5. `/docs/BUILD_CHECKLIST.md` — the work queue. One item per session.

> **Tokens — single source of truth (resolved 2026-08-08, REDESIGN C1 #5).**
> DESIGN_SYSTEM.md stays the ONLY source of token values. Claude Design's handoff
> bundle is TRANSCRIBED into DESIGN_SYSTEM.md — one in-repo, version-controlled
> file that shows up in diffs, in a stable format — never referenced or rendered
> from directly. If the bundle and DESIGN_SYSTEM.md ever disagree, the committed
> DESIGN_SYSTEM.md wins.

## Build order (amended 2026-08-08 — REDESIGN C5)
The centre of gravity is now products + search, not the wiki-plus-AI stack the
original plan front-loaded. Priority order:
- **Moved forward (build next):** the product & brand layer, the `/go/{id}`
  retail redirect, product search across remedies / products / brands / problems,
  and the two-axis evidence-bucket × product-score model (Reference A4).
- **Moved back (do NOT build yet):** membership / paywall, the Somnary Lens as a
  headline surface (it already exists as an engine — no new headline work),
  community reports, and the stack builder (still killed per D4). The label
  checker survives only as the not-in-database fallback, never a hero feature.

BUILD_CHECKLIST.md remains the work queue; where its phase order conflicts with
this note, this note wins until the checklist is re-sequenced.

## NON-NEGOTIABLES (violating any of these breaks the product — halt and escalate)
- No brand sponsorship, no paid placement, and no score influenced by any
  commercial relationship. Retail links are permitted on every product regardless
  of its score, routed through `/go/{id}` (never hardcoded into content) and never
  ordered by anything commercial — the "where to buy" row looks identical on a
  product we rate well and one we advise against, with the warning intact above
  it. Affiliate tags may be added later as a one-file change at `/go`; they never
  influence a score or a ranking, and every product is listed and assessed whether
  or not it carries a commercial link.
- Every factual health claim cites a real, resolvable source (PMID / DOI /
  ClinicalTrials.gov). The CI citation resolver must pass; the citation-auditor
  agent must confirm each source supports the claim as written.
- Community/anecdote data never influences or displays as setting an evidence bucket.
- Weak evidence is shown and labeled weak. The evidence bucket reflects published
  HUMAN evidence.
- Safety, interactions, and contraindications are prominent on every remedy and
  decision page; "educational, not medical advice" appears near decisions, not
  only in the footer. Be conservative on pregnancy, children, drug interactions.
- **Plain language is a non-negotiable (Reference A5).** Write like a well-informed
  friend who happens to be a pharmacist explaining across a kitchen table — never
  performing rigor. Technical vocabulary (meta-analysis, randomised controlled
  trial, placebo-controlled, effect size, bioavailability, standardised extract)
  is banned from body copy and lives only inside the "see the study" popover, the
  methodology page, and opt-in expansions. Acronyms are spelled out on first use
  every page; PMID and DOI appear only inside the popover ("see the study").
  Numbers appear in everyday units ("about 7 minutes faster to sleep"), with the
  confidence interval and sample size one tap deeper. Headings are the questions
  people actually ask ("Does it work?", "Is it safe with my medications?"). Plain
  must never become vague — every simplification still commits to a specific claim.
  **Banned phrases (never in user-facing copy — the site talking about itself):**
  "the evidence layer", "zero brand money", "0 hallucinated cites", "the
  sleep-supplement internet is a sales floor", "evidence-graded", "reader-funded",
  "the honesty firewall", "claim-check counter", "disavowal". The whole
  self-congratulatory stat row is replaced by one quiet sentence somewhere
  unglamorous: **"Nobody pays us to say any of this. Every claim links to the
  study it came from."** (These rules bind user-facing copy; this contract's own
  internal decision labels are exempt.)
- All content pages are SSR/SSG. Never ship core content client-only.
- AI features cite back, refuse personalized dosing/diagnosis, and route safety
  concerns to boundary pages. Forbidden framings (from the rulebook): "take X
  tonight", "your ideal dose", "this is safe for you", "combine these", any
  diagnosis. *(Corpus scope amended by owner 2026-07-21 — see D5.)*
- **D5 AI corpus scope: bounded external research allowed (owner-ratified
  2026-07-21).** The earlier "AI answers ONLY from the reviewed corpus" rule is
  amended: the **Somnary Lens** (see `/docs/plans/2026-07-21-somnary-lens-ai-
  design.md`) MAY research products/ingredients/questions the corpus does not
  cover — BUT ONLY under all of these, no exceptions:
  1. Every factual claim resolves to a real, cited source (PMID/DOI/registry),
     same bar as the corpus.
  2. Every evidence claim is **adversarially verified** (refute-first; a claim
     that survivors cannot defend is CUT, never hedged). Anti-hallucination is
     the load-bearing guarantee, not a nicety.
  3. Weak evidence is labeled weak; the anti-hype "what the evidence does NOT
     show" beat is mandatory.
  4. Output is a **draft assessment, NEVER an evidence bucket** — stamped
     "AI-assisted research · not a Somnary grade", with a route to request a
     human review. No agent assigns or changes an evidence bucket (below) is
     UNCHANGED.
  5. No brand money, no paid placement, no personalized dosing/diagnosis; safety
     routing intact. What stays sacred: published grades, the corpus quality
     bar, citation discipline, safety conservatism — the AI may only *apply*
     that discipline to new inputs, clearly fenced as draft/unvetted.
  Corpus remedies still short-circuit to their human-graded pages (a vetted
  grade always beats fresh AI research).
- No agent assigns or changes an evidence bucket. Bucketing (grading) is
  `[HUMAN-GATE]`, always.

## Three separate signals — evidence bucket · safety flag · product score (Reference A4)
Somnary carries three signals and NEVER merges them into one number. Two sit on
every remedy (about the ingredient); the third sits on product pages (about the
bottle):
1. **Does the ingredient work? — the evidence bucket.** From published human
   research, one of four (each always displayed with its permanent plain sentence,
   colour- AND shape-coded so colour is never the only signal):
   - **Helps most people sleep** — studies keep finding it helps people sleep.
   - **May help sleep a little** — a few studies found a small effect on sleep,
     but the research is thin.
   - **Not properly tested for sleep** — it hasn't been properly tested for sleep
     in people, so nobody can honestly say.
   - **Tested — doesn't seem to help sleep** — studies that measured sleep didn't
     find it helps. **Bucket 4 requires papers that MEASURED a sleep outcome and
     found no effect** — an untested remedy is bucket 3, never bucket 4.
   (Labels ratified in RULES.md 2026-08-14; they supersede the earlier "Works for
   most people / Might help a little / Nobody really knows yet / Best avoided"
   wording AND the "Strong evidence / Some evidence …" formal set. The permanent
   plain sentence rides with each label and does the real work.)
2. **How risky is it? — the safety flag.** SEPARATE from the bucket and never
   folded into it: one of three — **none · caution · serious concern** — shown
   alongside the bucket on every remedy, always visible. Safety never changes an
   evidence bucket in either direction, and an evidence bucket never encodes
   safety. This is why bucket 4 is narrow ("tested and the studies didn't find it
   helps sleep"): a remedy that is risky but not proven ineffective must be carried
   by the safety flag, not dumped into bucket 4. A serious-concern flag visually
   outranks the evidence visual on the page (RULES.md). The worked example is
   **kava — "not properly tested for sleep" + serious concern**: it carries a real
   hepatotoxicity history, yet of its 5 cited papers 0 measured a sleep outcome, so
   it cannot sit in a "works" bucket — the danger rides the safety flag, never the
   bucket. (Was "works" + serious concern in Step-1 CLAUDE.md — corrected against
   corpus 5/0/0 and RULES.md, 14 Aug 2026.)
3. **Does this product deliver what was studied? — the product score.** Product
   pages only. From visible factual criteria: dose matches what studies used ·
   independently third-party tested · label discloses everything (no hidden
   proprietary blends) · the form that was actually tested. A product is only
   "worth buying" when the ingredient's bucket AND its product score are both
   strong — an assessment (about the bottle), never a therapeutic recommendation —
   and its safety flag is always shown alongside, so a serious-concern remedy is
   never presented as a clean buy.
Assigning or changing an evidence bucket is always `[HUMAN-GATE]`; so is the
safety flag. The old S–F letter tiers are retired. The live `/tiers`
Evidence×Safety map (PR #153) is the canonical rendering of bucket × safety flag
— the same two-signal structure, to be aligned to the "bucket" name when the
migration lands; it reconciles with this model rather than competing with it.

## Agent roles (definitions in `.claude/agents/`)
- **planner** — reads this file + current checklist item; produces a task plan
  with acceptance criteria; tags anything touching a non-negotiable or a
  D-decision as `[HUMAN-GATE]`.
- **builder** — implements on a branch; never merges its own work.
- **evidence-editor** — drafts content source-first (sources pulled before
  prose); follows the 10-part article skeleton (bottom line → who it applies to
  → claims → what evidence shows → what it does NOT show → dose/label reality →
  safety boundary → clinician questions → sources → review date + correction link).
- **citation-auditor** — verifies every source resolves AND says what the page
  claims; logs pass/fail rationale per claim; blocks merge on failure.
- **design-guardian** — token-only styling; contrast checks; evidence buckets
  legible without colour alone (shape + colour + label); rejects wellness clichés
  and hidden disclaimers.
- **compliance-reviewer** — TGA/FDA/FTC-safe language (describe evidence, never
  promise outcomes), disclaimer placement, forbidden-framing lint on all copy.

## Session protocol
1. planner: read this file, the current BUILD_CHECKLIST item, and the relevant
   strategy section. State the item ID and acceptance criteria in the plan.
2. builder: implement in small commits on a branch named after the item
   (e.g. `chk-2.1-melatonin-hub`). Commit messages reference the item.
3. Reviewer agents run. All must pass. CI gates (citation resolver, token
   linter, crawlability check, build) must be green.
4. Merge automatically UNLESS the item is `[HUMAN-GATE]` — then open a PR and
   post a summary for the owner.
5. Append one line to the BUILD_CHECKLIST session log. Tick the box only when
   every acceptance criterion is verified; report anything deferred.

## Operating loop & review gate (added 2026-07-27)
Every task runs the same loop: **Brief → Generate → Critique → Revise → Ship.**
The critique step is first-class, not a rubber stamp — most defects escape when
it is skipped or vague.
- **Brief subagents like a real brief:** context, constraints, references, and
  the review criteria — never a one-line prompt. Encode standards in files
  (this contract, DESIGN_SYSTEM.md, `.claude/agents/*`, the `verify:*` scripts),
  not in one-off prompts.
- **Findings must be actionable:** every reviewer finding carries `file:line`,
  the offending value, a severity (P0–P3), a concrete fix, and evidence (a quote,
  token name, computed ratio, or capture path). "Looks off" is not a finding.
- **Reviewers are read-only.** The builder/author fixes; the review run never
  edits. Reviewer agents keep their read-only tool sets.
- **Scope the gate to the diff**, and *report* uncovered surfaces rather than
  silently skip them. A clean gate ≠ a good design; humans decide disputes.
- **Rendered-visual + keyboard pass is mandatory for any chrome/template/shared-
  component change** (Nav, Footer, Base, global styles). Contrast-from-tokens and
  built-HTML greps do NOT substitute for viewing the changed routes at
  **390 / 768 / 1440px** and doing a keyboard pass — 390px nav overflow is a known
  Somnary risk. See `qa/README.md`; run the saved `/design-qa` gate
  (`.claude/workflows/design-qa.js`) to scope + rank findings. Headless
  screenshotting stays a HUMAN-GATE (no new Playwright dep) — the visual pass uses
  the Chrome MCP by hand.

## Design system rules (binding on the Step 4 handoff and all UI; full charter in RULES.md)
RULES.md is the authority; these are the load-bearing rules restated here because
the operating contract enforces them:
- **Sentence case everywhere** in UI copy — headings, nav, labels, buttons,
  placeholders, aria text: first word capitalised only, never Title Case, ALL CAPS,
  or all-lowercase. Names keep their fixed scientific forms (L-theanine, 5-HTP,
  GABA, CBD, CBN, CBT-I, vitamin D). Wordmark "Somnary" (capitalised, no period, D3).
- **Type is Onest — one self-hosted family**, exposed as a single token
  `--font-sans`. No serif, no mono, no display/body split; weight and size carry
  hierarchy; tabular figures for numbers. No typographic signature device. No
  Google Fonts / Fontshare / third-party font CDN — woff2 self-hosted, local
  `@font-face`, preload. Enforced by `scripts/check-fonts.mjs` (`verify:fonts`),
  merged at CHK-R0. The live `global.css` + OG generator still render Instrument
  Sans (self-hosted, so the gate passes) until the Onest self-host swap lands
  with the rebuild's design-system wiring (REDESIGN Step 10) — a global visual
  change requiring the rendered-visual pass at 390/768/1440.
- **Colour means data.** `--evidence` (ink blue) is the evidence bar and its key
  and nothing else; all interface colour is `--ink`; there is no `--accent`. Green
  = earned positive verdict only; amber = safety register only; avoid-red =
  documented failure/concern only. No decorative gradients (one dusk exception).
- **Dates render "14 July 2026"** in all user-facing copy, never ISO. ISO
  (YYYY-MM-DD) stays the stored/schema form; the display format is applied at render.
- **Reject-don't-launder hardcoded values.** Any handoff-bundle component carrying
  hardcoded style values is REJECTED and the values REPORTED (with the named token
  they map to), never silently transcribed. `check-tokens.mjs` fails on raw
  font-size / radius / spacing; raw width/height/min/max/border-width is a
  design-guardian review gate until the scoped linter extension lands with step 10.

## Human gates (never auto-merge)
- Tier/bucket grade assignment or change on any remedy.
- Anything monetization, legal-page, or medical-boundary related.
- Phase completion (owner reviews before the next phase starts).
- Any missing design token, schema change, or new dependency with lock-in.
- The product **"worth buying" verdict rule** — the four product checks are almost
  certainly NOT equally weighted (dose-match likely outranks label disclosure), and
  the current `met >= 3` threshold is a PLACEHOLDER. Settle the weighting and the
  rule editorially before any Phase 3 product content ships. One definition in code
  (`PASSES_THRESHOLD`), every consumer importing it, until then (see BUILD_CHECKLIST).
- The source-quality rubric (`docs/SOURCE_QUALITY_RUBRIC.md`) ratification, before
  any evidence bucket ships as final.
- Publishing to external channels (newsletter, social) — agents draft only.

## Content model (schema lives in code; keep in sync)
Provenance note: several fields below are DECIDED and their code is BUILT but still
lives on an unmerged branch, marked `PENDING-MERGE[branch]`. Until the branch
merges (next session — see BUILD_CHECKLIST top item), the live schema in
`src/content.config.ts` does not yet carry them. Grep `PENDING-MERGE` to find
every doc/code divergence.

**remedy** = { slug, `name` (inline/prose + search form), `displayName`
(authoritative on-screen name — sentence case except fixed scientific forms like
5-HTP / L-theanine / vitamin D; required, never a title-cased slug —
merged at CHK-R0, enforced by verify:displaynames), bucket `[HUMAN-GATE]`, verdict, bestFor[],
notFor[], biggestRisk, studiedDose, claims[]↔data[] (each row cited),
evidenceSummary, dosingReality, safety[], interactions[], standardization,
mechanism, sources[], communityRead (separate store), reviewDate, changeLog[] }.

**remedy.sources[]** (the nested-bar study field + citation popover read from
these — schema merged at CHK-R0) = { pmid|doi|registry, title,
year, `type` (structured study type — rendered as plain words: "trial" / "review of
several studies" / "observational study"; observational + cohort studies count
toward the MIDDLE buckets but can never alone reach the top bucket),
`measuresSleepOutcome` (bool — only human sleep-outcome sources feed the bar's
"measured sleep" count; carries NO safety signal), `effectDataStatus`
(complete|pending), `effectDirection` (three-band: helped | no-clear-effect |
didnt-help — REQUIRED on a complete sleep-outcome source; feeds the plain direction
sentence "of the 3 we could check, all 3 found an improvement"), `sampleSize`
(REQUIRED on a complete sleep-outcome source; feeds the plain stat and the popover's
"how many people"), `effectSize` (OPTIONAL — captured where a paper states it
plainly; feeds the stat line only, NEVER positioning), `studyQuality`
(OPTIONAL, re-scoped: no longer a render input — it exists to make BUCKET
assignments defensible, so it is populated only for the papers that determine a
remedy's bucket, per the re-scoped `docs/SOURCE_QUALITY_RUBRIC.md`) }.
> The study field is a **nested bar**, not a scatter (RULES.md): three counts —
> cited ⊇ measured-a-sleep-outcome ⊇ reported-enough-to-verify — plus one plain
> direction sentence. No per-study points, radius, or brightness. The retired
> scatter is why `effectSize`/`studyQuality` no longer render and why `sampleSize`
> is kept only for the plain stat, not a dot size.

**product** = { id, brand, name, `strength{ amount, unit }` (STRUCTURED and NEVER
baked into the name string — the card composes brand + name + strength; decided
on the type branch, merged at CHK-R0; lands in code with the product schema
build), `composition`
('single-ingredient' | 'blend'), `perIngredientAmountsDisclosed` (blends only —
what the proprietary-blend penalty reads), `deliveryForm` (CONTROLLED VOCABULARY,
never free text from the label — tablet · capsule · softgel · gummy · melt-lozenge ·
liquid-drops · spray · tea · powder · patch; ingestion maps label wording into the
vocabulary and flags anything it can't map `needs-review`, never invents a form),
`releaseProfile` ('immediate' | 'slow-release' | 'not-stated' — SEPARATE field from
deliveryForm; feeds the form-matches-studied check; `not-stated` is never an
auto-pass), `rawFormLabel` (original label wording, kept verbatim), ingredients[{
remedy_id, amount, unit, form }], dose_match, third_party_tested{ organisation,
verified_date }, label_discloses_all, proprietary_blend, form_matches_studied,
`price{ amount, currency, retailer, checkedDate }`, `pricePerNight{ amount,
currency, retailer, checkedDate }` (derived), `dietary{ sugarFree, glutenFree,
vegan, artificialSweetenerPresent }`, `allergens[]`, `excipients[]{ name, role,
amount?, flag }` (flag per the additive policy below), `howToTake{ timing,
withFood, timeToKnow }` (protocol sourced from the STUDIES, never invented),
retail_links[{ retailer, url, price, last_checked }], data_source, last_checked,
assessment_state } — where assessment_state ∈ { fully assessed · label known, not
yet assessed · not in database }, and the interface renders honestly against it
rather than implying uniform coverage. `deliveryForm`/`releaseProfile` are a
`[HUMAN-GATE]` schema plan (`docs/plans/2026-08-12-product-form-schema.md`), not yet
built.
> **dose context** lives per remedy (studied range + typical market range) and the
> product's dose diagram + the alternatives section CONSUME it — it is not
> re-derived per product.

**brand** = { name, slug, product_list, `recalls[]` (renders a recalls row ONLY
when one exists) } — the brand page derives a COUNT summary from its products
(never a brand grade). Label-known-but-unassessed products count as "not yet
assessed", never as passes or failures.

**Additive policy (excipients[].flag).** Three flag states only — **no known
concern** (neutral, NOT green) · **worth knowing** (amber tint) · **documented
concern** (avoid tint). Every non-neutral flag CITES a paper (no source id → the
flag cannot ship — see validation gates). A public, cited **documented-concern
list** is maintained as an editorial artefact. Standing rule: non-sugar sweeteners
are always at least "worth knowing" in daily-use products (WHO 2023 basis — verify
and cite properly; currently a placeholder). **No hazard scores, no invented
gradients, ever** — colour states only what's documented.

The ingredient evidence bucket (does it work), the safety flag (how risky —
none/caution/serious concern, shown on every remedy alongside the bucket), and
the product score (does this bottle deliver it, on product pages) are THREE
SEPARATE SIGNALS and must never be merged into a single number anywhere in the
schema, rendering, or sorting (Reference A4 / RULES.md). The safety flag is
surfaced from the existing `safety[]` / `interactions[]` data and never alters a
bucket. Citations are DATA, never prose-only. The bucket map / browse, checkers,
compare tool, and the assistant all read this one structure — never duplicate content.

## Definition of done (per item)
- Acceptance criteria verified and ticked.
- Server-rendered content confirmed in build output.
- Every claim cited; resolver + auditor green.
- Safety module present and prominent (remedy/decision pages).
- Tokens only; no hardcoded style values — handoff-bundle values map to named
  tokens or are reported, never laundered in. Self-hosted fonts only (no font CDN).
  UI copy in sentence case; no serif faces; dates render "14 July 2026", not ISO.
- **Validation gates pass** (item-9 build-time checks; several land with the merges
  below, marked PENDING-MERGE where the gate itself is on a branch):
  - `name`/`displayName` strings contain NO dose/strength pattern (the rule drifted
    twice in design — strength is structured `{ amount, unit }`, never in the name).
  - every product `deliveryForm` value is in the controlled vocabulary (a miss is
    `needs-review`, never a guessed value).
  - every non-neutral additive flag carries a source id.
  - NO safety string ships without a source id (SafetyCallout drift reached three
    occurrences — this becomes a build check).
  - any user-facing string matching `"[Placeholder"` FAILS the production build
    (the design phase's placeholder discipline becomes a build-time check).
- Rendered-visual + keyboard pass done for any chrome/template/shared-component
  change (routes viewed at 390/768/1440px; nav overflow measured). See `qa/README.md`.
- Review date + correction link on every article-type page.
- Session log line appended; branch merged or PR opened per gate rules.

## If unsure
If a task might violate a non-negotiable, assume it does: stop, write the
question into the PR/plan as `[HUMAN-GATE]`, and move to what can proceed.
