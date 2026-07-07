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
- [x] **CHK-0.3 Content model extension.** `HG` (schema change) *(Schema exists in
  `src/content.config.ts` with claims↔data, sources, doses, safety,
  interactions, community, seo.)* Add missing fields per CLAUDE.md: `notFor[]`,
  `biggestRisk`, `reviewDate`, `changeLog[]`; confirm `bestFor[]` shape.
  *Accept:* sample remedy validates; tier field marked human-gated in schema
  docs; existing 20 remedies migrated. *(Done in PR #3: 4 fields added +
  changeLogEntry shape; tier marked `[HUMAN-GATE]` in schema; `reviewDate`
  required, seeded from each file's real git date (never fabricated) on all
  20; melatonin populated as the worked lead-block template. Build green.
  DEFERRED (downstream, flagged): render the lead-block `notFor`/`biggestRisk`
  + a "reviewed <date> · correction link" line — that's CHK-2.1's template
  work and needs a real corrections destination; populate `notFor`/
  `biggestRisk` for the other 19 = evidence-editor sessions, not fabricated.)*
- [x] **CHK-0.4 Citation resolver in CI + pre-commit.** *(Resolver exists —
  `scripts/check-citations.mjs`, runs in `prebuild`, fails build on bad cite.)*
  *(Done, PR #4: resolver now honors `SOMNARY_CONTENT_DIR`; fake-PMID regression
  test `scripts/test-resolver.mjs` (`verify:cites:selftest`) proves it fails on
  a malformed id and passes a real one; runs in CI + `.githooks/pre-commit`.)*
- [x] **CHK-0.5 CI gate suite.** Build + resolver + token lint + crawlability
  check (grep built HTML for page content). *Accept:* all gates run on every PR
  (no `.github/` exists yet); post-session hook appends to this file's session log.
  *(Done, PR #4: `.github/workflows/ci.yml` runs token lint → resolver →
  resolver self-test → build → crawlability on push+PR; `scripts/check-crawlable.mjs`
  verifies content is server-rendered (20 pages + key routes); `.githooks/pre-commit`
  wired via the `prepare` script. DEFERRED: the post-session session-log hook is a
  Claude Code Stop hook / harness config, not repo CI — flagged for a settings pass.)*

> **PHASE 0 COMPLETE (2026-07-07).** All guardrails in place: docs reconciled,
> evidence-teal reskin, extended content model, and the full CI gate suite. Per
> CLAUDE.md this phase boundary is a `[HUMAN-GATE]` — owner review before Phase 1.

## Phase 1 — Credibility spine
- [x] **CHK-1.1 Methodology page.** *(Exists, server-rendered, from v1 build.)*
  Remaining: conformance pass against strategy 06 rubric wording + evidence-gate
  chips + corrections policy; re-verify "a reader could re-derive a grade".
  *(Done, PR #5. Conformance PASS: all 9 sections present — two-rubrics firewall,
  S–F tiers + evidence-gate glossary (from structured data), source hierarchy,
  cite-or-don't-claim, uncertainty, how-rankings-change, COI (D2-aligned:
  reader-funded, no membership), corrections. Fixed one REAL-PROMISES violation:
  Section 5 promised a "live claim-check counter (verified vs total)" that isn't
  published anywhere → rewritten to describe what's actually enforced (inline
  citations + resolver on every build). FLAGGED for owner: (a) corrections inbox
  is a personal gmail (`sammymoz@gmail.com`) with a public 7-day SLA — confirm
  it's monitored/keepable, or move to a dedicated address; (b) Section 1's
  brand/product-QA "audit" is described present-tense but no QA module exists yet
  — soften or build; (c) if you want a real verified-vs-total counter, it's a
  small build.)*
- [x] **CHK-1.2 Legal pages.** `HG` *(Disclaimer, terms, privacy, disclosure
  exist from v1 build.)* Remaining: disclosure must state D2 tools-first
  funding (no membership paywall); owner sign-off on the updated set.
  *(Done, PR #7 — awaiting owner legal sign-off. Rewrote the disclosure funding
  paragraph to D2 reality per owner decision: "entirely self-funded for now,
  nothing monetised yet; reader-funded + tools-first; if it ever charges it's
  optional reader support or practical tools, never a paywall on the evidence,
  never brand money; wiki stays free" — the old "optional memberships" model is
  gone. Cleared the "before membership goes live" comments from all three legal
  pages → D2 wording. Corrections SLA kept as-is per owner (real & keepable).
  No membership/paywall-as-funding refs remain. Build green.)*
