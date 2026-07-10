// Newsletter capture endpoint (CHK-4.2). Server-rendered route (prerender=false) — every other
// page in the app stays static; only this handler runs as a serverless function.
//
// HONEST BY DESIGN: this stores an email so we can NOTIFY the person WHEN the dispatch launches.
// The dispatch does not publish yet (see /privacy). We never imply they'll receive a newsletter
// now. No subscriber counts, no cadence promises — the copy lives in NewsletterForm.astro.
//
// Privacy + safety: the service-role key is read server-side only (src/lib/supabase.ts), never
// sent to the client, never logged. DB errors are never leaked to the caller.
import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';
import { parseBody, isHoneypotTripped, isValidEmail, json } from '../../lib/form-intake';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await parseBody(request);

  // Honeypot: a filled hidden `website` field means a bot. Return success WITHOUT storing —
  // give it no signal, keep real submissions clean.
  if (isHoneypotTripped(body)) {
    return json({ ok: true, message: "thanks — we'll email you when the dispatch launches." });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!isValidEmail(email)) {
    return json({ ok: false, error: 'that email address doesn’t look right — check it and try again.' }, 400);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Graceful degradation: no keys configured. Honest, not a hard error.
    return json({ ok: false, error: 'signups aren’t open yet — check back soon.' }, 503);
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, source: 'dispatch', created_at: new Date().toISOString() });

  if (error) {
    // Unique-violation (already subscribed) is a success from the reader's point of view.
    // Postgres unique_violation is SQLSTATE 23505; supabase-js surfaces it as error.code.
    if (error.code === '23505') {
      return json({ ok: true, message: 'you’re already on the list — we’ll be in touch when it launches.' });
    }
    // Any other DB error: don't leak details to the client. (Server logs would capture it, but
    // we avoid logging the email or the raw error to keep PII out of logs.)
    return json({ ok: false, error: 'something went wrong saving that — please try again in a moment.' }, 500);
  }

  return json({ ok: true, message: "thanks — we'll email you once, when the dispatch launches. no spam." });
};
