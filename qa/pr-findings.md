# Design-QA — homepage hero refresh (`/`)

**Verdict: BLOCK** — one P1 remains (search-placeholder contrast). Resolve the P1 before merge; the P2/P3 items can follow or ship as noted.

Scope: `/` (index.astro, HeroCarousel, hero-slides, GradeStamp, RemedyIcon, recon-evidence). Chrome untouched.

## Findings (P0 → P3)

**[P1] src/pages/index.astro:377** — Search placeholder uses `--soft` (#8C867B, 3.61:1 on `--surface`) at 16px, but §8 forbids `--soft` as text below 19px.
_Fix:_ Set `.usearch-input::placeholder { color: var(--muted); }` (`--muted` #5C574F = 7.16:1 on surface, AA small). `--soft` is large/decorative only.
_Evidence:_ line 372 `font-size: var(--text-base)` (16px); line 377 `color: var(--soft)`; computed `--soft` on `--surface` = 3.61:1 (DESIGN_SYSTEM §8: "--soft never below 19px").

**[P2] src/components/GradeStamp.astro:62** — Card-stamp chip background is a raw literal `rgba(255,255,255,0.62)` instead of a token.
_Fix:_ Express the translucent chip via a token, e.g. `color-mix(in srgb, var(--surface) 62%, transparent)` to match the tokenized hero variant (line 75) and stay tokens-only per §10.
_Evidence:_ line 62 `background: rgba(255, 255, 255, 0.62);` — a raw color value; the hero variant already uses `color-mix(... var(--paper) ...)` on line 75.

**[P2] src/components/GradeStamp.astro:51** — Stamp forces `text-transform: uppercase` on the tier word, conflicting with the retired ALL-CAPS label treatment (Casing rule: micro-labels render Sentence case, keeping only letterspacing).
_Fix:_ Drop `text-transform: uppercase`; keep only `var(--tracking-label)`. §11.2 anatomy is [HUMAN-GATE], so confirm with the owner whether the assessor's-mark casing is a sanctioned exception before changing.
_Evidence:_ line 51 `text-transform: uppercase;` vs DESIGN_SYSTEM Casing: "former ALL-CAPS label/eyebrow treatment is dropped: micro-labels... render in Sentence case, keeping only their letterspacing."

**[P3] src/components/RemedyIcon.astro:52** — Orphan `.is-pill` (26px) style block has no matching size in the Props union (chip|inline|card|spot|lead|fill), so it is dead code.
_Fix:_ Either add `'pill'` to the size Props union if intended, or remove the `.is-pill` rule (lines 52-55) to keep the size set in sync with the type.
_Evidence:_ Props size type (lines 9-10) lists `'chip'|'inline'|'card'|'spot'|'lead'|'fill'`; `.is-pill` defined at lines 52-55 is unreachable.

## Static gates

| Gate | Result |
| --- | --- |
| tokens | PASS — no retired tokens or hardcoded colors; 32 non-blocking raw-px spacing warnings. |
| crawlability | PASS — 31 remedy pages + key routes carry content in static HTML. |
| forbidden-framing | PASS — 62 shipped files clean; self-test caught the seeded bad string. |

## Rendered-visual pass

No chrome/layout change detected — rendered-visual pass optional.

Uncovered files (pages-map gaps to track):
- `src/components/GradeStamp.astro` — shared stamp component (used by RemedyCard + remedy-page hero) but has no entry in `qa/pages-map.json.shared`; this diff's edit is comment-only (removes a stale HeroCarousel note), so no rendered change, but the map gap remains.
- `src/components/RemedyIcon.astro` — shared icon component (used by RemedyCard) with no entry in `qa/pages-map.json.shared`; this diff's edit is comment-only (removes a HeroCarousel reference), no rendered change, but the map gap remains.
- `src/components/HeroCarousel.astro` — shared component being DELETED with no `qa/pages-map.json.shared` entry; only remaining references are comments in index.astro and og.png.ts, so nothing renders it.

## PR comment

```
Design-QA: BLOCK — 1 P1 open (fix before merge).

P1 index.astro:377 — search placeholder uses --soft (3.61:1) at 16px; §8 bars --soft below 19px. Fix: use var(--muted) (7.16:1, AA).
P2 GradeStamp.astro:62 — raw rgba(255,255,255,0.62) chip bg; tokenize via color-mix like the hero variant (line 75).
P2 GradeStamp.astro:51 — text-transform: uppercase conflicts with retired ALL-CAPS rule; §11.2 is [HUMAN-GATE], confirm casing exception with owner.
P3 RemedyIcon.astro:52 — dead .is-pill style, no matching size in Props union; add 'pill' or delete.

Static gates: tokens PASS · crawlability PASS · forbidden-framing PASS.
Rendered-visual: no chrome/layout change — pass optional. pages-map gaps: GradeStamp, RemedyIcon, HeroCarousel (deleted) have no shared entry (edits comment-only, no rendered change).
```
