# Somnary reconnaissance audit

**Date:** 28 July 2026  
**Scope:** current local worktree at `/Users/sammozaffari/Desktop/PROJECTS/somnary`  
**Mode:** read-only product audit; no product files were changed

## Verdict

Somnary has a recognisable editorial identity, unusually good evidence discipline in several parts of the product, and a technically sound responsive shell. It is not yet good enough to represent senior product-design work as a shipped product.

The problem is not generic visual polish. It is trust. The live site publishes grades that its own source files call provisional, promises traceable product scores without exposing the trace, silently turns a failed safety-data fetch into a reassuring result, sends users to 37 confirmed-dead purchase URLs, and carries systemic keyboard and inline-link contrast failures. Those are product-integrity failures, not finishing touches.

This audit retains **34 findings: 9 high, 19 medium, 6 low, and 0 critical**.

## Coverage and method

- Ran the Astro development site and audited what rendered, not only what the source suggested.
- Enumerated **166 live routes**: 40 static/category/article/legal/tool routes, 31 remedy routes, 7 outcome routes, and 88 product-scorecard routes.
- Captured **every route at 375, 768, and 1440 pixels: 498 full-page screenshots, 0 missing**. The capture archive is `/tmp/somnary-recon/screenshots/{375,768,1440}/`; the six reviewed contact sheets are `/tmp/somnary-recon/contact-sheets/{375,768,1440}-part-{1,2}.jpg`.
- Measured all 166 routes again at **400, 600, 900, and 1100 pixels**. Raw results are in `/tmp/somnary-recon/intermediate-metrics.json`.
- Opened all 166 routes in a live browser while collecting page exceptions, console warnings/errors, failed rendered images, and network behaviour. Raw results are in `/tmp/somnary-recon/console-all.json`.
- Crawled **10,226 rendered internal references**, resolving to 423 unique internal targets and 123 same-page fragments. Raw results are in `/tmp/somnary-recon/live-crawl.json`.
- Ran axe 4.12.1 against all 166 routes under WCAG 2.1 A/AA. Raw results are in `/tmp/somnary-recon/axe-all.json`; flattened node evidence is in `/tmp/somnary-recon/axe-violations.tsv`.
- Exercised success and failure paths for the search palette and label checker, including aborted index requests.
- Audited **412 rendered outbound references / 360 unique targets**, then manually and independently rechecked the failures. Raw results are in `/tmp/somnary-recon/external-links.json`.
- Ran the repository’s check, token, responsive, crawl, framing, and citation verification commands.
- Inspected all six screenshot contact sheets and individual originals for suspicious routes. Automated overlap candidates were checked manually so hidden assistive text and inline text fragments were not misreported as visible defects.

No visual change was made, so the visual-change reference/diff loop in `AGENTS.md` was not triggered. No design reference was supplied for this reconnaissance pass.

## Independent high-severity review

A separate reviewer re-ran or source-traced every HIGH/CRITICAL candidate.

- **All nine retained HIGH issue classes were reproduced.**
- **No whole HIGH/CRITICAL finding was discarded.**
- **Four candidate URL instances were discarded:** the first outbound crawl reported four Amazon URLs as 404, but the reviewer received 200 responses with a browser-like user agent. Those four are excluded from B-01.
- Six initially high-looking presentation/state findings were severity-calibrated down after review: the homepage hero sizing, compare-page length, search failure handling, interaction-state coverage, token-checker weakness, and the HTML-only legal marker.

## Counts by lens and severity

| Lens | Critical | High | Medium | Low | Total |
|---|---:|---:|---:|---:|---:|
| Breakage | 0 | 2 | 2 | 1 | 5 |
| Layout and spacing | 0 | 0 | 4 | 0 | 4 |
| Typography | 0 | 0 | 3 | 1 | 4 |
| Colour | 0 | 1 | 1 | 0 | 2 |
| Component consistency | 0 | 1 | 5 | 0 | 6 |
| Content and copy | 0 | 3 | 3 | 4 | 10 |
| Accessibility | 0 | 2 | 1 | 0 | 3 |
| **Total** | **0** | **9** | **19** | **6** | **34** |

