/**
 * Gemini client (CHK-6.3) — a plain `fetch` wrapper for the REST generateContent endpoint. NO
 * @google/generative-ai dependency (owner choice); no new npm package at all.
 *
 * The API key is read from process.env.GEMINI_API_KEY by the caller and passed in — this module
 * never hardcodes it and is only ever imported by SERVER code (the engine's default client and the
 * /api/ask route). It must never reach a client bundle.
 *
 * fetch is INJECTABLE (`fetchImpl`) so the engine is fully testable with a mock — CI never makes a
 * network call. Auth uses the standard `?key=` query param. NOTE: the provided key format is unusual
 * ("AQ.Ab8…", not the typical "AIza…"); if a live call returns an auth error, that is surfaced as a
 * normal { ok:false } result for the owner to investigate (key rotation / different auth header /
 * different endpoint) — it never throws the build.
 */

export type FetchLike = (input: string, init?: unknown) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}>;

export interface GeminiRequest {
  apiKey: string;
  system: string;
  user: string;
  model?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResult {
  ok: boolean;
  text: string;
  status?: number;
  error?: string;
}

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
// gemini-flash-lite-latest is on the FREE tier (verified 2026-07-10); the pinned gemini-2.0-flash
// models now return 429 "limit: 0" (Google moved 2.0 to paid-only). Flash-Lite is cheaper and has
// higher free-tier limits — good fit for a scoped, low-volume RAG assistant. Overridable via opts.
const DEFAULT_MODEL = 'gemini-flash-lite-latest';

/** Call generateContent. Resolves to a GeminiResult; never throws for network/auth failures. */
export async function callGemini(req: GeminiRequest): Promise<GeminiResult> {
  const {
    apiKey,
    system,
    user,
    model = DEFAULT_MODEL,
    fetchImpl,
    timeoutMs = 12000,
    temperature = 0.2,
    maxOutputTokens = 768,
  } = req;

  if (!apiKey) return { ok: false, text: '', error: 'missing-api-key' };
  const doFetch = (fetchImpl ?? (globalThis.fetch as unknown as FetchLike)) as FetchLike;

  const url = `${ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: { temperature, maxOutputTokens, topP: 0.9 },
    // Let the app's own guardrails do the medical gating; keep Google's blockers off "safe" so a
    // benign sleep question isn't silently dropped. Our Layers A/D remain the real safety envelope.
    safetySettings: [],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      let detail = '';
      try {
        detail = (await res.text()).slice(0, 300);
      } catch {
        /* ignore */
      }
      return { ok: false, text: '', status: res.status, error: `http-${res.status}${detail ? `: ${detail}` : ''}` };
    }
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      promptFeedback?: { blockReason?: string };
    };
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? '')
      .join('')
      .trim();
    if (!text) {
      const blocked = data.promptFeedback?.blockReason;
      return { ok: false, text: '', error: blocked ? `blocked-${blocked}` : 'empty-response' };
    }
    return { ok: true, text };
  } catch (err) {
    const name = (err as { name?: string })?.name;
    return { ok: false, text: '', error: name === 'AbortError' ? 'timeout' : `network-${String((err as Error)?.message ?? err)}` };
  } finally {
    clearTimeout(timer);
  }
}
