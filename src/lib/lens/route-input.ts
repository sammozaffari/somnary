/**
 * Lens route input validation (CHK-7.1c) — the trust boundary between the untrusted HTTP client and
 * the engine. `src/pages/api/lens.ts` is a thin shell; the "never trust the client" input logic lives
 * here as pure, testable helpers (mirrors src/lib/guide/route-input.ts) so the offline suite can drive
 * them without a live server.
 *
 * The engine (normalizeLensInput) already coerces its input safely, but the route enforces a length
 * cap BEFORE any model/network work so a hostile oversized body is rejected with 413 rather than
 * spending a research budget on it. Erasable TS.
 */

/** Max accepted Lens input length. A pasted supplement-facts panel is long, so this is generous — but
 * anything past it is abuse/padding and rejected (413) before research runs. Matches the engine's
 * internal MAX_LENS_INPUT_LEN so the two agree on the ceiling. */
export const MAX_LENS_INPUT = 4000;
/** Below this the input carries no researchable signal (empty → 400). */
export const MIN_LENS_INPUT = 1;

export type LensInputCheck =
  | { ok: true; input: string }
  | { ok: false; error: 'empty-input' | 'input-too-long' };

/** Trim + validate the one free-text Lens input. Returns the capped string or a typed error the route
 * maps to a status code (empty → 400, too-long → 413). */
export function validateLensInput(raw: unknown): LensInputCheck {
  const input = typeof raw === 'string' ? raw.trim() : '';
  if (input.length < MIN_LENS_INPUT) return { ok: false, error: 'empty-input' };
  if (input.length > MAX_LENS_INPUT) return { ok: false, error: 'input-too-long' };
  return { ok: true, input };
}

/** The Lens rate-limit bucket max. Its OWN env var (LENS_RATE_LIMIT_MAX), defaulting LOWER than ask's
 * 20 — the Lens is the most expensive endpoint (research + N verify calls per request). */
export const DEFAULT_LENS_RATE_LIMIT_MAX = 6;

function readEnv(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)?.[name];
  if (fromMeta) return fromMeta;
  if (typeof process !== 'undefined' && process.env) return process.env[name];
  return undefined;
}

/** The Lens limiter's per-window max, from LENS_RATE_LIMIT_MAX (default DEFAULT_LENS_RATE_LIMIT_MAX).
 * The window length reuses RATE_LIMIT_WINDOW_SECONDS via rateLimitConfig() in the route. */
export function lensRateLimitMax(): number {
  const raw = readEnv('LENS_RATE_LIMIT_MAX');
  if (!raw) return DEFAULT_LENS_RATE_LIMIT_MAX;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_LENS_RATE_LIMIT_MAX;
}

/** True iff an OpenRouter key is configured — the Lens needs a model, so an unkeyed deploy returns a
 * graceful 503 instead of running research that can never verify a claim. */
export function lensConfigured(): boolean {
  return !!readEnv('OPENROUTER_API_KEY');
}
