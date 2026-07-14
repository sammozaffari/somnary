# Somnary remedy icon anchors — owner review

**Date:** 2026-07-14  
**Status:** `[HUMAN-GATE]` — approve all seven before generating the remaining 24.

## Selected anchors

| Remedy | Selected candidate | Review note |
|---|---:|---|
| Chamomile | 4 | Three blooms including one in profile; clear specimen silhouette and restrained hatching. |
| L-theanine | 4 | Strong two-leaves-and-a-bud silhouette; bold enough at 48 px. |
| GABA | revised 1 | Chunky ball-and-stick model with large atoms and heavy bonds; clearest molecular read at 48 px. |
| Melatonin | revised 4 | Bottle-dominant composition with a smooth unlabeled body, exactly two tablets, and a crescent beside the shoulder. |
| Magnesium | 4 | Simple three-crystal cluster with the least excess surface detail. |
| Vitamin D | 1 | Upright softgel and alternating rays; strongest small-size silhouette. |
| CBT-I | revised 4 | Clean bed-only side profile with no clock or secondary object. |

## QA result

- All selected masters are 1024×1024 grayscale PNGs containing exactly two values: pure black and pure white.
- Every selected subject is centred and normalised to 74% of the frame's longest dimension.
- No selected image contains text, lettering, numbers, labels, borders, scenery, signatures, or watermarks.
- Production assets use only `#7E1F2B` ink with a transparent background.
- Transparent corners and RGBA output were verified for all seven assets.
- Group review sheets were rendered from the production assets at actual 48 px and 240 px icon sizes.
- The 2026-07-13 versions of GABA, melatonin, and CBT-I were retained under `design/icon-masters/anchors/superseded/`.

## Review files

- `anchor-selected-48px.png` — small-size family and recognition check.
- `anchor-selected-240px.png` — line-weight, detail, and style-drift check.
- `anchor-candidates-48px.png` — all 28 candidates at small size.
- `anchor-candidates-240px.png` — all 28 candidates at larger size.
- `anchor-revisions-candidates-48px.png` — all 12 revised candidates at small size.
- `anchor-revisions-candidates-240px.png` — all 12 revised candidates at larger size.
- `anchor-selected-revised-48px.png` — revised trio beside the four keepers at actual small size.
- `anchor-selected-revised-240px.png` — revised seven-up line-weight and detail check.

## Gate decision

Approve or reject the set as a family. If approved, use the selected Chamomile master as the style reference and generate the remaining 24 remedies with the unchanged shared style block. If one anchor is rejected, regenerate only that remedy before opening the batch gate.
