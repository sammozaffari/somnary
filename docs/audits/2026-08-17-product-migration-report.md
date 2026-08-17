# Product migration report — source-scorecards → product/brand model (CHK-B3, 2026-08-17)

Migrated **93** ratified products into `src/content/products/` and **55**
brands into `src/content/brands/`. **0** unratified products were withheld (they never
rendered under the old publish gate either). 13 product name(s) had a dose token
stripped (strength is structured now). **57** products could not map a
deliveryForm from the label string (mostly magnesium, where the string holds the salt not the
shape — plan §1) and are `needs-review`. **1** combo products appeared under more
than one ingredient scorecard and were MERGED into one product carrying multiple `ingredients[]`
(one bottle, multiple actives) rather than duplicated.

## §7 owner decisions — FLAGGED, not resolved (CHK-Rprod.2, HUMAN-GATE)

The delivery-form schema plan (`docs/plans/2026-08-12-product-form-schema.md` §7) owes four
owner rulings. B3 built to the plan's stated assumptions where a structural choice was
unavoidable, and flags all four here rather than resolving them:

1. **Four-field split** (deliveryForm · releaseProfile · chemical/salt · combo) vs the literal
   two. *Built to the four-field split* — the two can't be clean while the salt shares the string
   (this migration proves it: 57 products have no shape in the label). Owner
   to confirm.
2. **Release-profile data source** for the fill: labels only (most land `not-stated`) vs pull
   from product pages. *Built labels-only* (so most products are `not-stated`, honest). Owner to confirm.
3. **Release profile at launch:** a visible consumer facet, or data-only feeding the
   form-matches-studied check? **Unresolved** — does not block the schema; a facet decision for B6.
4. **Plain label wording:** "Dissolvable (melt / lozenge)" vs "Melt / lozenge". **Unresolved** —
   the sample page uses "Dissolvable (melt / lozenge)" as a placeholder pending the ruling.

## Merged combo products (1)
- Blackmores — Sleep Sound Magnesium (glycine + magnesium)

Every product migrated with `assessment_state: "label known, not yet assessed"`: the label facts
(brand, name, structured strength, form where mappable, retail links) carried over, but the four
product-score checks are NOT derivable from the old 6-dimension model and are left null — to be
assessed editorially (CHK-E8), never guessed. The ingredient evidence bucket and the product
score stay two separate axes; no combined number exists in the data.

## deliveryForm needs-review (57)
- Caruso's — Ashwagandha 7500
- Nature's Way — Ashwagandha
- Switch Nutrition — KSM-66 Ashwagandha
- Herbs of Gold — Mind Ease
- Nature's Way — Sound Sleep
- Fusion Health — Stress & Anxiety
- Green Nutritionals — Shoden Ashwagandha
- Blackmores — Ashwagandha+
- Swisse — Ultiboost Ashwagandha Calm+
- Gaia Herbs — Ashwagandha Root
- NOW Foods — Ashwagandha Standardized Extract
- Emrald Labs — Ashwagandha KSM
- Bioglan — Ashwagandha Plus
- Caruso's — Ashwagandha + Sleep
- Oriental Botanicals — Anxiolift
- Nutricost — Ashwagandha KSM-66
- Nature's Own — Ashwagandha+
- Nature's Own — Mild Anxiety Ashwagandha
- Thorne — Ashwagandha
- Himalaya — Organic Ashwagandha
- Blackmores — Sleep Sound Magnesium Powder
- Ethical Nutrients — Mega Magnesium Night Powder
- Cabot Health — Magnesium Ultra Potent Powder
- Herbs of Gold — Magnesium Forte
- Swisse — Ultiboost Magnesium
- Bioglan — Active Magnesium PM
- Caruso's — Super Magnesium
- Swisse — Ultiboost Magnesium Glycinate
- Nature's Own — Magnesium + Sleep Effervescent
- BioCeuticals — Ultra Muscleze Night
- Doctor's Best — High Absorption Magnesium
- Ethical Nutrients — Mega Magnesium Powder
- Thorne — Magnesium Bisglycinate
- Nature's Way — High Strength Magnesium
- Nature's Own — High Strength Magnesium (3 forms)
- Nature's Own — Magnesium Glycinate
- Cenovis — Magnesium
- Wagner — Super Bio Magnesium
- Nutra-Life — Magnesium Complete Forte
- Healthy Care — Good Night Sleep with Magnesium + Ashwagandha
- Life Extension — Neuro-Mag Magnesium L-Threonate
- NOW Foods — Magnesium Glycinate
- Blackmores — Valerian Forte
- Caruso's — Valerian
- Thompson's — One-A-Day Valerian 2000
- Nature's Own — Valerian Forte 2000
- Blackmores — Deep Sleep
- Swisse — Ultiboost Sleep
- Nature's Own — Sleep Ezy
- MediHerb — Valerian Complex
- BioCeuticals — Sleep Complex
- Flordis — ReDormin Forte
- NOW Foods — Valerian Root
- Gaia Herbs — Valerian Root
- Cenovis — Easy Sleep Valerian 2000
- Solaray — Valerian Root
- Vitamatic — Valerian Root (High Potency)

