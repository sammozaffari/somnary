// Somnary Lens server route (CHK-7.1c) — the thin HTTP shell over the headless Lens engine, and the
// most expensive endpoint on the site (bounded external research + adversarial verification). Mirrors
// /api/guide + /api/ask EXACTLY: prerender=false so it runs as a serverless function and the model +
// NCBI keys stay server-side (process.env), never in a client bundle. Everything else stays static.
//
// POST { input } → the engine's LensAssessment JSON (a draft assessment, NEVER a Somnary grade). The
// model has NO channel to emit a grade/dose/diagnosis/uncited claim — the server composes the card.
//
// Request contract:
//   - non-POST → 405.
//   - invalid JSON → 400.
//   - empty input → 400; input over MAX_LENS_INPUT → 413.
//   - unconfigured (no OPENROUTER_API_KEY) → 503 (research can never verify a claim without a model).
//   - over the LENS rate-limit bucket → 429 + Retry-After.
//   - else → 200 the LensAssessment (Cache-Control: no-store).
//
// The rate limit uses its OWN tighter bucket ('lens:' prefix, LENS_RATE_LIMIT_MAX, default lower than
// ask's 20) and is checked BEFORE any model/network work so an over-limit caller never spends credit.
import type { APIRoute } from 'astro';
import { getAskCorpus } from '../../lib/ask/from-collection.ts';
import { getLabelEntries } from '../../lib/label-data.ts';
import { getAdditiveWatchlist } from '../../lib/lens/additive-watchlist-loader.ts';
import { runLens } from '../../lib/lens/engine.ts';
import { logLensDemand } from '../../lib/lens/demand-log.ts';
import { PubMedProvider } from '../../lib/lens/retrieval.ts';
import { validateLensInput, lensRateLimitMax, lensConfigured, MAX_LENS_INPUT } from '../../lib/lens/route-input.ts';
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
  let payload: { input?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid-json' }, 400);
  }

  // Trim + cap the one free-text input BEFORE any work: empty → 400, too-long → 413.
  const check = validateLensInput(payload.input);
  if (!check.ok) {
    if (check.error === 'input-too-long') return json({ error: 'input-too-long', max: MAX_LENS_INPUT }, 413);
    return json({ error: 'empty-input' }, 400);
  }

  // Unconfigured deploy (no model key): research can never verify a claim, so degrade gracefully to a
  // 503 rather than run a pipeline that always returns inconclusive. No key ⇒ no spend.
  if (!lensConfigured()) return json({ error: 'lens-unavailable' }, 503);

  // Per-IP rate limit on the Lens's OWN tighter bucket ('lens:' prefix), BEFORE the model/network.
  // Reuses the shared window; the max is the Lens-specific LENS_RATE_LIMIT_MAX. Fails open if Supabase
  // is unconfigured or the RPC errors (mirrors /api/ask + /api/guide).
  const { windowSeconds } = rateLimitConfig();
  const { allowed, retryAfter } = await checkRateLimit({
    key: `lens:${clientIpFrom(request)}`,
    limit: lensRateLimitMax(),
    windowSeconds,
  });
  if (!allowed) {
    return json({ error: 'rate-limited', retryAfter }, 429, { 'Retry-After': String(retryAfter) });
  }

  const [corpus, labelEntries, additiveWatchlist] = await Promise.all([
    getAskCorpus(),
    getLabelEntries(),
    getAdditiveWatchlist(),
  ]);

  // NCBI polite-use email is optional; the provider is keyless. The engine's default model client
  // reads OPENROUTER_API_KEY from process.env server-side.
  const email = (typeof process !== 'undefined' ? process.env?.NCBI_EUTILS_EMAIL : undefined) || undefined;
  const provider = new PubMedProvider({ email });

  const assessment = await runLens({
    input: check.input,
    corpus,
    labelEntries,
    additiveWatchlist,
    provider,
    providerName: 'pubmed',
  });

  // Fire-and-await the ONE aggregate demand log (CHK-7.3b) — feeds the human grading backlog with which
  // NAMED products/ingredients get researched. It logs a normalized NAME + a count and NOTHING else
  // (never the free-text question, never refused/short-circuit runs, never raw text/IP). It is env-gated
  // and fail-open by construction; the extra try/catch here guarantees a logging fault can never change
  // the Lens response or its status. The engine is untouched.
  try {
    await logLensDemand(assessment);
  } catch {
    /* fail-open: backlog signal is best-effort and must never affect the answer */
  }

  return json(assessment);
};

// Method guard: only POST is accepted.
export const ALL: APIRoute = () => json({ error: 'method-not-allowed' }, 405);
