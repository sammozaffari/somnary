// Sign out (CHK-6.9a). Server-rendered route (prerender=false) — emits as a Vercel function so it
// can clear the session cookies on the response.
//
// FLOW: call auth.signOut() via the SERVER client (anon key + cookie adapter from src/lib/auth.ts),
// which revokes the session and clears the auth cookies, then redirect home ("/").
//
// GRACEFUL DEGRADATION: if auth is unconfigured, there is no session to end — redirect home without
// throwing. Never leak errors: a signOut error still redirects home (the cookies are best-effort
// cleared regardless).
import type { APIRoute } from 'astro';
import { getServerSupabase } from '../../lib/auth';

export const prerender = false;

const signOutAndHome: APIRoute = async ({ cookies, redirect }) => {
  const supabase = getServerSupabase(cookies);
  if (supabase) {
    // Best-effort: clears the auth cookies via the adapter. We ignore any error and redirect home.
    await supabase.auth.signOut();
  }
  return redirect('/', 302);
};

// Accept both: a GET link (simple) and a POST form (CSRF-safer). Both just end the session.
export const GET = signOutAndHome;
export const POST = signOutAndHome;
