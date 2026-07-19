-- Somnary — per-IP rate limiting for the model-calling API routes (rate-limit hardening).
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query → paste → Run).
-- See docs/SUPABASE_SETUP.md for the walkthrough.
--
-- WHY: /api/ask and /api/search-ask are unauthenticated and each call spends LLM credit. A fixed
-- per-IP window caps how fast one caller can burn the budget. The buckets are keyed by endpoint,
-- so the two routes limit independently ('ask:<ip>' vs 'search-ask:<ip>').
--
-- SECURITY MODEL (mirrors schema.sql): Row Level Security is ENABLED with NO public policies, so the
-- anon/public key cannot read or write this table at all. Only our server's SERVICE-ROLE key touches
-- it — and it does so exclusively through the check_rate_limit() RPC below (security definer), never
-- with raw table access from the browser.

-- ---------------------------------------------------------------------------
-- rate_limits — one row per bucket key ('ask:<ip>' / 'search-ask:<ip>'), fixed-window counter.
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  key          text primary key,
  window_start timestamptz not null default now(),
  count        int not null default 0
);

-- RLS on, no policies → anon/public cannot touch it. The service-role key bypasses RLS, and the RPC
-- below runs security definer, so only our server code ever reads or writes this table.
alter table public.rate_limits enable row level security;

comment on table public.rate_limits is
  'Per-IP fixed-window rate-limit counters for the model-calling API routes. RLS on, no public '
  'policies: only the service-role key (server), via check_rate_limit(), touches it.';

-- ---------------------------------------------------------------------------
-- check_rate_limit — ATOMIC fixed-window limiter. One call = one hit against the bucket.
--
-- The whole read-modify-write happens in a single upsert so concurrent calls for the same key can
-- never race: `insert ... on conflict do update` takes a row lock on the conflicting key, so two
-- requests that arrive at once are serialized and each sees the other's increment. The CASE resets
-- the counter to 1 when the stored window has expired (window_start older than now() - window),
-- otherwise it increments. `allowed` is then (resulting count <= p_limit); `retry_after` is the whole
-- seconds remaining until the current window ends (>= 0), useful for a Retry-After header.
-- ---------------------------------------------------------------------------
create or replace function public.check_rate_limit(
  p_key text,
  p_limit int,
  p_window_seconds int
)
returns table(allowed boolean, retry_after int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count        int;
  v_window_start timestamptz;
begin
  insert into public.rate_limits as rl (key, window_start, count)
    values (p_key, now(), 1)
  on conflict (key) do update
    set
      -- Expired window → start a fresh window now with count 1; else keep the window and increment.
      window_start = case
        when rl.window_start < now() - make_interval(secs => p_window_seconds)
          then now()
        else rl.window_start
      end,
      count = case
        when rl.window_start < now() - make_interval(secs => p_window_seconds)
          then 1
        else rl.count + 1
      end
  returning rl.count, rl.window_start into v_count, v_window_start;

  allowed := (v_count <= p_limit);
  -- Seconds left in the current window; clamp at 0 so it is never negative.
  retry_after := greatest(
    0,
    ceil(extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - now())))::int
  );
  return next;
end;
$$;

-- The service-role client calls this RPC. Service-role generally bypasses grants, but grant execute
-- explicitly so the function is callable regardless of default privilege configuration.
grant execute on function public.check_rate_limit(text, int, int) to service_role;

-- ---------------------------------------------------------------------------
-- Housekeeping (OPTIONAL): rows are self-resetting, so pruning is not required for correctness — it
-- only reclaims space from IPs that never return. Run occasionally, or schedule with pg_cron:
--
--   delete from public.rate_limits where window_start < now() - interval '1 day';
--
-- (pg_cron example, if the extension is enabled:)
--   select cron.schedule('prune-rate-limits', '0 4 * * *',
--     $$delete from public.rate_limits where window_start < now() - interval '1 day'$$);
-- ---------------------------------------------------------------------------
