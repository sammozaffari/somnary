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
- [x] **CHK-3.2 Start Here page.** *Accept:* per strategy doc 03 brief. *(Done,
  merged. New `/start-here` (navigational IA, no new claims/cites) implements the
  doc-03 brief's 5 sections in order: (1) "what are you trying to decide?" = the 6
  situation tiles; (2) "what Somnary grades" = scope prose + real StatRow; (3)
  "when not to use this site" = conservative boundary routing → `/safety` with the
  standard Disclaimer adjacent + explicit "this isn't a diagnosis… it's a signpost"
  framing; (4) "how to read a grade" = S–F legend (TIERS + decisionTranslation +
  grade≠safety note); (5) "most common checks" = melatonin/magnesium/sleep-blends/
  cbd/valerian pills + corrections link. Nav gains "start here". compliance PASS
  (section-3 boundary copy conservative/navigational/diagnosis-free) + design-guardian
  PASS (clean). Build/token-lint/resolver(66,unchanged)/crawl green.)*
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

> **PHASE 3 COMPLETE (2026-07-08).** Decision-first surfaces in place: decision-first
> homepage (PR #10, CHK-3.1), Start Here page (CHK-3.2), safety hub/router (PR #12,
> CHK-3.3), and the tier board demoted to a sortable reference overview (PR #11,
> CHK-3.4). CHK-3.2/3.3/3.4 built + reviewed + self-merged under the owner's
> 2026-07-08 autonomy grant (no grade/legal/monetization touched). Per CLAUDE.md a
> phase boundary is `[HUMAN-GATE]` — flagged for owner post-hoc review; the owner
> authorised proceeding without waiting.

## Phase 4 — Label Checker MVP + funnel
- [x] **CHK-4.1 Label checker (static rules).** Paste a Supplement Facts panel →
  flags proprietary blends, dose mismatch vs studied dose, melatonin >5 mg,
  missing standardization, interaction flags. *Accept:* Astro island; rules
  documented and source-backed; output uses allowed framings only. *(Done,
  merged under owner autonomy grant — FREE tool, not a monetization gate.
  New `/label-checker`: SSG shell (server-rendered "rules this checker applies"
  doc with per-rule source links, privacy promise, allowed-framing note,
  ContextBanner + Disclaimer) + a client-only island (paste→check→flag; nothing
  POSTed — pasted text never leaves the browser, only a GET of the static
  /label-index.json). 5 rules read EXISTING cited data (no schema change, no new
  cites, no new deps): R1 proprietary-blend, R2 melatonin>5mg (framed as the
  studied 0.5–5mg range, grogginess clause verbatim-cited from melatonin.mdx —
  NOT a "5mg unsafe" claim), R3 dose<studied-floor, R4 botanical missing
  standardization, R5 interaction cautions (D4-salvage: routes to pharmacist +
  /safety, NEVER recommends/forbids a combination). Output = fixed templates,
  all vetted verbatim. compliance-reviewer PASS (exhaustive per-string:
  descriptive/navigational/diagnosis-free/D4-clean; privacy promise verified
  real) + design-guardian PASS (token/§5 primitives/contrast/no fabricated grade).
  Extended check-crawlable.mjs to assert the rules doc is server-rendered.
  Build/token-lint/resolver(66,unchanged)/crawl green. Deferred: OCR/image
  upload, %DV math, form-mismatch/3rd-party-testing modules, pro features
  (CHK-6.5).)*
- [x] **CHK-4.2 Newsletter capture + claim submission.** *Accept:* privacy-
  compliant, no dark patterns; "send us a claim/label to check" form works.

## Phase 5 — Catalog & audience expansion
- [~] **CHK-5.1 Core catalog (20–30 remedies).** `HG` per grade. *(20 live,
  grades owner-approved via v1 two-pass: full wedge list — sleep blends, CBD,
  magnesium, valerian, L-theanine, ashwagandha, tart cherry, glycine — plus
  C/D/F tiers.)* Remaining: verify standardization + dose-match captured per
  botanical; document proprietary-blend penalty logic; expansion toward 30.
  *(Non-grade sub-tasks DONE + merged; box stays `[~]` because expansion toward
  30 is grade-gated `[HUMAN-GATE]`. (1) standardization + dose-match audit:
  turned into a re-runnable gate `scripts/check-botanical-completeness.mjs`
  (`verify:botanical`, wired into CI) — all 11 botanicals pass (non-empty
  `standardization` + a `doses[]` row with `studiedDose` + `marketComparison`);
  zero data gaps, so nothing fabricated. (2) proprietary-blend penalty:
  consolidated methodology §04 into one reader-followable rule (hidden per-
  ingredient dose → no dose to match a studied dose → downgraded on principle),
  cross-linked to /sleep-blends; restates only the existing DIRECTIONAL rule (no
  numeric magnitude/tier-cap — that stays `[HUMAN-GATE]`). No grade/content/schema
  change (git diff proves it); compliance + design-guardian PASS. DEFERRED
  `[HUMAN-GATE]`: expansion toward 30 (each new remedy needs a grade); populating
  notFor/biggestRisk for the other 19 (evidence-editor). Minor follow-up flagged:
  sleep-blends back-anchors /methodology#rankings (§07) but the rule now lives in
  §04 which has no id.)*
