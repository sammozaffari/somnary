import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import {
  isArchival,
  isDefaultRankingEligible,
  isOrdinarySearchEligible,
  publicationStateProjection,
} from '../src/lib/remedy-state.ts';

const root = new URL('..', import.meta.url).pathname;
const remediesDir = join(root, 'src/content/remedies');
const files = readdirSync(remediesDir).filter((file) => file.endsWith('.mdx')).sort();
const records = files.map((file) => ({
  slug: file.replace(/\.mdx$/, ''),
  ...matter(readFileSync(join(remediesDir, file), 'utf8')).data,
}));

assert.equal(records.length, 31, 'expected the complete 31-remedy corpus');
for (const record of records) {
  assert.ok(record.workflowState, `${record.slug} is missing workflowState`);
  assert.ok(record.epistemicState, `${record.slug} is missing epistemicState`);
  assert.ok(record.freshnessState, `${record.slug} is missing freshnessState`);
  assert.ok(record.validFrom, `${record.slug} is missing validFrom`);
  const projected = publicationStateProjection(record);
  assert.deepEqual(Object.keys(projected).sort(), [
    'epistemicState',
    'freshnessState',
    'workflowState',
  ]);
}

const provisional = {
  workflowState: 'pending_signoff',
  epistemicState: 'provisional',
  freshnessState: 'current',
};
assert.equal(
  isDefaultRankingEligible(provisional),
  false,
  'an unratified grade must not enter a default ranking',
);

const superseded = {
  workflowState: 'owner_ratified',
  epistemicState: 'established',
  freshnessState: 'superseded',
  supersededBy: 'replacement',
};
assert.equal(isDefaultRankingEligible(superseded), false);
assert.equal(isOrdinarySearchEligible(superseded), false);
assert.equal(isArchival(superseded), true);
assert.equal(superseded.supersededBy, 'replacement', 'archival records retain a successor link');

if (process.argv.includes('--dist')) {
  const indexPath = join(root, 'dist/client/search-index.json');
  assert.ok(existsSync(indexPath), 'build output is missing search-index.json');
  const docs = JSON.parse(readFileSync(indexPath, 'utf8'));
  const remedyDocs = docs.filter((doc) => doc.kind === 'remedy');
  assert.ok(remedyDocs.length > 0, 'search index has no remedy documents');
  for (const doc of remedyDocs) {
    assert.ok(doc.workflowState, `${doc.slug} search document is missing workflowState`);
    assert.ok(doc.epistemicState, `${doc.slug} search document is missing epistemicState`);
    assert.ok(doc.freshnessState, `${doc.slug} search document is missing freshnessState`);
  }
}

console.log(`✓ publication states: ${records.length} explicit remedy records`);
