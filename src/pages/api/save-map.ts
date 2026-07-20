// Save-map server route (CHK-6.9b) — persists ONE anonymous /guide concierge result for a SIGNED-IN
// user. Same thin-shell shape as /api/guide + /api/ask (prerender=false so it runs as a serverless
// function; json() helper; graceful 503 when Supabase is unconfigured). All the trust-boundary logic
// lives in the injectable pure handler (src/lib/accounts/handlers.ts + save-input.ts) so the offline
// suite drives the exact same code with a mock client.
//
// THE FIREWALL: this stores only the STRUCTURED output of the concierge — the validated GuideState
// (fixed-enum answers), the deterministic reading map (real corpus URLs), and the habits-checklist
// tick-state. NEVER a transcript, NEVER prose, NEVER an experience/community report (those are the
// SEPARATE pseudonymous store, CHK-6.4). handleSave() runs the untrusted body through the guide
// schema coercer (prose stripped) and re-derives the route_plan internal-only before anything is stored.
//
// NO LOGIN WALL (the accounts invariant): no session → 401 JSON, NEVER a redirect to a sign-in page.
//
// PER-USER RLS, NOT SERVICE-ROLE: the write goes through getServerSupabase (the ANON key bound to the
// caller's session cookie). saved_maps RLS scopes every row to auth.uid(), so the database itself
// guarantees a user can only write their own rows. The service-role admin client is NEVER used here.
import type { APIRoute } from 'astro';
import { getServerSupabase } from '../../lib/auth.ts';
import { MAX_BODY_BYTES } from '../../lib/accounts/save-input.ts';
import { handleSave, type AccountsClient } from '../../lib/accounts/handlers.ts';

export const prerender = false;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  // Unconfigured (no PUBLIC_SUPABASE_* keys) → 503, never a throw. Build + CI stay green with no keys.
  const supabase = getServerSupabase(request, cookies);
  if (!supabase) return json({ error: 'accounts-unavailable' }, 503);

  const rawText = await request.text();
  const result = await handleSave(supabase as unknown as AccountsClient, rawText, MAX_BODY_BYTES);
  return json(result.body, result.status);
};

// Method guard: only POST is accepted.
export const ALL: APIRoute = () => json({ error: 'method-not-allowed' }, 405);
