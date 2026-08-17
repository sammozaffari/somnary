import React from 'react';

export const CRITERIA = [
  { key: 'dose',      label: 'Dose matches what studies used' },
  { key: 'tested',    label: 'Independently tested by a third party' },
  { key: 'disclosed', label: 'Label discloses everything' },
  { key: 'form',      label: 'The form that was actually studied' },
];

/* PLACEHOLDER RULE — needs an owner. The ONE definition of the product-verdict threshold:
   "passes" = at least this many of the four checks. Criteria are unlikely to be equally
   weighted (dose-match outranks label disclosure). Do not tune in design. Every consumer
   (ProductScoreBadge, VerdictPill in ProductListRow, the product-page verdict line) imports
   this constant — never a second copy. */
export const PASSES_THRESHOLD = 3;

function Mark({ met }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ flex: 'none', marginTop: 'var(--space-1)' }}>
      {met
        ? <path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" fill="none" stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        : <line x1="3" y1="7" x2="11" y2="7" stroke="var(--text-faint)" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

/** Product score: how many factual checks the bottle passes, with the breakdown visible. */
export function ProductScoreBadge({ criteria = {}, showBreakdown = true, style }) {
  const met = CRITERIA.filter(c => criteria[c.key]).length;
  const strong = met >= PASSES_THRESHOLD;
  const color = strong ? 'var(--sage-text)' : met >= 2 ? 'var(--bucket-maybe)' : 'var(--bucket-avoid)';
  const tint = strong ? 'var(--sage-tint)' : met >= 2 ? 'var(--bucket-maybe-tint)' : 'var(--bucket-avoid-tint)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-3)', fontFamily: 'var(--font-sans)', ...style }}>
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-2)', background: tint, color,
        borderRadius: 'var(--radius-pill)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1 }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{met} of {CRITERIA.length}</span> checks pass
      </span>
      {showBreakdown && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {CRITERIA.map(c => (
            <li key={c.key} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-snug)',
              color: criteria[c.key] ? 'var(--text-body)' : 'var(--text-muted)' }}>
              <Mark met={!!criteria[c.key]} />
              <span>{c.label}{!criteria[c.key] && <span style={{ color: 'var(--text-faint)' }}> — no</span>}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
