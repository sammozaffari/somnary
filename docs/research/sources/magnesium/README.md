# Magnesium source dossiers (AU-first research)

Raw, auditable research notes — one dossier per candidate product. **Data-gathering
artifacts, not scores.** No rubric applied and no score drafted here; scoring is a
`[HUMAN-GATE]` and no agent ratifies. Same discipline as the melatonin dossiers.

Every line records what a primary document says, with the document linked. Absence is
recorded as absence ("no third-party certification found in the USP/NSF directories as of
<date>"). Regulator language is quoted, not paraphrased. Every negative datum links a
primary document.

**AU framing:** unlike melatonin (Rx here), magnesium is sold OTC in Australian chemists,
so the AU brands are the subject. Availability is checked against Chemist Warehouse,
Amazon AU, and iHerb AU. Most AU OTC magnesium is a TGA-listed medicine — capture the
**AUST L number** (a real sourcing signal; iHerb-imported US products are NOT TGA-listed,
itself a signal).

## Dossier file shape (`<slug>.md`)

```
# <Brand> <Product> (<elemental mg> <form>)

- slug, brand, product_name, market, channel (Chemist Warehouse | Amazon AU | iHerb AU)
- form(s) / magnesium salt(s); elemental_mg per serving; serving; single_or_combo
- AUST_L_number (TGA ARTG) — confirm on the ARTG (tga.gov.au / artg); state if unconfirmed
- manufacturer_url + retailer_urls[] (clean; no affiliate/tracking params)
- researched: <date>, researcher: <agent>

## Form & dose transparency (magnesium-specific)
Which magnesium salt(s)? Is the PER-FORM elemental breakdown disclosed, or only a combined
total (a hidden-blend transparency defect)? Elemental vs compound weight stated? This is a
key magnesium sourcing signal — record exactly what the label discloses.

## Certifications (→ testing & purity)
USP / NSF / Informed Choice / TGA AUST L(A) — check each certifier's OWN directory + the
ARTG. Distinguish product certification from facility GMP and from self-testing. If none,
state which directories were checked + date.

## Assays / content analyses (→ label accuracy)
Any published assay (pmid/doi) naming this product? ConsumerLab/Labdoor cited+linked only,
never republished. If none, say so.

## Regulatory record (→ regulatory)
Search TGA (alerts, cancellations, recalls — AU is the primary regulator here), FDA
(warning letters/recalls for the manufacturer), FTC/ACCC actions. Quote+link primary docs,
dated. If clean, name the databases searched + date.

## Additives on the label (→ additives)
Full "other ingredients" / excipients panel, captured (URL + date). Flag watchlist matches
(src/data/additive-watchlist.yaml) — but DO NOT compute a score. Note magnesium oxide only
as a form/bioavailability fact (not a watchlist additive).

## Marketing claims (→ marketing honesty)
Quote VERBATIM any claim that could be a disease claim, unsupported "clinically proven",
"high absorption" without support, or fear-marketing (e.g. attacking oxide/"fillers").
Quote exactly; never characterize.

## Transparency signals (→ transparency)
Manufacturer identifiable vs white-label? Batch/lot COA public / on request / none?
Per-form elemental breakdown disclosed? Sourcing disclosed? AUST L sponsor named?

## Community read (→ display-only, NEVER scored)
2–4 recurring themes from PUBLIC Reddit / open forums (r/Supplements, r/AusHealth, etc.).
Each: one-line summary + 1–2 example thread URLs. Context only, never a score input.

## Used in published trials (→ display flag)
Any RCT using this exact branded product? Cite (pmid/doi) or "none found".

## Open questions / could-not-verify
Anything a human should chase before scoring or publishing.
```

## Candidate universe
See `_universe.md`.
