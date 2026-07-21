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
  // maxDuration (seconds) caps every serverless function. The Lens (/api/lens) is the long pole —
  // PubMed research + up to ~16 model calls; its own ~50s internal deadline degrades safely, so 90s
  // just guarantees headroom so Vercel never kills a request mid-composition. The fast routes
  // (ask/guide/nominate) never approach it. Requires a Vercel plan whose limit allows it (Pro: 300s).
  adapter: vercel({ maxDuration: 90 }),
  // applyBaseStyles: false — our global.css owns the @tailwind layers + tokens so we
  // control load order (Tailwind preflight, then the §1c base rules).
  integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false })],
});
