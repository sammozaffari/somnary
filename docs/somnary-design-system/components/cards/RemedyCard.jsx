import React from 'react';
import { BucketBadge } from '../verdicts/BucketBadge.jsx';
import { StudyField } from '../evidence/StudyField.jsx';

/** Remedy card — one ingredient: verdict, its plain sentence, and the research filter thumb.
    A safety flag on the research outranks the visual (rendered first by StudyField). */
/* SYSTEM RULE: every bucket badge links to "How we grade", deep-linked to its bucket section
   — methodology at the moment of doubt. The card is a stretched link (overlay anchor inside
   the title) so the badge's own link nests validly; pass onGrade to enable it. */
export function RemedyCard({ name, bucket = 'unknown', naming = 'plain', sentence, research = { counts: { cited: 0, sleep: 0, verifiable: 0 } }, safetyFlag, meta, href = '#', onClick, onGrade, gradeHref = '#how-we-grade', style }) {
  const [hover, setHover] = React.useState(false);
  const badge = <BucketBadge bucket={bucket} naming={naming} sentence={sentence} />;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
        background: 'var(--surface-card)', border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
        borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-5)',
        transition: 'border-color var(--dur-fast) var(--ease-settle)', fontFamily: 'var(--font-sans)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <a href={href} onClick={onClick} style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-strong)',
          letterSpacing: 'var(--tracking-display)', color: 'var(--text-body)', textDecoration: 'none' }}>
          {name}
          {/* stretched-link overlay — the whole card opens the remedy */}
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-md)' }}></span>
        </a>
        {meta && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{meta}</span>}
      </div>
      <StudyField size="thumb" counts={research.counts} safetyFlag={safetyFlag} />
      {onGrade
        ? <a href={gradeHref} title="How we grade" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onGrade(bucket); }}
            style={{ position: 'relative', zIndex: 1, alignSelf: 'flex-start', textDecoration: 'none' }}>{badge}</a>
        : badge}
    </div>
  );
}
