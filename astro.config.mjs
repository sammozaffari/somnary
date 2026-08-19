// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// Swaps to the real somnary domain once the domain/trademark check (PROJECT_PLAN §1.3) clears.
export default defineConfig({
  site: 'https://somnary.vercel.app',
  // Static output: every CONTENT page is pre-rendered HTML (crawlability non-negotiable).
  // A few routes opt out with `prerender = false` because they cannot be static and must still
  // work without JavaScript: /search (answers a query on the server), /go/{id} (a redirect),
  // /account and /api/* + /auth/* (endpoints). No page a reader browses is server-only.
  output: 'static',
  // maxDuration (seconds) caps every serverless function. The Lens (/api/lens) is the long pole —
  // PubMed research + up to ~16 model calls; its own ~50s internal deadline degrades safely, so 90s
  // just guarantees headroom so Vercel never kills a request mid-composition. The fast routes
  // (ask/guide/nominate) never approach it. Requires a Vercel plan whose limit allows it (Pro: 300s).
  adapter: vercel({ maxDuration: 90 }),
  // applyBaseStyles: false — our global.css owns the @tailwind layers + tokens so we
  // control load order (Tailwind preflight, then the §1c base rules).
  integrations: [
    mdx(),
    // The sitemap lists PAGES, not machinery. /account is an auth utility with nothing to index,
    // /search is a query endpoint whose every URL is a different query, and /go redirects
    // straight out — indexing any of them would waste crawl budget on non-content (robots.txt
    // says the same thing to crawlers that never read a sitemap).
    sitemap({
      filter: (page) => !/\/(account|search|go)(\/|$)/.test(new URL(page).pathname),
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
