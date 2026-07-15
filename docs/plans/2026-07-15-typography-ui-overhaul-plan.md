# Typography & UI overhaul — diagnosis and implementation plan (v4 proposal)

**Date:** 2026-07-15 · **Status:** `[HUMAN-GATE]` — owner requested this analysis; the
token-value changes in Phases A/C/D amend DESIGN_SYSTEM.md and need owner ratification.
Phase B is bug-fixing (no gate).

**Owner's brief:** type is too thin, hard to read, light where it shouldn't be, kerning
hurts readability; UI reads AI-generated, unrefined, not responsive/mobile-friendly.
Benchmark against work.co, instrument.com, clay.global, metalab.com, akqa.com, bynd.com,
bighuman.com and plan like a seasoned agency design lead.

**Method:** production CSS of all seven agency sites was fetched and read (real values,
not vibes); Somnary was audited at token level (global.css / DESIGN_SYSTEM v3) and
rendered level (desktop + 390px screenshots of home, /tiers, /r/melatonin, vs production).

---

## 1 · What the seven agencies actually do (extracted from shipped CSS)

| Principle | Evidence |
|---|---|
| **Tracking scales with size — tight only at poster sizes** | Instrument: −.02/−.03em at 31–60px, −.06/−.07em only at 96–160px. Clay: −.01em small → −.05em at 92px. AKQA: −1px at 38px, −1.4px at 50px. Body is neutral or **positive** (Instrument body +.01 to +.03em). |
| **Body text is never small, never thin** | Big Human 19px/1.4 (never shrinks on mobile). Clay 18px at weight **500**. AKQA 16/26. W&Co 16px Garamond. Nobody's body < 16px; several run 500 as the body weight. |
| **Weight contrast is decisive, not mid-range** | Clay: 500 body / 740 display — one family, two heavy cuts. MetaLab: 400 grotesque body vs ultralight-240 serif display. Extremes, never everything at 400–700 mush. |
| **Display line-height 1.0–1.2, body 1.35–1.6** | W&Co down to 0.88; MetaLab 114–120%; AKQA h1 50/50 solid. |
| **Two type voices (or one with real contrast)** | Grotesk + serif at W&Co (Garamond body!), AKQA (Goudy body!), MetaLab (Eiko display), Beyond (condensed serif display + mono kicker). Clay/Big Human: one face, disciplined. |
| **One accent color, maximum; tinted neutrals** | W&Co red, MetaLab #584DFF, Big Human #0060F0, Beyond #EB461F on sage `#E6EAE6` / carbon `#171D1D`. Ink is near-black (#0F0F10, #171D1D), never #000-on-#FFF harshness — hierarchy via gray steps, not dimming+shrinking at once. |
| **Radius is brand DNA, applied absolutely** | 0 (W&Co), 0–4px (Beyond), 4–8px (Clay), or full-pill-everything (Big Human). **Nobody mixes 5–6 radii.** |
| **One owned easing / one signature micro-interaction** | Clay `cubic-bezier(.16,1,.3,1)` on 1s+ transforms; MetaLab's .7s two-direction underline wipe; AKQA's 750ms–1.5s glides. Uniform tempo per site. |
| **Mobile-first, 4–5 real breakpoints, big whitespace** | Everyone: min-width stacks (479/768/1024/1440-ish), display drops 35–50% to mobile, body never shrinks, section gutters 70–180px. |
| **Optical, not mathematical** | Clay's `margin-left:-3px` on big headings; W&Co per-size absolute tracking; Instrument's per-breakpoint tracking token swaps. "Expensive" = compensation you only see in the CSS. |

---

## 2 · Diagnosis — why Somnary reads thin, cramped, and AI-generated

### 2.1 Typography (the kerning/thin/light complaints, root-caused)

- **T1 · Size-blind negative tracking.** `--tracking-tight:-0.04em` is applied at 32px
  tile titles; h3 gets −0.025em at 19–21px; h2 keeps −0.065em across its whole
  38→66px clamp range. Benchmarks use ~−0.01em at those sizes. At 32px, −0.04em also
  eats **word spaces** — this is why "I'm considering melatonin" visually merges into
  "I'mconsidering." This is the single biggest legibility defect on the site.
