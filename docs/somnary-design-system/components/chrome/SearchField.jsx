import React from 'react';

/** The search field — the site's primary object. Concentric geometry per the nested-radii
    rule: lg = outer --radius-lg + --space-1 padding all round → button --radius-md.
    sm = zero padding, button flush at full height → same radius as the outer (inner =
    outer − padding = outer). Keeps every part of the control at the 44px hit floor. */
export function SearchField({ placeholder = 'A remedy, a product, or a brand', value, onChange, onSubmit, size = 'lg', autoFocus = false, style }) {
  const [v, setV] = React.useState(value || '');
  const [focus, setFocus] = React.useState(false);
  const big = size === 'lg';
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(v); }}
      style={{ boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%', maxWidth: 'var(--search-max)',
        height: big ? 'var(--control-xl)' : 'var(--control-md)', padding: big ? 'var(--space-1)' : '0',
        background: 'var(--surface-card)',
        borderRadius: big ? 'var(--radius-lg)' : 'var(--radius-md)',
        border: 'var(--border-w) solid var(--border-strong)',
        outline: focus ? 'var(--focus-ring)' : 'none', outlineOffset: 'var(--focus-offset)',
        transition: 'border-color var(--dur-fast) var(--ease-settle)',
        borderColor: focus ? 'var(--ink)' : 'var(--border-input)', ...style }}>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ flex: 'none', color: 'var(--text-faint)', marginLeft: 'var(--space-3)' }}>
        <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <line x1="12.2" y1="12.2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input type="search" value={v} autoFocus={autoFocus} placeholder={placeholder} aria-label="Search Somnary"
        onChange={(e) => { setV(e.target.value); onChange && onChange(e.target.value); }}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          font: `400 ${big ? 'var(--text-lg)' : 'var(--text-base)'} var(--font-sans)`, color: 'var(--text-body)' }} />
      <button type="submit" style={{ boxSizing: 'border-box', height: big ? 'var(--control-lg)' : '100%', padding: '0 var(--space-5)',
        border: 'none', borderRadius: big ? 'var(--radius-md)' : 'var(--radius-md)',
        background: 'var(--ink)', color: 'var(--paper)',
        font: '600 var(--text-sm) var(--font-sans)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
        Look it up
      </button>
    </form>
  );
}