Effort scale: **XS** under two hours; **S** half to one day; **M** one to three days; **L** more than three days or requiring owner/legal/editorial decisions.

## Full findings

| ID | Lens | Location | Evidence | Severity | Estimated fix effort |
|---|---|---|---|---|---|
| B-01 | Breakage | 38 product routes; shared renderer `src/components/scorecards/ProductPage.astro:74-77,185-191` | **37 unique Chemist Warehouse purchase targets return 404** across 38 product-route occurrences. Examples: `/sources/ashwagandha/bioglan-ashwagandha-plus` links to `/buy/114657`; `/sources/valerian/blackmores-valerian-forte` links to `/buy/34324`. Live browser responses were `404`, titled “Not Found — Chemist Warehouse”; the first product still exists at a slugged 200 URL, proving the stored destination is stale. Independent review reproduced both examples and the 37-target count. Four Amazon candidates were discarded. | **HIGH** | M |
| B-02 | Breakage | `src/components/HeroCarousel.astro:143,146,149,206`; `src/pages/index.astro:91,103,112`; `src/lib/lens/websearch.ts:199` | `npm run check` exits 1 with **8 errors and 20 hints**: seven invalid Lucide `strokeWidth` props and one `choices` access on `never`. The independent reviewer reproduced the exact count in a disposable copy. The release/type gate is red. | **HIGH** | S |
| B-03 | Breakage | Cold dev-server start; `ClaimSubmitForm.astro`, `GuidePanel.astro`, `LabelChecker.astro`, `LensPanel.astro`, `NewsletterForm.astro`, `ReviewNominateForm.astro`, `src/pages/compare.astro` | The first Vite dependency scan emitted seven import-analysis parse failures against Astro files with raw-tag/frontmatter comments. Routes subsequently rendered after cache warm-up and the 166-route console sweep was clean, so this is a fragile cold-start/tooling fault rather than a persistent runtime crash. | MEDIUM | S |
| B-04 | Breakage | Eight of 88 product routes; fallback at `src/components/scorecards/ProductPage.astro:111-116` and `ScorecardCard.astro:21-25` | Eight live product pages have no product image and render an oversized initial tile instead: Nature’s Way ashwagandha; Healthwise and Orthoplex glycine; Nature’s Bounty and Pure Encapsulations melatonin; MediHerb, Flordis, and Gaia valerian. The fallback is functional but reads as missing catalogue content on a purchasing surface. See corresponding files under `/tmp/somnary-recon/screenshots/375/` and `/1440/`. | MEDIUM | M |
| B-05 | Breakage | All four legal routes via `src/layouts/LegalPage.astro:15-20` | `/privacy`, `/terms`, `/disclaimer`, and `/disclosure` ship a `PRE-LAUNCH: requires legal review` HTML comment. It is not visible page copy, so it is not the placeholder-content failure first suspected; it is still release residue documenting an unresolved launch dependency. | LOW | XS |
| L-01 | Layout and spacing | `/compare`; `src/pages/compare.astro:442-460` | The comparison does not support comparison. At 375 it becomes one 327px column and the page is **33,717px / 37.5 viewports** tall; the first remedy card begins at y=2,443. At 1100 it is 16,029px tall in two columns. At 1440 it gets longer—17,345px—and default grid stretching makes the CBT-I card 1,684px high with **1,010px of unused space**. Evidence: `/tmp/somnary-recon/screenshots/375/compare.jpg`, `/1440/compare.jpg`. | MEDIUM | M |
| L-02 | Layout and spacing | `/compare`; `src/pages/compare.astro:534-550` | At 1440, the goal-chip container is 171px wide but has 192px scroll width. “stay asleep / fewer awakenings” extends **21px beyond its value-column edge** because chips are forced to `white-space: nowrap`. Evidence region: document y≈9,943 in `/tmp/somnary-recon/screenshots/1440/compare.jpg`. | MEDIUM | S |
| L-03 | Layout and spacing | `/`; `src/components/HeroCarousel.astro:277-305` | The carousel sizes the panel to its tallest hidden remedy slide. At 1440 the initial brand slide uses 662.8×348.2px inside a 1,214×458.4px active area, leaving **551.2px / 45.4% of the width** and 24% of the height unused. At 375, 425.5px / **45.7% of the active slide height** is blank beneath the brand message. Evidence: `/tmp/somnary-recon/screenshots/375/home.jpg` and `/1440/home.jpg`. | MEDIUM | M |
| L-04 | Layout and spacing | `/search`; `src/pages/search.astro:44-56,158-199` | At 375 the placeholder is visibly clipped without an ellipsis: the input’s usable width is 179.3px while the string measures 410.8px, so only **43.7%** is visible. The 77px submit button and fixed copy consume the rest of the 327px form. Evidence: `/tmp/somnary-recon/screenshots/375/search.jpg`. | MEDIUM | XS |
| T-01 | Typography | `GradeStamp.astro:49,56`; `HeroCarousel.astro:470,478`; `TierBadge.astro:18-21` | The browser loads one family—`Instrument Sans Variable`—with a **400–700** weight range, but rendered declarations request 440, 500, 600, 650, 700, 800, and 900. The 800/900 display distinctions therefore clamp to 700 or are synthesized browser-dependently. | MEDIUM | S |
| T-02 | Typography | `/melatonin-long-term`, `/sleep-habits`; `src/components/CiteMarker.astro:15-26`, `src/components/Fn.astro:14-22` | Interactive citation links compute to **8.64px with 0px line-height** because a `.72em` link is nested in `sup`. These are evidence controls, not decorative glyphs, and they sit outside the otherwise coherent type scale. | MEDIUM | S |
| T-03 | Typography | Homepage at 375; `src/styles/global.css:168`, `src/components/HeroCarousel.astro:337-346` | The H1 breaks as “Check a” / “sleep remedy” / **“before”** / “you take it”, producing a conspicuous one-word line. At 400 it abruptly becomes three lines. H1 rect at 375: x=65, width=245px, height=152px. | MEDIUM | S |
| T-04 | Typography | Numeric surfaces including `DosingGrid.astro:17-36`, `CommunityBar.astro:16-27`, `scorecards/ProductPage.astro:133-145` | No implementation of `font-variant-numeric: tabular-nums` or a tabular utility exists; computed value is `normal`. `global.css:26-30` explicitly says compared digits should use it, but aligned score/dose/count surfaces do not. | LOW | XS |
| C-01 | Colour | Safety callouts on 27 remedy routes; example `/r/melatonin`; `src/components/SafetyCallout.astro:89-100,143-150` | The 12px “Caution” tag renders `#171512` on `#8F5E12` at **3.28:1**, below WCAG AA’s 4.5:1 requirement for small text. The adjacent source comment claims the pair passes. This is a failing safety-state label, not incidental metadata. | **HIGH** | S |
| C-02 | Colour | Runtime colour sources listed in “Colour inventory” below | A semantic layer exists, but the runtime still contains untokenized body-gradient stops and component literals: `#FEFDF9`, `#F4EFE2`, 6% oxblood, translucent white, raw black masks, a 23% ink shadow, a 22% white inset, and raw white. `GradeStamp.astro:63`, `HeroCarousel.astro:467`, `RemedyCoda.astro:63-64`, `RemedyHero.astro:70-71`, `TierBadge.astro:35-36`, `Wordmark.astro:38`, `global.css:146-147`. | MEDIUM | S |
| CMP-01 | Component consistency | `/label-checker`; `src/components/LabelChecker.astro:293-318` | A failed `/label-index.json` fetch is caught and permanently cached as `entries=[]`; the checker then renders the reassuring **“No automated flags fired”** state. In the control, “Melatonin 20 mg” returns R2 and R5. With the request aborted it returns zero flags instead of an error. Evidence: `/tmp/somnary-recon/label-index-failure-masked-375.png`. Independent review reproduced the false-negative path. | **HIGH** | S |
| CMP-02 | Component consistency | Global search palette; `src/components/SearchPalette.astro:411-421,464-470,583-593` | A failed `/search-index.json` fetch is cached as `docs=[]` and displayed as **“No matches”**, conflating error and no-results. Control query `mela` returns five rows; the aborted request returns none and exposes no loading or error surface. Evidence: `/tmp/somnary-recon/search-index-failure-masked-375.png`. | MEDIUM | S |
| CMP-03 | Component consistency | Repository-wide interactive CSS; examples `src/pages/search.astro:188-199`, `SearchPalette.astro:56-75` | Static scan finds **0 `:active` rules**, 56 hover rules, 77 focus-visible rules, and only 10 disabled rules for 33 buttons, 249 links, and 18 form controls. Live toggling of `/search`’s submit button to disabled produced identical author styling and retained `cursor:pointer`. The required state model is not implemented consistently. | MEDIUM | M |
| CMP-04 | Component consistency | `scripts/check-tokens.mjs:35-46,58-88`; 23 flagged runtime files | `npm run verify:tokens` exits 0 while printing **32 raw-spacing warnings**. Independent scan also finds 12 raw font-size declarations in six files plus dynamic literal sizes/colours in `TierBadge.astro`. The checker fails selected hex/name cases only; spacing is warning-only and rgba, font-size, radii, and generated inline values escape it. The guardrail reports success while the stated contract is violated. | MEDIUM | M |
| CMP-05 | Component consistency | `src/styles/global.css:24-30,77-104`; `tailwind.config.mjs:36-56` | The two declared token sources disagree. Global `--font-mono` maps to Instrument Sans while Tailwind maps `mono` to IBM Plex Mono; base line-height is 1.60 vs 1.45; XL tracking is −0.02 vs −0.04; radii are 4/8/10/12/16 vs 3/7/11/16/24. A component’s appearance depends on which token surface its author happened to use. | MEDIUM | S |
| CMP-06 | Component consistency | `src/components/SafetyCallout.astro:13-81` and `src/components/scorecards/SafetyCallout.astro:1-105` | Two components with the same name implement the same safety-callout idea differently: `section role=note` with `caution/serious` and citation support versus `aside` with `safety/info`, definition-list content, different heading structure, and different visual register. Their API and semantics are not interchangeable, so safety messaging can drift by product area. | MEDIUM | M |
| CT-01 | Content and copy | `/r/apigenin`, `/r/bacopa`, `/r/cbn`, `/r/iron`, `/r/jujube`, `/r/reishi`, `/r/saffron`, `/r/vitamin-d`, `/r/zinc`; corresponding `src/content/remedies/*.mdx:2-5` | Nine live remedies publish definitive letter grades while their source records say provisional/pending sign-off. `/r/cbn` is explicit: its body says final grade is a HUMAN-GATE pending owner sign-off (`cbn.mdx:267-279`) while the public template renders grade D from `d.tier` (`src/pages/r/[slug].astro:60-81`). Independent review reproduced all nine. | **HIGH** | L |
| CT-02 | Content and copy | 88 product routes; `src/pages/sources/index.astro:55-60`; `src/pages/sources/methodology.astro:79-84`; `src/components/scorecards/ProductPage.astro:133-148`; `src/lib/scorecards/card.ts:31-34,50-68` | The product section promises **“every point traces to a primary document”** and a document users can open. All 88 product routes render six score notes with no evidence links; the data model has no per-dimension citation field. The traceability promise is false at the decision point. Independent review reproduced the route count and absence. | **HIGH** | L |
| CT-03 | Content and copy | `/privacy`; `src/pages/privacy.astro:48-50,63-65` | The privacy policy says **“sitewide search isn’t live yet”** while `/search` and the global palette are live; the same policy later says search works signed-out. This is internally contradictory legal/privacy copy describing a current feature. Independent review reproduced it. | **HIGH** | XS plus legal review |
| CT-04 | Content and copy | Global nav, `/sources`, remedy scorecard CTA, `/sources/methodology`; `Nav.astro:9-17`, `sources/index.astro:47-60`, `r/[slug].astro:127-134`, `sources/methodology.astro:94-96` | The product repeatedly frames a purchase recommendation—“Which to buy”, “where to buy”, “Which brand should you look at?”—while methodology says **“A ranking is a recommendation, and we don’t make those.”** The site has not chosen whether this surface is product evaluation or recommendation. | MEDIUM | M |
| CT-05 | Content and copy | Scorecard CTA on the five remedies with product datasets; `src/pages/r/[slug].astro:127-134`; category counts in `src/pages/sources/index.astro` | CTA copy promises **“every product you can buy in Australia”**. The source section describes selected scorecards/bestsellers and contains only 10–22 products per category. The universal-coverage claim is not supported by the dataset. | MEDIUM | S |
| CT-06 | Content and copy | All 31 remedy routes; `src/components/CommunityBar.astro:1-36`; `src/pages/privacy.astro:53-56` | Every remedy shows a dormant **0 / 100 “Too few reports”** data surface, but there is no nearby submission path and privacy says community reports are “when launched”. Thirty-one identical empty meters read as an unfinished feature rather than useful evidence. | MEDIUM | M |
| CT-07 | Content and copy | `/sources/magnesium/doctors-best-high-absorption-magnesium`; `src/data/source-scorecards/magnesium.ts:380` | Visible typo: **“Full full ingredients list disclosed…”** | LOW | XS |
| CT-08 | Content and copy | Vitamin D and iron remedies; `src/content/remedies/vitamin-d.mdx:88,120`; `iron.mdx:66,73,112,119,185-186,228,274` | The same microgram unit is formatted as `mcg` on Vitamin D and `µg` on iron, with no stated editorial rule. This is avoidable inconsistency on dose-sensitive health content. | LOW | XS |
| CT-09 | Content and copy | `src/pages/methodology.astro:78,96,234`; `src/pages/sources/*.astro`; `src/content/remedies/cbn.mdx` versus predominantly Australian copy elsewhere | User-facing copy mixes US **“labeled”** with Australian **“labelled”**, while also using Australian spelling such as “colour” and an Australian regulatory frame. | LOW | XS |
| CT-10 | Content and copy | `/privacy`, `/terms`; `src/pages/privacy.astro:10-15`, `src/pages/terms.astro:8-13`, `src/layouts/LegalPage.astro:23-25` | “Last updated” is rendered twice in each legal header: once inside the eyebrow prop and once through the layout’s separate updated line. The duplicate metadata looks unedited. | LOW | XS |
| A-01 | Accessibility | Global focus styles and footer; `src/styles/global.css:117-120,165`; `src/components/Footer.astro:109-115` | The universal focus indicator is 40% oxblood with outlines removed. Independent compositing gives **2.21:1 on white, 2.18:1 on paper, 2.10–2.14:1 on tinted surfaces, and 1.19:1 on carbon**, all below the 3:1 non-text contrast requirement. Keyboard focus reproduced the same ring. Evidence: `/tmp/somnary-recon/focus-footer-375.png`. | **HIGH** | S |
| A-02 | Accessibility | 60 of 166 routes; repeated `src/components/Disclaimer.astro:62-71`, `RemedyLeadBlock.astro:137-149`, plus contextual/privacy links | Axe reports **106 `link-in-text-block` nodes across 60 routes**. The common primary link `#7E1F2B` against surrounding muted `#5C574F` differs by only **1.38:1** and has no underline; other safety links also fail the 3:1 adjacent-text distinction rule. Independent review reproduced the token math and source treatment. | **HIGH** | M |
| A-03 | Accessibility | Global shell/navigation; repository-wide search | No skip-to-content link or equivalent bypass mechanism exists. Each page does eventually use `<main>`, but keyboard users must traverse the repeated global navigation on every route. | MEDIUM | S |

