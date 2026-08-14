# Somnary redesign — runbook (v4)

*Everything in execution order. Supersedes v2 and v3. The original teardown analysis (the five site breakdowns and outside references) still stands separately.*

**Before step 1:** save this file into the repo as `/docs/REDESIGN.md` and commit it. Every prompt below references its Reference sections rather than restating them — without it in the repo, the prompts point at nothing.

**How to read this.** Fifteen steps, in order. Each is tagged with the tool it runs in and what it unblocks. Claude Code sessions follow CLAUDE.md's one-item-per-session rule. Claude Design steps all run in a single conversation so the system persists. The Reference section at the end holds the decisions and specs the prompts point to — read Reference A once before step 1, since it explains why the order is what it is.

**Why this order.** Two things drive it. The project's own operating documents currently contradict the new direction, and Claude Code is instructed to stop and flag conflicts with non-negotiables — so nothing else can proceed until they're fixed. And the signature visual depends on data that may not exist yet, so we find that out *before* designing around it rather than after.

---

> ## v5 reconciliation — design-phase decisions folded in (2026-08-14)
> The design phase (Steps 4–8) is **finished through the Safety and Brand pages**, and it
> settled a set of decisions that supersede parts of the runbook below. **`/docs/RULES.md`
> is now the binding design charter** (repo copy canonical). Where a prompt below still
> describes the pre-decision state, RULES.md and this banner win. Sections are amended
> in place where the contradiction is sharp; elsewhere read the prompt through these facts:
>
> - **Evidence buckets relabelled** → "Helps most people sleep" / "May help sleep a little" /
>   "Not properly tested for sleep" / "Tested — doesn't seem to help sleep". Bucket 4 requires
>   papers that MEASURED a sleep outcome and found no effect. (Amends A4, Step 6, Step 8.)
> - **Nav is THREE items** — Remedies · Products · Safety — plus ever-present search. Problems
>   are reached by search, situation cards and cross-links; How-we-grade from every bucket
>   badge (deep-linked) and the footer. Breadcrumbs on every page (root exempt; mobile
>   truncates to "‹ Parent"). (Supersedes the five-item nav in Step 5 and A6.)
> - **The study field is a NESTED BAR; the scatter is retired** (RULES.md). Three counts
>   (cited ⊇ measured-a-sleep-outcome ⊇ reported-enough-to-verify) + one plain direction
>   sentence. The Step-2 branch's "scatter demoted to secondary" was an *intermediate* state
>   later **superseded by charter** when the nested bar landed — not a live conflict. (Amends
>   Signature Element, Step 11, C2, C3.)
> - **Brand mark = capital-"S" letterform** (Onest 600); the crescent-moon disc and the
>   study-field-derived favicon are retired on charter grounds (no moons/stars/sleep costume).
>   (Amends Step 4 setup + COMPONENTS.)
> - **Type = Onest, one self-hosted family** (`--font-sans`); no serif, no mono, no signature
>   device; sentence case everywhere; dates render "14 July 2026", never ISO. (Amends Step 4 TYPE.)
> - **Product schema gains** structured `strength{amount,unit}` (never in the name),
>   `composition`, `perIngredientAmountsDisclosed`, a controlled-vocabulary `deliveryForm` +
>   a separate `releaseProfile`, `price`/`pricePerNight`, dietary/allergen fields, structured
>   `excipients[]`, per-remedy dose-context, and a studies-sourced `howToTake` protocol. Remedy
>   gains a required `displayName`. (Amends C2; full model in CLAUDE.md.)
> - **Two new page types enter the build** — the **Safety page** and the **Brand page** (item 3
>   below; added to the step table and Step 8).
> - **Additive policy**: three flag states (no known concern / worth knowing / documented
>   concern), every non-neutral flag cites a paper, a public documented-concern list, non-sugar
>   sweeteners always ≥ "worth knowing" (WHO 2023). No hazard scores, ever.
> - **Interface economy**: chrome scales with catalogue size (under ~20 items no filters/sort;
>   above, derived filters only, no sort controls, checks-passed the fixed order); search returns
>   tiered results and never an arbitrary member sample of a category (RULES.md).
> - **Re-scope**: design is done through Safety + Brand; **Steps 9–15 are the active build
>   track**, and the **editorial fill is the critical path**, carried as first-class BUILD_CHECKLIST
>   items (quality-rubric decision, direction/sample-size fill, safety copy sourcing, dose
>   protocols, documented-concern list) — not an assumption.
>
> **Branch map — all four MERGED to main at CHK-R0 (2026-08-14).** The doc/code
> divergence markers this map indexed are cleared; a repo grep for the marker
> string now returns zero.
> - ~~chk-redesign-2-source-audit~~ — MERGED (CHK-R0): source study-field fields (`effectDirection`
>   3-band · `measuresSleepOutcome` · `effectDataStatus` · `sampleSize` · `studyQuality`),
>   `SOURCE_QUALITY_RUBRIC.md` (**re-scoped** on merge to bucket-determining papers;
>   ratification still HUMAN-GATE), 31-remedy pilot fill, `check-source-fields.mjs`.
> - ~~redesign-type-studyfield-product~~ — MERGED (CHK-R0): `check-fonts.mjs` gate + the
>   type-lock / nested-bar / structured-strength / letterform-"S" doc decisions. NOTE the
>   branch carried NO swap code — the Onest `--font-sans` swap in `global.css`/OG and the
>   letterform favicon/wordmark redraw land with Step 10 from the handoff bundle.
> - ~~feat/remedy-displayname~~ — MERGED (CHK-R0): required `displayName` + `check-displaynames.mjs`.
> - ~~redesign-design-system-rules~~ — MERGED (CHK-R0): sentence-case / no-serif / self-host /
>   reject-don't-launder doc rules (subset of the type branch).

