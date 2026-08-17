import React from 'react';
import { BucketBadge } from '../verdicts/BucketBadge.jsx';
import { ProductScoreBadge, CRITERIA } from '../verdicts/ProductScoreBadge.jsx';
import { BrandMark } from './BrandMark.jsx';

/** Product card with three completeness states: fully assessed / label known but not yet
    assessed / not in database. Incomplete states are stated plainly, never dressed up.
    A product carries either a strength ("1 mg") or a blend descriptor — on its own line,
    never duplicated into the name. */
export function ProductCard({ name, brand, strength, blend, image, state = 'assessed', bucket, criteria = {}, lastChecked, href = '#', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const base = { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', textDecoration: 'none',
    background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)',
    fontFamily: 'var(--font-sans)', transition: 'border-color var(--dur-fast) var(--ease-settle)', ...style };
  const head = (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
      <BrandMark name={brand} src={image} size={40} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-muted)' }}>{brand}</span>
        <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-strong)',
          letterSpacing: 'var(--tracking-display)', color: 'var(--text-body)', lineHeight: 'var(--leading-snug)' }}>{name}</span>
        {(strength || blend) && (
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-meta)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>
            {strength || `Blend — ${blend}`}
          </span>
        )}
      </div>
    </div>
  );
  if (state === 'notFound') {
    return (
      <div style={{ ...base, border: 'var(--border-w) dashed var(--border-strong)', boxShadow: 'none', background: 'transparent' }}>
        {head}
        <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)' }}>
          We haven't looked at this product yet — it isn't in our database.
        </p>
        <a href={href} onClick={onClick} style={{ font: '600 var(--text-sm) var(--font-sans)', color: 'var(--text-link)' }}>Ask us to check it</a>
      </div>
    );
  }
  if (state === 'labelOnly') {
    return (
      <a href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ ...base, border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`, boxShadow: 'var(--shadow-card)' }}>
        {head}
        <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--surface-sunken)',
          color: 'var(--text-muted)', borderRadius: 'var(--radius-pill)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', lineHeight: 1 }}>
          Label known — not yet assessed
        </span>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)' }}>
          We know what's on the label, but we haven't checked it against the studies yet.
        </p>
      </a>
    );
  }
  return (
    <a href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`, boxShadow: 'var(--shadow-card)' }}>
      {head}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {bucket && <BucketBadge bucket={bucket} compact />}
        <ProductScoreBadge criteria={criteria} showBreakdown={false} />
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {CRITERIA.map(c => (
          <li key={c.key} style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-snug)', display: 'flex', gap: 'var(--space-2)',
            color: criteria[c.key] ? 'var(--text-body)' : 'var(--text-muted)' }}>
            <span aria-hidden="true" style={{ color: criteria[c.key] ? 'var(--sage)' : 'var(--text-faint)', fontWeight: 'var(--weight-strong)' }}>{criteria[c.key] ? '✓' : '—'}</span>
            {c.label}
          </li>
        ))}
      </ul>
      {lastChecked && <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-meta)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-faint)' }}>Last checked {lastChecked}</span>}
    </a>
  );
}
