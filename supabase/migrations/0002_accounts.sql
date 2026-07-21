-- Somnary — Accounts: profiles + saved reading-maps (CHK-6.9b). Run in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run). See docs/SUPABASE_SETUP.md §7.
--
-- WHAT THIS STORES: the structured output of the anonymous /guide concierge, for SIGNED-IN users who
-- choose to save it — the validated GuideState (fixed-enum answers), the deterministic reading map
-- (real corpus URLs), and the habits-checklist tick-state. NOTHING ELSE.
--
-- FIREWALL — WHAT THIS NEVER STORES:
--   • NO chat transcripts / free prose. The save route runs guide_state through the SAME schema
--     validator the engine uses (validateExtraction/coercePriorState), which drops every prose field
--     — only fixed-enum signals survive. There is no column for a message log, and there never will be.
--   • NO experience / supplier / community reports. Those live in the SEPARATE pseudonymous store
--     (CHK-6.4 source_sentiment et al.) and must stay firewalled from account identity. Do not join,
--     do not reference, do not add such a column here.
--
-- SECURITY MODEL — DIFFERENT from schema.sql / 0001. Those tables are RLS-on/NO-policies (server-only,
-- reached exclusively via the service-role key which BYPASSES RLS). THESE tables are OWNER-SCOPED:
-- RLS is on WITH policies keyed to auth.uid(), so a signed-in user — using the ANON key through our
-- API routes — can read and write ONLY their own rows. The service-role key never touches this data;
-- account data always flows through RLS as the user (see src/pages/api/save-map.ts, saved-maps.ts).

-- gen_random_uuid() lives in pgcrypto; enabled by default on Supabase, but assert it to be safe.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles — one row per signed-in user (mirrors auth.users). Minimal by design: identity lives in
-- auth.users; this is just the app-owned anchor future account rows can reference. No PII duplicated.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- saved_maps — a saved concierge result. All three payloads are validated JSON, never prose:
--   guide_state      — the validated GuideState (structured fixed-enum answers — NO transcript)
--   route_plan       — the deterministic reading map (real, /-rooted corpus URLs; external URLs rejected)
--   habits_checklist — {anchor: bool} tick-state (flat string→boolean map, size-capped by the route)
-- ---------------------------------------------------------------------------
create table if not exists public.saved_maps (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  guide_state      jsonb not null,
  route_plan       jsonb not null,
  habits_checklist jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists saved_maps_user_id_idx on public.saved_maps (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: ON, WITH owner-scoped policies. A user touches ONLY their own rows. auth.uid()
-- is the id of the caller's JWT (the anon key carries the signed-in user's session), so these policies
-- are the entire access boundary — there is no server-side bypass in this feature.
-- ---------------------------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.saved_maps enable row level security;

-- `for all` covers select/insert/update/delete. USING gates reads/deletes/updates to own rows;
-- WITH CHECK gates inserts/updates so a user can never write a row owned by someone else.
create policy "own profile"    on public.profiles  for all
  using (auth.uid() = id)      with check (auth.uid() = id);
create policy "own saved_maps" on public.saved_maps for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Grants: authenticated users act through RLS (policies above scope every row). Anon gets nothing —
-- the session is authenticated by the time a save happens. Supabase's `authenticated` role is the one
-- a logged-in anon-key request runs as.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles  to authenticated;
grant select, insert, update, delete on public.saved_maps to authenticated;

-- ---------------------------------------------------------------------------
-- Auto-create a profiles row on new signup. This is the robust path: it fires inside auth's own
-- transaction (security definer) so a profile always exists before the user's first save, and the
-- save route does not have to race an upsert. (The save route ALSO defensively upserts the profile —
-- belt and suspenders — so accounts predating this trigger still work.)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on table public.profiles is
  'One row per signed-in user (mirrors auth.users). RLS owner-scoped via auth.uid(). No PII duplicated.';
comment on table public.saved_maps is
  'Saved /guide concierge results (validated GuideState + reading map + checklist tick-state). RLS owner-scoped. NEVER transcripts; NEVER experience/community reports (those live in the separate pseudonymous store — firewall).';
