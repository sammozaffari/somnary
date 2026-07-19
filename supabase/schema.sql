-- Somnary — Supabase schema (CHK-4.2)
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query → paste → Run).
-- See docs/SUPABASE_SETUP.md for the full walkthrough.
--
-- SECURITY MODEL: both tables have Row Level Security ENABLED with NO public policies. That means
-- the anon/public key cannot read or write these tables at all. Our server routes insert using the
-- SERVICE-ROLE key, which BYPASSES RLS — so writes only ever happen from our own server code
-- (src/pages/api/*.ts), never from the browser. The anon key is not used anywhere in this design.

-- gen_random_uuid() lives in pgcrypto; enabled by default on Supabase, but assert it to be safe.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- newsletter_subscribers — the dispatch "notify me" list (/api/subscribe)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  source     text,                              -- e.g. 'dispatch' (where the signup came from)
  created_at timestamptz not null default now(),
  confirmed  boolean not null default false     -- reserved for double opt-in when the dispatch launches
);

-- ---------------------------------------------------------------------------
-- claim_submissions — reader-flagged claims / labels (/api/submit-claim)
-- ---------------------------------------------------------------------------
create table if not exists public.claim_submissions (
  id              uuid primary key default gen_random_uuid(),
  submission_text text not null,
  product_name    text,
  email           text,                         -- optional; only if the reader wants a reply
  status          text not null default 'new',  -- triage state: new → reviewing → actioned → closed
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: ON, with NO policies → anon/public cannot select/insert/update/delete.
-- Only the service-role key (server-side) can touch these tables (it bypasses RLS).
-- ---------------------------------------------------------------------------
alter table public.newsletter_subscribers enable row level security;
alter table public.claim_submissions      enable row level security;

comment on table public.newsletter_subscribers is
  'Dispatch notify-me list. RLS on, no public policies: only the service-role key (server) inserts.';
comment on table public.claim_submissions is
  'Reader-flagged claims/labels for research prioritization. RLS on, no public policies: server-only writes.';
