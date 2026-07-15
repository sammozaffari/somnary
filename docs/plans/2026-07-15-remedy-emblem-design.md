# Remedy emblem — fusing the linocut icon and the grade (v2, owner-ratified 2026-07-15)

> **v3 addendum (owner, same day):** the 56px card emblem is RETIRED — at that size the
> linocuts are illegible ("you cannot tell what's even in those icons"). Tier-board cards
> became the **plate card**: a full-bleed `--primary-soft` specimen plate with the art at
> 132px as the hero, the grade **stamped** on the plate's corner (letter + tier word from
> `lib/tiers`, grade color, −3° hand-pressed angle), then name + one clamped verdict line
> (key-compound line dropped from cards). Hover: lift + art `scale(1.02)` ("ever so
> slightly" per owner), off under reduced motion. The fused emblem below stands for `spot`
> (80px, home spotlight) and `lead` (148px, remedy page) only; `RemedyEmblem` no longer
> offers a `card` size. See DESIGN_SYSTEM §11.2. Sections below describing a card-size
> emblem are superseded.

## Problem

The remedy linocut and the tier grade were built in separate PRs (#51, #52) and
never designed as one thing. Everywhere they co-occur they are two adjacent
chips of different geometry, color, and logic:

- **HeroAnswerCard** (home spotlight): soft-oxblood icon tile · grade rectangle · name — three shapes side by side.
- **RemedyCard** (tier board): bare icon · grade rectangle · name.
- **RemedyLeadBlock** (remedy page): icon, then "GRADE" micro-label, then the big
  badge, stacked vertically — two separate monuments in one column.

The eye counts objects; the grade reads as an afterthought pinned next to an
illustration.

## Decision (owner, 2026-07-15, via interactive design study)

Fuse them into **one emblem**: a struck-coin medallion. Ratified binding is
**carve + orbit** (chosen over: side-by-side lockup, grade-tinted disc, split
coin, coin-with-white-halo v1, orbit-only, carve-only, unboxed).

Preview artifact: https://claude.ai/code/artifact/0543a087-33c6-48e6-86cc-32cbccfed484
(label `emblem-v2-interlocked`).

## Anatomy

One new component, `RemedyEmblem.astro`. Layers, back to front:

1. **Core** — a circle filled `--primary-soft` with a hairline inner ring
   (inset 1px, oxblood at low alpha). Inside it the remedy linocut
   (existing `RemedyIcon` rendering: token-masked PNG, inked `--primary`) at
   **72% of the disc** (v1's 58% drowned the art).
2. **Carve** — a concave bite is mask-cut from the core where the seal sits
   (radial mask, bite radius = seal radius + 5% of disc, centred at 82%/82%).
   The page shows through the crescent gap: the seal *nests into* the disc
   instead of floating on a white halo.
3. **Evidence orbit** — a thin ring in the grade color
   (`max(1.5px, 1.8% of disc)`, inset −7.5%) circling the disc and threading
   *under* the seal. The grade color embraces the remedy; brand echo of the
   crescent-moon mark (a small moon with its evidence in orbit).
4. **Grade seal** — a circle at 42% of disc (52% at card size), centred
   82%/82%, filled with the grade color, white Instrument Sans letter.
   Flat fill at small sizes; the ratified grade gradient
   (`145deg, --grade-x → --grade-x-anchor`) + weight 900 at lead size.

Meaning: disc = identity (brand-oxblood, every remedy), orbit + seal = verdict
(grade color). Bound, not blended — grade color never contaminates the brand
ink, and vermilion stays exclusively the safety register.

## Sizes

| size | disc | seal | letter | notes |
|------|------|------|--------|-------|
| card | 56px | 52% (29px) | ≥19px bold | tier-board cards (was icon 48 + badge 44) |
| spot | 80px | 42% | proportional | home spotlight (was 64) |
| lead | 148px | 42% | proportional, weight 900, gradient | remedy lead block (was 120 + 152 badge) |

**Legibility constraint (binding, from TierBadge §3 rationale):** the seal
letter must stay in the WCAG "large text" band (≥18.66px bold ≈ 19px) at every
size, because white on `--grade-c` (3.75:1) only clears AA-large. At card size
this means the letter takes ~65% of the seal. If a future placement needs a
disc smaller than 56px, it must NOT carry the seal — use plain `RemedyIcon`
plus a text grade instead.

## Placements

- **RemedyCard**: emblem (card) + name. Icon tile and separate TierBadge removed.
- **HeroAnswerCard**: emblem (spot) + name in the header. Soft-oxblood tile
  removed (the emblem's disc replaces it). Crossfade behavior untouched.
- **RemedyLeadBlock**: emblem (lead) replaces the icon + "GRADE" + big-badge
  stack. The tier word (e.g. "Moderate evidence") stays as the text line under
  the emblem — the never-color-alone text pairing.

**TierBadge survives** for standalone grade contexts with no illustration
(claims table, metadata card, search palette, inline mentions). No duplication:
`RemedyEmblem` composes `RemedyIcon` internally and reuses the grade tokens.

## Accessibility & guardrails

- Emblem root: `role="img"`, `aria-label="{name} — grade {tier}"`; letter and
  art layers `aria-hidden`.
- Grade never color alone: the letter is in the seal, and every placement keeps
  an adjacent text grade/tier word.
- Unknown slug: existing crescent-disc fallback renders inside the core;
  seal/orbit unaffected — a missing asset never breaks the emblem.
- Pure markup + CSS (masks), no JS: crawlability and no-JS behavior unchanged.
- No new colors; all fills are existing tokens. New *geometry* constants
  (72%, 82%, 42%, −7.5%) are component-internal proportions, documented in
  DESIGN_SYSTEM §11 as part of this change.
- Grades themselves remain `[HUMAN-GATE]`; this is presentation only.

## Implementation notes

- Carve via `mask: radial-gradient(circle <r> at 82% 82%, transparent 98%, #000 100%)`
  on the core wrapper (`-webkit-mask` prefix included, matching RemedyIcon).
- Orbit extends ~7.5% beyond the disc box — placements need `overflow` visible
  (default for abs-positioned children) and a touch of breathing room in tight
  flex rows.
- Seal position/bite radius derive from `--disc` with literal factors only
  (no var×var multiplication in calc).
- Update `docs/DESIGN_SYSTEM.md` §11 (remedy icon system) with the emblem
  anatomy and the ≥19px-bold seal-letter rule.

## Acceptance criteria

1. `RemedyEmblem.astro` exists with `size: 'card' | 'spot' | 'lead'`, composing
   `RemedyIcon`, with carve + orbit + seal per anatomy above.
2. RemedyCard, HeroAnswerCard, RemedyLeadBlock use it; no adjacent
   icon-tile + TierBadge pairs remain anywhere.
3. TierBadge unchanged and still used in non-illustrated contexts.
4. Seal letter ≥19px bold at every shipped size (measured in output CSS).
5. Emblem has the combined aria-label; layers hidden from AT.
6. Token linter green; no hardcoded colors beyond documented geometry ratios.
7. DESIGN_SYSTEM §11 updated.
8. Spotlight crossfade still works; no-JS home page still renders one card.
