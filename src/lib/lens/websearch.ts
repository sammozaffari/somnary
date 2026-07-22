/**
 * Lens web-references tier (CHK-7.7) — REPUTABLE-ONLY web search via OpenRouter's `web` plugin.
 *
 * WHY A SEPARATE, WEAKER TIER: the study pipeline (PubMed + Europe PMC) is the evidence spine, and its
 * findings are peer-reviewed. The web is not. So the web tier is DELIBERATELY constrained: it only ever
 * cites a curated allowlist of reputable medical/government/health references (MedlinePlus, NIH/PMC,
 * DailyMed, Drugs.com, NHS, Cochrane, Mayo, the Sleep Foundation…), and the UI shows it BELOW the study
 * evidence, labelled "not primary studies". A supplement marketer's blog can never appear.
 *
 * THE FIREWALL HOLDS HERE TOO: the model researches, but the SERVER grounds. Every note the model
 * returns must (a) cite a URL whose host is on the reputable allowlist, and (b) carry a VERBATIM quote
 * that is a real substring of that reputable source's fetched text (the SAME quoteIsGrounded check the
 * study verifier uses). A paraphrased or fabricated quote is dropped deterministically. The model's own
 * synthesised answer prose is NEVER used — only the grounded notes tied to reputable sources.
 *
 * COST + OPT-IN: the `web` plugin bills per search (~$0.006/query). So this tier is ENV-GATED
 * (LENS_WEB_SEARCH must be truthy) and, like everything else, degrades to [] on any failure — the study
 * tiers are unaffected whether or not it runs.
 *
 * Erasable TS; the offline suite drives it with an injected fetch (no network).
 */

import type { FetchLike, GeminiResult } from '../ask/gemini.ts';
import { quoteIsGrounded } from './verify.ts';
import { LENS_WEB_PROMPT } from './prompts.ts';

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

/** One grounded web note the card can show: a short factual sleep note + its reputable source. */
export interface WebFinding {
  text: string;
  url: string;
  domain: string;
}

/**
 * The ONLY hosts the web tier will cite. Curated: government health, national libraries, drug
 * references, major medical institutions, and sleep-medicine bodies. A host must equal one of these or
 * be a subdomain of it — nothing else (no blogs, forums, retailers, marketing).
 */
export const REPUTABLE_DOMAINS: readonly string[] = [
  'medlineplus.gov',
  'nlm.nih.gov',
  'ncbi.nlm.nih.gov',
  'pmc.ncbi.nlm.nih.gov',
  'nih.gov',
  'nccih.nih.gov',
  'dailymed.nlm.nih.gov',
  'pubmed.ncbi.nlm.nih.gov',
  'fda.gov',
  'ema.europa.eu',
  'nhs.uk',
  'cochrane.org',
  'cochranelibrary.com',
  'drugs.com',
  'mayoclinic.org',
  'clevelandclinic.org',
  'hopkinsmedicine.org',
  'cdc.gov',
  'who.int',
  'health.gov',
  'nice.org.uk',
  'merckmanuals.com',
  // sleepfoundation.org deliberately EXCLUDED — it runs product/mattress review content with commercial
  // ties (D2: no commerce-adjacency). aasm.org + sleepeducation.org (both American Academy of Sleep
  // Medicine, non-commercial) cover the sleep-medicine reference need.
  'aasm.org',
  'sleepeducation.org',
];

