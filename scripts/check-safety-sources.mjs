#!/usr/bin/env node
/**
 * Safety-source gate (CHK-B10, the interim form of the CLAUDE.md item-9 check
 * "NO safety string ships without a source id").
 *
 * THE FINAL RULE is absolute: every safety string carries a source id. The corpus cannot meet
 * that today — it is CHK-E3's job — and a gate that fails the build on a known backlog just gets
 * disabled, which is worse than no gate. So this ships as a RATCHET:
 *
 *   · it FAILS if sourced coverage drops below the recorded baseline, and
 *   · it FAILS if the number of unsourced safety strings grows.
 *
 * That makes the backlog impossible to enlarge while E3 works it down, and every improvement
 * tightens the ratchet (the script tells you to raise the baseline when you beat it). When
 * coverage reaches 100%, replace the baseline with a hard `unsourced === 0` assertion and delete
 * this comment — the interim form has done its job.
 *
 * NOTE ON `pregnancy`: the schema gives that field no source of its own, so it cannot be gated
 * here and must not be published as a claim anywhere. /safety deliberately does not render it.
 *
 *   node scripts/check-safety-sources.mjs            # ratchet check (wired into verify)
 *   node scripts/check-safety-sources.mjs --report   # print per-remedy coverage
 */
import { readdir, readFile } from 'node:fs/promises';

const DIR = process.env.SOMNARY_CONTENT_DIR ?? 'src/content/remedies';

// ── THE BASELINE — raise these when coverage improves; never lower them ──────────────────────
// Recorded 19 August 2026 from the corpus as it stands. `maxUnsourced` is the ceiling: the
// number of safety strings still waiting on a source. It may only go down.
const BASELINE = {
  minSourcedRisks: 36,
  minSourcedInteractionLists: 9,
  maxUnsourcedRisks: 49,
  maxUnsourcedInteractionLists: 21,
};

const files = (await readdir(DIR)).filter((f) => f.endsWith('.mdx'));
let sourcedRisks = 0;
let unsourcedRisks = 0;
let sourcedInter = 0;
let unsourcedInter = 0;
const detail = [];

for (const f of files) {
  const fm = (await readFile(`${DIR}/${f}`, 'utf8')).split(/^---$/m)[1] ?? '';
  const slug = f.replace(/\.mdx$/, '');

  // risk rows: each "- category:" block, and whether its `sources:` list is non-empty
  const blocks = fm.split(/\n(?=\s*- category: )/).slice(1);
  let rs = 0;
  let ru = 0;
  for (const b of blocks) {
    const m = b.match(/sources:\s*\[([^\]]*)\]/);
    if (m && m[1].trim() !== '') rs += 1;
    else ru += 1;
  }

  const hasInteractions = /^ {2}interactions:\n\s+- /m.test(fm);
  const interSrc = (fm.match(/interactionsSources:\s*\[([^\]]*)\]/) || [, ''])[1].trim();
  const iS = hasInteractions && interSrc !== '' ? 1 : 0;
  const iU = hasInteractions && interSrc === '' ? 1 : 0;

  sourcedRisks += rs;
  unsourcedRisks += ru;
  sourcedInter += iS;
  unsourcedInter += iU;
  if (ru > 0 || iU > 0) detail.push({ slug, unsourcedRisks: ru, unsourcedInteractions: iU });
}

const report = process.argv.includes('--report');
console.log(
  `SAFETY SOURCE COVERAGE · ${files.length} remedies\n` +
    `  risk notes:        ${sourcedRisks} sourced · ${unsourcedRisks} awaiting a source\n` +
    `  interaction lists: ${sourcedInter} sourced · ${unsourcedInter} awaiting a source`
);
if (report) {
  console.log('\n  still to source (CHK-E3):');
  for (const d of detail.sort((a, b) => b.unsourcedRisks - a.unsourcedRisks))
    console.log(`    ${d.slug.padEnd(18)} ${d.unsourcedRisks} risk note(s)${d.unsourcedInteractions ? ' · interactions' : ''}`);
}

const failures = [];
if (sourcedRisks < BASELINE.minSourcedRisks)
  failures.push(`sourced risk notes fell to ${sourcedRisks} (baseline ${BASELINE.minSourcedRisks})`);
if (sourcedInter < BASELINE.minSourcedInteractionLists)
  failures.push(`sourced interaction lists fell to ${sourcedInter} (baseline ${BASELINE.minSourcedInteractionLists})`);
if (unsourcedRisks > BASELINE.maxUnsourcedRisks)
  failures.push(`unsourced risk notes grew to ${unsourcedRisks} (ceiling ${BASELINE.maxUnsourcedRisks}) — a new safety string shipped without a source id`);
if (unsourcedInter > BASELINE.maxUnsourcedInteractionLists)
  failures.push(`unsourced interaction lists grew to ${unsourcedInter} (ceiling ${BASELINE.maxUnsourcedInteractionLists}) — a new safety string shipped without a source id`);

if (failures.length) {
  console.error('\n✖ safety-source gate:');
  for (const f of failures) console.error(`   ${f}`);
  console.error('\nEvery safety string must cite the paper behind it (CLAUDE.md item-9).');
  process.exit(1);
}

const beat =
  sourcedRisks > BASELINE.minSourcedRisks ||
  sourcedInter > BASELINE.minSourcedInteractionLists ||
  unsourcedRisks < BASELINE.maxUnsourcedRisks ||
  unsourcedInter < BASELINE.maxUnsourcedInteractionLists;
console.log(
  beat
    ? '\n✓ safety-source gate: coverage IMPROVED on the baseline — raise BASELINE in scripts/check-safety-sources.mjs to lock the gain in.'
    : '\n✓ safety-source gate: coverage holds at the baseline; no unsourced safety string was added.'
);
