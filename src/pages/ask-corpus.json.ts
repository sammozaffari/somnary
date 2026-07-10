// Build-time scoped-assistant corpus (CHK-6.3). Static output emits dist/ask-corpus.json: each
// remedy's retrieval chunks + its real sources[] (identifiers ONLY from existing content — no new
// citation is minted, so the resolver stays 66/20). Mirrors the search-index.json.ts prerender
// pattern. This is a build artifact of the ONE content structure, not a second store: it is
// regenerated from the collection every build and never hand-edited.
import type { APIRoute } from 'astro';
import { getAskCorpus } from '../lib/ask/from-collection.ts';

export const prerender = true;

export const GET: APIRoute = async () => {
  const corpus = await getAskCorpus();
  return new Response(JSON.stringify(corpus), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
