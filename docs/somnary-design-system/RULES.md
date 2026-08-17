<!--
Provenance: the canonical copy of this design charter lives in this repo, at
/docs/RULES.md, as of 2026-08-14. The design-system handoff bundle also carries a
copy. If the two ever diverge, the repo wins and the design-system copy is updated
to match — never the reverse.
-->

# RULES.md — Somnary design charter
*This file travels with the bundle. Read it in full before any design work. Every rule here was settled deliberately, most after something broke — none is a style preference. If a request conflicts with a rule, flag it; don't silently comply. When you enforce a rule in code, write it as a comment at the point of enforcement — rules that live only in conversation regress.*

## Identity
- Wordmark: **Somnary** — capitalised, no trailing period. Sentence case everywhere: headings, buttons, chips, captions, labels, placeholders, aria text. Names keep their fixed forms: L-theanine, 5-HTP, GABA, CBD, CBN, CBT-I, vitamin D.
- The brand mark is the letterform S — no moons, stars, or sleep iconography anywhere in the identity.
- Type: **Onest, single family**, self-hosted. No serif, no mono, no display/body split. Weight and size carry hierarchy (weights per tokens). Tabular figures for all numbers. No typographic signature device — character comes from palette, spacing and the evidence visuals, never a type trick.
- Dates: "14 July 2026", never ISO, anywhere user-facing.

## Colour — one rule above all
- **Colour means data.** `--evidence` (ink blue) is the evidence bar and its key, and nothing else. ALL interface colour — buttons, links, focus, active states — is `--ink`. There is no `--accent`; never reintroduce one.
- Green family = passes/works. Never use it for anything that isn't an earned positive verdict.
- Amber = safety register only. Avoid-red family = documented failure/concern only.
- No decorative gradients. One exception: the dusk `--page-ground` vertical shift (~5%), day stays flat. Never a gradient behind the hero, behind or inside the evidence bar, or on any quantity.
- Bucket badges are colour **and** shape coded; colour is never the sole signal.

## The structure — two questions plus a flag, never merged
1. **Does the ingredient work?** Four evidence buckets: "Helps most people sleep" / "May help sleep a little" / "Not properly tested for sleep" / "Tested — doesn't seem to help sleep". Each ALWAYS renders with its plain explanatory sentence. Bucket 4 requires papers that measured sleep and found no effect.
2. **Does this product deliver it?** The four checks (dose matches studies · independently tested · full label disclosure · studied form), product pages and rows only.
3. **Safety is a separate tri-state flag** (none / caution / serious concern). Safety NEVER moves a bucket in either direction — kava is "not properly tested" + serious flag, not "avoid". A serious flag visually outranks the evidence visual on that page.
- Never merge any two of these into one number, anywhere — schema, rendering, sorting.
- Open question with an owner needed: the `met >= 3` product-verdict threshold is a PLACEHOLDER rule. One definition, flagged, both consumers importing it. Criteria are likely not equally weighted; do not resolve this in design.

## Evidence display
- The research filter is a **nested bar**: full track = papers cited — meaning entries in that remedy's `sources[]` corpus, the only basis a bar ever renders from (owner, 14 August 2026); ~35% segment = measured a sleep outcome; solid = published enough to verify. Hairline gaps at boundaries (structure, not just tone). No scatter, no dots, no per-study positioning — the corpus can't support it (best remedy: 3 verifiable papers; sparse is the normal case).
- Muted remainder is always labelled "didn't measure sleep" — never anything implying weak evidence.
- Every compact caption stands alone and carries both steps: "5 of 14 papers measured sleep; 3 we could verify."
- Observational and cohort studies count; they support middle buckets but cannot alone reach the top bucket. Papers list shows plain study types: "trial", "review of several studies", "observational study".
- Numbers in prose use everyday units ("about 7 minutes faster, on average"); technical vocabulary (meta-analysis, RCT, effect size, bioavailability, PMID) lives ONLY inside "see the study" popovers and the How-we-grade page.

