/**
 * Build-time search index (CHK-4.1; PLAN §2a, DESIGN_SYSTEM §2.13/§3.7).
 *
 * ONE index, generated from the structured content at build — never hand-maintained, so it can't
 * drift from the corpus (rebuilds whenever content changes). This module reads the content
 * collection (server-only via astro:content); the pure ranking lives in ./search-rank so it can
 * also be bundled into the client palette. Both surfaces rank identically.
 *
 * Surfaces: the ⌘K command palette (CHK-4.2, client-side via /search-index.json) and the crawlable
 * /search page (CHK-4.3, server-rendered). Searchable fields per §2a: name + aliases/latin + key
 * compound + outcomes + symptoms. TIER DOES NOT BOOST RANKING.
 */
import { getCollection } from 'astro:content';
import { contentIndex } from './content-index';
import type { SearchDoc } from './search-rank';

export type { SearchDoc } from './search-rank';
export { searchDocs } from './search-rank';

const indexBySlug = new Map(contentIndex.map((e) => [e.slug, e]));

/** The single source of search docs — built from the live (non-draft) remedy collection. */
export async function getSearchDocs(): Promise<SearchDoc[]> {
  const remedies = await getCollection('remedies', (e) => !e.data.draft);
  return remedies
    .map((e) => {
      const d = e.data;
      const idx = indexBySlug.get(e.id);
      return {
        slug: e.id,
        url: `/r/${e.id}`,
        name: d.name,
        kind: 'remedy' as const,
        tier: d.tier,
        category: idx?.category ?? '',
        latin: idx?.latin ?? null,
        keyCompound: d.keyCompound,
        aliases: d.aliases,
        outcomes: d.outcomes,
        symptoms: d.symptoms,
        oneLiner: d.oneLineVerdict,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
