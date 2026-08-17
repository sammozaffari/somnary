/**
 * A brand in search results: BrandMark image slot (typographic placeholder), name,
 * products-assessed count, and a quiet strip of bucket glyphs. Whole row is a link.
 */
export interface BrandResultRowProps {
  /** Brand name as printed on labels. */
  name: string;
  /** Real brand image URL; omit for the typographic placeholder. */
  image?: string;
  productCount: number;
  /** Ingredient buckets of assessed products, shown as small glyphs (max 6). */
  buckets?: Array<'works' | 'maybe' | 'unknown' | 'avoid'>;
  href?: string;
  /** Click handler (e.g. SPA navigation); call preventDefault yourself. */
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
