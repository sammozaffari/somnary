# Somnary — Design System (Developer Handoff)

**v3.0 · warm/oxblood · Instrument Sans · build spec.** This version re-skins the
v2 evidence-teal system: the cool teal palette becomes a warm paper ground with an
**oxblood** brand/action color, and both display and body type become **Instrument
Sans** (all-sans, no serifs). Token **NAMES are unchanged from v2** — only their
VALUES changed, so every component inherits the new look automatically. v2
(evidence-teal) and v1.2 (soft-light lavender/sage) survive only in git history.

Every value below is **fixed**. Build against named tokens; never hardcode raw
values; never re-derive or "improve" a value. Missing tokens are listed in §9
as flagged gaps — if you need one, stop and open a `[HUMAN-GATE]` question,
per CLAUDE.md.

**Palette roles (v3):** **oxblood `--primary` `#7E1F2B` is brand AND action** — the
v2 citron `--action` is retired and `--action` now resolves to oxblood. The
**safety register stays DISTINCT**: vermilion `--vermilion` `#E34234` (red-orange)
is the only warning/danger color — safety is NEVER oxblood. Grades are retuned for
the warm ground (see §3).

**Typography (v3):** **Instrument Sans** for display AND body, self-hosted via
`@fontsource-variable/instrument-sans` (no Google Fonts CDN). IBM Plex Mono
(`@fontsource/ibm-plex-mono`, self-hosted) is retained for `--font-mono` only
(data/citations). Instrument Sans caps at weight **700**; former Archivo 800/900
display weights render at 700 — that is intentional and fine.

**Brand casing (D3, unchanged):** wordmark is `Somnary.` — **capitalized**,
trailing period, the period dot in oxblood `--primary`. Do not lowercase. Brand
styling (27px, weight 700 in Instrument Sans, −0.04em, circular oxblood mark).

---

## 1. Tokens — CSS `:root`

Warm/oxblood v3 values, with roles annotated. Names match `src/styles/global.css`
and `tailwind.config.mjs` exactly.

```css
:root {
  /* ---- surfaces (warm off-whites) ---- */
  --paper:   #FCFAF2;   /* page background (base) */
  --surface: #FFFFFF;   /* cards, tables, panels */
  --stone:   #EEE8DA;   /* sunken fills, progress tracks */
  --mineral: #DBD5CD;   /* strong lines, inactive borders */

  /* ---- text ---- */
  --ink:    #171512;    /* primary text — 17.4:1 on paper */
  --raisin: #2B2028;    /* secondary emphasis text — 15.7:1 on surface */
  --muted:  #5C574F;    /* supporting text — 6.9:1 on paper (AA small) */
  --soft:   #8C867B;    /* 3.6:1 — LARGE/decorative text only, never body */

  /* ---- primary (oxblood) — brand + action ---- */
  --primary:      #7E1F2B;   /* brand, links, accents; AA as text on white (9.9:1) */
  --primary-deep: #661722;   /* hover, dark strips, gradient end */
  --primary-soft: #F6E7E3;   /* tint fills */

  /* ---- action (oxblood) — primary CTA (citron retired) ---- */
  --action:     #7E1F2B;    /* CTA fill = --primary */
  --action-ink: #FFFFFF;    /* the only text color allowed on --action */

  /* ---- positive / secondary accent (green) ---- */
  --eucalyptus: #3F6A57;    /* progress fills, update kickers; AA text on white (6.2:1) */
  --pistachio:  #E9F2DB;    /* verified-chip fill (text: #184437, 9.5:1) */

  /* ---- safety (vermilion) — warnings ONLY, DISTINCT from oxblood ---- */
  --vermilion:  #E34234;    /* icons, borders; see §8 before using as text */
  --warning-bg: #FDECE7;    /* urgent-card / warn-chip fill */
  --safety-ink: #A02C22;    /* small safety text on --warning-bg — 6.37:1 (G3) */

  /* ---- grades (fills; letter always white, see §3; retuned for warm ground) ---- */
  --grade-s: #274B3F;       /* deep pine — apex of the green end, above A (G1) */
  --grade-a: #3F6A57;
  --grade-b: #47695A;
  --grade-c: #8F5E12;
  --grade-d: #9A4F28;
  --grade-f: #96323E;

  /* ---- chrome (warm-neutral shadow tint) ---- */
  --shadow:      0 18px 60px rgba(23, 21, 18, 0.10);
  --hairline:    1px solid rgba(23, 21, 18, 0.13);
  --focus-ring:  0 0 0 3px rgba(126, 31, 43, 0.40);  /* :focus-visible, all interactives — oxblood (G4) */
  --radius:      7px;
  --page:        min(1460px, calc(100vw - 32px));
}
```

