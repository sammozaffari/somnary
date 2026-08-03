/**
 * Unified product BROWSE index (CHK-products-browse).
 *
 * WHY: the 94 ratified source scorecards are reachable today ONLY under
 * /sources/<ingredient>/<slug>. Someone holding a bottle can't find it — the IA audit's
 * intent-E "leave trigger" ("the product exists only under an internal ingredient category",
 * docs/audits/02-ia.md). This module is the one build-time registry that /products browses —
 * the same pattern as src/lib/search.ts, which indexes remedies, not products.
 *
 * It imports every ingredient's data module + its `toCard` mapper (src/lib/sources/cards.ts)
 * so a browse card renders PIXEL-IDENTICALLY to the same product on its ingredient page — one
 * card renderer, no drift. It adds the four browse facets on top: ingredient, physical form,
 * single-vs-combo, and brand.
 *
 * EDITORIAL (CLAUDE.md, /sources/methodology): products carry the six documented dimensions and
 * the derived 4-tier label — never an overall letter, never a #1. Sort-by-dimension (owner-
 * ratified) orders on ONE factual axis; there is no composite sort, and the default order is
 * neutral (alphabetical by brand). See src/pages/products.astro for the framing copy.
 *
 * ENTITY HONESTY (intent-E): a wrong SKU is worse than "not specified". Physical form is derived
 * only from structured fields (product name + the product's own form string), never from prose —
 * and falls back to `unspecified` rather than guessing. Build logs the unspecified count.
 */
import { MAGNESIUM_SOURCES } from '../../data/source-scorecards/magnesium';
import { ASHWAGANDHA_SOURCES } from '../../data/source-scorecards/ashwagandha';
import { GLYCINE_SOURCES } from '../../data/source-scorecards/glycine';
import { VALERIAN_SOURCES } from '../../data/source-scorecards/valerian';
import { MELATONIN_SOURCES } from '../../data/source-scorecards/melatonin';
import { toMagCard, toAshCard, toGlyCard, toValCard, toMelCard } from './cards';
import { computeTier, type TierKey } from '../../data/source-scorecards/tiers';
import { DIMENSION_ORDER, type DimensionKey, type ScorecardCardData } from '../../data/source-scorecards/card';

export type IngredientKey = 'melatonin' | 'magnesium' | 'glycine' | 'valerian' | 'ashwagandha';

export const INGREDIENT_LABELS: Record<IngredientKey, string> = {
  melatonin: 'Melatonin',
  magnesium: 'Magnesium',
  glycine: 'Glycine',
  valerian: 'Valerian',
  ashwagandha: 'Ashwagandha',
};
/** Aisle order — alphabetical, a neutral arrangement (no ingredient ranked above another). */
export const INGREDIENT_ORDER: IngredientKey[] = [
  'ashwagandha',
  'glycine',
  'magnesium',
  'melatonin',
  'valerian',
];

export type FormBucket = 'capsule' | 'gummy' | 'tablet' | 'powder' | 'liquid' | 'unspecified';
export const FORM_LABELS: Record<FormBucket, string> = {
  capsule: 'Capsule',
  gummy: 'Gummy',
  tablet: 'Tablet',
  powder: 'Powder',
  liquid: 'Liquid',
  unspecified: 'Other / unspecified',
};
export const FORM_ORDER: FormBucket[] = ['capsule', 'tablet', 'gummy', 'powder', 'liquid', 'unspecified'];

export type ComboKey = 'single' | 'combo';
export const COMBO_LABELS: Record<ComboKey, string> = {
  single: 'Single ingredient',
  combo: 'Combination',
};

export type SortKey = 'brand' | DimensionKey;
/** 'brand' is the neutral default; the dimension keys sort on ONE factual axis, never a composite. */
export const SORT_KEYS: SortKey[] = ['brand', ...DIMENSION_ORDER];

