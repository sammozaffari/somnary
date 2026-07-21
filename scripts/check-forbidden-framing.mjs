#!/usr/bin/env node
/**
 * Forbidden-framing lint (CHK-6.3) — guards the assistant's SHIPPED copy against the rulebook's
 * forbidden AI framings (docs/strategy/06 lines ~120–126: "take X tonight", "your ideal dose",
 * "this is safe for you", "combine these", "you probably have <condition>").
 *
 *   node scripts/check-forbidden-framing.mjs            # scan shipped copy; exit 1 on any hit.
 *   node scripts/check-forbidden-framing.mjs --selftest # prove the lint CATCHES a seeded bad string.
 *
 * Patterns are imported from src/lib/ask/guardrails.ts (FORBIDDEN_FRAMINGS) so the lint and the
 * engine's runtime output-check share ONE definition. Lines that must quote a forbidden phrase in
 * order to teach/refuse it (the system prompt's negative examples) are exempted with the sentinel
 * `FRAMING-LINT-OK` — an explicit, visible allow-list, never a silent skip.
 */
import { readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const SENTINEL = 'FRAMING-LINT-OK';

// Shipped, user-facing copy (NOT the adversarial test fixtures, which contain deliberate
// bad strings as inputs to prove the runtime downgrade). ALL components are scanned — surface
// redesigns move grade/verdict language into new components (e.g. the 2026-07-15 plate-card
// stamp), and those must be CI-covered, not manually reviewed.
const TARGETS = [
  'src/lib/ask/guardrails.ts',
  'src/lib/ask/prompt.ts',
  // Guide concierge (CHK-6.8a): the router copy, prompt, schema (NEUTRAL_ACK), engine, and topic-fence
  // all ship model-adjacent prose — every forbidden framing in them must be an intentional, sentinel-
  // tagged negative example, never live copy.
  ...(await readdir(join(ROOT, 'src/lib/guide')))
    .filter((f) => f.endsWith('.ts'))
    .sort()
    .map((f) => `src/lib/guide/${f}`),
  // Somnary Lens engine (CHK-7.1): the extraction + refute prompts ship model-adjacent prose. Every
  // forbidden framing in them must be an intentional, sentinel-tagged negative example, never live
  // copy — the same bar as the guide's prompt.
  ...(await readdir(join(ROOT, 'src/lib/lens')))
    .filter((f) => f.endsWith('.ts'))
    .sort()
    .map((f) => `src/lib/lens/${f}`),
  ...(await readdir(join(ROOT, 'src/components')))
    .filter((f) => f.endsWith('.astro'))
    .sort()
    .map((f) => `src/components/${f}`),
  // Somnary Lens UI pages (CHK-7.2): the flagship /lens shell and the /request-a-review page ship
  // product-boundary prose next to a live AI surface — every forbidden framing in them must be an
  // intentional, sentinel-tagged negative example, never live copy (same bar as the /guide shell copy).
  'src/pages/lens.astro',
  'src/pages/request-a-review.astro',
];

async function loadPatterns() {
  const mod = await import(pathToFileURL(join(ROOT, 'src/lib/ask/guardrails.ts')).href);
  return mod.FORBIDDEN_FRAMINGS;
}

function scanText(text, patterns) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    if (line.includes(SENTINEL)) return;
    for (const p of patterns) {
      if (p.re.test(line)) hits.push({ line: i + 1, label: p.label, text: line.trim().slice(0, 90) });
    }
  });
  return hits;
}

async function scanFile(rel, patterns) {
  const text = await readFile(join(ROOT, rel), 'utf8');
  return scanText(text, patterns).map((h) => ({ ...h, file: rel }));
}

async function selftest(patterns) {
  const tmp = join(ROOT, `.framing-selftest-${Date.now()}.txt`);
  // A deliberately forbidden instruction with NO sentinel — the lint MUST catch it.
  await writeFile(tmp, 'Your ideal dose is 5mg, so take melatonin tonight.\n');
  try {
    const hits = scanText(await readFile(tmp, 'utf8'), patterns);
    if (hits.length === 0) {
      console.error('✖ forbidden-framing self-test FAILED: seeded bad string was NOT caught — the lint is broken.');
      process.exit(1);
    }
    console.log(`✓ forbidden-framing self-test: seeded bad string caught (${hits.map((h) => h.label).join(', ')}).`);
  } finally {
    await rm(tmp, { force: true });
  }
}

async function main() {
  const patterns = await loadPatterns();
  if (process.argv.includes('--selftest')) {
    await selftest(patterns);
    return;
  }
  const all = [];
  for (const t of TARGETS) all.push(...(await scanFile(t, patterns)));
  if (all.length) {
    console.error(`\n✖ forbidden-framing lint: ${all.length} hit(s) in shipped assistant copy:\n`);
    for (const h of all) console.error(`   • ${h.file}:${h.line}  ${h.label} — ${h.text}`);
    console.error('\nRephrase, or mark an intentional negative example with the FRAMING-LINT-OK sentinel.\n');
    process.exit(1);
  }
  console.log(`✓ forbidden-framing lint: ${TARGETS.length} shipped file(s) clean (no forbidden framings).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