| Step | Tool | What it does |
|---|---|---|
| 1 | Claude Code | Fix the operating contract |
| 2 | Claude Code | Audit source data — the go/no-go for the study field |
| 3 | Claude Code | Product and brand schema |
| 4 | Claude Design | The design system |
| 5 | Claude Design | Home |
| 6 | Claude Design | Remedy page |
| 7 | Claude Design | Product layer |
| 8 | Claude Design | Browse, how we grade, problem, **Safety, Brand** pages (design DONE through here) |
| 9 | Claude Code | /go redirect |
| 10 | Claude Code | Wire the design system |
| 11 | Claude Code | Study-field generator |
| 12 | Claude Code | Search |
| 13 | Claude Code | Dusk mode |
| 14 | Claude Code | Citation popover and resolver |
| 15 | Claude Code | Freshness, share images, then the data pipeline |

---

## Step 1 — Fix the operating contract
**Claude Code · unblocks everything · no feature code**

CLAUDE.md's non-negotiables contradict the new direction in four places. Until they're fixed, every session will stall on a flagged conflict.

```
Read /docs/REDESIGN.md in full before doing anything else — it supersedes
parts of PROJECT_PLAN.md and changes several non-negotiables.

This session updates the project's own documents. No feature code.

Task: bring CLAUDE.md and BUILD_CHECKLIST.md in line with REDESIGN.md
Reference C1. Specifically:

1. Rewrite non-negotiable 1. It currently says "zero affiliate links…
   Ever." Replace with: no brand sponsorship, no paid placement, no score
   influenced by any commercial relationship; retail links permitted on
   every product regardless of score, routed through /go/{id}, never
   ordered by anything commercial.
2. Add a plain-language non-negotiable using the rules in REDESIGN.md
   Reference A5, including the banned-phrase list.
3. Replace every S–F reference in both documents with the two-axis model
   and four buckets (Reference A4). This affects CHK-0.4, CHK-1.1,
   CHK-2.3, CHK-3.1, CHK-4.1 at minimum — search both files for others.
4. Add product and brand to the content model section of CLAUDE.md.
5. Flag, don't resolve: CLAUDE.md says DESIGN_SYSTEM.md is the only source
   of truth for tokens, but Claude Design now produces a handoff bundle
   carrying them. Tell me the options and let me decide.
6. Update the build order in CLAUDE.md to match REDESIGN.md Reference C5 —
   products and search move forward; membership, Lens, community reports,
   stack builder move back.

Show me the full diff of both files before applying. Don't tick any
checklist boxes; this session changes the checklist itself.
```

---

## Step 2 — Audit source data
**Claude Code · the go/no-go for the study field · do this before designing**

The signature visual only works if every source carries sample size and effect data as structured fields. If it doesn't, you need to know now — either to fill the gap editorially or to rethink the visual — rather than discovering it at step 11.

```
Read /docs/REDESIGN.md Reference C2 first.

Task: audit how sources are currently stored across all 31 remedies, then
restructure them so every source object carries: sample size, effect
direction, effect size, study quality, year, study type, and identifier
(PMID/DOI/registry).

Start by reporting what's already there versus what's missing, per field,
across the corpus — I need to know the size of the gap before we decide
how to fill it. If most sources are missing effect data, say so plainly
rather than inferring values; we'll fill them editorially. Never infer or
estimate an effect size or sample size.

Acceptance: schema updated; every existing source migrated or explicitly
flagged as incomplete; validation fails loudly on a source missing
required fields; a coverage report per field.
```

**Decision point.** If coverage is poor and filling it editorially is a big job, tell me before step 4 — the study field may need to degrade gracefully (showing only the studies you have full data for) or be replaced.

---

## Step 3 — Product and brand schema
**Claude Code · unblocks step 7 (product design) and step 12 (search)**

Design the product pages knowing what data actually exists, not what you hope will.

```
Read /docs/REDESIGN.md Reference C2 and A4 first.

Task: add the product and brand content types, per the schema in Reference
C2. Include assessment_state (fully assessed / label known but not yet
assessed / not in database) and the product-score criteria fields
(dose_match, third_party_tested, label_discloses_all, proprietary_blend,
form_matches_studied).

Then migrate the ~50 existing researched products into it, reporting which
fields are missing per product rather than guessing at values.

Important: the ingredient bucket (does it work) and the product score
(does this bottle deliver it) are two separate axes and must never be
merged into a single number anywhere in the schema or the rendering.

Acceptance: both types validate; 50 products migrated with honest
assessment_state values; a sample product page renders server-side from
structured data; no combined score field exists anywhere.
```

---

## Step 4 — The design system
**Claude Design · everything downstream inherits from this**

Two setup notes before you paste anything.

**Do not connect your codebase for this session.** Claude Design can read a codebase during onboarding and will then apply your existing colours, typography and components to everything it makes. That feature exists to make new work *match* what you have — the opposite of what a redesign needs. Onboard cold. Connect the codebase and use the web-capture tool later, once the system is settled and you want real melatonin copy in the prototypes.

**Iterate here until it's right.** Steps 5–8 are cheap once the system holds; they're expensive if it doesn't. Keep going until the study field, the paired badge, the type pairing and both themes feel inevitable.