Page background is not flat paper — it carries the ambient warm wash:

```css
background:
  radial-gradient(circle at 12% 0%, rgba(126, 31, 43, 0.06), transparent 28%),
  linear-gradient(180deg, #FEFDF9 0%, var(--paper) 45%, #F4EFE2 100%);
```

Hero/page-hero gradient (bold oxblood surface):

```css
background: linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 100%);
box-shadow: 0 24px 70px rgba(23, 21, 18, 0.16);
border-radius: 24px;
```

## 2. Typography

| Role | Family | Notes |
|---|---|---|
| Display / headings / buttons / brand | **Instrument Sans** (400–700) | weight 600–700, tight tracking |
| Body / UI | **Instrument Sans** (400–700) | base 16px / 1.45 |
| Data / citations | **IBM Plex Mono** (400–500) | `--font-mono` only |

All display + body type is Instrument Sans (all-sans — no serif anywhere), self-hosted
via `@fontsource-variable/instrument-sans`. **Instrument Sans caps at weight 700**; any
spec below asking for 800/900 renders at 700 (intentional). Use these sizes; don't invent.

> **Font-stack note:** the variable package registers its `@font-face` family as
> `"Instrument Sans Variable"`, so `--font-display` / `--font-body` list that name
> **first**, then `"Instrument Sans"` (static-family fallback, also the OG generator's
> family), then system fallbacks. Never reference the family with a hardcoded string in
> a component — always `var(--font-display)` / `var(--font-body)`.

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| display | `clamp(64px, 8vw, 128px)` / 0.92 | 700 | −0.067em | hero h1, page-title (52px at ≤640px) |
| h2 | `clamp(38px, 4.3vw, 66px)` / 1.0 | 700 | −0.065em | section headings |
| h3 | 19–21px | 600–700 | −0.025em | panel/module headings |
| stat | 42px (34px in hero metrics) | 700 | −0.06em | evidence-card / hero-metric numerals |
| lede | `clamp(18px, 1.6vw, 23px)` / 1.34 | 400–500 | — | hero/page subheads, `--muted` (white 0.78–0.82 alpha on oxblood) |
| body | 16px / 1.45 | 400 | — | default |
| support | 13–14px | 400–600 | — | card body, nav links, footer |
| micro | 11–12px | 600–700 | +0.09–0.11em, UPPERCASE | eyebrow/kicker/meta-label (`--primary`), table headers |

## 3. Grade system (S–F)

The scale is **S A B C D F** — there is no E. Grades are set only via
`[HUMAN-GATE]` (CLAUDE.md); this section governs rendering only.

- **Badge** (`.grade`): filled square, 40×40px min, radius 6px, letter 23px
  Instrument Sans 700, **white letter on the grade color** for A–F, hairline
  `rgba(255,255,255,.22)` border.