/** The registrable hostname of a URL, lowercased, without a leading www. '' on any parse failure. */
export function domainOf(url: unknown): string {
  if (typeof url !== 'string' || !url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

/** True iff a URL's HOST is on the reputable allowlist (exact host or a subdomain of an allowed host).
 * Deliberately host-based (not substring), so a path like `/nih.gov/` on a junk domain can't sneak in. */
export function isReputableUrl(url: unknown): boolean {
  const host = domainOf(url);
  if (!host) return false;
  return REPUTABLE_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
}

/** Parse the model's web reply into candidate notes. Tolerant of code-fence/prose wrapping; ANY failure
 * → []. Each note is {text, quote, url}; malformed entries are skipped. */
export function parseWebNotes(raw: string): Array<{ text: string; quote: string; url: string }> {
  const text = typeof raw === 'string' ? raw : '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  const root = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  const rawNotes = Array.isArray(root.notes) ? root.notes : [];
  const out: Array<{ text: string; quote: string; url: string }> = [];
  for (const n of rawNotes) {
    if (!n || typeof n !== 'object') continue;
    const rec = n as Record<string, unknown>;
    const noteText = typeof rec.text === 'string' ? rec.text.trim() : '';
    const quote = typeof rec.quote === 'string' ? rec.quote.trim() : '';
    const url = typeof rec.url === 'string' ? rec.url.trim() : '';
    if (!noteText || !quote) continue;
    out.push({ text: noteText, quote, url });
  }
  return out;
}

/** Extract the reputable source contents (url → fetched text) from the plugin's annotations. */
function reputableSources(annotations: unknown): Map<string, string> {
  const map = new Map<string, string>();
  if (!Array.isArray(annotations)) return map;
  for (const a of annotations) {
    if (!a || typeof a !== 'object') continue;
    const c = ((a as Record<string, unknown>).url_citation ?? a) as Record<string, unknown>;
    const url = typeof c.url === 'string' ? c.url : '';
    const content = typeof c.content === 'string' ? c.content : '';
    if (!url || !content || !isReputableUrl(url) || map.has(url)) continue;
    map.set(url, content);
  }
  return map;
}

export interface WebResearchArgs {
  subject: string;
  apiKey: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  model?: string;
  maxResults?: number;
  maxNotes?: number;
}

/** Bound on notes shown; keeps the tier tight and the cost bounded. */
const DEFAULT_MAX_NOTES = 4;

/**
 * Run one reputable-only web research pass via OpenRouter's `web` plugin. Returns GROUNDED findings:
 * each carries a reputable source URL and a note whose verbatim quote is a real substring of that
 * source's fetched text. NEVER throws → [] on any failure (missing key, network, non-ok, bad JSON,
 * nothing grounded). The model's free answer prose is discarded — only grounded, reputable notes survive.
 */
export async function openRouterWebResearch(args: WebResearchArgs): Promise<WebFinding[]> {
  const subject = typeof args.subject === 'string' ? args.subject.trim().slice(0, 400) : '';
  const apiKey = args.apiKey;
  if (!apiKey || !subject) return [];
  const doFetch = (args.fetchImpl ?? (globalThis.fetch as unknown as FetchLike)) as FetchLike;
  const model = args.model || 'deepseek/deepseek-chat';
  const maxResults = Math.max(1, Math.min(10, args.maxResults ?? 6));
  const maxNotes = Math.max(1, args.maxNotes ?? DEFAULT_MAX_NOTES);
  const timeoutMs = args.timeoutMs ?? 28000;

  const body = {
    model,
    plugins: [{ id: 'web', max_results: maxResults }],
    messages: [
      { role: 'system', content: LENS_WEB_PROMPT },
      {
        role: 'user',
        content: `SUBJECT: ${subject}\n\nResearch this subject's EFFECT ON SLEEP using reputable medical references only, and return ONLY the JSON object described. Every note must carry a verbatim quote from a reputable source and that source's URL.`,
      },
    ],
    temperature: 0.1,
    max_tokens: 800,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let data: {
    choices?: Array<{ message?: { content?: string; annotations?: unknown } }>;
  } | null = null;
  try {
    const res = await doFetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return [];
    data = (await res.json()) as typeof data;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }

  const msg = data?.choices?.[0]?.message;
  if (!msg) return [];
  const sources = reputableSources(msg.annotations);
  if (sources.size === 0) return [];
  const notes = parseWebNotes(typeof msg.content === 'string' ? msg.content : '');

  const out: WebFinding[] = [];
  const seen = new Set<string>();
  for (const n of notes) {
    // Resolve the note to a reputable source: prefer the model's cited URL if we fetched it; else find
    // any reputable source whose fetched text actually contains the verbatim quote.
    let url = isReputableUrl(n.url) && sources.has(n.url) ? n.url : '';
    if (!url) {
      for (const [u, content] of sources) {
        if (quoteIsGrounded(n.quote, content, n.text)) {
          url = u;
          break;
        }
      }
    }
    if (!url) continue;
    // THE FIREWALL: the quote must be a real verbatim substring of THIS reputable source's text.
    if (!quoteIsGrounded(n.quote, sources.get(url) as string, n.text)) continue;
    const key = n.text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ text: n.text, url, domain: domainOf(url) });
    if (out.length >= maxNotes) break;
  }
  return out;
}

/** The injectable web-research function the engine calls. ENV-GATED: returns a no-op ([]) unless
 * LENS_WEB_SEARCH is truthy AND an OpenRouter key is present — so the paid `web` plugin never bills
 * unless the owner opts in. Tests inject their own function; the engine default reads env here. */
export type WebResearchFn = (subject: string, timeoutMs?: number) => Promise<WebFinding[]>;

export function defaultWebResearch(): WebResearchFn {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  // Truthy-but-not-whitespace opt-in: "1"/"on"/"true" enable; unset/"0"/"false"/" " do not (no billing).
  const flag = (env?.LENS_WEB_SEARCH ?? '').trim();
  const enabled = !!flag && flag !== '0' && flag.toLowerCase() !== 'false';
  const apiKey = env?.OPENROUTER_API_KEY ?? '';
  const model = env?.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
  if (!enabled || !apiKey) return async () => [];
  // The engine passes a timeout clamped to the remaining wall-clock budget (CHK-7.7 latency fix).
  return (subject: string, timeoutMs?: number) => openRouterWebResearch({ subject, apiKey, model, timeoutMs });
}
