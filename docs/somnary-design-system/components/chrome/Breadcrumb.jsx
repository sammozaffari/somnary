import React from 'react';

/* SYSTEM RULE: breadcrumbs on every page, always — the back affordance, never a
   referrer-dependent "back" link. Desktop: the full trail (Products › Brand › Product),
   current page unlinked. Mobile: truncate to the parent only ("‹ Products").
   trail: [{label, onClick}, ...] parents in order; current: string. */
export function Breadcrumb({ trail, current, mobile }) {
  const link = { color: 'var(--text-link)', fontWeight: 'var(--weight-ui)' };
  const parent = trail[trail.length - 1];
  return (
    <p style={{ margin: 'var(--space-5) 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-ui)', color: 'var(--text-muted)' }}>
      {mobile ? (
        <a href="#up" onClick={(e) => { e.preventDefault(); parent.onClick(); }} style={link}>&#8249; {parent.label}</a>
      ) : (
        <React.Fragment>
          {trail.map(t => (
            <React.Fragment key={t.label}>
              <a href="#up" onClick={(e) => { e.preventDefault(); t.onClick(); }} style={link}>{t.label}</a>
              {' \u203a '}
            </React.Fragment>
          ))}
          <span>{current}</span>
        </React.Fragment>
      )}
    </p>
  );
}
