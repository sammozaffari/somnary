# Supabase setup — newsletter + claim submissions (CHK-4.2)

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

## Data handling notes

- We store the minimum: an email (dispatch) or the submitted text + optional product/email
  (claims). This must stay consistent with [`/privacy`](../src/pages/privacy.astro).
- The dispatch newsletter does **not** publish yet — the form only collects an address to notify
  people **when** it launches. Keep the copy honest if you touch it.
- `confirmed` on `newsletter_subscribers` is reserved for double opt-in when the dispatch actually
  launches; it is unused today.
