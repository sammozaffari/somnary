#!/usr/bin/env node
/**
 * Product validation gate (CHK-B3; CLAUDE.md item-9 validation gates + RULES.md Products).
 * The Zod schema in content.config.ts is the primary validator (fails the build); this is the
 * standalone, greppable gate + the coverage report — mirroring check-source-fields.mjs's
 * `effectDataStatus: pending` report so the review queue is visible, not buried.
 *
 * FATAL (exit 1) on any of:
 *   - a product `name` containing a dose/strength pattern (strength is the structured field);
 *   - a `deliveryForm` outside the controlled vocabulary (a miss must be null + needs-review);
 *   - deliveryForm/formStatus honesty mismatch;
 *   - a non-neutral excipient flag with no source id;
 *   - assessment_state 'fully assessed' with an unresolved visible check;
 *   - a combined product+bucket number leaking into product data (there is no such field).
 *
 *   node scripts/check-products.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'src/content/products';
const VOCAB = new Set(['tablet', 'capsule', 'softgel', 'gummy', 'melt-lozenge', 'liquid-drops', 'spray', 'tea', 'powder', 'patch']);
const STATES = new Set(['fully assessed', 'label known, not yet assessed', 'not in database']);
const DOSE_IN_NAME = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|iu|ml)\b/i;

let files = [];
try {
  files = (await readdir(DIR)).filter((f) => f.endsWith('.json'));
} catch {
  console.log('✓ product gate: no products collection yet (nothing to check).');
  process.exit(0);
}

const fails = [];
const stateCounts = {};
let needsReview = 0;

for (const f of files) {
  const p = JSON.parse(await readFile(join(DIR, f), 'utf8'));
  const at = (msg) => fails.push(`${f}: ${msg}`);

  if (DOSE_IN_NAME.test(p.name || '')) at(`name "${p.name}" contains a dose/strength — strength is the structured { amount, unit } field`);
  if (p.deliveryForm != null && !VOCAB.has(p.deliveryForm)) at(`deliveryForm "${p.deliveryForm}" is not in the controlled vocabulary`);
  if (p.deliveryForm == null && p.formStatus !== 'needs-review') at('deliveryForm is null but formStatus is not "needs-review"');
  if (p.deliveryForm != null && p.formStatus !== 'mapped') at('deliveryForm is set but formStatus is not "mapped"');
  if (!STATES.has(p.assessment_state)) at(`assessment_state "${p.assessment_state}" is not a known state`);

  for (const e of p.excipients || []) {
    if (e.flag && e.flag !== 'no-known-concern' && !e.source) at(`excipient "${e.name}" has a non-neutral flag (${e.flag}) but no source id`);
  }

  if (p.assessment_state === 'fully assessed') {
    const unresolved = ['dose_match', 'label_discloses_all', 'form_matches_studied'].filter((k) => p[k] === null || p[k] === undefined);
    if (unresolved.length) at(`assessment_state 'fully assessed' but unresolved checks: ${unresolved.join(', ')}`);
  }

  // three separate signals — a product must not carry a merged bucket/score number (RULES.md).
  for (const banned of ['grade', 'tier', 'overallScore', 'combinedScore', 'productGrade']) {
    if (banned in p) at(`carries "${banned}" — the ingredient bucket and product score are separate axes, never merged`);
  }

  stateCounts[p.assessment_state] = (stateCounts[p.assessment_state] || 0) + 1;
  if (p.deliveryForm == null) needsReview++;
}

if (fails.length) {
  console.error(`\n✖ product gate: ${fails.length} error(s)\n`);
  for (const x of fails) console.error('   ' + x);
  process.exit(1);
}

const stateLine = Object.entries(stateCounts).map(([k, v]) => `${v} ${k}`).join(' · ');
console.log(`✓ product gate: ${files.length} products valid · ${stateLine} · ${needsReview} deliveryForm needs-review`);
