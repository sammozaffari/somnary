/**
 * Retail click logging (CHK-B4; REDESIGN Step 9 / A3). Records, in aggregate, WHICH product and
 * retailer readers click through to — the signal for "what people actually want to buy, and
 * therefore which products to research next" (A3). It can never set, influence, or gate a grade or
 * a score, and it never orders results.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PRIVACY (hard rule — Step 9: "no personal data"). We log ONLY:
 *     { product_id, retailer }   (+ a server-side clicked_at default in the DB)
 * We DO NOT read or store: IP address, User-Agent, Referer, cookies, any header, any account/user
 * id, or any query beyond the retailer name. The request object is never inspected for identity —
 * the caller passes only the two non-personal values. `go_clicks` (supabase/migrations/0004) has
 * RLS on with no public policy, so only the service-role server can insert.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 *
 * FAIL-OPEN: env-gated (no Supabase → null client → no-op) and wrapped so it NEVER throws and NEVER
 * delays or alters the redirect. A logging failure must never stop a reader reaching the retailer.
 */
import { getSupabaseAdmin } from '../supabase.ts';

/** Minimal injectable write surface — lets the offline test pass a mock/throwing client with no
 * network or real Supabase. `null` = not configured → skip silently. */
export interface ClickLogClient {
  from(table: string): { insert(row: Record<string, unknown>): Promise<{ error: unknown }> };
}

/**
 * Log one retail click. product_id + retailer ONLY — never any personal data (see header).
 * Fail-open: swallows every error and returns void so the /go redirect always proceeds.
 */
export async function logGoClick(
  productId: string,
  retailer: string,
  client: ClickLogClient | null = getSupabaseAdmin() as unknown as ClickLogClient | null,
): Promise<void> {
  try {
    if (!client) return; // unconfigured deploy → silent no-op
    if (!productId || !retailer) return;
    // ONLY these two fields cross the wire. No request/headers/IP/user are referenced anywhere.
    await client.from('go_clicks').insert({ product_id: productId, retailer });
  } catch {
    // never throw — a broken log must not block the outbound redirect
  }
}
