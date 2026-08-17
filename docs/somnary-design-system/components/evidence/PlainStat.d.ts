/**
 * A plain-language statistic at display scale — the finding in everyday words, display face,
 * figures as tabular lining figures (never mono), provenance beneath. Never a bare number;
 * never technical vocabulary.
 * @startingPoint section="Evidence" subtitle="Display-scale plain-language stat" viewport="560x220"
 */
export interface PlainStatProps {
  /** The measurement itself, e.g. "about 7 minutes". */
  figure: string;
  /** The rest of the sentence in everyday words, e.g. "faster to sleep, on average". */
  text?: string;
  /** Provenance line, e.g. "from a review of 19 studies covering 1,683 people". */
  source?: string;
  /** Props for a trailing StudyChip. */
  chip?: object;
  /** Display size. Default 'md' (38px); 'lg' 52px, 'sm' 28px. */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
