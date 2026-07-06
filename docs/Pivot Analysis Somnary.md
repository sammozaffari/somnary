# Somnary — Pivot Analysis & Agent Operating Plan
*Prepared 2026-07-06. Inputs: original project docs (PROJECT_PLAN, CLAUDE.md, BUILD_CHECKLIST, DESIGN_BRIEF, DESIGN_SYSTEM), the strategy package (01–07 + sources), the v3 HTML prototype + design review, current-UI screenshots, and the pitch deck.*

> **CORRECTION (2026-07-06, CHK-0.0):** §1 below claims "No application code exists"
> and that DESIGN_SYSTEM.md is 100% TODO. Both are wrong: this repo contains a full
> Astro site built 2026-06-30 → 07-03 (20 graded remedies incl. CBT-I, tier board,
> 7 outcome pages, methodology, legal, search, citation resolver in `prebuild`),
> styled from the completed soft-light DESIGN_SYSTEM v1.2. The analysis was authored
> from the docs alone. Its *conclusions* (adopt the strategy package, evidence-teal
> design, decision-first IA, CHK-0.0 first) remain ratified via CLAUDE.md D1–D4; its
> *baseline facts* do not. The pivot is a **migration of a live site**, not a
> greenfield build — see BUILD_CHECKLIST v2's reality baseline.
> Note also: §4 D3 recommends lowercase "somnary."; the owner ratified the opposite
> (capitalized "Somnary"). CLAUDE.md wins.

---

## 1. Current state (facts, not plans)

- **No application code exists.** No `package.json`, no Next.js/Astro scaffold. CHK-0.1 through CHK-0.5 are untouched.
- **A v3 HTML prototype exists** (`/docs/html-prototype/`): index, tiers, remedy-melatonin, outcome-fall-asleep, safety, label-checker. It carries a complete, real token set in `styles.css`.
- **The design has already pivoted in practice.** The design review records that the bold-primary teal approach was user-accepted and applied across all six pages. DESIGN_SYSTEM.md is still 100% TODO and describes the abandoned lavender/sage direction.
- **The strategy package supersedes parts of PROJECT_PLAN** but no document says so explicitly — which is exactly the kind of ambiguity that derails autonomous agents.

## 2. What survives the pivot (the invariants)

These appear in both generations of docs and are the product. They become the agent constitution:

1. Evidence-graded (S–F), published **human** evidence only sets grades.
2. Cite or don't claim — every claim resolves to PMID/DOI/registry; 0 hallucinated cites is *engineered* (resolver + audit), not asserted.
3. Zero affiliate, zero brand money, reader-funded.
4. Anecdote/community never touches a grade (the firewall).
5. Weak evidence shown as weak.
6. Safety surfaced prominently; educational-not-medical-advice near decisions, not just the footer.
7. SSR/SSG crawlability — never client-only content.
8. AI may explain the corpus; AI may not exceed the corpus.

## 3. The pivot, itemized

