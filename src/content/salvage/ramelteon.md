---
status: draft
topic: ramelteon
salvageItems: [16]
provenance:
  originFile: src/pages/ramelteon.astro
  originLines: [17, 71]
  originNote: >-
    CHK-R1 ambiguous item 1, decided 2026-08-14: SALVAGE as a draft for a future
    non-supplement entry. The "against OTC melatonin" half of PMID 27998379 already
    lives in melatonin.mdx; the UNIQUE salvage here is the "weak recommendation FOR
    ramelteon" half. Ramelteon is a prescription melatonin-receptor agonist, outside
    Somnary's graded OTC/natural corpus — this becomes a future context entry, never
    a graded remedy (no bucket, no safety flag as a corpus remedy).
extractedBy: CHK-E0
extractedDate: 2026-08-17
consumers: [non-supplement-entries]
sources:
  - pmid: "27998379"
    doi: "10.5664/jcsm.6470"
    cite: "Sateia MJ, Buysse DJ, Krystal AD, et al. Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia in Adults (AASM). J Clin Sleep Med. 2017;13(2):307–349."
---

# Ramelteon — AASM guideline (DRAFT — not promoted)

**Claim (short).** AASM issues a weak recommendation FOR ramelteon in sleep-onset insomnia
(the unique half; the "against OTC melatonin" half already lives in `remedies/melatonin`).

**Finding (verbatim from origin).** The American Academy of Sleep Medicine issues a weak
recommendation FOR ramelteon in sleep-onset insomnia — and, in the same guideline, a weak
recommendation AGAINST over-the-counter melatonin for sleep-onset or sleep-maintenance
insomnia. — PMID 27998379 / DOI 10.5664/jcsm.6470

## Draft context for the future non-supplement entry (re-source at review)

These facts rode the origin page attributed to the **FDA prescribing information
(Rozerem)**, NOT to a resolvable PMID/DOI. Carried as draft context only; a future
non-supplement entry must cite the FDA label properly before any of this is promoted:

- Ramelteon is a melatonin-receptor agonist (MT1/MT2); it does not act on the GABA system.
- Per its FDA-approved prescribing information it is not a scheduled controlled substance.
- Approved in the United States in 2005 for insomnia characterised by difficulty falling
  asleep.
- Should not be combined with fluvoxamine (sharply raises ramelteon levels); generally
  avoided in severe liver disease.

> **Reviewer flag.** The "against OTC melatonin" half of PMID 27998379 is already held in
> `src/content/remedies/melatonin.mdx` — do not duplicate it there. The FDA-label facts
> above need a resolvable FDA citation at the consuming session.