- **T2 · Secondary text is triple-dimmed.** Deks, nav, footer, card support run
  13–14px AND weight 400 AND `--muted` #5C574F simultaneously. The agencies change
  *one* dimension at a time (gray step OR size step). Result: everything that isn't a
  headline looks faint. The hero lede — the first line anyone reads — is muted gray.
- **T3 · No weight structure between 400 and 700.** Body/UI all sit at 400 in a
  variable font that renders light on the warm ground; headlines all 700. There is no
  450–550 "confident body/UI" register, which is exactly where Clay (500), W&Co (500
  display) and Instrument (500 headlines) live.
- **T4 · Buttons/nav/labels are 12–13px** with +0.09em tracking — utility-caption
  styling used for primary navigation and CTAs. Benchmarks: nav/CTAs 14–16px, 500.
- **T5 · Display clamp floors too high on mobile** (`clamp(64px…)` → 52–64px at
  390px) while everything else stays small — the scale is top-heavy on phones.
- **T6 · No optical compensation anywhere** — no left-edge compensation on big
  headings, no `text-wrap: balance`, no per-size tracking tuning. The craft signals
  are absent.

### 2.2 The "AI-generated" look (calibrated honestly)

Warm-cream ground (#FCFAF2) + high-contrast tight-tracked 700 display + a
terracotta-family accent (oxblood) **is the single most common AI-default aesthetic
of 2026**. The palette hue itself was owner-ratified (v3), but the *execution
defaults* around it are what make it read as generated:

- **Six border radii** (3/7/11/16/24/999) mixed across one screen — no radius identity.
- **Radial-gradient page wash + `background-attachment: fixed`** — an AI tell, and a
  scroll-jank liability on mobile Safari.
- **Generic hover grammar** — translateY lifts + soft shadows on everything, no owned
  easing, no signature interaction.
- **Soft rounded cards + pill buttons + icon-in-tinted-chip** — the template stack.
- **A single flat wash of one paper tone** page after page — benchmarks alternate
  ground slabs (light/dark sections) to create rhythm.

### 2.3 Responsive — measured, not impressionistic

At a 390px viewport, production `somnary.vercel.app` lays out at **610px scroll
width (56% horizontal overflow)** — a control site captured identically renders
perfectly. Culprits, measured:

- **R1 · No mobile navigation exists.** `Nav.astro`'s `ul.links` has a 523px
  min-content width and no collapse/hamburger at any breakpoint (DESIGN_SYSTEM §7
  says "≤980px: nav links hidden" — never implemented, and hiding without a menu
  would be worse). The nav alone forces the 610px page width; every other element
  then clips at the viewport edge — text cut mid-glyph on the hero, tiles, spotlight.
- **R2 · HeroAnswerCard renders 433px wide** at 390 (internal min-content not clamped).
- **R3 · Popular-check pill strip runs to 706px** and participates in page width.
- **R4 · Breakpoints are ad-hoc per file** (980 / 760 / 640, desktop-first,
  inconsistently applied across 37 of 53 components) — there is no breakpoint token
  system, so every new component reinvents (or forgets) mobile.
- **R5 · No CI gate catches any of this** — the repo gates citations, tokens,
  crawlability… but a 56% overflow on phones ships silently.

### 2.4 Reading measure

Remedy-page prose and claim rows run near the full `--page` (1460px) shell — far past
comfortable measure. Benchmarks pin prose to 480–850px (AKQA 700px; Instrument 80ch)
inside wide shells.

---

## 3 · The plan

Phasing is ordered by user harm: mobile is *broken* (B), typography is *hurting
reading* (A), then craft (C), then identity options (D). A and B can run in parallel
(different files).

### Phase A — Typography system v4 `[HUMAN-GATE: token values]`

Rewrite DESIGN_SYSTEM §2 + `global.css` type tokens. Instrument Sans stays (D3-adjacent,
owner-chosen); the *settings* change:

1. **Tracking ramp keyed to rendered size** (kill the one-size `--tracking-tight`):
   - ≥96px: −0.045em · 64–96px: −0.035em · 40–64px: −0.022em · 24–40px: −0.012em
   - ≤21px headings: −0.005em · body/support: **0** · micro-labels: +0.08em
   - Word-space must never visually collapse: verify at 32px/700 ("I'm considering…").
2. **Weight structure** (variable axis, no new font files):
   - Body 400 → **430–460** (tune on the warm ground until color feels like set ink).
   - UI/nav/buttons/deks: **500–550**, in `--raisin` or `--ink` — never `--muted`.
   - `--muted` demoted to true metadata (dates, captions) — never ledes, never deks.
   - Display stays 700; h2 may drop to 640–660 if 700 clots at 66px (judge by eye).
3. **Size floors:** nav/buttons 14px→**15px**; support 13–14px→**14px floor**; body
   16px (17px on remedy long-form); lede 18–23px at 500 in `--raisin`.
4. **Mobile display ramp:** h1 40–44px at 390px (not 52–64); h2 28–32px; honest
   per-breakpoint steps instead of vw-clamps that balloon.
5. **Line-heights:** body 1.6 (keep — recent owner decision) for long-form; **UI/card
   text 1.45–1.5**; h2 1.04–1.08 (multi-line h2 at 1.00 currently clots).
6. **Craft details:** `text-wrap: balance` on headlines; small negative left optical
   compensation on display headings; `font-kerning: normal`; keep `tabular-nums` for data.
7. **Prose measure:** long-form content column capped at **~70ch (~720px)**; claim/data
   tables may stay wide inside the 1460px shell.

*Acceptance:* side-by-side before/after screenshots of home, /tiers, /r/melatonin at
390/768/1440; "I'm considering melatonin" tile title shows unambiguous word gaps at
every size; zero body-role text below 14px/AA; owner signs the v4 type table.

### Phase B — Responsive rebuild (bug fix, no gate) — **do first or parallel**

1. **Mobile navigation:** ≤768px collapse links into a disclosure menu (wordmark +
   search + hamburger, 48px touch targets, focus-trapped, `aria-expanded`, ESC-closes,
   works without JS as an anchor-jump fallback or `<details>` pattern).
2. **Kill the overflow class of bugs:** `min-width:0` / `max-width:100%` sweep on grid
   children; pill strip contained (`overflow-x:auto` on a properly clamped parent);
   HeroAnswerCard fluid below 480px. Verify `document.scrollingElement.scrollWidth ===
   innerWidth` at 360/390/414 on every route.
3. **Breakpoint tokens:** standardize **480 / 768 / 1024 / 1440** (mobile-first
   min-width) as named tokens in DESIGN_SYSTEM §7; migrate the ad-hoc 980/760/640
   queries file-by-file as components are touched.
4. **CI responsive gate** (fits the repo's gate culture): headless-Chrome script
   (`scripts/check-responsive.mjs`) asserting no horizontal overflow at 390px across
   all routes in the sitemap; wire into `prebuild` + ci.yml. This makes R1-class
   regressions impossible to ship again.
5. Remove `background-attachment: fixed` (mobile Safari jank) regardless of Phase C.

*Acceptance:* overflow gate green on all routes; nav usable one-handed on a 390px
viewport; Lighthouse mobile usability clean; real-device (iOS Safari) spot check.

### Phase C — Craft pass: de-templating the surface `[HUMAN-GATE: token values]`

1. **Radius discipline:** collapse six radii to **two: 4px (cards, tables, inputs,
   buttons) + 999px (chips/pills only)**. Heroes lose the 24px billboard rounding.
   This single change removes most of the "soft AI card" feel.
2. **Ground rhythm:** flatten the radial wash to plain `--paper` (or a ≤2% linear
   tint); introduce **one dark "carbon" slab register** (footer + optional hero band,
   `#171512` ground / paper text) so pages alternate light–dark like the benchmarks
   instead of one continuous cream wash. Vermilion/oxblood rules from §10 unchanged.
3. **One owned interaction:** replace ubiquitous translateY-lift hovers with a single
   signature — recommended: a **1px underline that draws in from the left** on links
   and nav (MetaLab-style, but ours: oxblood, 160ms `--ease-settle`), and border-color
   deepen on cards. One easing curve site-wide; delete per-component hover variants.
4. **Section spacing:** vertical gutters up a step (96→128px desktop between major
   sections); the benchmarks' generosity here is half of what reads as "expensive."
5. **Keep and feature what is already ours:** the linocut remedy icons + the S–F grade
   system are genuinely distinctive (no benchmark has anything like an evidence-grade
   identity). The craft pass should make **the grade badge and the citation apparatus**
   the visual signature — bolder badge typography, tighter integration of grade →
   verdict → "evidence, not safety" line — rather than adding any new decorative device.

*Acceptance:* a one-screen "radius/ground/motion" spec in DESIGN_SYSTEM v4; before/after
of home + remedy page; design-guardian pass; no wellness-cliché regressions (§10).

### Phase D — Identity options `[HUMAN-GATE: each a separate owner decision]`

Presented as options, not defaults — each is reversible and independently decidable:

- **D-1 · Second reading voice (recommended risk).** Set **long-form evidence prose**
  (remedy narrative, methodology, audience pages — not UI) in a text serif, keeping
  Instrument Sans for all UI/display/data. Precedent: AKQA (Goudy body) and W&Co
  (Garamond body) — the "quiet library gravitas" move, and exactly right for a
  reference wiki about evidence. `@fontsource/newsreader` is already in the repo
  (OG images). Trial: Newsreader 17px/1.65 on /r/melatonin behind a screenshot A/B
  for owner review. Cost: ~30–60KB font subset. This is the one aesthetic risk worth
  taking; it cannot be mistaken for the AI-default look.
- **D-2 · Condensed utility voice.** Instrument Sans VF ships a `wdth` axis (75–100);
  the full variable file enables Instrument-Agency-style condensed micro-labels
  (`wdth` 80, +0.08em) for kickers/table headers — one family, second voice, zero new
  fonts. Verify the @fontsource-variable "full" variant includes `wdth` before committing.
- **D-3 · Paper tone.** Keep the warm family but pull yellow: `#FCFAF2` → a calmer
  `#FAF9F5`-region tone, re-run the §8 contrast table. Optional; the carbon slabs in
  C-2 matter more than the exact cream.
- **D-4 · Not proposed:** changing oxblood, the wordmark, the crescent disc, grade
  colors, or the safety register — all locked or working well.

### Sequencing & mechanics

1. **Order:** B (mobile, unblocks real users) → A (type v4) → C (craft) → D (options
   trialled during C). B can start immediately; A/C/D need the owner to ratify the v4
   token tables (this document is the gate artifact).
2. **Process mirrors the v2→v3 reskin:** DESIGN_SYSTEM.md v4 rewritten first (token
   *names* stable wherever possible; new: tracking ramp, breakpoint tokens, radius
   collapse), then `global.css` + `tailwind.config.mjs`, then component sweep, then
   token-linter update (new scale values, flag retired radii/tracking).
3. **Coordination:** branch `design-hero-carousel` is in flight (uncommitted WIP as of
   this writing) — land or park it before the Phase A/C sweeps to avoid re-skinning a
   moving target. Phase B's Nav/overflow fixes touch different files and can proceed.
4. **Stale-doc fix to ride along:** DESIGN_SYSTEM §"Brand casing" still specifies the
   trailing-period `Somnary.` wordmark; CLAUDE.md D3 (amended 2026-07-08) dropped the
   period. Sync in the v4 rewrite.
5. **QA matrix per phase:** 360/390/768/1024/1440 × {home, tiers, r/melatonin,
   outcome, label-checker, compare, safety, one audience page} + iOS Safari device
   check + reduced-motion + keyboard pass.

### What this does NOT touch

Grades and grading UX semantics, safety register (vermilion), citation apparatus,
D1–D4 locked decisions, content, and the accent-scarcity rule (§10 one-oxblood-CTA
budget) — which is already agency-grade discipline and stays.
