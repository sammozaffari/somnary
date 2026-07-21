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

export interface ScoredDoc {
  doc: SearchDoc;
  score: number;
}

/** Rank docs for a query, keeping each doc's score (CHK-6.7 — the palette's ask heuristic needs the
 * top score). Same ranking as searchDocs; empty query → no results. */
export function searchDocsScored(query: string, docs: SearchDoc[]): ScoredDoc[] {
  const q = norm(query);
  if (!q) return [];
  return docs
    .map((doc) => ({ doc, score: score(q, doc) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.name.localeCompare(b.doc.name));
}

/** Rank docs for a query. Empty query → no results (surfaces show recent/suggested instead). */
export function searchDocs(query: string, docs: SearchDoc[]): SearchDoc[] {
  return searchDocsScored(query, docs).map((r) => r.doc);
}

/**
 * Should the palette offer its "ask the assistant" row? (CHK-6.7) Pure and deterministic:
 * offer when the query reads like a QUESTION, or when lexical search came back WEAK — and only for
 * queries long enough to mean something (≥ 8 chars). A strong lexical hit on a plain term (e.g.
 * "melatonin") stays a plain search; the crawlable /search page is untouched by this.
 */
export function shouldOfferAsk(query: string, topScore: number, resultCount: number): boolean {
  const q = query.trim();
  if (q.length < 8) return false;
  const questionShaped =
    /\?\s*$/.test(q) ||
    (/^(how|why|does|do|is|are|can|could|should|will|what|when|which|who)\b/i.test(q) && q.split(/\s+/).length >= 3);
  const weak = resultCount === 0 || topScore < 50;
  return questionShaped || weak;
}
