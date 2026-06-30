# somnary — Design System (Developer Handoff)

**v1.2 · build spec.** Every value below is **fixed** unless explicitly marked _developer's discretion_. Soft-light palette only. Build against the named tokens; never hardcode raw values.

---

## 1. Tokens

### 1a. CSS `:root`

```css
:root {
  /* ---- type families ---- */
  --font-display: "Newsreader", Georgia, "Times New Roman", serif;
  --font-body:    "Hanken Grotesk", system-ui, -apple-system, sans-serif;
  --font-mono:    "IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace;

  /* ---- neutrals (warm) ---- */
  --base:        #F7F5F0;
  --surface:     #FCFBF7;
  --sunken:      #F0EDE4;
  --line:        #E4DFD3;
  --line-strong: #D0C9B9;
  --ink:         #1A1A1F;   /* 15.9:1 on base */
  --ink-soft:    #4C4B52;   /*  7.91:1 on base */
  --ink-faint:   #726F63;   /*  4.62:1 on base — AA small text */

  /* ---- accents (muted) — base hue is FILL/BORDER ONLY (fails AA as text) ---- */
  --lavender:      #8480C4;
  --lavender-ink:  #5A549E;  /* 6.03:1 — accent text / links */
  --lavender-tint: #ECEAF6;
  --sage:          #82A088;
  --sage-ink:      #4C6E53;  /* 5.26:1 — accent text */
  --sage-tint:     #E8EFE7;

  /* ---- tier spectrum (S→F): solid (fill/bar/glyph) · ink (text) · tint (badge wash) ---- */
  --tier-s: #3D7A54; --tier-s-ink: #2E6342; --tier-s-tint: #E4EEE6;
  --tier-a: #6E8B3F; --tier-a-ink: #566E2F; --tier-a-tint: #ECEFDF;
  --tier-b: #94791F; --tier-b-ink: #75600F; --tier-b-tint: #F1ECD9;
  --tier-c: #A8682E; --tier-c-ink: #864F1F; --tier-c-tint: #F3E8DA;
  --tier-d: #AD5538; --tier-d-ink: #8C4127; --tier-d-tint: #F4E3DB;
  --tier-f: #9B5161; --tier-f-ink: #7C3F4D; --tier-f-tint: #F1E2E4;

  /* ---- type scale: size / line-height (weight + tracking in notes) ---- */
  --text-display: 84px;   --lh-display: 0.98;  /* Newsreader 400, -0.02em */
  --text-3xl:     60px;   --lh-3xl:     1.02;  /* Newsreader 400, -0.02em */
  --text-2xl:     44px;   --lh-2xl:     1.05;  /* Newsreader 400 */
  --text-xl:      32px;   --lh-xl:      1.10;  /* Newsreader 500 */
  --text-lg:      24px;   --lh-lg:      1.20;  /* Hanken 600 */
  --text-md:      21px;   --lh-md:      1.50;  /* Hanken 400 (lead) */
  --text-base:    18px;   --lh-base:    1.62;  /* Hanken 400 (body) */
  --text-sm:      15px;   --lh-sm:      1.50;  /* Hanken 400 */
  --text-xs:      12.5px; --lh-xs:      1.40;  /* IBM Plex Mono 500, 0.12em, UPPERCASE */
  --tracking-tight: -0.02em;
  --tracking-label:  0.12em;

  /* ---- spacing (8px base, 4px step) ---- */
  --sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px; --sp-4: 16px; --sp-5: 24px;
  --sp-6: 32px; --sp-7: 48px;  --sp-8: 64px; --sp-9: 96px; --sp-10: 128px;

  /* ---- radii ---- */
  --r-xs: 3px; --r-sm: 6px; --r-md: 10px; --r-lg: 16px; --r-xl: 22px; --r-pill: 999px;

  /* ---- borders ---- */
  --border-hairline: 1px solid var(--line);
  --border-strong:   1px solid var(--line-strong);
  /* tier badge border = 1px solid var(--tier-{x}); */

  /* ---- elevation ---- */
  --shadow-sm:   0 1px 2px rgba(26,26,31,.04), 0 1px 3px rgba(26,26,31,.06);
  --shadow-md:   0 4px 12px -4px rgba(26,26,31,.10);
  --shadow-lift: 0 14px 34px -16px rgba(26,26,31,.18);

  /* ---- a11y + brand mechanics ---- */
  --ring:                0 0 0 3px rgba(132,128,196,.40); /* keyboard focus */
  --grade-optical-shift: 0.13em;  /* serif-cap optical-center nudge in tier badges */

  /* ---- motion ---- */
  --dur-instant: 120ms; --dur-fast: 200ms; --dur-base: 320ms; --dur-slow: 560ms; --dur-ambient: 2800ms;
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);  /* default — decelerate & rest */
  --ease-soft:   cubic-bezier(0.4, 0, 0.2, 1);    /* fades / color shifts */

  /* ---- breakpoints (max-width, mobile-down) ---- */
  /* 900px: sidebar stacks · 760px: tier rail stacks + stat row 2-col · 640px: phone */
}
```

