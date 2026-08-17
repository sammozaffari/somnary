/**
 * The ingredient verdict badge — one of four evidence buckets, letter-free,
 * shape + colour + label, with its one plain explanatory sentence always beneath.
 * @startingPoint section="Verdicts" subtitle="Bucket badge with its plain sentence" viewport="420x110"
 */
export interface BucketBadgeProps {
  bucket: 'works' | 'maybe' | 'unknown' | 'avoid';
  /** Label wording: 'plain' ("Helps most people sleep") or 'evidence' ("Strong evidence"). Default plain. */
  naming?: 'plain' | 'evidence';
  /** Override the default explanatory sentence (keep it one plain sentence). */
  sentence?: string;
  /** Chip only, no sentence — ONLY for dense rows where the sentence appears nearby. */
  compact?: boolean;
  style?: React.CSSProperties;
}
