import assert from 'node:assert/strict';
import { checkLabelState, createLoadedIndex } from '../src/lib/label-rules.ts';

const entries = [
  {
    slug: 'melatonin',
    url: '/r/melatonin',
    name: 'Melatonin',
    aliases: [],
    keyCompound: 'Melatonin',
    category: 'hormone',
    isBotanical: false,
    studiedDoseText: '0.3–0.5 mg',
    studiedDoseFloorMg: 0.3,
    interactions: ['sedatives; anticoagulants'],
    tier: 'B',
  },
  {
    slug: 'magnesium',
    url: '/r/magnesium',
    name: 'Magnesium',
    aliases: [],
    keyCompound: 'Elemental magnesium',
    category: 'mineral',
    isBotanical: false,
    studiedDoseText: '≈250–450 mg elemental daily',
    studiedDoseFloorMg: 250,
    interactions: [],
    tier: 'B',
  },
];

assert.equal(createLoadedIndex([]), null, 'an empty index must be unavailable');
assert.equal(createLoadedIndex([{ slug: 'broken' }]), null, 'a malformed index must be unavailable');

const index = createLoadedIndex(entries);
assert.ok(index, 'valid fixture should produce a branded loaded index');

const control = checkLabelState('Melatonin 20 mg', index);
assert.equal(control.kind, 'flags_found');
assert.deepEqual(
  control.kind === 'flags_found' ? control.flags.map((flag) => flag.rule) : [],
  ['R2', 'R5'],
  'control must return R2 and R5',
);
assert.equal(control.kind === 'flags_found' ? control.index : null, index, 'result must retain its loaded index');

const partial = checkLabelState('Melatonin 20 mg\nMoon Root 10 mg', index);
assert.equal(partial.kind, 'partial');
assert.deepEqual(partial.kind === 'partial' ? partial.unrecognised : [], ['Moon Root']);
assert.deepEqual(partial.kind === 'partial' ? partial.flags.map((flag) => flag.rule) : [], ['R2', 'R5']);

const blendOnly = checkLabelState('Proprietary blend 500 mg', index);
assert.equal(blendOnly.kind, 'flags_found');
assert.deepEqual(blendOnly.kind === 'flags_found' ? blendOnly.flags.map((flag) => flag.rule) : [], ['R1']);

assert.equal(checkLabelState('Moon Root 10 mg', index).kind, 'unrecognised');
assert.equal(checkLabelState('', index).kind, 'idle');
assert.equal(checkLabelState('   \n\t', index).kind, 'idle');
assert.equal(checkLabelState('!!!', index).kind, 'parse_failed');
assert.equal(
  checkLabelState('Melatonin 20 mg', index, () => {
    throw new Error('injected parser failure');
  }).kind,
  'parse_failed',
);

const longInput = `Melatonin 20 mg\n${'Moon Root 10 mg\n'.repeat(5_000)}`;
assert.equal(checkLabelState(longInput, index).kind, 'partial');

console.log('label-checker state tests passed');