### 1b. Tailwind `theme.extend`

```js
// tailwind.config.js → module.exports = { theme: { extend: somnaryTheme } }
const somnaryTheme = {
  colors: {
    base: '#F7F5F0', surface: '#FCFBF7', sunken: '#F0EDE4',
    line: { DEFAULT: '#E4DFD3', strong: '#D0C9B9' },
    ink:  { DEFAULT: '#1A1A1F', soft: '#4C4B52', faint: '#726F63' },
    lavender: { DEFAULT: '#8480C4', ink: '#5A549E', tint: '#ECEAF6' }, // DEFAULT = fill/border only
    sage:     { DEFAULT: '#82A088', ink: '#4C6E53', tint: '#E8EFE7' }, // DEFAULT = fill/border only
    tier: {
      s: { DEFAULT: '#3D7A54', ink: '#2E6342', tint: '#E4EEE6' },
      a: { DEFAULT: '#6E8B3F', ink: '#566E2F', tint: '#ECEFDF' },
      b: { DEFAULT: '#94791F', ink: '#75600F', tint: '#F1ECD9' },
      c: { DEFAULT: '#A8682E', ink: '#864F1F', tint: '#F3E8DA' },
      d: { DEFAULT: '#AD5538', ink: '#8C4127', tint: '#F4E3DB' },
      f: { DEFAULT: '#9B5161', ink: '#7C3F4D', tint: '#F1E2E4' },
    },
  },
  fontFamily: {
    display: ['Newsreader', 'Georgia', 'serif'],
    body:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
    mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    display: ['84px',   { lineHeight: '0.98', letterSpacing: '-0.02em', fontWeight: '400' }],
    '3xl':   ['60px',   { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '400' }],
    '2xl':   ['44px',   { lineHeight: '1.05', fontWeight: '400' }],
    xl:      ['32px',   { lineHeight: '1.10', fontWeight: '500' }],
    lg:      ['24px',   { lineHeight: '1.20', fontWeight: '600' }],
    md:      ['21px',   { lineHeight: '1.50', fontWeight: '400' }],
    base:    ['18px',   { lineHeight: '1.62', fontWeight: '400' }],
    sm:      ['15px',   { lineHeight: '1.50', fontWeight: '400' }],
    xs:      ['12.5px', { lineHeight: '1.40', letterSpacing: '0.12em', fontWeight: '500' }],
  },
  spacing: { 1:'4px',2:'8px',3:'12px',4:'16px',5:'24px',6:'32px',7:'48px',8:'64px',9:'96px',10:'128px' },
  borderRadius: { xs:'3px', sm:'6px', md:'10px', lg:'16px', xl:'22px', pill:'999px' },
  boxShadow: {
    sm:   '0 1px 2px rgba(26,26,31,.04), 0 1px 3px rgba(26,26,31,.06)',
    md:   '0 4px 12px -4px rgba(26,26,31,.10)',
    lift: '0 14px 34px -16px rgba(26,26,31,.18)',
    ring: '0 0 0 3px rgba(132,128,196,.40)',
  },
  transitionDuration: { instant:'120ms', fast:'200ms', base:'320ms', slow:'560ms', ambient:'2800ms' },
  transitionTimingFunction: {
    settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
    soft:   'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  screens: { // max-width (use in `max-*` variants)
    'mx-lap': { max: '900px' }, 'mx-tab': { max: '760px' }, 'mx-phone': { max: '640px' },
  },
};
module.exports = { somnaryTheme };
```

