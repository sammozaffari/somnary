/**
 * Safety callout — calm, unmissable. Tinted left edge on a soft amber ground —
 * the shared "documented concern" edge language. Only for safety information
 * (interactions, pregnancy, condition warnings). Never used for emphasis.
 * Owns its own narrow behaviour: stacked by default, side-by-side only when
 * the component measures itself wide enough. Never author safety copy in
 * design files — placeholders only.
 * Also exported from this file: SafetyMark, LastChecked, DisclaimerBand.
 */
export interface SafetyCalloutProps {
  /** Shape-coded state: outlined mark for caution, filled for serious. Default "caution". */
  level?: 'caution' | 'serious';
  /** Amber lead-in label. Defaults per level: "Safety concern" / "Serious concern". */
  title?: string;
  /** The body, plain ink. In design files, always a [Placeholder — …] string. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