```
You are designing the visual system for Somnary (wordmark "Somnary", no
trailing period, per locked decision D3; the crescent-moon disc is the brand
symbol) — an independent reference that tells
people whether a natural sleep remedy actually works, and whether a
specific product actually delivers it. No supplement company pays Somnary
and no brand can influence a score. Every claim links to the study behind
it.

THE READER: an ordinary adult, often on a phone late at night, holding a
supplement bottle, with no scientific training. They want a clear answer
they can trust, in language they don't have to decode.

TONE — critical, and a change of direction. The site must never sound like
it's performing rigor or congratulating itself on its integrity. No
manifesto, no slogans, no counters boasting about independence. Write like
a well-informed friend who happens to be a pharmacist explaining something
across a kitchen table. Plain words, short sentences, specific claims.
Technical vocabulary (meta-analysis, randomised controlled trial, effect
size, bioavailability) NEVER appears in body copy — only inside "see the
study" popovers and the methodology page. Numbers appear in everyday
terms: "falls asleep about 7 minutes faster, on average." Acronyms are
always spelled out. Headings are the questions people actually ask: "Does
it work?", "Is it safe with my medications?"

DESIGN POSITION: "the observatory" — a quiet, precise, warmly-lit
instrument for looking at evidence. NOT a clinic (cold), NOT a wellness
brand (soft and vague), NOT a biohacker terminal (dark neon). Calm
verification, never persuasion. Reference points: Oura's warmth and
spaciousness, EWG Skin Deep's two-axis clarity, Our World in Data's
auditability — in a language none of them use.

THE CENTRAL STRUCTURE — two separate questions, never merged into one
score. This is the backbone of the whole system:
  1. DOES THIS INGREDIENT WORK? — four buckets:
     "Works for most people" / "Might help a little" /
     "Nobody really knows yet" / "Best avoided"
     Each bucket ALWAYS displays with one plain explanatory sentence
     beneath it — never a legend the reader must go find. Colour-coded
     AND shape-coded so colour is never the only signal.
  2. DOES THIS PRODUCT GIVE YOU WHAT WAS STUDIED? — scored on visible,
     factual criteria: dose matches what studies used · independently
     tested by a third party · label discloses everything (no hidden
     "proprietary blends") · the form that was actually tested.
A product is only marked worth buying when BOTH are strong. Design the
paired-badge component showing both answers together, and design its
mismatch states — good product / weak ingredient, and good ingredient /
poor product — because those are the most common and most useful results.

Also set both bucket naming options in type so I can compare:
"Works for most people / Might help a little / Nobody really knows yet /
Best avoided" versus "Strong evidence / Some evidence / Not enough
evidence / Avoid."

PALETTE (day): warm paper base (~#F6F3EC region, tune it), warm near-black
ink (~#1C1B22), primary accent = a dusk blue-violet (the sky 20 minutes
after sunset; tune around #5B5A8A–#6E6B9E), muted sage as support. The
four bucket colours: desaturated, colourblind-safe, warm and positive at
the top down to a muted clay-red at "best avoided", all passing WCAG AA on
paper. PALETTE (dusk): a designed low-light night theme for late-night
reading — deep warm near-black (~#17151E region), amber-shifted text,
lowered contrast, dimmed chrome. Show everything in both.

TYPE: a characterful serif reserved for the human voice (verdicts, pulled
sentences), a precise neutral sans for interface and data, a mono for
doses and identifiers. Signature device: one italic serif phrase inside an
otherwise sans headline, used on the words that carry the meaning.

SIGNATURE ELEMENT — the study field. Each remedy's research rendered as
generated art: every published study is a point of light; bigger point =
more people in the study; points to the right of a thin vertical line mean
it helped, to the left mean it didn't; brighter = better-run study. A
well-studied remedy is a dense cluster to the right; a poorly-studied one
is a sparse scatter across the line; an untested one is nearly empty sky.
It must be readable by a non-scientist from one caption ("each dot is a
study — the bigger the dot, the more people it included") and still be
literally accurate. On a warm paper or night field it reads as quiet
starlight — but NO literal moons, stars, or sleep clipart. Design it at
three sizes: page hero, card thumbnail, share image. Specify the exact
mapping rules — how sample size maps to radius, how horizontal position is
calculated, the opacity range — since these will be implemented as a
generator over real data. Also show how it degrades honestly: a remedy
with two studies, and one with none.

MOTION: calm, 150–250ms, settling ease. One choreographed motif: the
label-versus-studies reveal — what the bottle claims renders first, a line
draws through it, what the studies found fades in beneath with a "see the
study" chip. Respect prefers-reduced-motion.

COMPONENTS (each in both themes, with states): wordmark + favicon drawn
from the study field; bucket badge (4 states, letter-free, shape + colour
+ label); product score badge with its criteria breakdown; the paired
ingredient+product verdict; "see the study" chip and its popover (what the
study found in one plain sentence, how many people, what year, link out,
and when Somnary last checked the link works); the label-versus-studies
row; a plain-language stat at display scale ("about 7 minutes faster to
sleep — from a review of 19 studies covering 1,683 people"); remedy card;
product card with three completeness states (fully assessed / label known
but not yet assessed / not in database); brand result row; a "where to
buy" row (retailer name, price if known, outbound link) designed to look
IDENTICAL on a well-scoring product and on one the site advises against —
same component, same visual weight — with room for a one-line disclosure
beneath it; safety callout (calm, unmissable, amber); the search field as
the site's primary object; "last checked {date}" tag; disclaimer band.

Quality floor: WCAG AA, visible keyboard focus, mobile-first, reduced
motion respected. Avoid: healthcare blue, neon, decorative gradients,
stock wellness photography, cream-and-terracotta AI-default styling.
```

**Two things to settle before moving on.** *Bucket wording* — see both options set in the real type; "works for most people" is warmer but commits harder, "strong evidence" is safer but cooler. Whichever wins, the plain sentence underneath does the real work. *What the product verdict is called* — "worth buying" is clearest and carries the most risk; "delivers what was studied" is precise and slightly clinical. Suggestion: the badge says the safe thing and the plain bottom line says the human thing — *"This one contains the dose the research used, and it's been independently tested."* The reader draws the conclusion, which is both more defensible and more persuasive.

