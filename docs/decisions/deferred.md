# Deferred Work

Scoped out deliberately, not overlooked. Each entry: what it is, why it matters, what it would
cost, what was done instead, and what breaks in the meantime.

Estimates come from the IA audit's scale — **XL is three to six weeks full-time**, L is one to
two weeks. At the available budget these were not achievable alongside the rest of the portfolio.

---

## Canonical entity IDs and per-form dose modelling

**What:** ingredient, form, intervention, product, brand, and product-ingredient as first-class
entities with canonical IDs. Evidence attaching at the level a study actually supports, with an
applicability state — `exact_form`, `ingredient_level`, `unclear_form`, `not_transferable`.

**Why it matters:** magnesium glycinate, citrate, threonate, and oxide differ in bioavailability,
evidence base, and effective dose. The current model treats magnesium as one remedy with aliases,
so a product's form string cannot join to the right evidence claim, and form-specific dose
distinctions cannot be compared structurally.

**Cost:** XL. 20 of 31 remedies have multiple forms, covering 46 of 56 dose rows. The work is
domain judgement several hundred times over, not code.

**Done instead:** the label checker's dose rule (R3) now runs only for single-form remedies and
reports "dose check not applied" otherwise — cutting its coverage from 31 remedies to 11 rather
than applying a floor derived from the wrong form.

**Breaks meanwhile:** no dose check on 20 remedies including magnesium. Products cannot be matched
to form-specific evidence.

---

## EvaluationContribution — per-dimension source trails

**What:** a relation joining each product evaluation dimension to a source document, recording
the rule applied, the input fact, its effect on the score, the assessor, and the timestamp.

**Why it matters:** the product section promised "every point traces to a primary document." All
88 product routes render six score notes with no evidence links, and the schema has no
per-dimension citation field. Naming a dimension "testing and purity" does not make it traceable —
derivation gives reproducibility, traceability needs the source link.

**Cost:** XL, and the binding constraint isn't engineering — the source documents largely don't
exist. It's a research operation: chasing COAs, assay data, and regulatory records for 88 products.

**Done instead:** the traceability promise was corrected to match what the product delivers.

**Breaks meanwhile:** product dimension scores are assertions the reader cannot inspect.

---

## Interaction claims graph

**What:** interactions as records with two or more typed participants, direction, severity,
confidence, dose and population context, and evidence references.

**Why it matters:** interactions are free-text strings under a single remedy-level safety object.
The model cannot express "A + B is fine, A + B + C is not", nor direction, nor per-pair severity.
Pairwise claims must never be combined automatically into a statement about a triple.

**Cost:** XL plus ongoing clinical review.

**Done instead:** curated known warnings, explicitly incomplete, with an explicit
pharmacist/clinician handoff where safety cannot be established.

**Breaks meanwhile:** combination safety questions cannot be answered.

---

## Universal product and brand search

**What:** typed search across ingredient, form, intervention, outcome, product, brand, and
safety topic.

**Why it matters:** 88 of 166 routes are product scorecards and none appears in search. Someone
in a pharmacy aisle holding a bottle cannot find it by brand.

**Cost:** L. Poor entity resolution returns wrong SKUs, and result ranking must not conflate
remedy grades with product tiers — both risks argue for doing it after the entity model.

**Done instead:** a product browse-and-filter surface, typed and separate from remedy results —
roughly a quarter of the cost, neither risk.

**Breaks meanwhile:** no known-item product retrieval by brand.

---

## URL migration

**What:** `/ingredients/[slug]` and `/interventions/[slug]` replacing `/r/[slug]`;
`/products/[slug]` replacing `/sources/[category]/[product]`.

**Why it matters:** `/r/` hides entity type. `/sources/` collides with citation sources and nests
a product under one ingredient category, so a combination product has no honest home.

**Cost:** L plus content migration — 119 detail redirects, internal link rewrites, search index
and sitemap regeneration, external backlink risk. No visible design value.

**Done instead:** nothing. Canonical IDs can be introduced behind existing routes later.

**Breaks meanwhile:** route semantics remain ambiguous.

---

## Retailer offer model

**What:** retailer and offer as entities with listing identity, territory, price, availability,
`lastCheckedAt`, and dead/stale state.

**Why it matters:** 37 confirmed dead purchase URLs on the surface labelled "where to buy."

**Cost:** L plus continuous monitoring. It's an operation, not a build.

**Done instead:** a link checker that resolves purchase URLs, marks dead ones in the data, and
renders "listing unavailable — last checked [date]" instead of a broken link.

**Breaks meanwhile:** no price or availability data.
