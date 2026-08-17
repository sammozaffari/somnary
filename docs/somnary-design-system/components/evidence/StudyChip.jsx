import React from 'react';

/** "See the study" chip + its popover: the finding in one plain sentence, how many people,
    what year, a link out, and when Somnary last checked the link works. */
export function StudyChip({ label = 'See the study', finding, people, year, url = '#', linkText = 'Read the study', lastChecked, defaultOpen = false, style }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block', fontFamily: 'var(--font-sans)', ...style }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 'var(--space-7)',
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-pill)', border: 'var(--border-w) solid var(--border-strong)',
          background: open ? 'var(--surface-sunken)' : 'transparent', color: 'var(--text-link)',
          font: '600 var(--text-sm) var(--font-sans)', cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'background var(--dur-fast) var(--ease-settle)' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="3.5" fill="currentColor" opacity="0.8"/></svg>
        {label}
      </button>
      {open && (
        <span role="dialog" aria-label="Study details"
          style={{ position: 'absolute', zIndex: 30, top: 'calc(100% + var(--space-2))', left: 0, width: 'var(--popover-w)', display: 'block',
            background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-pop)', padding: 'var(--space-4)' }}>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)' }}>{finding}</span>
          <span style={{ display: 'block', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>
            {people ? `${people.toLocaleString()} people` : null}{people && year ? ' · ' : ''}{year || null}
          </span>
          <a href={url} target="_blank" rel="noopener" style={{ display: 'inline-block', marginTop: 'var(--space-3)',
            font: '600 var(--text-sm) var(--font-sans)', color: 'var(--text-link)' }}>{linkText} ↗</a>
          {lastChecked && (
            <span style={{ display: 'block', marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: 'var(--border-w) solid var(--border-hairline)',
              fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-faint)' }}>
              Link last checked {lastChecked}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