---

## Step 5 — Home
**Claude Design · same conversation**

```
Design the Somnary homepage in this system — day and dusk, mobile and
desktop. The page's only real job is to get someone to an answer fast.

1. Slim header: "Somnary" left; nav = remedies · products · problems ·
   safety · how we grade.
2. Hero: one plain sentence of what the site does, and beneath it the
   SEARCH FIELD as the largest, most prominent object on the page — this
   is the hero. Placeholder: "search a remedy, a product, or a brand."
   Show the open state with mixed live results grouped as remedies /
   products / brands / problems, each row carrying its bucket badge inline
   so the answer often arrives before the click.
3. A quiet safety route directly beneath: "taking medications, pregnant,
   or thinking about this for a child? start here."
4. "Or start with what's going on" — six plain situation cards: I can't
   fall asleep · I keep waking at 3am · I bought a sleep blend and can't
   read the label · I'm thinking about melatonin · I take medication ·
   this is for my child.
5. "The ones people ask about most" — six remedy cards with bucket badges
   and study-field thumbnails.
6. One honest number at display scale with its "see the study" chip.
7. Footer: one plain sentence about independence (no stat row, no
   counters), disclaimer band, how-we-grade and last-updated links.

No manifesto, no strike-through slogan, no testimonials, no video. The
page should feel like a well-made reference tool, not a campaign.
```

---

## Step 6 — Remedy page
**Claude Design · same conversation · the template every remedy inherits**

```
Design the melatonin remedy page — the template every remedy inherits.
Day and dusk, mobile and desktop.

Header: "melatonin", its bucket badge with the plain sentence beneath, a
one-line verdict in the serif voice, the study-field hero generated from
its research, and "last checked {date}".

Sticky contents list (sidebar on desktop, collapsible on mobile) across
question-form sections:
  Does it work? · What does it actually do? · What's a normal dose and
  when do you take it? · Is it safe with my medications? · What should I
  look for on the label? · Which products deliver it? · What people
  report · The studies behind this page.

Design these fully:
- The label-versus-studies rows using the reveal motif, each ending in a
  "see the study" chip.
- The chip's popover, open — plain-sentence finding, number of people,
  year, outward link, last-checked note.
- A plain stat at display scale: "about 7 minutes faster to sleep — from a
  review of 19 studies covering 1,683 people."
- Dose section showing what studies used versus what typical products
  contain.
- Safety section, prominent, amber register, plain language, medications
  named.
- "Which products deliver it" — three or four product cards using the
  paired badge, linking into the product database.
- "What people report" — clearly separated, explicitly labelled as
  personal accounts that never affect the assessment.
On desktop, citations sit as margin notes at their reference point; on
mobile they're inline chips opening the same popover.
```

---

## Step 7 — Product layer
**Claude Design · same conversation**

```
Design the product layer, day and dusk, mobile and desktop — modelled on
EWG Skin Deep's clarity but warmer and far plainer.

PRODUCT PAGE, top to bottom: product name and brand; the paired verdict
(does this ingredient work / does this product deliver it) as the first
thing seen; a plain one-sentence bottom line; then the score's working
shown openly — every criterion listed with a tick or a cross and a short
factual note (dose matches what studies used · independently tested by
{organisation} · full label disclosure, no hidden blends · the form that
was tested). Then: what's actually in it, per ingredient, each ingredient
carrying its own bucket badge and linking to its remedy page; what to
watch out for; where the information came from and when it was last
checked; and the where-to-buy row.

THE WHERE-TO-BUY ROW is a small but important design problem. Retailers
listed neutrally, never ordered by anything commercial, with prices where
known. Design it twice: once on a product the site scores well, and once
on a product the site says to avoid — and make them IDENTICAL in
treatment, with the warning fully intact above it on the second. Somnary
links every product, including ones it advises against, and the design
should carry that stance plainly: we're not going to stop you, but here's
what you should know first. Leave room for a single line of disclosure
beneath the row for future use. Also design the state where no retailer
link exists.

Design all three completeness states: fully assessed · label known but not
yet assessed · not in the database (offering the label tool as the
fallback: "type what's on the package and we'll tell you what we can").

PRODUCT SEARCH / BROWSE: filter by ingredient, brand, form, independently
tested, and dose-matches-studies. Results as scannable rows with the
paired badge. Also design the brand page — all of a brand's products, with
an honest summary of how they tend to score.
```

---

## Step 8 — Browse, how we grade, problem page
**Claude Design · same conversation · three prompts, run in sequence**

```
Design the browse page — every remedy sorted into the four buckets, day
and dusk, mobile and desktop. Each entry: name, bucket badge, study-field
thumbnail, one plain sentence, what it's mainly used for, any safety flag.
Filter by what you're trying to fix and by safety flags.

The top bucket will hold very few remedies and the "nobody really knows
yet" bucket will hold many. Design for that: the sparseness at the top is
the most important thing on the page and should feel deliberate rather
than unfinished — a short plain note in the top bucket explaining, without
self-congratulation, that very few natural sleep remedies have been
studied well enough to sit there yet.

Include the share image this page produces.
```

```
Design the "how we grade" page — plain enough for anyone, complete enough
that a doctor or a scientist reading it comes away satisfied. Day and dusk.

Cover: the two questions and why they're kept separate; what each of the
four buckets means and what it takes to sit in one; how product scores are
worked out, criterion by criterion; where the information comes from
(government label databases, independent testing organisations,
manufacturers' own test results, published research); how often it's
rechecked and how stale entries are flagged or removed; what happens when
something is wrong and how to report it; and a plain statement that no
supplement company pays Somnary and no brand can influence a score.

This is the page allowed to use real terminology — but it must introduce
each term in plain words first. Layer it: plain explanation on the surface,
full technical detail behind expandable sections for readers who want it.
```

