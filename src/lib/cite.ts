/**
 * Render-side citation URL builder. The canonical URL for a PMID / DOI / registry id is the
 * SAME mapping the offline resolver uses (scripts/check-citations.mjs · canonicalUrl) — kept in
 * sync so a link the build validates is the exact link the page renders. Every source in the
 * schema (src/content.config.ts) is guaranteed to carry at least one of these ids, so
 * sourceUrl() never returns null for validated content.
 *
 * Used by SourcesList.astro (the numbered footnote list) and CitationPopover.astro (the shared
 * popover). Do not hardcode a PubMed/doi.org URL anywhere else — call this.
 */
export interface CiteSource {
  n: number;
  title: string;
  sourceLine: string;
  finding: string;
  type: string;
  pmid?: string;
  doi?: string;
  registry?: string;
  url?: string;
}

const CANONICAL = {
  pmid: (v: string) => `https://pubmed.ncbi.nlm.nih.gov/${v}/`,
  doi: (v: string) => `https://doi.org/${v}`,
  registry: (v: string) => `https://clinicaltrials.gov/study/${v}`,
} as const;

/** The link the footnote points at. Prefers an explicit url, else pmid → doi → registry. */
export function sourceUrl(s: CiteSource): string {
  if (s.url) return s.url;
  if (s.pmid) return CANONICAL.pmid(s.pmid);
  if (s.doi) return CANONICAL.doi(s.doi);
  if (s.registry) return CANONICAL.registry(s.registry);
  // Unreachable for validated content (schema requires an identifier); fail loud if it happens.
  throw new Error(`source [${s.n}] has no resolvable identifier`);
}

/** Short mono tag shown in the popover header + sources list (e.g. "PMID 23691095"). */
export function sourceIdLabel(s: CiteSource): string {
  if (s.pmid) return `PMID ${s.pmid}`;
  if (s.doi) return `DOI ${s.doi}`;
  if (s.registry) return s.registry;
  return 'source';
}

/** Human-readable design tag for the popover (schema `type` → words). */
export function sourceTypeLabel(type: string): string {
  const MAP: Record<string, string> = {
    'meta-analysis': 'meta-analysis',
    'systematic-review': 'systematic review',
    rct: 'randomized trial',
    cohort: 'cohort study',
    'case-series': 'case series',
    animal: 'animal study',
    'in-vitro': 'in-vitro',
    registry: 'trial registry',
    guideline: 'clinical guideline',
    review: 'review',
    other: 'source',
  };
  return MAP[type] ?? type;
}
