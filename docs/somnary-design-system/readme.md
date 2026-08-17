# Somnary design system

Somnary (wordmark "Somnary" — capitalised, no trailing period; a locked decision) is an independent reference that tells people whether a natural sleep remedy actually works, and whether a specific product actually delivers it. No supplement company pays Somnary; no brand can influence a score. Every claim links to the study behind it.

**The reader:** an ordinary adult, often on a phone late at night, holding a supplement bottle, no scientific training. They want a clear answer they can trust, in language they don't have to decode.

**Design position: "the observatory"** — a quiet, precise, warmly-lit instrument for looking at evidence. Not a clinic (cold), not a wellness brand (vague), not a biohacker terminal (dark neon). Calm verification, never persuasion.

**Sources:** ported from the attached read-only codebase `Somnary Design System/` (mounted local folder, Aug 2026) plus the binding design charter `uploads/Somnary UI UX Redesign Rules.md`, kept at the root as `RULES.md` — read it in full before any design work. No Figma or font binaries were provided; the original system was built from a written brief plus amendments.

## The central structure — two questions, never merged

1. **Does this ingredient work?** Four buckets, each naming sleep: *Helps most people sleep / May help sleep a little / Not properly tested for sleep / Tested — doesn't seem to help sleep*. The third is a verdict on the research, not the remedy (untested ≠ failed); the fourth means the research says no — it requires papers that measured sleep and found no effect. **Safety never moves a bucket, in either direction**: a bucket describes only what the research shows about effectiveness, and the serious-concern flag carries the warning (kava: 0 sleep papers + serious flag = "Not properly tested for sleep", never "Tested — doesn't seem to help"). A bucket always displays with one plain explanatory sentence beneath it — never a legend elsewhere. Colour-coded AND shape-coded (see below).
2. **Does this product give you what was studied?** Scored on visible factual criteria: dose matches studies · third-party tested · full label disclosure (no proprietary blends) · the form that was tested.

A product is only "worth buying" when BOTH are strong. The paired verdict component shows both answers together; its mismatch states (good product / weak ingredient, and vice versa) are the most common and most useful results.

### Bucket shape coding (colour is never the only signal)
- Helps most people sleep — **solid disc**, `--bucket-works`
- May help sleep a little — **half-filled disc** (bottom half), `--bucket-maybe`
- Not properly tested for sleep — **empty ring**, `--bucket-unknown`
- Tested — doesn't seem to help sleep — **ring with a diagonal strike**, `--bucket-avoid`

Alternative bucket naming (set in type for comparison, see `guidelines/bucket-naming.html`): "Strong evidence / Some evidence / Not enough evidence / Avoid."

The remedy template's "Why is this so popular?" section (traditional use · plausible mechanism · what people report) is the honest home for widely-used-but-barely-tested remedies. It is firewalled: labelled as not evidence, stated to never move the grade, and it links to the methodology's "Why popularity isn't evidence" section (sleep is placebo-responsive; insomnia is cyclical, so whatever you take on the worst night gets the credit; recalled sleep quality is unreliable — together they manufacture consensus around inert things).

## Content fundamentals

Voice: a well-informed friend who happens to be a pharmacist, across a kitchen table. Critical rules:

- Plain words, short sentences, specific claims. Never performs rigor or congratulates itself on integrity. No manifesto, no slogans, no independence counters.
- Technical vocabulary (meta-analysis, randomised controlled trial, effect size, bioavailability) NEVER appears in body copy — only inside "See the study" popovers and the methodology page.
- Numbers in everyday terms: "falls asleep about 7 minutes faster, on average." Acronyms always spelled out. Dates written for humans — "14 July 2026", never ISO.
- Headings are the questions people actually ask: "Does it work?", "Is it safe with my medications?"
- **Sentence case everywhere** — buttons ("Look it up"), labels, nav, headings. No all-caps, no letterspaced eyebrows. The brand is "Somnary", capitalised like any proper noun. No emoji, no exclamation marks.
- **Remedy names are sentence case** — "Melatonin", "Valerian", "Tart cherry" — EXCEPT where scientific convention fixes the form: L-theanine, 5-HTP, GABA, CBD, CBN, CBT-I, vitamin D. Getting these wrong reads as an error to exactly the reader we want.
- Second person for guidance ("check the label"), plain declaratives for findings ("the studied dose was 3 mg; this product contains 10 mg").
- Every claim carries a "See the study" chip. Uncertainty is stated flatly: "not properly tested for sleep" — a gap in the studies, never a verdict on the remedy.
- Research sources are called **"papers"** — plain, and accurate across trials, reviews, and observational studies alike ("sources cited" was bureaucratic; "studies" would be wrong for reviews). Counts always carry the noun: "5 of 14 papers", never bare "5 of 14".
- **Study types in plain words**: each paper in a remedy's list is labelled "trial", "review of several studies", or "observational study" — never "RCT" or "cohort" in the interface (technical names live in sources lists and the methodology page). Observational studies count and can support the middle buckets, but cannot alone reach the top bucket — that needs trials (methodology: correlation vs cause, and sleepers differ in dozens of ways).
- The verify tier is phrased as **"results we could verify"** / "published results we could verify" — it says what was checked (the result) and who checked (us). Never "reported enough to check".
- Papers that don't measure sleep are always labelled exactly "didn't measure sleep" — never anything implying weak evidence.

