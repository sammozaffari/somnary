/**
 * Ask retrieval (CHK-6.3, Layer B) — page-scoped, keyword/structured, NO embeddings, NO new deps.
 *
 * Given a question and the CURRENT remedy, return the most relevant chunks of that remedy plus the
 * citation universe the answer is allowed to draw on. If nothing on the page is relevant it returns
 * EMPTY — the engine turns an empty retrieval into a hard "not in Somnary's reviewed evidence"
 * refusal, so the model is never even asked an out-of-corpus question.
 *
 * The allowed-citation set is the WHOLE current page's sources[] (page-scoped): the assistant may
 * cite any real source shown on this page, and Layer D rejects anything else. Retrieval decides
 * answerability and supplies context; it does not narrow which of the page's own citations are legal.
 *
 * Normalization is the SAME function the search index/palette use (src/lib/search-rank · norm), so
 * "l-theanine" ↔ "l theanine" tokenizes identically everywhere.
 */
import { norm } from '../search-rank.ts';
import type { AskRemedy, AskChunk, AskSource } from './corpus.ts';

// Common words that carry no retrieval signal — kept small and generic (no medical terms, so a
// question's clinical words always survive to match the page).
const STOP = new Set([
  'the', 'and', 'for', 'are', 'was', 'were', 'you', 'your', 'this', 'that', 'with', 'what', 'why',
  'how', 'does', 'did', 'can', 'could', 'would', 'should', 'will', 'about', 'from', 'into', 'have',
  'has', 'had', 'they', 'them', 'its', 'but', 'not', 'any', 'all', 'get', 'got', 'use', 'used',
  'take', 'taking', 'tell', 'know', 'work', 'works', 'help', 'helps', 'good', 'bad', 'really',
  'actually', 'much', 'many', 'more', 'most', 'some', 'when', 'who', 'which', 'there', 'their',
]);

export function tokenize(s: string): string[] {
  return norm(s)
    .split(' ')
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export interface Retrieval {
  chunks: AskChunk[];
  sources: AskSource[]; // the page's whole citation universe (allowed set)
  allowedNs: number[];
  matched: boolean;
}

const chunkTokens = (c: AskChunk): Set<string> => new Set(tokenize(c.text));

/** Score a chunk: number of distinct question tokens it contains (source-finding chunks get a
 * small tie-break bump so a question that names a finding surfaces the citation that backs it). */
function score(qTokens: string[], c: AskChunk): number {
  const ct = chunkTokens(c);
  let hits = 0;
  for (const t of qTokens) if (ct.has(t)) hits++;
  if (hits === 0) return 0;
  return hits * 10 + (c.kind === 'source' ? 1 : 0) + (c.sources.length ? 1 : 0);
}

/**
 * Site-wide remedy SELECTION (CHK-6.7) — corpus-wide is NOT cross-remedy synthesis. This picks the
 * single remedy most likely to hold the answer, and the engine then runs the UNCHANGED single-remedy
 * pipeline (retrieve → prompt → post-checks) against that one page, so the model never sees two
 * remedies' evidence in one context ([n] footnotes are per-page; mixing would break citation
 * integrity).
 *
 * Selection is deterministic:
 *   1. A remedy explicitly named in the question (detected by the engine via detectRemedyMentions)
 *      wins outright — pass it as `named`.
 *   2. Otherwise every remedy is scored with the SAME per-remedy chunk scorer, using only the
 *      question's DISTINCTIVE tokens: a token that appears in more than half of the corpus (e.g.
 *      "sleep", "insomnia" — this is a sleep-remedy reference, so those match everything) carries no
 *      signal about WHICH remedy and is dropped. No distinctive token, or no remedy scoring > 0,
 *      returns null → the engine refuses with the site-wide no-evidence copy, model never called.
 *   3. Ties break on name order (stable, locale-independent-enough for our slugs).
 */
export function retrieveSitewide(
  question: string,
  corpus: AskRemedy[],
  named?: AskRemedy | null,
): AskRemedy | null {
  if (named) return named;
  const qTokens = tokenize(question);
  if (qTokens.length === 0 || corpus.length === 0) return null;

  // Token sets per remedy (union of all chunk tokens), computed once per call.
  const remedyTokens = corpus.map((r) => {
    const set = new Set<string>();
    for (const c of r.chunks) for (const t of tokenize(c.text)) set.add(t);
    return set;
  });

  // Document frequency: drop tokens present in more than half the corpus (ubiquitous ⇒ no signal).
  const distinctive = qTokens.filter((t) => {
    let df = 0;
    for (const set of remedyTokens) if (set.has(t)) df++;
    return df > 0 && df <= corpus.length / 2;
  });
  if (distinctive.length === 0) return null;

  let best: AskRemedy | null = null;
  let bestScore = 0;
  corpus.forEach((r, i) => {
    if (!distinctive.some((t) => remedyTokens[i].has(t))) return;
    let total = 0;
    for (const c of r.chunks) total += score(distinctive, c);
    if (total > bestScore || (total === bestScore && best && r.name.localeCompare(best.name) < 0)) {
      best = r;
      bestScore = total;
    }
  });
  return bestScore > 0 ? best : null;
}

export function retrieve(question: string, remedy: AskRemedy, topK = 6): Retrieval {
  const qTokens = tokenize(question);
  const allowedNs = remedy.sources.map((s) => s.n);
  const emptyBase = { sources: remedy.sources, allowedNs };
  if (qTokens.length === 0) return { chunks: [], matched: false, ...emptyBase };

  const ranked = remedy.chunks
    .map((c) => ({ c, s: score(qTokens, c) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK)
    .map((r) => r.c);

  return { chunks: ranked, matched: ranked.length > 0, ...emptyBase };
}