## Colour inventory

Scope: every distinct CSS/TS colour value used by the runtime UI source under `src/` and the root token layer. Raster/SVG asset pixels and third-party package CSS are excluded. Case-only duplicates such as `#FFFFFF` and `#ffffff` are one value.

The main semantic layer contains **41 named colour properties representing 38 distinct values**. Three aliases account for the difference: action repeats primary, action ink repeats surface, and grade A repeats eucalyptus.

| Register | Distinct values | Provenance |
|---|---|---|
| Warm surfaces | `#FCFAF2`, `#FFFFFF`, `#EEE8DA`, `#DBD5CD` | `--paper`, `--surface`, `--stone`, `--mineral`; `global.css:32-36` |
| Carbon surface | `#191510`, `#FBF8F0`, `rgba(251,248,240,.62)`, `rgba(251,248,240,.14)` | `--carbon`, `--on-carbon`, muted and line variants; `global.css:38-43` |
| Text | `#171512`, `#2B2028`, `#5C574F`, `#8C867B` | `--ink`, `--raisin`, `--muted`, `--soft`; `global.css:45-49` |
| Brand/action | `#7E1F2B`, `#661722`, `#F6E7E3` | `--primary`, deep, soft; action aliases primary and white; `global.css:51-58` |
| Positive | `#3F6A57`, `#E9F2DB` | `--eucalyptus`, `--pistachio`; `global.css:60-62` |
| Safety | `#E34234`, `#FDECE7`, `#A02C22` | `--vermilion`, `--warning-bg`, `--safety-ink`; `global.css:64-67` |
| Grade S | `#274B3F`, `#E5EBE7`, `#1B3A30` | fill, tint, anchor; `global.css:70` |
| Grade A | `#3F6A57`, `#E7EEE9`, `#2E5343` | fill, tint, anchor; `global.css:71` |
| Grade B | `#47695A`, `#E8EDE9`, `#35564A` | fill, tint, anchor; `global.css:72` |
| Grade C | `#8F5E12`, `#F5EEDD`, `#6E470E` | fill, tint, anchor; `global.css:73` |
| Grade D | `#9A4F28`, `#F5E8DF`, `#78401F` | fill, tint, anchor; `global.css:74` |
| Grade F | `#96323E`, `#F5E4E5`, `#77232D` | fill, tint, anchor; `global.css:75` |
| Hairline | `rgba(23,21,18,.13)` | `--line`; `global.css:106-110` |