## Per-product missing fields (93)
- **Natrol — Melatonin Time Release** `natrol-melatonin-5mg-time-release` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Benign ingredients; dose above the studied extended-release …"); howToTake; perIngredientAmountsDisclosed + other blend ingredients
- **Nature Made — Melatonin** `nature-made-melatonin-3mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives…"); howToTake
- **Nature's Bounty — Melatonin Dual Spectrum** `natures-bounty-melatonin-5mg-dual-spectrum` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives…"); howToTake
- **NOW Foods — Melatonin** `now-foods-melatonin-3mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives (two-ingredient)…"); howToTake
- **Life Extension — Melatonin** `life-extension-melatonin-300mcg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives…"); howToTake
- **OLLY — Sleep Gummy (Blackberry Zen)** `olly-sleep-gummy-3mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives (real sugar, natural color)…"); howToTake; perIngredientAmountsDisclosed + other blend ingredients
- **Nature's Truth — Extra Strength Melatonin Gummies** `natures-truth-melatonin-10mg-gummies` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives (natural colors, real sugar)…"); howToTake
- **CVS Health — Melatonin** `cvs-health-melatonin-5mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives (talc present, not flagged)…"); howToTake
- **Walgreens — Melatonin Liquid** `walgreens-melatonin-5mg-liquid` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Ingredient panel not captured…"); howToTake
- **Vitafusion — Melatonin Sugar-Free Gummy** `vitafusion-melatonin-3mg-gummy` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Maltitol (sugar-alcohol load)…"); howToTake
- **Thorne — Melaton-5** `thorne-melaton-5` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives…"); howToTake
- **Pure Encapsulations — Melatonin** `pure-encapsulations-melatonin-0-5mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "No flagged additives (two-ingredient)…"); howToTake
- **California Gold Nutrition — Melatonin** `california-gold-nutrition-melatonin-3mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Clean three-ingredient panel (cellulose, hypromellose, silic…"); howToTake
- **21st Century — Melatonin** `21st-century-melatonin-5mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Clean panel, no synthetic dye (+ calcium carbonate base)…"); howToTake
- **Swanson — Melatonin** `swanson-melatonin-3mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Two-ingredient vegan panel (rice flour, hypromellose)…"); howToTake
- **Vitamatic — Melatonin (Fast Dissolve)** `vitamatic-melatonin-10mg` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Fast-dissolve tablet with FD&C Blue #2, sucralose, mannitol …"); howToTake
- **Caruso's — Ashwagandha 7500** `carusos-ashwagandha-7500` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Highest disclosed withanolide in the set; full panel not pub…"); howToTake
- **Nature's Way — Ashwagandha** `natures-way-ashwagandha-6000` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Discloses its withanolide figure (15 mg); full panel not pub…"); howToTake
- **Switch Nutrition — KSM-66 Ashwagandha** `switch-nutrition-ksm66-ashwagandha` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-herb; discloses its withanolide figure (15 mg)…"); howToTake
- **Herbs of Gold — Mind Ease** `herbs-of-gold-mind-ease` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "KSM-66 + lavender; discloses its withanolide figure (15 mg)…"); howToTake
- **Nature's Way — Sound Sleep** `natures-way-sound-sleep` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "KSM-66 but withanolide figure NOT disclosed; full panel not …"); howToTake
- **Fusion Health — Stress & Anxiety** `fusion-health-stress-anxiety` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "6-herb combo, each herb dosed; withanolide figure not disclo…"); howToTake
- **Green Nutritionals — Shoden Ashwagandha** `green-nutritionals-shoden-ashwagandha` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Highest standardisation figure in the set; root+leaf…"); howToTake
- **Blackmores — Ashwagandha+** `blackmores-ashwagandha-plus` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Generic low-withanolide ashwagandha in a B-vitamin/mineral c…"); howToTake
- **Swisse — Ultiboost Ashwagandha Calm+** `swisse-ultiboost-ashwagandha-calm` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Lowest ashwagandha dose in the set; generic extract…"); howToTake
- **Thompson's — Ashwagandha Complex Stress + Sleep** `thompsons-ashwagandha-complex-stress-sleep` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Generic ashwagandha in a passionflower/lavender sleep combo…"); howToTake
- **Gaia Herbs — Ashwagandha Root** `gaia-herbs-ashwagandha-root` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Publishes per-batch lab reports; proprietary blend (not KSM-…"); howToTake
- **NOW Foods — Ashwagandha Standardized Extract** `now-foods-ashwagandha-450` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Generic standardised extract (no named clinical extract); ro…"); howToTake
- **Emrald Labs — Ashwagandha KSM** `emrald-labs-ashwagandha-ksm` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Full excipient panel disclosed (rice flour, HPMC, magnesium …"); howToTake
- **Bioglan — Ashwagandha Plus** `bioglan-ashwagandha-plus` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Named KSM-66 + B5; full ingredients list not published…"); howToTake
- **Caruso's — Ashwagandha + Sleep** `carusos-ashwagandha-sleep` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Named KSM-66 sleep combo; full ingredients list not publishe…"); howToTake
- **Oriental Botanicals — Anxiolift** `oriental-botanicals-anxiolift` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Named KSM-66 + OciBest six-herb combo; full ingredients list…"); howToTake
- **Nutricost — Ashwagandha KSM-66** `nutricost-ksm66-ashwagandha` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Discloses withanolide + BioPerine (piperine); benign panel…"); howToTake
- **Swisse — Ashwagandha Gummies** `swisse-ashwagandha-gummies` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Gummy — discloses sulfites + sugar alcohols; no artificial c…"); howToTake
- **Nature's Own — Ashwagandha+** `natures-own-ashwagandha-plus` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Named KSM-66 + Siberian ginseng; full ingredients list not p…"); howToTake
- **Nature's Own — Mild Anxiety Ashwagandha** `natures-own-mild-anxiety-ashwagandha` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Root+leaf extract; no named clinical extract confirmed; full…"); howToTake
- **Thorne — Ashwagandha** `thorne-ashwagandha` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Named Shoden extract; root+leaf…"); howToTake
- **Himalaya — Organic Ashwagandha** `himalaya-organic-ashwagandha` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "USDA-Organic/cGMP are agricultural/facility certs, not conte…"); howToTake
- **HealthWise — Glycine Pure Powder** `healthwise-glycine-powder` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient, no fillers or flow agents…"); howToTake
- **Bulk Nutrients — Glycine** `bulk-nutrients-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient; runs a public lab-report program…"); howToTake
- **VPA — Glycine Powder** `vpa-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient; no fillers, flavours, colours or sweetene…"); howToTake
- **NOW Foods — Glycine Pure Powder** `now-foods-glycine-pure-powder` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient — "other ingredients: none"…"); howToTake
- **BulkSupplements.com — Glycine Powder** `bulksupplements-glycine-powder` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient; NSF-registered facility; lab reports on r…"); howToTake
- **Swanson — AjiPure Glycine Powder** `swanson-ajipure-glycine-powder` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient; Ajinomoto AjiPure raw material…"); howToTake
- **NOW Foods — Glycine 1, Veg Capsules** `now-foods-glycine-1000-caps` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Disclosed benign capsule shell…"); howToTake
- **Thorne — Glycine** `thorne-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Disclosed benign capsule shell…"); howToTake
- **Solgar — Glycine Vegetable Capsules** `solgar-glycine-500` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Disclosed benign panel; makes no grade claim…"); howToTake
- **Orthoplex White — Glycine** `orthoplex-white-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-ingredient — "excipients nil"…"); howToTake
- **Blackmores — Sleep Sound Magnesium Powder** `blackmores-sleep-sound-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Each active dosed; full ingredients list not published…"); howToTake
- **Ethical Nutrients — Mega Magnesium Night Powder** `ethical-nutrients-mega-magnesium-night` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Panel disclosed (stevia, flavour, silica, sucrose)…"); howToTake
- **NutraBio — Glycine Powder** `nutrabio-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Pure glycine; public per-lot lab-report lookup by lot number…"); howToTake
- **Nutricost — Glycine Powder** `nutricost-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Pure glycine; "third-party tested / GMP" is a self-claim (no…"); howToTake
- **Life Extension — Glycine** `life-extension-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "The cleanest panel here — veg cap + ascorbyl palmitate only;…"); howToTake
- **Source Naturals — Glycine** `source-naturals-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Disclosed benign panel; gelatin (non-vegetarian) capsule; no…"); howToTake
- **Pure Product Australia — Glycine** `pure-product-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Pure glycine; "Independently Tested" is a badge, not a linke…"); howToTake
- **Micro Ingredients — Glycine Powder** `micro-ingredients-glycine` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Pure glycine; no openable lab report…"); howToTake
- **Cabot Health — Magnesium Ultra Potent Powder** `cabot-health-magnesium-ultra-potent` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form fully disclosed; “no oxide” claim verified accurate…"); howToTake
- **Herbs of Gold — Magnesium Forte** `herbs-of-gold-magnesium-forte` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form fully disclosed; full ingredients list not publishe…"); howToTake
- **Swisse — Ultiboost Magnesium** `swisse-ultiboost-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-salt disclosed; full ingredients list not published…"); howToTake
- **Bioglan — Active Magnesium PM** `bioglan-active-magnesium-pm` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form disclosed; oxide-heavy (~44%)…"); howToTake
- **Caruso's — Super Magnesium** `carusos-super-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form fully disclosed; full ingredients list not publishe…"); howToTake
- **Swisse — Ultiboost Magnesium Glycinate** `swisse-magnesium-glycinate` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Elemental disclosed, compound weight not; panel not publishe…"); howToTake
- **Nature's Own — Magnesium + Sleep Effervescent** `natures-own-magnesium-sleep-effervescent` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-salt disclosed; effervescent base not published…"); howToTake
- **BioCeuticals — Ultra Muscleze Night** `bioceuticals-ultra-muscleze-night` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form hidden — a "proprietary blend"…"); howToTake
- **Doctor's Best — High Absorption Magnesium** `doctors-best-high-absorption-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Panel disclosed and clean; per-form fully disclosed…"); howToTake
- **Ethical Nutrients — Mega Magnesium Powder** `ethical-nutrients-mega-magnesium-powder` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Compound weight inconsistent across channels…"); howToTake
- **Thorne — Magnesium Bisglycinate** `thorne-magnesium-bisglycinate` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Panel disclosed and clean (2 ingredients)…"); howToTake
- **Nature's Way — High Strength Magnesium** `natures-way-high-strength-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form partly disclosed; full ingredients list not publish…"); howToTake
- **Nature's Own — High Strength Magnesium (3 forms)** `natures-own-high-strength-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Three forms disclosed; full ingredients list not published…"); howToTake
- **Nature's Own — Magnesium Glycinate** `natures-own-magnesium-glycinate` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-salt disclosed; “Ezyglide” coating additive not itemi…"); howToTake
- **Cenovis — Magnesium** `cenovis-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form disclosed; full ingredients list not published…"); howToTake
- **Wagner — Super Bio Magnesium** `wagner-super-bio-magnesium` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form disclosed; full ingredients list not published…"); howToTake
- **Nutra-Life — Magnesium Complete Forte** `nutra-life-magnesium-complete-forte` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Per-form fully disclosed; gelatin capsule…"); howToTake
- **Healthy Care — Good Night Sleep with Magnesium + Ashwagandha** `healthy-care-good-night-sleep` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Actives disclosed; full ingredients list not published…"); howToTake
- **Voost — Magnesium (effervescent)** `voost-magnesium-effervescent` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-salt disclosed; effervescent sweeteners + sodium are …"); howToTake
- **Life Extension — Neuro-Mag Magnesium L-Threonate** `life-extension-neuro-mag` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-form disclosed; vegetarian capsule…"); howToTake
- **NOW Foods — Magnesium Glycinate** `now-magnesium-glycinate` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Full elemental + compound + excipient panel disclosed…"); howToTake
- **Blackmores — Valerian Forte** `blackmores-valerian-forte` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Active strength disclosed; full ingredients list not publish…"); howToTake
- **Caruso's — Valerian** `carusos-valerian` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Active strength disclosed (highest in set); full ingredients…"); howToTake
- **Thompson's — One-A-Day Valerian 2000** `thompsons-one-a-day-valerian-2000` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Active strength disclosed; full ingredients list not publish…"); howToTake
- **Nature's Own — Valerian Forte 2000** `natures-own-valerian-forte-2000` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Active strength NOT disclosed; full ingredients list not pub…"); howToTake
- **Blackmores — Deep Sleep** `blackmores-deep-sleep` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Each herb dosed; valerian active strength not disclosed; pan…"); howToTake
- **Swisse — Ultiboost Sleep** `swisse-ultiboost-sleep` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Every active dosed; valerenic acid disclosed (on some channe…"); howToTake
- **Nature's Own — Sleep Ezy** `natures-own-sleep-ezy` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Each herb dosed; valerian active strength not disclosed; pan…"); howToTake
- **MediHerb — Valerian Complex** `mediherb-valerian-complex` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Full excipient panel disclosed (the only AU product here tha…"); howToTake
- **BioCeuticals — Sleep Complex** `bioceuticals-sleep-complex` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Active strength disclosed (only combo here that keeps the ma…"); howToTake
- **Flordis — ReDormin Forte** `flordis-redormin-forte` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Named, trial-studied extract; per-herb doses disclosed; pane…"); howToTake
- **NOW Foods — Valerian Root** `now-foods-valerian-root-500` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Panel disclosed and clean (vegetarian capsule only)…"); howToTake
- **Gaia Herbs — Valerian Root** `gaia-herbs-valerian-root` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Panel disclosed and clean; per-batch lab reports published…"); howToTake
- **Cenovis — Easy Sleep Valerian 2000** `cenovis-easy-sleep-valerian` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-herb; contains soya, sulfites and beeswax (disclosed)…"); howToTake
- **Wanderlust — Valerian (liquid)** `wanderlust-valerian` · state: label known, not yet assessed
  - missing: four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Single-herb liquid; glycerol + peppermint oil, 54% alcohol (…"); howToTake
- **Solaray — Valerian Root** `solaray-valerian-root` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Whole root, veg cap, no fillers; Non-GMO Project Verified (a…"); howToTake
- **Vitamatic — Valerian Root (High Potency)** `vitamatic-valerian-root` · state: label known, not yet assessed
  - missing: deliveryForm (needs-review — no shape in the label string); four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend; third_party_tested{organisation, verified_date}; price + pricePerNight; dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens; excipients (unmigrated prose: "Discloses the 20:1 extract ratio; veg cap, rice flour, magne…"); howToTake
