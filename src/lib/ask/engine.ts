/**
 * Ask engine (CHK-6.3) — orchestrates the four guardrail layers for one page-scoped question:
 *
 *   A  classify()      deterministic refusal/routing (dosing, diagnosis, safe-for-me, combine-meds,
 *                      stop-Rx, crisis) — returns a canned refusal WITHOUT calling Gemini.
 *   B  retrieve()      page-scoped keyword retrieval; EMPTY → hard "not in reviewed evidence" refusal
 *                      (the model is never asked an out-of-corpus question).
 *   C  buildUserPrompt build the versioned prompt from the current remedy's own chunks + sources[].
 *   D  checkCitations  reject any [n] not in the page's real sources[] and any raw PMID/DOI/URL, and
 *      + lint         lint the model output for forbidden framings — either DOWNGRADES to a refusal.
 *
 * Pure and importable: Gemini is injected (`gemini`), so the CI test runner drives the exact same
 * code path with a deterministic mock and never touches the network. The default client reads
 * process.env.GEMINI_API_KEY (server-only) and calls the REST endpoint.
 */
import type { AskRemedy } from './corpus.ts';
import { sourceUrl, sourceIdLabel } from '../cite.ts';
import {
  classify,
  checkCitations,
  lintForbiddenFraming,
  noEvidenceMessage,
  citationDowngradeMessage,
  FRAMING_DOWNGRADE_MESSAGE,
  ERROR_MESSAGE,
  ROUTES,
  type Route,
} from './guardrails.ts';
import { PROMPT_VERSION, systemInstruction, buildUserPrompt } from './prompt.ts';
import { retrieve } from './retrieval.ts';
import { callGemini, type GeminiResult } from './gemini.ts';
import { callOpenRouter, OPENROUTER_DEFAULT_MODEL } from './openrouter.ts';

const BOUNDARY = 'This is educational, not medical advice.';

export type AskStatus = 'answered' | 'refused' | 'no-evidence' | 'error';

export interface AskCitation {
  n: number;
  title: string;
  sourceLine: string;
  idLabel: string;
  url: string;
  href: string; // in-page anchor to the same footnote the page renders
}

export interface AskResponse {
  status: AskStatus;
  category: string;
  answer: string;
  citations: AskCitation[];
  route: Route | null;
  meta: { promptVersion: string; geminiCalled: boolean; provider: string };
}

export type AskGemini = (args: { system: string; user: string }) => Promise<GeminiResult>;

interface ModelClient {
  fn: AskGemini;
  provider: string; // shipped in meta.provider — which backend produced (or refused to produce) the text
}

/**
 * Default server client chain (CHK-6.7): OPENROUTER_API_KEY → OpenRouter (model overridable via
 * OPENROUTER_MODEL, default deepseek/deepseek-chat); else GEMINI_API_KEY → Gemini; else a stub that
 * returns { ok:false } so the engine takes its normal graceful model-error path. Keys are read from
 * the environment (never hardcoded, never client-side).
 */
function defaultClient(): ModelClient {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  const orKey = env?.OPENROUTER_API_KEY ?? '';
  if (orKey) {
    const model = env?.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
    return {
      fn: ({ system, user }) => callOpenRouter({ apiKey: orKey, system, user, model }),
      provider: `openrouter/${model}`,
    };
  }
  const gKey = env?.GEMINI_API_KEY ?? '';
  if (gKey) {
    return {
      fn: ({ system, user }) => callGemini({ apiKey: gKey, system, user }),
      provider: 'gemini',
    };
  }
  return {
    fn: async () => ({ ok: false, text: '', error: 'missing-api-key' }),
    provider: 'none',
  };
}

export interface AskParams {
  question: string;
  slug: string;
  corpus: AskRemedy[];
  gemini?: AskGemini;
}

function withBoundary(text: string): string {
  return text.trim().endsWith(BOUNDARY) ? text.trim() : `${text.trim()}\n\n${BOUNDARY}`;
}

