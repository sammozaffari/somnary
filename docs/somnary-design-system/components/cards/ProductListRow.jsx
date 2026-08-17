import React from 'react';
import { BrandMark } from './BrandMark.jsx';
import { CRITERIA, PASSES_THRESHOLD } from '../verdicts/ProductScoreBadge.jsx';

/* The dense-list product row (C3): 104px square thumbnail · brand / name / strength ·
   the four checks · verdict pill. Hairline-separated rows, no cards. Chosen over an
   image-forward grid because the placeholder is the common case (most products will never
   have photography) and the checks are the reason the page exists.
   The checks are LABELLED IN PLACE at every size — a 2×2 grid of dot + short word — so a
   first-time visitor mid-scroll never needs a legend that has scrolled away.
   On mobile the verdict pill moves BENEATH the name — it is the most important thing in
   the row and must never be what disappears on a phone.
   All four assessment states get identical treatment: failing products are labelled,
   never hidden or visually punished. */

const SHORT = { dose: 'Dose', tested: 'Tested', disclosed: 'Full label', form: 'Studied form' };

function Dot({ met }) {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" style={{ flex: 'none' }}>
      {met
        ? <path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" fill="none" stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        : <line x1="3" y1="7" x2="11" y2="7" stroke="var(--text-faint)" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

function ChecksGrid({ criteria, style }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-1) var(--space-4)', ...style }}>
      {CRITERIA.map(c => (
        <li key={c.key} title={c.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)', whiteSpace: 'nowrap',
          color: criteria[c.key] ? 'var(--text-body)' : 'var(--text-muted)' }}>
          <Dot met={!!criteria[c.key]} />{SHORT[c.key]}
        </li>
      ))}
    </ul>
  );
}

export function VerdictPill({ criteria, status = 'assessed' }) {
  const pill = { display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-1)', borderRadius: 'var(--radius-pill)',
    padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap' };
  if (status === 'label-known') return <span style={{ ...pill, background: 'var(--surface-sunken)', color: 'var(--text-muted)', border: 'var(--border-w) solid var(--border-hairline)' }}>Not yet assessed</span>;
  if (status === 'not-in-db') return <span style={{ ...pill, background: 'var(--surface-sunken)', color: 'var(--text-muted)', border: 'var(--border-w) solid var(--border-hairline)' }}>Not in our database</span>;
  const met = CRITERIA.filter(c => criteria[c.key]).length;
  /* pill colour follows the ONE placeholder threshold — PASSES_THRESHOLD in ProductScoreBadge
     (needs an owner; do not tune in design). The amber/avoid steps below it are demo-only. */
  const color = met >= PASSES_THRESHOLD ? 'var(--sage-text)' : met >= 2 ? 'var(--bucket-maybe)' : 'var(--bucket-avoid)';
  const tint = met >= PASSES_THRESHOLD ? 'var(--sage-tint)' : met >= 2 ? 'var(--bucket-maybe-tint)' : 'var(--bucket-avoid-tint)';
  return (
    <span style={{ ...pill, background: tint, color }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{met} of {CRITERIA.length}</span> checks pass
    </span>
  );
}

/* SCHEMA RULE: name and strength are separate structured fields — the name NEVER contains
   the dose ("Melatonin melts" + "1 mg per melt", never "Melatonin melts 1 mg"). Baking the
   dose into the name renders it twice and breaks form/strength filtering. Drifted twice;
   enforce at the data boundary. */
export function ProductListRow({ brand, name, strength, criteria, status = 'assessed', src, mobile = false, onClick }) {
  const assessed = status === 'assessed';
  const statusLine = status === 'label-known' ? "We have the label, but haven't run the checks yet."
    : status === 'not-in-db' ? "Not in our database yet — tell us about it and we'll add it." : null;
  const nameBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-muted)' }}>{brand}</span>
      <a href="#product" onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
        style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-strong)', letterSpacing: 'var(--tracking-display)',
          color: 'var(--text-body)', textDecoration: 'none', lineHeight: 'var(--leading-snug)' }}>{name}</a>
      {strength && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{strength}</span>}
      {mobile && <span style={{ marginTop: 'var(--space-1)' }}><VerdictPill criteria={criteria} status={status} /></span>}
    </div>
  );
  if (mobile) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr)', gap: 'var(--space-3) var(--space-4)',
        padding: 'var(--space-4) 0', borderTop: 'var(--border-w) solid var(--border-hairline)', fontFamily: 'var(--font-sans)' }}>
        <BrandMark name={brand} src={src} size={104} radius="var(--radius-md)" />
        {nameBlock}
        {assessed
          ? <ChecksGrid criteria={criteria} style={{ gridColumn: '1 / -1' }} />
          : <p style={{ gridColumn: '1 / -1', margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{statusLine}</p>}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr) 230px 150px', alignItems: 'center',
      gap: 'var(--space-5)', padding: 'var(--space-4) 0', borderTop: 'var(--border-w) solid var(--border-hairline)', fontFamily: 'var(--font-sans)' }}>
      <BrandMark name={brand} src={src} size={104} radius="var(--radius-md)" />
      {nameBlock}
      {assessed
        ? <ChecksGrid criteria={criteria} />
        : <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{statusLine}</p>}
      <div style={{ justifySelf: 'end' }}><VerdictPill criteria={criteria} status={status} /></div>
    </div>
  );
}
