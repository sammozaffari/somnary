/**
 * Lens evidence retrieval (CHK-7.1a) — the bounded external-research provider.
 *
 * The Lens engine's D5 non-negotiable: research is BOUNDED, every claim is cited to a resolvable
 * source, and a failure to find evidence degrades to "inconclusive" — never a guess. This module is
 * the retrieval half: given a normalized query it returns a short list of real, citable evidence
 * documents (title + abstract) that later stages (7.1b verification, 7.1c composition) read over.
 *
 * BEHIND AN INTERFACE (EvidenceProvider) so a general web-search API can slot in later — deferred,
 * [HUMAN-GATE] G-SEARCH — without touching any downstream stage. The only concrete provider today is
 * PubMedProvider (NCBI E-utilities: free, keyless).
 *
 * NEVER THROWS. Mirrors src/lib/ask/openrouter.ts: an INJECTABLE `fetchImpl` (default global fetch),
 * a timeout, and total-failure containment — any network error, malformed/empty JSON or XML, or a
 * non-ok HTTP status resolves to `[]` so the engine degrades gracefully. Every returned PMID is
 * validated through the shared citations.ts format-check (the SAME rule the CI resolver enforces);
 * any id that doesn't validate is dropped, so a malformed id can never reach a citation.
 *
 * Written in erasable TS (types + plain functions) so Node's type-stripping can import it directly in
 * the offline CI test runner (scripts/test-lens.mjs).
 */

import type { FetchLike } from '../ask/gemini.ts';
import { isValidId, canonicalUrlByKind } from './citations.ts';

/** One retrieved evidence document — the minimal shape every provider returns and every downstream
 * stage reads. A general web-search provider (G-SEARCH) would populate the same fields. */
export interface EvidenceDoc {
  pmid: string;
  title: string;
  abstractText: string;
  url: string;
  year?: string;
}

/** The provider contract. Building behind this is REQUIRED so the source of evidence can change
 * (PubMed → web search) without any downstream stage knowing. `search` NEVER throws. */
export interface EvidenceProvider {
  search(query: string): Promise<EvidenceDoc[]>;
}

export interface PubMedProviderOptions {
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  /** Cap on returned documents (NCBI polite-use + bounded research). */
  maxResults?: number;
  /** NCBI polite-use contact; read from NCBI_EUTILS_EMAIL by the caller. Optional — works without. */
  email?: string;
}

const ESEARCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const EFETCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

const DEFAULT_MAX_RESULTS = 6;
const DEFAULT_TIMEOUT_MS = 12000;
// NCBI polite-use: identify the tool. `email` is added when provided. Keyless — no API key needed.
const TOOL = 'somnary';

/** Build the shared query params (tool + optional email) once. */
function politeParams(email?: string): Record<string, string> {
  const p: Record<string, string> = { tool: TOOL };
  if (email) p.email = email;
  return p;
}

/** A single guarded fetch: applies the timeout, returns the Response, or null on ANY failure. */
async function guardedFetch(
  url: string,
  doFetch: FetchLike,
  timeoutMs: number,
): Promise<Awaited<ReturnType<FetchLike>> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await doFetch(url, { method: 'GET', signal: controller.signal });
    if (!res.ok) return null;
    return res;
  } catch {
    return null; // network error / timeout / abort — degrade to null (caller returns [])
  } finally {
    clearTimeout(timer);
  }
}

function toQuery(base: string, params: Record<string, string>): string {
  const usp = new URLSearchParams(params);
  return `${base}?${usp.toString()}`;
}

/** esearch (retmode=json) → validated PMID list. Never throws; malformed/empty → []. */
async function esearchPmids(
  query: string,
  max: number,
  email: string | undefined,
  doFetch: FetchLike,
  timeoutMs: number,
): Promise<string[]> {
  const url = toQuery(ESEARCH, {
    ...politeParams(email),
    db: 'pubmed',
    retmode: 'json',
    retmax: String(max),
    term: query,
  });
  const res = await guardedFetch(url, doFetch, timeoutMs);
  if (!res) return [];
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return [];
  }
  const idlist = (data as { esearchresult?: { idlist?: unknown } })?.esearchresult?.idlist;
  if (!Array.isArray(idlist)) return [];
  // Validate EVERY id through the shared format-check; drop any that doesn't validate (a
  // fabricated/garbage id can never become a citation). Dedupe, and cap.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of idlist) {
    if (typeof raw !== 'string') continue;
    const pmid = raw.trim();
    if (!isValidId('pmid', pmid) || seen.has(pmid)) continue;
    seen.add(pmid);
    out.push(pmid);
    if (out.length >= max) break;
  }
  return out;
}