function toCitations(ns: number[], remedy: AskRemedy): AskCitation[] {
  const bySlug = new Map(remedy.sources.map((s) => [s.n, s]));
  const seen = new Set<number>();
  const out: AskCitation[] = [];
  for (const n of ns) {
    if (seen.has(n)) continue;
    seen.add(n);
    const s = bySlug.get(n);
    if (!s) continue;
    out.push({
      n,
      title: s.title,
      sourceLine: s.sourceLine,
      idLabel: sourceIdLabel(s),
      url: sourceUrl(s),
      href: `/r/${remedy.slug}#source-${n}`,
    });
  }
  return out.sort((a, b) => a.n - b.n);
}

const refusal = (
  category: string,
  answer: string,
  route: Route | null,
  geminiCalled: boolean,
  provider: string,
): AskResponse => ({
  status: category === 'no-evidence' ? 'no-evidence' : 'refused',
  category,
  answer,
  citations: [],
  route,
  meta: { promptVersion: PROMPT_VERSION, geminiCalled, provider },
});

/** Resolve the model client: injected (tests) or the env-driven default chain. */
function resolveClient(injected?: AskGemini): ModelClient {
  return injected ? { fn: injected, provider: 'injected' } : defaultClient();
}

/**
 * Layers B→D for ONE already-selected remedy — the shared single-remedy pipeline. Both runAsk
 * (page-scoped) and runAskSitewide (CHK-6.7) end here, so the prompt, the citation post-check, and
 * the framing lint are byte-for-byte identical for both surfaces.
 */
async function answerFromRemedy(question: string, remedy: AskRemedy, client: ModelClient): Promise<AskResponse> {
  const { provider } = client;

  // Layer B — page-scoped retrieval; empty ⇒ hard refuse before the model sees anything.
  const r = retrieve(question, remedy);
  if (!r.matched) {
    return refusal('no-evidence', noEvidenceMessage(remedy.name), null, false, provider);
  }

  // Layer C — build the versioned prompt from THIS page's chunks + sources[].
  const system = systemInstruction(remedy);
  const user = buildUserPrompt(question, remedy, r.chunks);

  // Model call (injected for tests).
  let result: GeminiResult;
  try {
    result = await client.fn({ system, user });
  } catch {
    result = { ok: false, text: '', error: 'engine-exception' };
  }
  if (!result.ok || !result.text) {
    return {
      status: 'error',
      category: 'model-error',
      answer: withBoundary(ERROR_MESSAGE),
      citations: [],
      route: null,
      meta: { promptVersion: PROMPT_VERSION, geminiCalled: true, provider },
    };
  }

  const text = result.text.trim();

  // The model correctly declined (out-of-page) → surface as no-evidence.
  if (/i don'?t have that in somnary'?s reviewed evidence/i.test(text)) {
    return refusal('no-evidence', noEvidenceMessage(remedy.name), null, true, provider);
  }

  // Layer D — forbidden-framing lint on OUTPUT → downgrade to refusal + route.
  if (lintForbiddenFraming(text).length > 0) {
    return refusal('framing-downgrade', withBoundary(FRAMING_DOWNGRADE_MESSAGE), ROUTES.clinician, true, provider);
  }

  // Layer D — citation post-check: any [n] not on this page, or any raw identifier → downgrade.
  const cite = checkCitations(text, r.allowedNs);
  if (!cite.ok) {
    return refusal('citation-downgrade', citationDowngradeMessage(remedy.name), null, true, provider);
  }

  return {
    status: 'answered',
    category: 'answered',
    answer: withBoundary(text),
    citations: toCitations(cite.cited, remedy),
    route: null,
    meta: { promptVersion: PROMPT_VERSION, geminiCalled: true, provider },
  };
}

export async function runAsk(params: AskParams): Promise<AskResponse> {
  const { question, slug, corpus } = params;
  const client = resolveClient(params.gemini);

  const remedy = corpus.find((r) => r.slug === slug);
  if (!remedy) {
    return {
      status: 'error',
      category: 'unknown-remedy',
      answer: withBoundary("I can't find that page in Somnary's corpus, so I can't answer from it."),
      citations: [],
      route: null,
      meta: { promptVersion: PROMPT_VERSION, geminiCalled: false, provider: client.provider },
    };
  }

  // Layer A — deterministic refusal/routing, no model call.
  const verdict = classify(question);
  if (verdict.kind === 'refuse') {
    return refusal(verdict.category, verdict.message, verdict.route, false, client.provider);
  }

  return answerFromRemedy(question, remedy, client);
}
