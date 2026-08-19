// The ONE search index (CHK-B14). Every searchable thing on the site is built here, from the
// collections themselves — so a new remedy, product or brand is searchable the moment it exists
// and nothing has to be kept in sync by hand.
//
// RULES.md: nothing in this index carries a price, a retailer, or any commercial signal, and
// nothing is weighted by one. The `meta` line on each entry states a fact about the thing
// (its state, its brand, its ingredient) and never a rating.
import { getCollection } from 'astro:content';
import type { Entry } from './resolve.ts';
import { PROBLEMS } from '../problems/index.ts';
import { completeness, verdictState, VERDICTS } from '../products/score.ts';
import { studyCounts } from '../remedy/derive.ts';

export async function buildIndex(): Promise<Entry[]> {
  const [remedies, products, brands] = await Promise.all([
    getCollection('remedies'),
    getCollection('products'),
    getCollection('brands'),
  ]);
  const live = remedies.filter((r) => !r.data.draft);
  const remedyName = new Map(live.map((r) => [r.id, r.data.displayName]));

  const entries: Entry[] = [];

  for (const r of live) {
    const c = studyCounts(r.data.sources);
    entries.push({
      kind: 'remedy',
      name: r.data.displayName,
      href: `/remedies/${r.id}`,
      // aliases and latin names are what people actually type
      terms: [r.data.name, ...r.data.aliases, ...r.data.outcomes, ...r.data.symptoms],
      // the honest state, never a grade we haven't ratified
      meta: r.data.bucket
        ? undefined
        : c.triaged
          ? `Grade in review · ${c.cited} ${c.cited === 1 ? 'paper' : 'papers'}`
          : `Grade in review · ${c.cited} ${c.cited === 1 ? 'paper' : 'papers'}, still checking`,
    });
  }

  for (const p of products) {
    const state = completeness(p.data);
    const v = state === 'assessed' ? verdictState(p.data) : null;
    entries.push({
      kind: 'product',
      name: `${p.data.brand} ${p.data.name}`,
      href: `/products/${p.id}`,
      terms: [
        p.data.name,
        p.data.brand,
        p.data.strength ? `${p.data.strength.amount}${p.data.strength.unit}` : '',
        p.data.strength ? `${p.data.strength.amount} ${p.data.strength.unit}` : '',
        p.data.deliveryForm ?? '',
        ...p.data.ingredients.map((i) => remedyName.get(i.remedy_id) ?? i.remedy_id),
      ].filter(Boolean),
      meta: v ? VERDICTS[v].pill : state === 'label-known' ? 'Not yet assessed' : 'Not in our database',
    });
  }

  for (const b of brands) {
    entries.push({
      kind: 'brand',
      name: b.data.name,
      href: `/brands/${b.data.slug}`,
      meta: `${b.data.product_list.length} ${b.data.product_list.length === 1 ? 'product' : 'products'}`,
    });
  }

  for (const pr of PROBLEMS) {
    entries.push({ kind: 'problem', name: pr.title, href: `/problems/${pr.slug}`, terms: [pr.outcome] });
  }

  // the standing pages people search for by name
  entries.push(
    { kind: 'page', name: 'Safety', href: '/safety', terms: ['interactions', 'pregnancy', 'children', 'medication', 'risk'] },
    { kind: 'page', name: 'How we grade', href: '/how-we-grade', terms: ['evidence', 'grades', 'buckets', 'checks', 'method', 'methodology'] }
  );

  return entries;
}
