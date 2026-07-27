/**
 * Build-time search index (CHK-4.1; PLAN §2a, DESIGN_SYSTEM §2.13/§3.7).
 *
 * ONE index, generated from the structured content at build — never hand-maintained, so it can't
 * drift from the corpus (rebuilds whenever content changes). This module reads the content
 * collection (server-only via astro:content); the pure ranking lives in ./search-rank so it can
 * also be bundled into the client palette. Both surfaces rank identically.
 *
 * Surfaces: the ⌘K command palette (CHK-4.2, client-side via /search-index.json) and the crawlable
 * /search page (CHK-4.3, server-rendered). Searchable fields per §2a: name + aliases/latin + key
 * compound + outcomes + symptoms. TIER DOES NOT BOOST RANKING.
 *
 * search-first Phase 2: the SAME index also covers the product scorecards and the additive
 * watchlist, so the palette and /search find products/ingredients too. Remedies are unchanged and
 * come first; a graded remedy always out-ranks a same-name product (corpus short-circuit).
 */
import { getCollection } from 'astro:content';
import { contentIndex } from './content-index';
import type { SearchDoc } from './search-rank';
import { MELATONIN_SOURCES } from '../data/source-scorecards/melatonin';
import { MAGNESIUM_SOURCES } from '../data/source-scorecards/magnesium';
import { ASHWAGANDHA_SOURCES } from '../data/source-scorecards/ashwagandha';
import { GLYCINE_SOURCES } from '../data/source-scorecards/glycine';
import { VALERIAN_SOURCES } from '../data/source-scorecards/valerian';
// Bundle the cited watchlist as a raw string at build time (Vite ?raw) — the SAME source of truth
// and the SAME loading path the /sources/additives page uses. This is more robust than the
// request-time fs loader for a build-time index (no path resolution against import.meta.url), and it
// parses with the fs-free pure parser.
import additiveWatchlistYaml from '../data/additive-watchlist.yaml?raw';
import { parseAdditiveWatchlist } from './lens/additive-watchlist';

export type { SearchDoc } from './search-rank';
export { searchDocs } from './search-rank';

const indexBySlug = new Map(contentIndex.map((e) => [e.slug, e]));

/** The minimal product shape the index needs — every scorecard array satisfies it. */
interface IndexableProduct {
  slug: string;
  brand: string;
  productName: string;
  bottomLine: string;
  ratified: boolean;
  availableInAU?: boolean;
}

/**
 * The five product-scorecard collections, paired with their route prefix (the /sources/<ingredient>
 * directory that owns `[slug].astro`) and the SAME publish filter each route applies in
 * getStaticPaths — so every emitted product URL resolves to a real page. Melatonin additionally
 * withholds products not available in AU (mirrors src/pages/sources/melatonin/[slug].astro).
 */
const PRODUCT_GROUPS: { ingredient: string; products: IndexableProduct[] }[] = [
  { ingredient: 'melatonin', products: MELATONIN_SOURCES },
  { ingredient: 'magnesium', products: MAGNESIUM_SOURCES },
  { ingredient: 'ashwagandha', products: ASHWAGANDHA_SOURCES },
  { ingredient: 'glycine', products: GLYCINE_SOURCES },
  { ingredient: 'valerian', products: VALERIAN_SOURCES },
];

function isPublished(p: IndexableProduct): boolean {
  return p.ratified && p.availableInAU !== false;
}

function byName(a: SearchDoc, b: SearchDoc): number {
  return a.name.localeCompare(b.name);
}

/** The single source of search docs — remedies (graded), then product scorecards, then additives. */
export async function getSearchDocs(): Promise<SearchDoc[]> {
  const remedies = await getCollection('remedies', (e) => !e.data.draft);
  const remedyDocs: SearchDoc[] = remedies
    .map((e) => {
      const d = e.data;
      const idx = indexBySlug.get(e.id);
      return {
        slug: e.id,
        url: `/r/${e.id}`,
        name: d.name,
        kind: 'remedy' as const,
        tier: d.tier,
        category: idx?.category ?? '',
        latin: idx?.latin ?? null,
        keyCompound: d.keyCompound,
        aliases: d.aliases,
        outcomes: d.outcomes,
        symptoms: d.symptoms,
        oneLiner: d.oneLineVerdict,
      };
    })
    .sort(byName);

  const productDocs: SearchDoc[] = PRODUCT_GROUPS.flatMap(({ ingredient, products }) =>
    products.filter(isPublished).map((p) => ({
      slug: p.slug,
      url: `/sources/${ingredient}/${p.slug}`,
      name: `${p.brand} ${p.productName}`,
      kind: 'product' as const,
      tier: null,
      category: `Product · ${p.brand}`,
      latin: null,
      keyCompound: null,
      aliases: [p.brand, p.productName, ingredient],
      outcomes: [],
      symptoms: [],
      oneLiner: p.bottomLine,
    })),
  ).sort(byName);

  // Additive watchlist — the SAME cited list the scorecard rubric uses. The parsed entry carries no
  // rationale field, so the one-liner is a neutral, severity-derived line (never a fabricated claim
  // or citation); the anchor id matches the /sources/additives page's <li id={e.id}>.
  const additives = parseAdditiveWatchlist(additiveWatchlistYaml);
  const additiveDocs: SearchDoc[] = additives
    .map((a) => ({
      slug: a.id,
      url: `/sources/additives#${a.id}`,
      name: a.names[0] ?? a.id,
      kind: 'additive' as const,
      tier: null,
      category: `Additive · ${a.severity}`,
      latin: null,
      keyCompound: null,
      aliases: a.names,
      outcomes: [],
      symptoms: [],
      oneLiner: a.structural
        ? 'On the Somnary additive watchlist as a label-transparency defect.'
        : a.severity === 'concern'
          ? 'On the Somnary additive watchlist (stronger evidence or a withdrawn regulatory approval).'
          : 'On the Somnary additive watchlist (precautionary or dose-dependent evidence).',
    }))
    .sort(byName);

  return [...remedyDocs, ...productDocs, ...additiveDocs];
}