```
Design a problem page — "I keep waking up at 3am" — day and dusk, mobile
and desktop. This is for someone with a situation, not an ingredient in
mind.

Structure: a short plain explanation of what's usually going on; when it's
worth seeing a doctor, given calm prominence; what actually has evidence
for this specific problem, as remedy cards with bucket badges — ordered
honestly, including the fact that most options land in the lower buckets;
what's commonly recommended for it that doesn't hold up, using the
label-versus-studies reveal; and non-supplement things that have better
evidence than most supplements do. Ends with a route into products for
anything worth considering.

Warm, unhurried, never alarming. This page is often read at 3am.
```

**Then export the handoff bundle** for Claude Code. Treat it as authoritative for values and behaviour, not as code to paste — Claude Design produces its own HTML and CSS structure, and you want Claude Code implementing in Astro's idiom rather than grafting a parallel implementation into the repo.

---

## Step 9 — /go redirect
**Claude Code · independent of design, can run any time after step 1**

```
Read /docs/REDESIGN.md Reference A3 and C3 first.

Task: build /go/{product-id} as a server-side redirect to the product's
retail URL, logging the click (product id, retailer, timestamp — no
personal data). Make it the only way retail links are emitted: add a link
component that content must use, and a build-time check that fails if a
raw retailer URL appears anywhere in page content.

The point is that adding affiliate tags later is a one-file change. Design
it accordingly.

Acceptance: redirect works; clicks logged without personal data; build
fails on a hardcoded retailer URL; where-to-buy renders identically on a
well-scoring product and one the site advises against.
```

---

## Step 10 — Wire the design system
**Claude Code · needs the step 8 handoff bundle**

```
Read /docs/REDESIGN.md and the Claude Design handoff bundle.

Task: wire the new token system into the styling layer — colours (day and
dusk), type scale and the three faces, spacing, radius, motion durations
and easing. Then build the primitive components: bucket badge, product
score badge, paired verdict, "see the study" chip, safety callout.

Rules: named tokens only, no hardcoded values. Bucket badges carry shape
AND colour, never colour alone, and always render with their plain
explanatory sentence. Verify contrast passes WCAG AA on both themes and
report any token that fails.

Treat the handoff bundle as authoritative for values and behaviour, not as
code to paste — implement in our Astro component conventions.

Acceptance: tokens wired; five components built in both themes with all
states; a test page renders using named tokens only; contrast verified.
```

---

## Step 11 — Study-field generator (RESCOPED — nested bar, scatter retired)
**Claude Code · needs steps 2 and 10 · substantially smaller than the original scatter**

> **Rescoped 2026-08-14 (RULES.md).** The study field is a **nested bar**, not a scatter.
> This is a much smaller build: no SVG point generation, no coordinates, no mapping rules,
> no three geometries, no per-study radius/brightness. Chronology, so it's not mistaken for a
> live conflict: the Step-2 branch (`chk-redesign-2-source-audit`) first *demoted* the scatter
> to a secondary element rendered only where a remedy had ≥3 positioned points; that
> intermediate state was **superseded by charter** when the nested bar landed
> (`redesign-type-studyfield-product`). RULES.md is the final state — scatter retired outright.

```
Read /docs/REDESIGN.md Reference C2 and C3 and RULES.md "Evidence display".

Task: build the nested-bar study field. Render three counts as one nested bar —
cited ⊇ measured-a-sleep-outcome ⊇ reported-enough-to-verify — plus one plain
direction sentence (e.g. "of the 3 we could check, all 3 found an improvement"),
aggregated from effectDirection over the verifiable sleep-outcome sources. The
same nested bar at three sizes: page hero, card thumbnail, share image.

Server-rendered text/DOM (crawlable, screen-readable, themeable in day and dusk).
Derive counts directly from sources[]: cited = sources.length; measured =
count(measuresSleepOutcome === true); verifiable = count(measuresSleepOutcome ===
true && effectDataStatus === 'complete'). Never invent a count. Label the muted
remainder "didn't measure sleep" — never anything implying weak evidence. Every
compact caption stands alone and carries both steps ("5 of 14 papers measured
sleep; 3 we could verify"). A serious-concern safety flag visually outranks the bar.

effectDirection is NOT retired with the scatter: the three-band field still feeds
the direction sentence and stays REQUIRED on complete sleep-outcome sources.

Handle the honest edge cases: a remedy with two sources, and one with none, must
both read meaningfully rather than looking empty by accident (n=0 reads "no
research", not a broken empty visual).

REPORT before the fill pass: with effectSize no longer rendered anywhere and the
scatter's radius/brightness gone, which Step-2 schema fields are now dead weight to
DROP rather than editorially fill? (Owner-decided outcome, folded into C2: keep
measuresSleepOutcome/effectDirection/effectDataStatus/sampleSize/type required;
effectSize optional; studyQuality re-scoped to bucket-determining papers only — so
the fill shrinks. Confirm nothing is filled that nothing reads.)

Acceptance: renders from real source data for all 31 remedies; three sizes; both
themes; sparse and empty cases handled; no scatter, no per-study points, no canvas.
```

---

## Step 12 — Search
**Claude Code · needs step 3 · the site's primary interface**

```
Read /docs/REDESIGN.md Reference A6 and C3 first.

This is the site's primary interface and deserves more attention than any
other single feature.

Task: build one search index across remedies, products, brands, problems
and safety topics, returning grouped mixed results — each row carrying its
bucket badge inline so the answer often arrives before the click.

Must handle: an ingredient name, a brand name, a product name with dose,
and a plain-language problem ("can't stay asleep"). Recommend an approach
for the corpus size and justify it before building.

Results must never be ordered by anything commercial.

Acceptance: all four query types return sensible grouped results; badges
render inline; keyboard navigable with visible focus; the underlying
browse pages work without JavaScript.
```

