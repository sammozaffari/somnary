// Build-time search index endpoint (CHK-4.1). Static output emits dist/search-index.json — the
// ⌘K palette (CHK-4.2) lazy-loads this at runtime; the crawlable /search page (CHK-4.3) renders
// server-side from getSearchDocs() directly. One index, generated from content, never hand-kept.
import type { APIRoute } from 'astro';
import { getSearchDocs } from '../lib/search';

// Force static: emit dist/search-index.json at build (the /search SSR route otherwise flips
// endpoints to on-demand). The palette fetches this cacheable static file, no serverless cost.
export const prerender = true;

export const GET: APIRoute = async () => {
  const docs = await getSearchDocs();
  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
