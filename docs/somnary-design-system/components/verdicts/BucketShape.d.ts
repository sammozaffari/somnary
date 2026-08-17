/**
 * The shared evidence-bucket glyph. Shape coding means colour is never the only signal:
 * works = solid disc, maybe = half-filled disc, unknown = empty ring, avoid = struck ring.
 * Inherits colour from CSS currentColor.
 */
export interface BucketShapeProps {
  /** Which bucket. */
  bucket: 'works' | 'maybe' | 'unknown' | 'avoid';
  /** Pixel size of the square glyph. Default 16. */
  size?: number;
  /** Stroke width for outlined shapes. Default 1.6. */
  strokeWidth?: number;
  style?: React.CSSProperties;
}
