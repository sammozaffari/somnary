/**
 * compare-data — the ONE projection of the corpus into `CompareEntity`, read by both the picker
 * (/compare) and every pair page (/compare/[pair]). No content is duplicated: dimensions come
 * straight from the remedy schema, category from the content-index registry (as compare.astro
 * always did), and the tier's typical evidence gates from tiers.ts (NOT each remedy's own
 * evidenceGates[] — a per-remedy gate label can encode combination context that misreads on a
 * side-by-side, exactly the D4 risk the original compare page guarded against).
 */
import { getCollection } from 'astro:content';
import { getTier } from './tiers.ts';
import { contentIndex } from './content-index.ts';
import { isDefaultRankingEligible, isOrdinarySearchEligible } from './remedy-state.ts';
import type { CompareEntity } from './compare-diff.ts';

const categoryOf = new Map(contentIndex.map((e) => [e.slug, e.category]));

/** All non-withdrawn, non-superseded remedies as CompareEntity, A–Z by name. */
export async function getCompareEntities(): Promise<CompareEntity[]> {
  const remedies = await getCollection(
    'remedies',
    (e) => !e.data.draft && isOrdinarySearchEligible(e.data),
  );
  return remedies
    .map((e): CompareEntity => ({
      slug: e.id,
      name: e.data.name,
      verdict: e.data.oneLineVerdict,
      tier: e.data.tier,
      workflowState: e.data.workflowState,
      epistemicState: e.data.epistemicState,
      rankingEligible: isDefaultRankingEligible(e.data),
      format: e.data.format,
      outcomes: e.data.outcomes,
      doses: e.data.doses.map((d) => ({
        form: d.form,
        studiedDose: d.studiedDose,
        timing: d.timing,
      })),
      notFor: e.data.notFor,
      biggestRisk: e.data.biggestRisk,
      interactions: e.data.safety.interactions,
      gates: getTier(e.data.tier).typicalGates,
      category: categoryOf.get(e.id) ?? '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// --- canonical pair addressing --------------------------------------------------------------
// A pair is order-independent; the canonical slug is the two remedy slugs, alphabetical, joined
// by "-vs-". Every unordered pair therefore has exactly ONE canonical URL.

export function pairSlug(a: string, b: string): string {
  return [a, b].sort((x, y) => x.localeCompare(y)).join('-vs-');
}

/** Parse a `[pair]` route param back to its two slugs, or null if malformed. */
export function parsePair(param: string): [string, string] | null {
  const parts = param.split('-vs-');
  if (parts.length !== 2 || !parts[0] || !parts[1] || parts[0] === parts[1]) return null;
  return [parts[0], parts[1]];
}

/** Every unordered pair of entities, for getStaticPaths. */
export function allPairs<T extends { slug: string }>(entities: T[]): [T, T][] {
  const pairs: [T, T][] = [];
  for (let i = 0; i < entities.length; i += 1)
    for (let j = i + 1; j < entities.length; j += 1) pairs.push([entities[i], entities[j]]);
  return pairs;
}
