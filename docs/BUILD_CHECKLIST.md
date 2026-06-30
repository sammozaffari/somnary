# BUILD_CHECKLIST.md

Work top to bottom. One item per session. Do not start an item until the previous phase's items are ticked, unless I say otherwise. Each item has **acceptance criteria** — tick the box ONLY when every criterion is verified, and report any criterion you could not meet.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done & verified

**Standing rule:** every commit is pushed to GitHub in the same session it's made — push as each commit lands, not in one batch at the end. An item isn't "done & verified" until its work is committed *and* on the remote. End every session with nothing unpushed.

---

## Phase 0 — Repo & guardrails
- [x] **CHK-0.1 Repo scaffold.** Init repo, `/docs` holds PROJECT_PLAN.md + this file + DESIGN_SYSTEM.md, CLAUDE.md at root. *Accept:* all four files present; `.gitignore` correct; first commit pushed to GitHub.
- [ ] **CHK-0.2 Framework decision committed.** Choose Next.js or Astro (SSG/SSR). *Accept:* `package.json` exists; a placeholder home route renders server-side; build output contains pre-rendered HTML (verify content is in the HTML, not injected by JS).
- [ ] **CHK-0.3 Design tokens wired.** Import tokens from DESIGN_SYSTEM.md into the styling layer (CSS vars / Tailwind config). *Accept:* a test component renders using named tokens only; no hardcoded hex/spacing in that component.
- [ ] **CHK-0.4 Content model defined.** Schema for a remedy per CLAUDE.md. *Accept:* type/schema file exists with all fields; a sample remedy validates against it; citations stored as structured objects with PMID/DOI fields.
- [ ] **CHK-0.5 Citation resolver.** Script/check that every source's PMID/DOI resolves to a real URL. *Accept:* runs against sample data; fails the build (or logs clearly) if a citation is unresolvable. This enforces "0 hallucinated cites."
- [ ] **CHK-0.6 Content index file.** A CSV/JSON registry of every planned remedy + intervention: name, aliases/latin name, planned tier, research status (not-started/drafting/cited/reviewed/live), source count. *Accept:* file exists; seeded from PLAN §5.1/§5.2/§5a; build can read it; it's the single source of truth for what's planned vs done.

## Phase 1 — Methodology & legal (credibility spine — build BEFORE content)
- [ ] **CHK-1.1 Methodology page.** Publishes the full S–F rubric, evidence-gate chips, source hierarchy, claim-check policy, corrections policy. *Accept:* server-rendered; matches PLAN §3; rubric is specific enough that a reader could re-derive a grade.
- [ ] **CHK-1.2 Legal pages.** Medical-advice disclaimer, terms, privacy, disclosure (zero affiliate/brand money stated and true). *Accept:* disclaimer reachable site-wide; TGA/FDA-safe language (describe evidence, no disease-treatment promises); privacy policy covers AU Privacy Act + GDPR basics.
- [ ] **CHK-1.3 Disclaimer component.** Reusable, appears on every remedy page. *Accept:* renders on a test page; conservative wording re: pregnancy/children/interactions.

## Phase 2 — The remedy page template (the most important UI work)
- [ ] **CHK-2.1 Melatonin page, all 12 blocks (PLAN §4).** header, verdict, claims-vs-data table, evidence summary, dosing reality, safety/interactions, standardization note, mechanism, sources, community read (walled off), Ask stub, SEO furniture. *Accept:* every block present; real citations that resolve; safety section prominent; claims-vs-data table footnoted row-by-row; server-rendered; uses design tokens.
- [ ] **CHK-2.2 SEO furniture.** Question-format title, custom OG image slot, canonical URL, schema.org (MedicalWebPage/Article/FAQ). *Accept:* meta + JSON-LD present in rendered HTML; OG image renders.
- [ ] **CHK-2.3 Tier badge + evidence-gate chips components.** *Accept:* reusable; desaturated tier colors per design system; chips render from structured data, not hardcoded.

## Phase 3 — Core catalog (launch tier)
- [ ] **CHK-3.1 ~25–30 remedy pages (launch tier).** Per PLAN §5.1 spread (A/B/C/D/F). Each inherits the §4 template. *Accept:* each page meets CHK-2.1 criteria; grades follow the rubric; every citation resolves; tracked in the content index (CHK-0.6); aliases/latin names captured for search.
- [ ] **CHK-3.2 Standardization + dose-match data captured** for each botanical. *Accept:* the category-specific killers (PLAN §3.2) are present per page where relevant; proprietary-blend penalty logic documented.

