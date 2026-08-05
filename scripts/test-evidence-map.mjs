import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  placeOnMap,
  EVIDENCE_BAND_LABELS,
  SAFETY_BAND_LABELS,
  SAFETY_INTERACTION_THRESHOLD,
} from '../src/lib/evidence-map.ts';
import { isDefaultRankingEligible, isOrdinarySearchEligible } from '../src/lib/remedy-state.ts';

const root = new URL('..', import.meta.url).pathname;
const remediesDir = join(root, 'src/content/remedies');
const files = readdirSync(remediesDir).filter((file) => file.endsWith('.mdx')).sort();
const records = files.map((file) => ({
  slug: file.replace(/\.mdx$/, ''),
  ...matter(readFileSync(join(remediesDir, file), 'utf8')).data,
}));

assert.equal(records.length, 31, 'expected the complete 31-remedy corpus');

// Label arrays index directly by band → must match the band cardinalities.
assert.equal(EVIDENCE_BAND_LABELS.length, 5, 'evidence axis has 5 bands (x0..x4)');
assert.equal(SAFETY_BAND_LABELS.length, 3, 'safety axis has 3 bands (y0..y2)');
assert.equal(SAFETY_INTERACTION_THRESHOLD, 3, 'documented display threshold');

// Deterministic banding invariants (weak-labeled-weak: tier drives X, no round-up).
const TIER_TO_X = { F: 0, D: 1, C: 2, B: 3, A: 4, S: 4 };

const onMap = records.filter((r) => !r.draft && isOrdinarySearchEligible(r));
assert.equal(onMap.length, 31, 'all 31 remedies are ordinary-search-eligible (none withdrawn/superseded)');

const seriousSlugs = [];
const bandTally = { x: [0, 0, 0, 0, 0], y: [0, 0, 0] };
for (const r of onMap) {
  const severity = r.safety?.severity;
  const interactionCount = Array.isArray(r.safety?.interactions) ? r.safety.interactions.length : 0;
  assert.ok(severity === 'caution' || severity === 'serious', `${r.slug}: safety.severity present`);

  const { evidenceBand, safetyBand } = placeOnMap({ tier: r.tier, severity, interactionCount });

  assert.equal(evidenceBand, TIER_TO_X[r.tier], `${r.slug}: tier ${r.tier} → x${TIER_TO_X[r.tier]}`);
  assert.ok(evidenceBand >= 0 && evidenceBand <= 4, `${r.slug}: evidenceBand in range`);
  assert.ok(safetyBand >= 0 && safetyBand <= 2, `${r.slug}: safetyBand in range`);

  if (severity === 'serious') {
    assert.equal(safetyBand, 2, `${r.slug}: serious severity → y2 regardless of interactions`);
    seriousSlugs.push(r.slug);
  } else if (interactionCount >= SAFETY_INTERACTION_THRESHOLD) {
    assert.equal(safetyBand, 1, `${r.slug}: caution + ≥${SAFETY_INTERACTION_THRESHOLD} interactions → y1`);
  } else {
    assert.equal(safetyBand, 0, `${r.slug}: caution + <${SAFETY_INTERACTION_THRESHOLD} interactions → y0`);
  }

  bandTally.x[evidenceBand]++;
  bandTally.y[safetyBand]++;
}

// The four known serious-safety remedies must all land in the top row.
assert.deepEqual(
  seriousSlugs.sort(),
  ['5-htp', 'iron', 'kava', 'reishi'],
  'serious-severity set is the expected four remedies',
);

// The ratified/under-review split the map must preserve: exactly 2 ratified today.
const ratified = onMap.filter((r) => isDefaultRankingEligible(r));
assert.equal(ratified.length, 2, 'exactly 2 owner-ratified remedies enter the solid treatment');
assert.deepEqual(
  ratified.map((r) => r.slug).sort(),
  ['lemon-verbena', 'taurine'],
  'ratified pair is lemon-verbena + taurine',
);
assert.equal(onMap.length - ratified.length, 29, 'the other 29 render as under-review nodes');

console.log(
  `✓ evidence map: ${onMap.length} placements · X ${bandTally.x.join('/')} · Y ${bandTally.y.join('/')} · ` +
    `${ratified.length} ratified / ${onMap.length - ratified.length} under review`,
);