| # | Dimension | Old (PROJECT_PLAN / CLAUDE.md) | New (strategy package + v3 prototype) | Status |
|---|---|---|---|---|
| P1 | IA | Remedy-first; tier board is "the hook" | Decision-first: Start Here / Remedies / Goals / Safety / **Label Checker** / Evidence System / Community. Hero: "Check a sleep remedy before you take it" | **Adopt new.** Tier board survives as the Remedies overview, demoted from hero. |
| P2 | Design | Soft-light: warm off-white, lavender/sage, "calm, settling" | Evidence-teal system: `--primary #006b70`, citron action `#b8ff5c`, vermilion safety `#e34234`, Archivo display + IBM Plex Sans, grade colors per-letter | **Adopt new** (already user-accepted per design review). Requires rewriting DESIGN_SYSTEM.md from `styles.css` — see §5. |
| P3 | Flagship product | Stack builder ("the Lab") | Label Checker + Remedy Checker + Compare tool + clinician handouts. Decision frameworks **forbid** "build your stack" CTAs and AI stack-combining | **Kill or radically reframe stack builder.** CHK-6.1 conflicts with the new rulebook. Needs one human decision (D4 below). |
| P4 | Monetization | Membership: paid briefs + annual + capped lifetime | Reader-funded, tools-based, professional-facing first; source-backed ads permitted under strict framework; briefs/membership barely mentioned | **Unresolved — human decision D2.** Agents must not build a paywall until decided. |
| P5 | Audience | Skeptical buyer, biohacker-adjacent energy | Explicitly de-centers biohackers; adds caregivers, older adults/medication users, anxious sleepers, shift workers, clinicians | **Adopt new.** Changes Phase-3 content priority: melatonin + sleep-blend wedge first, audience/safety pages before catalog breadth. |
| P6 | Content lanes | Wiki pages + outcome pages + paid briefs | Five lanes: remedy truth, decision pages ("Should I try X for Y?"), safety pages, label pages, evidence-watch | **Adopt new.** Remedy page template (§4 of PLAN) survives but gains the new lead: grade / best-for / not-for / biggest-risk / studied-dose *before* claims-vs-data. |
| P7 | Growth | SEO + newsletter funnel to membership | "We checked the claim" formats; newsletter as retention engine; YouTube/short-form label teardowns; pharmacist/CBT-I collaborations; paid tests days 61–90 | **Adopt new** as marketing track (agents can draft; publishing stays human). |
| P8 | Brand casing | `somnary.` always lowercase, trailing period | New docs use "Somnary" capitalized throughout | **Human decision D3** (trivial but brand-defining; agents will otherwise flip-flop). |
| P9 | New non-negotiables | — | Decision frameworks (doc 06): forbidden AI framings ("take X tonight", personalized doses, diagnosis), ad rules, CTA verb lists, article 10-part skeleton, review-date + correction link on every article | **Adopt as the standing rulebook**, referenced from CLAUDE.md. |

## 4. Decisions that need a human (make these once, then agents run)

