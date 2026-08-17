import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { StudyField } from '../../components/evidence/StudyField.jsx';
import { BucketBadge, BUCKETS } from '../../components/verdicts/BucketBadge.jsx';
import { BucketShape } from '../../components/verdicts/BucketShape.jsx';
import { Breadcrumb } from '../../components/chrome/Breadcrumb.jsx';

/* Real audit data only. Bucket-default sentences are system copy; melatonin and kava carry
   their page-derived sentences. Use tags describe common use, never effectiveness; unaudited
   entries are marked placeholder. Bucket totals beyond the entered remedies render as
   dimmed "pending data entry" rows — never invented. */
const ENTRIES = [
  { key: 'melatonin', name: 'Melatonin', bucket: 'works', counts: { cited: 12, sleep: 5, verifiable: 3 },
    sentence: 'Helps most people fall asleep a little sooner — check your dose against what was studied.',
    uses: ['Falling asleep', 'Jet lag or shift work'], page: 'melatonin' },
  { key: 'magnesium', name: 'Magnesium', bucket: 'maybe', counts: { cited: 9, sleep: 2, verifiable: 2 },
    uses: ['Staying asleep'], page: 'magnesium' },
  { key: 'ltheanine', name: 'L-theanine', bucket: 'maybe', counts: { cited: 8, sleep: 2, verifiable: 2 },
    uses: ['Stress or racing mind', 'Falling asleep'] },
  { key: 'valerian', name: 'Valerian', bucket: 'unknown', counts: { cited: 11, sleep: 3, verifiable: 1 },
    uses: ['Falling asleep'], page: 'valerian' },
  { key: 'chamomile', name: 'Chamomile', bucket: 'unknown', counts: { cited: 6, sleep: 2, verifiable: 1 },
    uses: ['Falling asleep', 'Stress or racing mind'], page: 'chamomile' },
  { key: 'ashwagandha', name: 'Ashwagandha', bucket: 'unknown', counts: { cited: 7, sleep: 1, verifiable: 0 },
    uses: ['Stress or racing mind'], safetyFlag: '[Placeholder — real safety wording pending sourcing]' },
  { key: 'bacopa', name: 'Bacopa', bucket: 'unknown', counts: { cited: 0, sleep: 0, verifiable: 0 }, uses: [] },
  { key: 'taurine', name: 'Taurine', bucket: 'unknown', counts: { cited: 0, sleep: 0, verifiable: 0 }, uses: [] },
  { key: 'nopaper3', name: '[Placeholder — third no-paper remedy]', bucket: 'unknown', counts: { cited: 0, sleep: 0, verifiable: 0 }, uses: [] },
  { key: 'kava', name: 'Kava', bucket: 'unknown', counts: { cited: 5, sleep: 0, verifiable: 0 },
    safetyFlag: '[Placeholder — serious safety concern; final wording pending sourcing]',
    uses: ['Stress or racing mind'], page: 'kava' },
];
/* Bucket totals: only "unknown = 16 of 31" is audited; other totals are pending. */
const PENDING = {
  works: '[Placeholder — bucket total pending audit]',
  maybe: '[Placeholder — bucket total pending audit]',
  unknown: (shown) => `${16 - shown} more remedies sit here — entries pending data entry.`,
  avoid: '[Placeholder — bucket total pending audit]',
};
const FIX_CHIPS = ['Falling asleep', 'Staying asleep', 'Stress or racing mind', 'Jet lag or shift work'];
const BUCKET_ORDER = ['works', 'maybe', 'unknown', 'avoid'];

function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      style={{ minHeight: 'var(--control-md)', padding: '0 var(--space-4)', borderRadius: 'var(--radius-pill)',
        border: `var(--border-w) solid ${active ? 'var(--ink)' : 'var(--border-strong)'}`,
        background: active ? 'var(--surface-sunken)' : 'var(--surface-card)', color: 'var(--text-body)',
        font: `${active ? 'var(--weight-strong)' : 'var(--weight-ui)'} var(--text-sm) var(--font-sans)`, cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'background var(--dur-fast) var(--ease-settle), border-color var(--dur-fast) var(--ease-settle)' }}>
      {active && <span aria-hidden="true" style={{ marginRight: 'var(--space-2)' }}>✓</span>}{children}
    </button>
  );
}

