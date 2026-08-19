#!/usr/bin/env node
/**
 * NO-LOGIN-WALL gate (CHK-6.9c) — the accounts invariant, enforced OFFLINE by grepping source.
 *
 * The rule (CLAUDE.md + the accounts design): NOTHING is ever gated behind sign-in. Every content
 * page, search, and the ENTIRE /guide flow must work signed-out. Accounts are OPTIONAL, offered only
 * at the end of the guide's reading map (SaveMap) and on /account. /account itself, when signed-out,
 * must show a plain informational state — NEVER a redirect to sign-in.
 *
 * This script fails if any CONTENT / SEARCH / GUIDE route:
 *   (a) reads a server auth session (getServerSupabase) — a content route has no business gating on
 *       a session; OR
 *   (b) redirects an unauthenticated visitor anywhere (a redirect() call in a content route is the
 *       classic login-wall shape).
 *
 * Two routes are ALLOWED to read the session, and are checked for the STRICTER promise instead:
 *   • /account — MUST read the session (to list saved maps) but MUST NOT contain any redirect(): a
 *     signed-out visitor gets an informational state, not a bounce. We also require its signed-out
 *     informational copy is present.
 *   • the accounts + guide API routes and the /auth/* flow routes — these are not content pages; the
 *     API routes answer 401/503 JSON (never redirect on no-session), and the /auth flow routes are the
 *     sign-in machinery itself. They are excluded from the content sweep.
 *
 *   node scripts/check-no-auth-wall.mjs      # exit 1 on any wall.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const PAGES_DIR = 'src/pages';

// Routes that legitimately touch auth and are NOT part of the content/search/guide sweep.
// (Relative to src/pages, forward-slashed.)
const AUTH_FLOW = new Set(['auth/callback.ts', 'auth/signout.ts']);
const ACCOUNT_PAGE = 'account.astro';
// The accounts + AI API routes answer JSON (401/503), never redirect on no-session. Excluded from the
// content sweep (they are endpoints, not readable pages). The whole api/ tree is data, not content.
const isApiRoute = (rel) => rel.startsWith('api/');
// /go/* is a functional RETAIL redirect endpoint (CHK-B4; REDESIGN Step 9) — a 302 to a retailer is
// its whole purpose, NEVER a sign-in bounce. It touches no auth. Excluded from the content sweep like
// the API routes, and asserted below to read no server session so it can never become an auth wall.
const isRetailRedirect = (rel) => rel.startsWith('go/');

// The "auth guard" shapes a CONTENT route must never contain.
const SERVER_SESSION_RE = /getServerSupabase\s*\(/;
const REDIRECT_RE = /\bredirect\s*\(/;

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

// Recursively collect route files (.astro / .ts) under src/pages, returned as forward-slashed paths
// relative to src/pages.
async function collect(dir, base = '') {
  const out = [];
  for (const entry of await readdir(dir)) {
    const abs = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if ((await stat(abs)).isDirectory()) {
      out.push(...(await collect(abs, rel)));
    } else if (/\.(astro|ts)$/.test(entry)) {
      out.push(rel);
    }
  }
  return out;
}

console.log('no-auth-wall gate (CHK-6.9c) — no content/search/guide route gates on sign-in:');

const routes = await collect(PAGES_DIR);

// --- (1) content/search/guide routes must not read a session or redirect on auth -----------------
let contentChecked = 0;
for (const rel of routes) {
  if (AUTH_FLOW.has(rel) || rel === ACCOUNT_PAGE || isApiRoute(rel) || isRetailRedirect(rel)) continue;
  const src = await readFile(join(PAGES_DIR, rel), 'utf8');
  contentChecked++;
  check(!SERVER_SESSION_RE.test(src), `${rel}: does not read a server session (no auth gate)`);
  check(!REDIRECT_RE.test(src), `${rel}: does not redirect (no login-wall bounce)`);
}
check(contentChecked > 0, `swept ${contentChecked} content/search/guide routes`);

// Guard: the site's READING routes must exist and be in the sweep — belt-and-suspenders on the
// pages most likely to be walled by accident. This named `guide.astro` until CHK-B18 deleted the
// old presentation layer with it; the guarantee is about whatever pages actually carry the
// content, so it now names the greenfield ones. Every route below must be public, always.
for (const r of ['index.astro', 'safety.astro', 'search.astro', 'how-we-grade.astro'])
  check(routes.includes(r), `the /${r.replace(/(index)?\.astro$/, '')} route exists in the content sweep`);

// --- (2) /account: reads the session but is NEVER a redirect wall --------------------------------
const acctSrc = await readFile(join(PAGES_DIR, ACCOUNT_PAGE), 'utf8');
check(SERVER_SESSION_RE.test(acctSrc), '/account reads the session (to list saved maps)');
check(!REDIRECT_RE.test(acctSrc), '/account NEVER redirects — signed-out is an informational state');
check(/prerender\s*=\s*false/.test(acctSrc), '/account is server-rendered (prerender=false)');
check(
  /not signed in|You’re not signed in|You're not signed in/i.test(acctSrc),
  "/account has a plain “you're not signed in” informational state",
);
check(
  /aren’t enabled|aren't enabled|not enabled/i.test(acctSrc),
  '/account has an "accounts aren’t enabled yet" state when unconfigured',
);

// --- (3) the accounts API routes answer 401/503, never a redirect --------------------------------
for (const apiRel of ['api/save-map.ts', 'api/saved-maps.ts']) {
  if (!routes.includes(apiRel)) {
    check(false, `${apiRel}: expected accounts API route present`);
    continue;
  }
  const src = await readFile(join(PAGES_DIR, apiRel), 'utf8');
  check(!REDIRECT_RE.test(src), `${apiRel}: no redirect on no-session (answers JSON 401/503)`);
}

// --- (4) /go retail redirect: redirects BY DESIGN to a retailer, but must NEVER gate on a session --
for (const goRel of routes.filter(isRetailRedirect)) {
  const src = await readFile(join(PAGES_DIR, goRel), 'utf8');
  check(!SERVER_SESSION_RE.test(src), `${goRel}: reads no server session (retail redirect, not an auth gate)`);
}

// --- summary -------------------------------------------------------------------------------------
console.log('');
if (results.fail === 0) {
  console.log(`✓ no-auth-wall gate: ${results.pass} passed, 0 failed.`);
  process.exit(0);
} else {
  console.log(`✗ no-auth-wall gate: ${results.pass} passed, ${results.fail} failed.`);
  for (const f of results.failures) console.log(`   - ${f}`);
  process.exit(1);
}
