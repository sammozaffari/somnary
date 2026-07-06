# BUILD_CHECKLIST.md (v2.1 — post-pivot, agent-run, reality-audited)

Work top to bottom, one item per session. Reviewer agents + CI gates replace
manual owner review except on items tagged `[HUMAN-GATE]`, which open a PR and
wait. Tick a box only when every acceptance criterion is verified; report
anything deferred in the session log.

Legend: `[ ]` todo · `[~]` partial (see note) · `[x]` done & verified · `HG` = [HUMAN-GATE]

## Reality baseline (audited 2026-07-06, CHK-0.0)

v2 of this checklist was drafted from the docs alone and assumed a greenfield.
The repo is not greenfield: a full Astro site was built 2026-06-30 → 07-03
under the **v1 checklist's numbering** (the `[CHK-x.y]` tags in git history
before 2026-07-06 refer to v1 items, not the IDs below). Already live:
20 remedy pages + 4 context pages (all citation-resolved, grades
owner-approved via the v1 two-pass process), tier board, 7 outcome pages,
methodology, legal pages, disclaimer component, ⌘K + `/search`, JSON-LD/OG
per remedy, citation resolver in `prebuild`, content-index JSON (current;
the .md mirror's per-row statuses are stale — trust the JSON).

**The pivot is therefore a migration:** old soft-light design → evidence-teal
(DESIGN_SYSTEM v2), lowercase brand → "Somnary." (D3), tier-board-hero IA →
decision-first IA (strategy 03). Items below are annotated with what already
exists so sessions extend the site instead of rebuilding it.

---

## Phase 0 — Reconciliation, scaffold & guardrails
- [x] **CHK-0.0 Doc reconciliation.** Move strategy package to `/docs/strategy/`;
  mark superseded PROJECT_PLAN sections; rewrite DESIGN_SYSTEM.md from the v3
  prototype `styles.css` (evidence-teal tokens); apply capitalized "Somnary"
  across docs; delete stack-builder references (D4). *Accept:* no doc
  contradicts CLAUDE.md's locked decisions; DESIGN_SYSTEM has zero TODOs except
  flagged gaps. *(Done, PR #1. Owner ratified the three token gaps: G1 S-tier
  `--grade-s #0d4f44`, G3 warn-chip `--safety-ink #a02c22`, G4 `--focus-ring`
  3px primary @40%. Only G2 — undesigned future page types — remains open, not
  a blocker. Merge is the owner's action.)*
- [x] **CHK-0.1 Astro scaffold.** *(Pre-existing: Astro 5 + MDX + sitemap +
  Vercel adapter; build verified green 2026-07-06; content pre-rendered in
  dist HTML; pushed.)* `.claude/agents/` role files added in CHK-0.0 session.
- [x] **CHK-0.2 Evidence-teal reskin + token linter.** *(Reworded from "tokens
  wired" — v1.2 tokens are wired; this item migrates them.)* Replace
  `tailwind.config.mjs` + `src/styles` + all components with DESIGN_SYSTEM v2
  tokens; wordmark → `Somnary.` (D3) site-wide. *Accept:* no v1.2 color/type
  value remains; token linter exists and fails on hardcoded hex/spacing;
  contrast rules of DESIGN_SYSTEM §8 hold on live pages. *(Merged PR #2.
  Build green through linter + resolver; zero v1.2 palette hex in built CSS;
  D3 casing site-wide; visually verified via headless-Chrome screenshots of
  home/tiers/melatonin/cbt-i — S/A badge distinction confirmed.)*
- [~] **CHK-0.3 Content model extension.** *(Schema exists in
  `src/content.config.ts` with claims↔data, sources, doses, safety,
  interactions, community, seo.)* Add missing fields per CLAUDE.md: `notFor[]`,
  `biggestRisk`, `reviewDate`, `changeLog[]`; confirm `bestFor[]` shape.
  *Accept:* sample remedy validates; tier field marked human-gated in schema
  docs; existing 20 remedies migrated.
- [~] **CHK-0.4 Citation resolver in CI + pre-commit.** *(Resolver exists —
  `scripts/check-citations.mjs`, runs in `prebuild`, fails build on bad cite.)*
  Missing: CI workflow, pre-commit hook, deliberate-fake-PMID regression test.
- [ ] **CHK-0.5 CI gate suite.** Build + resolver + token lint + crawlability
  check (grep built HTML for page content). *Accept:* all gates run on every PR
  (no `.github/` exists yet); post-session hook appends to this file's session log.

## Phase 1 — Credibility spine
- [~] **CHK-1.1 Methodology page.** *(Exists, server-rendered, from v1 build.)*
  Remaining: conformance pass against strategy 06 rubric wording + evidence-gate
  chips + corrections policy; re-verify "a reader could re-derive a grade".
- [~] **CHK-1.2 Legal pages.** `HG` *(Disclaimer, terms, privacy, disclosure
  exist from v1 build.)* Remaining: disclosure must state D2 tools-first
  funding (no membership paywall); owner sign-off on the updated set.
- [x] **CHK-1.3 Disclaimer component.** *(Verified in built HTML: "educational,
  not medical advice" near decisions on remedy pages, not footer-only;
  conservative re pregnancy/children/interactions.)*
- [ ] **CHK-1.4 Evidence change log page.** Public log of grade/source changes.
  *Accept:* reads from `changeLog[]` (added in CHK-0.3); server-rendered.

## Phase 2 — Melatonin Decision Hub (the template + the wedge)
- [~] **CHK-2.1 Melatonin remedy page.** `HG` *(Exists: 12-block template,
  grade A owner-approved, 8 cites verified.)* Remaining: new lead block —
  grade / best-for / **not-for / biggest-risk** / studied-dose (needs CHK-0.3
  fields) + decision-translation line per strategy 03.
- [~] **CHK-2.2 Melatonin cluster pages.** *(melatonin-children exists.)*
  Remaining: dose/timing, long-term uncertainty, gummy label accuracy
  (JAMA 2023). *Accept:* each follows the 10-part article skeleton; safety
  boundaries visible.
- [x] **CHK-2.3 SEO furniture.** *(Verified in built HTML: JSON-LD + OG image +
  canonical on remedy pages; question-format titles.)*
- [x] **CHK-2.4 Tier badge + evidence-gate chip components.** *(Exist:
  `TierBadge.astro`, `EvidenceGateChip.astro`; read structured data; legible
  without color alone.)* Restyle lands with CHK-0.2.

## Phase 3 — Decision-first surfaces
- [ ] **CHK-3.1 Homepage.** Replace the v1 "enemy hero" with "Check a sleep
  remedy before you take it" + checker search, situation route tiles
  (melatonin / sleep blends / fall asleep / wake at night / medications /
  children), trust strip, "how to read a grade". *Accept:* three clear decision
  routes above the fold; no-affiliate promise visible. *(Search + StatRow
  components already exist to reuse.)*
- [ ] **CHK-3.2 Start Here page.** *Accept:* per strategy doc 03 brief.
- [ ] **CHK-3.3 Safety hub / router.** Grid of boundary routes (apnea, chronic
  insomnia, medications, children, urgent states). *(when-to-see-a-doctor page
  exists as a route target.)* *Accept:* routes to clinician-boundary guidance,
  never diagnosis.
- [~] **CHK-3.4 Remedies overview (tier board).** *(Exists at `/tiers`,
  server-rendered, from structured data.)* Remaining: demote from hero product
  to overview framing; sortable.

## Phase 4 — Label Checker MVP + funnel
- [ ] **CHK-4.1 Label checker (static rules).** Paste a Supplement Facts panel →
  flags proprietary blends, dose mismatch vs studied dose, melatonin >5 mg,
  missing standardization, interaction flags. *Accept:* Astro island; rules
  documented and source-backed; output uses allowed framings only.
- [ ] **CHK-4.2 Newsletter capture + claim submission.** *Accept:* privacy-
  compliant, no dark patterns; "send us a claim/label to check" form works.

## Phase 5 — Catalog & audience expansion
- [~] **CHK-5.1 Core catalog (20–30 remedies).** `HG` per grade. *(20 live,
  grades owner-approved via v1 two-pass: full wedge list — sleep blends, CBD,
  magnesium, valerian, L-theanine, ashwagandha, tart cherry, glycine — plus
  C/D/F tiers.)* Remaining: verify standardization + dose-match captured per
  botanical; document proprietary-blend penalty logic; expansion toward 30.
- [~] **CHK-5.2 Audience pages.** *(melatonin-children exists.)* Remaining:
  meds + supplements, older adults, jet lag/shift work, anxiety-driven
  insomnia. *Accept:* 10-part skeleton; conservative safety framing.
- [x] **CHK-5.3 Goals (outcome) pages + CBT-I hub.** *(7 outcome pages,
  evidence-ranked, + CBT-I page at tier S, framed as strongest-evidence
  intervention — live from v1 build.)* CBT-I S badge restyle lands with CHK-0.2
  (S color now defined).

## Phase 6 — Tools, AI, community, revenue
- [ ] **CHK-6.1 Compare tool.** Compare remedies by goal, effect, safety, evidence
  gates, who-should-avoid; interaction warnings surfaced (salvaged engine per D4).
  *Accept:* never recommends combinations.
- [ ] **CHK-6.2 Clinician handout export.** `HG` (first revenue surface per D2).
  One-page PDF for pharmacist/GP discussion. *Accept:* content mirrors the page,
  cited, disclaimer included.
- [ ] **CHK-6.3 Scoped assistant (RAG).** Corpus-only, cites back, refuses
  personalized dosing/diagnosis, routes to safety pages; refusal + hallucination
  test suite. *(An `AskPanel.astro` stub exists from v1 — audit it against the
  rulebook's forbidden framings before reuse.)* *Accept:* zero invented
  citations in test runs; forbidden-framing lint passes.
- [ ] **CHK-6.4 Community reports.** Anonymous, structured, threshold-gated,
  stored separately. *Accept:* firewall verified in code; never touches grades.
- [ ] **CHK-6.5 Supporter tier / label-checker pro.** `HG` scope + pricing.
  *Accept:* free wiki never paywalled.

---

### Session log (agents append one line per session)
<!-- 2026-07-06 — checklist v2 adopted; decisions D1–D4 locked. -->
- 2026-07-06 · CHK-0.2 · evidence-teal reskin. Central tokens (global.css + tailwind) → DESIGN_SYSTEM v2; Archivo + IBM Plex Sans (+ @fontsource for OG gen); TierBadge (filled/white letter) + Wordmark (Somnary., D3) redesigned; SafetyCallout serious→vermilion register; ~120 token refs swept across 31 files via 4 parallel agents; StatRow accent API renamed; OG generator reteal'd; brand word capitalized site-wide (URLs preserved); dead TokenProbe removed. New token linter (scripts/check-tokens.mjs) wired to prebuild — fails on retired names + hardcoded hex, warns on off-scale spacing. Build green through both gates; 0 v1.2 palette hex in built CSS. PR #2, awaiting owner visual review.
- 2026-07-06 · CHK-0.0 · strategy package → /docs/strategy/; DESIGN_SYSTEM v2 (evidence-teal) rewritten from v3 prototype with computed contrast; PROJECT_PLAN/DESIGN_BRIEF superseded sections marked; checklist reality-audited to v2.1; .claude/agents/ ×6 added; pivot-analysis baseline corrected. Build + resolver green. PR #1. Owner ratified token gaps: G1 `--grade-s #0d4f44`, G3 `--safety-ink #a02c22`, G4 `--focus-ring` 3px primary @40%; G2 (undesigned page types) remains open, non-blocking. Deferred: disclosure D2 update rides CHK-1.2.
