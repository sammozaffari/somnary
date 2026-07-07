#!/usr/bin/env node
/**
 * Fake-PMID regression test for the citation resolver (CHK-0.4 acceptance:
 * "tested with a deliberately fake PMID"). Proves the resolver actually FAILS on a
 * bad identifier — a gate you never see fail is a gate you can't trust.
 *
 * Writes two throwaway fixtures to a temp dir, points the resolver at each via
 * SOMNARY_CONTENT_DIR, and asserts:
 *   - a malformed PMID  → resolver exits non-zero (gate catches it)
 *   - a valid PMID      → resolver exits zero      (gate passes clean content)
 *
 *   node scripts/test-resolver.mjs      # exit 0 if the gate behaves; exit 1 otherwise.
 */
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const RESOLVER = join(process.cwd(), 'scripts', 'check-citations.mjs');

const fixture = (pmid) => `---
tier: A
name: fixture
oneLineVerdict: test
verdict: test
standardization: test
mechanism: test
reviewDate: '2026-07-06'
safety:
  severity: caution
  lead: test
  pregnancy: test
seo:
  questionTitle: test
sources:
  - n: 1
    title: test
    sourceLine: test
    finding: test
    type: rct
    pmid: '${pmid}'
---
body
`;

function runResolver(contentDir) {
  const res = spawnSync('node', [RESOLVER], {
    env: { ...process.env, SOMNARY_CONTENT_DIR: contentDir },
    encoding: 'utf8',
  });
  return res.status;
}

async function main() {
  const dir = await mkdtemp(join(tmpdir(), 'somnary-resolver-test-'));
  const fails = [];
  try {
    // 1 — deliberately fake (malformed, non-numeric) PMID must FAIL.
    await writeFile(join(dir, 'bad.mdx'), fixture('FAKE-123'));
    const badStatus = runResolver(dir);
    if (badStatus === 0) fails.push('resolver PASSED a malformed PMID "FAKE-123" — the gate is broken');

    // 2 — a well-formed PMID must PASS (format check only; offline).
    await rm(join(dir, 'bad.mdx'));
    await writeFile(join(dir, 'good.mdx'), fixture('23691095'));
    const goodStatus = runResolver(dir);
    if (goodStatus !== 0) fails.push(`resolver FAILED a valid PMID "23691095" (exit ${goodStatus}) — false positive`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  if (fails.length) {
    console.error('\n✖ resolver self-test FAILED:');
    for (const f of fails) console.error('   ' + f);
    console.error('');
    process.exit(1);
  }
  console.log('✓ resolver self-test: catches a fake PMID, passes a real one.');
}

main();
