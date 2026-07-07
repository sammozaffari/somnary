// Build-time label index endpoint (CHK-4.1) — mirrors src/pages/search-index.json.ts. Static
// output emits dist/label-index.json; the label-checker island (LabelChecker.astro) fetches this
// cacheable static file at runtime and runs the rules entirely client-side (nothing is POSTed).
import type { APIRoute } from 'astro';
import { getLabelEntries } from '../lib/label-data';

// Force static: emit dist/label-index.json at build so the checker's data is a plain cacheable
// file, no serverless cost and no server round-trip for the user's pasted text.
export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getLabelEntries();
  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
