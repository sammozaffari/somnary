# Design QA — PR findings

**Verdict: PASS-WITH-NOTES** — no P0/P1 findings; 3 low-severity (P3) notes below. All static gates green. Chrome changed, so the rendered-visual + keyboard pass is still REQUIRED before merge (see below).

## Findings (P0 → P3)

**[P3] tailwind.config.mjs:68** — boxShadow.ring still defines the RETIRED single-colour 40%-alpha oxblood focus ring `0 0 0 3px rgba(126,31,43,.40)` that DESIGN_SYSTEM §6/§9-G4/A-01 explicitly superseded (measured 1.19-2.21:1, fails the 3:1 non-text minimum on carbon/tints/grade fills).
_Fix:_ Delete the `ring` key from boxShadow (no `shadow-ring` utility is consumed anywhere), or point it at the two-tone token so a stray `shadow-ring` cannot ship a WCAG-failing ring; the live tokens correctly use `var(--ring)=var(--focus-ring)='0 0 0 2px var(--surface),0 0 0 4px var(--primary)'`.
_Evidence:_ `tailwind.config.mjs:68 ring: '0 0 0 3px rgba(126,31,43,.40)'` vs `global.css:125 --focus-ring: 0 0 0 2px var(--surface), 0 0 0 4px var(--primary)` (A-01). grep for `shadow-ring` across src/ returns zero usages — it is a dormant, contradictory token.

**[P3] src/components/TierBadge.astro:5** — Stale contrast comment claims 'white-on-grade-C (3.75:1) clears WCAG AA large (3:1)', contradicting the ratified DESIGN_SYSTEM §8 value of 5.56:1 (grade C/D were darkened; white on grade C is now AA small, not merely AA-large).
_Fix:_ Update the header comment to the ratified §8 figure (white on --grade-c = 5.56:1, AA small) so the rationale matches the darkened grade palette; the rendered `color:#ffffff` glyph fill is correct and needs no change.
_Evidence:_ `TierBadge.astro:4-5` comment: 'white-on-grade-C (3.75:1) ... clears WCAG AA large (3:1)'. DESIGN_SYSTEM §8: 'white on grade C / D (darkened) 5.56 / 5.96 | AA' and §3: 'grade-C ... clears AA on their tints'.

**[P3] src/pages/methodology.astro:359** — Corrections page states a concrete quantified time commitment ('within 7 days') repeated across seven public surfaces (methodology + all five source scorecards) with no described mechanism guaranteeing it — a borderline 'invented promise' under the real-promises rule.
_Fix:_ Keep, but only if the 7-day target is actually tracked/kept; the current softening ('a target of', 'we aim to fix') makes it defensible as an aspiration rather than a hard SLA. If it is NOT tracked, drop the number and say 'Corrections are public; confirmed errors are fixed as fast as I can, and each fix is logged.' Verify one author can actually meet 7 days before leaving it as a stated commitment.
_Evidence:_ "Corrections are public, with a target of fixing confirmed errors **within 7 days**." (echoed on sources pages as "We aim to fix verified errors within 7 days")

## Static gates

| Gate | Result |
| --- | --- |
| tokens | PASS — exit 0; no unjustified raw values, 17 raw-ok exemptions honored |
| crawlability | PASS — exit 0; 31 remedy pages + key routes carry content in static HTML |
| forbidden-framing | PASS — exit 0; 64 shipped files clean, self-test caught the seeded bad string |
| citations | PASS — exit 0; 142 citations across 31 remedy files all carry a valid identifier |

## Rendered-visual pass

CHROME CHANGED — the rendered-visual + keyboard pass in qa/README.md is REQUIRED and has NOT run in this script. Capture the affected routes at 390/768/1440px and measure nav overflow before merge.

Uncovered files (not exercised by the static gates — review by hand):

- src/components/CitationPopover.astro
- src/components/CiteMarker.astro
- src/components/ClaimsDataTable.astro
- src/components/CommunityBar.astro
- src/components/DosingGrid.astro
- src/components/Fn.astro
- src/components/GateChip.astro
- src/components/GradeStamp.astro
- src/components/HeroCarousel.astro
- src/components/LabelChecker.astro
- src/components/PublicationStatePanel.astro
- src/components/RemedyCard.astro
- src/components/RemedyCoda.astro
- src/components/RemedyHero.astro
- src/components/ReviewState.astro
- src/components/SafetyCallout.astro
- src/components/SearchPalette.astro
- src/components/StatRow.astro
- src/components/TierBadge.astro
- src/components/scorecards/ProductPage.astro

## PR comment

```
Design QA: PASS-WITH-NOTES (0 P0/P1, 3 P3)

Static gates all green: tokens · crawlability · forbidden-framing · citations (all exit 0).

P3 notes (non-blocking):
- tailwind.config.mjs:68 — dormant boxShadow.ring uses the RETIRED single-colour oxblood
  focus ring (fails 3:1); zero shadow-ring consumers. Delete it or point at var(--focus-ring).
- TierBadge.astro:5 — stale contrast comment (3.75:1 / AA-large) contradicts ratified §8
  (5.56:1, AA small). Comment-only; rendered #ffffff fill is correct.
- methodology.astro:359 — "within 7 days" corrections target echoed on 7 public surfaces;
  keep only if actually tracked (real-promises rule), else drop the number.

CHROME CHANGED — rendered-visual + keyboard pass (qa/README.md) is REQUIRED and has NOT run
here. Capture affected routes at 390/768/1440px and measure nav overflow before merge. 20
shared components (CitationPopover, RemedyCard, GradeStamp, Nav-adjacent chrome, etc.) are
uncovered by static gates — review by hand.
```
