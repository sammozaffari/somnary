import assert from 'node:assert/strict';
import {
  normKey,
  sameText,
  parseQuantity,
  sameDose,
  outcomeKey,
  interactionClassKey,
  diffSets,
  compareGrade,
  effectSignal,
  uncertaintySame,
  orderedSections,
} from '../src/lib/compare-diff.ts';

let n = 0;
const t = (name, fn) => {
  fn();
  n += 1;
  console.log(`  ✓ ${name}`);
};

// --- Stage A: text normalisation ------------------------------------------------------------
t('the required timing case collapses as identical', () => {
  assert.equal(sameText('2-3 hours before bed', '2 to 3 hours before bedtime'), true);
});
t('en-dash range vs "to" range with decimals is identical', () => {
  assert.equal(sameText('0.5–5 mg', '0.5 to 5 mg'), true);
});
t('unit synonyms fold (µg == mcg == microgram)', () => {
  assert.equal(normKey('50 µg'), normKey('50 mcg'));
  assert.equal(normKey('50 micrograms'), normKey('50 mcg'));
});
t('filler words do not create a difference', () => {
  assert.equal(sameText('about 2 h before bed', '2 h before bed'), true);
});
t('genuinely different phrasing stays different', () => {
  assert.equal(sameText('evening, for circadian timing', '30-60 min before bed'), false);
});

// --- Stage B: numeric-range awareness -------------------------------------------------------
t('3 mg and 0.3 mg are NOT the same dose (number, not string)', () => {
  assert.equal(sameDose('3 mg', '0.3 mg'), false);
});
t('2 h and 2 hours ARE the same amount', () => {
  assert.equal(sameDose('2 h', '2 hours'), true);
});
t('range 0.5–5 mg parses lo/hi/unit', () => {
  assert.deepEqual(parseQuantity('0.5–5 mg'), { lo: 0.5, hi: 5, unit: 'mg' });
});
t('non-numeric timing falls back to text equality', () => {
  assert.equal(sameDose('evening', 'in the evening'), true);
});

// --- Stage C: set comparisons ---------------------------------------------------------------
t('outcome set diff reports shared + unique, order-independent', () => {
  const d = diffSets(['fall asleep faster', 'jet lag'], ['jet lag', 'stay asleep'], outcomeKey);
  assert.equal(d.same, false);
  assert.deepEqual(d.shared, ['jet lag']);
  assert.deepEqual(d.aOnly, ['fall asleep faster']);
  assert.deepEqual(d.bOnly, ['stay asleep']);
});
t('nine "sedatives/CNS depressant" phrasings collapse to ONE class', () => {
  const variants = [
    'Sedatives and CNS depressants (additive drowsiness)',
    'Alcohol and other sedatives / CNS depressants (additive drowsiness)',
    'CNS depressants such as alcohol, benzodiazepines, and sedating antihistamines (additive sedation)',
    'Sedatives, alcohol, and other CNS depressants — possible additive drowsiness',
  ];
  const keys = new Set(variants.map(interactionClassKey));
  assert.equal(keys.size, 1);
  assert.equal([...keys][0], 'cns-depressants');
});
t('warfarin phrasings map to anticoagulants', () => {
  assert.equal(interactionClassKey('Blood thinners such as warfarin (possible increased bleeding risk)'), 'anticoagulants');
  assert.equal(interactionClassKey('Anticoagulants and antiplatelets (warfarin, aspirin, clopidogrel)'), 'anticoagulants');
});
t('two remedies sharing only the CNS-depressant class are still "different" overall but share it', () => {
  const d = diffSets(
    ['Sedatives and CNS depressants (additive drowsiness)', 'Immunosuppressants'],
    ['Alcohol and other sedatives / CNS depressants (additive drowsiness)', 'Thyroid medications (may raise thyroid hormone levels; monitor)'],
    interactionClassKey,
  );
  assert.equal(d.shared.length, 1);
  assert.equal(d.same, false);
});

