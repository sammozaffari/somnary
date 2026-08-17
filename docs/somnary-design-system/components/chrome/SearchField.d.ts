/**
 * The search field — the site's primary object. Geometry follows the nested-radii rule:
 * lg = --control-xl outer at --radius-lg, --space-1 padding, --control-lg button at --radius-md;
 * sm = --control-md outer at --radius-md, zero padding, full-height button at --radius-md
 * (inner = outer − padding = outer) — every part of the control meets the 44px hit floor.
 * @startingPoint section="Chrome" subtitle="The site's primary object" viewport="600x100"
 */
export interface SearchFieldProps {
  /** Default "A remedy, a product, or a brand". */
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  /** 'lg' hero or 'sm' header. Default 'lg'. */
  size?: 'lg' | 'sm';
  autoFocus?: boolean;
  style?: React.CSSProperties;
}
