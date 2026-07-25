# Source scorecards — "assume zero knowledge" IA redesign (EWG-inspired)

**Status:** proposal for owner review. Brief from the owner (2026-07-25): people don't know why
sourcing matters ("why should I care?"), each page should teach what to look for / steer clear of
in an ingredients list, and the overall IA/UI should assume no prior knowledge — study
EWG Skin Deep (product + ingredient pages) and take inspiration.

Reference pages studied in detail:
- https://www.ewg.org/skindeep/products/1057200-maybelline-liquid-concealer-70/
- https://www.ewg.org/skindeep/ingredients/700868-BUTYLPARABEN/

---

## 1 · What EWG does that we should learn from

| # | EWG pattern | What it does for a novice | Somnary today |
|---|---|---|---|
| 1 | **Teach the scale first** — a persistent 1–10 Best→Worst colour legend at the very top of every page, before any product | You can read any score before you've seen one | Tier meanings are buried in a prose paragraph mid-page |
| 2 | **One giant colour-coded score chip** beside the product name | 2-second verdict, visible even out of context | A card's tier is only knowable from which *section* it sits in — the card itself carries no tier |
| 3 | **Data-availability honesty** under every score ("Data: Robust / Limited") | Trust through humility — says how much is known | Implicit only (in "provisional" notes and held items) |
| 4 | **Concern-first framing** — "Cancer — MODERATE", "Allergies — HIGH" in human words, *before* any methodology | Leads with what a human worries about, not how the org scores | We lead with six methodology dimensions ("Label accuracy 0/5") |
| 5 | **Ingredient drill-down** — every ingredient scored + expandable; each has its own page with synonyms, a plain hazard sentence, a bright-line "Unacceptable" rule, and "find products with this ingredient" reverse lookup | The Butylparaben page IS the "steer clear" education | We have a cited additive watchlist **in data** (`additive-watchlist.yaml`, Phase A, owner-ratified) but never render it |
| 6 | **Tabs** — Ingredient concerns / Label information / Certifications | Chunks a dense page | One long expandable per card |
| 7 | **Mission line** — "Know your environment. Protect your health." | The why-care, one sentence, everywhere | Our banner says what we're *not* (no affiliate) but not why the reader should care |

**What we will NOT copy:** EWG's "BUY ON AMAZON" affiliate button (D2: zero affiliate, ever — our
no-affiliate banner is a differentiator and stays), their donation/email interrupts, and their
1–10 numeric hazard score (our 4 trust tiers are already ratified; a second number would confuse).

---

## 2 · The plan, phased

### Phase A — "Why should I care?" hook  *(owner ask #1 · compliance + citation gates)*
A short, calm, **cited** strip directly under each page's dek — the mission moment:

> **Why this page exists.** Supplements are far more lightly regulated than medicines: in
> Australia most are "listed" (AUST L) — recorded, not tested — and imports aren't checked at
> all. Independent tests keep finding gaps between the label and the bottle: a published analysis
> of 30 melatonin products found actual content ranged from −83% to +478% of the label
> [PMID 28095978]; a 2023 JAMA analysis of melatonin gummies found some brands at 347% of label
> [PMID 37097356]; and Australia's regulator is actively acting on vitamin-B6 supplements after
> 250+ nerve-damage reports. None of that says supplements are bad — it says **the label is a
> claim, not a guarantee**, and that's exactly what this page rates.

- Every stat cites a resolvable primary source (PMIDs above + the TGA B6 safety page we already
  cite in data). Citation-auditor must pass.
- Tone rule (rulebook): describe evidence, never alarm; no "junk/danger" language.
- One shared component (`WhyCareStrip.astro`), ingredient-specific stat swapped per page
  (melatonin pages lead with the melatonin studies; magnesium with the B6 enforcement; ashwagandha
  with the liver advisory + tampering recall; valerian with the liver advisory; glycine with the
  food-not-medicine gap).

### Phase B — "Reading the label" panel  *(owner ask #2 · compliance gate)*
A high-level, two-column panel near the top of each page (before the grid):

**✓ On the label, look for** / **⚠ What makes us cautious** — 3–5 plain bullets each, distilled
from our ratified findings. Example (magnesium):

- Look for: the amount of **each form** disclosed (not one combined number) · a named
  well-absorbed form (glycinate, citrate) · an **AUST L** number · any real third-party mark
  (NSF/USP) — only one product here has one.
- Cautious: **added vitamin B6** (the TGA is acting on it — tingling/numbness risk) · "high
  absorption" claims on mostly-**oxide** blends · "proprietary blend" hiding the split ·
  imports with no AUST L (no local oversight, no AU warnings).

- Everything derives from already-ratified scorecard content — no new claims; factual assertions
  reuse the citations already in the dossiers.
- Framing = label-reading education. Never "buy/avoid this product" (the no-recommendation line);
  bullets describe *label features*, not products.
- Component: `LabelReadingPanel.astro`; per-page content in each data module.

### Phase C — Teach the tiers + per-card tier chip  *(EWG patterns 1–2 · design gate)*
1. **Tier legend strip** at the top of every sources page (like EWG's scale bar): the four tiers
   in a compact horizontal band — icon + name + one-line plain meaning — always in the same order,
   readable without colour. The existing prose explanation collapses into this.
2. **Tier chip on every card**: small badge (icon + tier word) top-left of the image box, so a
   card screenshotted or seen alone still carries its verdict — today the tier lives only in the
   section header.
3. **Data-confidence line per card** (EWG pattern 3): one mono line under the cert summary, e.g.
   "Based on: label + TGA listing" / "label + public per-batch lab reports" / "label +
   directory-confirmed certification" — honest about how much stands behind the scores.

### Phase D — Additive drill-down pages  *(EWG pattern 5 · the biggest win, mostly built)*
We already own the data: `src/data/additive-watchlist.yaml` — owner-ratified in Phase A, every
entry cited (8 flagged + 2 explicitly not-flagged). Render it:
1. `/sources/additives` index — the watchlist as cards: plain-English name, what it is, why it's
   flagged (cited), synonyms to spot on a label (EWG's synonym idea — e.g. "pyridoxine
   hydrochloride" = B6; "FD&C Blue #2" = indigotine).
2. Each product card's flagged additive (B6 chips, the Vitamatic dye) links to its watchlist entry.
3. Reverse lookup on each entry: "Products on our scorecards that contain this" — the Butylparaben
   "find products" pattern, computed at build from existing data.
4. The two *not-flagged* entries matter as much (anti-alarmism: "sucralose — reviewed, not
   flagged — here's why").

### Phase E — later / on demand
- Tabs inside the expanded card (Concerns / Label / Certifications) — hold: the owner may redesign
  the card layer anyway.
- A "concern-first" reframe of the six dimensions into human questions is already half-done (the
  plain-language legend); revisit after A–D land.

## 3 · Sequencing & gates
A and B are copy-heavy (compliance + citation-auditor gates, PR each). C is design (design-guardian).
D is a new page type (design + compliance + citation-auditor; no new claims — renders ratified data).
Recommended order: **B → A → C → D** (B is the owner's most concrete ask and pure distillation;
A needs the two PMIDs verified end-to-end; C touches every page; D is the biggest but independent).

## 4 · Fixed en route
The "Why these scores" meters clipping on narrow cards (owner screenshot) — fixed in PR #115
(container query: 1-col meters on narrow cards) together with a "full full" copy de-dupe.
