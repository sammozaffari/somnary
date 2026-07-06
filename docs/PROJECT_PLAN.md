# Project Plan — Somnary

> **SUPERSEDED IN PART (2026-07-06).** This plan is historical rationale. Where
> it conflicts with CLAUDE.md's locked decisions (D1–D4) or the strategy
> package at `/docs/strategy/` (01–07), those win. Superseded here and marked
> inline below: **membership/paywall monetization** (§1.2, §2 items 4–5, §5c,
> §6, §11.8 — replaced by D2 tools-first), **stack builder / the Lab** (§2
> item 4, `/lab` URL, §8, §11.10 — killed by D4), **lowercase `somnary.`
> branding** (title, §1.3, §7 — replaced by D3 capitalized "Somnary"),
> **soft-light lavender/sage design** (§7 — replaced by DESIGN_SYSTEM v2
> evidence-teal), **Next.js option** (§8 — D1 locks Astro), and **remedy-first
> IA framing** (§2 — strategy doc 03 makes the IA decision-first). Everything
> else — grading rubric, citation discipline, remedy template, catalog scope,
> editorial workflow, compliance — remains current thinking.

*An independent, evidence-graded sleep & natural-remedies wiki.*
*Working model: reptides' rigor and trust architecture, ~~der-lukas's soft-light gallery aesthetic, monetized by membership~~ (not commerce, not affiliate). **[SUPERSEDED: evidence-teal design per DESIGN_SYSTEM v2; tools-first funding per D2.]***

**Name:** ~~somnary (always lowercase; wordmark `somnary.` with trailing period)~~ **[SUPERSEDED by D3: "Somnary" capitalized; wordmark `Somnary.`]** From *somnus* (sleep) + the *-ary* of library/repository — "the sleep reference."

---

## 0. The one-sentence thesis

The sleep-supplement internet is a marketing floor. This is the evidence layer: every natural sleep remedy graded S–F by the strength of published human evidence, every claim footnoted to a real study, zero affiliate links, zero brand money.

Everything below serves that sentence. If a feature doesn't reinforce *independent + evidence-graded + honest about uncertainty*, cut it.

---

## 1. Positioning & brand

### 1.1 The enemy (you need one)
Name what you're against, the way reptides strikes through "a sales floor." Candidates: "supplement-aisle pseudoscience," "the wellness-influencer dose," "proprietary-blend fog." Pick one and build the hero around striking it out.

### 1.2 Trust mechanism (this replaces a sales pitch)
Because you're NOT doing affiliate/commerce, your credibility rests on disavowals you can prove:
- **zero affiliate links** — and mean it (no rel=sponsored anywhere)
- **zero brand sponsorship** — no supplement company pays you
- **reader-funded only** — ~~membership is the sole revenue~~ **[SUPERSEDED by D2: tools-first — clinician handout exports, label-checker pro, supporter tier]**
- **0 hallucinated citations** — every reference resolves to a real, checkable source (PubMed ID / DOI / registry)
- **claims labeled, never buried** — weak evidence is shown as weak, not hidden

