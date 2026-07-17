# Remedy hero plates

Full-bleed linocut hero images for remedy pages — one per remedy, `{slug}.webp`,
2880×1620. Owner-directed, generated 2026-07-16 (Codex) from the art-direction
prompt in `docs/plans/2026-07-16-remedy-hero-plates-prompt.md`; the melatonin plate was approved as
the family's north star before the batch.

- **Committed files are production sources**: WebP q90 (visually lossless for
  this texture), converted from the 6.7MB-avg PNG masters via sharp. Astro's
  image service derives the served AVIF/WebP from these at build.
- **Masters (227MB, PNG)** are NOT in the repo. Archive:
  `~/Documents/Codex/2026-07-16/users-sammozaffari-desktop-projects/outputs/somnary-remedy-heroes/`
  (owner's machine). To regenerate or extend the family, use the prompt doc —
  it carries the grammar, constraints, and all 31 per-remedy art directions.
- **Family rules** (from the prompt; enforced at review): linocut carving
  vocabulary matching the melatonin plate's grain; 3–5 inks + paper per plate;
  dusk/night mood; detail in the upper two-thirds, calm lower third (the page
  overlays title/grade there); focal subject within the central 60% of width;
  no text, no people, no products; vermilion `#E34234` never dominant (safety
  register); palettes botanical, never evaluative (grades are separate data).

Wiring shipped 2026-07-17 as the "labeled plate" (DESIGN_SYSTEM §11.3;
`RemedyHero.astro`; design doc `docs/plans/2026-07-17-remedy-hero-labeled-plate-design.md`).
The once-planned per-remedy atmosphere tokens were ratified AWAY (v6): no type sits on the
art, so no per-remedy ink/scrim tokens exist — palettes live in the plates alone.
