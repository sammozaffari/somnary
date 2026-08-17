/**
 * The brand/product image slot with its placeholder designed as the common case:
 * a typographic mark — the brand's initial on a neutral sunken ground — never a grey
 * box, never verdict-tinted (a placeholder carries no judgement).
 */
export interface BrandMarkProps {
  /** Brand or product name; the placeholder shows its initial. */
  name: string;
  /** Real image URL, when one exists. */
  src?: string;
  /** Square size in px. Default 40. */
  size?: number;
  /** Corner radius. Default var(--radius-sm). */
  radius?: string;
  style?: React.CSSProperties;
}