export interface BrowseProduct {
  ingredient: IngredientKey;
  ingredientLabel: string;
  slug: string;
  href: string;
  brand: string;
  brandSlug: string;
  productName: string;
  form: FormBucket;
  combo: ComboKey;
  tier: TierKey;
  hasB6: boolean;
  scores: Record<DimensionKey, { score: number; note: string }>;
  card: ScorecardCardData;
}

/** Slugify a brand for a stable, shareable URL value (display uses the original casing). */
export function brandSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Derive the PHYSICAL form from structured fields only (name + the product's own form string) —
// never from verdict/note prose, where words like "effervescent" appear as commentary. First match
// wins, most-specific first. No token → `unspecified` (an honest bucket, not a guess).
function deriveForm(text: string): FormBucket {
  const t = text.toLowerCase();
  // Match singular AND plural — glycine's own form string is "single-ingredient capsules" /
  // "single-ingredient powder", and product names say "Tablets"/"Gummies"/"Powder".
  if (/\bgumm(y|ies)\b/.test(t)) return 'gummy';
  if (/\b(liquids?|drops?|tinctures?|elixirs?)\b/.test(t)) return 'liquid';
  if (/\b(powders?|sachets?)\b/.test(t)) return 'powder';
  // Effervescent tablets and softgels/capsules resolve to their swallow-form bucket.
  if (/\beffervescent\b/.test(t)) return 'tablet';
  if (/\b(capsules?|caps?|softgels?|vcaps?|lozenges?)\b/.test(t)) return 'capsule';
  if (/\btablets?\b/.test(t)) return 'tablet';
  return 'unspecified';
}

// combo = OTHER actives added alongside the headline ingredient. Melatonin carries an authoritative
// `singleOrCombo` field; the others encode it in the form string ("combo (…)" / a "(+ …)" add-in
// list vs a "single-herb"/single-salt form). Multi-SALT magnesium is still a single ingredient.
function deriveCombo(form: string): ComboKey {
  const t = form.toLowerCase();
  if (/^combo\b/.test(t) || /\(\s*\+/.test(t)) return 'combo';
  return 'single';
}

function build(): BrowseProduct[] {
  const out: BrowseProduct[] = [];

  const push = (
    ingredient: IngredientKey,
    slug: string,
    brand: string,
    productName: string,
    formText: string,
    comboSource: string,
    combo: ComboKey | undefined,
    scores: Record<DimensionKey, { score: number; note: string }>,
    hasB6: boolean,
    card: ScorecardCardData,
  ) => {
    out.push({
      ingredient,
      ingredientLabel: INGREDIENT_LABELS[ingredient],
      slug,
      href: `/sources/${ingredient}/${slug}/`,
      brand,
      brandSlug: brandSlug(brand),
      productName,
      form: deriveForm(`${productName} ${formText}`),
      combo: combo ?? deriveCombo(comboSource),
      tier: computeTier(scores, hasB6),
      hasB6,
      scores,
      card,
    });
  };

  MAGNESIUM_SOURCES.filter((p) => p.ratified).forEach((p) =>
    push('magnesium', p.slug, p.brand, p.productName, p.form, p.form, undefined, p.scores, !!p.b6, toMagCard(p)),
  );
  ASHWAGANDHA_SOURCES.filter((p) => p.ratified).forEach((p) =>
    push('ashwagandha', p.slug, p.brand, p.productName, p.form, p.form, undefined, p.scores, !!p.b6, toAshCard(p)),
  );
  GLYCINE_SOURCES.filter((p) => p.ratified).forEach((p) =>
    push('glycine', p.slug, p.brand, p.productName, p.form, p.form, undefined, p.scores, false, toGlyCard(p)),
  );
  VALERIAN_SOURCES.filter((p) => p.ratified).forEach((p) =>
    push('valerian', p.slug, p.brand, p.productName, p.form, p.form, undefined, p.scores, false, toValCard(p)),
  );
  // Melatonin is prescription-only in AU: withhold products an Australian can't buy OTC (import),
  // matching the ingredient page's gate. `singleOrCombo` is authoritative here.
  MELATONIN_SOURCES.filter((p) => p.ratified && p.availableInAU !== false).forEach((p) =>
    push('melatonin', p.slug, p.brand, p.productName, p.form, p.form, p.singleOrCombo, p.scores, false, toMelCard(p)),
  );

  // Build-time honesty check: how many products we couldn't confidently form-bucket.
  const unspecified = out.filter((p) => p.form === 'unspecified');
  if (unspecified.length > 0) {
    // eslint-disable-next-line no-console
    console.info(
      `[browse] ${unspecified.length}/${out.length} products have unspecified physical form ` +
        `(shown under "Other / unspecified"): ${unspecified.map((p) => `${p.ingredient}/${p.slug}`).join(', ')}`,
    );
  }

  return out.sort((a, b) => a.brand.localeCompare(b.brand) || a.productName.localeCompare(b.productName));
}

/** The single source of browse products — all ratified scorecards, one flat, facet-tagged list. */
export const BROWSE_PRODUCTS: BrowseProduct[] = build();

/**
 * The data-load seam. Today this returns the build-time list synchronously; when the source moves
 * to the Supabase `source_scorecards_published` view it becomes an awaited read here — the ONLY
 * place that changes. The page wraps this in try/catch and maps a THROW to the explicit `error`
 * state (never `no-results`/`empty`), so a load failure can never masquerade as "no products match"
 * (the CMP-01 failure mode). Kept failable now so that guarantee is tested, not just intended.
 */
export function loadBrowseProducts(): BrowseProduct[] {
  return BROWSE_PRODUCTS;
}

// ---- Facets present in the live data (drives the filter bar; never a hardcoded list) ----------

export interface Facets {
  ingredients: { key: IngredientKey; label: string; count: number }[];
  forms: { key: FormBucket; label: string; count: number }[];
  combos: { key: ComboKey; label: string; count: number }[];
  brands: { slug: string; label: string; count: number }[];
}

export function getFacets(products: BrowseProduct[] = BROWSE_PRODUCTS): Facets {
  const count = <K extends string>(keyOf: (p: BrowseProduct) => K) => {
    const m = new Map<K, number>();
    for (const p of products) m.set(keyOf(p), (m.get(keyOf(p)) ?? 0) + 1);
    return m;
  };
  const ing = count((p) => p.ingredient);
  const frm = count((p) => p.form);
  const cmb = count((p) => p.combo);
  const brandMap = new Map<string, { label: string; count: number }>();
  for (const p of products) {
    const cur = brandMap.get(p.brandSlug);
    if (cur) cur.count += 1;
    else brandMap.set(p.brandSlug, { label: p.brand, count: 1 });
  }

  return {
    ingredients: INGREDIENT_ORDER.filter((k) => ing.has(k)).map((k) => ({
      key: k,
      label: INGREDIENT_LABELS[k],
      count: ing.get(k) ?? 0,
    })),
    forms: FORM_ORDER.filter((k) => frm.has(k)).map((k) => ({
      key: k,
      label: FORM_LABELS[k],
      count: frm.get(k) ?? 0,
    })),
    combos: (['single', 'combo'] as ComboKey[]).filter((k) => cmb.has(k)).map((k) => ({
      key: k,
      label: COMBO_LABELS[k],
      count: cmb.get(k) ?? 0,
    })),
    brands: [...brandMap.entries()]
      .map(([slug, v]) => ({ slug, label: v.label, count: v.count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}

// ---- Filter + sort (pure; the SSR page is the source of truth, no-JS-complete) -----------------

export interface BrowseQuery {
  ingredients: IngredientKey[];
  forms: FormBucket[];
  combos: ComboKey[];
  brand: string | null; // brandSlug
  sort: SortKey;
}

export const EMPTY_QUERY: BrowseQuery = {
  ingredients: [],
  forms: [],
  combos: [],
  brand: null,
  sort: 'brand',
};

/** True when no facet is constraining the set (the default "full aisle" arrival). */
export function isDefaultQuery(q: BrowseQuery): boolean {
  return (
    q.ingredients.length === 0 &&
    q.forms.length === 0 &&
    q.combos.length === 0 &&
    q.brand === null &&
    q.sort === 'brand'
  );
}

export function filterProducts(q: BrowseQuery, products: BrowseProduct[] = BROWSE_PRODUCTS): BrowseProduct[] {
  const matched = products.filter(
    (p) =>
      (q.ingredients.length === 0 || q.ingredients.includes(p.ingredient)) &&
      (q.forms.length === 0 || q.forms.includes(p.form)) &&
      (q.combos.length === 0 || q.combos.includes(p.combo)) &&
      (q.brand === null || p.brandSlug === q.brand),
  );

  if (q.sort === 'brand') return matched; // already brand-sorted at build

  // Sort DOWN one factual dimension (owner-ratified). Higher documented score first; ties break
  // alphabetically by brand, NOT by a second score — one axis only, never a composite ranking.
  const dim: DimensionKey = q.sort;
  return [...matched].sort(
    (a, b) => b.scores[dim].score - a.scores[dim].score || a.brand.localeCompare(b.brand),
  );
}

// ---- URL <-> query (canonical param order → stable, shareable links) ---------------------------

const VALID_INGREDIENTS = new Set<string>(INGREDIENT_ORDER);
const VALID_FORMS = new Set<string>(FORM_ORDER);
const VALID_COMBOS = new Set<string>(['single', 'combo']);
const VALID_SORTS = new Set<string>(SORT_KEYS);

export class BrowseParamError extends Error {}

/**
 * Parse URL search params into a BrowseQuery. STRICT: a present param whose every value is
 * unknown throws BrowseParamError, so a mistyped/tampered shared link resolves to the explicit
 * `error` state (a recoverable message) rather than silently pretending to be a clean result.
 * Unknown values mixed with valid ones are dropped (and reflected back), so the URL and the
 * visible chips always agree.
 */
export function parseQuery(params: URLSearchParams): BrowseQuery {
  // Accept BOTH `?ingredient=a,b` (canonical shareable form) and `?ingredient=a&ingredient=b`
  // (what a no-JS GET <form> with checkboxes submits) — flatten, then validate.
  const list = (name: string, valid: Set<string>): string[] => {
    const all = params.getAll(name);
    if (all.length === 0) return [];
    const parts = all
      .flatMap((v) => v.split(','))
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return [];
    const kept = parts.filter((p) => valid.has(p));
    if (kept.length === 0) throw new BrowseParamError(`No recognised value for "${name}": ${all.join(',')}`);
    return [...new Set(kept)];
  };

  const ingredients = list('ingredient', VALID_INGREDIENTS) as IngredientKey[];
  const forms = list('form', VALID_FORMS) as FormBucket[];
  const combos = list('combo', VALID_COMBOS) as ComboKey[];

  let brand: string | null = null;
  const rawBrand = params.get('brand');
  if (rawBrand) {
    const bs = brandSlug(rawBrand);
    if (!getFacets().brands.some((b) => b.slug === bs)) {
      throw new BrowseParamError(`Unknown brand: ${rawBrand}`);
    }
    brand = bs;
  }

  let sort: SortKey = 'brand';
  const rawSort = params.get('sort');
  if (rawSort) {
    if (!VALID_SORTS.has(rawSort)) throw new BrowseParamError(`Unknown sort: ${rawSort}`);
    sort = rawSort as SortKey;
  }

  return { ingredients, forms, combos, brand, sort };
}

/** Serialize a query to a canonical, minimal query string (omits defaults) for shareable URLs. */
export function toQueryString(q: BrowseQuery): string {
  const p = new URLSearchParams();
  if (q.ingredients.length) p.set('ingredient', q.ingredients.join(','));
  if (q.forms.length) p.set('form', q.forms.join(','));
  if (q.combos.length) p.set('combo', q.combos.join(','));
  if (q.brand) p.set('brand', q.brand);
  if (q.sort !== 'brand') p.set('sort', q.sort);
  const s = p.toString();
  return s ? `?${s}` : '';
}
