// Claim / label submission endpoint (CHK-4.2). Server-rendered route (prerender=false).
//
// Purpose: readers send a sleep claim or a product label that seems off; we use the queue to
// PRIORITIZE what we research. It is not a support channel — the response copy says plainly we
// can't reply to everyone. Email is OPTIONAL and only used if they want a reply.
//
// Privacy + safety: service-role key server-only (src/lib/supabase.ts), never logged. We ask
// people NOT to include personal health details (form copy) and never store more than they send.
import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';
import { parseBody, isHoneypotTripped, isValidEmail, json } from '../../lib/form-intake';

export const prerender = false;

const MIN_LEN = 20;
const MAX_LEN = 5000;
const MAX_PRODUCT_LEN = 200;

export const POST: APIRoute = async ({ request }) => {
  const body = await parseBody(request);

  // Honeypot: filled hidden field → bot. Accept without storing.
  if (isHoneypotTripped(body)) {
    return json({ ok: true, message: 'thanks — we review submissions to prioritize what we research; we can’t reply to everyone.' });
  }

  const submission = (body.submission ?? '').trim();
  if (submission.length < MIN_LEN) {
    return json({ ok: false, error: `please add a bit more detail (at least ${MIN_LEN} characters) so we can act on it.` }, 400);
  }
  if (submission.length > MAX_LEN) {
    return json({ ok: false, error: `that’s longer than we can take (max ${MAX_LEN} characters) — please trim it.` }, 400);
  }

  const product = (body.product ?? '').trim().slice(0, MAX_PRODUCT_LEN) || null;

  // Email is optional. If provided, it must be valid; if blank, we store null (no reply expected).
  const rawEmail = (body.email ?? '').trim().toLowerCase();
  let email: string | null = null;
  if (rawEmail.length > 0) {
    if (!isValidEmail(rawEmail)) {
      return json({ ok: false, error: 'that email address doesn’t look right — fix it, or leave it blank.' }, 400);
    }
    email = rawEmail;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return json({ ok: false, error: 'submissions aren’t open yet — check back soon.' }, 503);
  }

  const { error } = await supabase.from('claim_submissions').insert({
    submission_text: submission,
    product_name: product,
    email,
    status: 'new',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return json({ ok: false, error: 'something went wrong sending that — please try again in a moment.' }, 500);
  }

  return json({
    ok: true,
    message: 'thanks — we review submissions to prioritize what we research; we can’t reply to everyone.',
  });
};