- [x] **CHK-1.3 Disclaimer component.** *(Verified in built HTML: "educational,
  not medical advice" near decisions on remedy pages, not footer-only;
  conservative re pregnancy/children/interactions.)*
- [x] **CHK-1.4 Evidence change log page.** Public log of grade/source changes.
  *Accept:* reads from `changeLog[]` (added in CHK-0.3); server-rendered.
  *(Done, PR #6: `/changelog` — flattens every remedy's `changeLog[]`, newest
  first, server-rendered (crawlable); grade-change entries render from→to
  badges. Seeded an honest "initial publication" entry per remedy from its real
  reviewDate + tier + cited-source count (a true event, not fabricated), so the
  log is a real audit trail from day one. Linked from the Footer as "evidence
  log" + methodology `#rankings`. Visually confirmed.)*

> **PHASE 1 COMPLETE (2026-07-07), PR #7 merged.** Credibility spine in
> place: methodology conforms (real-promise fixed), legal pages reconciled to
> D2, disclaimer prominent, public evidence change-log live. Phase boundary is a
> `[HUMAN-GATE]` — owner review before Phase 2.

## Phase 2 — Melatonin Decision Hub (the template + the wedge)
- [x] **CHK-2.1 Melatonin remedy page.** `HG` *(Exists: 12-block template,
  grade A owner-approved, 8 cites verified.)* Remaining: new lead block —
  grade / best-for / **not-for / biggest-risk** / studied-dose (needs CHK-0.3
  fields) + decision-translation line per strategy 03. *(Done, branch
  `chk-2.1-melatonin-lead-block` — PR awaiting owner sign-off. New
  `RemedyLeadBlock.astro` renders an above-the-fold decision-first lead block
  (152px grade badge + decision-translation + best-for/not-for/biggest-risk/
  studied-dose grid + "reviewed <date> · corrections →") on the shared remedy
  template for all 20 remedies; degrades gracefully where notFor/biggestRisk
  aren't yet populated (rows OMITTED, never blank — absence must never read as
  "no risk"). `decisionTranslation` added to all 6 tiers verbatim from strategy
  03. Corrections link → real `/methodology#corrections` (existing inbox +
  7-day SLA; anchor added). Build + token linter + resolver (66 cites, 20 files,
  unchanged) + crawlability green; all 3 reviewers PASS. OWNER GATES flagged in
  PR: (G-a) corrections target, (G-b) omit-empty-safety-rows framing, (G-c)
  verdict micro-label uses tier word vs DESIGN §3's illustrative vocabulary +
  whether badge aria-label should be "Grade B — {verdict}". Deferred (unchanged
  scope): populate notFor/biggestRisk for the other 19 = evidence-editor work.)*
- [x] **CHK-2.2 Melatonin cluster pages.** *(melatonin-children exists.)*
  Remaining: dose/timing, long-term uncertainty, gummy label accuracy
  (JAMA 2023). *Accept:* each follows the 10-part article skeleton; safety
  boundaries visible. *(Done, branch `chk-2.2-melatonin-cluster` — PR awaiting
  owner review (routed to PR as new public medical-boundary content, not a
  per-item HG tag). Three ungraded context pages mirroring melatonin-children:
  `/melatonin-gummies` (Cohen JAMA 2023 PMID 37097362 + Erland + Lelak),
  `/melatonin-dose-timing` (describes doses STUDIES used, never instructs —
  Ferracioli-Oda/Brzezinski/Auld/van Geijlswijk/Zhdanova/AASM-Auger), and
  `/melatonin-long-term` (framed strictly as evidence GAP, not asserted harm —
  Besag CNS Drugs 2019 + AASM-Sateia). All 10 skeleton parts incl. part-10
  review-date + `/methodology#corrections`; prominent `.sev-serious` safety
  callout each; cross-linked to the melatonin hub + children/when-to-see-a-doctor
  + Footer context nav. citation-auditor: 13/13 claim↔source pairs verified
  firsthand online (Cohen figures confirmed against PMC full text since PubMed
  has no abstract); compliance + design-guardian PASS; build + token lint +
  resolver (66 cites, unchanged) + crawl green. NOTE: resolver does NOT scan
  .astro pages — the citation-auditor's manual online check is the standing gate
  for context-page cites. Also adds `id="corrections"` to methodology.astro (same
  anchor CHK-2.1 adds independently — trivial overlap on merge).)*
