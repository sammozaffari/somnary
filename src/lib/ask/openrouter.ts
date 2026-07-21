/**
 * OpenRouter client (CHK-6.7) — a plain `fetch` wrapper for the OpenAI-compatible chat-completions
 * endpoint. NO new npm dependency (same owner choice as gemini.ts); the engine picks this client
 * first when OPENROUTER_API_KEY is present, falling back to Gemini (see engine.ts defaultClient).
 *
 * The API key is read from process.env by the caller and passed in — this module never hardcodes
 * it and is only ever imported by SERVER code (the engine's default client via the /api routes).
 * It must never reach a client bundle.
 *
 * fetch is INJECTABLE (`fetchImpl`) so the engine stays fully testable with a mock — CI never makes
 * a network call. Resolves to the SAME result shape as gemini.ts (GeminiResult) so the engine and
 * the CI mock drive one code path; never throws for network/auth failures.
 */
import type { FetchLike, GeminiResult } from './gemini.ts';

export interface OpenRouterRequest {
  apiKey: string;
  system: string;
  user: string;
  model?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  temperature?: number;
  maxTokens?: number;
}

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

/** Default model — cheap, capable, and available on OpenRouter. Overridable per-request and via
 * the OPENROUTER_MODEL env var (resolved by the engine's default client, not here). */
export const OPENROUTER_DEFAULT_MODEL = 'deepseek/deepseek-chat';

/** Call chat/completions. Resolves to a GeminiResult-shaped object; never throws. */
export async function callOpenRouter(req: OpenRouterRequest): Promise<GeminiResult> {
  const {
    apiKey,
    system,
    user,
    model = OPENROUTER_DEFAULT_MODEL,
    fetchImpl,
    timeoutMs = 20000,
    temperature = 0.2,
    maxTokens = 768,
  } = req;

  if (!apiKey) return { ok: false, text: '', error: 'missing-api-key' };
  const doFetch = (fetchImpl ?? (globalThis.fetch as unknown as FetchLike)) as FetchLike;

  const body = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature,
    max_tokens: maxTokens,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await doFetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
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
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };
    const text = (data.choices?.[0]?.message?.content ?? '').trim();
    if (!text) {
      return { ok: false, text: '', error: data.error?.message ? `api-${data.error.message.slice(0, 200)}` : 'empty-response' };
    }
    return { ok: true, text };
  } catch (err) {
    const name = (err as { name?: string })?.name;
    return { ok: false, text: '', error: name === 'AbortError' ? 'timeout' : `network-${String((err as Error)?.message ?? err)}` };
  } finally {
    clearTimeout(timer);
  }
}
