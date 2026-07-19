// Scoped-assistant server route (CHK-6.3) — the FIRST on-demand route on the site. Everything else
// stays static (crawlability non-negotiable); only this endpoint runs as a Vercel function so the
// GEMINI_API_KEY is read SERVER-SIDE (process.env) and never reaches any client bundle.
//
// POST { question, slug } → JSON AskResponse. The route is a thin shell: validate + cap input, load
// the page-scoped corpus, hand to the engine (which owns all four guardrail layers).
import type { APIRoute } from 'astro';
import { getAskCorpus } from '../../lib/ask/from-collection.ts';
import { runAsk } from '../../lib/ask/engine.ts';
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
  let payload: { question?: unknown; slug?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid-json' }, 400);
  }

  const question = typeof payload.question === 'string' ? payload.question.trim() : '';
  const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return json({ error: 'invalid-slug' }, 400);
  if (question.length < 3) return json({ error: 'empty-question' }, 400);
  if (question.length > MAX_QUESTION) return json({ error: 'question-too-long', max: MAX_QUESTION }, 413);

  // Per-IP rate limit BEFORE the model call, so an over-limit caller never spends LLM credit.
  // Separate bucket per endpoint ('ask:' prefix). Fails open if Supabase is unconfigured or errors.
  const { max, windowSeconds } = rateLimitConfig();
  const { allowed, retryAfter } = await checkRateLimit({
    key: `ask:${clientIpFrom(request)}`,
    limit: max,
    windowSeconds,
  });
  if (!allowed) {
    return json({ error: 'rate-limited', retryAfter }, 429, { 'Retry-After': String(retryAfter) });
  }

  const corpus = await getAskCorpus();
  const response = await runAsk({ question, slug, corpus });
  return json(response);
};

// Method guard: only POST is accepted.
export const ALL: APIRoute = () => json({ error: 'method-not-allowed' }, 405);
