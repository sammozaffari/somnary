/**
 * Build-time search index + ranking (CHK-4.1; PLAN §2a, DESIGN_SYSTEM §2.13/§3.7).
 *
 * ONE index, generated from the structured content at build — never hand-maintained, so it can't
 * drift from the corpus (rebuilds whenever content changes). Both search surfaces read it: the ⌘K
 * command palette (CHK-4.2, client-side via /search-index.json) and the crawlable /search page
 * (CHK-4.3, server-rendered). Searchable fields per §2a: name + aliases/latin + key compound +
 * outcomes + symptoms. Ranking: exact name > alias/latin > compound > outcome/symptom > body.
 * TIER DOES NOT BOOST RANKING — an F-grade remedy must still be findable by name (search is
 * navigation, not endorsement).
 */
import { getCollection } from 'astro:content';
import { contentIndex } from './content-index';
import type { TierId } from './tiers';

export interface SearchDoc {
  slug: string;
  url: string;
  name: string;
  kind: 'remedy'; // interventions / outcomes / context join as those pages ship
  tier: TierId;
  category: string;
  latin: string | null;
  keyCompound: string | null;
  aliases: string[];
  outcomes: string[];
  symptoms: string[];
  oneLiner: string;
}

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

/**
 * Normalize for forgiving matching: lowercase, decompose accents (NFKD), drop apostrophes so
 * "can't" → "cant", then turn any remaining punctuation into spaces so "l-theanine" ↔ "l theanine".
 * Applied to both the query and every field before comparison. (Corpus is English + latin binomials,
 * so decomposed accent marks falling to spaces via the catch-all is fine.)
 */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Score one doc against a NORMALIZED query. Higher = better match. 0 = no match (dropped).
 * §2a ranking, top to bottom: exact name, name prefix/substring, exact alias/latin, alias/latin
 * substring, key compound, outcome/symptom, then the one-line verdict (body). Tier is never scored.
 */
function score(q: string, doc: SearchDoc): number {
  const name = norm(doc.name);
  const aliases = doc.aliases.map(norm);
  const latin = norm(doc.latin ?? '');
  const compound = norm(doc.keyCompound ?? '');
  const outcomes = doc.outcomes.map(norm);
  const symptoms = doc.symptoms.map(norm);

  if (name === q) return 100;
  if (name.startsWith(q)) return 90;
  if (name.includes(q)) return 80;
  if (aliases.includes(q) || latin === q) return 75;
  if (aliases.some((a) => a.includes(q)) || (latin && latin.includes(q))) return 70;
  if (compound.includes(q)) return 60;
  if (outcomes.some((o) => o.includes(q)) || symptoms.some((s) => s.includes(q))) return 50;
  if (norm(doc.oneLiner).includes(q)) return 30;
  return 0;
}

/** Rank docs for a query. Empty query → no results (surfaces show recent/suggested instead). */
export function searchDocs(query: string, docs: SearchDoc[]): SearchDoc[] {
  const q = norm(query);
  if (!q) return [];
  return docs
    .map((doc) => ({ doc, s: score(q, doc) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.doc.name.localeCompare(b.doc.name))
    .map((r) => r.doc);
}
