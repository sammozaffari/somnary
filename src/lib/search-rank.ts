/**
 * Pure search ranking (CHK-4.1 core) — NO astro:content import, so it is safe to bundle into the
 * client (the ⌘K palette imports this directly). The server index builder (src/lib/search.ts)
 * imports the same functions, so both surfaces rank identically. See src/lib/search.ts for the
 * build-time index. §2a ranking; TIER NEVER BOOSTS.
 */
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

/**
 * Normalize for forgiving matching: lowercase, decompose accents (NFKD), drop apostrophes so
 * "can't" → "cant", then turn any remaining punctuation into spaces so "l-theanine" ↔ "l theanine".
 * Applied to both the query and every field before comparison.
 */
export function norm(s: string): string {
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
