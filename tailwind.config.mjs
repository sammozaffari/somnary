/** @type {import('tailwindcss').Config} */

// Tailwind is retained ONLY for its Preflight base reset: `@tailwind base` runs in
// src/styles/global.css, and astro.config sets `applyBaseStyles: false` so this Preflight
// loads first, then the §1 base rules layer on top.
//
// There is NO theme here on purpose (audit CRAFT-1). The codebase styles entirely through
// scoped component `<style>` blocks that consume the design tokens in src/styles/global.css
// (var(--r-*), var(--sp-*), var(--primary), …) — there are ZERO Tailwind utility classes in
// src (the bare `grid` / `block` / `hidden` class names are scoped custom classes, not
// utilities). The former `somnaryTheme` object duplicated every token as a Tailwind theme value
// for utilities that were never written, and it had already silently DRIFTED from the real
// tokens: radius 3/7/11/16/24 vs the actual 4/8/10/12/16, base line-height 1.45 vs 1.60, and a
// retired `IBM Plex Mono` font. Rather than re-sync a mirror nothing reads, it is removed:
// src/styles/global.css (+ tailwind.config's ABSENCE of a theme) is now the single source of
// truth. If Tailwind utilities are ever adopted, regenerate the theme from those tokens then.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  plugins: [],
};
