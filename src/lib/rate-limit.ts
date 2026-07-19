// Server-only per-IP rate limiter for the model-calling API routes (rate-limit hardening).
//
// /api/ask and /api/search-ask are unauthenticated and each call spends LLM credit. This module
// enforces a fixed per-IP window backed by the Supabase `rate_limits` table and the atomic
// `check_rate_limit()` RPC (see supabase/rate-limit.sql). It reuses the SAME service-role client as
// the capture forms (getSupabaseAdmin, src/lib/supabase.ts) — no second client is created.
//
// FAIL-OPEN by design (mirrors the codebase's graceful-degradation philosophy): if Supabase is not
// configured (no keys — local dev / a preview without secrets) or the RPC errors for any reason, the
// request is ALLOWED. Rate limiting must never take the assistant down; it only ever *blocks* when
// the database explicitly says the caller is over the limit.
//
// Limits come from two OPTIONAL env vars (defaults apply if unset):
//   RATE_LIMIT_MAX             — max requests per window, per IP, per endpoint. Default 20.
//   RATE_LIMIT_WINDOW_SECONDS  — window length in seconds.                     Default 60.
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from './supabase.ts';

// import.meta.env is populated at build; process.env is the runtime fallback on Vercel's serverless
// functions. Read both — same dual pattern as src/lib/supabase.ts.
function readEnv(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)?.[name];
  if (fromMeta) return fromMeta;
  if (typeof process !== 'undefined' && process.env) return process.env[name];
  return undefined;
}

function readIntEnv(name: string, fallback: number): number {
  const raw = readEnv(name);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const DEFAULT_RATE_LIMIT_MAX = 20;
export const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 60;

/** Env-backed limits with sane defaults. Read at call time so tests/deploys can override. */
export function rateLimitConfig(): { max: number; windowSeconds: number } {
  return {
    max: readIntEnv('RATE_LIMIT_MAX', DEFAULT_RATE_LIMIT_MAX),
    windowSeconds: readIntEnv('RATE_LIMIT_WINDOW_SECONDS', DEFAULT_RATE_LIMIT_WINDOW_SECONDS),
  };
}

let warnedOnce = false;
function warnOnce(msg: string): void {
  if (warnedOnce) return;
  warnedOnce = true;
  console.warn(`[rate-limit] ${msg} — failing open (requests allowed).`);
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // whole seconds until the caller may retry; 0 when allowed.
}

/**
 * Consume one hit against the fixed-window bucket for `key`. Returns { allowed, retryAfter }.
 *
 * FAIL-OPEN: returns { allowed: true, retryAfter: 0 } when Supabase is unconfigured (client null) or
 * the RPC errors. Only returns allowed:false when the RPC explicitly reports the caller is over the
 * limit. `client` is injectable so tests can drive it without a real database.
 */
export async function checkRateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
  client?: SupabaseClient | null;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = opts;
  const client = opts.client !== undefined ? opts.client : getSupabaseAdmin();

  // Not configured → fail open. This is the normal local-dev / no-secrets path, not an error.
  if (!client) {
    warnOnce('Supabase not configured');
    return { allowed: true, retryAfter: 0 };
  }

  try {
    const { data, error } = await client.rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      warnOnce(`RPC error: ${error.message ?? 'unknown'}`);
      return { allowed: true, retryAfter: 0 };
    }

    // The RPC returns a single-row table: [{ allowed, retry_after }].
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row.allowed !== 'boolean') {
      warnOnce('RPC returned no usable row');
      return { allowed: true, retryAfter: 0 };
    }

    const retryAfter = Number.isFinite(row.retry_after) ? Math.max(0, Math.trunc(row.retry_after)) : 0;
    return { allowed: row.allowed, retryAfter };
  } catch (err) {
    warnOnce(`RPC threw: ${err instanceof Error ? err.message : String(err)}`);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * Best-effort client IP for keying the limiter. Vercel sets x-forwarded-for (comma-separated hop
 * list; the first entry is the original client) and x-real-ip. Falls back to 'unknown' so a missing
 * header still produces a stable (shared) bucket rather than crashing.
 */
export function clientIpFrom(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get('x-real-ip');
  if (real) {
    const trimmed = real.trim();
    if (trimmed) return trimmed;
  }
  return 'unknown';
}
