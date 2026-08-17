import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { Breadcrumb } from '../../components/chrome/Breadcrumb.jsx';
import { BucketBadge } from '../../components/verdicts/BucketBadge.jsx';

/* /safety — the page the whole site routes vulnerable readers to ("Taking medications,
   pregnant, or thinking about this for a child? Start here"). Read in worried moments,
   often at night, often as someone's first page — MOBILE FIRST, single column, calm.
   Register: a careful pharmacist, not a warning label. Warm, never alarming, never vague.
   COLOUR RULE: amber = the safety register ONLY; every other interface colour is ink.
   All medical content is [Placeholder — pending sourcing/medical review]; this ships the shape. */

/* Derived corpus view — the tri-state safety flag (none / caution / serious) made browsable.
   SAFETY NEVER MOVES A BUCKET, in either direction: kava is "Not properly tested for sleep"
   AND a serious concern — two separate facts, shown separately. REAL flags only: kava
   (serious) and ashwagandha (caution); the rest of the corpus is pending audit, and the
   pending state is shown, never hidden. */
const FLAGGED = [
  { key: 'kava', name: 'Kava', bucket: 'unknown', level: 'serious', line: '[Placeholder — serious safety concern; final wording pending sourcing]' },
  { key: 'ashwagandha', name: 'Ashwagandha', bucket: 'unknown', level: 'caution', line: '[Placeholder — real safety wording pending sourcing]' },
];

const SITUATIONS = [
  { id: 'medications', title: 'I take medications',
    why: '[Placeholder — why remedies and medications can interact, in plain words: same body, same pathways. Pending medical review.]',
    concerns: ['[Placeholder — interaction class: blood thinners, pending sourcing]', '[Placeholder — interaction class: antidepressants, pending sourcing]', '[Placeholder — interaction class: sedatives and sleeping pills, pending sourcing]'] },
  { id: 'pregnancy', title: "I'm pregnant or breastfeeding",
    why: '[Placeholder — why the evidence bar is higher here: most remedies are never tested in pregnancy, so "no known concern" means less. Pending medical review.]',
    concerns: ['[Placeholder — concern class: hormones and hormone-like remedies, pending sourcing]', '[Placeholder — concern class: herbs with no pregnancy data, pending sourcing]'] },
  { id: 'child', title: 'This is for a child',
    why: '[Placeholder — why child dosing is not scaled-down adult dosing, and why "natural" does not mean "gentle". Pending medical review.]',
    concerns: ['[Placeholder — concern class: melatonin and developing sleep rhythms, pending sourcing]', '[Placeholder — concern class: sweetened nightly products, pending sourcing]'] },
  { id: 'condition', title: 'I have a health condition',
    why: '[Placeholder — why liver, kidney, heart, and autoimmune conditions change what is safe. Pending medical review.]',
    concerns: ['[Placeholder — concern class: liver conditions, pending sourcing]', '[Placeholder — concern class: autoimmune conditions, pending sourcing]'] },
];

const SEE_DOCTOR = [
  '[Placeholder — sign: sleeplessness lasting beyond a stated stretch, pending medical review]',
  '[Placeholder — sign: snoring with gasping or long pauses, pending medical review]',
  '[Placeholder — sign: daytime symptoms that suggest something underlying, pending medical review]',
  '[Placeholder — sign: sleep problems alongside new medication, pending medical review]',
];

function useDesktop() {
  const [d, setD] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = (e) => setD(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return d;
}

/* native hash navigation — fires :target and respects the global scroll-margin-top,
   so a triage tap never lands the heading under sticky chrome */
function jump(e, id) {
  e.preventDefault();
  if (('#' + id) === location.hash) { history.replaceState(null, '', '#'); }
  location.hash = id;
}

const body = { margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', maxWidth: 'var(--measure)' };
const muted = { ...body, color: 'var(--text-muted)' };

/* Compact flagged-remedy row: name · bucket badge · flag label · one line, linking to the
   remedy's own safety section. The bucket badge and the flag sit side by side UNMERGED —
   the visual restatement that safety never moves a bucket. Hit area ≥ --control-md. */
function FlaggedRow({ r, goRemedy }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#remedy-safety" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.preventDefault(); goRemedy && goRemedy(r.key); /* should land on the remedy page's #safety section */ }}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minHeight: 'var(--control-md)', justifyContent: 'center',
        padding: 'var(--space-3) var(--space-3)', margin: '0 calc(-1 * var(--space-3))', borderRadius: 'var(--radius-sm)',
        textDecoration: 'none', color: 'var(--text-body)', background: hover ? 'var(--surface-sunken)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-settle)' }}>
      <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-3)' }}>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>{r.name}</span>
        <BucketBadge bucket={r.bucket} compact />
        {/* the flag LEVEL is the most important fact in the row — always named, amber
           register; serious is visually stronger (tinted pill) than caution (plain amber) */}
        {r.level === 'serious'
          ? <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--amber)', whiteSpace: 'nowrap',
              background: 'var(--amber-tint)', border: 'var(--border-w) solid var(--amber-line)', borderRadius: 'var(--radius-pill)',
              padding: 'var(--space-1) var(--space-3)', lineHeight: 1.2 }}>Serious concern</span>
          : <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--amber)', whiteSpace: 'nowrap' }}>Caution</span>}
        <span aria-hidden="true" style={{ marginLeft: 'auto', color: 'var(--text-faint)' }}>›</span>
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-snug)' }}>{r.line}</span>
    </a>
  );
}