// --- efetch XML parsing (built-ins only; NO xml dependency) --------------------------------------
// PubMed's efetch abstract endpoint returns XML only (esummary JSON carries no abstract), so we
// parse the small, well-structured <PubmedArticle> records with regex over the raw text. This is
// deliberately conservative: any record we can't cleanly parse is skipped, never guessed at.

function decodeEntities(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ') // strip inline markup (e.g. <i>, <sup> in abstracts/titles)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull the text of the first matching tag (case-sensitive tag name) inside a fragment, or ''. */
function tagText(fragment: string, tag: string): string {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = re.exec(fragment);
  return m ? decodeEntities(m[1]) : '';
}

/** All AbstractText segments joined (structured abstracts have several labelled sections). */
function abstractOf(fragment: string): string {
  const parts: string[] = [];
  const re = /<AbstractText\b[^>]*>([\s\S]*?)<\/AbstractText>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fragment))) {
    const t = decodeEntities(m[1]);
    if (t) parts.push(t);
  }
  return parts.join(' ').trim();
}

/** Parse an efetch pubmed XML payload into partial docs keyed by PMID. Never throws. */
function parseEfetchXml(xml: string): Map<string, { title: string; abstractText: string; year?: string }> {
  const out = new Map<string, { title: string; abstractText: string; year?: string }>();
  if (typeof xml !== 'string' || !xml.includes('<PubmedArticle')) return out;
  const articleRe = /<PubmedArticle\b[\s\S]*?<\/PubmedArticle>/gi;
  let m: RegExpExecArray | null;
  while ((m = articleRe.exec(xml))) {
    const frag = m[0];
    // PMID: the <PMID …>NNN</PMID> inside <MedlineCitation> (the first PMID in the record).
    const pmidMatch = /<PMID\b[^>]*>(\d+)<\/PMID>/i.exec(frag);
    if (!pmidMatch) continue;
    const pmid = pmidMatch[1];
    if (!isValidId('pmid', pmid)) continue;
    const title = tagText(frag, 'ArticleTitle');
    const abstractText = abstractOf(frag);
    const year = (/<PubDate\b[^>]*>[\s\S]*?<Year\b[^>]*>(\d{4})<\/Year>/i.exec(frag)?.[1]) || undefined;
    out.set(pmid, { title, abstractText, year });
  }
  return out;
}

/** efetch (rettype=abstract, retmode=xml) for a set of PMIDs → parsed records. Never throws. */
async function efetchAbstracts(
  pmids: string[],
  email: string | undefined,
  doFetch: FetchLike,
  timeoutMs: number,
): Promise<Map<string, { title: string; abstractText: string; year?: string }>> {
  if (pmids.length === 0) return new Map();
  const url = toQuery(EFETCH, {
    ...politeParams(email),
    db: 'pubmed',
    rettype: 'abstract',
    retmode: 'xml',
    id: pmids.join(','),
  });
  const res = await guardedFetch(url, doFetch, timeoutMs);
  if (!res) return new Map();
  let xml: string;
  try {
    xml = await res.text();
  } catch {
    return new Map();
  }
  return parseEfetchXml(xml);
}

/**
 * PubMed evidence provider via NCBI E-utilities. Sequential (esearch → efetch) to respect NCBI's
 * ~3 req/s polite-use limit. NEVER throws — every failure path resolves to [] so the engine can
 * degrade to "inconclusive". No API key required.
 */
export class PubMedProvider implements EvidenceProvider {
  private readonly doFetch: FetchLike;
  private readonly timeoutMs: number;
  private readonly maxResults: number;
  private readonly email?: string;

  constructor(opts: PubMedProviderOptions = {}) {
    this.doFetch = (opts.fetchImpl ?? (globalThis.fetch as unknown as FetchLike)) as FetchLike;
    this.timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxResults = Math.max(1, opts.maxResults ?? DEFAULT_MAX_RESULTS);
    this.email = opts.email;
  }

  async search(query: string): Promise<EvidenceDoc[]> {
    const q = typeof query === 'string' ? query.trim() : '';
    if (!q) return [];
    const pmids = await esearchPmids(q, this.maxResults, this.email, this.doFetch, this.timeoutMs);
    if (pmids.length === 0) return [];
    const records = await efetchAbstracts(pmids, this.email, this.doFetch, this.timeoutMs);

    const docs: EvidenceDoc[] = [];
    for (const pmid of pmids) {
      const rec = records.get(pmid);
      // Keep the esearch order (relevance); require at minimum a title we could parse. A record we
      // couldn't fetch/parse is dropped rather than emitted as a bare, unusable citation.
      if (!rec || !rec.title) continue;
      docs.push({
        pmid,
        title: rec.title,
        abstractText: rec.abstractText,
        url: canonicalUrlByKind.pmid(pmid),
        year: rec.year,
      });
      if (docs.length >= this.maxResults) break;
    }
    return docs;
  }
}
