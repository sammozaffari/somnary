import React from 'react';

const SIZES = {
  hero:  { bar: 12, captionSize: 'var(--text-base)', showKey: true, gap: 'var(--space-3)' },
  thumb: { bar: 6, captionSize: 'var(--text-xs)', showKey: false, gap: 'var(--space-2)' },
  share: { bar: 20, captionSize: 'var(--text-lg)', showKey: true, gap: 'var(--space-4)' },
};

const papers = (n) => `${n} ${n === 1 ? 'paper' : 'papers'}`;

/* Copy is written independently per size — every string must survive being read cold,
   with no surrounding sentence. The noun is always present ("papers", never bare "5 of 14").
   "Verify" copy direction: the paper PUBLISHED results, and WE could VERIFY them. */

function longCaption3(cited, sleep, verifiable, subject) {
  const lead = subject ? `${subject}: ` : '';
  if (sleep === 0) return `${lead}${papers(cited)} on this remedy — none measured sleep.`;
  if (verifiable === 0) return `${lead}Of ${papers(cited)}, ${sleep} measured sleep, but none published results we could verify.`;
  return `${lead}Of ${papers(cited)}, ${sleep} measured sleep, and ${verifiable} published results we could verify.`;
}
function shortCaption3(cited, sleep, verifiable) {
  if (sleep === 0) return `None of ${papers(cited)} measured sleep`;
  if (verifiable === 0) return `${sleep} of ${papers(cited)} measured sleep — none we could verify`;
  return `${sleep} of ${papers(cited)} measured sleep; ${verifiable} we could verify`;
}
function longCaption2(cited, sleep, subject) {
  const lead = subject ? `${subject}: ` : '';
  if (sleep === 0) return `${lead}${papers(cited)} on this remedy — none measured sleep.`;
  return `${lead}${sleep} of ${papers(cited)} measured sleep.`;
}
function shortCaption2(cited, sleep, verifiable) {
  if (sleep === 0) return `None of ${papers(cited)} measured sleep`;
  if (verifiable === 0) return `${sleep} of ${papers(cited)} measured sleep — none we could verify`;
  return `${sleep} of ${papers(cited)} measured sleep; ${verifiable} we could verify`;
}
function verifyDetail(sleep, verifiable) {
  if (sleep === 0) return null;
  if (verifiable === 0) return `None of the ${sleep} published enough detail for us to verify their results.`;
  return `We could verify the results of ${verifiable} of those ${sleep}.`;
}
function directionLine(verifiable, helped) {
  if (helped == null || verifiable === 0) return null;
  if (verifiable === 1) return helped === 1 ? 'The one result we could verify found an improvement.' : `The one result we could verify didn't find an improvement.`;
  const who = helped === verifiable ? `all ${verifiable}` : helped === 0 ? 'none' : `${helped}`;
  return `Of the ${verifiable} results we could verify, ${who} found an improvement.`;
}

function KeyItem({ swatch, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-meta)', color: 'var(--text-body)' }}>
      <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 'var(--radius-xs)', flex: 'none', ...swatch }} />
      {label}
    </span>
  );
}

/** The research filter — the signature evidence visual. One nested bar; boundaries are
    transparent hairline gaps (structure, not tone). Two variants:
    'three' (default) — full track = papers cited · 35% = measured sleep · solid = published
    results we could verify. The third tier is the integrity promise made visible.
    'two' — bar carries cited / measured sleep only; the verify count moves to an expandable
    detail line beneath.
    Copy is authored per size, standalone; the noun is always present. Direction is one plain
    sentence (`helped`), never a chart. Honest at n=0 and n=20; sparse is the normal case.
    A serious-concern safety flag always outranks the visual. The muted remainder is always
    labelled exactly "didn't measure sleep" — never anything implying weak evidence. */
