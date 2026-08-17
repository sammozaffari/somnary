import React from 'react';

/** Where to buy — retailer, price if known, outbound link. Deliberately identical on a
    well-scoring product and on one the site advises against: same component, same weight.
    One-line disclosure sits beneath. */
export function WhereToBuyRow({ retailer, price, url = '#', disclosure, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      <a href={url} target="_blank" rel="noopener" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 'var(--hit-target)',
          padding: 'var(--space-3) var(--space-4)', textDecoration: 'none', background: 'var(--surface-card)',
          border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
          borderRadius: 'var(--radius-sm)', transition: 'border-color var(--dur-fast) var(--ease-settle)' }}>
        <span style={{ flex: 1, fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-body)' }}>{retailer}</span>
        {price && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{price}</span>}
        <span aria-hidden="true" style={{ color: 'var(--text-link)', fontWeight: 600 }}>↗</span>
      </a>
      {disclosure && (
        <p style={{ margin: 0, padding: '0 var(--space-4)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)' }}>{disclosure}</p>
      )}
    </div>
  );
}
