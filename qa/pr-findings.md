# Design QA — PR findings

**Verdict: RESOLVED** — the 1 P1 and both P3 notes are addressed; the rendered-visual + keyboard pass is complete. Re-review before merge; merge itself stays gated (medical-boundary + publication-state work).

## Findings (P0 → P3)

**[P1 — FIXED] src/pages/outcome/[slug].astro** — The outcome page ranks remedies "best evidence first" for a sleep goal (a decision moment) but carried NO in-page "educational, not medical advice" disclaimer — it appeared only in the global Footer, a footer-only failure for a decision page (CLAUDE.md non-negotiable).
_Fix applied:_ Imported `Disclaimer` and rendered `<Disclaimer variant="standard" />` in a `.disclaimer-top` block between the goal switcher and the ranked list, matching /compare. Verified rendered at 768px — the standard disclaimer now sits adjacent to the ranked decision.
_Evidence (original):_ grep for Disclaimer/"not medical advice"/"educational" returned zero matches; ranked-list aria-label `Remedies for ${outcome.title}, best evidence first`; dek says grades are "ranked by the strength of the human evidence." /compare.astro:136 already does this.

**[P3 — FIXED] src/components/LabelChecker.astro** — Primary/retry buttons set their white label via `color: var(--surface)` instead of the sanctioned `--action-ink` token for text-on-oxblood.
_Fix applied:_ Changed `color: var(--surface)` → `color: var(--action-ink)` on `.btn-check` and `.btn-retry`. Both tokens resolve to #FFFFFF — semantic-only change, no visual difference. DESIGN_SYSTEM §1 names `--action-ink` as the text color for oxblood/`--action` fills.

**[P3 — NO CHANGE NEEDED] src/pages/changelog.astro** — Reviewer flagged a possible two-adjacent-oxblood-soft-pill cluster on a provisional grade-change row (`type-grade` chip beside ReviewState `is-prominent`).
_Disposition:_ Verified visually at 390px. Current changelog rows render the type chip as neutral grey ("Review entry") beside a single oxblood "Provisional" chip — clearly distinct, one oxblood pill per row. The double-oxblood cluster would only occur on a `type-grade` (grade-change) row, of which none exist in current content. As the reviewer noted, this was a verify-visually flag with no token change required. No change made.

## Static gates

| Gate | Result |
| --- | --- |
| tokens | PASS — no retired tokens or hardcoded colors; 32 non-blocking raw-px spacing warnings (pre-existing baseline) |
| crawlability | PASS — 31 remedy pages + key routes carry content in static HTML |
| forbidden-framing | PASS — 65 shipped files clean; self-test caught seeded bad string |
| citations | PASS — 142 citations across 31 remedy files, all carry a valid identifier |
| astro check | 1 error — pre-existing `src/lib/lens/websearch.ts:199` only; no new errors from these changes |
| build | PASS — production build Complete |
| verify:publication-states | PASS — 31 explicit records |
| verify:label-checker | PASS — state tests pass (re-run after the token edit) |

## Rendered-visual + keyboard pass — COMPLETED

Done by hand via Chrome MCP against the dev build (routes scoped from the diff):

| Route | 375 | 768 | 1440 | Result |
| --- | --- | --- | --- | --- |
| /tiers | ✅ | ✅ | ✅ | Two-tier board + "Under author review · 29 remedies" group; ranked = REVIEW COMPLETE, under-review = SECOND PASS |
| /outcome/fall-asleep-faster | ✅ | ✅ (post-fix) | — | Honest empty ranked-state; under-review remedies with grade + state, no ordinal; disclaimer now adjacent |
| /r/cbn | ✅ | — | — | Grade stamp "D WEAK PROVISIONAL" — pending_signoff surfaced prominently |
| /search?q=cbn | ✅ | — | — | CBN result carries a "Provisional" chip beside the D grade |
| /changelog | ✅ (390) | — | — | Chips render distinct (grey "Review entry" + oxblood "Provisional") |

- **Nav overflow:** none at 375/390px on any route (the known Somnary risk — clear).
- **Keyboard:** logical tab order (logo → Remedies → Which to buy → …), clear focus-visible rings on all interactive chrome.
- **Only artifact:** the dev-only Astro toolbar pill (not shipped).

Shared components the static map didn't cover were exercised through the routes above: GradeStamp/RemedyCard/RemedyHero/HeroCarousel via /tiers, /r/cbn, /; ReviewState via /outcome, /search, /changelog; PublicationStatePanel via /r/cbn; SearchPalette via nav chrome; LabelChecker at /label-checker (token-only edit, no visual change).

## PR comment

```
Design QA: RESOLVED — P1 fixed, both P3s addressed, rendered-visual + keyboard pass done.

P1 outcome/[slug].astro — added <Disclaimer variant="standard" /> adjacent to the ranked
list (was footer-only on a "best evidence first" decision page). Verified at 768px.
P3 LabelChecker.astro — CTA text --surface → --action-ink (same #FFFFFF, no visual change).
P3 changelog.astro — verified at 390px: chips render distinct (grey type + oxblood state);
double-oxblood cluster does not occur on current content. No change needed.

Gates: tokens · crawlability · forbidden-framing · citations · build · publication-states ·
label-checker all PASS. astro check = 1 pre-existing error only (websearch.ts:199).

Rendered-visual + keyboard pass complete: /tiers (375/768/1440), /outcome, /r/cbn, /search,
/changelog. No nav overflow at 375/390px; focus-visible + tab order clean.

Merge stays gated (medical-boundary + publication-state) — owner sign-off required.
```
