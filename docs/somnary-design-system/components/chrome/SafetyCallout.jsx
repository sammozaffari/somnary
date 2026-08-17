import React from 'react';

/* CONTENT RULE — THE ONE THAT HAS DRIFTED THREE TIMES; enforced here because a comment on
   the component is the mechanism that has actually held. NEVER author a health or safety
   claim in a design file. Drift history: (1) "Linked to serious liver injury in rare
   cases" authored for kava in demo/prompt files at system creation; (2) re-introduced in
   bundle-20 kit data after the first sweep; (3) "Valerian can add to the effect of
   sleeping pills…" authored in this file's own demo. All safety copy in design files is
   "[Placeholder — … pending sourcing/medical review]" — no exceptions for plausible,
   "well-known", or paraphrased claims. */

/* Shape-coded safety mark — caution = outlined triangle, serious = filled triangle:
   legible in greyscale, so colour is never the only signal (same principle as BucketShape). */
export function SafetyMark({ level = 'caution', size = 13, style }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 14 14" style={{ flex: 'none', display: 'block', ...style }}>
      <path d="M7 1.8 L13 12.2 H1 Z" fill={level === 'serious' ? 'var(--amber)' : 'none'} stroke="var(--amber)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Safety callout — calm, unmissable. Tinted-left-edge on a soft amber ground: the same
    edge language as ingredient "worth knowing / documented concern" flags and failing
    checks — one visual form means "documented concern" everywhere.
    A serious-concern safety flag always outranks any evidence visual. */
/* LAYOUT RULE — the component owns its narrow behaviour. Stacked (label row above
   full-width ink body) is the BASE; the inline side-by-side variant renders only above a
   width threshold measured INSIDE the component, so no container can ever squeeze the body
   into a one-word column. This form broke in three contexts when pages owned the layout. */
export function SafetyCallout({ level = 'caution', title, children, style }) {
  const [wide, setWide] = React.useState(false);
  const roRef = React.useRef(null);
  /* measure via ref callback, not an effect: it fires the moment the node exists (and again
     on remount), with an immediate synchronous measure plus a ResizeObserver for live
     resizes — the effect-based version silently never ran under the card runtime */
  const attach = React.useCallback((node) => {
    if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }
    if (!node) return;
    const apply = (w) => setWide(w >= 480);
    apply(node.getBoundingClientRect().width);
    if (typeof ResizeObserver !== 'undefined') {
      roRef.current = new ResizeObserver((entries) => apply(entries[0].contentRect.width));
      roRef.current.observe(node);
    }
  }, []);
  const label = title || (level === 'serious' ? 'Serious concern' : 'Safety concern');
  const labelRow = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', whiteSpace: wide ? 'nowrap' : 'normal' }}>
      <SafetyMark level={level} />
      <strong style={{ color: 'var(--amber)', fontWeight: 'var(--weight-strong)' }}>{label}</strong>
    </span>
  );
  return (
    <div ref={attach} role="note" style={{ background: 'var(--amber-tint)', borderLeft: '3px solid var(--amber)',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-4) var(--space-5)', fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)',
      display: wide ? 'grid' : 'flex', gridTemplateColumns: 'auto minmax(0, 1fr)', flexDirection: 'column',
      gap: wide ? 'var(--space-1) var(--space-4)' : 'var(--space-2)', alignItems: 'baseline', ...style }}>
      {labelRow}
      <span style={{ minWidth: 0 }}>{children}</span>
    </div>
  );
}

/** "Last checked {date}" tag — quiet, tabular figures, human date ("14 July 2026"), never ISO. */
export function LastChecked({ date, prefix = 'Last checked', style }) {
  return (
    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-faint)',
      whiteSpace: 'nowrap', ...style }}>
      {prefix} {date}
    </span>
  );
}

/** Disclaimer band — quiet page-bottom strip; states the site's limits without ceremony. */
/* SYSTEM RULE: "How we grade" is not in the nav — it is reached from every bucket badge and
   from the footer; the optional onGrade link here is that footer route on every page. */
export function DisclaimerBand({ children, onGrade, style }) {
  return (
    <div style={{ background: 'var(--surface-sunken)', borderTop: 'var(--border-w) solid var(--border-hairline)',
      padding: 'var(--space-4) var(--space-5)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', textAlign: 'center', textWrap: 'pretty', ...style }}>
      {children || <>Somnary is a reference, not medical advice. It can't know your health history — a pharmacist or doctor can. No supplement company pays us, and no brand can influence a score.</>}
      {onGrade && <>{' '}<a href="#how-we-grade" onClick={(e) => { e.preventDefault(); onGrade(); }}
        style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-ui)' }}>How we grade</a></>}
    </div>
  );
}
