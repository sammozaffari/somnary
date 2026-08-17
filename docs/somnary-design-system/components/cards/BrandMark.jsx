import React from 'react';

/** The image placeholder as a first-class component: a typographic mark — the brand's
    initial on a neutral ground. Most products will never have an image; this is the
    common case. Pass src when a real image exists. */
export function BrandMark({ name = '?', src, size = 40, radius = 'var(--radius-sm)', style }) {
  if (src) {
    return <img src={src} alt="" width={size} height={size}
      style={{ flex: 'none', width: size, height: size, objectFit: 'cover', borderRadius: radius,
        border: 'var(--border-w) solid var(--border-hairline)', background: 'var(--surface-sunken)', ...style }} />;
  }
  const initial = String(name).trim().charAt(0).toUpperCase() || '?';
  return (
    <span aria-hidden="true" style={{ flex: 'none', width: size, height: size, borderRadius: radius,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)',
      color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-strong)',
      fontSize: Math.round(size * 0.45), lineHeight: 1, ...style }}>
      {initial}
    </span>
  );
}
