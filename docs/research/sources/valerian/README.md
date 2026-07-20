# Valerian source dossiers (AU-first research)

Raw, auditable research notes — one dossier per candidate product. **Gather-only, not scores.**
No rubric applied; scoring is a `[HUMAN-GATE]`. Same discipline as the melatonin/magnesium dossiers:
every line records what a primary document says, with the document linked; absence is recorded as
absence; regulator language is quoted, not paraphrased.

**AU framing:** valerian is an OTC herbal in Australia (not scheduled), so AU brands are the subject.
Availability checked against Chemist Warehouse, Amazon AU, iHerb AU. Most AU OTC valerian is a
TGA-listed medicine — capture the **AUST L number** (confirm on the ARTG; iHerb imports carry none).

**Valerian-specific quality axis = STANDARDISATION** (the analogue of "form" for magnesium):
- Is the extract **standardised to a stated valerenic acid % or mg** per serving? (Strongest signal.)
- **Root powder vs extract**; **extract ratio** (e.g. 5:1) / dry-root equivalent.
- **Valerian dose** per serving. A named, trial-studied extract (e.g. Flordis Ze 91019) is a distinct
  higher signal. Non-disclosure / unstandardised whole-root is itself recorded, not skipped.

## Dossier file shape (`<slug>.md`)

```
# <Brand> <Product> (<valerian dose/form>)

- slug, brand, product_name, market, channel (Chemist Warehouse | Amazon AU | iHerb AU)
- valerian form: root/extract; standardised to valerenic acid? (% or mg/serving); extract ratio /
  dry-root equivalent; valerian mg per serving; single_or_combo (+ other herbs)
- AUST_L_number (confirm on the ARTG) — state if unconfirmed
- manufacturer_url + retailer_urls[] (clean; no affiliate params)
- researched: <date>, researcher: <agent>

## Standardisation & dose transparency (valerian-specific)
Exactly what the label discloses: valerenic acid %/mg? extract ratio? dry-root equivalent? For combos,
is the valerian dose disclosed or buried? This is the key valerian sourcing signal — capture verbatim.

## Certifications (→ testing & purity)
USP / NSF / Informed / TGA AUST L — check each certifier's OWN directory + the ARTG. Distinguish
product certification from facility GMP and from self-testing. If none, state what was checked + date.

## Assays / content analyses (→ label accuracy)
Any published lab test (pmid/doi) naming this product? ConsumerLab/Labdoor cited+linked only, never
republished. If none, say so.

## Regulatory record (→ regulatory)
Search TGA (alerts/cancellations/recalls/compliance reports — AU is the primary regulator), FDA
(warning letters/recalls), FTC/ACCC. Quote+link primary docs, dated. If clean, name the databases +date.

## Additives on the label (→ additives)
Full "other ingredients" panel, captured (URL + date). Flag matches to src/data/additive-watchlist.yaml
— but DO NOT compute a score.

## Marketing claims (→ marketing honesty)
Quote VERBATIM any disease claim, unsupported "clinically proven", or overstated standardisation/
efficacy claim, with URL + capture date. Quote exactly; never characterize.

## Transparency signals (→ transparency)
Maker identifiable vs white-label? Batch/lot lab report (COA) public / on request / none? Standardisation
disclosed? Extract ratio / dry-root equivalent disclosed? AUST L sponsor named?

## Community read (→ display-only, NEVER scored)
2–4 themes from PUBLIC Reddit / open forums (r/supplements, r/AusHealth, r/sleep). Each: one-line
summary + 1–2 example thread URLs. Context only, never a score input.

## Used in published trials (→ display flag)
Any RCT using this exact branded product/extract (e.g. Ze 91019)? Cite (pmid/doi) or "none found".

## Open questions / could-not-verify
Anything a human should chase before scoring or publishing (esp. unconfirmed AUST L numbers).
```

## Candidate universe
See `_universe.md`.