---

## Step 13 — Dusk mode
**Claude Code · needs step 10**

```
Read /docs/REDESIGN.md Reference C3 first.

Task: implement dusk mode as a CSS custom-property theme swap keyed to
local sunset, with a stored manual override and prefers-color-scheme as
fallback. Inline head script to prevent any flash of the wrong theme.

This is a designed night theme, not an inverted day theme — use the dusk
token set exactly as specified.

Acceptance: switches at local sunset; manual override persists; no flash
on load; every component verified in both themes; contrast passes AA in
dusk.
```

---

## Step 14 — Citation popover and resolver
**Claude Code · needs step 10**

```
Read /docs/REDESIGN.md Reference C3 and A5 first.

Task: build the "see the study" chip and popover as one component
consuming structured source objects — plain-sentence finding, number of
people, year, outward link, and the last-verified date. Inline chips on
mobile, margin sidenotes on desktop, same popover underneath.

Then wire the citation resolver to run in CI and write the last-verified
date back into the source data, so the interface displays what the
pipeline actually enforces.

Plain-language rule applies: the interface says "see the study"; PMID and
DOI appear only inside the popover.

Acceptance: popover works on both breakpoints; keyboard accessible;
resolver runs in CI and fails loudly on an unresolvable citation; the
displayed date comes from the pipeline, not hardcoded.
```

---

## Step 15 — Freshness, share images, then the data pipeline
**Claude Code · two sessions, then several**

```
Read /docs/REDESIGN.md Reference C3 first.

Two related pieces of plumbing.

1. Freshness: flag any product whose data is over three years old, and
   quarantine at six. Surface "last checked {date}" wherever the design
   calls for it. Report current staleness across the corpus.
2. Share images: satori plus resvg, generating per-remedy and per-bucket-
   board images at build from the same components — including the study
   field.

Acceptance: stale products flagged and quarantined by rule, not manually;
share images generate at build for every remedy; OG tags reference them.
```

Then the data pipeline, which is several sessions and starts with a plan rather than code:

```
Read /docs/REDESIGN.md Reference C4 first.

This is several sessions, not one. Start with a plan, not code.

Task: propose an ingestion pipeline for product label data, in priority
order — NIH Dietary Supplement Label Database first (highest leverage),
then the TGA's Australian Register of Therapeutic Goods, then retailer
listings as the messy fallback. For each: what access it offers, what
fields map to our product schema, what's missing, and what the update
cadence should be.

Then propose the matching layer for independent quality signals (USP
Verified, NSF, Informed Choice/Sport, Labdoor, ConsumerLab where
available) and the derived fields we compute ourselves: dose match against
studied dose, active constituent quantified, proprietary blend present,
form matches what was studied.

Every ingested product enters at "label known, not yet assessed" — never
inferred into a higher assessment_state. Show me the plan before building
anything.
```

---
---

# Reference

*Background and specs. The prompts above point here by section number. Read A once before step 1.*

## A1. The four decisions this revision is built on

Plain language everywhere. Four buckets instead of S–F. Product search that can call a good product good. Retail links on every product — plain links now, affiliate tags possible later. Plus EWG Skin Deep as the structural model, which turns out to answer the hardest of them.

## A2. On saying "this is a good buy"

The non-negotiable that seemed to block it says *no brand money, no paid placement.* Calling a product good doesn't violate that — taking money to call it good would. The rule that needs rewriting is the unstated one absorbed from the plan's tone: "we never say what to buy." Replace it with: **no brand can influence a score.** That stays true under every future monetisation choice.

The genuine constraint is narrower and worth naming once: the safe version of "good buy" is a judgment about *the product* — it contains the dose that was studied, it's been independently tested, the label tells you everything — not a judgment about your health outcome. "This product delivers what the research used" is defensible. "This will fix your sleep" is a therapeutic claim, and the TGA is strict about those in Australia. Everything above is built so the product verdict rests entirely on the first kind of statement.

## A3. On retail links

For launch these are plain outbound links, no commission. Two things matter now because they're expensive to retrofit.

*Route them through your own path.* Every link goes to `/go/{product-id}` and redirects rather than hardcoding retailer URLs into content. Adding affiliate tags later becomes a one-file change instead of editing hundreds of pages, and meanwhile you get click data — which tells you what people actually want to buy, and therefore which products to research next.

*Link every product, including the ones you advise against.* This is the structurally important part and should be a stated policy, not something readers infer. Ordinary affiliate sites link only what they recommend, which creates a quiet gradient where recommending more, and higher, earns more — that's how "best of" sites rot. Linking everything means you never profit from *which* product someone picks. Visually the buy row is identical on a "best avoided" product and a good one, same component, same weight, warning fully intact above it. That reads as *we're not going to stop you, but here's what you should know first* — respect rather than salesmanship, distinctive enough to be part of the brand, and it means nothing shifts visually if commissions turn on later.

**If affiliate revenue does arrive**, three things need to be true, all of them design decisions rather than legal ones. Disclosure sits inline at the link, not in a footer — one plain line: *we get a small commission if you buy through this link; it doesn't change the score, and we link every product including the ones we say to skip.* Results never sort by commission, and products with no affiliate program are still assessed and listed, visibly — the checkable proof that inclusion isn't monetisation-driven. And publishing what you earn, ideally per product, is cheap, radical, and converts your biggest vulnerability into the most convincing page on the site.

