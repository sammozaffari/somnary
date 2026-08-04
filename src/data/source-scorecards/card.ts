// Shared types + constants for the source-scorecard card/grid/legend components.
// Each ingredient's page maps its own product type into `ScorecardCardData` (a `toCard` mapper),
// so the card, grid, tier-grouping and legend are rendered by ONE set of components across all pages.

export type DimensionKey =
  | 'testing_purity'
  | 'label_accuracy'
  | 'additives'
  | 'regulatory'
  | 'transparency'
  | 'marketing_honesty';

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  testing_purity: 'Testing & purity',
  label_accuracy: 'Label accuracy',
  additives: 'Additives',
  regulatory: 'Regulatory record',
  transparency: 'Transparency',
  marketing_honesty: 'Marketing honesty',
};

export const DIMENSION_ORDER: DimensionKey[] = [
  'testing_purity',
  'label_accuracy',
  'additives',
  'regulatory',
  'transparency',
  'marketing_honesty',
];

export interface Dimension {
  score: number;
  note: string;
}

/**
 * A retailer purchase link. A plain string is a live link (the common case, no churn).
 * The object form records a resolver check: `status: 'unavailable'` marks a URL that no
 * longer resolves (the listing moved or was delisted) so the UI can show "listing
 * unavailable" instead of a link that dead-ends — unknown/gone is a first-class state,
 * not a broken link we pretend is fine. Re-resolving to a fresh URL is deferred (L work).
 */
export interface RetailerLink {
  url: string;
  status?: 'ok' | 'unavailable';
  /** ISO date (YYYY-MM-DD) the URL was last resolved with a browser-class check. */
  lastCheckedAt?: string;
}
export type RetailerRef = string | RetailerLink;
export interface Retailers {
  amazon?: RetailerRef;
  chemistWarehouse?: RetailerRef;
  iherb?: RetailerRef;
}

/** A small flag pill on the card face. `good` = eucalyptus, `warn` = safety register. */
export interface Chip {
  label: string;
  kind: 'good' | 'warn';
  note?: string; // tooltip
}

/** A callout line shown inside the "Why these scores" details (safety / trial context). */
export interface DetailLine {
  tag: string; // e.g. 'Safety' | 'Used in trials'
  note: string;
  kind: 'safety' | 'trial';
}

/** Normalised, render-ready shape the shared card/grid components consume. */
export interface ScorecardCardData {
  slug: string;
  brand: string;
  productName: string;
  /** small lines under the brand — e.g. strength/dose/form, then the AUST-L/channel meta line */
  specLines: string[];
  metaLine: string;
  certSummary: string;
  certVerified?: boolean;
  imagePath?: string;
  /** the 2-second read — bold lead line on the card face */
  bottomLine: string;
  chips: Chip[];
  scores: Record<DimensionKey, Dimension>;
  verdict: string;
  /** shown inside the details expander, above the meters */
  detailLines: DetailLine[];
  heldItems: string[];
  /** vitamin-B6 present → forces the Heads-up tier (added ingredient, product-specific) */
  hasB6: boolean;
}