- [~] **CHK-5.2 Audience pages.** *(melatonin-children exists.)* Remaining:
  meds + supplements, older adults, jet lag/shift work, anxiety-driven
  insomnia. *Accept:* 10-part skeleton; conservative safety framing.
  *(In progress — splitting into 3 PRs for reviewability. PR-A DONE + merged:
  `/medications-and-sleep-aids` (ungraded context page, 10-part skeleton,
  mirrors melatonin-gummies exemplar). Conservative pharmacist-first / D4 register
  — every interaction surfaced as a question for a pharmacist, never "combine/
  avoid" as advice, never "safe for you", no diagnosis. 5 sources all verified
  FIRSTHAND online by the citation-auditor (AASM 2017 weak-recs; Härtter 2000
  fluvoxamine→melatonin 17×AUC/12×Cmax, mechanism kept honest — no CYP isoform
  pinned; Culpepper 2015 antihistamine anticholinergic/next-day impairment, full
  text pulled; Teschke 2010 + CDC MMWR 2002 kava hepatotoxicity). Valerian
  additive-sedation kept NAVIGATIONAL (its candidate cite didn't support it —
  cut, not asserted). Unblocks two deferrals: /safety meds card + label-checker
  R5 rules-doc now route here (R5 flag output UNCHANGED — still never
  recommends/forbids a combination). compliance + citation-auditor + design-guardian
  all PASS; build/token-lint/resolver(66,unchanged)/crawl green. Self-merged
  (autonomy grant — ungraded content, no legal/monetization/grade). REMAINING:
  PR-B older-adults + jet-lag/shift-work; PR-C anxiety-driven insomnia (isolated
  for a dedicated mental-health-boundary pass). Noted pre-existing bug: /favicon.svg
  404s site-wide (Base.astro references it, no asset in public/) — flagged for owner.
  PR-B DONE + merged: `/older-adults` (Beers 2023 avoid-anticholinergics; Glass BMJ
  2005 sedative-hypnotic NNH 6/NNT 13/cognitive 4.78×/psychomotor 2.61×; Zhdanova
  0.3mg physiological; Culpepper antihistamine) + `/jet-lag-shift-work` (Herxheimer
  Cochrane 2002 timing-not-sedation; Auger AASM 2015 — timed melatonin for intrinsic
  clock disorders, shift-work-disorder OUT OF SCOPE, routed to clinician). All 6
  cites verified firsthand by citation-auditor against full text; conservative,
  dosing-instruction-free, diagnosis-free; compliance + design PASS. Self-merged.
  PR-C BUILT + all reviewers PASS, but OPENED AS A PR FOR OWNER REVIEW (NOT
  self-merged) — deliberate: mental-health-boundary content is the highest-harm
  category, so `/anxiety-and-sleep` awaits owner sign-off. Predominantly
  navigational: NO diagnosis/screening (no symptom checklist — states a wiki
  can't screen), NO supplement-treats-anxiety claim (l-theanine/ashwagandha
  cross-linked as thin SLEEP evidence, explicitly not anxiety treatments),
  crisis/self-harm routed to /when-to-see-a-doctor#urgent. Only 2 cited claims,
  both CBT-I-for-insomnia (Qaseem/ACP 2016 27136449 + van Straten 2018 28392168,
  corpus-reused, citation-auditor re-verified verbatim — meta-analysis NOT
  stretched to anxiety). compliance (dedicated MH pass) ruled the anxiety "bridge"
  sentence in-bounds; applied its accuracy note ("weak"→"thin" to match tier-B
  grade). So all 4 CHK-5.2 pages BUILT; 3 merged, anxiety in PR awaiting owner.)*
- [x] **CHK-5.3 Goals (outcome) pages + CBT-I hub.** *(7 outcome pages,
  evidence-ranked, + CBT-I page at tier S, framed as strongest-evidence
  intervention — live from v1 build.)* CBT-I S badge restyle lands with CHK-0.2
  (S color now defined).

