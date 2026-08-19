// Search resolution (CHK-B14 / CHK-Rui.2). A PURE module — no Astro, no collections, no DOM —
// so the rules can be tested directly (scripts/test-search.mjs) instead of only through a page.
//
// THE RULES THIS IMPLEMENTS, from RULES.md Interface economy and CHK-Rui.2:
//  · Three tiers: ANSWER (the query resolves to one thing) → ROUTES (where else to go) →
//    MORE (everything else that matched, collapsed).
//  · **Never show an arbitrary subset of a large set.** A category query ("sleep", "supplements")
//    returns THE CATEGORY — a count and a browse route — never a handful of its members. Showing
//    six of thirty-one remedies would invent a ranking the site does not have.
//  · Product rows appear ONLY on a product-intent query — one that names a brand, a dose, or a
//    product word. Otherwise a search for an ingredient would bury its remedy page under bottles.
//  · No match gets a did-you-mean by edit distance ("ashwaganda", "melatonine" are constant).
//  · Nothing is ever ordered by anything commercial. There is no price, retailer or brand
//    relationship anywhere in this file.

export type EntryKind = 'remedy' | 'product' | 'brand' | 'problem' | 'page';

export interface Entry {
  kind: EntryKind;
  /** what the reader sees */
  name: string;
  href: string;
  /** extra searchable text: aliases, outcomes, brand names, ingredient names */
  terms?: string[];
  /** the right-hand meta line on a result row */
  meta?: string;
}

export interface Resolution {
  query: string;
  kind: 'empty' | 'short' | 'category' | 'answer' | 'list' | 'nomatch';
  /** tier 1 — the single thing the query resolved to */
  answer?: Entry;
  /** tier 2 — where else to go from here */
  routes: Entry[];
  /** tier 3 — everything else that matched */
  more: Entry[];
  /** category queries: the count row + browse route, never members */
  categories: { label: string; count: number; href: string }[];
  /** no-match only */
  suggestion?: string;
}

/** Queries that name a whole category rather than a thing in it. */
const CATEGORY_TERMS = [
  'sleep', 'insomnia', 'remedy', 'remedies', 'supplement', 'supplements', 'natural',
  'product', 'products', 'brand', 'brands', 'vitamin', 'vitamins', 'herb', 'herbs',
  'sleeping pill', 'sleeping pills', 'sleep aid', 'sleep aids',
];

/** Words that mean the reader is looking at a bottle, not an ingredient. */
const PRODUCT_WORDS = [
  'gummy', 'gummies', 'capsule', 'capsules', 'tablet', 'tablets', 'softgel', 'softgels',
  'drops', 'spray', 'powder', 'tea', 'lozenge', 'melt', 'melts', 'patch', 'complex', 'blend',
];

const DOSE = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|iu|ml|g)\b/i;
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/** Levenshtein distance — small inputs only, so the simple matrix is the right call. */
export function editDistance(a: string, b: string): number {
  const m: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

const haystack = (e: Entry) => [e.name, ...(e.terms ?? [])].join(' ').toLowerCase();

export function resolve(rawQuery: string, entries: Entry[]): Resolution {
  const q = norm(rawQuery ?? '');
  const base: Resolution = { query: rawQuery ?? '', kind: 'empty', routes: [], more: [], categories: [] };
  if (!q) return base;
  // Two characters can't distinguish anything useful; say so rather than returning noise.
  if (q.length < 3) return { ...base, kind: 'short' };

  // ── the category rule, first: return the category, never a sample of its members ──────────
  if (CATEGORY_TERMS.some((t) => t === q || (q.length >= 4 && t.startsWith(q)))) {
    const counts = (kind: EntryKind) => entries.filter((e) => e.kind === kind).length;
    return {
      ...base,
      kind: 'category',
      categories: [
        { label: 'remedies', count: counts('remedy'), href: '/remedies' },
        { label: 'products', count: counts('product'), href: '/products' },
        { label: 'brands', count: counts('brand'), href: '/brands' },
      ].filter((c) => c.count > 0),
    };
  }

  // ── product intent: a brand token, a dose, or a product word ─────────────────────────────
  const brandNames = entries.filter((e) => e.kind === 'brand').map((e) => e.name.toLowerCase());
  const productIntent =
    DOSE.test(q) ||
    PRODUCT_WORDS.some((w) => q.includes(w)) ||
    brandNames.some((b) => q.includes(b) || b.includes(q));

  const matches = entries.filter((e) => haystack(e).includes(q));
  // Without product intent, bottles are withheld — an ingredient search must not be buried
  // under the products that contain it.
  const visible = productIntent ? matches : matches.filter((e) => e.kind !== 'product');

  if (visible.length === 0) {
    const best = entries
      .map((e) => ({ name: e.name, d: editDistance(q, e.name.toLowerCase()) }))
      .sort((a, b) => a.d - b.d)[0];
    const tolerance = Math.max(2, Math.floor(q.length / 4));
    return { ...base, kind: 'nomatch', suggestion: best && best.d <= tolerance ? best.name : undefined };
  }

  // ── tier 1: does this resolve to ONE thing? ──────────────────────────────────────────────
  // An exact name, or the only entry whose name starts with the query. A remedy outranks a
  // problem outranks a page — the most specific answer wins.
  const rank: Record<EntryKind, number> = { remedy: 0, problem: 1, product: 2, brand: 3, page: 4 };
  const exact = visible.filter((e) => e.name.toLowerCase() === q);
  const starts = visible.filter((e) => e.name.toLowerCase().startsWith(q));
  const answer =
    exact.sort((a, b) => rank[a.kind] - rank[b.kind])[0] ??
    (starts.length === 1 ? starts[0] : undefined);

  const rest = visible.filter((e) => e !== answer).sort((a, b) => rank[a.kind] - rank[b.kind] || a.name.localeCompare(b.name));

  if (answer) {
    // tier 2 = the routes that belong WITH this answer (its problems and pages), tier 3 = the rest
    const routes = rest.filter((e) => e.kind === 'problem' || e.kind === 'page').slice(0, 4);
    return { ...base, kind: 'answer', answer, routes, more: rest.filter((e) => !routes.includes(e)) };
  }

  return { ...base, kind: 'list', more: rest };
}