Two things to check before switching commissions on: Amazon Associates has real restrictions around health content and link presentation (iHerb and Chemist Warehouse are likelier fits for Australia anyway), and earning commission on therapeutic goods moves you closer to *advertising* them, which brings the Therapeutic Goods Advertising Code into play in a way pure editorial doesn't. That's a real step up in exposure and the point to get proper advice — as is rating commercial products by name at all. None of this is legal advice.

## A4. Two questions, not one score

EWG's real lesson, and it's better than anything in the original plan. Skin Deep doesn't give a product one number. It gives two — a hazard score *and* a data-availability score — and tells people explicitly that a good hazard score means little if the data behind it is thin. Two axes, held separately, honesty built into the structure rather than the copy.

Somnary's translation maps onto a distinction people already intuit but can never check:

**Question 1 — does this ingredient actually work?** (about the substance; from published human research)
**Question 2 — does this product actually give you what was studied?** (about the bottle; dose, testing, honest label)

Almost every failure in the sleep-supplement aisle is one of these going wrong, and people currently can't tell which. A magnesium product can be immaculate — third-party tested, exact studied dose, full disclosure — while the evidence for magnesium and sleep stays thin. A melatonin gummy can be backed by good research and still contain a fraction of what it claims. Two axes make both legible at a glance and make the "good buy" call safe: **worth buying only when both are strong.** That's an assessment, not a recommendation, and the reasoning is visible.

It also resolves the label checker. EWG can't rate everything either, so unrated products get a "Build Your Own Report" tool where you type in what's on the package. That's the right home for label-checking: **the fallback when a product isn't in the database**, not a hero feature.

Two more things worth taking from EWG, one to avoid. Take the **freshness discipline** — they flag products older than three years as "old formulation" and delete them at six; formulations change, and a stale rating is worse than none. Take **search by brand** — people arrive loyal to a brand as often as to an ingredient. Avoid their two documented weaknesses: ratings partly fed by voluntary manufacturer submissions, and a scoring method critics find opaque. Somnary's product score must be fully derived from stated criteria and show its working on every page. And note EWG VERIFIED is a paid licensing mark — precisely the line you don't cross. Your version of a seal is earned by the data, never bought.

### The four evidence buckets

| | Bucket label (RULES.md, ratified 2026-08-14) |
|---|---|
| 1 | **Helps most people sleep** |
| 2 | **May help sleep a little** |
| 3 | **Not properly tested for sleep** |
| 4 | **Tested — doesn't seem to help sleep** |

These labels **supersede** the earlier "Works for most people / Might help a little / Nobody really knows yet / Best avoided" wording AND the "Strong evidence / Some evidence / Not enough evidence / Avoid" formal set. Each carries one plain sentence beneath it, permanently — never a legend the reader has to go find. Roughly: *studies keep finding it helps people sleep* / *a few studies found a small effect on sleep, but the research is thin* / *it hasn't been properly tested for sleep in people, so nobody can honestly say* / *studies that measured sleep didn't find it helps*. **Bucket 4 requires papers that MEASURED a sleep outcome and found no effect** — an untested remedy is bucket 3, never bucket 4. (Safety is deliberately NOT in that last sentence — it rides a separate flag; see below.)

The honesty asset survives the rename and gets sharper: bucket one will be nearly empty. A browse page where "works for most people" holds one or two entries and "nobody really knows yet" holds a dozen makes your entire argument without a word of manifesto.

### Safety is a separate flag, not part of the bucket

The evidence bucket answers only *does it work*. It never encodes *is it safe* — those are different axes, and folding them together is the exact collapse Somnary can't afford. Kava has reasonable evidence for sleep **and** a documented hepatotoxicity history; a single scale would flatten it into the same "avoid" box as a botanical nobody has tested, which is both less useful and less honest.

So safety rides alongside every remedy as its own flag — three values: **none · caution · serious concern** — always visible next to the bucket, never merged into it and never altering it. A remedy can therefore read "works for most people" *and* "serious concern" at once (kava), or "nobody really knows yet" with no safety flag at all. That is why bucket 4 ("best avoided") narrows to a single plain meaning: *it's been tested and it doesn't work.* Anything dangerous is carried by the safety flag, whatever its evidence bucket.