Five additional distinct values are tokenized mechanics rather than flat colour properties:

- `rgba(23,21,18,.05)`, `.06`, `.10`, and `.16` for shadows at `global.css:112-115`.
- `rgba(126,31,43,.40)` for the focus ring at `global.css:117-119`.

Seven additional numeric values bypass the semantic layer:

| Untokenized value | Use and location |
|---|---|
| `rgba(126,31,43,.06)` | Body radial-gradient stop, `global.css:146` |
| `#FEFDF9` | Body linear-gradient start, `global.css:147` |
| `#F4EFE2` | Body linear-gradient end, `global.css:147` |
| `rgba(255,255,255,.62)` | Grade/hero glass fills, `GradeStamp.astro:63`, `HeroCarousel.astro:467` |
| `#000000` | Artwork mask anchors, `RemedyCoda.astro:63-64`, `RemedyHero.astro:70-71` |
| `rgba(23,21,18,.23)` | Tier-badge shadow generated in `TierBadge.astro:35` |
| `rgba(255,255,255,.22)` | Tier-badge inset generated in `TierBadge.astro:35` |

Raw `#ffffff` at `TierBadge.astro:36`, `Wordmark.astro:38`, and `src/pages/r/[slug]/og.png.ts:37` duplicates the existing `--surface` value rather than adding a distinct colour. `transparent` is also used as a gradient/mask keyword. `tailwind.config.mjs` and `src/lib/og.ts` duplicate core palette literals but introduce no additional distinct colours.

