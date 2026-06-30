// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// Swaps to the real somnary domain once the domain/trademark check (PROJECT_PLAN §1.3) clears.
export default defineConfig({
  site: 'https://somnary.vercel.app',
  // Static output: every content page is pre-rendered HTML (crawlability non-negotiable).
  // Vercel adapter in static mode — no route is server-rendered. Specific routes may opt
  // into server mode much later (Phase 9 Ask RAG endpoint) if needed.
  output: 'static',
  adapter: vercel(),
  // applyBaseStyles: false — our global.css owns the @tailwind layers + tokens so we
  // control load order (Tailwind preflight, then the §1c base rules).
  integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false })],
});
