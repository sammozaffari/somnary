/**
 * "Where to buy" row — retailer name, price if known, outbound link. By design it looks
 * IDENTICAL whether the product scores well or the site advises against it: same component,
 * same visual weight. Room for a one-line disclosure beneath.
 */
export interface WhereToBuyRowProps {
  retailer: string;
  /** e.g. "$14.99" — omit if unknown. */
  price?: string;
  url?: string;
  /** One quiet line, e.g. "somnary earns nothing from this link." */
  disclosure?: string;
  style?: React.CSSProperties;
}
