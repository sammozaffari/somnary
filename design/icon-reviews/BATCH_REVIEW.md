# Remedy icon batch review

**Date:** 2026-07-14  
**Scope:** 24 production icons, four candidates per subject  
**Generation mode:** built-in image generation, using the approved chamomile master as a
style-only reference  
**Prompt source:** `# Batch prompts — remaining 24 remedy icons (linocut, black on white)`

## Result

All 24 subjects have an approved black-on-white master and a transparent oxblood
production asset. The combined 31-icon family was reviewed side by side at 48px and
240px. The final set passes the required silhouette, line-weight, detail-density,
two-tone, margin, and small-size legibility checks.

The generation prompts retained the exact shared style and composition blocks from the
source document. Molecule subjects use the requested chunky ball-and-stick treatment.
Generation remained solid black on pure white; production recoloring happened only
after selection.

## Selected candidates

| Remedy | Candidate | Remedy | Candidate |
|---|---:|---|---:|
| Lavender | 4 | Valerian | 4 |
| Passionflower | 4 | Hops | 4 |
| Lemon balm | 1 | Lemon verbena | 4 |
| Skullcap | 4 | Kava | 4 |
| Ashwagandha | 2 | Bacopa | 1 |
| Jujube | 4 | Magnolia bark | 4 |
| Saffron | 4 | Tart cherry | 4 |
| Reishi | 4 | 5-HTP | 4 |
| CBD | 4 | Glycine | 3 |
| L-tryptophan | 2 | Taurine | 3 |
| Apigenin | 3 | CBN | 2 |
| Zinc | 1 | Iron | 1 |

## Asset contract

- Selected masters: `design/icon-masters/batch-2026-07-14/selected/`
- Production assets: `src/assets/remedies/`
- Master format: 1024×1024, black/white only, subject normalized to 74% maximum extent
- Production format: 1024×1024 RGBA, transparent background, visible pixels exactly
  `#7E1F2B`, binary alpha only
- Selection data: `batch-selection-map.json`
- Mechanical QA: `batch-selection-qa.json`
- Review sheets: `remedy-icon-family-31-48px.png` and
  `remedy-icon-family-31-240px.png`

## Watch-list review

Valerian, passionflower, hops, kava, ashwagandha, and lemon balm were reviewed as a
separate small-size group as requested. All remain distinguishable at 48px while
matching the anchor set's carved weight. The molecule group was also checked for
readability; apigenin and CBN are the most intricate forms but their selected candidates
remain legible and materially heavier than the rejected alternatives.

## Gate

The assets and UI integration are ready for human design review. No merge is authorized
by this batch review.
