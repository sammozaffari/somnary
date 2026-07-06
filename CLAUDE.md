# CLAUDE.md — Somnary agent operating contract (v2, post-pivot)

## LOCKED DECISIONS (owner-ratified 2026-07-06 — do not revisit, do not re-ask)
- **D1 Framework: Astro.** SSG-first, content collections for the corpus, islands
  only where interactivity is required (label checker, compare tool, assistant).
- **D2 Monetization: tools-first, reader-funded.** No membership paywall on the
  wiki. Revenue candidates in order: clinician handout exports, label-checker
  pro features, supporter tier. No affiliate, no brand money — ever. Any ads must
  pass the ad framework in the rulebook (source-backed, no treatment claims).
- **D3 Brand: "Somnary", capitalized**, in prose, UI, and wordmark (`Somnary.`
  with trailing period as the mark). Retire all lowercase-only styling; update
  any doc or design asset that says otherwise when touched.
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

## NON-NEGOTIABLES (violating any of these breaks the product — halt and escalate)
- Zero affiliate links, zero brand money, no commerce, no paid placement.
- Every factual health claim cites a real, resolvable source (PMID / DOI /
  ClinicalTrials.gov). The CI citation resolver must pass; the citation-auditor
  agent must confirm each source supports the claim as written.
- Community/anecdote data never influences or displays as setting a grade.
- Weak evidence is shown and labeled weak. Grades reflect published HUMAN evidence.
- Safety, interactions, and contraindications are prominent on every remedy and
  decision page; "educational, not medical advice" appears near decisions, not
  only in the footer. Be conservative on pregnancy, children, drug interactions.
- All content pages are SSR/SSG. Never ship core content client-only.
- AI features answer only from the reviewed corpus, cite back, refuse
  personalized dosing/diagnosis, and route safety concerns to boundary pages.
  Forbidden framings (from the rulebook): "take X tonight", "your ideal dose",
  "this is safe for you", "combine these", any diagnosis.
- No agent assigns or changes a tier grade. Grading is `[HUMAN-GATE]`, always.

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
- **design-guardian** — token-only styling; contrast checks; grades readable
  without color alone; rejects wellness clichés and hidden disclaimers.
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

## Human gates (never auto-merge)
- Tier grade assignment or change on any remedy.
- Anything monetization, legal-page, or medical-boundary related.
- Phase completion (owner reviews before the next phase starts).
- Any missing design token, schema change, or new dependency with lock-in.
- Publishing to external channels (newsletter, social) — agents draft only.

## Content model (schema lives in code; keep in sync)
remedy = { slug, name, tier `[HUMAN-GATE]`, verdict, bestFor[], notFor[],
biggestRisk, studiedDose, claims[]↔data[] (each row cited), evidenceSummary,
dosingReality, safety[], interactions[], standardization, mechanism,
sources[]{pmid|doi|registry, title, year, type}, communityRead (separate store),
reviewDate, changeLog[] }.
Citations are DATA, never prose-only. Tier board, checkers, compare tool, and
the assistant all read this one structure — never duplicate content.

## Definition of done (per item)
- Acceptance criteria verified and ticked.
- Server-rendered content confirmed in build output.
- Every claim cited; resolver + auditor green.
- Safety module present and prominent (remedy/decision pages).
- Tokens only; no hardcoded style values.
- Review date + correction link on every article-type page.
- Session log line appended; branch merged or PR opened per gate rules.

## If unsure
If a task might violate a non-negotiable, assume it does: stop, write the
question into the PR/plan as `[HUMAN-GATE]`, and move to what can proceed.
