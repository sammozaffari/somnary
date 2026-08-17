# Somnary — Design System (developer handoff)

<!--
PROVENANCE — transcribed from docs/somnary-design-system/, 17 August 2026 (CHK-B1).

This file is the ONLY source of token VALUES for the codebase (CLAUDE.md token
single-source-of-truth). The Claude Design handoff bundle at `docs/somnary-design-system/`
is the SOURCE; this file is what the code reads. The bundle is transcribed here — never
referenced or rendered from directly. If the bundle and this file ever disagree, THIS
committed file wins.

THIS POINTER IS AUTHORITATIVE OVER ANY SESSION BRIEF. Some briefs describe the bundle as
living at a repo-root `somnary-design-system/`; it does not. It was delivered untracked at
`docs/somnary-design-system:/` (trailing colon), renamed to the clean committed path
`docs/somnary-design-system/` at CHK-B1 (owner-approved — colons break Windows checkouts and
archive tools, and an untracked bundle can't serve as a provenance artifact). Later B sessions
(B2, B5–B13, B15) resolve the bundle template source from THIS header, not from their prompts.

The live CSS token layer is `src/styles/global.css` (values identical to below; that file is
exempt in `scripts/check-tokens.mjs` as the token-definition source of truth). This system
SUPERSEDES the v3 warm/oxblood · Instrument Sans system WHOLESALE (CHK-R1 Artifact 1c); v3
survives only in git history. The retired presentation layer is deleted at CHK-B18.
-->

**Position — "the observatory":** a quiet, precise, warmly-lit instrument for looking at
evidence. Not a clinic (cold), not a wellness brand (vague), not a biohacker terminal (dark
neon). Calm verification, never persuasion. The binding charter is **`docs/RULES.md`** (repo
copy canonical); this file is the token/spec companion. Every value below is fixed — build
against named tokens, never a raw literal. A missing token the build needs is a
`[HUMAN-GATE]`, never an invented value (CLAUDE.md).

**Themes:** two — **day** (`:root`, the default) and **dusk** (`[data-theme="dusk"]`, a
designed low-light reading theme, not an inverted afterthought). Every component is verified in
both (CHK-B15 wires the sunset keying / stored override / no-flash script).

---

## 1. Identity (RULES.md Identity)

- **Wordmark:** **Somnary** — capitalised, no trailing period. Sentence case everywhere
  (headings, buttons, chips, captions, labels, placeholders, aria text). Names keep their
  fixed scientific forms: L-theanine, 5-HTP, GABA, CBD, CBN, CBT-I, vitamin D.
- **Brand mark:** the **letterform S** — a capital S in Onest 600, ink on paper, in the
  system's rounded square. No moons, stars, or sleep iconography anywhere in the identity. The
  crescent-moon disc (PR #33) and the study-field-derived dot-field favicon are **retired** on
  charter grounds (Somnary removes sleep-cliché costume).
  - Assets (all OUTLINED PATHS extracted from Onest 600 — never live `<text>`, since SVG
    favicons render without the page's fonts and would fall back to Arial): `public/favicon.svg`
    (day, 32px, ink S on paper), `public/favicon-dusk.svg` (dusk, cream S on night ground),
    `public/apple-touch-icon.png` (180px, rasterised from the bundle `touch-icon.svg`),
    `public/wordmark.svg` (full "Somnary"), `public/site.webmanifest`. The nav mark
    (`src/components/Wordmark.astro`) inlines the S glyph path in `currentColor`/`--ink`.
- **Dates:** render **"14 July 2026"**, never ISO, anywhere user-facing. ISO (YYYY-MM-DD) is
  the stored/schema form only; the human format is applied at render.

## 2. Type (RULES.md Identity; tokens/typography.css)

**Onest — one self-hosted family.** No serif, no mono, no display/body split, no typographic
signature device — character comes from the palette, spacing discipline, and evidence visuals.
Weight and size carry the whole hierarchy.

- **Self-hosting (non-negotiable):** the woff2 live in `public/fonts/`
  (`onest-latin-wght-normal.woff2` + `onest-latin-ext-wght-normal.woff2`, the OFL variable
  font, weight axis 100–900), declared with a local `@font-face` in `global.css`, and the
  latin subset is `<link rel="preload">`ed in `Base.astro`. **No Google Fonts, no Fontshare,
  no third-party font `@import`/`<link>`** (a CDN font is render-blocking and leaks the
  reader's IP to the host — a GDPR consideration). Enforced by `scripts/check-fonts.mjs`
  (`verify:fonts`). The bundle's `tokens/fonts.css` shipped a Google Fonts `@import`; it was
  deliberately NOT transcribed. The OFL text is at `public/fonts/onest-OFL.txt`.
- **One token:** `--font-sans` → `'Onest', -apple-system, 'Segoe UI', sans-serif`.
  `--font-display` was removed deliberately (two names for one value is how a display/body
  split silently returns). `--font-body`/`--font-display`/`--font-mono` exist ONLY as
  transition aliases resolving to `--font-sans` for the retired layer, deleted at CHK-B18.
- **Figures:** tabular lining figures everywhere — prose, identifiers (PMID/NCT/DOI), tables
  (`font-variant-numeric: tabular-nums`, set on `body`). Onest's cover every case, so no mono
  exists in the system.

| Token | Value | Role |
|---|---|---|
| `--text-xs` | 13px | metadata, "last checked" — **legibility floor: nothing below 13px, nothing below 4.5:1 on its surface** |
| `--text-sm` | 13.5px | captions, chip labels, small labels |
| `--text-base` | 16px | body (never below 16) |
| `--text-lg` | 18.5px | lead body, verdict sentences, search input |
| `--text-xl` | 22px | card titles |
| `--display-sm` | 28px | section headings (the questions people ask) |
| `--display-md` | 38px | page titles, plain-language stats |
| `--display-lg` | 52px | hero stat / remedy name |

Line-height: `--leading-tight` 1.15 · `--leading-snug` 1.35 · `--leading-body` 1.6.
Tracking: `--tracking-display` −0.01em (display sizes only).

**Weights** (deliberate, not incidental): `--weight-body` 400 (body) · `--weight-meta` 450
(metadata, captions, key labels) · `--weight-ui` 500 (interactive rows, input, verdict lines)
· `--weight-strong` 600 (small labels, buttons, chips, card titles, wordmark) ·
`--weight-heading` 650 (`--display-sm` section headings) · `--weight-title` 550 (page titles
& display stats).

## 3. Colour (RULES.md Colour — the one rule above all)

**COLOUR MEANS DATA.** `--evidence` (ink blue, the colour of printed reference) is the
evidence bar and its key and **nothing else**. ALL interface colour — buttons, links, focus
rings, active states — is `--ink`. **There is no `--accent`; never reintroduce one.** Green
family = an earned positive verdict only. Amber = the safety register only. Avoid-red =
documented failure/concern only. No decorative gradients — the one exception is the dusk
`--page-ground` vertical shift; day stays flat, and never a gradient behind the hero, behind
or inside the evidence bar, or on any quantity. Bucket badges are colour **and** shape coded
(disc / half-disc / ring / struck ring); colour is never the sole signal.

### 3.1 Day tokens (`:root`)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F6F2E9` | page ground (base) |
| `--page-ground` | `var(--paper)` | body ground — flat by day |
| `--paper-raised` | `#FBF8F1` | cards, raised surfaces |
| `--paper-sunken` | `#EEE9DB` | sunken fills, tracks, placeholder grounds |
| `--ink` | `#1C1B22` | primary text AND all interface colour (15.29:1 on paper) |
| `--ink-2` | `#5B564E` | muted text (6.51:1 on paper) |
| `--ink-3` | `#6B675C` | faint text — legibility floor (worst 4.65:1 on sunken) |
| `--line` | `#E1DACA` | hairline dividers/borders |
| `--line-strong` | `#C8C0AC` | strong lines |
| `--evidence` | `#2C3E63` | **evidence bar + key ONLY** (9.51:1 on paper) |
| `--evidence-strong` | `#1E2C4A` | emphasis within the bar |
| `--evidence-tint` | `#E2E6EF` | bar track tint |
| `--evidence-line` | `#B9C2D4` | bar hairline |
| `--sage` | `#6E7D64` | GRAPHIC token (check-mark strokes/fills); fails AA as text by design |
| `--sage-text` | `#53614A` | sage-coloured TEXT (worst 5.45:1 on sunken) |
| `--sage-tint` | `#E8EBDF` | sage fill |
| `--bucket-works` | `#3E6B4F` | "Helps most people sleep" — solid disc (5.49:1 on paper) |
| `--bucket-maybe` | `#7C6012` | "May help sleep a little" — half-filled disc (5.31:1) |
| `--bucket-unknown` | `#6B6459` | "Not properly tested" — empty ring; warm grey, distinct from evidence blue (5.23:1) |
| `--bucket-avoid` | `#9C4330` | "Tested — doesn't seem to help" — struck ring (5.77:1) |
| `--bucket-*-tint` | `#DFE8DD` / `#F0E7C9` / `#E7E3DA` / `#F0DCD3` | bucket fills |
| `--amber` | `#8A5A16` | safety register (4.83:1 on `--amber-tint`) |
| `--amber-tint` | `#F5E7CB` | safety fill |
| `--amber-line` | `#DCC28C` | safety hairline |
| `--border-input` | `#8A8370` | sole-boundary control borders, ≥3:1 non-text (3.38:1 on paper) |
| `--focus-ring` | `2px solid var(--ink)` | `:focus-visible` outline |
| `--focus-offset` | `2px` | focus outline offset |
| `--shadow-card` | `0 1px 2px rgba(28,27,34,.05), 0 6px 20px rgba(28,27,34,.06)` | card elevation |
| `--shadow-pop` | `0 2px 6px rgba(28,27,34,.08), 0 12px 32px rgba(28,27,34,.14)` | popover elevation |
| `--scrim` | `rgba(28,27,34,0.32)` | overlay scrim |

Semantic aliases (all interface colour is ink): `--surface-page`→paper, `--surface-card`
→paper-raised, `--surface-sunken`→paper-sunken, `--text-body`→ink, `--text-muted`→ink-2,
`--text-faint`→ink-3, `--text-link`→ink, `--text-link-hover`→ink-2, `--border-hairline`→line,
`--border-strong`→line-strong.

### 3.2 Dusk tokens (`[data-theme="dusk"]`) — amber-shifted text, lowered contrast, dimmed chrome

| Token | Value | Note |
|---|---|---|
| `--paper` | `#17151E` | night ground |
| `--page-ground` | `linear-gradient(180deg, #191722 0%, #100E1A 100%)` | **the one allowed gradient** — lightens top, darkens bottom (light direction, not a vignette); page ground only |
| `--paper-raised` | `#201D29` | cards |
| `--paper-sunken` | `#100E15` | sunken |
| `--ink` | `#E7DECB` | text + interface (13.51:1 on paper) |
| `--ink-2` | `#A99F8F` | muted (6.92:1) |
| `--ink-3` | `#918876` | faint — floor (worst 4.72:1 on raised) |
| `--line` | `#2C2836` | hairline |
| `--line-strong` | `#3D3849` | strong line |
| `--border-input` | `#746D8B` | control boundary (3.70:1 on paper) |
| `--evidence` | `#8FA5CE` | evidence bar (7.26:1 on paper) |
| `--evidence-strong` | `#A9BCDF` | — |
| `--evidence-tint` | `#232B3F` | — |
| `--evidence-line` | `#3C4A6B` | — |
| `--sage` / `--sage-text` | `#92A385` | one value serves both roles at dusk (6.15:1 on raised) |
| `--sage-tint` | `#222A1E` | — |
| `--bucket-works/maybe/unknown/avoid` | `#8CB795` / `#C7A050` / `#A29A8B` / `#C97F68` | all ≥5.78:1 on paper |
| `--bucket-*-tint` | `#1E2B21` / `#2B2414` / `#26231D` / `#2E1E18` | — |
| `--amber` / `--amber-tint` / `--amber-line` | `#D2A559` / `#2C2314` / `#5C4A26` | 6.83:1 |
| `--shadow-card` | `0 1px 2px rgba(0,0,0,.3), 0 6px 20px rgba(0,0,0,.35)` | deepened |
| `--shadow-pop` | `0 2px 6px rgba(0,0,0,.4), 0 16px 40px rgba(0,0,0,.5)` | deepened |
| `--scrim` | `rgba(8,7,12,0.55)` | — |

## 4. Spacing, sizing, radii (tokens/spacing.css)

- **Spacing** (4px base): `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 ·
  `-7` 32 · `-8` 40 · `-9` 56 · `-10` 80.
- **Radii:** `--radius-xs` 4 · `--radius-sm` 8 · `--radius-md` 12 · `--radius-lg` 16 ·
  `--radius-pill` 999. **Nested-radii rule:** equal padding all round, inner radius = outer −
  padding (e.g. `--radius-lg` outer + `--space-1` padding → `--radius-md` inner).
- **Control heights** (every interactive element uses one): `--control-sm` 36 (VISUAL height
  only) · `--control-md` 44 (= minimum hit target, mobile-first) · `--control-lg` 48 ·
  `--control-xl` 56. A real hit area is never below `--control-md` regardless of visual size.
- **`--border-w` 1px — the only border width.** Emphasis via colour, never thickness.
- **Widths:** `--measure` 62ch (max body line) · `--page-max` 720px (single-column content) ·
  `--search-max` 640px (search field) · `--popover-w` 300px (study-chip popover) ·
  `--hit-target` = `--control-md`.

## 5. Motion (tokens/motion.css; RULES.md a11y)

Calm, 150–250ms, settling ease. `--dur-fast` 150ms · `--dur-base` 200ms · `--dur-slow` 250ms
· `--dur-reveal` 450ms (the label→strike-through→finding reveal, the only exception to 250ms).
`--ease-settle` `cubic-bezier(0.22, 0.8, 0.3, 1)` · `--ease-fade` `cubic-bezier(0.4, 0, 0.2, 1)`.
Hover shifts background to `--surface-sunken` or border to `--border-strong` — no lifts, no
scale. `prefers-reduced-motion: reduce` collapses all `--dur-*` to 1ms (overridden once in
`global.css` so every component inherits it).

## 6. Global baseline (styles.css → global.css)

Behaviour the whole system relies on, transcribed into `src/styles/global.css`:

- **Page ground:** `body { background: var(--page-ground) fixed; }` — flat paper by day, the
  dusk gradient at night; fixed attachment so light direction spans the viewport.
- **Focus (a11y floor):** `:focus-visible { outline: var(--focus-ring); outline-offset:
  var(--focus-offset); }` — a global rule, the sanctioned exception to inline-styled
  components (inline styles can't express `:focus-visible`).
- **In-page jumps:** `[id] { scroll-margin-top: var(--space-8); }` keeps an anchored
  destination clear of sticky chrome. `:target` gets a semantically-empty neutral tint
  (`--surface-sunken`, never evidence blue, never amber) fading over ~1s on section headings;
  reduced motion gets no animation.
- **Links:** ink, underline on hover, `text-underline-offset: 3px`.

## 7. Accessibility floors (RULES.md — non-negotiable)

- Text ≥ 4.5:1 on its actual surface, both themes; minimum 13px. Muted/faint reserved for
  genuinely peripheral text — data labels are not peripheral.
- Sole-boundary borders ≥ 3:1 (`--border-input`); decorative hairlines exempt by intent.
- Visible `:focus-visible` on everything interactive. Hit areas ≥ 44px regardless of visual
  size. One `h1` per page, no skipped levels. `prefers-reduced-motion` respected.

**Contrast — computed 17 August 2026 (WCAG 2.1), both themes.** Every text token clears 4.5:1
on its worst real surface and every sole-boundary border clears 3:1. Worst text cases: day
`--ink-3` on sunken 4.65:1, day `--amber` on tint 4.83:1; dusk `--ink-3` on raised 4.72:1.
Worst borders: day `--border-input` 3.38:1, dusk 3.70:1. (Re-run the spot-check on any token
change.)

## 8. What this system does NOT carry (retired with v3 / by charter)

- **No illustration / photography.** The linocut remedy-icon system, hero plates, coda plates,
  struck-coin emblem, and plate/stamp are all retired. Product/brand imagery is a first-class
  typographic **BrandMark placeholder** (brand initial on a bucket-tinted ground); the
  placeholder is the common case. Remedy pages no longer open on a painted hero.
- **No S–F letter grades / oxblood / vermilion / citron / Instrument Sans.** The four evidence
  buckets + tri-state safety flag + product score replace the letter tiers (three separate
  signals, never merged — Reference A4 / RULES.md).
- **No Tailwind in the new chrome.** Components style from the custom properties above
  (CHK-B2+). The `@tailwind` directives remain in `global.css` only to keep the retired layer
  rendering until CHK-B18.

## 9. Gaps / open human-gates

- **Product "worth buying" verdict threshold** (`met >= 3` / `PASSES_THRESHOLD`) is a
  PLACEHOLDER — the four checks are almost certainly not equally weighted. One definition in
  code, every consumer importing it; settle editorially before Phase-3 product content
  (CLAUDE.md HG; CHK-Rprod.4 during the E-track).
- **Any token the build needs that the bundle does not define** is a `[HUMAN-GATE]`, never an
  invented value. None were missing at transcription (17 August 2026).
- The bundle also ships component/template references (`components/`, `templates/`,
  `ui_kits/`, `guidelines/`) — these are the design source consumed at CHK-B2+ page sessions,
  not tokens; they are not rendered from directly.