### 1c. Font loading (required in `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
```

Base document: `body { background: var(--base); color: var(--ink); font-family: var(--font-body); font-size: var(--text-base); line-height: var(--lh-base); }` · `::selection { background: var(--lavender-tint); }`

---

## 2. Components

Global: every interactive element gets `:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--r-sm); }`. Min tap target **44×44px** for any control. Headings/display copy are set **lowercase** (author the text lowercase; do not use `text-transform` except on `--text-xs` mono labels, which are UPPERCASE).

### 2.1 Wordmark
- **Anatomy:** crescent mark + logotype `somnary` + lavender period. Mark = an 18×18px box; an `--ink` circle (`inset:0`) with a `--base` circle (14×14px) offset `top:-3px; right:-3px` punched over it to form a crescent. Logotype: `--font-display`, 23px, `letter-spacing:-0.01em`, color `--ink`. Period: a trailing `<span>` colored `--lavender`.
- **Tokens:** `--font-display`, `--ink`, `--base`, `--lavender`.
- **States:** default only. Linked → wraps in `<a>` (focus ring applies). No hover color change.
- **Responsive:** unchanged across breakpoints.
- **A11y:** wrapping `<a aria-label="somnary — home">`; mark is decorative (`aria-hidden`).
- **Motion:** none.

### 2.2 Tier badge
- **Anatomy:** square (`--r-sm` small / `--r-lg` large) with `background: var(--tier-{x}-tint)`, `border: 1px solid var(--tier-{x})`, centered single glyph `S A B C D F` in `--font-display`, weight 500, color `var(--tier-{x}-ink)`.
- **Critical centering:** glyph wrapper `display:flex; align-items:center; justify-content:center`; glyph `line-height:1; transform: translateY(var(--grade-optical-shift))`. **Do not omit the shift** — the serif cap sits high otherwise.
- **Sizes:** inline 26px (glyph 16px) · card 38–52px (glyph 21–28px) · header 72–84px (glyph 40–52px). _Intermediate sizes: developer's discretion, keep glyph ≈ 0.58 × box._
- **Tokens:** `--tier-{x}`, `--tier-{x}-ink`, `--tier-{x}-tint`, `--r-sm`/`--r-lg`, `--grade-optical-shift`, `--font-display`.
- **States:** default only (it's a label, not a control). When inside a clickable card, the card carries hover/focus, not the badge.
- **Responsive:** fixed size per usage; does not scale fluidly.
- **A11y:** ink-on-tint pairs are AA (S 5.93 · A 4.90 · B 5.16 · C 5.51 · D 5.81 · F 6.26). Provide a text equivalent nearby (e.g. "Grade B") or `aria-label`; never rely on the letter's color alone.
- **Motion:** none intrinsically (it may participate in a parent's page-rise).

### 2.3 Evidence-gate chip
- **Anatomy:** pill (`--r-pill`), `--font-mono` 11–12px, padding `5px 11px`. Three semantic variants:
  - **positive** — `color: var(--sage-ink); background: var(--sage-tint);` (e.g. "meta-analysis exists", "RCT · n≥100")
  - **caution** — `color: var(--tier-c-ink); background: var(--tier-c-tint);` (e.g. "effect size small")
  - **neutral** — `color: var(--ink-soft); background: var(--sunken);` (e.g. "heterogeneous trials")
- **Tokens:** the pairs above, `--r-pill`, `--font-mono`.
- **States:** default. If used as a filter control (outcome page): default `background: var(--surface); border: var(--border-hairline)`; **active** `color: var(--ink); background: var(--lavender-tint); border: 1px solid var(--lavender)`; **hover** `border-color: var(--line-strong)` (`--dur-fast`/`--ease-soft`). Static (non-control) chips have no hover.
- **Responsive:** wrap with `flex-wrap: wrap; gap: var(--sp-2)`.
- **A11y:** never color-only — the label text states the gate. Control chips are `<a>`/`<button>` with focus ring; active filter sets `aria-current="true"`.
- **Motion:** control chips animate border/color on `--dur-fast`/`--ease-soft`. Static chips: none.

### 2.4 Claims-vs-data table
- **Anatomy:** container `border: var(--border-hairline); border-radius: var(--r-lg); overflow:hidden`. Header row (`--sunken` bg): left label "what's claimed" (`--ink-faint`), right "what the studies show" (`--sage-ink`), both `--text-xs` mono. Each data row = `.claimrow` (2-col grid `1fr 1fr`): left **claim** cell (`--ink-faint`, 16px, right border `--line`) containing `<span class="claim">` with a nested `<span class="strikeline">`; right **data** cell (`.data`, `--surface` bg, 16px `--ink`) ending in a citation marker (see 2.8).
- **Signature motion (strike-to-resolve):** on load, staggered ~80ms per row: the `.strikeline` draws `scaleX(0→1)` through the claim (`--dur-slow`/`--ease-settle`) while `.data` fades + `translateY(8px→0)` (`--dur-base`/`--ease-settle`). **Implementation is FIXED (see §5 guardrails):** content visible by default; drive reveal with **inline styles on a JS timer**, never IntersectionObserver, scroll listeners, or a CSS `.in` class. A 2.5s safety timer must force-reveal all cells unconditionally. The strike is a real element (`.strikeline`, absolutely positioned, `height:1.5px`, `background: var(--tier-d)`, `transform-origin:left`), never `::after`.
- **Empty state (sparse remedy):** when a claim has no study, the data cell renders a `.nodata` marker — `--font-mono` 13px, `--ink-faint`, with a leading 18px `--line-strong` dash — reading e.g. "no human sleep trial tests this claim". Empty cells are intentional content, never blank.
- **Dense state:** holds at 8+ rows; no max. Row vertical padding `20–22px`.
- **Responsive (≤640px — FIXED strategy = labelled-pair stack):** `.claimrow` → single column. Claim cell's right border becomes bottom border. Each cell gains a mono `--text-xs` eyebrow: claim cell "claimed" (`--ink-faint`), data cell "studies show" (`--sage-ink`), injected via a `.c-label` element OR a `::before` on the static table. The strike still draws. Do not switch to tabs, accordions, or horizontal scroll.
- **Tokens:** `--line`, `--surface`, `--sunken`, `--ink`, `--ink-faint`, `--sage-ink`, `--tier-d`, `--r-lg`, `--font-mono`, `--dur-slow`/`--dur-base`/`--ease-settle`.
- **A11y:** semantic `<table>`/`<tr>`/`<td>` with `<th scope="col">` is preferred; if using divs, add `role="table/row/cell"`. Reveal must not gate information — reduced-motion shows final state instantly. Claim text is `--ink-faint` (4.62:1 ✓).
- **Never animate:** row layout/height, the strike on hover, anything scroll-driven.

### 2.5 Remedy card + metadata sidebar
- **Anatomy (page-level template):** sticky nav; header (breadcrumb, header-size tier badge, lowercase `--text-3xl` title + lavender period, `--text-md` dek, mono meta line); **verdict band** (`--surface`, `--r-xl`, 2-col `1.5fr 1fr`: serif verdict statement left with right border; evidence-gate chips + grade note right); body grid `1fr 320px`; main column = claims-vs-data, evidence summary, dosing grid, safety callout, mechanism, sources; **sidebar** = metadata card + community bar + ask.
- **Metadata card ("at a glance"):** `--surface`, `--border-hairline`, `--r-lg`. Mono `--text-xs` header. Rows (label `--ink-faint` left / value right, `border-bottom: var(--border-hairline)`): **Grade** (inline tier badge), **Key compound**, **Studied dose**, **Best for**, **Safety flag** (a caution/neutral chip). Unknown values render `--ink-faint` "not established"/"unproven" — never blank.
- **Tokens:** `--surface`, `--line`, `--r-lg`/`--r-xl`, type scale, tier + chip tokens.
- **States:** card links use `--shadow-lift` + `translateY(-3px)` on hover (`--dur-base`/`--ease-settle`). Sidebar is `position:sticky; top:88px`.
- **Responsive:** body grid `1fr 320px` → **single column at ≤900px**; sidebar drops `sticky`→`static` and moves below main. Verdict band 2-col → 1-col at ≤640px (left cell gains bottom border). Title → 46px at ≤640px. Side padding 48px → 24px at ≤640px.
- **A11y:** one `<h1>` (remedy name); sidebar is `<aside>`. Grade communicated as text, not color alone. Sticky offset accounts for the 64px nav.
- **Motion:** page-rise on load; card hover lift; claims reveal. Nothing else.

### 2.6 Outcome card
- **Anatomy:** goal-first card. Two forms: (a) **showcase** — tinted bg (`--lavender-tint` or `--sage-tint` or `--surface`), mono meta line ("guide · N remedies"), lowercase `--text-xl` goal title + period, a wrapping row of remedy chips (`--surface` pills, mono 11px); (b) **ranked row** (outcome page) — grid `40px 60px 1fr auto`: index (mono `--ink-faint`), tier badge, name + one-line note, trailing evidence chip.
- **Tokens:** `--lavender-tint`/`--sage-tint`/`--surface`, `--r-lg`, tier badge, chip, type scale.
- **States:** whole card/row is a link → hover `--shadow-lift` + `translateY(-3px)` (cards) or `background: var(--sunken)` (rows), `--dur-base`/`--ease-settle`/`--dur-fast`. Focus ring on the link.
- **Responsive:** showcase grid `repeat(3,1fr)` → wraps via `minmax(280px,1fr)` auto-fill; ranked rows keep the grid, allow the note to wrap; below 640px collapse the `60px` badge column gap.
- **A11y:** entire card is one focusable `<a>`; chips inside are decorative text (not nested links).
- **Motion:** hover lift only.

### 2.7 Stat row
- **Anatomy:** 4 equal cells in a 1px-gap grid over `--line` bg (creates hairline dividers), each cell `--base` bg, padding `26–28px`: big number `--font-display` 44–52px (key figures may use `--sage-ink` for "0" and `--lavender-ink` for "$0"), mono `--text-xs` label `--ink-faint` below.
- **Tokens:** `--line`, `--base`, `--font-display`, `--font-mono`, `--ink-faint`, `--sage-ink`, `--lavender-ink`, `--r-lg`.
- **States:** static (default only). Counts are content (e.g. "100+", "1,200", "0", "$0").
- **Responsive:** `repeat(4,1fr)` → **2-col at ≤760px** → may go 1-col at ≤420px (_developer's discretion_).
- **A11y:** numbers and labels are real text; if animated counting is added (not required) respect reduced-motion.
- **Motion:** none by default. (Count-up is _not_ part of the system; do not add.)

### 2.8 Citation popover
- **Anatomy:** trigger = inline `.cite-sup` marker (`--font-mono`, `0.72em`, superscript, `--lavender-ink`). Popover = `position:fixed`, `width:320px`, `max-height:calc(100vh - 24px)`, `overflow:auto`, `--surface` bg, `--border-strong`, `--r-md`, `--shadow-lift`, padding 20px. Contents: mono header `citation [n]` + design tag, serif title, source line, finding paragraph (top-bordered). A full-viewport invisible overlay sits behind it to catch outside-clicks.
- **Positioning (FIXED algorithm):** anchor below the marker (`rect.bottom + 8`); if it would overflow, flip above; then **clamp against the popover's real measured height** (`getBoundingClientRect().height`, not a constant) so `top ∈ [12, vh − height − 12]`. Re-clamp on `requestAnimationFrame` + a 140ms timeout (font/wrap settle). `max-height`+`overflow:auto` is the hard backstop. Horizontal: clamp `left` into `[16, vw − 320 − 16]`.
- **Tokens:** `--surface`, `--line-strong`, `--r-md`, `--shadow-lift`, `--font-mono`, `--font-display`, `--lavender-ink`, `--dur-base`, `--ease-settle`.
- **States:** **default** (one open at a time — opening another replaces it); **hover** on trigger → `--lavender`; **focus** trigger → focus ring; **open** → fade in. No loading/disabled.
- **Responsive:** same component; on phones it still clamps to viewport (320px fits 360px width with 16px gutters).
- **A11y:** trigger is a `<button>` (or `<a>`) with `aria-label="citation N"`; popover `role="dialog"`, focus moves in, `Esc` and outside-click close, focus returns to trigger. Marker is ≥ tap-target via padding on small screens.
- **Motion:** fade only — `@keyframes { from{opacity:0} to{opacity:1} }`, `--dur-base`/`--ease-settle`. **Must NOT** scale/translate (geometry must be stable for the clamp).

### 2.9 Ask button
- **Anatomy:** pill `<a>`/`<button>`: `--lavender-tint` bg, `--lavender-ink` text, `--font-mono` 12.5px, padding `8–10px 16px`, leading 7px `--lavender` dot, `min-height:44px`, `justify-content:center`. Sidebar "ask" panel variant: `--lavender-tint` block (`--r-lg`) with label, prompt text, a rounded input + circular `--lavender` send button (30px), and a "thinking" dot row.
- **Tokens:** `--lavender`, `--lavender-ink`, `--lavender-tint`, `--r-pill`/`--r-lg`, `--font-mono`, `--ring`.
- **States:** **default**; **hover** → `border-color: var(--lavender)` (border transparent→lavender, `--dur-fast`/`--ease-soft`); **focus** ring; **active** no transform; **loading** → three dots breathe opacity `.3↔1` on `--dur-ambient` loop, 0.35s stagger ("reading the studies…"); **disabled** (send while loading) → `--ink-faint`, no pointer.
- **Responsive:** unchanged; remains ≥44px.
- **A11y:** real button; loading sets `aria-busy="true"`; dot is decorative.
- **Motion:** hover border (`--dur-fast`); thinking dots (`--dur-ambient`, the ONLY looping animation allowed). Reduced-motion: dots hold static, label still shows.

### 2.10 Paywall teaser → (free) brief promo
- **Anatomy:** `--surface` card, `--border-hairline`, `--r-xl`. Body: mono eyebrow ("brief · deep dive"), serif `--text-2xl` headline, dek, then a teaser paragraph with a **fade-out mask** (`mask-image: linear-gradient(to bottom, #000 0%, transparent 100%)`) on the last line. Footer bar (`--sunken`, top border): primary CTA (`--ink` bg, `--surface` text, pill) + mono reassurance line.
- **Tokens:** `--surface`, `--sunken`, `--line`, `--ink`, `--r-xl`/`--r-pill`, `--font-display`/`--font-mono`, mask gradient (literal — the only allowed non-token value, it's a mask not a color).
- **States:** CTA hover → `translateX(2px)` (`--dur-fast`/`--ease-soft`); focus ring. No locked/unlocked toggle in markup (membership removed — copy is "read the brief", always accessible).
- **Responsive:** body padding 44px → 24px ≤640px; footer wraps (`flex-wrap`).
- **A11y:** the masked text must not hide essential info (it's a teaser continuation); CTA is a real link.
- **Motion:** CTA nudge only.

### 2.11 Community progress bar
- **Anatomy:** in a `--surface`/`--border-hairline`/`--r-lg` card: mono `--text-xs` header ("community read"), a serif "N / 100" figure, a track (`height:7px`, `--r-pill`, `--sunken` bg) with a fill (`--lavender`, `--r-pill`, `width: N%`), and a `--text-sm` `--ink-soft` caption.
- **Tokens:** `--surface`, `--sunken`, `--lavender`, `--r-pill`/`--r-lg`, `--font-display`/`--font-mono`.
- **States:** **default** (filled to N%); **empty/low-data** (N small, e.g. 3) → still render the true small fill + caption noting too few reports; never imply a pattern. No hover.
- **Responsive:** full-width in sidebar; unchanged.
- **A11y:** `role="progressbar"` with `aria-valuenow/min=0/max=100`; the figure is real text.
- **Motion:** _developer's discretion_ — a one-time fill `width 0→N%` on load (`--dur-slow`/`--ease-settle`) is acceptable; must respect reduced-motion (jump to N%). Do not loop or pulse.

### 2.12 Safety callout
- **Anatomy:** `--r-lg` block, 1px border. **Head:** circular sigil "!" (solid tier color, `--surface` glyph), mono `--text-xs` title ("safety & interactions"), right-aligned severity tag. **Body:** lead paragraph, then a `.risk` grid (`160px 1fr`: mono category label + text), each risk top-bordered. **Foot:** mono disclaimer ("research reference · not medical advice"), top border.
- **Two FIXED severities (do not invent a red alert):**
  - `.sev-caution` — `background: var(--tier-c-tint); border-color: var(--tier-c)`; sigil/labels/foot `--tier-c-ink`; severity tag `--tier-c` bg / `--surface` text. Use on A/B pages (mild interactions).
  - `.sev-serious` — `background: var(--tier-f-tint); border-color: var(--tier-f)`; sigil/labels/foot `--tier-f-ink`; severity tag `--tier-f` bg / `--surface` text. Use for F-grade / documented harm.
- **Tokens:** tier-c / tier-f triplets, `--surface`, `--r-lg`/`--r-pill`, `--font-mono`.
- **Scaling:** identical register from a 1-line head-only note up to a full multi-risk body; only height changes. Risk rows are repeatable.
- **Responsive:** `.risk` grid `160px 1fr` → single column at ≤640px (label sits above text).
- **A11y:** `role="note"` (or `role="alert"` only for a genuinely urgent dynamic warning); white-on-solid severity tag passes AA (caution 4.8:1, serious 5.6:1); ink-on-tint body passes AA. Never color-only — the title and severity word carry meaning.
- **Motion:** none. Must NOT flash, pulse, or slide.

### 2.13 Search (added v1.3 — see PROJECT_PLAN §2a)
- **Anatomy:** (a) **nav trigger** — mono `--text-xs` "search" pill with a leading magnifier glyph + a `⌘K` hint badge (`--sunken`, `--ink-faint`); (b) **command palette overlay** — centered modal `max-width:640px`, `--surface`, `--border-strong`, `--r-lg`, `--shadow-lift`, over a `rgba(26,26,31,.28)` scrim; top input row (`--font-body` 18px, leading magnifier, no border, `--base` inset field); results list below — each result row = grid `38px 1fr auto`: inline tier badge / name (`--text-base`) + mono category eyebrow / trailing evidence chip; section headers (mono `--text-xs`, `--ink-faint`) group results by type (remedies · outcomes · briefs · interventions). Empty state: `--ink-faint` "no matches — try a compound, an outcome, or a symptom".
- **Tokens:** `--surface`, `--base`, `--sunken`, `--line-strong`, `--r-lg`, tier badge + chip tokens, `--font-body`/`--font-mono`, `--ring`, `--dur-base`/`--ease-settle`.
- **States:** **default** (recent/suggested on open); **typing** (live filtered, ≤80ms debounce); **active row** (keyboard ↑↓ → `background: var(--sunken)`, `aria-selected`); **no-results**; **loading** (only if index is async — show three breathing dots, reuse Ask loader). Opening focuses the input; `Esc`/scrim-click/route-change closes; focus returns to trigger.
- **Responsive:** overlay full-width minus 16px gutters at ≤640px; trigger collapses to a magnifier-only 44×44 button (drop the `⌘K` hint).
- **A11y:** trigger `<button aria-haspopup="dialog">`; overlay `role="dialog" aria-modal="true"` with a labelled combobox (`role="combobox"`+`aria-expanded`), list `role="listbox"`, rows `role="option"`; full keyboard nav (↑↓ Enter Esc); focus trap while open. Result tier is text, never color-only.
- **Motion:** scrim fade + modal `opacity`+`translateY(8px→0)` on `--dur-base`/`--ease-settle`; **no** scale/bounce. Result list does not animate per-keystroke (only the container fades once on open).

---

## 3. Page layouts

Global: sticky top nav (wordmark left; section links + **search trigger** right), `background: rgba(247,245,240,.86); backdrop-filter: blur(10px); border-bottom: var(--border-hairline)`. Content max-width per page below; side padding **48px desktop → 24px at ≤640px**. Vertical rhythm between major sections **64–120px desktop**, ~48–64px mobile (use `--sp-7`…`--sp-10`). Every page fades in once (page-rise).

### 3.1 Home — `max-width: 1240px`
Hero (lowercase `--text-display` headline with an inline `--lavender-tint` highlight span; dek; CTA row) → stat row (2.7) → "four ways to read" 2×2 card grid → outcome preview `repeat(3,1fr)` → newsletter band (2-col). **Breakpoints:** card grids → auto-fill `minmax(280px,1fr)`; stat row 4→2 col @760; hero headline → ~46–56px @640; newsletter band 2→1 col @640.

### 3.2 Remedy — `max-width: 1180px` (core template; see 2.5)
Nav → header → verdict band → body grid `1fr 320px` (main: claims-vs-data → evidence summary → dosing grid `repeat(4,1fr)` → safety callout → mechanism → sources; sidebar: metadata → community bar → ask) → brief promo → footer. **Breakpoints:** body grid → 1-col @900 (sidebar static, below main); verdict 2→1 col @640; dosing grid 4→2 col @640; title 46px @640. **Dense behavior:** claims table holds at 8+ rows, sources list unbounded, single shared citation popover. **Sparse behavior:** `.nodata` cells + "what would raise the grade" panel + "not established" metadata; never looks broken.

### 3.3 Tier board — `max-width: 1240px`
Header (eyebrow, `--text-display` title, stat row, tier legend) → one section per tier S→F. Each tier section = grid `170px 1fr` (`.tier-row`): left rail (header-size tier badge + mono count) / right card grid `repeat(auto-fill, minmax(280px,1fr))`. S-tier empty state = dashed-border panel with serif copy (intentional "nothing qualifies"). **Breakpoints:** `.tier-row` → 1-col @760 (rail stacks above cards); stat row 4→2 col @760. **Dense behavior:** 30+ cards hold; rhythm from the rail + wrapping grid. An F card beside an S card is fine — spectrum is desaturated; do not add extra warning styling per tier.

### 3.4 Outcome — `max-width: 1180px`
Header (breadcrumb, eyebrow, `--text-3xl` goal title, dek) → goal switcher (chip filter row, active chip = lavender) → ranked list (2.6 ranked rows, "best evidence first") → "what we're measuring" definition panel (`200px 1fr`) → "other goals" `repeat(3,1fr)`. **Breakpoints:** ranked-row grid keeps structure, note wraps; definition panel → 1-col @640; other-goals grid auto-fill.

### 3.5 Methodology — `max-width: 1180px`
Header + stat row → editorial-principle band (`--lavender-tint`, `--r-xl`, large serif) → **tier rubric**: one row per tier `150px 1fr` (badge + rail / description + gate chips + examples); F row gets the `.sev`-style tinted emphasis → numbered policy sections grid `repeat(2,1fr)` (top-bordered) → corrections strip. **Breakpoints:** rubric rows → 1-col @640; policy grid 2→1 col @760.

### 3.6 Brief — `max-width: 760px` header / **`max-width: 680px` article measure**
Long-form narrative. Fixed top scroll-progress bar (2px, `--lavender` fill, width = scroll %). Article header (mono meta, `--text-3xl` lowercase title, serif-italic standfirst, byline w/ inline grade badge). Body: serif `--text-md` paragraphs (`line-height:1.68`), drop-cap on first paragraph, serif `--text-xl` subheads, `--lavender-ink` footnote refs, pull-quote (serif italic, no border), inline data callout, numbered sources. "Read next" card + footer. **Breakpoints:** single column throughout; padding 32px → tighter on phone; title scales down. This is the one page where a more story-driven rhythm is allowed.

### 3.7 Search results (full page, optional `/search?q=`)
A non-modal fallback for the 2.13 palette (deep links, no-JS, SEO). `max-width: 820px`. Header (mono eyebrow "search", `--text-2xl` query echo) → grouped result sections (remedies · outcomes · interventions · briefs), each a list of 2.13 result rows → empty state with suggested popular queries. Server-rendered so query pages are crawlable. **Breakpoints:** rows reflow like 2.13; single column throughout.

---

## 4. Motion system (consolidated)

| Animation | Trigger | Duration | Easing | Calm-constraint rule |
|---|---|---|---|---|
| Page rise | Page load (once) | `--dur-slow` | `--ease-settle` | opacity + `translateY(10px→0)` only; once, never on scroll |
| Card hover lift | Pointer hover | `--dur-base` | `--ease-settle` | `translateY(-3px)` + `--shadow-lift`; no scale |
| Row hover tint | Pointer hover | `--dur-fast` | `--ease-soft` | background→`--sunken` only |
| Chip / link hover | Pointer hover | `--dur-fast` | `--ease-soft` | border or color only |
| Strike-to-resolve | Load, staggered timer (~80ms/row) | strike `--dur-slow`, data `--dur-base` | `--ease-settle` | single-shot; inline-style+timer (not IO/scroll/`.in`); 2.5s force-reveal fallback |
| Citation popover | Open | `--dur-base` | `--ease-settle` | **fade only** — no scale/translate (clamp needs stable geometry) |
| Search palette | Open | `--dur-base` | `--ease-settle` | scrim fade + modal `translateY(8px→0)`; no scale; list doesn't animate per-keystroke |
| CTA nudge | Pointer hover | `--dur-fast` | `--ease-soft` | `translateX(2px)` max |
| Ask "thinking" dots | Async pending | `--dur-ambient` loop | `--ease-soft` | the ONLY looping animation; opacity `.3↔1`, 0.35s stagger |
| Scroll-progress bar (brief) | Scroll position | 80ms (linear) | linear | width only; passive scroll read |
| Community bar fill | Load (once, optional) | `--dur-slow` | `--ease-settle` | width `0→N%` once; _developer's discretion_ |

**Reduced motion (required):** `@media (prefers-reduced-motion: reduce)` disables all `animation`, forces reveal/strike/progress to final state instantly, and sets `scroll-behavior:auto`. No information may be gated behind motion.

**Never animate:** tier colors or any text color; table row layout/height; anything scroll-jacked, parallaxed, or scroll-scrubbed (except the passive progress bar width); spring/overshoot/bounce of any kind; hero video/autoplay; the citation popover's size/position (fade only); looping motion anywhere except the thinking dots.

---

## 5. Implementation guardrails (Claude Code)

1. **Tokens only.** Every color, size, radius, shadow, duration, and easing comes from §1 named tokens. No hardcoded hex, px font sizes, or raw `cubic-bezier()` in components. (Two literal exceptions, both non-color: the paywall `mask-image` gradient and the popover `max-height:calc(100vh - 24px)`.)
2. **Tier colors are final.** The S–F triplets are contrast-checked against `--base`. Do **not** re-derive, brighten, saturate, or "improve" them, and do not widen the B/C hue gap. Use `-ink` for text, solid for fills/glyphs, `-tint` for badge washes.
3. **Accent text rule.** Never set `--lavender` or `--sage` (base hue) as text/icon color — they fail AA. Use `--lavender-ink` / `--sage-ink`. Base hues are fills/borders/bars only.
4. **Tier badge centering is mandatory.** Always `line-height:1` + `transform:translateY(var(--grade-optical-shift))` on the glyph; always pair the letter with a text grade label/`aria-label`.
5. **Claims table mobile = labelled-pair stack (FIXED).** Single column + "claimed"/"studies show" mono eyebrows at ≤640px. Not tabs, not accordion, not horizontal scroll.
6. **Reveal engine = inline-style + timer (FIXED).** Content visible by default; JS hides-then-reveals via inline styles on a staggered timer with a rAF-retry until rows exist and a 2.5s unconditional force-reveal. **Do not** use IntersectionObserver, scroll listeners, or a CSS `.in`/`.js-reveal` class for the reveal — they are unreliable here and can strand the evidence column hidden. Strike = real `.strikeline` element, not `::after`.
7. **Citation popover (FIXED).** Single shared popover; clamp position against the **measured** height (not a constant); re-clamp on rAF+timeout; `max-height`+`overflow:auto` backstop; **fade-only** animation. One open at a time.
8. **Safety callout = two severities only** (`.sev-caution` tier-c, `.sev-serious` tier-f). No red, no flashing, no new severities.
9. **Focus + tap targets.** `:focus-visible { box-shadow: var(--ring) }` on every control; min 44×44px hit area.
10. **Empty data is content.** Render `.nodata` markers and "not established"/"unproven" values — never leave a blank cell or hide a row.
11. **Headings are lowercase by authored text** (not `text-transform`), except `--text-xs` mono labels which are UPPERCASE with `--tracking-label`.
12. **Breakpoints are fixed:** 900px (sidebar stack), 760px (tier rail stack + stat row 2-col), 640px (phone). Use `max-width` queries.
13. **Search = command palette + crawlable fallback (FIXED).** The `⌘K`/`/` palette (2.13) is the primary surface; a server-rendered `/search?q=` page (3.7) must also exist for deep links, no-JS, and SEO. Both read the same index. Index is built from structured content at build time, not hand-maintained.

_Anything not specified here (intermediate badge sizes, optional count-up/fill animations, exact card copy) is **developer's discretion** within these tokens._
