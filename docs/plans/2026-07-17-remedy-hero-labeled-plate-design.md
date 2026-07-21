# Remedy hero — the labeled plate (owner-ratified 2026-07-17, studies v4→v6)

## Problem

With the 31 hero plates generated (PR #57), the remedy page opener needed rethinking: the
lead-block emblem duplicated the hero's subject (the "two moons" problem — melatonin's page
would show a moon emblem over a moon plate), and the owner wanted each remedy page to open
inside its own atmosphere ("almost romantic; each supplement should have its own unique vibe").

## Study trail (artifact `emblem`, labels v4→v6)

- **v4 (framed mocks):** hero + title overlaid on the plate's "calm band", per-remedy
  `--hero-ink` (linen on dark plates, ink on light), grade stamped on the art. Owner: crumb
  unreadable; show it full-bleed.
- **v5 (full-bleed):** title at real scale on the art. **Failed** — owner: "the black and even
  the white can be hard to read." Root cause: the melt pushes the title up into busy art, and
  no single ink survives 31 different plates. Overlaying type on illustration is fragile
  per-plate.
- **v6 (labeled plate) — RATIFIED:** no type on the art, ever. The plate melts into the page;
  the title + grade stamp print on the paper below, tucked into the melt. Museum-print logic:
  the plate is labeled, not painted over. This also DELETED the per-remedy `--hero-ink` token
  — nothing to tune, nothing to gate.

## Decisions

1. **RemedyHero.astro** — full-bleed plate (62vh / 44vh mobile), alpha-mask melt over the
   bottom 34% (mask, not painted fade — the body background is a layered gradient and a
   painted fade would seam), label row (`h1` + `GradeStamp` size `hero`) tucked −7vh into the
   melt. LCP: eager, high fetchpriority, responsive widths. `alt=""` (decorative; the h1
   names it). Missing plate → label row alone.
2. **GradeStamp.astro extracted** — one assessor's stamp shared by the plate card (§11.2) and
   the hero label row; `hero` size uses a near-opaque paper chip so grade ink holds ≥5:1 over
   any plate. `silent` prop for card links that already announce the grade; otherwise an
   sr-only "Grade" prefix → "Grade A, Strong".
3. **RemedyEmblem retired** (component deleted). Superseded on every surface: tier board →
   plate card (#55), home spotlight → hero carousel (#56), remedy lead → hero plates (this).
   §11.1 rewritten as a historical note carrying forward its surviving rules.
4. **Lead block simplified** — badge column gone; the decision-translation line anchors the
   grade in plain text: "**Grade A · Strong** — reasonable to discuss…". Grade appears as
   letter+word twice per page (stamp + text): never-color-alone holds twice over.
5. **Crumb retired on remedy pages** (owner) — navigation stays in the nav, nothing is carved
   into the art.
6. **One-line verdict promoted** to the plate's caption (--text-lg, ink) directly under the
   label row.

## Acceptance criteria (all verified in build output)

1. All 31 remedy pages render the hero plate + label row server-side; responsive srcset
   (828–2880w); eager + high fetchpriority on the hero image.
2. No type overlays the art; title is `--ink` on paper on every page.
3. Grade renders letter + tier word in the stamp AND in the lead translation line; stamp words
   verbatim from `lib/tiers`.
4. RemedyEmblem: zero references; component deleted; §11.1 rewritten.
5. Tier-board stamps unchanged visually (now via shared GradeStamp).
6. Token linter, framing lint (30 components), citation format, build: green.
7. DESIGN_SYSTEM §11.3 added; §11.1/§11.2 amended; session log appended.
