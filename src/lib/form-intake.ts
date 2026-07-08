// Shared server-side form intake helpers (CHK-4.2), used by the /api/subscribe and
// /api/submit-claim routes. Kept in one place so both routes parse bodies, run the honeypot,
// and validate email identically.
//
// Bot handling is a HIDDEN HONEYPOT only — no CAPTCHA (a project decision: no bot-detection
// friction). A bot that fills the hidden `website` field is silently accepted (we return
// success) but nothing is stored, so it gets no signal that it was caught.

export type Body = Record<string, string>;

/** Parse a POST body as either urlencoded (progressive-enhancement form) or JSON (fetch). */
export async function parseBody(request: Request): Promise<Body> {
  const type = request.headers.get('content-type') ?? '';
  try {
    if (type.includes('application/json')) {
      const data = (await request.json()) as Record<string, unknown>;
      const out: Body = {};
      for (const [k, v] of Object.entries(data)) out[k] = typeof v === 'string' ? v : String(v ?? '');
      return out;
    }
    // urlencoded or multipart form-data
    const form = await request.formData();
    const out: Body = {};
    for (const [k, v] of form.entries()) out[k] = typeof v === 'string' ? v : '';
    return out;
  } catch {
    return {};
  }
}

/** True when the hidden honeypot field was filled — treat as a bot; accept-but-discard upstream. */
export function isHoneypotTripped(body: Body): boolean {
  return (body.website ?? '').trim().length > 0;
}

// Deliberately permissive but real: one @, a dot in the domain, no spaces. Server-side only —
// the client also uses type="email", but never trust the client.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length > 0 && v.length <= 254 && EMAIL_RE.test(v);
}

/** JSON Response helper with the correct content-type. */
export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