- [x] **CHK-2.3 SEO furniture.** *(Verified in built HTML: JSON-LD + OG image +
  canonical on remedy pages; question-format titles.)*
- [x] **CHK-2.4 Tier badge + evidence-gate chip components.** *(Exist:
  `TierBadge.astro`, `EvidenceGateChip.astro`; read structured data; legible
  without color alone.)* Restyle lands with CHK-0.2.

> **PHASE 2 COMPLETE (2026-07-07).** Melatonin decision hub in place: the
> decision-first lead-block template (PR #8, CHK-2.1) + 3 cluster pages (PR #9,
> CHK-2.2 — gummies/dose-timing/long-term). PRs #8 + #9 merged. Per CLAUDE.md
> this phase boundary is a `[HUMAN-GATE]` — owner review before Phase 3.

## Phase 3 — Decision-first surfaces
- [x] **CHK-3.1 Homepage.** Replace the v1 "enemy hero" with "Check a sleep
  remedy before you take it" + checker search, situation route tiles
  (melatonin / sleep blends / fall asleep / wake at night / medications /
  children), trust strip, "how to read a grade". *Accept:* three clear decision
  routes above the fold; no-affiliate promise visible. *(Search + StatRow
  components already exist to reuse.)* *(Done, branch `chk-3.1-homepage` — PR
  awaiting owner sign-off (HG: front-door copy + Phase 2→3 boundary). Rewrote
  index.astro: enemy hero → "Check a sleep remedy before you take it." + subhead
  "No affiliate links. No brand money."; 3 above-the-fold routes (Check a remedy
  →/search + popular-check pills · Start from your sleep problem →#situations ·
  Read safety red flags →/when-to-see-a-doctor); 6 situation tiles all wired to
  REAL routes; StatRow keeps the 4 real computed cells (20/66/0/$0); standard
  Disclaimer moved adjacent to the decision block (not footer-only); S–F "how to
  read a grade" legend reusing TierBadge + each tier's decisionTranslation, with
  an explicit "grade rates evidence, not safety" note. compliance + design-guardian
  PASS (design FAIL on 3 raw-px sizing literals fixed → var(--page)/--sp-7/--sp-6,
  hover aligned to §6). Build/token-lint/resolver(66,unchanged)/crawl green.
  Adopted defaults (owner to ratify in PR): search=Option-a (/search anchor +
  pills, no 2nd SearchPalette island); medications tile →/when-to-see-a-doctor
  (dedicated meds page deferred CHK-5.2). Flag: hero kept on ambient wash — the
  bold-teal §1 hero is a deferrable design/scope choice (buildable token-only via
  color-mix, NOT a token gap); .home width now var(--page) i.e. site-shell 1460px.
  Deferred: CHK-3.2 Start-Here standalone, CHK-3.3 safety hub grid.)*