export function StudyField({ counts = { cited: 0, sleep: 0, verifiable: 0 }, helped, size = 'hero', variant = 'three', subject, safetyFlag, emptyText = 'No published papers yet.', style }) {
  const cfg = SIZES[size] || SIZES.hero;
  const { cited = 0, sleep = 0, verifiable = 0 } = counts;
  const [showDetail, setShowDetail] = React.useState(false);
  const flag = safetyFlag ? (
    <div role="alert" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline',
      background: 'var(--amber-tint)', border: 'var(--border-w) solid var(--amber-line)', borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-2) var(--space-3)', fontFamily: 'var(--font-sans)', fontSize: size === 'thumb' ? 'var(--text-xs)' : 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)', color: 'var(--text-body)' }}>
      <strong style={{ color: 'var(--amber)', fontWeight: 'var(--weight-strong)', whiteSpace: 'nowrap' }}>Safety concern —</strong>
      <span>{safetyFlag}</span>
    </div>
  ) : null;
  if (cited === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: cfg.gap, fontFamily: 'var(--font-sans)', ...style }}>
        {flag}
        <p style={{ margin: 0, fontSize: cfg.captionSize, color: 'var(--text-muted)' }}>{emptyText}</p>
      </div>
    );
  }
  const two = variant === 'two';
  const pct = (n) => `${Math.max((n / cited) * 100, 0)}%`;
  const ariaLabel = two ? longCaption2(cited, sleep, subject) : longCaption3(cited, sleep, verifiable, subject);
  const caption = size === 'thumb'
    ? (two ? shortCaption2(cited, sleep, verifiable) : shortCaption3(cited, sleep, verifiable))
    : (two ? longCaption2(cited, sleep, subject) : longCaption3(cited, sleep, verifiable, subject));
  const detail = two && size !== 'thumb' ? verifyDetail(sleep, verifiable) : null;
  const dir = size === 'thumb' ? null : directionLine(verifiable, helped);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: cfg.gap, fontFamily: 'var(--font-sans)', ...style }}>
      {flag}
      <div role="img" aria-label={ariaLabel}
        style={{ display: 'flex', gap: 'var(--border-w)', height: cfg.bar,
          borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
        {two ? (
          sleep > 0 && <span style={{ flex: 'none', width: pct(sleep), background: 'var(--evidence)' }} />
        ) : (
          <React.Fragment>
            {verifiable > 0 && <span style={{ flex: 'none', width: pct(verifiable), background: 'var(--evidence)' }} />}
            {sleep > verifiable && <span style={{ flex: 'none', width: pct(sleep - verifiable), background: 'var(--evidence)', opacity: 0.35 }} />}
          </React.Fragment>
        )}
        {cited > sleep && <span style={{ flex: 1, background: 'var(--surface-sunken)', boxShadow: 'inset 0 0 0 var(--border-w) var(--border-hairline)' }} />}
      </div>
      {cfg.showKey && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-5)' }}>
          {two ? (
            <KeyItem swatch={{ background: 'var(--evidence)' }} label="Measured sleep" />
          ) : (
            <React.Fragment>
              <KeyItem swatch={{ background: 'var(--evidence)' }} label="Results we could verify" />
              <KeyItem swatch={{ background: 'var(--evidence)', opacity: 0.35 }} label="Measured sleep" />
            </React.Fragment>
          )}
          <KeyItem swatch={{ background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)' }} label="Didn't measure sleep" />
        </div>
      )}
      <p style={{ margin: 0, fontSize: cfg.captionSize, fontVariantNumeric: 'tabular-nums',
        lineHeight: 'var(--leading-snug)', color: size === 'thumb' ? 'var(--text-muted)' : 'var(--text-body)', maxWidth: '56ch' }}>
        {caption}
      </p>
      {detail && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-1)' }}>
          <button type="button" onClick={() => setShowDetail(d => !d)} aria-expanded={showDetail}
            style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
              font: 'var(--weight-meta) var(--text-sm) var(--font-sans)', color: 'var(--text-link)',
              textDecoration: 'underline', textUnderlineOffset: 3 }}>
            {showDetail ? 'Hide how many we could verify' : 'Show how many we could verify'}
          </button>
          {showDetail && (
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums',
              lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)', maxWidth: '56ch' }}>{detail}</p>
          )}
        </div>
      )}
      {dir && (
        <p style={{ margin: 0, fontSize: cfg.captionSize, fontVariantNumeric: 'tabular-nums',
          lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)', maxWidth: '56ch' }}>
        {dir}
        </p>
      )}
    </div>
  );
}
