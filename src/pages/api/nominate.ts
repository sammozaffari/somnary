// Review-nomination endpoint (CHK-7.3a). Server-rendered route (prerender=false). Mirrors
// /api/submit-claim EXACTLY (parseBody → honeypot → validate → getSupabaseAdmin null→503 → insert).
//
// Purpose: a reader nominates a supplement or ingredient for a FULL HUMAN REVIEW. The nomination goes
// onto Somnary's grading backlog — the running list a human draws from when deciding what to grade
// next. It is NOT a support channel and NOT a grade: the success copy says plainly we can't reply to
// everyone. Email is OPTIONAL, only used if they want a reply.
//
// FIREWALL: review_nominations lives in the separate backlog store (supabase/migrations/0003) with NO
// FK into any corpus/grade table; nothing here reads or writes a grade. This route never touches
// grading — it only appends a nomination for a human to triage.
//
// Privacy + safety: service-role key server-only (src/lib/supabase.ts), never logged. We ask people
// NOT to include personal health details (form copy) and never store more than they send.
import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';
import { parseBody, isHoneypotTripped, isValidEmail, json } from '../../lib/form-intake';

export const prerender = false;

const MIN_SUBJECT_LEN = 2;
const MAX_SUBJECT_LEN = 200;
const MAX_NOTE_LEN = 2000;

// One honest success line, reused for the real insert and the accept-but-discard honeypot path so a
// bot gets the same response as a human and no signal that it was caught.
const SUCCESS =
  'thanks — nominations feed Somnary’s grading backlog and help decide what a human reviews next; we can’t reply to everyone.';

export const POST: APIRoute = async ({ request }) => {
  const body = await parseBody(request);

  // Honeypot: filled hidden field → bot. Accept without storing.
  if (isHoneypotTripped(body)) {
    return json({ ok: true, message: SUCCESS });
  }

  const subject = (body.subject ?? '').trim();
  if (subject.length < MIN_SUBJECT_LEN) {
    return json({ ok: false, error: 'please name the product or ingredient you’d like reviewed.' }, 400);
  }
  if (subject.length > MAX_SUBJECT_LEN) {
    return json({ ok: false, error: `that’s longer than we can take (max ${MAX_SUBJECT_LEN} characters) — please shorten it.` }, 400);
  }

  const note = (body.note ?? '').trim().slice(0, MAX_NOTE_LEN) || null;

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
    return json({ ok: false, error: 'nominations aren’t open yet — check back soon.' }, 503);
  }

  const { error } = await supabase.from('review_nominations').insert({
    subject,
    note,
    email,
    source: 'request-a-review',
    status: 'new',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return json({ ok: false, error: 'something went wrong sending that — please try again in a moment.' }, 500);
  }

  return json({ ok: true, message: SUCCESS });
};

// Method guard: only POST is accepted.
export const ALL: APIRoute = () => json({ ok: false, error: 'method-not-allowed' }, 405);
