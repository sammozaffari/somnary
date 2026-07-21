#!/usr/bin/env node
/**
 * Rate-limiter unit suite (rate-limit hardening) — fully OFFLINE, no real database.
 *
 * Drives the REAL helper (src/lib/rate-limit.ts) with a MOCK Supabase client (an object with an
 * .rpc() method), the same injection idea the ask engine uses for its model client. Proves:
 *   checkRateLimit  (a) allowed when the RPC returns allowed=true
 *                   (b) blocked when allowed=false, with retryAfter passed through
 *                   (c) FAIL-OPEN when the client is null (no keys)
 *                   (d) FAIL-OPEN when the RPC returns an error
 *                   (e) FAIL-OPEN when the RPC throws
 *   clientIpFrom    x-forwarded-for multi-hop → first hop; x-real-ip fallback; 'unknown' default.
 *
 *   node scripts/test-rate-limit.mjs
 */
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const imp = (rel) => import(pathToFileURL(join(ROOT, rel)).href);
const { checkRateLimit, clientIpFrom } = await imp('src/lib/rate-limit.ts');

const results = { pass: 0, fail: 0, failures: [] };
function check(cond, label) {
  if (cond) results.pass++;
  else {
    results.fail++;
    results.failures.push(label);
  }
}

// --- mock Supabase clients ----------------------------------------------------------------------
/** Returns a client whose .rpc() yields { data: [row], error: null }. */
const mockRpcData = (row) => ({
  rpc: async () => ({ data: [row], error: null }),
});
/** Returns a client whose .rpc() yields an error. */
const mockRpcError = (message) => ({
  rpc: async () => ({ data: null, error: { message } }),
});
/** Returns a client whose .rpc() throws. */
const mockRpcThrows = (message) => ({
  rpc: async () => {
    throw new Error(message);
  },
});

async function run() {
  console.log('rate-limit suite — checkRateLimit:');

  // (a) allowed passthrough
  {
    const r = await checkRateLimit({
      key: 'ask:1.2.3.4',
      limit: 20,
      windowSeconds: 60,
      client: mockRpcData({ allowed: true, retry_after: 0 }),
    });
    const ok = r.allowed === true && r.retryAfter === 0;
    check(ok, 'allowed-true');
    console.log(`  ${ok ? '✓' : '✗'} allowed=true → allowed=${r.allowed} retryAfter=${r.retryAfter}`);
  }

  // (b) blocked with retryAfter passthrough
  {
    const r = await checkRateLimit({
      key: 'ask:1.2.3.4',
      limit: 20,
      windowSeconds: 60,
      client: mockRpcData({ allowed: false, retry_after: 42 }),
    });
    const ok = r.allowed === false && r.retryAfter === 42;
    check(ok, 'blocked-retry-after');
    console.log(`  ${ok ? '✓' : '✗'} allowed=false,retry=42 → allowed=${r.allowed} retryAfter=${r.retryAfter}`);
  }

  // (c) FAIL-OPEN when client is null
  {
    const r = await checkRateLimit({ key: 'ask:1.2.3.4', limit: 20, windowSeconds: 60, client: null });
    const ok = r.allowed === true && r.retryAfter === 0;
    check(ok, 'fail-open-null-client');
    console.log(`  ${ok ? '✓' : '✗'} client=null (fail open) → allowed=${r.allowed} retryAfter=${r.retryAfter}`);
  }

  // (d) FAIL-OPEN when the RPC errors
  {
    const r = await checkRateLimit({
      key: 'ask:1.2.3.4',
      limit: 20,
      windowSeconds: 60,
      client: mockRpcError('boom'),
    });
    const ok = r.allowed === true && r.retryAfter === 0;
    check(ok, 'fail-open-rpc-error');
    console.log(`  ${ok ? '✓' : '✗'} rpc error (fail open) → allowed=${r.allowed} retryAfter=${r.retryAfter}`);
  }

  // (e) FAIL-OPEN when the RPC throws
  {
    const r = await checkRateLimit({
      key: 'ask:1.2.3.4',
      limit: 20,
      windowSeconds: 60,
      client: mockRpcThrows('network down'),
    });
    const ok = r.allowed === true && r.retryAfter === 0;
    check(ok, 'fail-open-rpc-throws');
    console.log(`  ${ok ? '✓' : '✗'} rpc throws (fail open) → allowed=${r.allowed} retryAfter=${r.retryAfter}`);
  }

  // negative retry_after from the DB must clamp to 0
  {
    const r = await checkRateLimit({
      key: 'ask:1.2.3.4',
      limit: 20,
      windowSeconds: 60,
      client: mockRpcData({ allowed: false, retry_after: -5 }),
    });
    const ok = r.allowed === false && r.retryAfter === 0;
    check(ok, 'retry-after-clamped');
    console.log(`  ${ok ? '✓' : '✗'} retry_after=-5 clamps → retryAfter=${r.retryAfter}`);
  }

  console.log('\nclientIpFrom:');
  const ipCases = [
    {
      name: 'xff-multi-hop-first',
      headers: { 'x-forwarded-for': '203.0.113.7, 70.41.3.18, 150.172.238.178' },
      expect: '203.0.113.7',
    },
    { name: 'xff-single', headers: { 'x-forwarded-for': '198.51.100.9' }, expect: '198.51.100.9' },
    {
      name: 'x-real-ip-fallback',
      headers: { 'x-real-ip': '192.0.2.44' },
      expect: '192.0.2.44',
    },
    {
      name: 'xff-preferred-over-real-ip',
      headers: { 'x-forwarded-for': '203.0.113.7', 'x-real-ip': '192.0.2.44' },
      expect: '203.0.113.7',
    },
    { name: 'no-headers-unknown', headers: {}, expect: 'unknown' },
    { name: 'empty-xff-falls-through', headers: { 'x-forwarded-for': '   ' }, expect: 'unknown' },
  ];
  for (const c of ipCases) {
    const req = new Request('https://somnary.test/api/ask', { headers: c.headers });
    const got = clientIpFrom(req);
    const ok = got === c.expect;
    check(ok, `clientIpFrom/${c.name}`);
    console.log(`  ${ok ? '✓' : '✗'} ${c.name.padEnd(28)} got=${got} expected=${c.expect}`);
  }

  console.log(`\n${results.fail === 0 ? '✓' : '✗'} rate-limit suite: ${results.pass} passed, ${results.fail} failed.`);
  if (results.fail) {
    console.log('  failures: ' + results.failures.join(', '));
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
