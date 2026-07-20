#!/usr/bin/env node
/**
 * Auth-plumbing suite (CHK-6.9a) — fully OFFLINE, NO keys, NO network, NO real Supabase.
 *
 * Env-gated behavior is the whole point of this PR, so the test runs with the auth env vars
 * ABSENT and proves the clients degrade to null instead of throwing:
 *   getBrowserSupabase()  → null when PUBLIC_SUPABASE_* is unset
 *   getServerSupabase()   → null when PUBLIC_SUPABASE_* is unset (does not touch the cookie jar)
 *
 * It also enforces two security invariants by inspecting the SOURCE:
 *   (a) src/lib/auth.ts NEVER references SUPABASE_SERVICE_ROLE_KEY and never calls getSupabaseAdmin
 *       — service-role must never touch a session/auth flow.
 *   (b) the callback's open-redirect sanitizer only honors same-origin internal paths. We import
 *       nothing private; instead we re-run the exact rule the callback uses against known-hostile
 *       inputs to lock the contract.
 *
 *   node scripts/test-auth-plumbing.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const imp = (rel) => import(pathToFileURL(join(ROOT, rel)).href);
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const results = { pass: 0, fail: 0, failures: [] };
function check(cond, label) {
  if (cond) {
    results.pass++;
    console.log(`  ✓ ${label}`);
  } else {
    results.fail++;
    results.failures.push(label);
    console.log(`  ✗ ${label}`);
  }
}

// Guarantee a null environment: strip any auth vars that might be present in the shell.
delete process.env.PUBLIC_SUPABASE_URL;
delete process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log('auth-plumbing suite — env-gated (no keys present):');

// --- (1) null-env degradation -------------------------------------------------------------------
const { getBrowserSupabase, getServerSupabase } = await imp('src/lib/auth.ts');

check(getBrowserSupabase() === null, 'getBrowserSupabase() → null when unconfigured');
check(getBrowserSupabase() === null, 'getBrowserSupabase() → null on repeat (cached null)');

// Fake request + AstroCookies — if getServerSupabase touched either before the null check, this
// would blow up. getServerSupabase(request, cookies) must short-circuit on the missing config.
const fakeRequest = {
  headers: {
    get() {
      throw new Error('request headers must not be read when unconfigured');
    },
  },
};
const fakeCookies = {
  set() {
    throw new Error('cookie jar must not be written when unconfigured');
  },
};
check(
  getServerSupabase(fakeRequest, fakeCookies) === null,
  'getServerSupabase() → null when unconfigured (touches neither request nor cookies)',
);

// --- (2) service-role must never appear in auth.ts ----------------------------------------------
const authSrc = read('src/lib/auth.ts');
// Strip comments, then assert the service-role var name does not appear in EXECUTABLE code — it is
// mentioned only in the file-header safety comment, never read.
const authCode = authSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
check(
  !/SUPABASE_SERVICE_ROLE_KEY/.test(authCode),
  'auth.ts names SUPABASE_SERVICE_ROLE_KEY only in comments, never in code',
);
// Stricter: the var must not be passed to readEnv() (i.e. not actually read).
check(!/readEnv\(['"]SUPABASE_SERVICE_ROLE_KEY/.test(authCode), 'auth.ts never readEnv(SERVICE_ROLE)');
check(!/getSupabaseAdmin/.test(authCode), 'auth.ts never imports/calls getSupabaseAdmin (in code)');
check(/PUBLIC_SUPABASE_ANON_KEY/.test(authCode), 'auth.ts reads the PUBLIC anon key');

// --- (3) open-redirect sanitization contract ----------------------------------------------------
// Mirror of safeNext() in src/pages/auth/callback.ts. Kept in lockstep with the route.
const DEFAULT_NEXT = '/account';
function safeNext(next) {
  if (!next) return DEFAULT_NEXT;
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return DEFAULT_NEXT;
  return next;
}
// Assert the route's source actually contains this rule so the mirror can't silently drift.
const cbSrc = read('src/pages/auth/callback.ts');
check(/startsWith\('\/\/'\)/.test(cbSrc), 'callback.ts guards protocol-relative //host');
check(/startsWith\('\/\\\\'\)/.test(cbSrc), 'callback.ts guards backslash /\\host trick');

const cases = [
  ['/account', '/account', 'plain internal path passes'],
  ['/account/settings', '/account/settings', 'nested internal path passes'],
  [null, DEFAULT_NEXT, 'missing next → default'],
  ['', DEFAULT_NEXT, 'empty next → default'],
  ['//evil.com', DEFAULT_NEXT, 'protocol-relative //evil.com → default'],
  ['/\\evil.com', DEFAULT_NEXT, 'backslash /\\evil.com → default'],
  ['https://evil.com', DEFAULT_NEXT, 'absolute https URL → default'],
  ['http://evil.com', DEFAULT_NEXT, 'absolute http URL → default'],
  ['javascript:alert(1)', DEFAULT_NEXT, 'javascript: scheme → default'],
  ['account', DEFAULT_NEXT, 'relative (no leading slash) → default'],
];
for (const [input, expected, label] of cases) {
  check(safeNext(input) === expected, `safeNext: ${label}`);
}

// --- summary ------------------------------------------------------------------------------------
console.log('');
if (results.fail === 0) {
  console.log(`✓ auth-plumbing suite: ${results.pass} passed, 0 failed.`);
  process.exit(0);
} else {
  console.log(`✗ auth-plumbing suite: ${results.pass} passed, ${results.fail} failed.`);
  for (const f of results.failures) console.log(`   - ${f}`);
  process.exit(1);
}
