// Hero-carousel slide specs. Lives in a .ts (not the .astro frontmatter) so both the page
// (index.astro, which authors the order) and the component (HeroCarousel.astro, which renders
// it) can `import type` it — exporting a type from an .astro file breaks the esbuild pass.
export type SlideSpec =
  | { kind: 'brand' }
  | { kind: 'remedy'; slug: string }
  | { kind: 'utility'; key: 'situations' | 'blend' | 'grades' };
