# Hero carousel — full-panel morphing above-the-fold

**Date:** 2026-07-15
**Area:** Homepage above-the-fold (CHK-3.1 lineage; strategy 03 "Homepage Above-The-Fold"; DESIGN_SYSTEM §1/§10)
**Status:** Validated design, ready to build

## Intent

Today the hero is a fixed two-column split: brand message (left) + a live remedy
answer card (right) that crossfades between remedies. Replace it with a single
**full-width panel that morphs between slides**. Slide 1 is the brand message
itself; the panel then rotates through remedy spotlights interleaved with
"useful ways to use the site" slides.

Owner decisions captured in the brainstorm (2026-07-15):
- **What rotates:** the whole hero panel (not just the right card).
- **Utility slides wanted:** Start from your problem · Decode a sleep blend · How grades work.
  (Not a dedicated safety slide — safety stays present via each remedy's biggest-risk line.)
- **Controls:** dots + prev/next arrows (unlabeled dots, but `aria-label` per dot). No labeled tab strip, no persistent CTA bar.
- **Slide layout:** full-width per slide; each slide owns its composition.

## The carousel model

One full-width panel; N slides stacked in a single grid cell (container sizes to
the tallest slide → no height jump); crossfade via `.is-active` opacity toggle.
Reuses the existing `.is-live` stack mechanism from `HeroAnswerCard`.

- All slides are server-rendered. Slide 1 (brand) is visible with no JS.
- The remaining slides are real HTML with their own links → crawlable + no-JS usable.
- Auto-advance 4.5s; pause on hover/focus; disabled under `prefers-reduced-motion` (WCAG 2.2.2).

**Proposed order** (single array at top of `index.astro`, tweakable):
Overview → Magnesium → Valerian → *Start from your problem* → Melatonin →
*Decode a blend* → L-theanine → *How grades work* → Ashwagandha.

## Slide compositions

Shared frame: surface card, hairline border, `--r-xl`, generous padding,
centered content column (~60ch).

**Brand slide** (slide 1) — eyebrow, H1 "Check a sleep remedy before you take it"
(the page's single H1), dek, three CTAs. The oxblood `--action` CTA lives here
and ONLY here (§10 budget).

**Remedy slides** — RemedyIcon + name + TierBadge grade; one-line verdict
(verbatim `oneLineVerdict`); biggest risk in the vermilion safety register
(verbatim `biggestRisk`); "Read the full evidence →" (`--primary` link → `/r/{slug}`).
Every line is already-cited frontmatter — introduces NO new claim, no dose, no recommendation.

**Utility slides** — icon chip (`--primary-soft`) + title + one line of copy + a
`--primary` text link:
- Start from your sleep problem → `#situations`
- Bought a sleep blend? Decode the label → `/sleep-blends`
- How our grades work (mini S–F badge row) → `/methodology`

## Accent discipline

- Oxblood `--action` spent exactly once (brand primary CTA).
- Remedy/utility CTAs are `--primary` text links.
- Icon chips use `--primary-soft` (brand tint, not the action budget).
- Safety stays vermilion (`--warning-bg`/`--vermilion`), distinct from oxblood.

## Build structure

- New `HeroCarousel.astro` renders the whole stack from a typed `slides[]`:
  - `{ kind: 'brand' }`
  - `{ kind: 'remedy', slug }` — same `remedies` collection query as today; skips any slug that isn't a real remedy (never a dead slide).
  - `{ kind: 'utility', icon, title, copy, href, cta }` — small local config.
- `HeroAnswerCard.astro` is absorbed and deleted; its card markup becomes the remedy-slide branch.
- `index.astro` drops the two-column hero + old pill strip; the inline switcher script is rewritten for dots+arrows over the new stack.
- Slide order is one array at the top of `index.astro`, passed in.

## Guardrails / definition of done

- **Token-only.** Reuse existing tokens; if a token is missing, STOP and flag `[HUMAN-GATE]` — never invent a value.
- **A11y.** `role="group"` + `aria-roledescription="carousel"`; per-slide `aria-label`; dots are real `<button>`s with `aria-label` + `aria-current`; arrow buttons; polite live region announces slide changes; pause-on-hover/focus; reduced-motion respected.
- **No new health claim; no dose; no recommendation.** Safety prominent in the first screen (remedy slides).
- **Reviews:** design-guardian + compliance-reviewer on the diff before merge. Build green.
- Server-rendered content confirmed in build output (all slides present in HTML).
