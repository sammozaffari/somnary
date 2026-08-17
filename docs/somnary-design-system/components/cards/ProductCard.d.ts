/**
 * Product card with three completeness states: 'assessed' (verdicts + criteria),
 * 'labelOnly' (label known, not yet assessed), 'notFound' (not in database — dashed, non-card).
 * Leads with the BrandMark image slot (neutral typographic placeholder is the common case).
 * The strength/blend line sits on its own line — never duplicated into the name.
 * @startingPoint section="Cards" subtitle="Product card, three completeness states" viewport="360x340"
 */
export interface ProductCardProps {
  /** Product name WITHOUT dose, e.g. "Melatonin gummies". */
  name: string;
  /** Brand name, small line above. */
  brand: string;
  /** Single-ingredient strength, e.g. "1 mg" (tabular figures). Mutually exclusive with blend. */
  strength?: string;
  /** Blend descriptor, e.g. "6 ingredients, 2 undisclosed" — rendered as "Blend — …". */
  blend?: string;
  /** Real product/brand image URL; omit for the typographic placeholder. */
  image?: string;
  state?: 'assessed' | 'labelOnly' | 'notFound';
  /** Ingredient bucket (assessed only). */
  bucket?: 'works' | 'maybe' | 'unknown' | 'avoid';
  /** Product checks (assessed only). */
  criteria?: { dose?: boolean; tested?: boolean; disclosed?: boolean; form?: boolean };
  /** Human date, e.g. "14 July 2026" — never ISO. */
  lastChecked?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