## Phase 6 — Tools, AI, community, revenue
- [x] **CHK-6.1 Compare tool.** Compare remedies by goal, effect, safety, evidence
  gates, who-should-avoid; interaction warnings surfaced (salvaged engine per D4).
  *Accept:* never recommends combinations. *(Done, merged under owner autonomy
  grant — free tool, no grade/legal/monetization. New `/compare`: single
  server-rendered matrix of all 20 remedies (grade→name, crawlable, JS-off safe)
  mirroring the tier-board SSG island — a scoped script only filters/hides existing
  rows by goal + category (aria-pressed, keyboard, focus-ring). Each row reads
  EXISTING data only: TierBadge + decisionTranslation ("grade rates evidence, not
  safety") · goal = outcomes[] chips · effect = oneLineVerdict verbatim · evidence
  gates via the tier's typicalGates · who-should-avoid (omit-empty) · per-remedy
  interaction cautions (label-R5 register, routes to /safety + /medications-and-
  sleep-aids). D4: NO pairwise pages, NO cross-remedy aggregation, "comparing ≠
  combining" banner + Disclaimer. NO schema change, NO new cites (66/20), grades
  read-only (data files untouched). compliance-reviewer FAIL→PASS: caught that
  hops's bestFor chip "usually alongside valerian" rendered a cross-remedy pairing
  signal next to valerian's row → fixed by rendering outcomes[] only on the grid
  (bestFor stays on remedy pages; no corpus edit). design-guardian PASS.
  Build/token-lint/crawl green. Nav gains "compare"; /tiers links here (CHK-3.4
  deferred faceting). Flagged for owner: hops corpus labels ("usually combined
  with valerian" gate, "combination" form/marketComparison) are honest on the solo
  page but worth a look. Deferred: pairwise/shareable compare URLs; the assistant/
  handout/community/pro items.)*
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

### Guide-concierge arc (owner-ratified design 2026-07-17 —
`docs/plans/2026-07-17-guide-concierge-accounts-design.md` is binding for 6.6–6.11)
- [x] **CHK-6.6 Sleep-habits content hub.** `/sleep-habits` + per-habit sections
  (caffeine, alcohol, screens/light, schedule, naps, environment, exercise
  timing), source-first, 10-part-skeleton honesty incl. hygiene-vs-CBT-I evidence
  candor. *Accept:* SSG, every claim cited, resolver + auditor green.
- [x] **CHK-6.7 Site-wide ask in search.** Generalize the ask engine to
  corpus-wide scope; "Ask Somnary →" row in the palette on weak/question queries;
  engine moves to OpenRouter (`deepseek/deepseek-chat`, env-swappable). *Accept:*
  same guardrail stack passes the refusal/hallucination suite site-wide.
- [ ] **CHK-6.8 `/guide` concierge.** Anonymous intake (situation → history →
  habits → reading map): topic-fence, structured extraction, deterministic
  routing, severity-proportionate output; history beats land in the community
  store (firewalled per CHK-6.4). *Accept:* red-team fixtures all refuse-or-route;
  every routed output is a real URL; model prose limited to acknowledgments.
- [ ] **CHK-6.9 Accounts + saved profiles.** `HG` (privacy page). Supabase Auth
  OAuth, optional-only, offered at chat end; stores structured answers/map/
  checklist, never transcripts; experience reports stay pseudonymous + separate.
  *Accept:* no login wall anywhere; privacy page PR opened for owner.
- [ ] **CHK-6.10 Product-quality panels.** `HG` (framing sign-off). Per-remedy
  criteria-verified panels (magnesium + melatonin first), evidence-first framing,
  no purchase links, new `products` collection separate from corpus. *Accept:*
  AI never emits a brand name in an imperative sentence shape; disclaimer
  adjacent; grades untouched.
- [ ] **CHK-6.11 Community nomination pipeline.** Chat history-beats + form feed
  a queue; publish only after editorial criteria verification. *Accept:* firewall
  holds; community input never sets appearance by popularity alone.

---

### Session log (agents append one line per session)
- 2026-07-19 · hardening · per-IP rate limiter on the model-calling routes (no CHK box — addresses the CHK-6.7 flag "no rate limiting on /api/ask + /api/search-ask"; BUILT on branch `chk-6-rate-limit`, NOT merged). New `supabase/rate-limit.sql` (table `public.rate_limits`, RLS on / no public policies mirroring schema.sql, atomic fixed-window `check_rate_limit(p_key,p_limit,p_window_seconds)` RPC — `insert…on conflict do update` row-locks the key so concurrent calls serialize; CASE resets count to 1 on an expired window else increments; returns allowed + retry_after; `security definer`, `set search_path=public`, `grant execute…to service_role`; optional pg_cron prune noted). New `src/lib/rate-limit.ts` reuses `getSupabaseAdmin()` (NO second client; lazy-imported so the mock test needs no SDK) — `checkRateLimit()` is FAIL-OPEN (client null OR RPC error/throw → allowed, `console.warn` once; only the DB's explicit allowed=false blocks), `clientIpFrom()` (x-forwarded-for first hop → x-real-ip → 'unknown'), env limits `RATE_LIMIT_MAX`=20 / `RATE_LIMIT_WINDOW_SECONDS`=60 (both OPTIONAL, defaults apply). Wired into BOTH routes after validation, before the corpus/model call, separate buckets (`ask:`/`search-ask:` prefixes); over-limit → HTTP 429 `{error:'rate-limited',retryAfter}` + `Retry-After` header (json() extended). Client 429 UX: AskPanel + SearchPalette render a calm "you're sending questions faster than we can answer" note through the EXISTING status/muted error path (tokens only, NOT the vermilion safety register — no new token, no [HUMAN-GATE]). New offline `scripts/test-rate-limit.mjs` (mock Supabase client: allowed / blocked-with-retryAfter / fail-open on null+error+throw / retry clamp; clientIpFrom multi-hop+fallback+unknown) — 12/12 pass, wired `verify:ratelimit` into ci.yml + pre-commit (fully offline). docs/SUPABASE_SETUP.md gains step 2a + the two optional env vars. verify:tokens/framing/ask(59)/ratelimit(12) green; build blocked ONLY on the known env quirk (shared node_modules symlinks an incomplete @supabase/supabase-js lacking @supabase/functions-js — CI installs fresh and passes). Owner runs the SQL migration. Deferred to owner: merge (builder never merges).
- 2026-07-17 · sources · Source Scorecards Phase A (rubric + watchlist + schema + methodology page) — `[HUMAN-GATE]`, PR opened, NOT merged. Design (PR #60, merged) ratified in brainstorm: per-remedy `/sources/<remedy>` pages rating PRODUCTS on a six-dimension 0–5 scorecard (testing/purity · label accuracy · additives · regulatory record · transparency · marketing honesty), NO composite score, NO #1 (a ranking = a recommendation). Community sentiment + trial-usage DISPLAYED, never scored (firewall preserved). Phase A ships the four ratifiable artifacts: (1) `docs/SOURCE_SCORECARD_RUBRIC.md` — exact point rules, time-decay on regulatory penalties, ratification protocol (unratified never publishes; no agent ratifies — same gate class as tier grades), defamation guardrails (primary-doc-only, regulator language quoted); (2) `src/data/additive-watchlist.yaml` — 8 flagged + 2 not_flagged (silicon dioxide/magnesium stearate listed AS benign, since flagging them is the pseudoscience we counter), 9 sources all verified resolvable + supporting rationale, weak evidence labeled weak, artificial-sweeteners explicitly excluded (fear-marketing them is penalized under Marketing honesty, not here); (3) `supabase/migrations/0001_source_scorecards.sql` — 9 tables, RLS-on/no-policies (service-role only), `source_scorecards_published` view filters `ratified_at IS NOT NULL` so drafts are structurally unpublishable, sentiment table carries the firewall comment; (4) `/sources/methodology` page — melatonin why-sourcing-matters story (Erland 2017 PMID 27855744 + Cohen JAMA 2023 both auditor-verified), "no affiliate links — Somnary earns nothing if you buy", Facebook/Amazon-excluded-on-ToS stated. Citation resolver extended to walk the watchlist (structure-agnostic, skips structural, auto-skips if absent) → 142 cites format-green, watchlist 9/9 resolve online (2 EFSA DOIs bot-blocked 403 = verify-manually, confirmed via WebFetch). All three reviewers PASS zero blockers; applied SF1 (drop unverifiable "budgeted"), N1 ("don't lie"→"whose own claims hold up"), BHA/BHT source-scope note. Owner ratifies: rubric point values + watchlist + schema (new tables) + brand-verdict gate class. Testing is aggregate-third-party-only now; own ISO-17025 assays = later gated phase. Carry to Phase B review: `/sources/<remedy>` pages need "educational, not medical advice" ADJACENT to verdict (not footer), and a high score must never read as "safe to take". Owner override logged: Supabase-canonical over repo-YAML (design doc). Deferred: Phase B melatonin deep-research dossiers → data entry → scorecard page build + sort/filter island.
- 2026-07-19 · CHK-6.6 · `/sleep-habits` content hub (BUILT; PR routed to owner — medical-boundary gate). New single SSG page `src/pages/sleep-habits.astro` mirroring the jet-lag/older-adults inline-sources pattern (no schema change, no collection, no corpus edit); Nav gains "Sleep habits". Eight `<section id>` anchors FROZEN for CHK-6.8 to hardcode: #caffeine #alcohol #light #schedule #naps #environment #exercise #hygiene-vs-cbti; `export const HABIT_SUMMARIES` gives 6.8 deterministic per-anchor one-liners (evidence-descriptive, never imperative). Each habit carries an evidence-strength label readable in WORDS not color: caffeine moderate–strong · alcohol moderate · light mixed (timing moderate, blue-light gadgets weak) · schedule moderate/observational · naps mixed/severity-conditional · environment weak–moderate · exercise moderate/myth-correcting. Owner's key emphasis landed in #hygiene-vs-cbti: hygiene-as-package is the CONTROL condition CBT-I beats (AASM 2021 conditional "don't use hygiene as single-component therapy"), CBT-I is the strong S-tier intervention (→ /r/cbt-i), WITHOUT discrediting habits for the many whose problems are minor; severity-proportionate routing (occasional/mild → low-risk start; most nights 3+ months → habit tweaks unlikely enough, evidence points to CBT-I + clinician), with an explicit candor note disavowing diagnosis/direction and `Disclaimer variant="standard"` adjacent (not footer-only). 14 inline sources, EVERY ONE verified firsthand by citation-auditor (PASS — all resolve, support the claim, labels faithful, no retractions; Drake/Ebrahim/Chang/Gooley/Cochrane-Singh/Windred/Maurer/Smith-Basner/Harding/Kredlow/Stutz/Qaseem/Edinger/Trauer) — the auditor is the only guarantee since check-citations.mjs skips .astro pages. compliance PASS on every string but flagged the severity-routing + hygiene-vs-CBT-I candor as materially NEW medical-boundary framing → human-gated PR, no self-merge (cf. CHK-6.7). design-guardian PASS (token-only, labels not color-alone, no fabricated grade, contrast AA+). Build note: worktree needed its own `npm ci` (main checkout's symlinked node_modules predates the #46 Supabase dep); full build + tokens/framing/cites(133/31 unchanged)/crawl all green; 8 anchors + 14 PubMed links + disclaimer confirmed server-side in dist. Owner reviewed the page on localhost + approved the hygiene-vs-CBT-I framing 2026-07-19; box ticked.
- 2026-07-19 · design · hero trim (owner: "less tall, fade higher — content shouldn't need a scroll"). RemedyHero 62vh→48vh (min 380→340), mobile 44→38vh (min 280→260); melt 34%→45% (mask stop 66%→55%). §11.3 amended with owner-ratification notes + recomputed title-over-melt alphas (0.324 desktop / 0.293 mobile, floors lower → ≥8.6:1 everywhere; tuck −7vh/−5vh unchanged, still well inside the melt). NOTE: shared node_modules was contaminated by a sibling session's @supabase/supabase-js scratchpad symlink → this worktree switched to its own npm ci (don't build via the shared symlink while that experiment is live). Footer "coda plates" commissioned (prompt committed at docs/plans/2026-07-19-remedy-coda-plates-prompt.md; melatonin north star APPROVED with two amendments: density ceiling, strict calm-top-third) and WIRED same-day: new `RemedyCoda.astro` (28vh band min 200 / 22vh min 160 mobile, top-edge alpha melt-in transparent→#000 45% mirroring the hero, lazy, alt="", per-plate focal), rendered after </main> on r/[slug]; melatonin coda converted+shipped as first asset — remaining 30 light up as pure asset commits (missing coda renders nothing). §11.3 coda addendum added. Build green.
- 2026-07-19 · CHK-6.7 · site-wide ask + OpenRouter/DeepSeek engine swap (BUILT; PR routed to owner — compliance escalation). Engine: new plain-fetch `openrouter.ts` (no npm dep), provider chain OPENROUTER_API_KEY→`deepseek/deepseek-chat` (OPENROUTER_MODEL-overridable) else Gemini else graceful stub; `meta.provider` on every response; AskPanel privacy note made provider-accurate. Site-wide: `runAskSitewide()` = classify → NEW multi-remedy deterministic router (≥2 remedies named → /compare + pages, "comparing is not combining", NO model call — the D4 mitigation) → `retrieveSitewide` picks ONE remedy deterministically (named-remedy wins; distinctive-token scoring) → unchanged single-remedy pipeline (per-remedy `[n]` integrity preserved by construction) + `answeredFrom`. New `api/search-ask.ts` (POST {question}); palette gains `shouldOfferAsk` heuristic row + inline aria-live answer. Tests 26→59 (sitewide refusal/hallucination/grounding/combo-fishing fixtures); `verify:ask`+`verify:framing` now BLOCKING in ci.yml + pre-commit (were wired nowhere). Live smoke: DeepSeek answered with valid citations, no key/code in client bundles; cites 133/31 unchanged. compliance PASS on every string BUT escalated `multiRemedyMessage()` as materially NEW medical-boundary copy → PR to owner, no self-merge. design-guardian FAIL→fixed: palette Tab trap made the new answer citation/route links keyboard-unreachable; Tab now cycles input↔answer links (re-verified green). New stack/combo classifier (conservative, reuses shipped combine copy). Flagged: no rate limiting on /api/ask + /api/search-ask (unauthenticated model-spend — needs hardening item); palette result rows still not clickable (pre-existing); stack-refusal route points at meds page (slightly off-target, honest). Owner merged #63 2026-07-19; box ticked. #46 (CHK-4.2 capture) merged same day — forms live against the owner-activated Supabase project.
- 2026-07-17 · design · guide-concierge arc ratified (brainstorm with owner, live). Owner proposed an AI intake chat ("problems / remedies tried / specific products / habits" → profile), OAuth accounts, OpenRouter DeepSeek, AI-integrated search, and (future) community-trusted products. Shaped against the constitution and ratified decision-by-decision: concierge/ROUTER not recommender (reading map of corpus URLs, never "take X" — non-negotiables unamended); accounts OPTIONAL via Supabase OAuth, offered at chat end only; dedicated `/guide` page + hero entry (home design kept); products = criteria-verified quality panels (label-checker R1–R5 editorially applied, evidence-first, no purchase links, no affiliate EVER), AI describes criteria but hard-filtered from brand+imperative shapes; experience/supplier reports → CHK-6.4 community store (firewalled); severity-proportionate routing (minor → habits+reading; chronic → CBT-I/clinician, never preachy); habits education hub + deterministic "worth changing" checklist. Design doc: `docs/plans/2026-07-17-guide-concierge-accounts-design.md`. Checklist gains CHK-6.6–6.11 (6.9 privacy-page HG, 6.10 framing HG). No code, no grades, no legal/monetization change — doc-only, autonomous merge.
- 2026-07-17 · design · remedy hero plates: assets (#57) + labeled-plate wiring (owner-directed, studies v4→v6). Landed the 31 owner-directed full-bleed linocut heroes as WebP q90 production sources (227MB PNG masters stay in owner archive; regeneration prompt at docs/plans/2026-07-16-remedy-hero-plates-prompt.md) then wired the ratified "labeled plate" opener: new `RemedyHero.astro` (62vh plate, alpha-MASK melt — not a painted fade, the body bg is a gradient and would seam — label row h1+stamp tucked −7vh into the melt; LCP eager/high-priority, 828–2880w srcset; alt="" with h1 naming). Title never sits on the art (v5 owner finding: "black and even white can be hard to read" — no single ink survives 31 plates); killed the planned per-remedy `--hero-ink` token entirely. Extracted shared `GradeStamp.astro` (card/hero sizes, sr-only "Grade" prefix; RemedyCard swapped to it; HeroCarousel inline copy = dedup on next touch). RETIRED RemedyEmblem.astro (zero renders after #55/#56/this superseded every surface); lead block loses badge column, translation line now anchors grade in text ("Grade A · Strong — …"); crumb retired from remedy pages; dek promoted to plate caption. DESIGN_SYSTEM §11.1 rewritten historical, §11.2 amended, §11.3 added; design doc 2026-07-17-remedy-hero-labeled-plate-design.md. verify+framing(31 files)+crawl(31 pages)+build green; 31/31 pages render hero+label SSR. Compliance carry-forward: label-row stamp has grade line+translation adjacent; re-check if reused without that context.
- 2026-07-15 · design · remedy emblem + plate card — icon/grade unification (owner-directed, 3 interactive design studies; PR #55, awaiting owner visual review). Owner: the icon/grade pairing "feels disjointed… an afterthought" → ratified "carve + orbit" fused emblem, then (v3) retired its 56px card form as illegible ("you cannot tell what's even in those linocut icons") → plate card. Shipped: `RemedyEmblem.astro` (oxblood disc + linocut 72%, mask-carved bite seating the grade seal, grade-colored evidence orbit; spot 80/lead 148; decorative-mode for AT) replacing icon-tile+TierBadge pairs in HeroAnswerCard + RemedyLeadBlock; `RemedyCard.astro` → specimen plate (full-bleed `--primary-soft`, art at 132px, grade STAMPED letter+tier-word from lib/tiers at −3°, name + clamped one-liner, keyCompound dropped from cards; hover lift + art scale 1.02, both off under reduced-motion); RemedyIcon gains `fill`. design-guardian FAIL→PASS (fixed: reduced-motion lift; spotlight visible "Grade X · tier-word" line; stale 3.75:1→5.56:1 doc figure; stamp worst-case 5.20:1 AA ✓, stamp/art overlap alpha-scanned 31/31 clean); compliance PASS (0 forbidden framings, disclaimers intact; NOTE: re-review "S · PROVEN" stamp if plate card ever ships outside /tiers). CI hardened: forbidden-framing lint TARGETS 3→all 30 components. DESIGN_SYSTEM §11.1 amended + §11.2 added; design doc + v3 addendum in docs/plans/. verify+build green; 31/31 tier cards SSR plate+stamp. Deferred: `index.astro` pre-existing type errors (Lucide props, RemedyIcon size="pill"); tokenize plate-card font-weight 650 / line-height 1.15 on next touch.
- 2026-07-13 · design · body reading line-height 1.45 → 1.6 (owner WIP finished). Loosened `--lh-base` 1.45 → 1.60 in `global.css` (drives `--text-base`, so all body/reading text site-wide gets more generous leading — a legibility win for the long-form evidence pages) + added an explicit `letter-spacing: normal` reading-text reset on `body` (no-op restatement; body never set tracking). `DESIGN_SYSTEM.md` type tables synced to `16px / 1.6, no tracking`. design-guardian PASS: doc↔CSS consistent, scale stays monotonic-by-role (lede 1.40 < sm 1.50 < base 1.60), token-only (linter exempts global.css + doesn't scan line-height), no fixed-height container clamps body copy so zero regression. Left untouched: `docs/html-prototype/styles.css:44` (historical v3 prototype artifact, not the live token system). Non-gated, autonomous merge.
- 2026-07-13 · fix · valerian hepatic claim mis-cited (citation-integrity). Two hepatic claims — `claims[]` "Valerian is completely safe" + `safety.risks[]` "Hepatic" — attributed "rare liver reports → multi-herb combination products" to source [3] (Shinjyo 2020), which contains no hepatotoxicity discussion (surfaced by the #47 auditor). evidence-editor took Path A: added source [5] = NIH LiverTox "Valerian" chapter (PMID 31643579, review/NBK548255) which supports the rare/combination-product framing firsthand; repointed both claims (claims row keeps [3] for the tolerability clause + adds [5]; Hepatic row → [5]), reworded to LiverTox's own "very rare / usually in combination with skullcap or black cohosh / mild-to-moderate, reversible" wording — no overreach, safety signal kept (not deleted). citation-auditor PASS (NCBI E-utilities confirms PMID 31643579 active/non-retracted + supports both claims; no hepatic claim still cited to [3]). Format resolver 132→133 cites; build/gates green. Non-gated (no grade change), autonomous merge.
- 2026-07-13 · fix · AskPanel missing `slug` prop (regression fix). `r/[slug].astro:146` rendered `<AskPanel remedyName={d.name} />` without the required `slug` → `data-slug` shipped empty, so the client POSTed `{question, slug:''}` and `api/ask.ts:32` rejected every request with 400 `invalid-slug` — the CHK-6.3 Ask assistant was broken on all 30 remedy pages. One-line fix: `slug={entry.id}`. Verified: built `dist/r/melatonin/index.html` now carries `data-slug="melatonin"`; `astro check` 1 error → 0; build/gates green. Non-gated, autonomous merge.
- 2026-07-13 · home-hero answer-card + compression (owner-approved design 2026-07-13; non-grade, autonomous merge). Implemented the approved `docs/plans/2026-07-13-homepage-hero-answer-card-design.md`: new `HeroAnswerCard.astro` renders all 5 popular-check remedies as SSR answer cards (TierBadge + name + oneLineVerdict + biggestRisk in the vermilion safety register + "Read the full evidence →" `--primary` link); melatonin visible, other 4 `hidden`, switched by the existing popular-check pills via a ~15-line inline script (toggles hidden + aria-current). No-JS: pills stay plain `<a href="/r/{slug}">`, melatonin's card is real SSR HTML. Compression: hero → two-column grid ≥900px (stacks below), headline `--text-display`→`--text-3xl`, page padding `--sp-9`→`--sp-8`, hero margin `--sp-8`→`--sp-7`, grade legend six stacked rows → one horizontal strip (six badges, letter+tier-word caption, decisionTranslation dropped per design). GATE FINDING: only melatonin had `biggestRisk`; owner chose "populate first" → evidence-editor drafted biggestRisk for magnesium/valerian/l-theanine/ashwagandha from each page's OWN already-cited content (no new claims). citation-auditor FAIL→PASS: valerian's first draft attributed rare liver reports to "multi-herb combination products" — source [3] (Shinjyo) doesn't support it; rewrote to the supported additive-sedation caution only. compliance + design-guardian PASS; tokens/cites/framing/crawl/build all green; `--action` spent exactly once. Flagged for owner (pre-existing, out of scope): (a) same unsupported valerian liver↔[3] claim still lives in that file's `claims[]` + `safety.risks[]` — needs a re-source or removal; (b) `r/[slug].astro:146` calls `<AskPanel remedyName={d.name} />` missing the required `slug` prop → the just-shipped Ask assistant likely POSTs an empty slug on every remedy page. Left untouched: pre-existing uncommitted WIP in `docs/DESIGN_SYSTEM.md` + `src/styles/global.css` (body line-height tweak, not mine).
- 2026-07-08 · CHK-5.1 (non-grade) · botanical completeness gate + blend-penalty consolidation (autonomous merge). Turned "verify standardization + dose-match per botanical" into a re-runnable CI gate: new pure-Node scripts/check-botanical-completeness.mjs (verify:botanical; wired into ci.yml) selects botanicals by the same /botanical/i category test label-data.ts uses, asserts non-empty standardization + a doses[] row with studiedDose + marketComparison; all 11 botanicals PASS (zero gaps — nothing fabricated), regression-proofed (blanking a marketComparison makes it fail, reverted). Consolidated the proprietary-blend penalty into one reader-followable rule in methodology §04 (hidden per-ingredient dose → no dose to match a studied dose → downgraded on principle), cross-linked to /sleep-blends; DIRECTIONAL rule only — no numeric magnitude/tier-cap invented (that stays HG). NO grade/content/schema/dependency change (git diff proves it); resolver 66/20 unchanged; build/crawl green. compliance + design-guardian PASS. Self-merged (autonomy grant — no grade assigned; expansion toward 30 remains HG). Flagged: sleep-blends back-anchor points at §07 #rankings but the rule now lives in §04 (no id) — small follow-up.
- 2026-07-08 · CHK-6.1 · compare tool (opens Phase 6, autonomous merge). New `/compare` — single server-rendered matrix of all 20 remedies (grade→name canonical order, crawlable, JS-off safe) mirroring the tier-board island: a scoped no-framework script only filters/hides existing rows by goal + category (aria-pressed, keyboard, focus-ring). Every cell reads EXISTING data (no schema change, no new cites 66/20, grades read-only — data files untouched): grade (TierBadge + decisionTranslation + "rates evidence, not safety") · goal (outcomes[] chips) · effect (oneLineVerdict verbatim) · evidence gates (tier typicalGates) · who-should-avoid (omit-empty) · per-remedy interaction cautions (reuses the approved label-R5 register → /safety + /medications-and-sleep-aids). D4 salvage done right: NO pairwise "X vs Y" pages, NO cross-remedy aggregation, "comparing ≠ combining" ContextBanner + adjacent Disclaimer. compliance-reviewer FAIL→PASS — caught a real D4 leak the builder's grep missed: hops's bestFor chip "usually alongside valerian" rendered a cross-remedy pairing signal next to valerian's row; fixed per compliance option A (goal cell renders outcomes[] only; bestFor not shown on the grid, stays on remedy pages — no corpus edit), also resolved the magnolia bestFor chip. design-guardian PASS (token-only, card-grid degrades to mobile, interaction cell in amber caution register not vermilion, no fabricated grade). Extended check-crawlable.mjs to assert /compare renders rows + grade + framing + interaction register + disclaimer server-side. Nav gains "compare"; /tiers cross-links (CHK-3.4 deferred faceting here). Self-merged (autonomy grant). Flagged for owner: hops corpus labels naming valerian are honest on the solo page, worth a look. Deferred: pairwise/shareable compare URLs.
- 2026-07-08 · CHK-5.2 PR-C · anxiety-driven insomnia audience page (built + all reviewers PASS; owner-approved merge). `/anxiety-and-sleep` — the most sensitive page in the set; deliberately routed to owner sign-off because mental-health-boundary content is the highest-harm category and owner is away. Predominantly NAVIGATIONAL: no diagnosis/screening (no symptom checklist — explicitly states a wiki can't screen), no supplement-treats-anxiety claim (l-theanine/ashwagandha cross-linked only as thin SLEEP evidence, stated NOT anxiety treatments), anxiety↔insomnia loop described experientially (no epidemiological cite), anxiety side routed to clinician, crisis/self-harm routed to /when-to-see-a-doctor#urgent via the .sev-serious callout. Only 2 cited claims, both CBT-I-for-insomnia (Qaseem/ACP 2016 27136449 first-line; van Straten 2018 28392168 87-RCT g≈0.98 robust across comorbid disease) — corpus-reused, citation-auditor re-verified verbatim, meta-analysis NOT stretched to anxiety; §03 explicitly "none of this says CBT-I treats anxiety." compliance (dedicated MH pass) PASS — attests no diagnosis/screening, no supplement-anxiety claim, crisis routing present, "bridge" sentence in-bounds; design-guardian PASS (style byte-identical to exemplars). Applied compliance's accuracy note: "weak"→"thin" so l-theanine/ashwagandha sleep evidence matches their live tier-B grade (methodology no-round-down). Build/token-lint/resolver(66,unchanged)/crawl green. Completes the BUILD of all 4 CHK-5.2 pages (3 merged + this one in PR).
- 2026-07-08 · CHK-5.2 PR-B · older-adults + jet-lag/shift-work audience pages (autonomous merge). Two ungraded context pages (10-part skeleton, byte-identical style to the medications exemplar). `/older-adults`: higher-stakes framing (falls/next-day impairment/anticholinergic load) — Beers 2023 (PMID 37139824) avoid first-gen antihistamines; Glass BMJ 2005 (16284208) sedative-hypnotic harm NNT 13/NNH 6/cognitive 4.78×/psychomotor 2.61×; Zhdanova (11600532) 0.3mg physiological dose; Culpepper (27057416) reused. `/jet-lag-shift-work`: melatonin as TIMING not sedation — Herxheimer Cochrane 2002 (12076414) 9/10 trials, 5+ zones, 0.5–5mg similarly effective, wrong-time worsens; Auger AASM 2015 (26414986) timed melatonin for intrinsic clock disorders, shift-work-disorder out of scope → routed to clinician (never claims melatonin treats SWD). All 6 cites verified FIRSTHAND against full text by citation-auditor (every Glass number checked); resolver 66/20 unchanged. compliance PASS (conservative, dosing-instruction-free, diagnosis-free) + design-guardian PASS. Applied one citation-auditor fidelity fix: SWD wording "does not endorse" → "out of scope" (extrinsic disorder). Registered 2 content-index entries + Footer nav. Self-merged under owner autonomy grant. CHK-5.2 now only PR-C (anxiety) remaining.
- 2026-07-08 · CHK-5.2 PR-A · medications + sleep aids audience page (autonomous merge). New ungraded context page `/medications-and-sleep-aids` (10-part skeleton, mirrors melatonin-gummies exemplar): interactions/timing framed as a PHARMACIST conversation before any sleep aid — D4-clean (never combine/avoid as advice, never "safe for you", no diagnosis, no dosing). SOURCE-FIRST via evidence-editor; citation-auditor re-verified all 5 firsthand online: AASM 2017 (27998379) weak-recs-against melatonin/diphenhydramine/valerian; Härtter 2000 (10668847) fluvoxamine→melatonin 17×AUC/12×Cmax (mechanism kept honest, no CYP isoform pinned); Culpepper 2015 (27057416) antihistamine anticholinergic + next-day impairment (full text pulled — specifics not in abstract); Teschke 2010 (20720265) + CDC MMWR 2002 (12500906) kava hepatotoxicity/comedication. Evidence-editor CUT a valerian additive-sedation cite whose abstract didn't support it (kept navigational). Unblocked two deferrals: /safety meds card + label-checker R5 rules-doc now route here; R5 flag output byte-unchanged (label-rules.ts no diff) — still never recommends/forbids a combination. compliance + citation-auditor + design-guardian all PASS; build/token-lint/resolver(66,unchanged)/crawl green. Self-merged under owner autonomy grant. CHK-5.2 remains [~]: PR-B (older adults + jet-lag/shift-work) and PR-C (anxiety, isolated) still to come. Pre-existing bug flagged: /favicon.svg 404s site-wide (Base.astro ref, no public/ asset).
- 2026-07-08 · CHK-4.1 · Label Checker MVP (opens Phase 4, autonomous merge). New `/label-checker` — SSG shell (server-rendered rules documentation with per-rule source links, real client-only privacy promise, allowed-framing note, ContextBanner + Disclaimer) + client island (paste→check→flag; NOTHING POSTed — pasted text stays in the browser, only a GET of the static /label-index.json). Mirrors the SearchPalette island + search-index.json.ts prerender pattern. 5 rules read EXISTING cited data — NO schema change, NO new citations (resolver 66/20 unchanged), NO new deps: R1 proprietary-blend, R2 melatonin>5mg (framed vs the studied 0.5–5mg range; grogginess clause verbatim-cited from melatonin.mdx, not a "5mg unsafe" claim), R3 dose<studied-floor (silent when unparseable — no false flags), R4 botanical missing standardized extract, R5 interaction cautions (D4-salvage — routes to pharmacist/clinician + /safety, NEVER recommends/forbids a combination; multi-sedation string is a routing observation only). Output = fixed templates; harness-tested (R1/R2/R3/R4/R5 fire correctly; out-of-corpus + at-floor ingredients produce no false flags). compliance-reviewer PASS (exhaustive per-string verdict: descriptive/navigational/diagnosis-free/D4-clean; privacy promise verified — no POST of pasted text) + design-guardian PASS (§5 label-input/flag-row primitives, contrast §8, renders NO fabricated grade for a panel). Extended scripts/check-crawlable.mjs to assert the rules doc is server-rendered. Nav gains "label checker". Build/token-lint/crawl green. Self-merged under owner autonomy grant (free tool, not monetization/legal/grade). Deferred: OCR/upload, %DV math, form-mismatch/3rd-party modules, pro features CHK-6.5.
- 2026-07-08 · CHK-3.2 · Start Here page (completes Phase 3, autonomous merge). New `/start-here` navigational IA page — no new health claims, no citations. Implements the doc-03 brief's 5 sections in order: situation tiles · "what Somnary grades" scope prose + real StatRow (20/66/0/$0 computed) · "when not to use this site" boundary routing → /safety with standard Disclaimer adjacent + explicit "this isn't a diagnosis, it's a signpost" framing · S–F "how to read a grade" legend (TIERS + decisionTranslation + grade≠safety note) · "most common checks" pills (melatonin/magnesium/sleep-blends/cbd/valerian) + corrections link. Nav gains "start here". All 13 links resolve. compliance PASS (section-3 conservative/navigational/diagnosis-free, line-by-line) + design-guardian PASS (clean, no fixes). Build/token-lint/resolver(66,unchanged)/crawl green. Self-merged under owner autonomy grant. Added PHASE 3 COMPLETE marker.
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
