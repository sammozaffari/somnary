// Guide concierge server route (CHK-6.8b) — the third on-demand route on the site, and the sibling of
// /api/ask and /api/search-ask. Same thin-shell shape: validate + cap input, rate-limit per IP, load
// the SAME single corpus, hand to the deterministic guide engine (runGuideBeat, CHK-6.8a — which owns
// the topic-fence, the Layer-A refusals, the ONE model call, ack sanitization, and signal→URL routing).
// Runs as a serverless function (prerender=false) so the model API key stays server-side (process.env),
// never in a client bundle. Everything else on the site stays static (crawlability non-negotiable).
//
// POST { beat, text, priorState? } → the engine's GuideBeatResult JSON (ack + deterministic route-plan
// of REAL corpus URLs + accumulated state to post back on the next beat). The model has NO channel to
// name a remedy-as-recommendation, a dose, a diagnosis, or a URL — the server maps signals to routes.
//
// The client is NEVER trusted: `beat` must be a known intake beat, `text` is trimmed+capped, and
// `priorState` is coerced through the merged schema validator (coercePriorState) — a hostile client
// cannot inject arbitrary state. All of that lives in ../../lib/guide/route-input.ts (testable offline).
import type { APIRoute } from 'astro';
import { getAskCorpus } from '../../lib/ask/from-collection.ts';
import { runGuideBeat } from '../../lib/guide/engine.ts';
import { isGuideBeat, validateText, coercePriorState, MAX_GUIDE_TEXT } from '../../lib/guide/route-input.ts';
import { checkRateLimit, clientIpFrom, rateLimitConfig } from '../../lib/rate-limit.ts';

export const prerender = false;

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
  let payload: { beat?: unknown; text?: unknown; priorState?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid-json' }, 400);
  }

  // Unknown/hostile beat → 400 BEFORE any work (never reaches the model or the corpus load).
  if (!isGuideBeat(payload.beat)) return json({ error: 'invalid-beat' }, 400);

  // Trim + cap the one free-text intake message (same policy as /api/ask): empty → 400, too-long → 413.
  const textCheck = validateText(payload.text);
  if (!textCheck.ok) {
    if (textCheck.error === 'text-too-long') return json({ error: 'text-too-long', max: MAX_GUIDE_TEXT }, 413);
    return json({ error: 'empty-text' }, 400);
  }

  // Coerce the untrusted priorState through the merged schema validator — a hostile client cannot
  // inject arbitrary state (unknown enums dropped, scalars fall back, arrays capped, redFlags
  // normalized, prose discarded). Non-object input degrades to a fresh first beat.
  const priorState = coercePriorState(payload.priorState);

  // Per-IP rate limit BEFORE the model/engine work, so an over-limit caller never spends LLM credit.
  // SEPARATE bucket per endpoint ('guide:' prefix — distinct from 'ask:' and 'search-ask:'). Fails
  // open if Supabase is unconfigured or the RPC errors (mirrors /api/ask exactly).
  const { max, windowSeconds } = rateLimitConfig();
  const { allowed, retryAfter } = await checkRateLimit({
    key: `guide:${clientIpFrom(request)}`,
    limit: max,
    windowSeconds,
  });
  if (!allowed) {
    return json({ error: 'rate-limited', retryAfter }, 429, { 'Retry-After': String(retryAfter) });
  }

  const corpus = await getAskCorpus();
  const result = await runGuideBeat({ beat: payload.beat, text: textCheck.text, corpus, priorState });
  return json(result);
};

// Method guard: only POST is accepted.
export const ALL: APIRoute = () => json({ error: 'method-not-allowed' }, 405);
