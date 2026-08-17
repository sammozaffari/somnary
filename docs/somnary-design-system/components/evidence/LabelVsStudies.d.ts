/**
 * The label-versus-studies reveal — the one choreographed motion motif. The claim renders,
 * a clay line draws through it (~450ms, settling ease), the studies' finding fades in beneath
 * with a "see the study" chip. Respects prefers-reduced-motion (renders final state).
 * @startingPoint section="Evidence" subtitle="Claim struck through, finding beneath" viewport="560x160"
 */
export interface LabelVsStudiesProps {
  /** What the bottle claims, verbatim, without quotes. */
  claim: string;
  /** What the studies found, one plain sentence (set in serif). */
  found: string;
  /** Props for the trailing StudyChip; omit for none. */
  chip?: object;
  /** Play the reveal on mount. Default true; false renders the final state. */
  animate?: boolean;
  /** ms before the strike draws. Default 300. */
  delay?: number;
  style?: React.CSSProperties;
}
