-- Somnary — Source Scorecards schema (Phase A; design: docs/plans/2026-07-17-source-scorecards-design.md,
-- rubric: docs/SOURCE_SCORECARD_RUBRIC.md). Standalone: does not reference the CHK-4.2 tables and can
-- run before or after supabase/schema.sql. Run in the Supabase SQL editor (Dashboard → SQL Editor).
--
-- SECURITY MODEL (same as CHK-4.2): every table has Row Level Security ENABLED with NO public
-- policies — the anon key can neither read nor write. All access is server-side via the
-- service-role key: writes from the research pipeline, reads at Astro BUILD TIME only (the site
-- stays SSG; nothing queries Supabase from the browser).
--
-- RATIFICATION GATE: source_scores.ratified_at/ratified_by implement the [HUMAN-GATE] on brand
-- verdicts. The build reads ONLY the source_scorecards_published view, which filters on
-- ratified_at IS NOT NULL — unratified scores structurally cannot publish.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- source_products — one row per product-for-a-remedy (the scorecard subject)
-- ---------------------------------------------------------------------------
create table if not exists public.source_products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,          -- e.g. 'brand-a-melatonin-3mg'
  remedy_slug       text not null,                 -- matches src/content/remedies/<slug>.mdx
  brand             text not null,
  product_name      text not null,
  form              text,                          -- tablet | gummy | liquid | capsule …
  dose_mg           numeric,                       -- per serving, of the active
  serving_type      text,
  manufacturer_link text,                          -- direct link, clean URL, never affiliate
  retailer_links    jsonb not null default '[]',   -- [{name, url}] — clean URLs, never affiliate
  review_date       date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- source_certifications — third-party certs (rubric dimension 1)
-- ---------------------------------------------------------------------------
create table if not exists public.source_certifications (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.source_products(id) on delete cascade,
  cert_type     text not null check (cert_type in ('usp','nsf','informed-choice','tga-austl','other')),
  verifier      text,
  url           text not null,                     -- certifier directory listing (the document)
  verified_date date,
  lapsed        boolean not null default false
);

-- ---------------------------------------------------------------------------
-- source_assays — published content analyses naming this product (dimensions 1–2)
-- ---------------------------------------------------------------------------
create table if not exists public.source_assays (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.source_products(id) on delete cascade,
  source_kind text not null check (source_kind in ('pmid','doi','our-lab')),
  source_id   text not null,                       -- pmid digits, doi, or our lab report id
  claimed_mg  numeric,
  measured_mg numeric,
  year        int
);

-- ---------------------------------------------------------------------------
-- source_regulatory — regulator events, primary document required (dimension 4)
-- ---------------------------------------------------------------------------
create table if not exists public.source_regulatory (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.source_products(id) on delete cascade,
  event_type text not null check (event_type in ('warning-letter','recall','ftc-action','tga-alert')),
  agency     text not null,
  event_date date not null,                        -- decay clock starts here (rubric: ½ at 3y, ¼ at 6y)
  url        text not null,                        -- the primary regulator document
  summary    text not null                         -- quoted/tightly-paraphrased regulator language, dated
);

-- ---------------------------------------------------------------------------
-- source_additives — watchlist hits on the captured label (dimension 3)
-- ---------------------------------------------------------------------------
create table if not exists public.source_additives (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.source_products(id) on delete cascade,
  watchlist_id text not null,                      -- id in src/data/additive-watchlist.yaml
  evidence_url text                                -- captured label image/archive
);

-- ---------------------------------------------------------------------------
-- source_marketing_flags — brand claims, verbatim only (dimension 6)
-- ---------------------------------------------------------------------------
create table if not exists public.source_marketing_flags (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.source_products(id) on delete cascade,
  claim_verbatim  text not null,                   -- quoted exactly; we never characterize
  captured_url    text not null,
  captured_date   date not null,
  violation_class text check (violation_class in ('disease-claim','unsupported-proof','fear-marketing'))
);

-- ---------------------------------------------------------------------------
-- source_scores — the six dimensions + verdict; ratification gate lives here
-- ---------------------------------------------------------------------------
create table if not exists public.source_scores (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid unique not null references public.source_products(id) on delete cascade,
  testing        int not null check (testing        between 0 and 5),
  label_accuracy int not null check (label_accuracy between 0 and 5),
  additives      int not null check (additives      between 0 and 5),
  regulatory     int not null check (regulatory     between 0 and 5),
  transparency   int not null check (transparency   between 0 and 5),
  marketing      int not null check (marketing      between 0 and 5),
  verdict        text,                             -- plain-language line; part of the ratified object
  rubric_version text not null default 'v1',
  drafted_at     timestamptz not null default now(),
  ratified_at    timestamptz,                      -- [HUMAN-GATE] — set by the owner only
  ratified_by    text                              -- owner identifier; agents never write these two
);

comment on column public.source_scores.ratified_at is
  '[HUMAN-GATE] Owner-only. NULL = draft; drafts never publish (see source_scorecards_published). No agent sets or changes this.';

-- ---------------------------------------------------------------------------
-- source_sentiment — community read. DISPLAY-ONLY, firewalled from scoring.
-- ---------------------------------------------------------------------------
create table if not exists public.source_sentiment (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.source_products(id) on delete cascade,
  summary       text,
  themes        jsonb not null default '[]',       -- [{theme, note}]
  example_links jsonb not null default '[]',       -- [{title, url}] — public threads only
  last_read     date
);

comment on table public.source_sentiment is
  'Display-only community read. Never read by any scoring path. Community/anecdote data never sets or influences a score (CLAUDE.md non-negotiable).';

-- ---------------------------------------------------------------------------
-- source_changelog — every change to a published scorecard, dated and reasoned
-- ---------------------------------------------------------------------------
create table if not exists public.source_changelog (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.source_products(id) on delete cascade,
  changed_at timestamptz not null default now(),
  field      text not null,
  old_value  text,
  new_value  text,
  reason     text not null                         -- incl. re-review trigger or correction reference
);

-- ---------------------------------------------------------------------------
-- Publish gate: the build reads ONLY this view. Unratified scores cannot ship.
-- ---------------------------------------------------------------------------
create or replace view public.source_scorecards_published
with (security_invoker = true) as
select
  p.id, p.slug, p.remedy_slug, p.brand, p.product_name, p.form, p.dose_mg,
  p.serving_type, p.manufacturer_link, p.retailer_links, p.review_date,
  s.testing, s.label_accuracy, s.additives, s.regulatory, s.transparency,
  s.marketing, s.verdict, s.rubric_version, s.ratified_at
from public.source_products p
join public.source_scores s on s.product_id = p.id
where s.ratified_at is not null;

comment on view public.source_scorecards_published is
  'The ONLY read surface for the site build. ratified_at IS NOT NULL enforces the [HUMAN-GATE]: draft scores are structurally unpublishable.';

-- ---------------------------------------------------------------------------
-- RLS: ON everywhere, NO policies → anon key is locked out entirely.
-- ---------------------------------------------------------------------------
alter table public.source_products        enable row level security;
alter table public.source_certifications  enable row level security;
alter table public.source_assays          enable row level security;
alter table public.source_regulatory      enable row level security;
alter table public.source_additives       enable row level security;
alter table public.source_marketing_flags enable row level security;
alter table public.source_scores          enable row level security;
alter table public.source_sentiment       enable row level security;
alter table public.source_changelog       enable row level security;
