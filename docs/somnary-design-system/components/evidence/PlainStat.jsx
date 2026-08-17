import React from 'react';
import { StudyChip } from './StudyChip.jsx';

/** A plain-language statistic at display scale — the finding in everyday words,
    figures in tabular lining figures, provenance in one quiet line beneath. */
/* CASING RULE: the figure carries the sentence's capital ("About 7 minutes"); `text` is a
   lower-case continuation ("faster to sleep, on average") — the two render as ONE sentence.
   A lowercase figure reads as a typo at display scale. */
export function PlainStat({ figure, text, source, chip, size = 'md', style }) {
  const fontSize = size === 'lg' ? 'var(--display-lg)' : size === 'sm' ? 'var(--display-sm)' : 'var(--display-md)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize, fontWeight: 'var(--weight-title)',
        letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)',
        fontVariantNumeric: 'tabular-nums', color: 'var(--text-body)', textWrap: 'pretty', maxWidth: '24ch' }}>
        {figure}{figure && text ? ' ' : ''}{text}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-1) var(--space-3)' }}>
        {source && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{source}</span>}
        {chip && <StudyChip {...chip} />}
      </div>
    </div>
  );
}
