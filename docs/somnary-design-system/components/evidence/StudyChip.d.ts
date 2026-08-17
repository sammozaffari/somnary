/**
 * The "see the study" chip and its popover. Technical vocabulary lives here (and only here),
 * but the finding itself is still one plain sentence. Every claim in the product carries one.
 * @startingPoint section="Evidence" subtitle="Claim-level citation chip with popover" viewport="380x260"
 */
export interface StudyChipProps {
  /** Chip text. Default "see the study". */
  label?: string;
  /** What the study found, one plain sentence. */
  finding: string;
  /** How many people it included. */
  people?: number;
  /** Publication year. */
  year?: number;
  /** Outbound link to the study. */
  url?: string;
  /** Link text, e.g. "read the review (19 studies)". */
  linkText?: string;
  /** Human date Somnary last verified the link works, e.g. "1 August 2026". */
  lastChecked?: string;
  /** Render with the popover open (for mocks). */
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}
