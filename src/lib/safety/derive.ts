// Safety-page derivations (CHK-B10). Everything here reads the REMEDY corpus and returns only
// what is actually recorded — no safety copy is authored in this module, and none may ever be.
//
// THE RULE THIS FILE EXISTS TO ENFORCE (CLAUDE.md validation gates / CHK-E3): no safety string
// ships without a source id. The corpus is only partly sourced today (36 of 85 risk rows, 9 of
// 30 interaction lists), so the safety page renders the SOURCED subset and states the gap
// plainly, rather than publishing unsourced medical claims or dressing them as placeholders.
// `pregnancy` is deliberately NOT surfaced: the schema gives it no source field at all, so
// nothing on that field can meet the bar yet.

import type { CollectionEntry } from 'astro:content';

type Remedy = CollectionEntry<'remedies'>;
type Source = Remedy['data']['sources'][number];

export interface SourcedRisk {
  slug: string;
  name: string;
  category: string;
  text: string;
  sources: Source[];
}

export interface SourcedInteractions {
  slug: string;
  name: string;
  severity: 'caution' | 'serious';
  interactions: string[];
  sources: Source[];
}

export interface FlaggedRemedy {
  slug: string;
  name: string;
  severity: 'caution' | 'serious';
  lead: string;
  leadIsSourced: boolean;
}

const resolve = (r: Remedy, refs: number[]): Source[] =>
  refs.map((n) => r.data.sources.find((s) => s.n === n)).filter((s): s is Source => Boolean(s));

/** Risk rows that carry at least one resolvable source. Unsourced rows are DROPPED, not hedged. */
export function sourcedRisks(remedies: Remedy[]): SourcedRisk[] {
  return remedies.flatMap((r) =>
    r.data.safety.risks
      .filter((k) => k.sources.length > 0)
      .map((k) => ({
        slug: r.id,
        name: r.data.displayName,
        category: k.category,
        text: k.text,
        sources: resolve(r, k.sources),
      }))
      .filter((k) => k.sources.length > 0)
  );
}

/** Interaction lists that carry a source id for the list. Unsourced lists are DROPPED. */
export function sourcedInteractions(remedies: Remedy[]): SourcedInteractions[] {
  return remedies
    .filter((r) => r.data.safety.interactions.length > 0 && r.data.safety.interactionsSources.length > 0)
    .map((r) => ({
      slug: r.id,
      name: r.data.displayName,
      severity: r.data.safety.severity,
      interactions: r.data.safety.interactions,
      sources: resolve(r, r.data.safety.interactionsSources),
    }))
    .filter((r) => r.sources.length > 0)
    .sort((a, b) => (a.severity === b.severity ? a.name.localeCompare(b.name) : a.severity === 'serious' ? -1 : 1));
}

/**
 * Every remedy that carries a flag, by level. The FLAG ITSELF is derived from the `severity`
 * field — a recorded classification, not a claim this page is making — so the listing is honest
 * even where the prose behind it isn't sourced yet. `leadIsSourced` tells the page whether it
 * may render that remedy's lead sentence or must link out to the remedy page instead.
 */
export function flagged(remedies: Remedy[]): { serious: FlaggedRemedy[]; caution: FlaggedRemedy[] } {
  const all = remedies.map((r) => ({
    slug: r.id,
    name: r.data.displayName,
    severity: r.data.safety.severity,
    lead: r.data.safety.lead,
    // the lead is sourced only if the remedy's risk rows carry sources — the lead field has no
    // source of its own, so this is the closest honest test, and it errs toward NOT rendering
    leadIsSourced: r.data.safety.risks.some((k) => k.sources.length > 0),
  }));
  const byName = (a: FlaggedRemedy, b: FlaggedRemedy) => a.name.localeCompare(b.name);
  return {
    serious: all.filter((r) => r.severity === 'serious').sort(byName),
    caution: all.filter((r) => r.severity === 'caution').sort(byName),
  };
}

/** Coverage counts, so the page can state its own gap in real numbers rather than vaguely. */
export function safetyCoverage(remedies: Remedy[]) {
  const riskRows = remedies.reduce((n, r) => n + r.data.safety.risks.length, 0);
  const riskSourced = remedies.reduce(
    (n, r) => n + r.data.safety.risks.filter((k) => k.sources.length > 0).length,
    0
  );
  const withInteractions = remedies.filter((r) => r.data.safety.interactions.length > 0).length;
  const interactionsSourced = remedies.filter(
    (r) => r.data.safety.interactions.length > 0 && r.data.safety.interactionsSources.length > 0
  ).length;
  return { riskRows, riskSourced, withInteractions, interactionsSourced, total: remedies.length };
}
