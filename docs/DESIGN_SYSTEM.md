# Somnary — Design System (Developer Handoff)

**v2.0 · evidence-teal · build spec.** Source of truth: the v3 HTML prototype
(`/docs/html-prototype/styles.css`), whose bold-primary teal direction was
user-accepted and applied across all six prototype pages (see
`/docs/html-prototype/design-review.md`). This version supersedes v1.2
(soft-light lavender/sage) in full; v1.2 survives only in git history.

Every value below is **fixed**. Build against named tokens; never hardcode raw
values; never re-derive or "improve" a value. Missing tokens are listed in §9
as flagged gaps — if you need one, stop and open a `[HUMAN-GATE]` question,
per CLAUDE.md.

**Migration status (2026-07-06):** the live Astro site still renders the v1.2
soft-light system. Migrating `tailwind.config.mjs`, `src/styles`, and all
components to these tokens is its own checklist item (CHK-0.2 as reskin). Do
not mix systems within a page.

**Brand casing (D3):** wordmark is `Somnary.` — capitalized, trailing period.
The prototype HTML predates D3 and renders a lowercase brand; follow D3, not
the prototype, for the wordmark string. Prototype brand styling (27px, weight
800, −0.04em, circular teal mark) still applies.

---

## 1. Tokens — CSS `:root`

Verbatim from the prototype, with roles annotated.

```css
:root {
  /* ---- surfaces (cool off-whites) ---- */
  --paper:   #f5f7f3;   /* page background (base) */
  --surface: #ffffff;   /* cards, tables, panels */
  --stone:   #e5ece8;   /* sunken fills, progress tracks */
  --mineral: #cbd9d3;   /* strong lines, inactive borders */

  /* ---- text ---- */
  --ink:    #091a18;    /* primary text — 16.6:1 on paper */
  --raisin: #12302e;    /* secondary emphasis text — 14.1:1 on surface */
  --muted:  #53635f;    /* supporting text — 5.9:1 on paper (AA small) */
  --soft:   #7a8a86;    /* 3.6:1 — LARGE/decorative text only, never body */

  /* ---- primary (evidence teal) ---- */
  --primary:      #006b70;   /* brand, links, accents; AA as text on white (6.3:1) */
  --primary-deep: #004c50;   /* hover, dark strips, gradient end */
  --primary-soft: #dff2ee;   /* tint fills */

  /* ---- action (citron) — hero primary CTA ONLY ---- */
  --action:     #b8ff5c;    /* fills + accent text on teal heroes */
  --action-ink: #12220d;    /* the only text color allowed on --action */

  /* ---- positive / secondary accent ---- */
  --eucalyptus: #007f70;    /* progress fills, update kickers; AA text on white */
  --pistachio:  #e8f7d8;    /* verified-chip fill (text: #184437) */

  /* ---- safety (vermilion) — warnings ONLY, never decorative ---- */
  --vermilion:  #e34234;    /* icons, borders; see §8 before using as text */
  --warning-bg: #fff0ed;    /* urgent-card / warn-chip fill */
  --safety-ink: #a02c22;    /* small safety text on --warning-bg — 6.58:1 (G3) */

  /* ---- grades (fills; letter always white, see §3) ---- */
  --grade-s: #0d4f44;       /* deep pine — apex of the green end, above A (G1) */
  --grade-a: #0a6f5c;
  --grade-b: #006b70;
  --grade-c: #b87900;
  --grade-d: #b14a2b;
  --grade-f: #b82432;

  /* ---- chrome ---- */
  --shadow:      0 18px 60px rgba(0, 76, 80, 0.11);
  --hairline:    1px solid rgba(9, 26, 24, 0.13);
  --focus-ring:  0 0 0 3px rgba(0, 107, 112, 0.40);  /* :focus-visible, all interactives (G4) */
  --radius:      7px;
  --page:        min(1460px, calc(100vw - 32px));
}
```

Page background is not flat paper — it carries the ambient wash:

```css
background:
  radial-gradient(circle at 12% 0%, rgba(0, 107, 112, 0.10), transparent 28%),
  linear-gradient(180deg, #fbfdfb 0%, var(--paper) 45%, #eef4ef 100%);
```

Hero/page-hero gradient (the accepted bold-primary surface):

