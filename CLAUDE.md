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
  symbol. The earlier `Somnary.` trailing-period form is retired.)*
- **D4 Stack builder: killed.** Never build combine-your-stack features or CTAs.
  Salvage only the interaction-warning engine, surfaced through the compare tool
  and safety router. AI never recommends supplement combinations.
- **Rulebook: `/docs/strategy/06-decision-frameworks-operating-system.md` is
  binding** for all content, design, ads, AI framing, and product decisions.

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
   - **Works for most people** — studies keep finding it helps.
   - **Might help a little** — a few studies found a small effect, but the
     research is thin.
   - **Nobody really knows yet** — it hasn't been tested properly in people, so
     nobody can honestly say.
   - **Best avoided** — it's been tested and doesn't work.
   (Slightly-more-formal labels — Strong evidence / Some evidence / Not enough
   evidence / Avoid — are an owner-gated wording choice; the plain sentence does
   the real work either way.)
2. **How risky is it? — the safety flag.** SEPARATE from the bucket and never
   folded into it: one of three — **none · caution · serious concern** — shown
   alongside the bucket on every remedy, always visible. Safety never changes an
   evidence bucket, and an evidence bucket never encodes safety. (This is why
   bucket 4 is only "tested and doesn't work": a remedy with real evidence but a
   dangerous profile — kava, which works yet carries a hepatotoxicity history —
   must read as "works" + "serious concern", not collapse into the same box as an
   untested botanical.)
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

## Design system rules (added 2026-08-08 — binding on the Step 4 handoff and all UI)
Owner-set, ahead of the redesign's design system landing (REDESIGN steps 4–10):
- **Sentence case everywhere** in UI copy — headings, nav, labels, buttons: first
  word capitalised only, never Title Case, never ALL CAPS, never all-lowercase.
  The wordmark is **"Somnary"** — capitalised, no trailing period (D3).
- **Type is Onest — one self-hosted family (locked 2026-08-09).** A single type token
  **`--font-sans`** resolves to **Onest** (the old `--font-display`/`--font-body` pair
  collapses into it); NO serif, NO second display face —
  specifically NOT Cabinet Grotesk and NOT IBM Plex Sans. A mono face exists only
  if the Claude Design handoff bundle still needs one for identifiers; otherwise the
  accent role (the signature emphasis on the words that carry the meaning) is
  weight/size within Onest. (Live code still renders Instrument Sans until the
  self-host swap lands — see DESIGN_SYSTEM.md "TYPE LOCK".)
- **Self-host all webfonts.** No Google Fonts, no Fontshare, no third-party font
  `@import`/`<link>` anywhere — render-blocking, third-party, and a GDPR
  consideration for EU readers. The woff2 files live in the repo (`public/fonts/`),
  declared with a local `@font-face`, with only the weights actually used
  `<link rel="preload">`ed. Enforced by `scripts/check-fonts.mjs` (`verify:fonts`).
- **Dates render as "14 July 2026"** (day, full month, year — no ordinal, no comma)
  in all user-facing copy, NEVER ISO. ISO (YYYY-MM-DD) stays the stored/schema form;
  the display format is applied at render.
- **Reject-don't-launder hardcoded values.** When the Claude Design handoff bundle
  is wired in (step 10), any component carrying hardcoded style values is REJECTED
  and the values REPORTED (with the named token they should map to), never silently
  transcribed. The bundle is authoritative for behaviour, not for raw values — it
  ships many (e.g. SearchField: min-height 60, padding 6/8/20, gap 10, max-width
  560, border 1.5px, font 18px). `scripts/check-tokens.mjs` already fails on raw
  font-size / radius / spacing; it does NOT yet catch raw width/height/min/max or
  border-width, so those are a **design-guardian review gate now** and a scoped
  linter extension to land WITH the step-10 components — a fatal rule today would
  flag ~265 pre-existing dimensional values (breakpoints, icon geometry, hairlines),
  so it is not a cheap retroactive add.

## Human gates (never auto-merge)
- Tier grade assignment or change on any remedy.
- Anything monetization, legal-page, or medical-boundary related.
- Phase completion (owner reviews before the next phase starts).
- Any missing design token, schema change, or new dependency with lock-in.
- Publishing to external channels (newsletter, social) — agents draft only.

## Content model (schema lives in code; keep in sync)
remedy = { slug, name, bucket `[HUMAN-GATE]`, verdict, bestFor[], notFor[],
biggestRisk, studiedDose, claims[]↔data[] (each row cited), evidenceSummary,
dosingReality, safety[], interactions[], standardization, mechanism,
sources[]{pmid|doi|registry, title, year, type, measuresSleepOutcome,
effectDataStatus, effectDirection} (the nested-bar study field renders from
counts + effectDirection; sampleSize/effectSize/studyQuality no longer feed
rendering — see REDESIGN C2/C3),
communityRead (separate store), reviewDate, changeLog[] }.

product = { id, brand, name, composition ('single-ingredient' | 'blend'),
strength{ amount, unit }, perIngredientAmountsDisclosed (blends only), ingredients[{
remedy_id, amount, unit, form }], dose_match, third_party_tested{ organisation,
verified_date }, label_discloses_all, proprietary_blend, form_matches_studied,
retail_links[{ retailer, url, price, last_checked }], data_source, last_checked,
assessment_state } — where assessment_state ∈ { fully assessed · label known, not
yet assessed · not in database }. STRENGTH is structured (amount + unit) and is
NEVER baked into the name string — the card composes brand + name + strength.
`composition` distinguishes single-ingredient from blend; for a blend,
`perIngredientAmountsDisclosed` is what the proprietary-blend penalty reads. The
interface renders honestly against assessment_state rather than implying uniform
coverage.

brand = { name, slug, product_list } — the brand page derives its summary from
its products.

The ingredient evidence bucket (does it work), the safety flag (how risky —
none/caution/serious concern, shown on every remedy alongside the bucket), and
the product score (does this bottle deliver it, on product pages) are THREE
SEPARATE SIGNALS and must never be merged into a single number anywhere in the
schema or the rendering (Reference A4). The safety flag is surfaced from the
existing `safety[]` / `interactions[]` data and never alters a bucket.
Citations are DATA, never prose-only. The bucket map / browse, checkers, compare
tool, and the assistant all read this one structure — never duplicate content.

## Definition of done (per item)
- Acceptance criteria verified and ticked.
- Server-rendered content confirmed in build output.
- Every claim cited; resolver + auditor green.
- Safety module present and prominent (remedy/decision pages).
- Tokens only; no hardcoded style values — handoff-bundle values map to named
  tokens or are reported, never laundered in. Self-hosted fonts only (no font CDN).
  UI copy in sentence case; no serif faces (see "Design system rules").
- Rendered-visual + keyboard pass done for any chrome/template/shared-component
  change (routes viewed at 390/768/1440px; nav overflow measured). See `qa/README.md`.
- Review date + correction link on every article-type page.
- Session log line appended; branch merged or PR opened per gate rules.

## If unsure
If a task might violate a non-negotiable, assume it does: stop, write the
question into the PR/plan as `[HUMAN-GATE]`, and move to what can proceed.
