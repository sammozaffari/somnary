# Remedy illustration system — linocut icon set (design)

**Date:** 2026-07-13 · **Status:** owner-ratified style direction (this session);
DESIGN_SYSTEM.md §Illustration update ships with implementation PR (`[HUMAN-GATE]`,
design-system change per CLAUDE.md precedence §3).

## Decision summary

- **Style:** hand-carved **linocut / block print**. Bold carved shapes, relief-print
  texture, sparse gouge hatching. Two tones only. No gradients, no photorealism,
  no flat pastel vector (wellness cliché — design-guardian would reject).
- **Why:** Somnary is a modern pharmacopoeia — warm paper, oxblood ink, evidence-first.
  Printmaking is the apothecary-heritage look no competitor owns, and bold carved
  shapes stay legible at 40–48 px (tier board, compare tool, search results), where
  fine engraving turns to mud.
- **Scope:** ONE 1024×1024 master per remedy, used at every size. No separate hero set.
- **Ink:** masters are generated **black on pure white**, then programmatically
  recolored to `--primary` `#7E1F2B` with a transparent background. Token compliance
  by construction; the whole set can be re-inked later without regeneration.
- **Never:** imagery that implies a product for sale, endorsement, or appeal
  ("delicious", "soothing" compositions). Icons identify the subject; they do not sell it.

## Visual grammar (family rules)

The system is a grammar, not 31 one-offs. Classify the remedy, apply the family rule —
that is how every future remedy gets an icon automatically.

| Family | Rule | Subject pattern |
|---|---|---|
| Botanical | the plant, specimen-style | a sprig/bloom showing the feature a botanist would ID it by |
| Fungal | the fruiting body | conk/cap with characteristic form |
| Compound — iconic botanical source | the source plant part | e.g. tea pluck for l-theanine |
| Compound — no iconic source | the molecule | skeletal structure, bold carved bonds, filled node dots, hand-cut imperfection |
| Mineral | crystal/ore specimen | faceted cluster of the element's characteristic mineral |
| Vitamin | source symbol | e.g. softgel radiating sun rays for D |
| Formulated (only exists as a product) | apothecary vessel | bottle/jar + contextual motif — never label text |
| Intervention (behavioral) | the instrument | the object(s) the practice actually uses |

## Master prompt (verbatim style block — never varies)

Only the `[SUBJECT]` clause changes between remedies. Everything else is pasted
verbatim into every generation; that is what holds the set together.

```
A [SUBJECT], rendered as a traditional hand-carved linocut block print.

Style: bold, confident carved shapes with the character of a hand-pulled
relief print — slightly irregular edges, sparse carved hatching and gouge
marks for depth and texture, small intentional gaps where the ink didn't
fully take. Flat and graphic: solid black ink on a pure white background,
exactly two tones, no gradients, no gray, no color, no halftone.

Composition: the subject alone, centered, filling about 70–75% of a square
frame with even margins on all sides. Simplified and iconic — every shape
deliberate, readable silhouette, no background scenery, no frame, no
border, no drop shadow. The design must remain clearly legible when
scaled down to 48 pixels.

Absolutely no text, no lettering, no numbers, no label copy, no watermark,
no artist signature. Square, 1:1.
```

Generation settings: 1024×1024, 4 candidates per remedy, pick one, regenerate only
on QA failure. If the tool supports reference images, pass the approved chamomile
icon as a style anchor for all subsequent batches.

## Per-remedy subject clauses (all 31)

### Botanicals — plant specimen
| Slug | `[SUBJECT]` |
|---|---|
| chamomile | a sprig of three chamomile blooms, one seen in profile, carved petals radiating from a domed dotted center disc |
| lavender | three lavender stems loosely bundled, whorled flower spikes and thin narrow leaves |
| valerian | a valerian plant: an umbel of tiny clustered flowers on a tall stem, gnarled tangled root mass exposed below |
| passionflower | a single passionflower bloom seen face-on, its corona of filaments carved as radiating rays over broad petals |
| hops | two papery hop cones hanging from a curling bine with one broad lobed leaf, bract scales carved overlapping |
| lemon-balm | a lemon balm sprig of crinkled, toothed heart-shaped leaves, with one small honeybee alighting on the top leaf |
| lemon-verbena | a whorl of three long, pointed lanceolate lemon verbena leaves on a slender stem |
| skullcap | an arching skullcap stem with paired hooded helmet-shaped blossoms along one side |
| kava | a halved coconut-shell kava bowl with a knobby, many-fingered kava root laid across its rim |
| ashwagandha | an ashwagandha stem: one berry enclosed in its papery lantern-like husk, oval leaves, a stout root descending below |
| bacopa | a creeping bacopa sprig with small paddle-shaped succulent leaves and one tiny five-petaled flower |
| jujube | three round jujube fruits on a thorny twig with small oval leaves |
| magnolia-bark | a magnolia bloom with broad cupped petals beside a tightly curled quill of stripped bark |
| saffron | a crocus flower opening to show three long saffron stigma threads spilling over its petals |
| tart-cherry | two tart cherries on joined stems with one serrated leaf, one cherry with a carved highlight notch |
| reishi | a kidney-shaped reishi mushroom conk seen at a slight angle, concentric growth rings carved as bold bands |

