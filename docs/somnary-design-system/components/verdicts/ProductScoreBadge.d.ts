/**
 * The product score — how many of the four factual checks a bottle passes
 * (dose · third-party tested · full disclosure · studied form), breakdown visible.
 * @startingPoint section="Verdicts" subtitle="Product checks with visible breakdown" viewport="420x180"
 */
export interface ProductScoreBadgeProps {
  /** Which checks pass. Missing keys count as not met. */
  criteria: { dose?: boolean; tested?: boolean; disclosed?: boolean; form?: boolean };
  /** Show the criteria list beneath the count. Default true; false only in dense rows. */
  showBreakdown?: boolean;
  style?: React.CSSProperties;
}