- **D1 — Framework.** Recommend **Astro** (content-heavy, MDX/content-collections native, SSG by default, islands for the label checker & Ask). Next.js acceptable if you foresee heavy app surfaces. One-line answer needed.
- **D2 — Monetization reconciliation.** Options: (a) keep membership/briefs as Phase 5 unchanged; (b) replace with tools-first (clinician handout PDFs, label-checker pro) + optional supporter tier; (c) defer entirely, revenue decisions post-traction. Recommend **(b)** — it matches the new strategy and avoids paywalling the credibility engine.
- **D3 — Brand casing.** Recommend keeping the original **`somnary.` lowercase wordmark** (it's distinctive and already specified); prose may capitalize sentence-initially.
- **D4 — Stack builder.** Recommend **kill** CHK-6.1 as designed; salvage the interaction-warning engine as part of the Compare tool and Safety router (interactions surfaced, combinations never recommended).

## 5. Immediate doc reconciliation (first agent task, CHK-0.0)

1. Move strategy package into `/docs/strategy/01–07 + sources`. Add a `SUPERSEDES` note at the top of PROJECT_PLAN pointing at it for IA, design, product, growth.
2. **Rewrite DESIGN_SYSTEM.md from the v3 prototype's `styles.css`** — the tokens already exist: paper `#f5f7f3`, surface `#ffffff`, ink `#091a18`, muted `#53635f`, primary `#006b70` / deep `#004c50` / soft `#dff2ee`, action `#b8ff5c` (ink `#12220d`), vermilion `#e34234` (bg `#fff0ed`), grades A `#0a6f5c` · B `#006b70` · C `#b87900` · D `#b14a2b` · F `#b82432`, radius 7px, page width `min(1460px, 100vw−32px)`, Archivo + IBM Plex Sans. Add: S-tier color (missing — prototype only defines A–F), contrast-check results, spacing/type scales, motion tokens.
3. Replace CLAUDE.md with the agent-team version (delivered alongside this file).
4. Rewrite BUILD_CHECKLIST per §6.

## 6. Revised build order (post-pivot)

- **Phase 0 — Scaffold & guardrails:** repo, framework (D1), tokens wired from new DESIGN_SYSTEM, content schema (add: `bestFor[]`, `notFor[]`, `biggestRisk`, `reviewDate`, `labelFlags[]`), **citation resolver in CI**, token linter, crawlability check.
- **Phase 1 — Credibility spine:** methodology page (rubric + evidence gates + source hierarchy + corrections policy), legal pages, disclaimer component, **evidence change log** page (new).
- **Phase 2 — Melatonin Decision Hub** (upgraded from single page): remedy page with new lead block, dose/timing, pediatric risk, gummy label-accuracy content — this is the SEO wedge and the template every page inherits.
- **Phase 3 — Decision-first surfaces:** Start Here, Safety hub/router, homepage with checker hero + situation route tiles, tier board as Remedies overview.
- **Phase 4 — Label Checker MVP** (static rules first: proprietary blends, dose mismatch, >5 mg melatonin, missing standardization, interaction flags) + newsletter capture + claim-submission form.
- **Phase 5 — Catalog expansion:** 20–30 remedies prioritized by the wedge (melatonin cluster, sleep blends, CBD, magnesium, valerian, L-theanine…), audience pages (child melatonin, meds interactions, older adults, shift work, anxiety-driven insomnia), CBT-I hub.
- **Phase 6 — Tools & AI:** compare tool, clinician handout export, scoped page assistant (RAG, corpus-only, refusal-tested), community reports (firewalled). Monetization per D2.

## 7. Agent operating model (how this runs without you shuttling)

**Principle: replace your approval loop with automated gates + agent reviewers; keep you only at phase boundaries and D-decisions.**

- **Single source of truth = the git repo.** All docs live in `/docs`. Chat is for D-decisions and phase reviews only.
- **Subagents** (`.claude/agents/*.md`):
  - `planner` — decomposes the next checklist item into tasks with acceptance criteria; flags anything touching a non-negotiable or requiring a D-decision.
  - `builder` — implements; never merges its own work.
  - `evidence-editor` — drafts remedy/decision/safety content **source-first** (pulls PMIDs/DOIs before writing); follows the 10-part article skeleton from doc 06.
  - `citation-auditor` — verifies every citation resolves **and says what the page claims** (the resolver proves existence; the auditor proves fidelity). Blocks merge on failure.
  - `design-guardian` — token-only styling, contrast, grade-not-color-alone accessibility, no wellness clichés (rules from doc 06's design framework).
  - `compliance-reviewer` — TGA/FDA/FTC-safe language, safety-section prominence, disclaimer near decisions, forbidden-framing lint for any AI/CTA copy.
- **Gates (CI + hooks):** citation resolver fails the build on unresolvable sources; token linter fails on hardcoded hex/spacing; crawlability check greps built HTML for page content; pre-commit runs resolver + lint; post-session hook appends one line to the BUILD_CHECKLIST session log.
- **Workflow:** one checklist item per session → planner plan → builder branch → reviewer agents pass/fail → PR with checklist-referencing message → auto-merge when all gates green, **except** items tagged `[HUMAN-GATE]` (phase completion, anything monetization/legal/medical-boundary, grade assignments on new remedies).
- **Your role shrinks to:** answer D1–D4 now; review at each phase boundary; approve grades on new remedies (two-pass grading keeps a human as the second pass); approve anything the compliance-reviewer escalates.

## 8. Risks specific to agent-run development

- **Grade drift:** never let an agent assign or change a tier unreviewed — grades are the product's IP and its legal surface. Keep `[HUMAN-GATE]` on all grading.
- **Citation fidelity ≠ citation existence.** A resolving PMID can still be misrepresented. The citation-auditor must check claims against abstracts, and its pass/fail rationale must be logged per claim.
- **Doc contradiction loops.** Until §5 reconciliation lands, agents will oscillate between lavender and teal, membership and tools. Do CHK-0.0 first, before any code.
- **Scope gravity.** The backlog (doc 07) is enormous; the planner must enforce "one item, current phase only" — the old rule survives because it's what keeps autonomous agents from wandering.