## Phase 4 — Search (scales with the catalog — wire early)
- [ ] **CHK-4.1 Build-time search index.** Generated from structured content (names + aliases/latin names + outcomes + symptoms). *Accept:* index builds from content, not hand-maintained; rebuilds on content change; F-grade items are findable by name (tier does not gate ranking).
- [ ] **CHK-4.2 Command palette (⌘K / `/`).** Per DESIGN_SYSTEM §2.13. *Accept:* keyboard-first (↑↓/Enter/Esc), grouped results with tier badges, full a11y (dialog/combobox/listbox roles, focus trap), reduced-motion respected.
- [ ] **CHK-4.3 Crawlable `/search?q=` page.** Per DESIGN_SYSTEM §3.7. *Accept:* server-rendered; deep-linkable; works with JS off; same index as the palette.

## Phase 5 — Navigation surfaces
- [ ] **CHK-5.1 Tier board.** Ranks all remedies S–F, reads structured data. *Accept:* server-rendered; sortable/filterable; links to each page; shareable.
- [ ] **CHK-5.2 Outcome pages (7–10).** Goal-first entry per PLAN §2.3. *Accept:* each maps to remedies by evidence; no anecdote-driven ranking.
- [ ] **CHK-5.3 Home + stat row.** Hero with the "enemy" strike-through, disavowal stat row (remedies / sources / 0 hallucinated cites / $0 brand money). *Accept:* matches positioning §1; stats read from real data.

## Phase 6 — Interventions (non-supplement)
- [ ] **CHK-6.1 Intervention template.** Adapt the §4 remedy template for behavioral/environmental/device interventions on the SAME S–F rubric. *Accept:* CBT-I page built end-to-end with real citations; graded on evidence; clearly part of the same evidence system, not a side blog.
- [ ] **CHK-6.2 First intervention batch.** CBT-I, sleep restriction, stimulus control, morning light, temperature/warm-bath, breathing/PMR, white noise, weighted blanket — per PLAN §5a. *Accept:* each cited + graded; honest where evidence is weaker than marketed (e.g. blue-light glasses); medical/context pages clearly labeled as non-graded.

## Phase 7 — Funnel & membership
- [ ] **CHK-7.1 Dispatch newsletter capture.** *Accept:* email capture works; privacy-compliant; no dark patterns.
- [ ] **CHK-7.2 Briefs structure + paywall.** FREE vs locked labeling; membership tiers (annual + capped lifetime with real scarcity). *Accept:* paywall gates only briefs/exports, never the free wiki; billing integration stubbed or live per decision.

## Phase 8 — Expansion & deep research (ongoing)
- [ ] **CHK-8.1 Expansion catalog toward 100+.** Niche/traditional/under-studied remedies per PLAN §5.2. *Accept:* each meets CHK-2.1 bar; honest D/F grades shown not hidden; content index kept current.
- [ ] **CHK-8.2 Deep-research cadence.** Periodic literature sweep + tier-change log ("how rankings change"); search-query backlog feeds the roadmap (§5b). *Accept:* a documented, repeatable process exists; at least one tier change logged publicly.

## Phase 9 — Advanced
- [ ] **CHK-9.1 Stack builder (the Lab).** Combine remedies → aggregate evidence grade + interaction warnings. *Accept:* interaction warnings surface; export gated to members.
- [ ] **CHK-9.2 Ask (RAG).** Answers only from cited corpus; refuses/hedges off-corpus; cites back. *Accept:* never invents; every answer links to a source in the corpus.
- [ ] **CHK-9.3 Community reports.** Anonymous, structured, threshold-gated, stored separately. *Accept:* no PII; never affects grades; firewall verified in code.
- [ ] **CHK-9.4 PWA / app polish.** *Accept:* installable; core pages cached; mobile-first verified.

---

### Session log (Claude Code appends one line per session)
<!-- e.g. 2026-06-29 — CHK-2.1 melatonin template done, all 12 blocks, 14 citations resolved. -->
2026-06-30 — CHK-0.1 ticked (scaffold criteria already met). Starting Phase 0 CHK-0.2→0.6: Astro + tokens + content model + citation resolver + content index.
