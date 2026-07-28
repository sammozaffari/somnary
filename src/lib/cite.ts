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
    'meta-analysis': 'Meta-analysis',
    'systematic-review': 'Systematic review',
    rct: 'Randomized trial',
    cohort: 'Cohort study',
    'case-series': 'Case series',
    animal: 'Animal study',
    'in-vitro': 'In-vitro',
    registry: 'Trial registry',
    guideline: 'Clinical guideline',
    review: 'Review',
    other: 'Source',
  };
  return MAP[type] ?? type;
}

export type SourceStrength = {
  tier: 'strong' | 'moderate' | 'weak';
  filled: 1 | 2 | 3; // filled pips out of 3
  label: string; // accessible strength word
};

/**
 * Where a source sits on the standard evidence hierarchy (meta-analysis / guideline > RCT >
 * observational > mechanistic). Drives the visual "evidence weight" pip so a reader sees at a
 * glance that an animal study is weaker than a meta-analysis — evidence strength is STRUCTURAL,
 * not a flat green label (audit DOM-1).
 *
 * IMPORTANT: this ranks the STUDY TYPE only. It is NOT a per-source quality score and NOT the
 * remedy tier grade (grades stay [HUMAN-GATE], set only by a human). The edge cases
 * (registry / review / other) are ranked CONSERVATIVELY — never overstate an uncharacterised
 * source. These edge placements are a candidate for owner ratification.
 */
const STRENGTH: Record<string, 'strong' | 'moderate' | 'weak'> = {
  'meta-analysis': 'strong',
  'systematic-review': 'strong',
  rct: 'strong',
  guideline: 'strong',
  cohort: 'moderate',
  review: 'moderate', // narrative review — below a systematic review, which is 'strong'
  animal: 'weak',
  'in-vitro': 'weak',
  'case-series': 'weak', // uncontrolled, no comparator — near the EBM floor, below cohort
  registry: 'weak', // a registration/protocol, not a completed result — ranked conservatively
  other: 'weak', // uncharacterised — never imply strength
  // [HUMAN-GATE] the four arguable edge rows — case-series / review / registry / other — are
  // ranked conservatively (err low). Their exact placement is a published evidence-hierarchy
  // claim and awaits owner ratification; the apex/floor rows are uncontroversial.
};

export function sourceStrength(type: string): SourceStrength {
  const tier = STRENGTH[type] ?? 'weak';
  const filled = tier === 'strong' ? 3 : tier === 'moderate' ? 2 : 1;
  const label = tier === 'strong' ? 'Strong' : tier === 'moderate' ? 'Moderate' : 'Weak';
  return { tier, filled, label };
}

/** Comparator: strongest evidence first, stable by footnote number within a strength tier. */
export function byStrength(a: CiteSource, b: CiteSource): number {
  return sourceStrength(b.type).filled - sourceStrength(a.type).filled || a.n - b.n;
}
