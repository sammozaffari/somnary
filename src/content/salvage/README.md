---
status: draft
kind: salvage-index
extractedBy: CHK-E0
extractedDate: 2026-08-17
---

# Salvage draft store

Data trapped in the old presentation layer, extracted verbatim before that layer
is deleted at cutover (CHK-B18). Every file here is a **draft** and nothing in it
is promoted to fact: drafts stay drafts until the consuming session (problem pages
CHK-B12/E7, safety page CHK-B10/E3, future non-supplement entries) takes each claim
through review. Source ids are carried verbatim from the origin page and re-verified
at that consuming session, same bar as the corpus.

**Excluded from all builds.** These files sit under `src/content/` but are *not* part
of any Astro content collection — `src/content.config.ts` globs only
`src/content/remedies/**/*.mdx`, and every CI gate (`check-citations`,
`check-source-fields`, `check-displaynames`, `check-crawlable`) scans
`src/content/remedies` specifically. So this store neither renders nor is graded.

## Salvage-item map (per the CHK-R1 plan, Artifact 1)

Behavioral / environmental evidence (from `src/pages/sleep-habits.astro`) — feeds
problem pages + the "non-supplement things with better evidence" beat:

| Item | Claim | Source | File |
|---|---|---|---|
| 1 | Caffeine even 6 h before bed disrupts sleep | PMID 24235903 | `caffeine.md` |
| 2 | Alcohol delays first REM; second half of night disrupted | PMID 23347102 | `alcohol.md` |
| 3 | eReader before bed: melatonin suppressed, onset lengthened | PMID 25535358 | `light-exposure.md` |
| 4 | Room light <200 lux pre-bed delays melatonin onset | PMID 21193540 | `light-exposure.md` |
| 5 | Sleep regularity predicts mortality more than duration | PMID 37738616 | `sleep-regularity.md` |
| 6 | +10 dB night traffic noise ≈ 2.5× odds of high disturbance | PMID 35857401 | `night-noise.md` |
| 7 | Regular exercise: small–moderate sleep benefit (66 studies) | PMID 25596964 | `exercise.md` |
| 8 | Evening exercise does not harm sleep (23 studies) | PMID 30374942 | `exercise.md` |

Population / drug-class safety evidence (from context pages) — feeds the safety
page + future non-supplement entries:

| Item | Claim | Source | File |
|---|---|---|---|
| 9 | Diphenhydramine/doxylamine AVOID for older adults (2023 Beers) | PMID 37139824 | `older-adults-sedatives.md` |
| 10 | Sedative-hypnotics 60+: ~25 min benefit vs NNH 6 / NNT 13 | PMID 16284208 | `older-adults-sedatives.md` |
| 11 | Tolerance to diphenhydramine sedation complete by day 3–4 | PMID 12352276 | `otc-antihistamines.md` |
| 12 | Cumulative anticholinergic exposure → dementia HR ~1.54 | PMID 25621434 | `otc-antihistamines.md` |
| 15 | Melatonin is prescription-only in Australia (TGA) | ARTG/TGA | `melatonin-australia-regulation.md` |
| 16 | AASM weak recommendation FOR ramelteon (non-supplement entry) | PMID 27998379 | `ramelteon.md` |

Items 13–14 are structured mappings, NOT drafts — they went to the data layer
(`src/data/outcomes.yaml`, `src/data/habits.yaml`), cross-referenced from the habit
summaries back to salvage items 1–8.
