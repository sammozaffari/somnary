# Supabase setup — newsletter + claim submissions (CHK-4.2) + accounts (CHK-6.9a/6.9b)

> Sections 1–5 cover the two capture forms (service-role key). **Section 6** covers accounts /
> sign-in (the PUBLIC anon key) — a separate, browser-safe key. Both are env-gated: the site builds
> and deploys with neither configured.


Somnary's two capture forms — **the dispatch** (`/dispatch`) and **submit a claim**
(`/submit-a-claim`) — write to a Supabase Postgres database through two server-only API routes
(`/api/subscribe`, `/api/submit-claim`). This doc is the one-time setup.

**Graceful degradation:** if the environment variables below are not set, the site still builds
and deploys — the forms just return a friendly "signups aren't open yet" and store nothing. So
you can ship before configuring Supabase, then turn it on by adding the env vars.

---

## 1. Create the Supabase project

1. Go to <https://supabase.com> → sign in → **New project**.
2. Pick an organization, name it (e.g. `somnary`), set a strong database password (save it in a
   password manager), and choose a region close to your users.
3. Wait for provisioning to finish (~1–2 min).

## 2. Create the tables

1. In the project, open **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/schema.sql`](../supabase/schema.sql) and click **Run**.
3. Confirm under **Table Editor** that `newsletter_subscribers` and `claim_submissions` exist and
   both show **RLS enabled** (a shield icon / "RLS enabled" badge).

The schema turns Row Level Security **on** for both tables with **no public policies**. This means
the public/anon key cannot read or write them — only our server, using the **service-role** key
(which bypasses RLS), can insert. That is the whole security design: writes happen only in our own
server code, never from the browser.

### 2a. Add the rate-limit table + RPC (for the assistant API routes)

The model-calling routes (`/api/ask`, `/api/search-ask`) are per-IP rate limited to protect the
LLM budget. In **SQL Editor → New query**, paste the entire contents of
[`supabase/rate-limit.sql`](../supabase/rate-limit.sql) and click **Run**. This adds:

- a `rate_limits` table (RLS on, no public policies — same security model as above), and
- an atomic `check_rate_limit()` function the server calls on each request.

**Graceful degradation:** if you skip this step (or run without Supabase configured at all), the
limiter **fails open** — the assistant keeps working, just unthrottled. So it is safe to defer, but
run it before opening the assistant to the public.

## 3. Get the keys

In the project: **Settings → API**.

- **Project URL** — e.g. `https://abcdefgh.supabase.co`. This is the value for `SUPABASE_URL`.
- **`service_role` secret** (under *Project API keys*) — the value for
  `SUPABASE_SERVICE_ROLE_KEY`.

> ⚠️ **The `service_role` key is a SECRET.** It bypasses Row Level Security and can read/write
> everything. It is used **server-side only** and must never appear in client code, in the repo, in
> logs, or in a screenshot. Never paste it anywhere public. If it ever leaks, rotate it immediately
> in **Settings → API**.
>
> You do **not** need the `anon` public key for this feature — the design inserts only via the
> server with the service-role key, so leave the anon key out of the app entirely.

## 4. Set the environment variables

### On Vercel (production)

**Vercel → your project → Settings → Environment Variables.** Add both, for the environments you
want (Production, Preview):

| Name                        | Value                                   |
| --------------------------- | --------------------------------------- |
| `SUPABASE_URL`              | your Project URL from step 3            |
| `SUPABASE_SERVICE_ROLE_KEY` | your `service_role` secret from step 3  |

Redeploy so the new env vars take effect.

### Locally (`.env`)

