/**
 * Curated display names for the additive watchlist — the ONE source of truth for how a flagged
 * additive is TITLED, shared by the /sources/additives page (its section headings) and the build-time
 * search index (src/lib/search.ts). Keeping it here (not duplicated in each consumer) means a search
 * result title always matches the heading of the page it lands on: e.g. searching "FD&C Red 40" must
 * title the result "Synthetic azo dyes", the heading of the section its #artificial-azo-dyes anchor
 * scrolls to.
 *
 * Pure data — no fs, no astro:content — so it is safe in both a server page and the index builder.
 * The id title-cases awkwardly for a couple of entries, hence the curated overrides; anything not
 * listed falls back to a title-cased id via additiveDisplayName().
 */
export const ADDITIVE_DISPLAY: Record<string, string> = {
  'titanium-dioxide': 'Titanium dioxide',
  'artificial-azo-dyes': 'Synthetic azo dyes',
  'erythrosine-red-3': 'Erythrosine (Red 3)',
  'sodium-benzoate': 'Sodium benzoate',
  'bha-bht': 'BHA & BHT',
  'partially-hydrogenated-oils': 'Partially hydrogenated oils',
  'sugar-alcohol-load': 'Sugar alcohols (polyols)',
  'proprietary-blend': 'Proprietary blends',
  'silicon-dioxide': 'Silicon dioxide',
  'magnesium-stearate': 'Magnesium stearate',
};

/** Curated title if we have one, else a title-cased id ("foo-bar" → "Foo bar"). */
export function additiveDisplayName(id: string): string {
  return ADDITIVE_DISPLAY[id] ?? id.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
