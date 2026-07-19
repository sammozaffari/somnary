# Melatonin source dossiers (Phase B research)

Raw, auditable research notes — one dossier per candidate product. **These are
data-gathering artifacts, not scores.** No rubric is applied and no score is
drafted here: scoring waits until the rubric (PR #62) is owner-ratified, and
even then no agent ratifies a score (`[HUMAN-GATE]`).

Each dossier records only what a primary document says, with the document
linked. Absence is recorded as absence ("no third-party certification found
in the USP/NSF directories as of <date>"), never as insinuation. Regulator
language is quoted, not paraphrased. Every factual line carries its source.

## Dossier file shape (`<slug>.md`)

```
# <Brand> <Product> (<dose> <form>)

- slug, brand, product_name, form, dose_mg, serving_type, market, single_or_combo
- manufacturer_url (clean; no affiliate/tracking params)
- retailer_urls[] (clean)
- researched: <date>, researcher: <agent>

## Certifications (→ source_certifications)
Each: cert_type (usp|nsf|informed-choice|tga-austl|other), verifier, directory URL,
verified_date, lapsed?. If none found, state the directories checked + date.

## Assays / content analyses (→ source_assays)
Each: source_kind (pmid|doi), source_id, claimed_mg, measured_mg, year, one-line finding.
Include ConsumerLab/Labdoor ONLY as cited+linked attribution (never republish their tables).
If none name this exact product, say so.

## Regulatory record (→ source_regulatory)
Each: event_type (warning-letter|recall|ftc-action|tga-alert), agency, event_date,
primary-document URL, quoted summary. Search FDA warning letters, FDA recalls, CAERS,
FTC actions, TGA alerts against the brand AND its manufacturer/parent. If clean, say
which databases were searched + date.

## Additives on the label (→ source_additives)
The full "other ingredients" panel, captured (URL + date). Flag which entries match
an id in src/data/additive-watchlist.yaml — but DO NOT compute a score. Just note matches.

## Marketing claims (→ source_marketing_flags)
Quote VERBATIM any on-site/on-label claim that could be a disease claim, an unsupported
"clinically proven"/"doctor recommended", or fear-marketing — with URL + capture date.
Quote exactly; never characterize.

## Transparency signals (→ source_products / notes)
Manufacturer identifiable vs white-label? Batch/lot COA public / on request / none?
Sourcing disclosed? Record what you found + how (e.g. "requested COA <date>, no reply as of <date>").

## Community read (→ source_sentiment) — DISPLAY-ONLY, NEVER SCORED
2-4 recurring themes from PUBLIC Reddit / open forums only (no Facebook, no Amazon
scraping). Each theme: one-line summary + 1-2 example thread URLs. This is context,
never a score input.

## Used in published trials (→ display flag)
Did any RCT use this exact branded product? Cite (pmid/doi) or state "none found".

## Open questions / could-not-verify
Anything a human should chase before this product is scored or published.
```

## Candidate universe
See `_universe.md` (documented inclusion criteria + the human-gated candidate list).