## Visual foundations

- **Colour — colour means data:** warm paper `#F6F2E9` with warm near-black ink `#1C1B22` (day); deep warm near-black `#17151E` with amber-shifted text `#E7DECB` and lowered contrast (dusk — a designed low-light reading theme, not an inverted afterthought). **`--evidence` (ink blue `#2C3E63` / `#8FA5CE` at dusk — the colour of printed reference) is reserved for the evidence bar and its key, and nothing else.** All interface colour — buttons, links, focus rings, active states — is `--ink`. There is no `--accent` token: anything reaching for colour must choose `--evidence` (data) or `--ink` (interface). The evidence bar is the only saturated element on a page — that is the signature. Muted sage supports the criteria check marks. Four desaturated colourblind-safe bucket colours, moss → ochre → warm grey → clay — `--bucket-unknown` is a warm grey, deliberately distinct from evidence blue so a bucket glyph is never mistaken for data. All bucket inks pass WCAG AA on their page surface. Banned: healthcare blue (evidence ink blue is reserved, desaturated, and data-only), neon, decorative gradients, cream-and-terracotta defaults.
- **Type — ONE FAMILY: Onest.** No display/body split, no mono, no signature device. Weight and size carry the whole hierarchy, assigned deliberately: page titles & display stats 550 · section headings 650 · card titles, labels, buttons, chips, wordmark 600 · interactive/verdict lines 500 · metadata & captions 450 · body 400 (tokens `--weight-title/heading/strong/ui/meta/body`). **All figures — prose, identifiers (PMID, NCT, DOI), tables — are tabular lining figures** (`font-variant-numeric: tabular-nums`); Onest's cover every case, so no mono exists in the system. Type is excellent and quiet; the character comes from the palette, the spacing discipline, and the evidence visuals. Body 16px minimum; small labels are `--text-sm` 600, sentence case, no tracking. There is ONE font token, `--font-sans` — `--font-display` was removed deliberately so a display/body split can't silently return. The scale is shown working on a dense remedy header in `guidelines/type-dense-header.html`.
- **Surfaces:** flat warm paper; cards are `--surface-card` with `--border-w` `--border-hairline` and `--shadow-card`, radius `--radius-md`. No gradients anywhere. Dusk chrome dims (borders darken, shadows deepen).
- **Sizing discipline:** every interactive element uses a control-height token (`--control-sm/md/lg/xl` = 36/44/48/56); all spacing uses `--space-*`; the only border width is `--border-w`. **Nested-radii rule:** equal padding all round, inner radius = outer radius − padding (e.g. `--radius-lg` outer + `--space-1` padding → `--radius-md` inner). The search field is the reference implementation.
- **Imagery:** no photography, no illustration. Product/brand images mount in the `BrandMark` slot, whose placeholder is a first-class typographic mark (brand initial on a bucket-tinted ground) — most products never get an image, so the placeholder is the common case. The only other imagery is the research filter (below).
- **Motion:** calm, 150–250ms, `--ease-settle`. Hover: background shifts to `--surface-sunken` or border to `--border-strong` (no lifts, no scale). One choreographed motif: the label-versus-studies reveal — the bottle's claim renders first, a line draws through it (~450ms), the studies' finding fades in beneath with a "See the study" chip. `prefers-reduced-motion` collapses all durations to 1ms.
- **Focus:** always visible — `--focus-ring` (2px ink) with 2px offset, both themes.
- **Layout:** mobile-first, single column, `--page-max` 720px; generous vertical rhythm; hit targets ≥ `--control-md`.
- **Links:** ink, underlined on hover, `text-underline-offset: 3px`.

