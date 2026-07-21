// Site-wide ask server route (CHK-6.7) — the corpus-wide sibling of /api/ask. Same shell, no slug:
// validate + cap the question, load the SAME single corpus, hand to runAskSitewide (which owns
// classify → multi-remedy router → single-remedy selection → the unchanged guardrail pipeline).
// Runs as a serverless function so the model API key stays server-side (process.env), never in a
// client bundle. Everything else on the site stays static.
import type { APIRoute } from 'astro';
import { getAskCorpus } from '../../lib/ask/from-collection.ts';
import { runAskSitewide } from '../../lib/ask/engine.ts';
import { checkRateLimit, clientIpFrom, rateLimitConfig } from '../../lib/rate-limit.ts';

export const prerender = false;

const MAX_QUESTION = 500;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: { question?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid-json' }, 400);
  }

  const question = typeof payload.question === 'string' ? payload.question.trim() : '';

  if (question.length < 3) return json({ error: 'empty-question' }, 400);
  if (question.length > MAX_QUESTION) return json({ error: 'question-too-long', max: MAX_QUESTION }, 413);

  // Per-IP rate limit BEFORE the model call, so an over-limit caller never spends LLM credit.
  // Separate bucket per endpoint ('search-ask:' prefix). Fails open if Supabase is unconfigured.
  const { max, windowSeconds } = rateLimitConfig();
  const { allowed, retryAfter } = await checkRateLimit({
    key: `search-ask:${clientIpFrom(request)}`,
    limit: max,
    windowSeconds,
  });
  if (!allowed) {
    return json({ error: 'rate-limited', retryAfter }, 429, { 'Retry-After': String(retryAfter) });
  }

  const corpus = await getAskCorpus();
  const response = await runAskSitewide({ question, corpus });
  return json(response);
};

// Method guard: only POST is accepted.
export const ALL: APIRoute = () => json({ error: 'method-not-allowed' }, 405);
