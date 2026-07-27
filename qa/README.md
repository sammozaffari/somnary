# Design QA gate

A saved, versioned design-QA gate for Somnary, modelled on
[agenticdesign.school's "Design QA on Every PR"](https://agenticdesign.school/workflows/design-qa-on-every-pr).
It scopes the review to the branch diff, runs the deterministic gates and the
read-only reviewer agents, and merges **ranked findings the author can act on** —
it never edits code. This is the *critique* step of the Brief → Generate →
**Critique** → Revise → Ship loop, made repeatable.

## Run it

```
/design-qa                 # from Claude Code, on a UI/content branch
```

or, equivalently, invoke the workflow by name. It writes `qa/pr-findings.md`.
Post it to the PR:

```
gh pr comment --body-file qa/pr-findings.md
```

Then the author fixes on the branch and re-runs `/design-qa`. Merge when no
**P0/P1** remains. Humans decide severity disputes and intentional deviations —
the gate makes review cheap and consistent, it does not replace judgement.

## What runs automatically

- **Scope** — `git diff origin/main...HEAD` → changed files → affected routes
  (via `qa/pages-map.json` for shared chrome). Uncovered shared files are
  *reported*, never silently skipped.
- **Static gates** (only those the diff makes relevant): `verify:tokens`,
  `verify:crawl`, `verify:framing`, `verify:cites`.
- **Reviewers** (read-only, scoped to the diff): `design-guardian` (tokens +
  contrast), `compliance-reviewer` (framing + disclaimers), `citation-auditor`
  (claims resolve + support) — only when the relevant file types changed.
- **Merge** — ranked P0–P3 findings, each with **file:line + offending value +
  fix + evidence**, plus a paste-ready PR comment.

## The rendered-visual + keyboard pass — MANUAL, required for chrome changes

The gate cannot prove the rendered pixels are right at every width, and Somnary
has **no headless screenshot tool checked in** — adding Playwright is a
new-dependency HUMAN-GATE (CLAUDE.md). So the visual pass is run by hand with the
Claude-in-Chrome MCP whenever a change touches `Nav`, `Footer`, `Base`, global
styles, or a shared component. Do not call a chrome change done without it.

1. Start the preview: `npm run dev` (serves `http://localhost:4321`).
2. For each affected route (see `qa/pages-map.json`), view it and check the
   **states** listed there.
3. **Nav overflow is the known risk below the 640px breakpoint.** Chrome's window
   won't shrink below ~500px, so measure the intrinsic width instead of eyeballing
   it — run this in the page console / `javascript_tool` and require it to fit the
   target viewport (mobile padding is `--sp-5` = 24px each side):

   ```js
   (() => {
     const nav = document.querySelector('.nav');
     const links = nav.querySelector('.links');
     const wordmarkW = Math.round(nav.firstElementChild.getBoundingClientRect().width);
     const linksW = Math.round(links.scrollWidth);
     const sp5 = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sp-5')) || 24;
     const need = wordmarkW + linksW + 2 * sp5;
     return { need, fitsIn390: need <= 390, fitsIn360: need <= 360 };
   })()
   ```

4. **Keyboard pass** on new/changed interactive elements: Tab reaches them in a
   sensible order, focus is visible, Enter/Space activate, and the global
   "← Back" affordance is reachable and labelled.
5. Paste the result (pass, or a finding with a capture path) into
   `qa/pr-findings.md` under "Rendered-visual pass".

### RESOLVED finding (Phase 1 chrome QA, PR #131 → closed in search-first Phase 2)

The original Phase-1 note read "navbar needs ~412px, overflows 390px by ~22px."
That reading was a **measurement artifact**: it was taken with the Chrome window
at ≥500px, where `@media (max-width: 640px)` is inactive, so the search trigger
was still the full 124px "Search ⌘K" pill. The icon-only collapse has existed in
`SearchPalette.astro` since CHK-4.2 — it just wasn't firing at measurement time.

**Re-measured at a true 390px and 360px viewport** (via a same-origin iframe so
the ≤640px media query is active — `st-label` hidden, trigger = 44px icon):

| viewport | wordmark | `.links` | need | fits |
|---|---|---|---|---|
| 390px | 40 | 242 | **330** | ✅ (60px headroom) |
| 360px | 40 | 242 | **330** | ✅ (30px headroom) |

No overflow at either width; `nav.scrollWidth === clientWidth` (no horizontal
scroll). Desktop still shows 🔍 + "Search" (124px pill). **No code change was
needed** — the fix was already in place; Phase 2 verified and documented it.
Always measure at the true target width (iframe or device emulation), never a
resized desktop window.

## Editing / extending

`qa/pages-map.json` and `.claude/workflows/design-qa.js` are versioned with the
code. When the gate reports an uncovered shared component, add it to the map.
Tighten reviewer prompts if findings drift toward generalities. Note in the PR
comment which version of the gate produced the findings.