## The research filter (signature element — nested bar)

The research corpus is sparse (16 of 31 remedies have only one or two verifiable studies), so sparse is the normal case, not the exception. The visual is **one nested bar** — it stays legible when data is sparse: a short solid segment on a long track reads as a deliberate statement, where a row of marks looks unfinished.

One track, three lengths (cited ≥ sleep ≥ verifiable), variant `three` (ships):
- **full track** = all papers cited — muted, `--surface-sunken` with a hairline border
- **middle segment** = those that measured a sleep outcome — `--evidence` at 35%
- each segment boundary is a transparent hairline gap — the surface behind shows through — so the three regions are separated by structure, not just tone (legible at the 6px thumb bar)
- **inner segment** = those with results we could verify — solid `--evidence`. The third tier is the integrity promise made visible.

Variant `two` (supported alternative, compared in `components/evidence/filter-variants.card.html`): the bar carries cited / measured sleep only; the verify count moves to an expandable line beneath at hero/share ("How many could we verify?" toggles Show/Hide the answer) and stays in the thumb caption, so the same remedy reports the same totals everywhere.

**Copy is authored independently per size — every string stands alone, the noun always present:**
- hero/share: *"Of 14 papers, 9 measured sleep, and 5 published results we could verify."* (share adds the remedy via `subject`: "Melatonin: of 14 papers…")
- thumb (card grids, no surrounding sentence) carries BOTH steps so the sleep filter is never skipped: *"9 of 14 papers measured sleep; 5 we could verify"*
- none measured: *"5 papers on this remedy — none measured sleep."* · none verifiable: *"9 of 14 papers measured sleep — none we could verify"*

Key beneath (hero/share): "results we could verify" / "measured sleep" / **"didn't measure sleep"** (exact wording, never anything implying weak evidence).

**There is no scatter.** Direction is carried in one plain sentence (`helped` prop): *"Of the 5 results we could verify, all 5 found an improvement."*

Designed edge cases: 0 papers ("No published papers yet."); nothing measured sleep (kava: 5 cited, 0 measured — track only); everything measured sleep (segments fill the track). Sizes: hero (12px bar), thumb (6px, no key, short caption), share (20px).

**A serious-concern safety flag always outranks the visual** — `safetyFlag` renders as an amber strip above everything, at every size including thumbnails.

Implemented in `components/evidence/StudyField.jsx`.

## Iconography

No icon font, no icon set. The system's only glyphs are the four bucket shapes (`BucketShape`), check/dash marks in the criteria list (inline SVG), and the outbound-link arrow `↗` (unicode). Do not introduce third-party icons; any new glyph must be a simple geometric inline SVG in `currentColor`.

Wordmark: "Somnary" set in Onest 600 — capitalised, no trailing period. The mark is the letterform: a capital S in Onest 600, ink on warm paper, in the system's rounded square — no motif; the discipline is the identity. Day and dusk variants; drawn to read at 16px first (glyph ≈72% of the tile). All mark/wordmark SVGs are OUTLINED PATHS (extracted from Onest 600), never live <text> — SVG favicons render without the page's fonts and would silently fall back to Arial. Assets: `assets/wordmark.svg`, `assets/favicon.svg`, `assets/favicon-dusk.svg`, `assets/touch-icon.svg` (180px).

## Index

