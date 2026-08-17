import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { RemedyCard } from '../../components/cards/RemedyCard.jsx';
import { LabelVsStudies } from '../../components/evidence/LabelVsStudies.jsx';

/* /problems/waking-at-3am — a Google landing page, not a nav destination. The reader arrives
   at 3am on a phone knowing nothing about Somnary: orientation in one line, answer structure
   immediately, never a diagnosis, never a recommendation. All medical/effectiveness copy is
   [placeholder] pending medical review — the design ships the shape, not the claims. */

const body = { margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', maxWidth: 'var(--measure)' };
const muted = { ...body, color: 'var(--text-muted)' };
const h2 = { margin: '0 0 var(--space-4)', fontSize: 'var(--display-sm)', fontWeight: 'var(--weight-heading)', letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' };

/* Audited remedies whose common use covers staying asleep / night waking. None sit in the
   top bucket — the honest order puts that fact first. */
const RELEVANT = [
  { key: 'magnesium', name: 'Magnesium', bucket: 'maybe', counts: { cited: 9, sleep: 2, verifiable: 2 } },
  { key: 'valerian', name: 'Valerian', bucket: 'unknown', counts: { cited: 11, sleep: 3, verifiable: 1 } },
  { key: 'chamomile', name: 'Chamomile', bucket: 'unknown', counts: { cited: 6, sleep: 2, verifiable: 1 } },
];

function Orientation() {
  return (
    <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', maxWidth: '48ch' }}>
      Somnary is an independent reference on sleep remedies — no company pays us, and every claim links to the study behind it.
    </p>
  );
}

function DoctorCard() {
  return (
    <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: 'var(--measure)' }}>
      <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>When it's worth seeing a doctor</p>
      <p style={muted}>[Placeholder — plain-language list of signs that this is worth a conversation with a doctor, pending medical review. Calm, specific, no urgency theatre.]</p>
    </div>
  );
}

export function ProblemPage({ go, goRemedy, goGrade, preview = false }) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = (e) => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const container = { flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' };
  const top = (
    <React.Fragment>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go && go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        {!preview && <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />}
      </header>
      <div style={{ maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: '0 var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          {/* problems have no index page yet — the parent route is home's situation cards */}
          <Breadcrumb mobile={!desktop} current="I keep waking at 3am" trail={[{ label: 'Problems', onClick: () => go && go('home') }]} />
          <h1 style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)',
            letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)', textWrap: 'pretty' }}>
            I keep waking up at 3am
          </h1>
        </div>
        <Orientation />
        {/* Doctor card ABOVE the explanation — deliberate: a reader with a possible medical
           problem should meet the off-ramp before the explanation, not after it. */}
        <DoctorCard />
        <p style={body}>[Placeholder — two short paragraphs on what's usually going on when sleep breaks in the middle of the night: written plainly, pending medical review. No diagnosis; an explanation of a situation.]</p>
      </div>
    </React.Fragment>
  );
  if (preview) return <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>{top}</div>;
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {top}
      <main style={container}>
        <section style={{ paddingTop: 'var(--space-9)' }}>
          <h2 style={h2}>What actually has evidence for this</h2>
          <p style={{ ...muted, marginBottom: 'var(--space-4)' }}>
            Ordered by evidence. Nothing sits in the top bucket for this problem — that's the honest picture.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {RELEVANT.map(r => (
              <RemedyCard key={r.key} name={r.name} bucket={r.bucket} research={{ counts: r.counts }}
                href="#remedy" onClick={(e) => { e.preventDefault(); goRemedy(r.key); }} onGrade={goGrade} />
            ))}
          </div>
        </section>

        <section style={{ paddingTop: 'var(--space-9)' }}>
          <h2 style={h2}>Often recommended for this — and what the studies say</h2>
          <div style={{ padding: 'var(--space-5)', background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
            borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 'var(--measure)' }}>
            <LabelVsStudies claim="Take melatonin when you wake at 3am"
              found="[Placeholder — what the verified studies measured, pending write-up]"
              chip={{ finding: '[Placeholder — finding pending write-up]', linkText: 'Read the study' }} />
            <LabelVsStudies animate={false} claim="A nightcap helps you sleep through"
              found="[Placeholder — what the studies found, pending write-up]"
              chip={{ finding: '[Placeholder — finding pending write-up]', linkText: 'Read the study' }} />
          </div>
        </section>

        <section style={{ paddingTop: 'var(--space-9)' }}>
          <h2 style={h2}>Things that aren't supplements</h2>
          <p style={{ ...muted, marginBottom: 'var(--space-4)' }}>Some non-supplement approaches have better evidence than most supplements do.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 'var(--measure)' }}>
            <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>CBT-I — cognitive behavioural therapy for insomnia</p>
              <p style={{ ...muted, marginTop: 'var(--space-1)' }}>A structured programme for changing how you sleep, usually over a few weeks. [Placeholder — evidence summary pending write-up.]</p>
            </div>
            <p style={{ ...muted, fontSize: 'var(--text-sm)' }}>[Placeholder — further non-supplement approaches pending medical review.]</p>
          </div>
        </section>

        <section style={{ paddingTop: 'var(--space-9)' }}>
          <h2 style={h2}>If you're considering a bottle</h2>
          <a href="#remedies" onClick={(e) => { e.preventDefault(); go('remedies'); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 'var(--control-md)',
              padding: '0 var(--space-5)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)',
              border: 'var(--border-w) solid var(--border-strong)', textDecoration: 'none',
              font: 'var(--weight-strong) var(--text-base) var(--font-sans)', color: 'var(--text-body)' }}>
            See which products deliver what was studied ›
          </a>
          <p style={{ ...muted, fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>Every product gets the same four checks — including the ones we'd tell you to skip.</p>
        </section>

        {/* review artifacts */}
        <section style={{ marginTop: 'var(--space-10)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-6)' }}>
          <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-faint)' }}>
            Share image this page produces (1200 × 630, shown at half scale)
          </p>
          <div style={{ width: 600, height: 315, maxWidth: '100%', background: 'var(--paper)', border: 'var(--border-w) solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)', padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Wordmark size={18} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <p style={{ margin: 0, fontSize: 34, fontWeight: 'var(--weight-title)', letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)', maxWidth: '16ch' }}>
                I keep waking up at 3am
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '38ch' }}>
                What actually has evidence — every claim linked to its study.
              </p>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>An independent reference. No company pays us.</span>
          </div>
        </section>
        <section style={{ marginTop: 'var(--space-8)' }}>
          <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-faint)' }}>
            Above the fold on a phone (390 × 720) — how nearly everyone arrives
          </p>
          <div style={{ width: 390, maxWidth: '100%', height: 720, overflow: 'hidden', background: 'var(--surface-page)',
            border: 'var(--border-w) solid var(--border-strong)', borderRadius: 'var(--radius-lg)' }}>
            <ProblemPage preview go={go} goRemedy={goRemedy} goGrade={goGrade} />
          </div>
        </section>
      </main>
      <DisclaimerBand onGrade={goGrade} />
    </div>
  );
}