// --- grade + state constraint ---------------------------------------------------------------
const base = {
  format: 'supplement',
  outcomes: [],
  doses: [],
  notFor: [],
  biggestRisk: null,
  interactions: [],
  gates: [],
  category: 'mineral',
};
const ratifiedS = { ...base, slug: 'cbt-i', name: 'CBT-I', tier: 'S', workflowState: 'owner_ratified', epistemicState: 'established', rankingEligible: true };
const provisionalA = { ...base, slug: 'melatonin', name: 'Melatonin', tier: 'A', workflowState: 'unreviewed', epistemicState: 'established', rankingEligible: false };
const provisionalSameLetter = { ...base, slug: 'x', name: 'X', tier: 'S', workflowState: 'pending_signoff', epistemicState: 'provisional', rankingEligible: false };

t('same letter but provisional-vs-ratified flags a mismatch and is not "identical"', () => {
  const g = compareGrade(ratifiedS, provisionalSameLetter);
  assert.equal(g.sameLetter, true);
  assert.equal(g.provisionalMismatch, true);
  assert.match(g.whyItMatters, /aren't on equal footing|not on equal footing/);
  const sections = orderedSections(ratifiedS, provisionalSameLetter);
  const grade = sections.find((s) => s.id === 'grade');
  assert.equal(grade.state, 'different');
  assert.equal(grade.alwaysExpanded, true);
});
t('provisional grade why-line names both remedies', () => {
  const g = compareGrade(ratifiedS, provisionalA);
  assert.match(g.whyItMatters, /CBT-I/);
  assert.match(g.whyItMatters, /Melatonin/);
});

// --- effect signal --------------------------------------------------------------------------
t('effect signal reads from gates', () => {
  assert.equal(effectSignal({ ...base, gates: ['effect-size-reported'] }), 'reported');
  assert.equal(effectSignal({ ...base, gates: ['effect-size-small'] }), 'small');
  assert.equal(effectSignal({ ...base, gates: ['mechanism-only'] }), 'not-reported');
});

// --- section ordering + gated dimensions ----------------------------------------------------
t('safety/grade sections always lead and are alwaysExpanded', () => {
  const sections = orderedSections(ratifiedS, provisionalA);
  assert.deepEqual(sections.slice(0, 3).map((s) => s.id), ['grade', 'biggest-risk', 'interactions']);
  for (const s of sections.slice(0, 3)) assert.equal(s.alwaysExpanded, true);
});
t('studied-population and time-to-effect are always unrecorded (never claimed identical)', () => {
  const sections = orderedSections(ratifiedS, ratifiedS);
  assert.equal(sections.find((s) => s.id === 'studied-population').state, 'unrecorded');
  assert.equal(sections.find((s) => s.id === 'time-to-effect').state, 'unrecorded');
});
t('intervention vs supplement is a "different" form/protocol section', () => {
  const intervention = { ...ratifiedS, format: 'intervention', doses: [] };
  const supplement = { ...provisionalA, format: 'supplement', doses: [{ form: 'IR', studiedDose: '3 mg', timing: '30 min before bed' }] };
  const sections = orderedSections(intervention, supplement);
  assert.equal(sections.find((s) => s.id === 'form-protocol').state, 'different');
});
t('biggest risk missing on one side is "different", never identical', () => {
  const withRisk = { ...ratifiedS, biggestRisk: 'liver load at high doses' };
  const without = { ...provisionalA, biggestRisk: null };
  const sections = orderedSections(withRisk, without);
  assert.equal(sections.find((s) => s.id === 'biggest-risk').state, 'different');
});
t('uncertainty differs when epistemic state differs', () => {
  const established = { ...ratifiedS, epistemicState: 'established', gates: [] };
  const provisional = { ...provisionalA, epistemicState: 'provisional', gates: [] };
  assert.equal(uncertaintySame(established, provisional), false);
});

console.log(`\ncompare-diff: ${n} assertions passed`);
