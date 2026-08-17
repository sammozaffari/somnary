/**
 * The paired ingredient + product verdict — the system's backbone. Two separate answers,
 * never merged into one score, with a serif one-sentence bottom line. "Worth buying" only
 * when BOTH are strong; the mismatch states are the most common and most useful results.
 * @startingPoint section="Verdicts" subtitle="Paired ingredient + product verdict" viewport="640x300"
 */
export interface PairedVerdictProps {
  /** Ingredient evidence bucket. */
  bucket: 'works' | 'maybe' | 'unknown' | 'avoid';
  /** Product checks (see ProductScoreBadge). 3+ met counts as a strong product. */
  criteria: { dose?: boolean; tested?: boolean; disclosed?: boolean; form?: boolean };
  /** e.g. "melatonin" — used in the questions and bottom line. */
  ingredientName?: string;
  /** Product display name; presence switches copy to "this bottle". */
  productName?: string;
  /** Bucket label wording. Default 'plain'. */
  naming?: 'plain' | 'evidence';
  /** Override the bucket's default sentence (e.g. when the default would assert findings the data doesn't contain). */
  bucketSentence?: string;
  style?: React.CSSProperties;
}