This is exactly the structure the live `/tiers` Evidence×Safety map (PR #153) already renders — evidence on one axis, safety on the other, derived from existing fields without collapsing either. That map **reconciles** with this model rather than competing with it: it *is* the bucket × safety-flag view, and only its terminology (S–F → buckets) needs aligning when the migration lands. The product score stays a third, separate signal, on product pages only.

## A5. Plain language rules

*Binds both Design and Code. Goes into CLAUDE.md at step 1.*

The register: a well-informed friend who happens to be a pharmacist, explaining across a kitchen table, not performing rigor.

**Technical vocabulary moves one level deeper.** "Meta-analysis," "randomised controlled trial," "placebo-controlled," "effect size," "bioavailability," "standardised extract" disappear from body text and live inside the "see the study" popover, the methodology page, and opt-in expansions. In body text they become what they mean: *a review that pooled 19 studies* · *a proper trial where neither the patient nor the doctor knew who got the real thing* · *how much of it your body actually absorbs* · *made so each batch contains the same amount of the active part*.

**Acronyms spelled out on first use, every page.** PMID and DOI are the worst offenders — in the interface they read "see the study," with the identifier inside the popover. TGA, NSF, USP, COA all expanded in place.

**Numbers in everyday units.** Not "reduced sleep-onset latency by 6.9 minutes (95% CI…)" but "fell asleep about 7 minutes faster, on average" — confidence interval and sample size one tap deeper.

**Phrases to cut entirely:** *the evidence layer · zero brand money · 0 hallucinated cites · the sleep-supplement internet is a sales floor · evidence-graded · reader-funded · the honesty firewall · claim-check counter · disavowal.* They're the site talking about itself. Replace the whole stat row with one quiet sentence somewhere unglamorous: **"Nobody pays us to say any of this. Every claim links to the study it came from."**

**Headings become the questions people actually type.** "Does it work?" · "What's a normal dose?" · "Is it safe with my medications?" · "What should I look for on the label?"

One thing to protect while simplifying: plain must not become vague. "Might help a little" is plain *and* precise. "It's complicated" would be plain and useless. Every simplification still commits to a specific claim.

## A6. Information architecture

Search is the product; everything else is browsing for people who don't know what to search.

**One search field, tiered results (amended 2026-08-14, RULES.md).** Someone types "magnesium," "Nature's Own," "melatonin gummies 5mg," or "can't stay asleep" and gets results in tiers — **answer** (the direct hit, with its bucket badge inline so the answer often arrives before the click) · **routes** (the pages that take them where they're going) · **more matches**. Two hard rules: a **category query returns the category** — a count-row and a browse route — **never an arbitrary sample of its members**; and **product rows appear only on product-intent queries** (a brand token, a dose, or a product-name word), not on a bare ingredient search. No-match and did-you-mean states are edit-distance based.

**Nav is THREE items:** Remedies · Products · Safety — plus ever-present search. **Problems** are reached by search, situation cards and cross-links (not a nav tab); **How-we-grade** from every bucket badge (deep-linked) and the footer. Breadcrumbs on every page (root exempt; mobile truncates to "‹ Parent"). *(This supersedes the earlier five-item nav — remedies · products · problems · safety · how we grade.)*

**Four page types carry the site:** remedy (does the ingredient work), product (does this bottle deliver it), problem (I have this situation), safety. Everything else supports these.

Existing live-site strengths stay: safety-first routing, the guide, the context-not-graded cluster, the changelog. What goes: the stat row, the manifesto hero, the label checker's hero placement, S–F.

## C1. Document edits (step 1)

CLAUDE.md's non-negotiables contradict the new direction, and Claude Code is instructed to stop and flag conflicts. The six edits are listed in the step 1 prompt.

## C2. Content model

**Remedy** — replace `tier` with `bucket` (four values), keep everything else. Each source object needs the fields the study field renders from: sample size, effect direction, effect size, study quality, year, study type, identifier.

**Product** (new) — `{ id, name, brand, ingredients[{ remedy_id, amount, unit, form }], dose_match, third_party_tested{ organisation, verified_date }, label_discloses_all, proprietary_blend, form_matches_studied, retail_links[{ retailer, url, price, last_checked }], data_source, last_checked, assessment_state }`.

`assessment_state` is one of *fully assessed · label known, not yet assessed · not in database* — the interface renders honestly against it rather than implying uniform coverage.

**Brand** (new, minimal) — name, slug, product list; the brand page derives its summary from the products.

## C3. Build items

**`/go/{product-id}`** — server-side redirect, click logged, one place to add affiliate tags later, build check against hardcoded retailer URLs in content.

**Study-field generator** — build-time SVG over the sources array using Claude Design's mapping rules. Three sizes. SVG not canvas: points stay in the DOM for crawlers, screen readers, hover targets and theming.

**Share images** — satori (HTML/CSS → SVG) plus resvg (SVG → PNG), so cards are written as components and generated at build.

**Search** — one index across all content types, grouped mixed results with bucket badges. Client-side index if the corpus stays small; otherwise a hosted service.

**Dusk mode** — CSS custom-property theme swap keyed to local sunset plus stored preference, `prefers-color-scheme` fallback, inline head script against flash-of-wrong-theme.

**Citation popover + resolver** — one component over structured sources; the resolver runs in CI and writes back the last-verified date the popover displays.

**Freshness** — flag product data over three years old, quarantine at six; same mechanism drives "last checked" tags site-wide.

## C4. Product data pipeline

~50 researched products today; thousands needed for search-anything to feel real. **Label data can be largely automated; quality assessment cannot.** Build the first as a pipeline, the second as an editorial process. A product can exist in search with just label facts and an honest "not yet assessed" state — far better than an empty result.

*Structured label data:*
- **NIH Dietary Supplement Label Database (DSLD)** — free US government database of supplement labels with structured ingredient and dose fields, hundreds of thousands of products. Highest-leverage source.
- **TGA's Australian Register of Therapeutic Goods (ARTG)** — every supplement legally sold in Australia carries an AUST L number and a public register entry with ingredients and quantities. Nobody has built a consumer-facing layer over it; genuine local advantage.
- Retailer listings (iHerb, Chemist Warehouse, Amazon) for products absent from both — messiest, needs parsing and human checking.

*Independent quality signals:*
- Certification registries — **USP Verified**, **NSF** (including Certified for Sport), **Informed Choice / Informed Sport** — all publish searchable lists.
- Independent testing from **Labdoor** and **ConsumerLab** (subscription) where it exists.
- Manufacturer certificates of analysis — presence or absence is itself a scoreable fact.
- Regulatory actions and recalls (FDA warning letters, TGA recalls).

*Derived fields you compute yourself* — the join no other database performs: does the dose match what studies used · is the active part quantified · is it hidden inside a proprietary blend · is the form the one that was tested (magnesium glycinate versus oxide; slow-release versus regular melatonin).

## C5. What not to build yet

Membership and paywall, the Lens, community reports, the stack builder, PWA polish. All were ahead of product-market fit in the original plan and are further behind it now that products and search have become the centre of gravity. The label checker survives only as the not-in-database fallback in step 7.

One open question this revision doesn't settle: whether membership survives alongside retail links, and if so what someone would be paying for once the content is free and the products are searchable. Worth answering before any of Phase 5 gets built.