function GradeLink({ bucket, goGrade }) {
  /* Every bucket badge on this page links to "How we grade" — methodology at the moment of doubt.
     Deep-links to the badge's own section. */
  return (
    <a href={'#' + bucket} onClick={(e) => { e.preventDefault(); goGrade(bucket); }} title="How we grade"
      aria-label={`${(BUCKETS[bucket] || BUCKETS.unknown).plain} — how we grade`} style={{ textDecoration: 'none' }}>
      <BucketBadge bucket={bucket} compact />
    </a>
  );
}

function Row({ entry, desktop, goRemedy, goGrade }) {
  const [hover, setHover] = React.useState(false);
  const b = BUCKETS[entry.bucket] || BUCKETS.unknown;
  const open = (e) => { e.preventDefault(); goRemedy(entry.page || 'melatonin'); };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: desktop ? 'grid' : 'flex', gridTemplateColumns: desktop ? 'minmax(0, 1fr) 240px' : undefined,
        flexDirection: desktop ? undefined : 'column', gap: 'var(--space-3) var(--space-6)',
        padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', alignItems: desktop ? 'center' : undefined,
        background: hover ? 'var(--surface-card)' : 'transparent', border: `var(--border-w) solid ${hover ? 'var(--border-hairline)' : 'transparent'}`,
        transition: 'background var(--dur-fast) var(--ease-settle)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-3)' }}>
          <a href="#remedy" onClick={open} style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-strong)',
            letterSpacing: 'var(--tracking-display)', color: 'var(--text-body)', textDecoration: 'none' }}>{entry.name}</a>
          <GradeLink bucket={entry.bucket} goGrade={goGrade} />
          {entry.safetyFlag && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--amber)' }}>Safety concern</span>}
        </div>
        <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)', maxWidth: '56ch' }}>
          {entry.sentence || b.sentence}
        </p>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {entry.uses.length ? `Mainly used for: ${entry.uses.join(' · ').toLowerCase()}` : 'Mainly used for: [placeholder — common uses pending audit]'}
        </p>
      </div>
      <StudyField size="thumb" counts={entry.counts} />
    </div>
  );
}