- [ ] **CHK-3.2 Start Here page.** *Accept:* per strategy doc 03 brief.
- [x] **CHK-3.3 Safety hub / router.** Grid of boundary routes (apnea, chronic
  insomnia, medications, children, urgent states). *(when-to-see-a-doctor page
  exists as a route target.)* *Accept:* routes to clinician-boundary guidance,
  never diagnosis. *(Done, merged under owner autonomy grant. New `/safety`
  router: 5-card grid — snoring-with-pauses / persistent-insomnia / meds-or-
  condition / for-a-child / urgent — routing to REAL destinations only
  (/when-to-see-a-doctor ×3, /melatonin-children, /when-to-see-a-doctor#urgent;
  added the `#urgent` anchor). Card copy is NAVIGATIONAL-only — names each
  boundary + what the cited destination covers, asserts NO new clinical claim, no
  diagnosis, no personalized advice. ContextBanner ("not a diagnosis… a
  conversation for a clinician") + standard Disclaimer sit above the grid. Only
  the urgent card wears the vermilion safety register. Homepage "Read safety red
  flags" CTA + medications tile repointed to /safety; Nav gains "safety".
  compliance-reviewer PASS (explicitly conservative/navigational/diagnosis-free,
  every card truthful to its cited destination); design-guardian FAIL→PASS
  (urgent-tag 12px white-on-vermilion 4.12:1 → --safety-ink 7.3:1, canonical
  SafetyCallout idiom; card hover to §6 -2px). Build/token-lint/resolver(66,
  unchanged)/crawl green. Deferred: dedicated meds/interactions page = CHK-5.2
  (meds card routes to the boundary honestly meanwhile); broader hub modules
  (pregnancy, older adults, etc.) = future.)*
- [x] **CHK-3.4 Remedies overview (tier board).** *(Exists at `/tiers`,
  server-rendered, from structured data.)* Remaining: demote from hero product
  to overview framing; sortable. *(Done, merged. Reframed `/tiers` from the v1
  site-hero ("the hook" + dramatic dek + hero StatRow) to a neutral reference
  overview: eyebrow "remedies · reference overview", H1 demoted display→3xl, hero
  StatRow removed (stats live on the homepage now), nav label tiers→remedies (URL
  kept). SSG-first sortable: one server-rendered flat grid of all 20 cards in
  canonical grade(S→F)→name order (crawlable, JS-off safe) + a token-only
  segmented control (grade · A–Z · category) whose scoped island reorders the
  existing <li> nodes in place (aria-pressed, keyboard, focus-ring). Grades read
  READ-ONLY — AC-4 proven: zero edits to tiers.ts / remedies / content-index.
  Plan wrongly assumed S was empty; reality cbt-i IS tier S, so the legend
  honestly renders S=1 (no fabricated "0"); empty-S emptyNote kept as data-driven
  code. Added a compact "educational, not medical advice" line near the index.
  design-guardian + compliance PASS; build/token-lint/resolver(66,unchanged)/crawl
  green. Deferred: filtering/faceting → compare tool CHK-6.1.)*

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
- 2026-07-08 · CHK-3.3 · safety hub / router (autonomous merge). New `/safety` page: 5-card boundary router (apnea/snoring · chronic insomnia · meds-or-condition · child · urgent) routing to REAL destinations only (/when-to-see-a-doctor ×3, /melatonin-children, /when-to-see-a-doctor#urgent — added the #urgent anchor). Copy is NAVIGATIONAL-only: names each boundary + what its already-cited destination covers, no new clinical claim, no diagnosis, no personalized advice. ContextBanner + standard Disclaimer above the grid; only the urgent card uses the vermilion safety register. Homepage "Read safety red flags" CTA + medications tile repointed to /safety; Nav gains "safety". compliance PASS (explicitly conservative/navigational/diagnosis-free); design-guardian FAIL→PASS (urgent-tag contrast --vermilion→--safety-ink; hover to §6 -2px). Build/token-lint/resolver(66,unchanged)/crawl green. Medical-boundary content self-merged under the owner's autonomy grant (compliance is the delegated safety gate); not a grade/legal/monetization hard gate. Deferred: meds page CHK-5.2; broader hub modules.
- 2026-07-08 · CHK-3.4 · remedies overview demote + sortable (autonomous merge). Reframed `/tiers` from v1 site-hero to a reference overview (neutral eyebrow/H1/dek, hero StatRow removed, nav tiers→remedies, URL kept). SSG-first sortable: one server-rendered flat grid of all 20 cards in grade→name canonical order (JS-off safe, crawlable) + token-only segmented control (grade/A–Z/category) reordering existing <li> nodes in place (aria-pressed, keyboard, focus-ring). Grades READ-ONLY — AC-4 proven (zero edits to tiers.ts/remedies/content-index). Corrected a plan error: cbt-i IS tier S, so legend honestly shows S=1 (no fabricated "0"); empty-S note kept as data-driven code. Added compact "educational, not medical advice" near the index (compliance non-blocking note) + tokenized active-seg color. design-guardian + compliance PASS; build/token-lint/resolver(66,unchanged)/crawl green. Merged under owner autonomy grant (no grade/legal/monetization touched). Deferred: faceted filtering → CHK-6.1.
- 2026-07-07 · CHK-3.1 · decision-first homepage (opens Phase 3). Replaced the v1 "enemy hero" (`index.astro`) with "Check a sleep remedy before you take it." + subhead carrying the visible no-affiliate promise ("No affiliate links. No brand money."). Three above-the-fold routes (Check a remedy →/search + popular-check pills · Start from your sleep problem →#situations · Read safety red flags →/when-to-see-a-doctor); six situation tiles wired to REAL routes (melatonin/sleep-blends/fall-asleep-faster/stay-asleep/when-to-see-a-doctor/melatonin-children — no dead links); StatRow keeps 4 real computed cells (20 remedies/66 sources/0 hallucinated/$0 brand — verified computed from content-index, not invented); standard Disclaimer moved adjacent to the decision block (not footer-only); S–F legend reuses TierBadge + each tier's decisionTranslation + "grade rates evidence, not safety" note. Added PHASE 2 COMPLETE marker + corrected Phase 1 marker (PR #7 merged). compliance PASS; design-guardian FAIL→PASS (fixed 3 raw-px sizing literals the linter's scope missed: 1240px→var(--page), cta 48px→--sp-7, pill 34px→--sp-6; hover lifts to §6 -1px/-2px). Build/token-lint/resolver(66,unchanged)/crawl green. Routed to PR (HG: front-door copy + phase boundary). Owner ratifies: search Option-a, medications→/when-to-see-a-doctor (meds page deferred CHK-5.2), whether to adopt the bold-teal §1 hero (buildable token-only via color-mix — a design/scope choice, not a token gap). Deferred: CHK-3.2/3.3.
- 2026-07-07 · CHK-2.2 · melatonin cluster pages (×3). Added ungraded context pages `/melatonin-gummies`, `/melatonin-dose-timing`, `/melatonin-long-term`, each mirroring the melatonin-children exemplar (Base + ContextBanner + inline `.sev-serious` callout + Fn/ContextSources + standard Disclaimer) and hitting all 10 skeleton parts incl. a new part-10 review-date + `/methodology#corrections` line. SOURCE-FIRST via evidence-editor: every PMID/DOI pulled and verified online before prose; dose-timing describes only what STUDIES used (never instructs a dose); long-term framed strictly as an evidence GAP (Besag CNS Drugs 2019 + AASM-Sateia), never an asserted harm — no [HUMAN-GATE] fired. Builder wired content-index registration (kind:context, plannedTier:null, sourceCount:0 — no graded-corpus inflation), bidirectional cross-links (hub↔cluster, cluster→children/when-to-see-a-doctor), Footer context nav. IMPORTANT: the CI resolver does NOT scan .astro pages, so the citation-auditor's manual online verification is the real gate — it confirmed 13/13 claim↔source pairs (Cohen JAMA 2023 exact figures recovered from PMC full text since PubMed carries no abstract). compliance + design-guardian PASS; build/token-lint/resolver(66,unchanged)/crawl green. Routed to PR (new public medical-boundary content) for owner review, not auto-merged. Adds id="corrections" to methodology.astro (same anchor CHK-2.1 adds — trivial merge overlap). Deferred: other hub modules (jet-lag/DSPD, hub index) + retrofitting melatonin-children with part-10 line.
- 2026-07-07 · CHK-2.1 · melatonin decision-first lead block. New `RemedyLeadBlock.astro` renders above-the-fold on the shared remedy template (`r/[slug].astro`): 152px grade badge (new `lead` size on TierBadge) + decision-translation line + best-for/not-for/biggest-risk/studied-dose grid + "reviewed <date> · corrections →". `decisionTranslation` added to all 6 tiers verbatim from strategy 03. Graceful empties (G-b): not-for/biggest-risk rows OMITTED when unpopulated — never blank, absence must never read as "no risk"; verified on magnesium (B, rows gone, 0 empty cells) + cbt-i (S, studied-dose omitted for intervention). Removed the duplicate 78px header badge. Corrections link → real `/methodology#corrections` (added `id`; existing inbox + 7-day SLA, nothing invented). Build + token lint + resolver (66 cites/20 files, unchanged) + crawlability green; citation-auditor / design-guardian / compliance-reviewer all PASS. PR #8 merged (owner sign-off). Owner gates surfaced in PR: G-a corrections target, G-b empty-row omission, G-c verdict micro-label (tier word vs DESIGN §3 vocabulary + aria-label wording). Non-blocking note (compliance): per-page standard disclaimer still sits at bottom of `<main>` while the decision moment is now at top — pre-existing CHK-1.3 placement, not a regression; raise separately if owner wants it adjacent. Deferred (unchanged): notFor/biggestRisk for the other 19 = evidence-editor sessions.
- 2026-07-07 · CHK-1.2 · legal pages reconciled to D2 (completes Phase 1). Rewrote the disclosure funding paragraph to owner-decided reality ("entirely self-funded for now, nothing monetised yet; reader-funded + tools-first; never a paywall on the evidence, never brand money; wiki free") — dropped the old "optional memberships" model. Cleared "before membership goes live" from disclosure/terms/privacy header comments → D2 wording. Corrections gmail + 7-day SLA kept per owner. Build green. PR #7 (HG: legal sign-off + Phase 1 boundary). Still-open minor: methodology's brand/product-QA line reads present-tense though no QA module exists — left for a later copy pass.
- 2026-07-07 · CHK-1.4 · evidence change-log page. New server-rendered `/changelog` reads every remedy's changeLog[] (newest first; grade changes show from→to badges). Seeded an honest initial-publication entry per remedy (real reviewDate + tier + cited-source count — a true event) so the log is a real audit trail. Linked from Footer + methodology #rankings. Build/crawl/linter green; visually confirmed. PR #6. (Note: CHK-1.1 log line lives in the still-open PR #5.)
<!-- 2026-07-06 — checklist v2 adopted; decisions D1–D4 locked. -->
- 2026-07-07 · CHK-1.1 · methodology conformance pass. Verified the page conforms to strategy doc 06 + non-negotiables (9 sections, S–F rubric + gates from structured data, source hierarchy, COI D2-aligned, corrections). Fixed a real-promises violation: removed the un-built "live claim-check counter (verified vs total)" claim, rewrote to what's actually enforced (inline cites + resolver every build). Build green. PR #5. Flagged for owner: corrections inbox is a personal gmail with a public 7-day SLA (confirm/relocate); brand-QA "audit" framed present-tense but not built; optional real counter is a small build.
- 2026-07-07 · CHK-0.4/0.5 · CI gate suite (completes Phase 0). Added .github/workflows/ci.yml (token lint → resolver → resolver self-test → build → crawlability, on push + PR); scripts/check-crawlable.mjs (asserts content is server-rendered — 20 remedy pages + home/tiers); scripts/test-resolver.mjs fake-PMID regression (resolver now honors SOMNARY_CONTENT_DIR); .githooks/pre-commit (token lint + resolver) wired via package.json `prepare`. All gates green locally. PR #4 (HG: Phase 0 completion boundary). Deferred: post-session session-log hook is harness config, not repo CI.
- 2026-07-06 · CHK-0.3 · content model extension. Added notFor[]/biggestRisk/reviewDate(required)/changeLog[] + changeLogEntry shape to content.config.ts; tier marked [HUMAN-GATE] in schema. reviewDate seeded from each remedy's real git last-commit date across all 20 (honest, not fabricated). Melatonin populated with notFor/biggestRisk/changeLog from its own cited content as the worked template. Fixed a D4 "stack builder" leftover in the schema header comment. Build green. PR #3 (HG: schema change). Deferred: lead-block rendering + correction link (CHK-2.1), per-remedy notFor/biggestRisk population (evidence-editor).
- 2026-07-06 · CHK-0.2 · evidence-teal reskin. Central tokens (global.css + tailwind) → DESIGN_SYSTEM v2; Archivo + IBM Plex Sans (+ @fontsource for OG gen); TierBadge (filled/white letter) + Wordmark (Somnary., D3) redesigned; SafetyCallout serious→vermilion register; ~120 token refs swept across 31 files via 4 parallel agents; StatRow accent API renamed; OG generator reteal'd; brand word capitalized site-wide (URLs preserved); dead TokenProbe removed. New token linter (scripts/check-tokens.mjs) wired to prebuild — fails on retired names + hardcoded hex, warns on off-scale spacing. Build green through both gates; 0 v1.2 palette hex in built CSS. PR #2, awaiting owner visual review.
- 2026-07-06 · CHK-0.0 · strategy package → /docs/strategy/; DESIGN_SYSTEM v2 (evidence-teal) rewritten from v3 prototype with computed contrast; PROJECT_PLAN/DESIGN_BRIEF superseded sections marked; checklist reality-audited to v2.1; .claude/agents/ ×6 added; pivot-analysis baseline corrected. Build + resolver green. PR #1. Owner ratified token gaps: G1 `--grade-s #0d4f44`, G3 `--safety-ink #a02c22`, G4 `--focus-ring` 3px primary @40%; G2 (undesigned page types) remains open, non-blocking. Deferred: disclosure D2 update rides CHK-1.2.
