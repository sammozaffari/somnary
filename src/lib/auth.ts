// Auth clients for accounts (CHK-6.9a) — sign-in, callback, and cookie-based session read.
//
// KEY DISTINCTION FROM src/lib/supabase.ts:
//   supabase.ts reads the SERVICE-ROLE key — it bypasses RLS and must NEVER reach the client.
//   THIS FILE reads the ANON / PUBLISHABLE key (PUBLIC_SUPABASE_ANON_KEY), which is browser-safe
//   and PUBLIC BY DESIGN. It carries no privilege of its own: Row-Level Security enforces what a
//   signed-in user may read/write. That is why it is safe to ship the anon key in the client
//   bundle (createBrowserClient) and to use it for session flows.
//
//   These two responsibilities must stay separate. auth.ts NEVER reads SUPABASE_SERVICE_ROLE_KEY,
//   and never calls getSupabaseAdmin() — service-role must never touch a session/auth flow.
//   (Enforced by test: scripts/test-auth-plumbing.mjs asserts this file has no service-role ref.)
//
// GRACEFUL DEGRADATION: if PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY is missing (local, CI,
// or a preview deploy before the owner adds keys), both factories return null. Callers must handle
// null — the sign-in UI hides itself, and the auth routes redirect home without throwing.
import type { AstroCookies } from 'astro';
import {
  createBrowserClient,
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// import.meta.env is populated at build; process.env is the runtime fallback on Vercel's
// serverless functions. Read both so the clients work in dev, build, and production — the same
// dual reader as supabase.ts. PUBLIC_ vars are also inlined into the client bundle by Vite.
function readEnv(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)?.[name];
  if (fromMeta) return fromMeta;
  if (typeof process !== 'undefined' && process.env) return process.env[name];
  return undefined;
}

// Reads the PUBLIC (anon/publishable) config. Never reads the service-role key — see file header.
function readAuthConfig(): { url: string; anonKey: string } | null {
  const url = readEnv('PUBLIC_SUPABASE_URL');
  const anonKey = readEnv('PUBLIC_SUPABASE_ANON_KEY');
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

let cachedBrowser: SupabaseClient | null | undefined;

/**
 * Browser-side Supabase client for user-initiated sign-in flows: signInWithOAuth (Google),
 * signInWithOtp (email magic-link), and signOut. Uses the anon key (browser-safe). Returns null
 * when auth is unconfigured — callers must hide the sign-in UI in that case.
 *
 * Cached: createBrowserClient is a singleton per document, so repeated calls reuse one instance.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (cachedBrowser !== undefined) return cachedBrowser;
  const config = readAuthConfig();
  if (!config) {
    cachedBrowser = null;
    return null;
  }
  cachedBrowser = createBrowserClient(config.url, config.anonKey);
  return cachedBrowser;
}

/**
 * Server-side Supabase client bound to the request's cookies, for server routes to read the
 * session (auth.getUser()) and to run cookie-mutating flows (exchangeCodeForSession, signOut).
 * Uses the anon key + RLS — never the service-role key. Returns null when auth is unconfigured;
 * callers must redirect/degrade gracefully.
 *
 * NOT cached: each request has its own cookie jar, so a fresh client is created per call.
 */
export function getServerSupabase(cookies: AstroCookies): SupabaseClient | null {
  const config = readAuthConfig();
  if (!config) return null;

  return createServerClient(config.url, config.anonKey, {
    // Astro cookie adapter — bridges @supabase/ssr's cookie contract to Astro's AstroCookies.
    // getAll/setAll is the current @supabase/ssr interface (get/set/remove is deprecated).
    cookies: {
      getAll() {
        return cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, options);
        }
      },
    },
  });
}
