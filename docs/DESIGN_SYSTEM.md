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

**Typography (v3):** **Instrument Sans is the ONLY typeface site-wide** — display,
body, data, and citations — self-hosted via `@fontsource-variable/instrument-sans`
(no Google Fonts CDN). **IBM Plex Mono is retired (owner, 2026-07-09).** The
`--font-mono` alias is kept for compatibility but now resolves to Instrument Sans;
there is no separate mono face anywhere. Instrument Sans caps at weight **700**;
former Archivo 800/900 display weights render at 700 — that is intentional and fine.

**Casing (owner, 2026-07-09):** the house voice is **Sentence case** — first word
plus proper nouns capitalized. This applies to headings, labels, nav, and body
alike. The old all-lowercase house voice is retired, and Title Case is not used.
The former ALL-CAPS label/eyebrow treatment is **dropped**: micro-labels, kickers,
and table headers render in Sentence case, keeping only their letterspacing.
(Brand wordmark casing is unchanged — see below.)

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
| Body / UI | **Instrument Sans** (400–700) | base 16px / 1.6 (reading legibility), no tracking |
| Data / citations | **Instrument Sans** (400–500) | mono retired; `--font-mono` resolves to Instrument Sans |

All type — display, body, data, citations — is Instrument Sans (all-sans, no serif and
no mono anywhere), self-hosted via `@fontsource-variable/instrument-sans`. **Instrument
Sans caps at weight 700**; any
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
| body | 16px / 1.6 | 400 | — | default (reading text) |
| support | 13–14px | 400–600 | — | card body, nav links, footer |
| micro | 11–12px | 600–700 | +0.09–0.11em, Sentence case | eyebrow/kicker/meta-label (`--primary`), table headers |

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

Structured surfaces: **data-table** (`--surface`, Sentence-case 11px headers on
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

## 11. Illustration

Remedy illustrations use one coherent, hand-carved linocut system: bold silhouettes,
slightly irregular edges, sparse gouge marks, and enough negative space to remain clear
at 48px. Subjects fill 70–75% of a square field with even margins. Molecules use chunky
ball-and-stick construction, never thin skeletal diagrams. No text, labels, borders,
scenery, gradients, gray, shadows, or halftones.

- **Masters:** 1024×1024, exactly two tones (solid black ink on pure white), stored in
  `design/icon-masters/`. Black-on-white is the source of truth so the family can be
  re-inked without regeneration.
- **Production assets:** transparent 1024×1024 PNGs in `src/assets/remedies/`. The PNG
  supplies only the alpha **silhouette**; the ink color is not trusted from the file.
- **Use:** `RemedyIcon.astro` resolves assets by remedy slug and renders each as a CSS
  **mask painted with `currentColor`** (default `--primary`) — so the ink is a token at
  render time, re-inkable in one place and recolorable on dark strips by setting `color`,
  never a hardcoded value. Icons are decorative: rendered `aria-hidden` (no accessible name),
  with the adjacent remedy name always carrying the label. Cards use the 48px form; lead
  blocks the 120px.
- **Fallback:** an unknown slug receives the Somnary crescent disc, not a broken image.
- **Review gate:** assess the full family together at both 48px and 240px. Reject any
  candidate whose line weight, detail density, or carved texture drifts from the set,
  even if it succeeds as an individual illustration.
- **Product boundary:** containers stay unbranded and unlabeled. Illustrations must not
  imply that Somnary manufactures or sells a depicted remedy.

Any change to this illustration grammar or its production color is `[HUMAN-GATE]`.

### 11.1 Remedy emblem (icon + grade, fused)

Where a remedy is shown *with* its grade at spotlight scale and up — the home spotlight, the
remedy lead block — the linocut and the grade are one **struck-coin emblem**
(`RemedyEmblem.astro`), never two adjacent chips. Design study 2026-07-15, owner-ratified
"carve + orbit" (`docs/plans/2026-07-15-remedy-emblem-design.md`). Tier-board cards use the
**plate card** instead (§11.2) — the v3 study retired the 56px card emblem as below the scale
the linocuts were carved for. Anatomy, back → front:

- **Core** — a `--primary-soft` disc (hairline oxblood inner ring) holding the linocut
  (`RemedyIcon size="fill"`) at **72%** of the disc. A concave bite is mask-cut from the core
  where the seal sits (radial-gradient mask; bite radius = seal radius + 5% of the disc,
  centred at 82%/82%) so the seal nests *into* the disc, not onto a halo.
- **Evidence orbit** — a thin grade-colored ring (`max(1.5px, 1.8% of disc)`, inset −7.5%)
  circling the disc and threading *under* the seal. Brand echo of the crescent-moon mark.
- **Grade seal** — a coin at 42% of the disc, grade-color fill, white Instrument Sans letter;
  the ratified grade **gradient** (`--grade-x → -anchor`) at lead size.

Rules: the disc stays brand-oxblood on **every** remedy — grade color lives only in the orbit
and seal, and never touches the vermilion safety register. The grade is **never color alone**:
the letter is in the seal and echoed in adjacent text (the "Grade X" / tier-word lines). The
seal letter is pinned to the WCAG large-text band (**≥19px bold** at every size) as a
conservative floor (worst grade, white on `--grade-c`, computes 5.56:1 — §8 table); a
placement needing a disc smaller than `spot` must NOT carry the seal — use the plate card
(§11.2) or a plain `RemedyIcon` + text grade instead. Sizes: `spot` 80px, `lead` 148px. `TierBadge` remains the grade mark for
**illustration-free** contexts (claims table, metadata, inline).

Any change to the emblem anatomy or the seal-legibility rule is `[HUMAN-GATE]`.

### 11.2 Plate card (tier board)

At card scale the linocuts must not shrink below legibility — the tier-board card is a
**specimen plate** (`RemedyCard.astro`; design study 2026-07-15 v3, owner-ratified
"plate + stamp"). Anatomy:

- **Plate** — a full-bleed `--primary-soft` field (184px tall, hairline mat edge below)
  holding the linocut at **132px** — the scale the 1024px masters were carved to read at.
- **Stamp** — the evidence grade pressed onto the plate's lower-right corner like an
  assessor's mark: grade **letter + tier word** (from `lib/tiers` — never invent grading
  language), grade-color ink and border on a translucent paper chip, rotated −3°.
- **Body** — remedy name + ONE clamped verdict line (3 lines max). The key-compound line
  lives on the remedy page, not the browsing card.

Rules: grade is letter + word + color (stronger than never-color-alone requires) and repeated
in the card link's aria-label. Hover: card lifts (§4) and the specimen breathes —
`scale(1.02)`, no more; both disabled under `prefers-reduced-motion`. The plate is the ONLY
place the linocut may sit smaller than the emblem `spot` size, because the stamp — not a
seal on the art — carries the grade.

Any change to the plate/stamp anatomy is `[HUMAN-GATE]`.