### Contrast results

Persistent failures:

- Safety “Caution” label: **3.28:1**, required 4.5:1.
- Inline link versus surrounding text: commonly **1.38:1**, required 3:1 when no non-colour distinction is present.
- Focus indicator: **1.19–2.21:1** across tested surfaces, required 3:1.

Representative ordinary text pairs that pass:

- Muted on paper: **6.86:1**.
- Primary on paper: **9.49:1**.
- Eucalyptus on pistachio: **5.33:1**.
- Safety ink on warning background: **6.37:1**.
- Footer muted on carbon: **7.16:1**.

The immediate axe sweep also flagged animated claim text while it was partway through its reveal transition. Re-running after the 2.5-second animation removed those nodes, so they are not retained as persistent contrast findings.

## The ten things that most undermine a senior reading

1. **The public evidence model is not in control of publication.** Nine definitive grades are live while their own source records say provisional.
2. **The purchase journey is materially broken.** Thirty-seven confirmed retailer targets fail on the surface explicitly framed as “where to buy”.
3. **The scorecards over-promise auditability.** “Every point traces to a primary document” is not true in the rendered product rows.
4. **A safety tool fails reassuringly.** Losing the label index produces “No automated flags fired” rather than an error.
5. **The privacy policy describes a different product.** It says sitewide search is not live while the feature is already globally available.
6. **Keyboard and inline-link accessibility fail systemically.** These are token/component decisions, so the problem repeats across the site rather than in one neglected page.
7. **The comparison page is a database dump, not a comparison experience.** At phone width it is over 33,000px long; on desktop it stretches short records to match long ones.
8. **The homepage’s first impression wastes nearly half its hero area.** The hidden-slide sizing model makes the initial state look unfinished at both ends of the viewport range.
9. **The quality gates cannot be trusted.** The type check is red, while the token check exits successfully despite widespread violations of the repository’s own rules.
10. **The product cannot state its commercial/editorial stance consistently.** “Which to buy” and “Which brand should you look at?” coexist with “A ranking is a recommendation, and we don’t make those.”