function ShareImage() {
  /* 1200×630 share image, shown at half scale. Only audited figures appear. */
  return (
    <div style={{ width: 600, height: 315, maxWidth: '100%', background: 'var(--paper)', border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-7)', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', overflow: 'hidden' }}>
      <Wordmark size={18} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p style={{ margin: 0, fontSize: 30, fontWeight: 'var(--weight-title)', letterSpacing: 'var(--tracking-display)',
          lineHeight: 'var(--leading-tight)', maxWidth: '18ch', textWrap: 'pretty' }}>
          Natural sleep remedies, graded by the evidence
        </p>
        <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          16 of 31 remedies: not properly tested for sleep.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-5)' }}>
        {BUCKET_ORDER.map(k => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: (BUCKETS[k]).color }}>
            <BucketShape bucket={k} size={13} />{BUCKETS[k].plain}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RemediesPage({ go, goRemedy, goGrade }) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 980px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 980px)');
    const f = (e) => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const [fixes, setFixes] = React.useState([]);
  const [hideFlagged, setHideFlagged] = React.useState(false);
  const [view, setView] = React.useState('grouped');
  const toggleFix = (f) => setFixes(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  const shown = ENTRIES.filter(e =>
    (fixes.length === 0 || e.uses.some(u => fixes.includes(u))) && (!hideFlagged || !e.safetyFlag));
  /* within a bucket the order is fixed: most evidence first (verifiable, then cited) —
     the grouping IS the primary order, so there is no sort control */
  const sorted = (list) => [...list].sort((a, b) => (b.counts.verifiable - a.counts.verifiable) || (b.counts.cited - a.counts.cited));
  const filtering = fixes.length > 0 || hideFlagged;
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' }}>
        {/* SYSTEM RULE: breadcrumbs on every page (root exempt) — the back affordance,
           never referrer-dependent; mobile truncates to "‹ Parent". */}
        <Breadcrumb mobile={!desktop} current="Remedies" trail={[{ label: 'Somnary', onClick: () => go('home') }]} />
        <h1 style={{ margin: 'var(--space-1) 0 var(--space-2)', fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)',
          letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)' }}>Every remedy, graded by the evidence</h1>
        <p style={{ margin: '0 0 var(--space-6)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>
          Grouped by what the studies show. The grade is about the ingredient — whether a specific bottle delivers it is scored on its own page.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', paddingBottom: 'var(--space-4)' }}>
          {FIX_CHIPS.map(f => <Chip key={f} active={fixes.includes(f)} onClick={() => toggleFix(f)}>{f}</Chip>)}
          <Chip active={hideFlagged} onClick={() => setHideFlagged(h => !h)}>Without safety flags</Chip>
          {/* view toggle — a joined segmented control, deliberately unlike the filter chips */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div role="group" aria-label="View" style={{ display: 'flex', border: 'var(--border-w) solid var(--border-strong)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
              {[['grouped', 'Grouped'], ['az', 'A–Z']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v}
                  style={{ minHeight: 'calc(var(--control-md) - 2 * var(--border-w))', padding: '0 var(--space-4)', border: 'none', cursor: 'pointer',
                    background: view === v ? 'var(--ink)' : 'var(--surface-card)', color: view === v ? 'var(--paper)' : 'var(--text-body)',
                    font: 'var(--weight-ui) var(--text-sm) var(--font-sans)' }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        {view === 'az' && (
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 'var(--space-3)', margin: '0 calc(-1 * var(--space-4))' }}>
            {[...shown].sort((a, b) => a.name.localeCompare(b.name)).map(e => <Row key={e.key} entry={e} desktop={desktop} goRemedy={goRemedy} goGrade={goGrade} />)}
          </div>
        )}
        {view === 'grouped' && BUCKET_ORDER.map(bk => {
          const entries = sorted(shown.filter(e => e.bucket === bk));
          const b = BUCKETS[bk];
          if (filtering && entries.length === 0) return null;
          return (
            <section key={bk} style={{ paddingTop: 'var(--space-7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderBottom: 'var(--border-w) solid var(--border-hairline)', paddingBottom: 'var(--space-3)' }}>
                <span style={{ color: b.color }}><BucketShape bucket={bk} size={18} /></span>
                <h2 style={{ margin: 0, fontSize: 'var(--display-sm)', fontWeight: 'var(--weight-heading)', letterSpacing: 'var(--tracking-display)' }}>{b.plain}</h2>
              </div>
              {bk === 'works' && (
                <p style={{ margin: 'var(--space-4) 0 0', padding: '0 var(--space-4)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>
                  Very few natural sleep remedies have been studied well enough to sit here.
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 'var(--space-3)', margin: '0 calc(-1 * var(--space-4))' }}>
                {entries.map(e => <Row key={e.key} entry={e} desktop={desktop} goRemedy={goRemedy} goGrade={goGrade} />)}
                {entries.length === 0 && !filtering && (
                  <p style={{ margin: 0, padding: 'var(--space-4)', fontSize: 'var(--text-base)', color: 'var(--text-muted)' }}>Nothing here yet.</p>
                )}
                {!filtering && (
                  <p style={{ margin: 0, padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>
                    {typeof PENDING[bk] === 'function' ? PENDING[bk](entries.length) : PENDING[bk]}
                  </p>
                )}
              </div>
            </section>
          );
        })}
        <p style={{ margin: 'var(--space-7) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-faint)', maxWidth: 'var(--measure)' }}>
          "Mainly used for" describes common use, not effectiveness. Grades link to <a href="#badges" onClick={(e) => { e.preventDefault(); goGrade(); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-ui)' }}>how we grade</a>.
        </p>
        <section style={{ marginTop: 'var(--space-9)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-6)' }}>
          <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-faint)' }}>
            Share image this page produces (1200 × 630, shown at half scale)
          </p>
          <ShareImage />
        </section>
      </main>
      <DisclaimerBand onGrade={goGrade} />
    </div>
  );
}
