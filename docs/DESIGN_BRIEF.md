# Design Brief — Somnary

> **SUPERSEDED IN FULL (2026-07-06).** This is the brief that produced the
> v1.2 soft-light system, now retired. The ratified design source is
> `/docs/DESIGN_SYSTEM.md` v2 (evidence-teal, from the user-accepted v3
> prototype at `/docs/html-prototype/`). Specific conflicts with locked
> decisions: lowercase `somnary.` wordmark (D3: capitalized `Somnary.`),
> lavender/sage palette (retired), component #10 paywall teaser (D2: no
> membership paywall). Kept for historical rationale only — do not build
> from this document.

## What this is
**somnary** (always lowercase; wordmark `somnary.` with a trailing period) is an independent, evidence-graded wiki for natural sleep remedies (melatonin, magnesium, ashwagandha, valerian, L-theanine, etc.). Every remedy is graded S–F by the strength of published human evidence, every claim is cited to a real study. It is reader-funded — no affiliate links, no brand money, no commerce. Think "the evidence layer," not a supplement store.

## Who it's for
Skeptical, intelligent people researching whether a sleep supplement actually works before they buy it elsewhere. They value honesty about weak evidence over hype. The design must feel trustworthy, calm, and editorial — closer to a respected science publication than a wellness brand.

## The feeling
Calm, spacious, credible, quietly confident. This is a sleep topic, so the aesthetic should feel restful — never clinical-cold, never buzzy, never the neon-on-black "biohacker" look. Warm and editorial. Generous whitespace. Gentle, settling motion (soft fades), never bouncy or attention-grabbing.

## Visual direction
- **Palette:** soft light. Warm off-white base (around #F7F5F0), warm near-black text (around #1A1A1F). Muted, low-saturation accents: a soft lavender and a soft sage. Calm and analog, not digital-bright.
- **Tier colors (S A B C D F):** a desaturated spectrum that still reads as ranked — warm/positive at S down to a muted caution tone at F. They must stay gentle enough to live on the off-white base and pass contrast for accessibility.
- **Type:** a characterful but readable display face for headers (lowercase styling preferred), a clean neutral sans for body. Systematic, restrained type scale.
- **Layout:** gallery/showcase grid with lots of air. Cards with a small metadata sidebar. Swiss/editorial restraint over decoration.

## Reference (attached)
- **der-lukas.net** — match this for layout, spacing, restraint, and calm motion. The gallery-of-work structure with a metadata sidebar per item is the model for our remedy cards.
- **reptides.co screenshots** — match the *information density and component ideas* (tier badges, evidence chips, claims-vs-data table, stat row), but NOT the dark neon aesthetic. We are translating reptides' substance into der-lukas's calm light skin.

## Components needed
1. **Wordmark / logo** — `somnary.` set in the display face, lowercase, with a trailing period. This is the brand's primary mark (the way `reptides.` is). Show it on both the off-white base and on a card surface. A small companion mark/favicon (e.g. the "s." or a minimal crescent/dot motif) would help, but keep it restrained — no literal moon-and-stars clipart.
2. Tier letter badge (S–F, color-coded, desaturated)
3. Evidence-gate chip (small tag, e.g. "meta-analysis exists", "RCT n≥100")
4. Claims-vs-data table (two columns: what's claimed / what studies show, each row footnoted)
5. Remedy card with metadata sidebar (Grade / Key compound / Studied dose / Best for / Safety flag)
6. Outcome card (goal-first, e.g. "fall asleep faster")
7. Stat counter row (e.g. "24 remedies · 1,200 sources · 0 hallucinated cites · $0 brand money")
8. Citation / footnote popover
9. Inline "ask" button (links to an assistant)
10. Paywall teaser (for paid deep-dive "briefs")
11. Community progress bar (anonymous reports, e.g. "18/100")
12. Safety / interaction callout (prominent, calm-but-clear warning style)
13. Search — a ⌘K command palette + a crawlable /search results page (one shared index over the whole catalog; grouped results show tier badges)

## Page types to lay out
- Home (hero with a strikethrough line — "the sleep-supplement internet is a sales floor → the evidence layer", then the stat row; wordmark `somnary.` top-left)
- Remedy page (the core template: header, verdict, claims-vs-data, evidence summary, dosing, safety, standardization note, mechanism, sources, community read, ask)
- Tier board (all remedies ranked S–F, gallery grid)
- Outcome page
- Methodology page (publishes the grading rubric)
- Brief (long-form, narrative scroll — this one page can be more story-driven)

## Hard constraints
- Soft-light palette only — no dark-mode-first, no neon.
- Tier colors must be accessible on the off-white base.
- Calm motion only.
- Output design tokens as named variables (color, type, spacing, radius, motion) so they can be handed to developers — we need exact values, not just visuals.

## Deliverable
A cohesive design system: the full token set with exact values, the 11 components with their states, and the 6 page-type layouts.
