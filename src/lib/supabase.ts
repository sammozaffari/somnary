// Server-only Supabase client factory (CHK-4.2).
//
// This module is imported ONLY by server API routes (src/pages/api/*.ts, prerender=false).
// It reads the SERVICE-ROLE key, which bypasses row-level security — it must NEVER reach the
// client bundle, never be logged, and never be echoed in a response. The service-role design
// is deliberate: the tables have RLS on with NO public policies (see supabase/schema.sql), so
// only our server can insert. The anon key is not needed and is intentionally not used here.
//
// Graceful degradation: if either env var is missing (e.g. a preview deploy without secrets,
// or a fresh clone), getSupabaseAdmin() returns null and the caller returns a friendly 503 —
// the site still builds and deploys with no keys configured.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// import.meta.env is populated at build; process.env is the runtime fallback on Vercel's
// serverless functions. Read both so the route works in dev, build, and production.
function readEnv(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)?.[name];
  if (fromMeta) return fromMeta;
  if (typeof process !== 'undefined' && process.env) return process.env[name];
  return undefined;
}

let cached: SupabaseClient | null | undefined;

/**
 * Returns a service-role Supabase client, or null when the server is not configured with
 * SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Callers MUST handle the null case (return 503).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = readEnv('SUPABASE_URL');
  const serviceRoleKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !serviceRoleKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, serviceRoleKey, {
    // No session persistence: this is a stateless server insert, not an auth session.
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