## What is already good and should survive the overhaul

- **The visual identity is specific.** Warm paper, oxblood, restrained grade palettes, and Instrument Sans give Somnary a recognisable editorial register. Do not replace this with generic wellness gradients or a dashboard kit.
- **The responsive shell is fundamentally sound.** Across all 166 routes at 400, 600, 900, and 1100 there was **no document-level horizontal scroll**. No visible content escaped its page container; automated clipping candidates were hidden assistive text.
- **Runtime stability after startup is strong.** The complete 166-route sweep produced **0 page exceptions, 0 console warnings/errors, and 0 broken rendered `<img>` elements**.
- **Internal information architecture is connected.** All 423 unique internal targets and all 123 same-page fragments resolved; no rendered internal link was dead.
- **Evidence citations are unusually well maintained.** The citation verifier found 142 cited records across 31 remedies, and online verification found no definite dead citation destination; 41 bot-blocked destinations remain explicitly unverified rather than falsely counted as passing.
- **Heading structure is disciplined.** Every one of the 166 routes has exactly one visible H1 and no skipped heading levels in the automated audit.
- **Forms and images mostly have the right semantics.** Inputs have labels, rendered product images have descriptive brand/product alt text, and the search palette includes an explicit focus trap.
- **Long-form typography is calm and readable.** The main body is consistently 16px/25.6px at roughly 68ch, using one coherent self-hosted family.
- **Motion accessibility has been considered.** Key moving components include reduced-motion handling rather than assuming animation is harmless.
- **The evidence/community separation is conceptually strong.** Copy repeatedly says community reports do not move the grade. Preserve that firewall, but do not render a dead 0/100 surface until the reporting system exists.
- **There is a real semantic token foundation.** The 38-value content palette is organised by surface, text, brand, safety, and grade intent. The overhaul should consolidate and enforce it, not discard it.
- **No lorem ipsum or ordinary TODO/FIXME placeholder was found.** The remaining placeholders are specific, traceable launch gates rather than generic template debris.

## Baseline facts worth preserving

- **498/498 required viewport screenshots captured.**
- **0/166 routes with live console errors or broken rendered images after startup.**
- **0/166 routes with horizontal document overflow at 400/600/900/1100.**
- **0/423 unique internal targets broken.**
- **0/123 rendered same-page fragments broken.**
- **0 definite dead citation destinations; 41 bot-blocked/unverified.**
- **37 independently confirmed dead purchase targets.**
- **9/9 retained HIGH issue classes independently reproduced.**
- **4 candidate Amazon URL failures discarded after independent review.**

No fixes were made during this pass.