- **Big badge** (`.grade.big`, remedy lead block): 152×152px, letter 112px,
  gradient fill `linear-gradient(145deg, var(--grade-X), var(--grade-X-anchor))`
  (**S anchors to `#1B3A30`**, A to `#2E5343`, B to `#35564A`), "GRADE"
  micro-label above, verdict micro-label (e.g. "EXCEPTIONAL" for S, "GOOD
  EVIDENCE" for A) below.
- **S vs A:** both live at the green end by design — S is the deeper pine, A
  the mid green. They are adjacent because they are both "good"; the
  letter (always shown) is what disambiguates them, never color alone. S is
  reserved for guideline-level evidence (e.g. CBT-I) and is deliberately rare.
- **Never color alone:** every badge is accompanied by the letter itself plus
  a text verdict/decision-translation (per strategy doc 03: S "make this the
  default pathway…" through F "risk… is the headline"). Screen-reader label:
  "Grade B — good evidence".
- **Contrast constraint:** the amber/burnt grades C/D were darkened so grade-colored
  *small* text clears AA on their tints — grade-C `#8F5E12` as text on `--grade-c-tint`
  = **4.81:1**, grade-D `#9A4F28` on `--grade-d-tint` = **4.96:1** (both AA small).
  White letter on every grade fill is ≥5:1 except none below AA-large. **Do not** set
  small white text on a grade fill; for small grade-colored text use the grade color on
  `--surface` or on its tint (now valid for all six).
- **S-tier** = `--grade-s` `#274B3F` (retuned for the warm ground), white letter at
  9.70:1 (AAA). Big-badge anchor `#1B3A30`.

## 4. Layout & chrome

- Page width `--page` = `min(1460px, 100vw − 32px)`; single centered `.shell`.
  At ≤640px: `min(100vw − 22px, 560px)`.
- Radii: **7px** (`--radius`) cards/tables/buttons · 10–11px check-panel &
  trust-stack · **24px** heroes (18px ≤980px) · 999px pills/chips · 50% marks.
- Borders: `--hairline` everywhere; rows divide with it, never double-borders.
- Shadows: `--shadow` for floating panels; hero `0 24px 70px rgba(23,21,18,.16)`;
  card hover `0 16px 40px rgba(23,21,18,0.08)`; big grade
  `0 22px 50px rgba(23,21,18,0.23)`. All shadow tints are warm-neutral now.
- Sticky topbar: `rgba(252,250,242,0.9)` (warm paper) + `backdrop-filter: blur(16px)`,
  hairline bottom, 70px min-height (62px ≤980px).

## 5. Components (prototype inventory)

Buttons (Instrument Sans 700, 13px, min-height 42px, radius 7px):
- **primary** — oxblood fill, white text; hover `--primary-deep` + lift −1px.
- **action** — oxblood fill (`--action`) + `--action-ink` (white); **primary CTA
  only** (the accent budget: one per viewport); hover `--primary-deep`.
- **secondary** — transparent, `rgba(23,21,18,0.18)` border, ink text; on
  oxblood heroes: `rgba(255,255,255,0.12)` fill, white text.
- **ghost** — `--surface` fill, faint border, `--raisin` text.

Chips/pills (999px, 30px min-height, 12px/650): neutral (white 0.84 alpha),
**verified** (`--pistachio` fill, `#184437` text), **warn** (`--warning-bg`
fill, `--safety-ink` text), hero variants (white 0.14 alpha; verified on hero
= white 0.16 alpha fill + white text).

Cards on `rgba(255,255,255,0.9)`, hairline, radius 7: **route-card** (28px oxblood
icon, 18–20px title, hover lift −2px), **evidence-card** (42px oxblood
stat), **update-card** (eucalyptus kicker), **safety-card** (vermilion icon;
`.urgent` = `--warning-bg` fill + vermilion-alpha border), **option-card**
(rank circle 34px + content + grade), **side-panel / module** (22px padding,
19px h3).

Structured surfaces: **data-table** (`--surface`, uppercase 11px headers on
`rgba(238,232,218,0.62)`, 15px cell padding), **tier-legend** (6-up strip,
24px oxblood/green grade letters), **check-panel** (white 0.96, search input 48px +
popular pills), **trust-stack** (on hero: `rgba(23,21,18,0.28)` fill, white 0.22
border, white icons), **hero-metrics** (white 0.10 tiles, white 34px
numerals), **support-strip** (`--primary-deep`, white text),
**label-input** (dashed `rgba(23,21,18,0.28)` border, `rgba(255,253,248,0.66)`
fill), **flag rows** (vermilion icon + hairline dividers), **progress**
(7px track `--stone`, fill `--eucalyptus`).

## 6. Motion

One speed: **160ms ease** on `transform`, `background`, `border-color`,
`box-shadow`. Hover lifts: buttons −1px, cards −2px. No entrance animations,
parallax, or ambient motion — the prototype defines none; don't add any.

**Focus:** every interactive element gets `:focus-visible { box-shadow:
var(--focus-ring); outline: none; }` (3px `--primary` at 40% alpha). This is
the one addition to the prototype's motion/state set — it defined no focus
styling and shipping without it fails accessibility.

## 7. Breakpoints

- **≤980px** — nav links hidden; hero/split/label-checker collapse to 1 col;
  6/4-up grids → 2-up; hero radius 18px.
- **≤640px** — everything 1 col; display type 52px; search button full-width;
  cell right-borders become bottom-borders.

## 8. Contrast (computed 2026-07-08 for warm/oxblood v3, WCAG 2.1)

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on paper / surface | 17.44 / 18.22 | AAA |
| `--raisin` on surface | 15.67 | AAA |
| `--muted` on paper / surface | 6.86 / 7.16 | AA small text |
| `--soft` on surface | 3.61 | **large text only** |
| `--primary` as text on surface / paper | 9.92 / 9.49 | AAA (small) |
| white on `--primary` / `--primary-deep` | 9.92 / 12.28 | AAA |
| `--action-ink` (white) on `--action` | 9.92 | AAA |
| white letter on grade S | 9.70 | AAA |
| white on grade A / B / F | 6.16 / 6.11 / 7.44 | AA |
| white on grade C / D (darkened) | 5.56 / 5.96 | AA |
| grade-C / grade-D text on their tint | 4.81 / 4.96 | AA small (§3) |
| `--vermilion` on surface | 4.12 | **large text/icons only** |
| `--safety-ink` on `--warning-bg` | 6.37 | AA small text |
| `--eucalyptus` on surface | 6.16 | AA small text |
| `#184437` on `--pistachio` | 9.47 | AAA |

Rules: body text is `--ink`/`--raisin`/`--muted` only. `--soft` never below
19px. Vermilion is for icons, borders, and ≥19px-bold text; small safety text
is `--safety-ink` on `--warning-bg` with vermilion iconography. Oxblood
`--primary` now passes AAA as small text on white/paper (up from AA in v2) — a
net accessibility gain from the darker brand color.

## 9. Gaps

**Resolved (owner-ratified):**
- **G1 · S-tier grade color → `--grade-s` `#274B3F`** (deep pine, retuned for
  the warm ground; big-badge anchor `#1B3A30`). Apex of the green end, deeper
  than A; letter disambiguates the two.
- **G3 · Warn-chip text → `--safety-ink` `#A02C22`** (6.37:1 on
  `--warning-bg`), a darkened vermilion in the safety family — DISTINCT from the
  oxblood brand.
- **G4 · Focus states → `--focus-ring`** (3px `--primary` oxblood @ 40% alpha) on
  `:focus-visible` for all interactives.

**Still open:**
- **G2 · Un-designed page types.** Prototype covers one instance each of:
  home, tier board, remedy detail, outcome, safety router, label checker. No
  design exists for: article/evidence-watch, methodology/legal text pages,
  compare tool, assistant UI, community pages, newsletter/forms beyond the
  label-input pattern. Generalize from §5 primitives; if a new primitive or
  token is needed, `[HUMAN-GATE]`. (Not a blocker for CHK-0.2 — it reskins
  existing page types, all of which have a prototype reference.)

## 10. Guardrails

- Tokens only; the token linter (CHK-0.2) fails builds on raw hex/spacing.
- Oxblood `--action` (= `--primary`) appears **once per viewport** as the primary
  CTA — the scarcity is what makes it read as "the" action. Oxblood is
  brand/action ONLY; it never signals safety.
- Vermilion means safety, and safety is vermilion — a DISTINCT red-orange, never
  oxblood. Never decorative, never for emphasis.
- Grade colors never imply safety; safety modules carry that job (rulebook,
  design framework: no "UI patterns that make weak evidence feel strong").
- No wellness clichés: no dream/moon/sparkle imagery, no gradients beyond the
  two specified washes, no supplement-store aesthetics (strategy doc 03).
