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
  // Guessability redirects (audit IA-2). The URL scheme grew four shapes (/r/{slug},
  // /outcome/{slug}, /sources/{r}/{p}, and flat context slugs), so the entity-shaped URL a reader
  // would GUESS often 404s. These are ADDITIVE aliases → the existing pages: they add the guessable
  // form without moving any indexed URL, so there is zero SEO/redirect risk and it is fully
  // reversible. (Making the canonical URLs themselves consistent — a true move of the primary,
  // indexed URLs with 301s — is deliberately NOT done here: that is SEO-consequential on a live
  // indexed site and is an owner decision, flagged in the PR.)
  redirects: {
    // a drug that reads like a remedy — guessing the remedy shape should find it
    '/r/ramelteon': '/ramelteon',
    // melatonin sub-topics: a reader on /r/melatonin guesses nested pages
    '/r/melatonin/children': '/melatonin-children',
    '/r/melatonin/dose-timing': '/melatonin-dose-timing',
    '/r/melatonin/gummies': '/melatonin-gummies',
    '/r/melatonin/long-term': '/melatonin-long-term',
    // the outcome index is /outcomes (plural); make the plural detail form resolve too
    '/outcomes/[slug]': '/outcome/[slug]',
  },
  // maxDuration (seconds) caps every serverless function. The Lens (/api/lens) is the long pole —
  // PubMed research + up to ~16 model calls; its own ~50s internal deadline degrades safely, so 90s
  // just guarantees headroom so Vercel never kills a request mid-composition. The fast routes
  // (ask/guide/nominate) never approach it. Requires a Vercel plan whose limit allows it (Pro: 300s).
  adapter: vercel({ maxDuration: 90 }),
  // applyBaseStyles: false — our global.css owns the @tailwind layers + tokens so we
  // control load order (Tailwind preflight, then the §1c base rules).
  integrations: [mdx(), sitemap(), tailwind({ applyBaseStyles: false })],
});