## Language
- Register: a well-informed friend who happens to be a pharmacist. Plain, short, specific. Plain never means vague — every sentence still commits.
- Banned: "the evidence layer", "zero brand money", "0 hallucinated cites", "evidence-graded", "reader-funded", "the honesty firewall", any self-congratulating independence copy. The whole claim is one quiet line: "Nobody pays us to say any of this. Every claim links to the study it came from."
- Headings are the questions people ask ("Does it work?", "Is it safe with my medications?").
- **Never invent a number.** Real corpus figures only; anything unknown is "[Placeholder — …]" or asked about.
- **Never author a health or safety claim** in a design file. Placeholder wording, explicitly marked, pending sourcing/medical review.

## Products
- We list **every** product, including ones we advise against — same checks, identical treatment, warning intact above. Where-to-buy rows are identical regardless of score, never ordered by anything commercial; room reserved for a one-line disclosure.
- Form is a controlled vocabulary (tablet ≠ capsule; softgel, gummy, melt, drops, spray, tea, powder, patch…). Delivery form ≠ release profile — two fields; release feeds the studied-form check.
- Additives: three flag states only — "No known concern" (neutral, NOT green) / "Worth knowing" (amber tint) / "Documented concern" (avoid tint), each non-neutral flag citing its paper. **No hazard spectrum, no invented gradients** — colour states what's documented, nothing more. Policy: non-sugar sweeteners are always at least "Worth knowing" in daily-use products (WHO 2023 basis, placeholder pending), with the daily-use framing sentence.
- Product pages are decision narratives (no TOC; one "Where to buy ↓" jump). Remedy pages are references (sticky contents, question sections). Anecdote never appears at the point of purchase.
- Placeholder imagery is the common case — a designed object (brand mark on sunken ground), never "no photo" or broken-image.

## Interface economy
- **Chrome scales with catalogue size.** Under ~20 items: no filter row, no sort — the list is the interface; order declared in prose. Above: Form as one derived dropdown (options computed from the page's data, with counts; zero-result options never render), plus genuine-preference filters (Independently tested, No artificial sweeteners) that only appear when both states exist. No sort controls; checks-passed is the fixed order. Remedies page keeps its outcome filters (31 items, routing) with Grouped/A–Z as a view toggle.
- **Never show an arbitrary subset of a large set.** Category queries return the category (a count row, a browse route), never a sample of members.
- A component answering two questions is redundant where one answer is the page (PairedVerdict never appears on that ingredient's own remedy page or its filtered lists).
- ✓ belongs to the four checks. Never inside a control on any page where check-ticks render.
- Nav is three items: **Remedies · Products · Safety**, plus ever-present search. Problems are reached by search, situation cards and cross-links; How-we-grade from every bucket badge and the footer.
- Breadcrumbs on every page (root exempt); mobile truncates to "‹ Parent". This is the back affordance — never referrer-dependent links.

## Accessibility floors (non-negotiable)
- Text ≥ 4.5:1 on its actual surface, both themes; minimum 13px. Muted/faint reserved for genuinely peripheral text — data labels are not peripheral.
- Sole-boundary borders ≥ 3:1 (`--border-input`); decorative hairlines exempt by intent.
- Visible `:focus-visible` on everything interactive (global rule lives in styles.css — inline styles can't express it).
- Hit areas ≥ 44px regardless of visual size. One h1 per page, no skipped levels. `prefers-reduced-motion` respected. Motion 150–250ms, settling ease.

## Process
- Design ships the shape; claims come from review. Every unknown is a marked placeholder.
- Real audit data only. *(The figures below are HISTORICAL — the design-phase audit, counted on a wider basis than remedy `sources[]` (e.g. kava 5 vs 3 in-repo, melatonin 12 vs 8; the "measured sleep" figures do match). Bars render from `sources[]` counts only; this line is re-derived from repo data at the melatonin pilot, CHK-Rfill.2 — owner, 14 August 2026.)* melatonin 12/5/3 · saffron ~5 sleep · valerian 11/3/1 · magnesium 9/2/2 · L-theanine 8/2/2 · chamomile 6/2/1 · ashwagandha 7/1/0 · kava 5/0/0 · bacopa 0 · taurine 0.
- When you enforce any rule above in code, restate it in a comment where it's enforced.
