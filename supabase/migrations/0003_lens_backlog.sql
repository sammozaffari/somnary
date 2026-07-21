-- Somnary — Lens human-grade loop: review nominations + Lens-demand backlog (CHK-7.3a). Run in the
-- Supabase SQL editor (Dashboard → SQL Editor → New query → paste → Run). See docs/SUPABASE_SETUP.md §8.
--
-- WHAT THIS IS FOR: a compounding loop that tells a HUMAN what to grade next. Readers nominate a
-- product/ingredient for a full review (review_nominations), and the Lens keeps an AGGREGATE COUNT of
-- which NAMED products/ingredients people research (lens_demand). Both feed the owner's grading
-- backlog — they are owner-facing SQL only; nothing on the site reads them.
--
-- ═══════════════════════════════════════════════════════════════════════════════════════════════════
-- THE FIREWALL (CLAUDE.md non-negotiable — "Community/anecdote data never influences or displays as
-- setting a grade"): community/nomination/demand data lives in this SEPARATE store and is STRUCTURALLY
-- INCAPABLE of touching a grade. There is NO foreign key from these tables into ANY corpus / remedy /
-- grade / tier / scorecard table (the remedy corpus lives in src/content, graded by a human; nothing
-- here references it). No grading or corpus module ever imports this data. It NEVER sets, influences,
-- or gates a grade. Grading stays human-gated, always. (Mirrors the source_sentiment firewall in
-- supabase/migrations/0001_source_scorecards.sql.)
-- ═══════════════════════════════════════════════════════════════════════════════════════════════════
--
-- PRIVACY (legal hard gate; must match /privacy exactly): lens_demand stores ONLY a normalized
-- product/ingredient NAME + a counter. NEVER the free-text `question`-kind Lens input, NEVER refused or
-- short-circuited runs, NEVER raw text, NEVER an IP, NEVER a per-query row. One row per subject, a
-- count bumped on each qualifying research run.
--
-- SECURITY MODEL (same as schema.sql / 0001 / rate-limit.sql): Row Level Security ENABLED with NO
-- public policies — the anon key can neither read nor write. All access is server-side via the
-- service-role key (writes from the Lens route + the nominate route); the bump goes through the
-- security-definer RPC below. Nothing queries these tables from the browser or at build time.

-- gen_random_uuid() lives in pgcrypto; enabled by default on Supabase, but assert it to be safe.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- review_nominations — one row per reader nomination from /request-a-review. Feeds the grading
-- backlog. NO foreign key into any corpus/remedy/grade table: `subject` is free text a human triages;
-- it is never joined to a graded page and never sets a grade.
-- ---------------------------------------------------------------------------
create table if not exists public.review_nominations (
  id         uuid primary key default gen_random_uuid(),
  subject    text not null,                      -- the product/ingredient nominated (free text)
  note       text,                               -- optional context from the reader
  email      text,                               -- optional; only if they want a reply (no reply promised)
  source     text,                               -- where it came from, e.g. 'request-a-review'
  status     text default 'new',                 -- triage state, owner-managed ('new' | 'triaged' | …)
  created_at timestamptz not null default now()
);

comment on table public.review_nominations is
  'Reader nominations for a full human review. Feeds the owner grading backlog ONLY. FIREWALLED: no FK '
  'into any corpus/remedy/grade table; never read by any grading path; never sets or influences a grade '
  '(CLAUDE.md non-negotiable). Owner-facing SQL only — the site never reads this.';

-- ---------------------------------------------------------------------------
-- lens_demand — AGGREGATE research demand. One row per normalized subject (product/ingredient NAME),
-- with a bumped counter. PRIVACY: this is the ONLY thing logged from a Lens run — a normalized name
-- and a count. NEVER a free-text question, NEVER a refused/short-circuit run, NEVER raw text, NEVER an
-- IP, NEVER a per-query row. `subject` is the primary key, so a repeat research run UPSERTS the same
-- row and bumps run_count; it never appends a new row.
-- ---------------------------------------------------------------------------
create table if not exists public.lens_demand (
  subject    text primary key,                   -- normalized product/ingredient name (lowercased, trimmed)
  run_count  bigint not null default 0,          -- how many qualifying Lens runs researched this subject
  first_seen date not null default current_date,
  last_seen  date not null default current_date
);

comment on table public.lens_demand is
  'AGGREGATE Lens research demand: one row per normalized product/ingredient NAME + a counter. Feeds '
  'the owner grading backlog ONLY. PRIVACY: stores ONLY the normalized name + a count — never the '
  'free-text question input, never refused/short-circuit runs, never raw text, never an IP, never a '
  'per-query row. FIREWALLED: no FK into any corpus/remedy/grade table; never read by any grading path; '
  'never sets or influences a grade (CLAUDE.md non-negotiable). Owner-facing SQL only.';

-- ---------------------------------------------------------------------------
-- lens_demand_bump — the ONLY write path for lens_demand. Atomic upsert-counter: insert the subject at
-- count 1, or on conflict bump run_count and refresh last_seen. Security definer so the service-role
-- server call touches nothing else; search_path pinned to public.
-- ---------------------------------------------------------------------------
create or replace function public.lens_demand_bump(p_subject text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.lens_demand as ld (subject, run_count, first_seen, last_seen)
    values (p_subject, 1, current_date, current_date)
  on conflict (subject) do update
    set run_count = ld.run_count + 1,
        last_seen = current_date;
$$;

-- The service-role client calls this RPC. Service-role generally bypasses grants, but grant execute
-- explicitly so the function is callable regardless of default privilege configuration.
grant execute on function public.lens_demand_bump(text) to service_role;

-- ---------------------------------------------------------------------------
-- RLS: ON everywhere, NO policies → the anon/public key is locked out entirely. Only the service-role
-- key (server) writes, and lens_demand only ever through lens_demand_bump().
-- ---------------------------------------------------------------------------
alter table public.review_nominations enable row level security;
alter table public.lens_demand        enable row level security;
