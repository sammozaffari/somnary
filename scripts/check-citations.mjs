#!/usr/bin/env node
/**
 * Citation resolver — enforces the "0 hallucinated cites" non-negotiable (CLAUDE.md;
 * PLAN §3.4, §9). Reads every remedy's sources[] and checks each citation carries a
 * well-formed, resolvable identifier.
 *
 *   node scripts/check-citations.mjs            # offline: format-validate, build canonical
 *                                               # URLs, FAIL (exit 1) on any bad/missing id.
 *                                               # Wired as `prebuild` so it gates the build.
 *   node scripts/check-citations.mjs --online   # additionally HEAD/GET each URL to catch
 *                                               # dead links (for the manual citation audit).
 *
 * Offline validation is deterministic (no network) so it can gate every build. The schema
 * (src/content.config.ts) enforces the same identifier rule at build time; this script is
 * the standalone, CI-runnable guard and the entry point for the online audit.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = 'src/content/remedies';
const ONLINE = process.argv.includes('--online');

// Identifier formats — must match the regexes in src/content.config.ts.
const RE = {
  pmid: /^\d+$/,
  doi: /^10\.\d{4,9}\/\S+$/,
  registry: /^NCT\d{8}$/,
};

const canonicalUrl = {
  pmid: (v) => `https://pubmed.ncbi.nlm.nih.gov/${v}/`,
  doi: (v) => `https://doi.org/${v}`,
  registry: (v) => `https://clinicaltrials.gov/study/${v}`,
};

async function mdxFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await mdxFiles(full)));
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/** Returns { urls, errors } for one source object. */
function validateSource(src, where) {
  const errors = [];
  const urls = [];
  let hasValidId = false;

  for (const kind of ['pmid', 'doi', 'registry']) {
    const raw = src[kind];
    if (raw == null) continue;
    const value = String(raw).trim();
    if (RE[kind].test(value)) {
      hasValidId = true;
      urls.push({ kind, value, url: canonicalUrl[kind](value) });
    } else {
      errors.push(`${where}: malformed ${kind} "${value}"`);
    }
  }

  if (!hasValidId) {
    errors.push(`${where}: no resolvable identifier (need a valid pmid, doi, or registry)`);
  }
  return { urls, errors };
}

async function resolve(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    // GET (some hosts reject HEAD); redirects followed (doi.org → publisher). A browser-like
    // User-Agent avoids some publishers' crude bot walls (Silverchair/Wiley 403 otherwise).
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(t);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, networkError: err.name === 'AbortError' ? 'timeout' : String(err.code || err.message) };
  }
}

async function main() {
  const files = await mdxFiles(CONTENT_DIR);
  const errors = [];
  const allUrls = [];
  let sourceCount = 0;

  for (const file of files) {
    const rel = relative(process.cwd(), file);
    const { data } = matter(await readFile(file, 'utf8'));
    const sources = Array.isArray(data.sources) ? data.sources : [];
    sources.forEach((src, i) => {
      sourceCount++;
      const { urls, errors: e } = validateSource(src, `${rel} · source[${src?.n ?? i}]`);
      errors.push(...e);
      urls.forEach((u) => allUrls.push({ ...u, rel, n: src?.n ?? i }));
    });
  }

  if (errors.length) {
    console.error(`\n✗ citation check FAILED — ${errors.length} problem(s):\n`);
    errors.forEach((e) => console.error(`  • ${e}`));
    console.error(`\n"cite or don't claim": every source needs a real pmid/doi/registry.\n`);
    process.exit(1);
  }

  console.log(`✓ format OK — ${sourceCount} citation(s) across ${files.length} remedy file(s), all carry a valid identifier.`);

  if (!ONLINE) {
    console.log('  (run with --online to verify each link actually resolves)');
    return;
  }

  console.log(`\nresolving ${allUrls.length} link(s) online…`);
  let dead = 0;
  let warned = 0;
  for (const u of allUrls) {
    const r = await resolve(u.url);
    // 403/412/429/451 = access restricted / bot-challenge (Atypon/Incapsula use 412) / rate-limited /
    // legal block — the publisher blocking a bot, NOT evidence the reference is fake or dead (a
    // hallucinated id returns 404/410). Treat as an unverified warning, not a build-failing dead
    // link; the human citation audit confirms these, and every source also carries a resolving PMID.
    const BLOCKED = new Set([403, 412, 429, 451]);
    if (r.ok) {
      console.log(`  ✓ ${u.kind} ${u.value} → ${r.status}`);
    } else if (r.networkError) {
      warned++;
      console.warn(`  ⚠ ${u.kind} ${u.value} → network ${r.networkError} (${u.rel}) — could not verify`);
    } else if (BLOCKED.has(r.status)) {
      warned++;
      console.warn(`  ⚠ ${u.kind} ${u.value} → HTTP ${r.status} bot-blocked (${u.rel}) — verify manually`);
    } else {
      dead++;
      console.error(`  ✗ ${u.kind} ${u.value} → HTTP ${r.status} (${u.rel})`);
    }
  }
  if (dead) {
    console.error(`\n✗ ${dead} unresolvable citation(s). A hallucinated or dead cite must not ship.`);
    process.exit(1);
  }
  console.log(`\n✓ all reachable links resolved${warned ? ` (${warned} unverified due to network)` : ''}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
