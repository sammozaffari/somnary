/**
 * Accounts route handlers (CHK-6.9b) — the PURE, injectable core of /api/save-map and
 * /api/saved-maps. The route files are thin shells: they call getServerSupabase() (the ANON key
 * bound to the request's session cookie) and, if configured, delegate to these functions. Factoring
 * the logic here lets the offline suite (scripts/test-accounts.mjs) drive the exact same code with a
 * MOCK supabase client — no live server, no real database, no network — the same injection idea the
 * ask engine and rate limiter use for their clients.
 *
 * INVARIANTS enforced here (see each function):
 *   • no session → 401 { error:'not-authenticated' } — NEVER a redirect (the no-login-wall invariant).
 *   • unconfigured (null client) is handled by the ROUTE (503) before delegating here.
 *   • every read/write/delete runs through the passed client (the user-scoped ANON client, RLS as the
 *     user) — NEVER the service-role admin client. The client is the ONLY DB surface these touch.
 *   • the untrusted save body is stripped through validateSaveBody (prose/transcript dropped, route
 *     plan re-derived internal-only, checklist flattened) BEFORE any insert.
 *
 * Erasable TS so the CI runner imports it directly. The client is typed structurally (only the
 * methods used) so the mock needs no Supabase SDK.
 */
import { validateSaveBody, deriveMapTitle } from './save-input.ts';

// --- structural client shapes (only what we call; the mock implements these) --------------------

interface AuthUser {
  id: string;
}
interface GetUserResult {
  data: { user: AuthUser | null } | null;
  error: unknown;
}
interface QueryResult<T> {
  data: T | null;
  error: unknown;
}

/** The subset of the Supabase client surface these handlers use. The real SupabaseClient satisfies
 * this; the offline mock implements exactly these chains. */
export interface AccountsClient {
  auth: { getUser(): Promise<GetUserResult> };
  from(table: string): {
    // save-map: upsert profile
    upsert(
      values: Record<string, unknown>,
      opts?: { onConflict?: string; ignoreDuplicates?: boolean },
    ): Promise<QueryResult<unknown>>;
    // save-map: insert saved_map → select id → single
    insert(values: Record<string, unknown>): {
      select(cols: string): { single(): Promise<QueryResult<{ id: string }>> };
    };
    // saved-maps GET: select → eq → order
    select(cols: string): {
      eq(
        col: string,
        val: string,
      ): {
        order(col: string, opts: { ascending: boolean }): Promise<QueryResult<Array<{ id: string; route_plan: unknown; created_at: string }>>>;
      };
    };
    // saved-maps DELETE: delete → eq → eq → select
    delete(): {
      eq(col: string, val: string): { eq(col: string, val: string): { select(cols: string): Promise<QueryResult<Array<{ id: string }>>> } };
    };
  };
}

export interface HandlerResult {
  status: number;
  body: unknown;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireUser(client: AccountsClient): Promise<{ id: string } | HandlerResult> {
  const { data, error } = await client.auth.getUser();
  // No session → 401 JSON. NEVER a redirect (the no-login-wall invariant).
  if (error || !data?.user) return { status: 401, body: { error: 'not-authenticated' } };
  return { id: data.user.id };
}

function isHandlerResult(v: { id: string } | HandlerResult): v is HandlerResult {
  return 'status' in v;
}

// --- save ---------------------------------------------------------------------------------------

/**
 * Save one concierge result. `rawText` is the already-read request body (so the route can size-cap
 * before parsing). Order: size-cap → parse → require user (401) → strip body (prose/transcript
 * dropped, external href rejected) → upsert profile → insert under RLS as the user → return id.
 */
export async function handleSave(
  client: AccountsClient,
  rawText: string,
  maxBytes: number,
): Promise<HandlerResult> {
  if (rawText.length > maxBytes) return { status: 413, body: { error: 'payload-too-large', max: maxBytes } };

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { status: 400, body: { error: 'invalid-json' } };
  }

  const user = await requireUser(client);
  if (isHandlerResult(user)) return user;

  const check = validateSaveBody(parsed, rawText.length);
  if (!check.ok) {
    if (check.error === 'payload-too-large') return { status: 413, body: { error: 'payload-too-large', max: maxBytes } };
    if (check.error === 'external-href') return { status: 400, body: { error: 'external-href' } };
    return { status: 400, body: { error: 'invalid-route-plan' } };
  }
  const { guide_state, route_plan, habits_checklist } = check.payload;

  // Ensure a profiles row exists (belt-and-suspenders alongside the on_auth_user_created trigger).
  // RLS "own profile" allows only auth.uid() = id, so this can only create the caller's own profile.
  const profile = await client.from('profiles').upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });
  if (profile.error) return { status: 500, body: { error: 'save-failed' } };

  // Insert under RLS as the user; WITH CHECK (auth.uid() = user_id) blocks writing another's row.
  const insert = await client
    .from('saved_maps')
    .insert({ user_id: user.id, guide_state, route_plan, habits_checklist })
    .select('id')
    .single();
  if (insert.error || !insert.data) return { status: 500, body: { error: 'save-failed' } };

  return { status: 201, body: { id: insert.data.id } };
}

// --- list ---------------------------------------------------------------------------------------

/** List the caller's own saved maps (minimal fields). RLS scopes rows to auth.uid(); the explicit
 * .eq('user_id', …) is belt-and-suspenders. */
export async function handleList(client: AccountsClient): Promise<HandlerResult> {
  const user = await requireUser(client);
  if (isHandlerResult(user)) return user;

  const { data, error } = await client
    .from('saved_maps')
    .select('id, route_plan, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return { status: 500, body: { error: 'list-failed' } };

  const maps = (data ?? []).map((row) => ({ id: row.id, title: deriveMapTitle(row.route_plan), createdAt: row.created_at }));
  return { status: 200, body: { maps } };
}

// --- delete -------------------------------------------------------------------------------------

/** Delete ONE of the caller's own saved maps by id. RLS + the explicit user_id predicate both scope
 * the delete to the caller. No matching row → 404 (never leaks another user's row existence). */
export async function handleDelete(client: AccountsClient, id: string): Promise<HandlerResult> {
  const user = await requireUser(client);
  if (isHandlerResult(user)) return user;

  if (!UUID_RE.test(id)) return { status: 400, body: { error: 'invalid-id' } };

  const { data, error } = await client
    .from('saved_maps')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id');
  if (error) return { status: 500, body: { error: 'delete-failed' } };
  if (!data || data.length === 0) return { status: 404, body: { error: 'not-found' } };
  return { status: 200, body: { deleted: data.length } };
}
