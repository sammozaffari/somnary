import React from 'react';
import { BucketShape } from '../verdicts/BucketShape.jsx';
import { BUCKETS } from '../verdicts/BucketBadge.jsx';
import { BrandMark } from './BrandMark.jsx';

/** Brand result row — a brand in search results: BrandMark, name, how many products assessed,
    and a quiet strip of their products' ingredient buckets. */
export function BrandResultRow({ name, image, productCount, buckets = [], href = '#', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 'var(--hit-target)',
        padding: 'var(--space-3) var(--space-4)', textDecoration: 'none', fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--radius-sm)', background: hover ? 'var(--surface-card)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-settle)', ...style }}>
      <BrandMark name={name} src={image} size={36} />
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-body)' }}>{name}</span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {productCount === 0 ? 'No products assessed yet' : <><span style={{ fontVariantNumeric: 'tabular-nums' }}>{productCount}</span> product{productCount === 1 ? '' : 's'} assessed</>}
        </span>
      </span>
      <span style={{ display: 'flex', gap: 'var(--space-1)' }} aria-label={buckets.length ? `Verdicts so far: ${buckets.join(', ')}` : undefined}>
        {buckets.slice(0, 6).map((b, i) => (
          <span key={i} style={{ color: (BUCKETS[b] || BUCKETS.unknown).color }}><BucketShape bucket={b} size={12} /></span>
        ))}
      </span>
      <span aria-hidden="true" style={{ color: 'var(--text-faint)', fontSize: 'var(--text-sm)' }}>›</span>
    </a>
  );
}