function FlaggedList({ goRemedy }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-body)' }}>Remedies on this site with safety flags</p>
      {/* which flags matter for WHICH situation is a medical judgement — until it is reviewed,
         every flagged remedy is listed in every situation, and the pending state is stated */}
      <p style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>[Placeholder — which flags are relevant to this situation is pending medical review; until then, every flagged remedy is listed.]</p>
      {FLAGGED.map(r => <FlaggedRow key={r.key} r={r} goRemedy={goRemedy} />)}
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>[Placeholder — remaining corpus flags pending audit.]</p>
    </div>
  );
}

export function SafetyPage({ go, goRemedy, goGrade }) {
  const desktop = useDesktop();
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' }}>
        {/* SYSTEM RULE: breadcrumbs on every page (root exempt); mobile truncates to "‹ Parent". */}
        <Breadcrumb mobile={!desktop} current="Safety" trail={[{ label: 'Somnary', onClick: () => go('home') }]} />
        <h1 style={{ margin: 'var(--space-1) 0 var(--space-3)', fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)',
          letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)', textWrap: 'pretty' }}>Is it safe for you?</h1>
        <p style={muted}>
          Whether a sleep remedy is safe depends on who's taking it — medications, pregnancy, age, and health conditions all change the answer. Start from your situation.
        </p>

        {/* TRIAGE — the page's primary object, the way search is the homepage's: four calm,
           tappable routes, full-width on mobile. Interface colour is INK (no amber here —
           these are routes, not warnings). Hit areas ≥ --control-lg. */}
        <nav aria-label="Start here" style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr' : '1fr',
          gap: 'var(--space-3)', padding: 'var(--space-6) 0 var(--space-4)' }}>
          {SITUATIONS.map(s => (
            <a key={s.id} href={'#' + s.id} onClick={(e) => jump(e, s.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)',
                minHeight: 'var(--control-xl)', padding: 'var(--space-3) var(--space-4)', textDecoration: 'none',
                background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-body)', fontSize: 'var(--text-base)',
                fontWeight: 'var(--weight-strong)', lineHeight: 'var(--leading-snug)',
                transition: 'border-color var(--dur-fast) var(--ease-settle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hairline)'; }}>
              {s.title}
              <span aria-hidden="true" style={{ color: 'var(--text-faint)' }}>↓</span>
            </a>
          ))}
        </nav>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>None of these fit? Every remedy page has its own safety section.</p>

        {/* THE FOUR SECTIONS — one per situation; ids match the triage anchors */}
        {SITUATIONS.map(s => (
          <section key={s.id} id={s.id} style={{ marginTop: 'var(--space-8)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-8)' }}>
            <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
              letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' }}>{s.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <p style={body}>{s.why}</p>
              <div>
                <p style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)' }}>Worth checking in this situation</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {s.concerns.map((c, i) => (
                    <li key={i} style={{ padding: 'var(--space-3) 0', borderTop: 'var(--border-w) solid var(--border-hairline)',
                      fontSize: 'var(--text-base)', lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>{c}</li>
                  ))}
                </ul>
              </div>
              <FlaggedList goRemedy={goRemedy} />
            </div>
          </section>
        ))}

        {/* ESCALATION — unmissable on mobile without shouting: the amber register (safety
           only), full-width, plain sentences. No urgency theatre, no red. */}
        <section style={{ marginTop: 'var(--space-8)', background: 'var(--amber-tint)', border: 'var(--border-w) solid var(--amber-line)',
          borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
          <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
            letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)', color: 'var(--amber)' }}>
            See a doctor rather than a supplement aisle if…
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {SEE_DOCTOR.map((t, i) => (
              <li key={i} style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', maxWidth: 'var(--measure)' }}>{t}</li>
            ))}
          </ul>
          <p style={{ margin: 'var(--space-3) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>
            None of this is a diagnosis — it's the short list of moments where a professional beats a bottle.
          </p>
        </section>

        {/* HOW SAFETY WORKS — the tri-state flag, and the firewall between safety and evidence */}
        <section style={{ marginTop: 'var(--space-8)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-8)' }}>
          <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
            letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' }}>How safety works on Somnary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={body}>Every remedy carries one of three safety states, separate from its evidence grade:</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {/* "no known flag" is NEUTRAL, not green — green means an earned positive verdict, which absence of data is not */}
              <li style={{ ...body, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--text-body)', fontWeight: 'var(--weight-strong)' }}>No known flag</strong> — nothing documented at normal amounts. Not a guarantee.</li>
              <li style={{ ...body, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--amber)', fontWeight: 'var(--weight-strong)' }}>Caution</strong> — something documented is worth knowing before you start; the flag links to it.</li>
              <li style={{ ...body, color: 'var(--text-muted)' }}><strong style={{ color: 'var(--amber)', fontWeight: 'var(--weight-strong)' }}>Serious concern</strong> — documented risk of real harm. It renders above everything else on that remedy's page.</li>
            </ul>
            {/* THE FIREWALL, stated where readers will meet it: safety never moves a bucket, in either direction */}
            <p style={body}>
              A safety flag never changes an evidence grade, in either direction. Kava is the example: it's "Not properly tested for sleep" <em>and</em> it carries a serious concern — two separate facts, and each would be wrong to fold into the other.
            </p>
            <a href="#how-we-grade" onClick={(e) => { e.preventDefault(); goGrade && goGrade(); }}
              style={{ alignSelf: 'flex-start', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)', color: 'var(--text-link)' }}>
              The full method, in How we grade ›
            </a>
          </div>
        </section>
      </main>
      {/* the one extra line this page earns: bring the professional your whole picture */}
      <DisclaimerBand onGrade={goGrade}>
        Somnary is a reference, not medical advice. It can't know your health history or what else you take — a pharmacist or doctor can, so bring your situation to them rather than deciding from this page alone.
      </DisclaimerBand>
    </div>
  );
}