### Compounds with an iconic botanical source
| Slug | `[SUBJECT]` |
|---|---|
| l-theanine | a fresh tea pluck: two tea leaves and an unopened bud on a single stem |
| 5-htp | a Griffonia simplicifolia branch with three flat curved seed pods and paired oval leaflets |
| cbd | a rounded apothecary dropper bottle with an embossed seven-fingered hemp leaf motif, glass dropper laid beside it |

### Compounds — molecule (no iconic source)
Pattern: “the skeletal molecular structure of [X], drawn as bold carved
lines with filled circular node dots, slightly imperfect as if cut by hand”.
| Slug | Molecule note |
|---|---|
| gaba | short open-chain molecule — reads as a simple zigzag with end groups |
| glycine | the smallest amino acid — tiny centered structure, generous margins |
| l-tryptophan | indole double-ring clearly visible |
| taurine | short chain with the sulfonate group as a bold terminal cluster |
| apigenin | flavone: three fused rings (kept as molecule to stay distinct from chamomile, its source) |
| cbn | cannabinoid multi-ring skeleton (differentiates from cbd's bottle-and-leaf) |

### Formulated / vessel
| Slug | `[SUBJECT]` |
|---|---|
| melatonin | a small rounded apothecary pill bottle with three round tablets spilled beside it, a thin crescent moon floating above |

Note: the crescent floats as night context, NOT on the bottle label — a branded
bottle would read as a Somnary-sold product (commerce smell, forbidden). If the
owner prefers zero crescent overlap with the brand mark, drop the moon.

### Minerals & vitamins
| Slug | `[SUBJECT]` |
|---|---|
| magnesium | a faceted magnesite crystal cluster specimen, three joined crystals |
| zinc | a single bold faceted sphalerite crystal specimen |
| iron | a rough hematite ore chunk with angular metallic facets |
| vitamin-d | an oval softgel capsule radiating carved sun rays |

### Intervention
| Slug | `[SUBJECT]` |
|---|---|
| cbt-i | a neatly made single bed in side profile with a round wind-up alarm clock floating above the footboard |

## Pipeline

1. **Anchor set first** (one per family): chamomile, l-theanine, gaba, melatonin,
   magnesium, vitamin-d, cbt-i. Owner approves before batching — this is the style
   lock. `[HUMAN-GATE]` on the anchor set.
2. **Batch** remaining 24, 4 candidates each, style block verbatim.
3. **Recolor** each chosen master (black/white → oxblood/transparent):
   ```sh
   magick {slug}-master.png -colorspace Gray -threshold 55% \
     -fuzz 12% -fill "#7E1F2B" -opaque black \
     -fuzz 8% -transparent white \
     -strip src/assets/remedies/{slug}.png
   ```
   Keep the black/white masters in `design/icon-masters/` (or equivalent) so the
   set can be re-inked without regeneration.
4. **QA gate per icon** — reject and regenerate if ANY of:
   - gray tones, halftones, or gradients survive thresholding
   - any text, numbers, or signature marks
   - subject unrecognizable at 48 px (downscale test, actual 48px render)
   - fill outside ~55–80% of frame, or off-center
   - line weight visibly off the anchor set (style drift)
5. **Integrate**: `src/assets/remedies/{slug}.png`, consumed via a `RemedyIcon.astro`
   component with the crescent-moon disc as fallback for any remedy without an
   approved icon yet. Icons are **decorative**: `alt=""`, the remedy name is always
   adjacent text — meaning never carried by image alone (same principle as
   grades-readable-without-color).
6. **Document**: add an "Illustration" section to DESIGN_SYSTEM.md (style, ink token,
   family grammar, QA rules) in the implementation PR — design-system change, so the
   PR is `[HUMAN-GATE]` per CLAUDE.md.

## New-remedy recipe (permanent)

1. Classify: botanical / fungal / compound (iconic source?) / mineral / vitamin /
   formulated / intervention.
2. Write the subject clause from the family pattern: name the ONE feature an expert
   would identify it by.
3. Paste into the master prompt, generate 4, run QA gate, recolor, drop in
   `src/assets/remedies/{slug}.png`. No code changes needed.
