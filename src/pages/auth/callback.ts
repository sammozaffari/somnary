// OAuth / magic-link callback (CHK-6.9a). Server-rendered route (prerender=false) — emits as a
// Vercel function so it can read the `code` query param, exchange it for a session, and set the
// session cookies on the response before redirecting.
//
// FLOW: Supabase (Google OAuth or the magic-link email) redirects the browser here with a `?code=`.
// We exchange that code for a session via the SERVER client (anon key + cookie adapter from
// src/lib/auth.ts), which writes the auth cookies. Then we redirect the user onward.
//
// OPEN-REDIRECT SAFETY: the onward target comes from an optional `?next=` param, but we ONLY honor
// it when it is a same-origin internal path — it must start with a single "/" and NOT "//" (which
// browsers treat as a protocol-relative URL to another host). Anything else falls back to /account.
//
// NEVER LEAK ERRORS: no code, an exchange error, or an unconfigured environment all redirect home
// ("/") quietly. We never throw and never surface an error string to the user.
import type { APIRoute } from 'astro';
import { getServerSupabase } from '../../lib/auth';

export const prerender = false;

const DEFAULT_NEXT = '/account';

// Only same-origin internal paths are allowed as a redirect target. "/" ok, "//evil.com" not,
// "https://evil.com" not, "/account" ok. Falls back to DEFAULT_NEXT for anything unsafe.
function safeNext(next: string | null): string {
  if (!next) return DEFAULT_NEXT;
  // Must be a rooted path but not protocol-relative ("//host") and not a backslash trick ("/\host").
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return DEFAULT_NEXT;
  return next;
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));

  // No code (direct hit, or provider error like ?error=access_denied): go home quietly.
  if (!code) return redirect('/', 302);

  const supabase = getServerSupabase(cookies);
  // Unconfigured (no anon key): degrade gracefully, no throw.
  if (!supabase) return redirect('/', 302);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  // Exchange failed (expired/invalid code, replayed link): don't leak, just go home.
  if (error) return redirect('/', 302);

  // Session cookies are now set on the response by the cookie adapter. Redirect onward.
  return redirect(next, 302);
};
