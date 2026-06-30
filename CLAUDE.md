# CLAUDE.md — Project memory (read this in full before every task)

**Project name: somnary** (always lowercase in UI; wordmark is `somnary.` with a trailing period). Tagline pattern: `somnary · [N] remedies graded, [M] sources cited · zero brand money`.

You are building **somnary**, an **independent, evidence-graded sleep & natural-remedies wiki**.
This file is your operating contract. The full rationale lives in `/docs/PROJECT_PLAN.md`
and the task list in `/docs/BUILD_CHECKLIST.md`. Read both before starting any work.

## Start-of-task ritual (do this EVERY session, no exceptions)
1. Read `/docs/PROJECT_PLAN.md` (skim section headers, read the section relevant to today's task in full).
2. Read `/docs/BUILD_CHECKLIST.md` and state which checklist item you are working on.
3. Confirm the item's acceptance criteria back to me before writing code.
4. Do the work in small commits, and **push every commit to GitHub as you go** — never leave finished work only on the local machine.
5. Before finishing: re-read the acceptance criteria, verify each one, tick the box, and report anything skipped or deferred.

**Push rule (applies to every session):** every change that's committed gets pushed to GitHub in the same session — ideally right after each commit. The remote is the source of truth; local-only work doesn't count as done. End every session with a clean `git status` and nothing unpushed.

If a request conflicts with the NON-NEGOTIABLES below, STOP and flag it instead of proceeding.

## NON-NEGOTIABLES (these define the product; violating them breaks it)
- **Independence:** zero affiliate links, zero brand sponsorship, reader-funded only. No `rel=sponsored`, no commerce, no paid placement anywhere. Ever.
- **Evidence firewall:** community/anecdote data must NEVER influence or display as if it sets a grade. Store and render it separately from the graded corpus.
- **Cite or don't claim:** every factual health claim links to a real, resolvable source (PubMed ID, DOI, or ClinicalTrials.gov registry). No invented references. Build the link-resolver check; "0 hallucinated cites" must be enforceable, not aspirational.
- **Crawlability:** all content pages are server-rendered or statically generated (SSR/SSG). Never ship core content as client-only rendering. (The reference site we are improving on hides its content from crawlers — do not repeat this.)
- **Honesty about weak evidence:** weak data is labeled weak, shown not hidden. Tiers reflect published HUMAN evidence quality, not popularity.
- **Medical safety:** every remedy page surfaces safety/interactions/contraindications prominently (not in fine print). Site-wide "educational, not medical advice" disclaimer. Be conservative on pregnancy, children, drug interactions.

## Tech decisions (locked — confirm with me before changing any)
- Framework: SSG/SSR (Next.js or Astro — confirm which is set in `package.json` before assuming).
- Content model: structured (MDX or CMS). A remedy = { tier, verdict, claims[], data[], doses[], safety[], standardization, mechanism, sources[], aliases[] }. Non-supplement interventions reuse the same schema (adapted). The tier board, stack builder, search index, and Ask assistant all read this same structured data — do not duplicate content.
- Citations are DATA, not prose: each source stored with its PMID/DOI so links can be auto-validated.
- Search is build-time generated from structured content (names + aliases/latin names + outcomes + symptoms). Two surfaces, one index: ⌘K palette + crawlable /search page. See DESIGN_SYSTEM §2.13/§3.7 and PROJECT_PLAN §2a.
- Design tokens come from `/docs/DESIGN_SYSTEM.md` (v1.2, locked). Never invent colors, spacing, or type — use the named tokens and obey that file's §5 guardrails. If a token is missing, ask; don't guess.
- Styling: soft-light palette (warm off-white base, muted lavender/sage accents, desaturated S–F tier spectrum). Calm motion only.

## Build order (from PROJECT_PLAN §11 — do NOT jump ahead)
1. Foundation: repo scaffold, design tokens wired in, methodology page, legal pages.
2. ONE remedy page template, end-to-end (melatonin). All 12 blocks from PLAN §4.
3. Core catalog (launch tier): ~25–30 remedy pages with real citations (§5.1).
4. Search: build-time index + ⌘K palette + crawlable /search page (§2a).
5. Tier board + outcome pages.
6. Interventions: non-supplement sleep aids on the same rubric (§5a).
7. Dispatch newsletter capture.
8. Briefs + membership + paywall.
9. Expansion catalog (ongoing, toward 100+) via the deep-research engine (§5b).
10. Stack builder, Ask (RAG), community reports, PWA/app.

## Working style
- Prefer Plan mode for anything touching more than one file or the content model. Show me the plan, wait for approval.
- One checklist item per session. Don't batch unrelated work.
- Small commits, each message referencing the checklist item (e.g. `feat(remedy): melatonin page template [CHK-2.1]`).
- **Push after every commit.** Don't batch a session's work into one end-of-day push; push as each commit lands so GitHub always reflects the latest state. If a push fails, stop and surface it — don't keep working on top of unpushed work.
- After every change, show the diff and let me approve before applying.
- If you're unsure whether something violates a non-negotiable, assume it does and ask.

## Definition of done (per page/feature)
- Acceptance criteria in BUILD_CHECKLIST ticked and verified.
- Content server-rendered and crawlable (verify in build output).
- Every claim cited; every citation link resolves.
- Safety section present and prominent (for remedy pages).
- Matches DESIGN_SYSTEM tokens; no hardcoded style values.
- Committed with a checklist-referencing message **and pushed to GitHub** (verified: nothing left unpushed).
