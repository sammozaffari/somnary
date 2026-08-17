/**
 * Remedy card — one ingredient in a list or grid: name, research-filter thumbnail,
 * bucket badge with its sentence. The whole card is one link. A safetyFlag always
 * renders above the visual.
 * @startingPoint section="Cards" subtitle="Ingredient card with research-filter thumb" viewport="360x290"
 */
export interface RemedyCardProps {
  /** Ingredient name, sentence case — "Melatonin", "Tart cherry" — except scientific
      convention: L-theanine, 5-HTP, GABA, CBD, CBN, vitamin D. */
  name: string;
  bucket: 'works' | 'maybe' | 'unknown' | 'avoid';
  naming?: 'plain' | 'evidence';
  /** Override the bucket's default sentence. */
  sentence?: string;
  /** Research-filter data (see StudyField): the three nested counts. */
  research?: { counts: { cited: number; sleep: number; verifiable: number } };
  /** Serious safety concern, one plain sentence — outranks the visual. */
  safetyFlag?: string;
  /** Top-right meta, e.g. "14 papers". */
  meta?: string;
  href?: string;
  /** Click handler (e.g. SPA navigation); call preventDefault yourself. */
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
