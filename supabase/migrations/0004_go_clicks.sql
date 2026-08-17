-- Somnary — retail click log (CHK-B4; REDESIGN Step 9 / A3). Run in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run). See docs/SUPABASE_SETUP.md.
--
-- WHAT THIS IS FOR: an AGGREGATE signal of which product + retailer readers click through to, so the
-- owner can see "what people actually want to buy, and therefore which products to research next"
-- (A3). It is owner-facing SQL only; nothing on the site reads it, and it can never set, influence,
-- or gate a grade, a score, or the ORDER of results (RULES.md Products; CLAUDE.md non-negotiable 1).
--
-- ═══════════════════════════════════════════════════════════════════════════════════════════════════
-- PRIVACY (hard rule — Step 9 "no personal data"). This table stores ONLY:
--     product_id, retailer, clicked_at (server default)
-- There is deliberately NO column for an IP address, User-Agent, Referer, cookie, session, or user
-- id. The /go endpoint (src/pages/go/[id].ts) never inspects the request for identity — it passes
-- only product_id + retailer to src/lib/go/click-log.ts. Nothing here can be joined to a person.
-- ═══════════════════════════════════════════════════════════════════════════════════════════════════
--
-- SECURITY MODEL (same as 0001 / 0003 / rate-limit): Row Level Security ENABLED with NO public
-- policies — the anon key can neither read nor write. Inserts come only from the service-role server
-- (the /go route). Nothing queries this table from the browser or at build time.
--
-- FIREWALL: no foreign key into any corpus / remedy / grade / tier / scorecard / product table —
-- product_id is a bare text tag a human reads, never joined to a graded page, never sets a score.

create table if not exists public.go_clicks (
  id         bigint generated always as identity primary key,
  product_id text not null,                       -- the product tag (free text; no FK, never a grade input)
  retailer   text not null,                       -- 'amazon' | 'iherb' | 'chemistWarehouse'
  clicked_at timestamptz not null default now()   -- server-side timestamp; the ONLY time data, no client time
  -- NO ip / user_agent / referer / user_id / session columns — by design (privacy hard rule).
);

-- aggregate read path for the owner (which products draw clicks). Not read by the site.
create index if not exists go_clicks_product_idx on public.go_clicks (product_id);

alter table public.go_clicks enable row level security;
-- No policies created on purpose: anon can neither read nor write; only the service-role server inserts.