These become your homepage stat row (mirroring reptides' "56 / 1,576 / 0 / $0").

### 1.3 Name & voice
> **[SUPERSEDED by D3]** Brand is capitalized **"Somnary"** in prose, UI, and wordmark (`Somnary.` with trailing period). The lowercase styling below is retired.
- **Name: somnary.** Coined from *somnus* (sleep) + *-ary* (library/repository) — reads as "the sleep reference." ~~Always lowercase; wordmark is `somnary.` with a trailing period (mirrors `reptides.`).~~
- Voice: calm, declarative, skeptical-but-fair. Lowercase display type. Short sentences. No hype adjectives. Cite or don't claim.
- Tagline pattern: "Somnary · [N] remedies graded, [M] sources cited · zero brand money."
- **Before launch:** verify the .com/.co domain is free and run a trademark check (USPTO + IP Australia) since the name is now locked.

### 1.4 The honesty firewall (critical for this category)
Sleep supplements are **ingestibles people actually take**, unlike peptides' "research use only" fig leaf. That raises your duty of care and legal exposure. Bake in:
- "Educational, not medical advice. Talk to a clinician, especially if pregnant, on other medications, or managing a health condition."
- Hard separation between **published evidence** (sets the grade) and **community/anecdote** (never moves the grade).
- Explicit **interaction & safety** surfacing — for this category that's a feature, not fine print (see §4.5).

---

## 2. Information architecture

Mirror reptides' "six ways to read," retargeted. Job-to-be-done framing, numbered.

1. **The Tier Board** *(free, the hook)* — every remedy ranked S–F by evidence. Shareable leaderboard.
2. **The Wiki** *(free)* — one page per remedy. The core content unit. (Template in §4.)
3. **By Outcome** *(free)* — goal-first entry: fall asleep faster / stay asleep / sleep quality / anxiety-driven insomnia / jet lag & shift work / next-day grogginess / vivid-dream or REM concerns.
4. ~~**Build Your Stack / The Lab** *(free walkthrough, paid export)* — combine remedies, see aggregate evidence grade + interaction warnings.~~ **[SUPERSEDED by D4: stack builder killed. Only the interaction-warning engine survives, inside the compare tool + safety router. Never a combine-your-stack surface.]**
5. ~~**The Briefs** *(paid membership)* — long-form deep dives~~ **[SUPERSEDED by D2: no membership paywall. Deep dives publish free; revenue = clinician handouts / label-checker pro / supporter tier.]** (the melatonin-timing dossier, the magnesium-form question, the ashwagandha-standardization mess).
6. **The Methodology** *(free)* — grading rubric, source hierarchy, citation audit, corrections policy. The editorial spine.
7. **Community Reports** *(free to read at thresholds)* — anonymous structured self-reports, sits beside evidence, never grades.
8. **The Dispatch** *(free newsletter)* — monthly top-of-funnel.
9. **Ask** *(assistant)* — answers only from your cited corpus (RAG). Inline "ask" buttons throughout.
10. **Search** *(free, sitewide)* — see §2a. Command-palette + crawlable results page over the whole corpus.

## 2a. Search (sitewide)

Search is a first-class navigation surface, not an afterthought — with a large catalog (§5) it becomes the primary way people find a specific remedy, outcome, or symptom.

- **Two surfaces, one index:** a `⌘K`/`/` **command palette** (fast, keyboard-first) AND a server-rendered **`/search?q=` results page** (deep links, no-JS, SEO/crawlable). Both read the same index. See DESIGN_SYSTEM §2.13 + §3.7.
- **Index source:** built at build time from the structured content (remedy frontmatter, outcomes, interventions, briefs) — never hand-maintained. Rebuilds whenever content changes so it can't drift from the corpus.
- **Searchable fields:** remedy name + aliases/synonyms (e.g. "ashwagandha" ↔ "withania somnifera" ↔ "indian ginseng"), tier, key compound, outcomes, symptoms ("can't stay asleep", "jet lag"), and intervention names. Synonym/alias mapping is essential — people search the common name, the latin name, or the brand.
- **Grouped results:** remedies · outcomes · interventions · briefs, each result showing its tier badge so evidence quality reads at a glance even in search.
- **Ranking:** exact name > alias > outcome/symptom match > body. Tier does NOT boost ranking (an F-grade remedy must still be findable by name) — search is navigation, not endorsement.
- **Tech:** client-side fuzzy index (e.g. FlexSearch/Fuse/Pagefind) generated from the content at build; Pagefind is attractive because it's SSG-native and crawl-aligned. Keep the index small and lazy-loaded.

### URL scheme
- `/` home
- `/tiers` board
- `/r/{slug}` remedy pages (e.g. `/r/melatonin`)
- `/outcome/{slug}`
- ~~`/lab` stack builder~~ **[SUPERSEDED by D4 — never build]**
- ~~`/briefs` + `/briefs/{slug}`~~ **[SUPERSEDED by D2 — no paid briefs]**
- `/methodology`
- `/community` + `/community/{slug}`
- `/search` (results page; palette is global overlay)
- `/interventions` + `/interventions/{slug}` (non-supplement sleep aids — see §5a)
- `/about`, `/terms`, `/privacy`, `/disclosure`

---

## 3. The grading system (your core IP)

Two **separate** rubrics. Keep them separate or the whole thing loses integrity.

### 3.1 Remedy grading (S–F) — by published human evidence
Each tier needs: a one-line definition, evidence-gate "chips" (auditable at a glance, like reptides), and example remedies.

- **S — Proven.** Multiple large human RCTs + meta-analyses, consistent clinically-meaningful effect, well-characterized safety. *(Honestly, few natural sleep remedies reach this. That honesty is the point.)*
- **A — Strong.** Several RCTs, meta-analytic support, effect real if modest, good safety. *(e.g. melatonin for sleep-onset latency / circadian timing.)*
- **B — Viable.** ≥1 decent RCT or strong consistent smaller trials; human data present but thin. *(e.g. magnesium, L-theanine, tart cherry, ashwagandha for sleep.)*
- **C — Mixed.** Interesting mechanism, small/underpowered or conflicting human data; popular beyond its evidence. *(e.g. valerian, glycine, lemon balm.)*
- **D — Weak.** Minimal human evidence; claims outrun data; mostly animal/in-vitro. *(e.g. passionflower, many "sleep blend" botanicals.)*
- **F — Avoid / Caution.** Documented safety concerns or effectively zero rigorous human evidence behind active claims. *(e.g. kava — hepatotoxicity history; high-dose anything with interaction danger.)*

**Evidence-gate chips** (the clever part — make the grade self-documenting):
`meta-analysis exists` · `≥1 RCT n≥100` · `effect size reported` · `studied dose matches market products` · `standardized extract` · `no major safety signal` · `independent replication`

### 3.2 The category-specific killers (must be graded explicitly)
Botanicals fail in ways pills don't. Surface these as scored dimensions:
- **Standardization** — is the active constituent quantified? (withanolides in ashwagandha, valerenic acid in valerian, L-theanine purity). Unstandardized = automatic downgrade.
- **Dose-match** — do real products contain the dose that was actually studied? (Huge gap in this industry.)
- **Proprietary-blend penalty** — "sleep blend 500mg" with no per-ingredient breakdown = downgrade, because the claim is unfalsifiable.
- **Form/bioavailability** — magnesium glycinate vs oxide; melatonin IR vs ER; matters enormously.

### 3.3 Brand/product QA grading (optional second module — your "vendor list" analog)
Same falsifiable spirit as reptides' vendor audits, retargeted to supplement QA:
- Third-party tested? (NSF Certified for Sport, USP Verified, Informed Choice, ISO-17025 lab)
- Public COAs per batch (identity, potency, heavy metals, pesticides, microbial)?
- Label accuracy / no proprietary-blend obfuscation
- Standardization disclosed
- "Path to higher grade" stated per brand
- **Note:** doing this without affiliate links is exactly what makes it credible. You grade brands but earn nothing from them.

### 3.4 Citation discipline (the "cite or don't claim" engine)
- Every factual claim links to a real source: PubMed ID, DOI, or registry (ClinicalTrials.gov).
- Source hierarchy published: meta-analysis/systematic review > RCT > cohort > case series > animal > in-vitro > anecdote.
- Highest-tier available source wins; lower evidence is *labeled as such*, not omitted.
- A "claim check" counter (claims verified vs total) shown site-wide.
- Corrections policy with a public turnaround (reptides promises 24h).

---

## 4. The remedy page template (every wiki entry inherits this)

This is the most-visited page type; design it once, perfectly.

1. **Header** — name (lowercase), tier letter (color-coded), one-line verdict.
2. **Verdict block** — 2–3 sentences: what it's for, what the evidence actually supports, the honest caveat.
3. **Claims vs. Data table** — left: what sellers/influencers claim; right: what studies show; each row footnoted. *(This is the signature reptides move — keep it.)*
4. **Evidence summary** — key trials, sample sizes, effect sizes, meta-analytic conclusions. Plain-language.
5. **Dosing reality** — studied dose, timing, form/bioavailability, how that compares to typical products.
6. **Safety & interactions** — side effects, contraindications, drug interactions, dependency/tolerance, pregnancy. **Prominent, not buried.**
7. **Standardization note** — what to look for on a label (the constituent %, the form).
8. **Mechanism** — brief, honest about what's established vs hypothesized.
9. **Sources** — full footnote list, every one resolvable.
10. **Community read** — anonymous self-report aggregate, clearly walled off from the grade.
11. **Ask** — inline assistant scoped to this remedy's corpus.
12. **SEO furniture** — question-format title ("does magnesium actually help you sleep?"), custom OG image per remedy, canonical URL, schema.org markup.

---

## 5. Content scope (catalog)

The catalog is the moat. It must go **deep and wide** — far beyond the handful of remedies every blog covers, into niche and traditional ones nobody has graded honestly. Breadth is a feature: the long tail is where the SEO lives and where "we cover the thing no one else bothered to" becomes the reason to trust the site. But every page still needs real citations, so growth is phased, not dumped.

### 5.1 Launch tier (do these properly first — ~25–30)
Depth over breadth at launch. These are the high-traffic, high-evidence-or-high-confusion entries that prove the template and rubric.

**Likely A/B (strongest evidence):** melatonin, magnesium (glycinate/threonate), L-theanine, ashwagandha, tart cherry/montmorency, glycine.
**Likely C:** valerian, lemon balm, GABA, 5-HTP, magnolia bark, L-tryptophan, apigenin/chamomile.
**Likely D:** passionflower, hops, lavender (oral + aromatherapy), skullcap, "sleep blends," CBD.
**Likely F / caution:** kava (hepatotoxicity), high-dose melatonin in children without guidance, serotonergic stacking risks.

### 5.2 Expansion catalog (the long tail — ongoing, target 100+ over time)
Grade the niche and the traditional, the under-studied and the over-hyped. Honest D/F grades here are *content*, not filler — "popular but unproven" is exactly what people are searching to find out. Non-exhaustive seed list:

- **Amino acids / neurotransmitter precursors:** taurine, theanine+caffeine combos, tryptophan vs 5-HTP, GABA vs phenibut *(phenibut = strong caution/F — dependence)*, picamilon.
- **Minerals / vitamins:** magnesium (all forms compared), zinc, vitamin D, iron (RLS-related), calcium, potassium.
- **Western botanicals:** valerian, hops, passionflower, lemon balm, lavender, chamomile, skullcap, California poppy, ashwagandha, kava, St John's wort *(interaction caution)*, ziziphus/jujube, magnolia bark/honokiol.
- **Traditional Chinese / Ayurvedic:** suanzaoren (ziziphus), reishi, schisandra, polygala, albizia, brahmi/bacopa, jatamansi, shankhpushpi, tagara (Indian valerian).
- **Hormonal / circadian:** melatonin (IR vs ER, micro-dose vs mega-dose), agomelatine-adjacent naturals, ramelteon *(Rx — context page)*.
- **Other compounds:** glycine, L-ornithine, apigenin, PEA-luteolin, CBD/CBN/cannabinoids for sleep, inositol, saffron (affron), tart cherry, kiwifruit, lactium/casein peptides, astaxanthin+lycopene, NAD-adjacent claims.
- **The honest "probably not" file:** valerian-root megadoses, homeopathic sleep aids, "moon milk" blends, most proprietary gummy stacks, CBD-isolate-only products — graded D/F with the evidence shown.

Maintain a **content index** (CSV/JSON) of every planned entry: name, aliases/latin name, planned tier, research status (not-started / drafting / cited / reviewed / live), and source count. This drives the build checklist and the search index.

### 5a. Non-supplement interventions (`/interventions`)

A major differentiator: the strongest sleep evidence often isn't a pill. Covering behavioral, environmental, and device interventions — graded on the *same* S–F evidence rubric — makes Somnary the honest one-stop reference and quietly reinforces the thesis (we follow evidence, even when it says "don't buy a supplement"). Many of these will out-grade the supplements, which is the point.

Seed list (each gets a page on the §4 template, adapted):
- **Behavioral (typically highest evidence):** CBT-I (cognitive behavioral therapy for insomnia — likely S/A, first-line), sleep restriction therapy, stimulus control, sleep hygiene (honest about its modest standalone effect), worry/constructive-rumination journaling, paradoxical intention.
- **Light & circadian:** morning bright-light exposure, light therapy boxes, evening blue-light reduction/glasses *(honest — evidence is weaker than marketed)*, dawn-simulation alarms, consistent wake time.
- **Environmental:** temperature/cooling (mattress cooling, room temp), sound (white/pink noise, earplugs), darkness/blackout, bedding.
- **Body-based:** exercise timing, warm bath/shower before bed (the "warm-bath effect" has real RCTs), weighted blankets, breathing protocols (4-7-8, slow breathing), PMR, yoga nidra/NSDR.
- **Consumables-as-behavior:** caffeine timing/cutoff, alcohol's real effect on sleep architecture, meal timing, kiwifruit/tart-cherry-juice as food.
- **Devices & tracking:** wearables/sleep trackers *(honest about accuracy + orthosomnia risk)*, CES devices, apps.
- **Context/medical pages (clearly labeled, not graded as remedies):** when to see a doctor, sleep apnea/CPAP, RLS, prescription hypnotics overview (z-drugs, DORAs, antihistamines) — purely educational, pointing to clinicians.

### 5b. The deep-research mandate

Breadth this large only works if the research is real (it's the whole brand). Bake in a research engine:
- **Source-first, always.** Pull meta-analyses, systematic reviews, and Cochrane first; then RCTs; grade only after reading. Never write to a predetermined grade.
- **A periodic deep-research pass.** On a set cadence (e.g. quarterly), commission a structured literature sweep — new trials, retractions, updated meta-analyses — and move tiers accordingly, logged publicly ("how rankings change").
- **A research backlog**, prioritized by search demand: when people search for a remedy/intervention that isn't covered yet, that's the signal for the next deep-research target. (Search query logs → content roadmap.)
- **Look beyond the obvious.** Actively hunt the under-covered: traditional-medicine botanicals with real trial data, food-based interventions, and the behavioral/device space — areas supplement-affiliate sites ignore because there's nothing to sell.
- **AI-assisted, human-verified.** Drafting and synthesis can be AI-accelerated, but every PMID/DOI is human-checked to resolve AND to actually say what the page claims. "0 hallucinated cites" is the hard gate (see §3.4, §9).

### 5c. Briefs & outcomes (as before)
**By-outcome guides:** 7–10 to start (see §2).
~~**Briefs (paid):** 8–12 deep dives to justify membership at launch.~~ **[SUPERSEDED by D2: deep dives publish free.]**

Each page needs real citations — budget research time accordingly (see §9).

---

## 6. Monetization

> **[SUPERSEDED IN FULL by D2 (2026-07-06).]** No membership paywall on the
> wiki, ever. Revenue candidates in order: clinician handout exports,
> label-checker pro features, supporter tier. Zero affiliate and zero brand
> money still stand. The section below is retained for history only.

reptides' exact model, since you scrapped affiliate:
- **Free:** tier board, wiki, outcomes, methodology, community (at thresholds), dispatch newsletter.
- **Membership (paid):** all briefs (current + future), stack export/PDF, unlimited Ask, member updates.
- **Pricing pattern:** annual (~$X/yr presented as $Y/mo billed yearly, "2 months free") + a hard-capped **lifetime** tier with real scarcity ("100/100 claimed → sold out"). Lifetime funds early development; annual sustains.
- **Funnel:** Dispatch newsletter → free wiki authority → brief teasers (label FREE vs 🔒) → membership.
- **No commerce, no affiliate, no brand money** — repeat it everywhere; it IS the product.

---

## 7. Visual & UX direction (soft-light, der-lukas-flavored)

> **[SUPERSEDED IN FULL (2026-07-06).]** The design direction is now the
> evidence-teal system in `/docs/DESIGN_SYSTEM.md` v2, rewritten from the
> user-accepted v3 prototype (`/docs/html-prototype/`). Soft-light
> lavender/sage, lowercase display type, and der-lukas gallery framing are
> retired. §7.5 (mobile-first, SSR/SSG crawlability) remains binding.

### 7.1 Palette
- Base: warm off-white (#F7F5F0-ish), not stark white.
- Text: warm near-black (#1A1A1F).
- Accents: muted lavender + sage, low saturation. Calm, sleep-appropriate.
- Tier colors: keep them distinguishable but **desaturated** to fit the soft palette (S through F still reads as a spectrum, just gentler than reptides' neon).

### 7.2 Layout language (from der-lukas)
- Generous whitespace, gallery/showcase grid for the tier board and outcome cards.
- **Metadata sidebar** per remedy card (der-lukas's "Role / Deliverables / Created with" → your "Grade / Key compound / Studied dose / Best for / Safety flag").
- Restrained, systematic type. One strong display face for headers, clean sans for body.
- Calm, gentle motion — soft fades and subtle loops, NOT reptides' dense terminal energy. Motion should feel like settling, not buzzing.

### 7.3 Narrative technique (from Ziffer) — reserved for briefs
Long-form brief pages use Ziffer's scrollytelling: question-header → short paragraph → single big stat moment → visual. Keep the catalog calm and gallery-like; let the deep dives tell stories.

### 7.4 Components to design
Tier letter badge · evidence-gate chip · claims-vs-data table · remedy card (with metadata sidebar) · outcome card · stat counter row · footnote/citation popover · Ask inline button · paywall teaser · community progress bar · safety/interaction callout.

### 7.5 Platform
- Mobile-first, PWA-capable (reptides set every apple-mobile meta tag and shipped an iOS app — the board-in-your-pocket is a real retention play).
- Fast. Pre-render remedy pages for SEO (reptides' SPA hides content from crawlers — don't repeat that mistake; use SSR/SSG so Google sees the cited content).

---

## 8. Technical build

- **Stack:** SSR/SSG framework (~~Next.js /~~ Astro **[D1 locks Astro]**) so content is crawlable — this is non-negotiable for an SEO-driven evidence site.
- **Content model:** structured (CMS or MDX) — remedy = {tier, verdict, claims[], data[], doses[], safety[], sources[], aliases[]}. Structure enables the tier board, ~~stack builder,~~ **[D4]** search, and Ask to all read the same data. Interventions reuse the same schema (adapted fields). *(Current schema lives in CLAUDE.md's content model + `src/content.config.ts`.)*
- **Design system:** locked in `/docs/DESIGN_SYSTEM.md` (~~v1.2~~ **v2.0 evidence-teal**). Build against named tokens only — see that file's guardrails. Never invent colors/spacing/type.
- **Search index:** generated at build time from structured content (Pagefind/FlexSearch/Fuse). Indexes names + aliases/latin names + outcomes + symptoms. Crawlable `/search` page + `⌘K` palette read the same index. See §2a + DESIGN_SYSTEM §2.13/§3.7.
- **Citations as data:** store each source with PMID/DOI so you can auto-validate links resolve (your "0 hallucinated cites" guarantee needs a checker).
- **Ask (RAG):** embed only your own cited corpus; the assistant must refuse or hedge when the corpus doesn't cover something — never invent. Cite back to source on every answer.
- **Community reports:** anonymous, no PII, structured fields, threshold-gated reads, stored separately from the graded corpus.
- **SEO:** per-page canonical, custom OG images, schema.org (Article / FAQ / MedicalWebPage), question-format titles.
- **Analytics & privacy:** privacy-respecting analytics; clear privacy policy (you're handling health-adjacent interest data). Log search queries (anonymized) to feed the content backlog (§5b).

---

## 9. Editorial workflow (the part that actually takes time)

The credibility is in the research, and it can't be faked since you chose real citations.
- **Source-first drafting:** pull the studies before writing a word. Meta-analyses and Cochrane reviews first.
- **Two-pass grading:** draft grade from evidence → second reviewer checks against rubric → grade locked with rationale.
- **Claim-check log:** every claim mapped to its source; track verified/total publicly.
- **Citation audit:** automated check that every PMID/DOI resolves; manual check that it says what you claim it says (no hallucinated cites means no AI-invented references — verify each).
- **Update cadence:** tiers move when new trials land; log changes ("how rankings change").
- **Corrections:** public inbox, stated turnaround.

---

## 10. Legal, safety, compliance (heavier than peptides — do not skip)

- **Medical-advice disclaimer** site-wide and per-page.
- **Claims compliance:** avoid disease-treatment claims (FDA/FTC in US; TGA in Australia, where you are — TGA is strict on therapeutic claims for supplements). Describe evidence, don't promise outcomes.
- **Interaction warnings** prominent (serotonergic stacking, sedative interactions, St. John's Wort's CYP450 interactions if covered, kava hepatotoxicity, pregnancy/breastfeeding).
- **Vulnerable groups:** explicit guidance to consult clinicians; care around children and melatonin.
- **No PII** in community reports; GDPR/Australian Privacy Act-aware privacy policy.
- **Affiliate disavowal** stated and true; if it ever changes, disclose loudly.

---

## 11. Launch sequence

1. **Foundation:** repo scaffold, design tokens wired from DESIGN_SYSTEM.md, methodology page (publish the rubric FIRST — it's your credibility), legal pages.
2. **Template:** build and perfect ONE remedy page end-to-end (melatonin — strongest evidence, best SEO). All 12 blocks.
3. **Core catalog (launch tier):** ~25–30 remedy pages with real citations (§5.1).
4. **Search:** stand up the build-time index + `⌘K` palette + `/search` page once enough pages exist to make it useful. (It scales with the catalog, so wire it early.)
5. **Tier board + outcomes:** once enough pages exist to populate them.
6. **Interventions:** first batch of non-supplement pages (CBT-I, light, temperature, breathing) — §5a. These often out-grade supplements and strengthen the thesis.
7. **Dispatch newsletter:** start collecting emails from day one.
8. ~~**Briefs + membership + paywall:** launch paid layer once free content proves authority.~~ **[SUPERSEDED by D2: revenue = clinician handouts / label-checker pro / supporter tier, per BUILD_CHECKLIST Phase 6.]**
9. **Expansion catalog (ongoing):** grow toward 100+ via the deep-research engine (§5b), prioritized by search-demand backlog.
10. ~~**Stack builder,**~~ **[D4]** Ask, community, app: post-launch, in roughly that order.

---

## 12. What makes or breaks this

- **The methodology page is the product.** Publish it before anything else. If the rubric is convincing, the grades are trusted.
- **Honesty about weak evidence is the moat.** Most natural sleep remedies have thin data. Saying so — clearly, with citations — is what no supplement brand will ever do, and it's exactly why your audience comes to you.
- **Never let anecdote touch the grade.** The firewall between community reports and evidence grades is the whole integrity story.
- **SSR or you're invisible.** reptides' SPA hides its content from search; an SEO-funded site can't afford that.
- **Real citations, verified.** "0 hallucinated cites" is a promise you must engineer, not just say.

---

*Next deliverables I can produce on request: (a) the methodology page as finished copy + the full scored rubric with weights; (b) the melatonin remedy page as a clickable soft-light prototype; (c) the tier-board homepage mockup in the warm off-white palette.*