Add the same two lines to `.env` in the repo root (it is git-ignored — never commit it):

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-SECRET
```

Restart `npm run dev` after editing `.env`.

## 5. Verify

- With the vars set: submit the form on `/dispatch` and `/submit-a-claim`, then check the rows land
  in **Table Editor**. A duplicate email on the dispatch form returns "you're already on the list"
  (handled as success), not an error.
- Without the vars set: the forms return a 503 "signups aren't open yet" and the build still passes.

---

## Env var reference

| Variable                    | Where          | Secret? | Purpose                                        |
| --------------------------- | -------------- | ------- | ---------------------------------------------- |
| `SUPABASE_URL`              | Vercel + `.env`| no      | Supabase project REST URL                      |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + `.env`| **YES** | Server-only insert key; bypasses RLS. Rotate if leaked. |
| `PUBLIC_SUPABASE_URL`       | Vercel + `.env`| no      | Supabase project URL for accounts/auth (same URL, `PUBLIC_`-prefixed for the browser). |
| `PUBLIC_SUPABASE_ANON_KEY`  | Vercel + `.env`| no      | Anon/publishable key for sign-in. Browser-safe by design; RLS enforces access. Never the service-role key. |
| `RATE_LIMIT_MAX`            | Vercel (opt.)  | no      | Max assistant requests per IP per window. **Optional**, default `20`. |
| `RATE_LIMIT_WINDOW_SECONDS` | Vercel (opt.)  | no      | Rate-limit window length in seconds. **Optional**, default `60`. |

Both `RATE_LIMIT_*` vars are **optional** — leave them unset to use the defaults (20 requests per
60 s per IP, per endpoint). They only apply once `supabase/rate-limit.sql` has been run and Supabase
is configured; otherwise the limiter fails open.

## 6. Accounts — auth env vars (CHK-6.9a)

Accounts (sign in with Google, or an email magic-link) use a **second, separate** pair of env vars.
These are the **PUBLIC anon/publishable** key — the opposite of the service-role key above.

> The **anon / publishable** key is **browser-safe and public by design.** It carries no privilege
> on its own; **Row-Level Security** decides what a signed-in user may read or write. That is why it
> is safe to ship in the client bundle. This is the deliberate inverse of the `service_role` key,
> which is secret and must never reach the client. Auth uses **only** the anon key — never
> service-role — because a session flow must never run with RLS bypassed.

**Graceful degradation:** if these two vars are absent, the auth clients return `null` and the
`/auth/*` routes redirect home without error — the site still builds and deploys. So you can ship
this PR before adding keys, then turn accounts on by adding the vars.

### 6a. Enable the providers (already done by the owner)

In **Authentication → Providers**: **Google** (OAuth) and **Email** (magic-link) are enabled, and
**Authentication → URL Configuration** has the **Site URL** + **Redirect URLs** set. Apple sign-in is
deferred. If you add a new deploy domain, add it to the **Redirect URLs** allowlist.

> ⚠️ **Confirm the production domain matches the Supabase redirect allowlist.** The app derives the
> callback URL from the request origin (so preview and production both work with no code change), but
> Supabase will only redirect back to a URL on its allowlist. The `site:` value in `astro.config.mjs`
> is currently `https://somnary.vercel.app`; make sure that domain (and any custom domain) is listed
> in **Authentication → URL Configuration → Redirect URLs**, including the `/auth/callback` path.

### 6b. Get the anon key

**Settings → API → Project API keys → `anon` / `public`** (labeled *publishable* in newer projects).
The **Project URL** is the same one from step 3.

### 6c. Set the vars

Add to **Vercel → Settings → Environment Variables** (Production + Preview) **and** to `.env`:

| Name                        | Value                                              |
| --------------------------- | -------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | your Project URL (same as `SUPABASE_URL`)          |
| `PUBLIC_SUPABASE_ANON_KEY`  | the `anon` / `public` (publishable) key            |

```bash
# .env (git-ignored — never commit)
PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLISHABLE-KEY
```

The `PUBLIC_` prefix is required — Astro/Vite only exposes `PUBLIC_`-prefixed vars to the browser
bundle, which the sign-in client needs. Redeploy (Vercel) or restart `npm run dev` (local) after
adding them.

## 7. Accounts — saved reading-maps schema (CHK-6.9b)


Saving a `/guide` result for a signed-in user needs two new tables. Run the migration once:

1. In the project, open **SQL Editor** → **New query**.
2. Paste the entire contents of
   [`supabase/migrations/0002_accounts.sql`](../supabase/migrations/0002_accounts.sql) and click **Run**.
3. Confirm under **Table Editor** that `profiles` and `saved_maps` exist and both show **RLS enabled**.

**Different security model from every other table.** `schema.sql` and `0001` use RLS-on / **no
policies** (server-only, reached via the *service-role* key). These two tables are **owner-scoped**:
RLS is on **with** policies keyed to `auth.uid()`, so a signed-in user — using the **anon** key
through the `/api/save-map` + `/api/saved-maps` routes — can read and write **only their own rows**.
The service-role key is never used for account data; it always flows through RLS as the user.

**What it stores (the firewall):** the structured `/guide` output only — the validated `GuideState`
(fixed-enum answers), the deterministic reading map (real corpus URLs), and the habits-checklist
tick-state. It **never** stores chat transcripts or free prose (the save route strips them through the
guide schema validator), and it **never** stores experience / supplier / community reports — those
live in the **separate pseudonymous store** and stay firewalled from account identity.

The migration also adds an `on_auth_user_created` trigger that auto-inserts a `profiles` row on new
signup (the save route also upserts the profile defensively, so accounts predating the trigger work).

**Graceful degradation:** if the `PUBLIC_SUPABASE_*` vars from §6 are absent, `/api/save-map` and
`/api/saved-maps` return **503** and store nothing — the site still builds and works signed-out. So
you can defer this migration until you turn accounts on.

## Data handling notes

- We store the minimum: an email (dispatch) or the submitted text + optional product/email
  (claims). This must stay consistent with [`/privacy`](../src/pages/privacy.astro).
- The dispatch newsletter does **not** publish yet — the form only collects an address to notify
  people **when** it launches. Keep the copy honest if you touch it.
- `confirmed` on `newsletter_subscribers` is reserved for double opt-in when the dispatch actually
  launches; it is unused today.