- `RULES.md` — the binding design charter; every rule settled deliberately, flag conflicts rather than silently comply
- `templates/` — nine page templates for consuming projects (Home, Remedies, Remedy, Products list, Product, Problem, How we grade, Safety, Brand); each carries its kit's rule comments and notes the rules it enforces
- `styles.css` — global entry; imports everything under `tokens/`
- `tokens/` — colors (day + `[data-theme="dusk"]`), typography, spacing (incl. control heights + nested-radii rule), motion, fonts
- `guidelines/` — foundation specimen cards (palettes, buckets, type scale & weights, dense header, numbers & identifiers, motion, naming A/B)
- `assets/` — wordmark.svg, favicon.svg, favicon-dusk.svg
- `components/verdicts/` — BucketShape, BucketBadge, ProductScoreBadge, PairedVerdict
- `components/evidence/` — StudyField (research-filter bar; copy variants compared in filter-variants.card.html), StudyChip (+ popover), LabelVsStudies, PlainStat
- `components/cards/` — BrandMark, RemedyCard, ProductCard, ProductListRow (+ VerdictPill — the dense product-list row shared by product lists, the products index, and brand pages), BrandResultRow, WhereToBuyRow
- `components/chrome/` — Wordmark, SearchField, SafetyCallout, LastChecked, DisclaimerBand
- `ui_kits/site/` — home + remedy page, both themes
- `SKILL.md` — agent skill entry point
- `ds-loader.js` — runtime loader used by card/kit HTMLs: prefers the compiled `_ds_bundle.js`, else transpiles the `.jsx` sources in-browser (Babel react preset pinned to classic runtime — automatic runtime breaks non-module scripts)
- each component directory has a `demo.jsx` (the card's demo module) — not a public component

### Intentional additions
- `BucketShape` — the shared shape glyph used by badges, cards, and rows (keeps shape coding identical everywhere).
- `BrandMark` — the image slot whose typographic placeholder is the common case (amendment 5).
- `Wordmark` — text-set brand mark (new brand; no logo file existed to copy).

### Rules for working in these files
- **Legibility floor:** no text below 13px; nothing below 4.5:1 against its own surface, checked per surface (page, raised card, sunken — both themes). `--text-faint` is reserved for genuinely peripheral text (timestamps, demo annotations, decorative chevrons); anything that carries meaning — data labels, key labels, captions, criteria — sits at `--text-muted` or above.
- **Never invent a number in a design file.** If a value is missing, mark it clearly as placeholder or ask — evidence counts, doses, dates, prices all come from the audit or stay visibly fake.
- **Never write a health claim into a design file.** Demo safety text is obvious placeholder wording until sourced.

### Handoff constraints
- **Inline styles can't express `:focus-visible`, `:hover`, or media queries.** The components style everything inline, so: focus is one global rule in `styles.css` (travels with the tokens — do NOT re-implement per component); hover is React state in the demos; responsive switches use `matchMedia`. At implementation, move these to real CSS pseudo-classes and media queries — the inline values are the spec, not the mechanism.
- **Border contrast is deliberate:** `--border-hairline`/`--border-strong` are decoration (1.15–1.7:1) and stay that way. Where a border is a control's SOLE boundary — the search field, outline buttons — use `--border-input` (3:1+ non-text contrast per WCAG 1.4.11: day #8A8370, dusk #746D8B). Anything with a filled background or text label doesn't need it.
- **Hit targets:** `--control-sm` (36px) is visual height only; the real hit area of any interactive element is never below `--control-md` (44px).
- **`--sage` is a graphic token** (check strokes) and fails AA as text in day; sage-coloured text uses `--sage-text`.

### Standing content policies
- **Non-sugar sweeteners are always "Worth knowing"** in any daily-use product — stated policy, never per-product judgement; basis [placeholder — WHO 2023 guideline on non-sugar sweeteners, pending verification]; note carries the daily-use framing ("anything in it, you're having daily"). Qualifying products show the factual "Contains artificial sweeteners" chip in the header dietary row and are filterable via "No artificial sweeteners" on product lists. The boundary holds everywhere: a flag never says "bad"/"avoid" without a documented concern — the verdict follows the evidence in both directions.

### Open questions for the build (do not copy these defaults into policy)
- **The bottle verdict rule is a placeholder needing an owner.** `RemedyPage.jsx` computes "This bottle gives you what was studied" as any 3 of 4 checks passing — a demo threshold so both bottom-line states render, not a scoring decision. The real rule belongs to methodology sign-off, and the four criteria are unlikely to be equally weighted: dose matching what studies used is a different order of importance from label disclosure. The weighting is deliberately NOT designed here.

### Caveats
- The single family is Onest (Google-hosted); replace with licensed binaries if the brand buys type.
- All study data in examples is illustrative placeholder data shaped like the real corpus (melatonin: 12 cited, 5 measured sleep, 3 verifiable; kava: 5 cited, 0 measured sleep).