```css
background:
  radial-gradient(circle at 86% 18%, rgba(184, 255, 92, 0.20), transparent 27%),
  linear-gradient(135deg, var(--primary) 0%, var(--primary-deep) 100%);
box-shadow: 0 28px 90px rgba(0, 76, 80, 0.24);
border-radius: 24px;
```

## 2. Typography

| Role | Family | Notes |
|---|---|---|
| Display / headings / buttons / brand | **Archivo** (400–900) | weight 800–900, tight tracking |
| Body / UI | **IBM Plex Sans** (400–700) | base 16px / 1.45 |

Scale (from the prototype; use these, don't invent sizes):

| Token | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| display | `clamp(64px, 8vw, 128px)` / 0.92 | 900 | −0.067em | hero h1, page-title (52px at ≤640px) |
| h2 | `clamp(38px, 4.3vw, 66px)` / 1.0 | 900 | −0.065em | section headings |
| h3 | 19px | 800 | −0.025em | panel/module headings |
| stat | 42px (34px in hero metrics) | 800–900 | −0.06em | evidence-card / hero-metric numerals |
| lede | `clamp(18px, 1.6vw, 23px)` / 1.34 | 400–500 | — | hero/page subheads, `--muted` (white 0.78–0.82 alpha on teal) |
| body | 16px / 1.45 | 400 | — | default |
| support | 13–14px | 400–650 | — | card body, nav links, footer |
| micro | 11–12px | 600–800 | +0.09–0.11em, UPPERCASE | eyebrow/kicker/meta-label (`--primary`; `--action` on hero), table headers |

## 3. Grade system (S–F)

The scale is **S A B C D F** — there is no E. Grades are set only via
`[HUMAN-GATE]` (CLAUDE.md); this section governs rendering only.

- **Badge** (`.grade`): filled square, 40×40px min, radius 6px, letter 23px
  Archivo 800, **white letter on the grade color** for A–F, hairline
  `rgba(255,255,255,.22)` border.
- **Big badge** (`.grade.big`, remedy lead block): 152×152px, letter 112px,
  gradient fill `linear-gradient(145deg, var(--grade-X), <darker anchor>)`
  (**S anchors to `#08382f`**, A to `#064d43`, B to `--primary-deep`), "GRADE"
  micro-label above, verdict micro-label (e.g. "EXCEPTIONAL" for S, "GOOD
  EVIDENCE" for A) below.
- **S vs A:** both live at the green end by design — S is the deeper pine, A
  the brighter green. They are adjacent because they are both "good"; the
  letter (always shown) is what disambiguates them, never color alone. S is
  reserved for guideline-level evidence (e.g. CBT-I) and is deliberately rare.
- **Never color alone:** every badge is accompanied by the letter itself plus
  a text verdict/decision-translation (per strategy doc 03: S "make this the
  default pathway…" through F "risk… is the headline"). Screen-reader label:
  "Grade B — good evidence".
- **Contrast constraint:** white on `--grade-c` is **3.64:1** — passes WCAG
  AA only as large text (≥18.66px bold). Grade letters (23px/112px, 800)
  qualify. **Do not** set small white text on grade colors; for small text use
  the grade color as text on `--surface` (grade-c at 4.6:1 passes) or on its
  tint.
- **S-tier** = `--grade-s` `#0d4f44` (ratified 2026-07-06), white letter at
  9.46:1 (AAA). Big-badge anchor `#08382f`.

## 4. Layout & chrome

- Page width `--page` = `min(1460px, 100vw − 32px)`; single centered `.shell`.
  At ≤640px: `min(100vw − 22px, 560px)`.
- Radii: **7px** (`--radius`) cards/tables/buttons · 10–11px check-panel &
  trust-stack · **24px** heroes (18px ≤980px) · 999px pills/chips · 50% marks.
- Borders: `--hairline` everywhere; rows divide with it, never double-borders.
- Shadows: `--shadow` for floating panels; hero `0 28px 90px rgba(0,76,80,.24)`;
  card hover `0 16px 40px rgba(43,32,40,0.08)`; big grade
  `0 22px 50px rgba(0,76,80,0.23)`.
- Sticky topbar: `rgba(245,247,243,0.9)` + `backdrop-filter: blur(16px)`,
  hairline bottom, 70px min-height (62px ≤980px).

## 5. Components (prototype inventory)

Buttons (Archivo 800, 13px, min-height 42px, radius 7px):
- **primary** — teal fill, white text; hover `--primary-deep` + lift −1px.
- **action** — citron fill + `--action-ink`; **hero primary CTA only** (the
  citron budget: one per viewport); hover `#cbff7b`.
- **secondary** — transparent, `rgba(23,21,18,0.18)` border, ink text; on
  teal heroes: `rgba(255,255,255,0.12)` fill, white text.
- **ghost** — `--surface` fill, faint border, `--raisin` text.

Chips/pills (999px, 30px min-height, 12px/650): neutral (white 0.84 alpha),
**verified** (`--pistachio` fill, `#184437` text), **warn** (`--warning-bg`
fill, `--safety-ink` text), hero variants (white 0.14 alpha; verified on hero
= citron fill + `--action-ink`).

Cards on `rgba(255,255,255,0.9)`, hairline, radius 7: **route-card** (28px teal
icon, 18–20px Archivo title, hover lift −2px), **evidence-card** (42px teal
stat), **update-card** (eucalyptus kicker), **safety-card** (vermilion icon;
`.urgent` = `--warning-bg` fill + vermilion-alpha border), **option-card**
(rank circle 34px + content + grade), **side-panel / module** (22px padding,
19px h3).

Structured surfaces: **data-table** (`--surface`, uppercase 11px headers on
`rgba(238,232,218,0.62)`, 15px cell padding), **tier-legend** (6-up strip,
24px teal letters), **check-panel** (white 0.96, search input 48px + popular
pills), **trust-stack** (on hero: `rgba(0,76,80,0.52)` fill, white 0.22
border, citron icons), **hero-metrics** (white 0.10 tiles, citron 34px
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

## 8. Contrast (computed 2026-07-06, WCAG 2.1)

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on paper / surface | 16.61 / 17.91 | AAA |
| `--raisin` on surface | 14.11 | AAA |
| `--muted` on paper / surface | 5.87 / 6.33 | AA small text |
| `--soft` on surface | 3.62 | **large text only** |
| `--primary` as text on surface / paper | 6.29 / 5.84 | AA small text |
| white on `--primary` / `--primary-deep` | 6.29 / 9.77 | AA / AAA |
| `--action-ink` on `--action` | 13.88 | AAA |
| `--action` on primary / primary-deep | 5.24 / 8.14 | AA |
| white letter on grade S | 9.46 | AAA |
| white on grade A / B / D / F | 6.10 / 6.29 / 5.41 / 6.29 | AA |
| white on grade C | **3.64** | large text only (§3) |
| `--vermilion` on surface | 4.12 | **large text/icons only** |
| `--safety-ink` on `--warning-bg` | 6.58 | AA small text |
| `--eucalyptus` on surface | 4.92 | AA small text |
| `#184437` on `--pistachio` | 9.75 | AAA |

Rules: body text is `--ink`/`--raisin`/`--muted` only. `--soft` never below
19px. Vermilion is for icons, borders, and ≥19px-bold text; small safety text
is `--safety-ink` on `--warning-bg` with vermilion iconography.

## 9. Gaps

**Resolved 2026-07-06 (owner-ratified):**
- **G1 · S-tier grade color → `--grade-s` `#0d4f44`** (deep pine; big-badge
  anchor `#08382f`). Apex of the green end, deeper than A; letter disambiguates
  the two. Retired v1.2 S (`#3D7A54`) not carried over.
- **G3 · Warn-chip text → `--safety-ink` `#a02c22`** (6.58:1 on
  `--warning-bg`), a darkened vermilion in the safety family.
- **G4 · Focus states → `--focus-ring`** (3px `--primary` @ 40% alpha) on
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
- Citron `--action` appears **once per viewport** (hero CTA) — it is the
  scarcity that makes it read as "the" action.
- Vermilion means safety. Never decorative, never for emphasis.
- Grade colors never imply safety; safety modules carry that job (rulebook,
  design framework: no "UI patterns that make weak evidence feel strong").
- No wellness clichés: no dream/moon/sparkle imagery, no gradients beyond the
  two specified washes, no supplement-store aesthetics (strategy doc 03).
