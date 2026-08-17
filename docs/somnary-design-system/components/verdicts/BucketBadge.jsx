import React from 'react';
import { BucketShape } from './BucketShape.jsx';

export const BUCKETS = {
  /* Labels name SLEEP explicitly. Bucket 3 says why nobody knows — the remedy hasn't failed,
     the research hasn't been done. Bucket 4 means the research says no; risk is the separate
     safety flag, never implied by the bucket.
     RULE (locked): a bucket describes ONLY what the research shows about effectiveness.
     Safety NEVER moves a bucket, in either direction. "Tested — doesn't seem to help sleep"
     requires papers that measured sleep and found no effect — kava (0 sleep papers, serious
     safety concern) sits in "Not properly tested", with the flag carrying the warning. */
  works:   { plain: 'Helps most people sleep',  evidence: 'Strong evidence',      color: 'var(--bucket-works)',   tint: 'var(--bucket-works-tint)',
             sentence: 'Solid studies show a real, if modest, benefit for most adults.' },
  maybe:   { plain: 'May help sleep a little',  evidence: 'Some evidence',        color: 'var(--bucket-maybe)',   tint: 'var(--bucket-maybe-tint)',
             sentence: 'A few studies point to a small benefit; it may not do much for you.' },
  unknown: { plain: 'Not properly tested for sleep', evidence: 'Not enough evidence', color: 'var(--bucket-unknown)', tint: 'var(--bucket-unknown-tint)',
             sentence: "The research hasn't been done — that's a gap in the studies, not a verdict on the remedy." },
  avoid:   { plain: "Tested — doesn't seem to help sleep", evidence: 'Avoid',     color: 'var(--bucket-avoid)',   tint: 'var(--bucket-avoid-tint)',
             sentence: 'Decent studies looked and found little or no benefit for sleep.' },
};

/** Evidence-bucket badge. The explanatory sentence always displays beneath the label
    unless compact (chip-only, for dense rows where the sentence lives nearby). */
export function BucketBadge({ bucket = 'unknown', naming = 'plain', sentence, compact = false, style }) {
  const b = BUCKETS[bucket] || BUCKETS.unknown;
  const chip = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: b.tint, color: b.color,
      borderRadius: 'var(--radius-pill)', padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1 }}>
      <BucketShape bucket={bucket} size={14} />
      {b[naming] || b.plain}
    </span>
  );
  if (compact) return chip;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)', ...style }}>
      {chip}
      <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', maxWidth: '46ch' }}>
        {sentence || b.sentence}
      </p>
    </div>
  );
}
