import React from 'react';
import { StudyChip } from './StudyChip.jsx';

/** The label-versus-studies row — the site's one choreographed motif. The bottle's claim
    renders first, a line draws through it, what the studies found fades in beneath. */
export function LabelVsStudies({ claim, found, chip, animate = true, delay = 300, style }) {
  const [phase, setPhase] = React.useState(animate ? 0 : 2);
  React.useEffect(() => {
    if (!animate) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setPhase(2); return; }
    const t1 = setTimeout(() => setPhase(1), delay);
    const t2 = setTimeout(() => setPhase(2), delay + 480);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animate, delay]);
  return (
    <div style={{ fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', alignSelf: 'flex-start' }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-body)' }}>
            “{claim}”
          </span>
          <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: '55%', height: 1.5,
            background: 'var(--bucket-avoid)', width: phase >= 1 ? '100%' : 0,
            transition: 'width var(--dur-reveal) var(--ease-settle)' }} />
        </span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>The label</span>
      </div>
      <div style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'none' : 'translateY(4px)',
        transition: 'opacity var(--dur-slow) var(--ease-fade), transform var(--dur-slow) var(--ease-settle)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-1) var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-ui)',
          letterSpacing: 'var(--tracking-display)', color: 'var(--text-body)', textWrap: 'pretty' }}>
          {found}
        </span>
        {chip && <StudyChip {...chip} />}
      </div>
    </div>
  );
}
