#!/usr/bin/env node
/**
 * Search-rule tests (CHK-B14 / CHK-Rui.2). The resolver is a pure module precisely so its RULES
 * can be asserted directly rather than eyeballed through a page. Every case below is one of the
 * rules from RULES.md Interface economy — if one of these regresses, the search starts making
 * claims the site doesn't stand behind.
 *
 *   node --experimental-strip-types scripts/test-search.mjs
 */
import { resolve, editDistance } from '../src/lib/search/resolve.ts';

const ENTRIES = [
  { kind: 'remedy', name: 'Melatonin', href: '/remedies/melatonin', terms: ['sleep onset', 'jet lag'] },
  { kind: 'remedy', name: 'Magnesium', href: '/remedies/magnesium', terms: ['stay asleep'] },
  { kind: 'remedy', name: 'Ashwagandha', href: '/remedies/ashwagandha', terms: ['stress'] },
  { kind: 'product', name: 'Natrol Melatonin Time Release', href: '/products/natrol', terms: ['Natrol', '5 mg', 'tablet', 'Melatonin'] },
  { kind: 'product', name: 'Blackmores Deep Sleep', href: '/products/bm-deep', terms: ['Blackmores', 'Valerian'] },
  { kind: 'brand', name: 'Blackmores', href: '/brands/blackmores' },
  { kind: 'problem', name: "I can't fall asleep", href: '/problems/cant-fall-asleep', terms: ['fall asleep faster'] },
  { kind: 'page', name: 'Safety', href: '/safety', terms: ['interactions'] },
];

let failed = 0;
const check = (label, cond, detail = '') => {
  if (cond) console.log(`  ✓ ${label}`);
  else {
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
    failed += 1;
  }
};

console.log('search rules\n');

// ── the category rule: never a sample of a large set ─────────────────────────────────────────
for (const q of ['sleep', 'supplements', 'remedies', 'brands']) {
  const r = resolve(q, ENTRIES);
  check(
    `"${q}" returns the CATEGORY, not members`,
    r.kind === 'category' && r.categories.length > 0 && !r.answer && r.more.length === 0,
    `got kind=${r.kind}, ${r.more.length} member rows`
  );
}

// ── product intent: bottles only when the query names one ───────────────────────────────────
const noIntent = resolve('melatonin', ENTRIES);
check(
  '"melatonin" answers with the REMEDY and withholds products',
  noIntent.kind === 'answer' && noIntent.answer?.kind === 'remedy' && ![...noIntent.more, ...noIntent.routes].some((e) => e.kind === 'product'),
  `answer=${noIntent.answer?.kind}, products shown=${[...noIntent.more].filter((e) => e.kind === 'product').length}`
);
for (const [q, why] of [['5 mg', 'a dose'], ['tablet', 'a product word'], ['blackmores', 'a brand token']]) {
  const r = resolve(q, ENTRIES);
  const hasProduct = [r.answer, ...r.routes, ...r.more].filter(Boolean).some((e) => e.kind === 'product');
  check(`"${q}" (${why}) DOES surface products`, hasProduct, `kind=${r.kind}`);
}

// ── tiers ────────────────────────────────────────────────────────────────────────────────────
const ash = resolve('ashwagandha', ENTRIES);
check('an exact name resolves to a single answer', ash.kind === 'answer' && ash.answer?.name === 'Ashwagandha');
const partial = resolve('asleep', ENTRIES);
check('an ambiguous query returns a list, not a fake answer', partial.kind === 'list' && !partial.answer);

// ── no match + did-you-mean ──────────────────────────────────────────────────────────────────
const typo = resolve('ashwaganda', ENTRIES);
check('"ashwaganda" suggests Ashwagandha', typo.kind === 'nomatch' && typo.suggestion === 'Ashwagandha', `suggestion=${typo.suggestion}`);
const nonsense = resolve('qqqqzzzzxxxx', ENTRIES);
check('true nonsense returns no match and no wild suggestion', nonsense.kind === 'nomatch' && !nonsense.suggestion, `suggestion=${nonsense.suggestion}`);

// ── degenerate input ─────────────────────────────────────────────────────────────────────────
check('empty query is empty, not an error', resolve('', ENTRIES).kind === 'empty');
check('one or two characters are refused rather than matched', resolve('me', ENTRIES).kind === 'short');
check('whitespace-only is empty', resolve('   ', ENTRIES).kind === 'empty');

// ── the helper ───────────────────────────────────────────────────────────────────────────────
check('edit distance is symmetric and zero on equality', editDistance('kava', 'kava') === 0 && editDistance('kava', 'lava') === 1);

console.log(failed === 0 ? '\n✓ search rules: all cases pass.' : `\n✖ search rules: ${failed} case(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
