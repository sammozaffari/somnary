// Saved-maps list + delete route (CHK-6.9b) — reads and removes a SIGNED-IN user's OWN saved concierge
// results. Sibling of /api/save-map. prerender=false (serverless); json() helper; graceful 503 when
// Supabase is unconfigured. The logic is the injectable pure handler (src/lib/accounts/handlers.ts) so
// the offline suite drives the same code with a mock client.
//
// PER-USER RLS, NOT SERVICE-ROLE: every query goes through getServerSupabase (the ANON key bound to
// the caller's session). saved_maps RLS scopes rows to auth.uid(), so the list can only ever return
// the caller's own rows and the delete can only ever remove the caller's own row. The service-role
// admin client is NEVER used.
//
// NO LOGIN WALL: no session → 401 JSON, NEVER a redirect to sign-in.
import type { APIRoute } from 'astro';
import { getServerSupabase } from '../../lib/auth.ts';
import { handleList, handleDelete, type AccountsClient } from '../../lib/accounts/handlers.ts';

export const prerender = false;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

// GET — list the caller's own saved maps. Minimal fields only (id, derived title, createdAt).
export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = getServerSupabase(request, cookies);
  if (!supabase) return json({ error: 'accounts-unavailable' }, 503);
  const result = await handleList(supabase as unknown as AccountsClient);
  return json(result.body, result.status);
};

// DELETE — remove ONE of the caller's own saved maps by id (from query `?id=` or JSON body `{id}`).
export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  const supabase = getServerSupabase(request, cookies);
  if (!supabase) return json({ error: 'accounts-unavailable' }, 503);

  // id may arrive as a query param or in the JSON body. Query wins if present.
  let id = url.searchParams.get('id') ?? '';
  if (!id) {
    try {
      const body = (await request.json()) as { id?: unknown };
      if (typeof body?.id === 'string') id = body.id;
    } catch {
      /* no/invalid body — handler validates the (empty) id and returns 400 */
    }
  }
  const result = await handleDelete(supabase as unknown as AccountsClient, id);
  return json(result.body, result.status);
};

// Method guard: anything else → 405.
export const ALL: APIRoute = () => json({ error: 'method-not-allowed' }, 405);
