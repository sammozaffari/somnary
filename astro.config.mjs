// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// NOTE: domain not yet verified (PROJECT_PLAN §1.3 — run .com/.co + trademark check
// before launch). Placeholder until then; sitemap needs an absolute `site`.
export default defineConfig({
  site: 'https://somnary.co',
  // Static output: every content page is pre-rendered HTML (crawlability non-negotiable).
  output: 'static',
  // applyBaseStyles: false — our global.css owns the @tailwind layers + tokens so we
  // control load order (Tailwind preflight, then the §1c base rules).
  integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false })],
});
