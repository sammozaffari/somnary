import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { SafetyCallout, LastChecked, DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { StudyField } from '../../components/evidence/StudyField.jsx';
import { PlainStat } from '../../components/evidence/PlainStat.jsx';
import { LabelVsStudies } from '../../components/evidence/LabelVsStudies.jsx';
import { StudyChip } from '../../components/evidence/StudyChip.jsx';
import { Breadcrumb } from '../../components/chrome/Breadcrumb.jsx';
import { BucketBadge } from '../../components/verdicts/BucketBadge.jsx';
/* PairedVerdict is deliberately NOT imported: a component answering two questions is
   redundant where one answer IS the page — it never appears on an ingredient's own
   remedy page or its filtered lists (interface-economy rule). */
import { ProductScoreBadge, CRITERIA } from '../../components/verdicts/ProductScoreBadge.jsx';
import { ProductListRow } from '../../components/cards/ProductListRow.jsx';
import { BrandMark } from '../../components/cards/BrandMark.jsx';

/* ---- data: real audit figures only; everything else is marked placeholder ----
   EMPTINESS IS DERIVED FROM THE DATA, never hardcoded per remedy:
   · counts.sleep === 0      → the "what does it do" / dose / label sections have nothing
                               evidence-backed to show; each states its absence in one
                               sentence derived from the counts; the TOC keeps the entry, dimmed.
   · counts.verifiable === 0 → "Does it work?" states what that means instead of showing findings.
   · safetySerious === true  → safety is the page's dominant element: the flag renders under the
                               h1 at a larger register, the safety section leads with "Serious
                               safety concern.", and the products list repeats the warning above it.
   · products/papers NEVER disappear — Somnary lists every product, including ones it advises
     against, assessed on the same criteria (locked decision; same reason the where-to-buy row
     is identical on good and bad products). Papers are always listed, grouped by tier.
   · reports.length === 0    → the section states "No accounts collected yet." */
const NOTE_REVIEW = {
  finding: 'People taking melatonin fell asleep about 7 minutes sooner, on average, than people taking a placebo.',
  people: 1683, year: 2013, url: '#', linkText: 'Read the review (19 studies)', lastChecked: '14 July 2026', id: '[PMID placeholder]',
};
const MELATONIN = {
  key: 'melatonin', name: 'Melatonin',
  sub: 'A hormone your body makes in the evening · also sold as a supplement',
  bucket: 'works',
  verdict: 'Helps most people fall asleep a little sooner — check your dose against what was studied.',
  safetyFlag: '[Placeholder — interaction summary pending sourcing]',
  safetySerious: false,
  counts: { cited: 12, sleep: 5, verifiable: 3 },
  helpedNote: '[Placeholder — of the 3 verified results, how many found an improvement is pending adjudication.]',
  lastChecked: '14 July 2026',
  products: [
    /* [PLACEHOLDER SCORING RULE — NEEDS AN OWNER, do not ship as policy] — the "pass"
       threshold behind these demo entries and the verdict pill is PASSES_THRESHOLD in
       ProductScoreBadge (one definition, both consumers import it); criteria are unlikely
       to be equally weighted. */
    /* SCHEMA RULE: product name and strength are separate fields — the name never contains the dose. */
    { brand: 'Somnia Labs', product: 'Melatonin', strength: '1 mg per capsule', src: '../../assets/demo-product-photo-1.png', criteria: { dose: true, tested: true, disclosed: true, form: true } },
    { brand: 'Nightcap Co', product: 'Melatonin drops', strength: '0.5 mg per dropper', criteria: { dose: true, tested: true, disclosed: true, form: true } },
    { brand: 'Dreamwell', product: 'Melatonin melts', strength: '1 mg per melt', criteria: { dose: true, tested: true, disclosed: true, form: true } },
  ],
  /* demo counts — the section shows only pass-all products and links to the full list */
  productStats: { checked: 12, pass: 3 },
  reports: ['[Placeholder — reader account pending collection.]', '[Placeholder — reader account pending collection.]'],
  papers: {
    verified: [
      { type: 'review of several studies', finding: NOTE_REVIEW.finding, meta: '1,683 people · 2013 · [PMID placeholder]', note: NOTE_REVIEW },
      { type: 'trial', finding: '[Placeholder — finding pending write-up]', meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]' },
      { type: 'observational study', finding: '[Placeholder — finding pending write-up]', meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]' },
    ],
    measuredOnly: [
      { type: 'trial', finding: '[Placeholder — finding pending write-up]', meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]' },
      { type: 'observational study', finding: '[Placeholder — finding pending write-up]', meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]' },
    ],
    nonSleep: 7,
  },
};
const KAVA = {
  key: 'kava', name: 'Kava',
  sub: '[Placeholder one-line description]',
  bucket: 'unknown',
  verdict: 'No published paper has measured whether kava helps sleep — and there is a serious safety concern.',
  safetyFlag: '[Placeholder — serious safety concern; final wording pending sourcing]',
  safetySerious: true,
  counts: { cited: 5, sleep: 0, verifiable: 0 },
  lastChecked: '14 July 2026',
  products: [],
  productStats: { checked: 2, pass: 0 },
  reports: [],
  papers: { verified: [], measuredOnly: [], nonSleep: 5 },
};

/* Minimal datasets for the problem-page row — audited counts; all copy placeholder. */
function stub(key, name, bucket, counts, papers) {
  return {
    key, name, bucket, counts, papers,
    sub: '[Placeholder one-line description]',
    verdict: '[Placeholder — one-line verdict pending write-up]',
    safetyFlag: null, safetySerious: false,
    helpedNote: counts.verifiable > 0 ? '[Placeholder — direction of verified results pending adjudication.]' : null,
    lastChecked: '14 July 2026', products: [], reports: [],
  };
}
const ph = { type: '[study type placeholder]', finding: '[Placeholder — finding pending write-up]', meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]' };
const MAGNESIUM = stub('magnesium', 'Magnesium', 'maybe', { cited: 9, sleep: 2, verifiable: 2 },
  { verified: [ph, ph], measuredOnly: [], nonSleep: 7 });
const VALERIAN = stub('valerian', 'Valerian', 'unknown', { cited: 11, sleep: 3, verifiable: 1 },
  { verified: [ph], measuredOnly: [ph, ph], nonSleep: 8 });
const CHAMOMILE = stub('chamomile', 'Chamomile', 'unknown', { cited: 6, sleep: 2, verifiable: 1 },
  { verified: [ph], measuredOnly: [ph], nonSleep: 4 });
/* ashwagandha stub so the Safety page's flagged-remedy row lands on the right remedy;
   caution flag restated over the stub's null (real audit counts: 7/1/0) */
const ASHWAGANDHA = { ...stub('ashwagandha', 'Ashwagandha', 'unknown', { cited: 7, sleep: 1, verifiable: 0 },
  { verified: [], measuredOnly: [ph], nonSleep: 6 }), safetyFlag: '[Placeholder — real safety wording pending sourcing]' };

const TOC = [
  { id: 'work', label: 'Does it work?' },
  { id: 'does', label: 'What does it actually do?' },
  { id: 'dose', label: "What's a normal dose and when do you take it?" },
  { id: 'safety', label: 'Is it safe with my medications?' },
  { id: 'label', label: 'What should I look for on the label?' },
  { id: 'products', label: 'Which products deliver it?' },
  { id: 'popular', label: 'Why is this so popular?' },
  { id: 'papers', label: 'The papers behind this page' },
];

/* ABSENCE COPY — the canonical strings, one place. Transcribe these into the content layer
   verbatim when this gets built; do not reimplement from memory.
   {cited}/{sleep}/{verifiable} interpolate the audit counts.
   section   condition                    sentence
   work      cited === 0                  "We couldn't find any published papers on this remedy — so nobody knows. That is the whole answer."
   work      sleep === 0                  "None of the {cited} papers we found measured sleep — so nobody knows. That is the whole answer."
   work      verifiable === 0             "{sleep} of {cited} papers measured sleep, but none published results we could verify — so we can't say yet."
   does      cited === 0                  "With no papers to draw on, there is nothing to describe yet."
   does      sleep === 0                  "With no sleep findings to explain, there is nothing to describe yet."
   dose      cited === 0 || sleep === 0   "No paper measured sleep, so there is no studied sleep dose to show."
   label     cited === 0 || sleep === 0   "No studied form or dose exists to check a label against."
   reports   reports.length === 0         "No accounts collected yet." (sub-block of "Why is this so popular?")
   products  products.length === 0        "We haven't assessed any {remedy} products yet."
   papers    cited === 0                  "We couldn't find any published papers on this remedy." (intro line)  */
const ABSENCE = {
  workNoPapers: `We couldn't find any published papers on this remedy — so nobody knows. That is the whole answer.`,
  workNoSleep: (c) => `None of the ${c.cited} papers we found measured sleep — so nobody knows. That is the whole answer.`,
  workNoVerified: (c) => `${c.sleep} of ${c.cited} papers measured sleep, but none published results we could verify — so we can't say yet.`,
  doesNoPapers: 'With no papers to draw on, there is nothing to describe yet.',
  doesNoSleep: 'With no sleep findings to explain, there is nothing to describe yet.',
  dose: 'No paper measured sleep, so there is no studied sleep dose to show.',
  label: 'No studied form or dose exists to check a label against.',
  reports: 'No accounts collected yet.',
  papersNoPapers: `We couldn't find any published papers on this remedy.`,
  productsNone: (name) => `We haven't assessed any ${name} products yet.`,
};

/* The emptiness rules, implemented once for every remedy. Returns per-section absence
   sentences (from ABSENCE, above) or null when the section has content. */
function deriveEmpty(data) {
  const c = data.counts;
  const noPapers = c.cited === 0;
  const noSleep = c.sleep === 0;
  return {
    work: noPapers ? ABSENCE.workNoPapers
      : noSleep ? ABSENCE.workNoSleep(c)
      : c.verifiable === 0 ? ABSENCE.workNoVerified(c)
      : null,
    does: noPapers ? ABSENCE.doesNoPapers : noSleep ? ABSENCE.doesNoSleep : null,
    dose: noSleep ? ABSENCE.dose : null,
    label: noSleep ? ABSENCE.label : null,
  };
}

function useDesktop() {
  const [d, setD] = React.useState(() => window.matchMedia('(min-width: 980px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 980px)');
    const f = (e) => setD(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return d;
}
function jump(e, id) {
  /* native hash navigation: fires :target (the sidebar's landing feedback) and respects
     the global scroll-margin-top, so the destination never lands under sticky chrome */
  e.preventDefault();
  if (('#' + id) === location.hash) { history.replaceState(null, '', '#'); }
  location.hash = id;
}

function MarginNote({ note }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <span style={{ fontWeight: 'var(--weight-ui)', color: 'var(--text-body)' }}>{note.finding}</span>
      <span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
        {note.people ? `${note.people.toLocaleString()} people · ` : ''}{note.year || ''}{note.id ? ` · ${note.id}` : ''}
      </span>
      <a href={note.url || '#'} style={{ fontWeight: 'var(--weight-strong)', color: 'var(--text-link)', fontSize: 'var(--text-sm)' }}>{note.linkText || 'Read the study'} ↗</a>
      {note.lastChecked && <span style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>Link checked {note.lastChecked}</span>}
    </div>
  );
}

/** Section: h2 as a question; empty sections state their absence plainly — never hidden. */
function Section({ id, label, desktop, notes = [], empty, children }) {
  /* Section rhythm: hairline above each section (structure, not just space), then
     --space-8 down to the heading and --space-4 heading-to-content — a 2:1 ratio so
     each heading owns what follows it. Question headings sit at --text-xl, a clear
     step below the h1: long questions wrap without outweighing their content. */
  return (
    <section id={id} style={{ marginTop: 'var(--space-8)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-8)' }}>
      <div style={desktop ? { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 'var(--space-6)' } : undefined}>
        <div>
          <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
            letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)', color: empty ? 'var(--text-muted)' : 'var(--text-body)' }}>{label}</h2>
          {empty
            ? <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>{empty}</p>
            : children}
        </div>
        {desktop && <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
          {notes.map((n, i) => <MarginNote key={i} note={n} />)}
        </div>}
      </div>
    </section>
  );
}

function Contents({ desktop, empties }) {
  const [open, setOpen] = React.useState(false);
  const list = (
    <nav aria-label="Contents" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {TOC.map(t => (
        <a key={t.id} href={'#' + t.id} onClick={(e) => { jump(e, t.id); setOpen(false); }}
          style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', textDecoration: 'none',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-ui)', lineHeight: 'var(--leading-snug)',
            color: empties[t.id] ? 'var(--text-faint)' : 'var(--text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>{t.label}</a>
      ))}
    </nav>
  );
  if (desktop) {
    return <div style={{ position: 'sticky', top: 'var(--space-4)', alignSelf: 'start' }}>
      <p style={{ margin: '0 0 var(--space-2)', padding: '0 var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-strong)', color: 'var(--text-muted)' }}>On this page</p>
      {list}
    </div>;
  }
  return (
    <div style={{ border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          minHeight: 'var(--control-md)', padding: '0 var(--space-4)', border: 'none', background: 'transparent',
          font: 'var(--weight-strong) var(--text-sm) var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer' }}>
        On this page <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding: '0 var(--space-2) var(--space-2)' }}>{list}</div>}
    </div>
  );
}

function PaperRow({ swatch, statusLabel, type, finding, meta, note, desktop }) {
  /* `type` is the plain-words study type — "trial", "review of several studies",
     "observational study" — never "RCT" or "cohort" in the interface. It renders beside
     the tier label so a reader can see that one remedy's evidence is trials and
     another's is observational: that difference is why one can reach the top bucket. */
  return (
    <li style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', padding: 'var(--space-3) 0',
      borderTop: 'var(--border-w) solid var(--border-hairline)' }}>
      <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 'var(--radius-xs)', flex: 'none', marginTop: 4, ...swatch }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
        <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-1) var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-body)' }}>{statusLabel}</span>
          {type && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{type}</span>}
        </span>
        <span style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-snug)', color: 'var(--text-body)' }}>{finding}</span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{meta}</span>
        {!desktop && note && <StudyChip {...note} style={{ marginTop: 'var(--space-1)' }} />}
      </div>
    </li>
  );
}

export function RemedyTemplate({ data, go, goGrade }) {
  const desktop = useDesktop();
  const empties = deriveEmpty(data);
  const serious = !!data.safetySerious;
  const ingredient = data.name.toLowerCase();
  const swV = { background: 'var(--evidence)' };
  const swM = { background: 'var(--evidence)', opacity: 0.35 };
  const swN = { background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)' };
  const [showNonSleep, setShowNonSleep] = React.useState(data.counts.sleep === 0);
  const body = { margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', maxWidth: 'var(--measure)' };
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 1120, width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <div style={{ flex: 1, width: '100%', maxWidth: 1120, margin: '0 auto', padding: '0 var(--space-5) var(--space-9)',
        display: desktop ? 'grid' : 'flex', gridTemplateColumns: desktop ? '200px minmax(0, 1fr)' : undefined,
        flexDirection: desktop ? undefined : 'column', gap: desktop ? 'var(--space-8)' : 'var(--space-5)' }}>
        {desktop && <Contents desktop empties={empties} />}
        <main>
          {/* header block — a serious safety flag renders larger, directly under the h1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'var(--space-5)' }}>
            <div>
              <Breadcrumb trail={[{ label: 'Remedies', onClick: () => go && go('remedies') }]} current={data.name} mobile={!desktop} />
              <h1 style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--display-lg)', fontWeight: 'var(--weight-title)',
                letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)' }}>{data.name}</h1>
              <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-base)', color: 'var(--text-muted)' }}>{data.sub}</p>
            </div>
            {data.safetyFlag && (
              <SafetyCallout title={serious ? 'Serious safety concern.' : 'Safety.'} style={serious ? { fontSize: 'var(--text-lg)' } : undefined}>
                {data.safetyFlag}
              </SafetyCallout>
            )}
            {/* SYSTEM RULE: every bucket badge links to "How we grade", deep-linked to its
               bucket section — methodology at the moment of doubt. */}
            <a href="#how-we-grade" title="How we grade" onClick={(e) => { e.preventDefault(); goGrade ? goGrade(data.bucket) : go('grade'); }}
              style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <BucketBadge bucket={data.bucket} sentence={data.bucketSentence} />
            </a>
            <p style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-ui)', lineHeight: 'var(--leading-snug)', maxWidth: 'var(--measure)', textWrap: 'pretty' }}>
              {data.verdict}
            </p>
            <StudyField size="hero" counts={data.counts} />
            {data.helpedNote && <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>{data.helpedNote}</p>}
            <LastChecked date={data.lastChecked} prefix="Last checked" />
            {!desktop && <Contents empties={empties} />}
          </div>

          <Section id="work" label="Does it work?" desktop={desktop} notes={empties.work ? [] : [NOTE_REVIEW]} empty={empties.work}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <PlainStat size="sm" figure="About 7 minutes" text="faster to sleep, on average"
                source="From a review of 19 studies covering 1,683 people"
                chip={desktop ? undefined : { ...NOTE_REVIEW, defaultOpen: false }} />
              <div style={{ padding: 'var(--space-5)', background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <LabelVsStudies claim="Fall asleep 3× faster" found="The studies found about 7 minutes, on average."
                  chip={desktop ? undefined : NOTE_REVIEW} />
                <LabelVsStudies animate={false} claim="Wake refreshed" found="[Placeholder — finding pending write-up]"
                  chip={desktop ? undefined : { finding: '[Placeholder — finding pending write-up]', linkText: 'Read the study' }} />
              </div>
            </div>
          </Section>

          <Section id="does" label="What does it actually do?" desktop={desktop} empty={empties.does}>
            <p style={body}>[Placeholder — plain-language explanation pending medical review.]</p>
          </Section>

          <Section id="dose" label="What's a normal dose and when do you take it?" desktop={desktop} empty={empties.dose}>
            <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr' : '1fr', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-body)' }}>What the studies used</p>
                <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-strong)', fontVariantNumeric: 'tabular-nums' }}>[Placeholder]</p>
                <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>[Placeholder — timing pending audit]</p>
              </div>
              <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-body)' }}>What bottles typically contain</p>
                <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-strong)', fontVariantNumeric: 'tabular-nums' }}>[Placeholder]</p>
                <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>[Placeholder — market survey pending]</p>
              </div>
            </div>
          </Section>

          <Section id="safety" label="Is it safe with my medications?" desktop={desktop}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <SafetyCallout level={serious ? 'serious' : 'caution'} title={serious ? 'Serious safety concern' : 'Check with your pharmacist first'}>
                [Placeholder — safety copy pending sourcing. Written by a person, checked against the papers, never generated.]
              </SafetyCallout>
              {!serious && <p style={body}>[Placeholder — common side effects, plain language, pending sourcing.]</p>}
            </div>
          </Section>

          <Section id="label" label="What should I look for on the label?" desktop={desktop} empty={empties.label}>
            <p style={body}>[Placeholder — label guidance pending audit: studied form, studied dose, third-party testing, full disclosure.]</p>
          </Section>

          <Section id="products" label="Which products deliver it?" desktop={desktop}
            empty={!data.productStats && data.products.length === 0 ? ABSENCE.productsNone(ingredient) : null}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* NEVER an arbitrary subset: this section shows ONLY the products that pass all
                 four checks, states how many exist in total, and links to the complete list
                 (including the ones we'd skip) on the products index. */}
              {serious && data.safetyFlag && (
                <SafetyCallout title="Read this before the list.">{data.safetyFlag}</SafetyCallout>
              )}
              {data.productStats && data.productStats.pass > 0 && (
                <p style={{ ...body, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  Showing {data.productStats.pass} of {data.productStats.checked} that pass every check —{' '}
                  <a href="#products-index" onClick={(e) => { e.preventDefault(); go('products'); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>
                    see all {data.productStats.checked}, including the ones we'd skip ›
                  </a>
                </p>
              )}
              {data.productStats && data.productStats.pass === 0 && (
                <p style={{ ...body, fontVariantNumeric: 'tabular-nums' }}>
                  None of the {data.productStats.checked} {ingredient} products we checked passes every check.{' '}
                  <a href="#products-index" onClick={(e) => { e.preventDefault(); go('products'); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>
                    See all {data.productStats.checked}, and why ›
                  </a>
                </p>
              )}
              {/* Each brand link + card groups as one unit: tight title-to-card gap, larger gap
                 between blocks; cards stretch to a common height. The ingredient verdict is NOT
                 repeated per card — the page header states it once; only the bottle varies. */}
              {/* Dense-list rows (C3) — the same ProductListRow as the full product list.
                 No expanded check list or repeated verdict sentence here: everything shown
                 passes everything, so the detail lives on the product page. Rows stack —
                 no grid, no orphaned item beside an empty column. */}
              {data.products.length > 0 && (
              <div style={{ borderBottom: 'var(--border-w) solid var(--border-hairline)' }}>
                {data.products.map(p => (
                  <ProductListRow key={p.product} brand={p.brand} name={p.product} strength={p.strength} src={p.src}
                    criteria={p.criteria} mobile={!desktop} onClick={() => go && go('product')} />
                ))}
              </div>
              )}
              <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>Products shown are fictional demo entries; counts are demo values.</p>
            </div>
          </Section>

          {/* "Why is this so popular?" absorbs "What people report" — the honest home for
             widely-used-but-barely-tested remedies (the normal case). Same firewall: none of
             it is evidence, none of it moves the grade. Never empty — popularity is exactly
             what needs explaining when the evidence bar is nearly empty. */}
          <Section id="popular" label="Why is this so popular?" desktop={desktop}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-body)' }}>
                None of this is evidence, and none of it affects the grade above.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)' }}>Traditional use</p>
                  <p style={{ ...body, marginTop: 'var(--space-1)', color: 'var(--text-muted)' }}>[Placeholder — how long and where it has been used for sleep, pending write-up.]</p>
                </div>
                <div style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)' }}>A plausible mechanism</p>
                  <p style={{ ...body, marginTop: 'var(--space-1)', color: 'var(--text-muted)' }}>[Placeholder — why it could work in principle, in plain words, pending medical review.]</p>
                </div>
                <div style={{ background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)' }}>What people report</p>
                  {(data.reports || []).length === 0
                    ? <p style={{ ...body, color: 'var(--text-muted)' }}>{ABSENCE.reports}</p>
                    : (data.reports || []).map((r, i) => <p key={i} style={{ ...body, color: 'var(--text-muted)' }}>"{r}"</p>)}
                </div>
              </div>
              <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                Widespread use doesn't move a grade — <a href="#popularity" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>here's why ›</a>
              </p>
            </div>
          </Section>

          <Section id="papers" label="The papers behind this page" desktop={desktop}>
            <p style={{ ...body, marginBottom: 'var(--space-4)', color: 'var(--text-muted)' }}>
              {data.counts.cited === 0
                ? ABSENCE.papersNoPapers
                : data.counts.sleep === 0
                ? `All ${data.counts.cited} papers cited for ${ingredient} are listed below. None measured sleep.`
                : `Every paper we cite, with what it found and whether we could verify it.`}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {data.papers.verified.map((p, i) => (
                <PaperRow key={'v' + i} swatch={swV} statusLabel="Result we could verify" type={p.type} finding={p.finding} meta={p.meta} note={p.note} desktop={desktop} />
              ))}
              {data.papers.measuredOnly.map((p, i) => (
                <PaperRow key={'m' + i} swatch={swM} statusLabel="Measured sleep — we couldn't verify the result" type={p.type} finding={p.finding} meta={p.meta} desktop={desktop} />
              ))}
            </ul>
            {data.papers.nonSleep > 0 && (
              <div style={{ borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <button type="button" onClick={() => setShowNonSleep(s => !s)} aria-expanded={showNonSleep}
                  style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
                    font: 'var(--weight-ui) var(--text-sm) var(--font-sans)', color: 'var(--text-link)',
                    textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 'var(--radius-xs)', textDecoration: 'none', ...swN }} />
                  {showNonSleep ? `Hide the ${data.papers.nonSleep} papers that didn't measure sleep` : `Show the ${data.papers.nonSleep} papers that didn't measure sleep`}
                </button>
                {showNonSleep && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {Array.from({ length: data.papers.nonSleep }, (_, i) => (
                      <PaperRow key={'n' + i} swatch={swN} statusLabel="Didn't measure sleep" finding="[Placeholder — paper title and topic pending write-up]" meta="[Details placeholder]" desktop={desktop} />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Section>

          <div style={{ marginTop: 'var(--space-8)' }}><LastChecked date={data.lastChecked} prefix="This page last checked" /></div>
        </main>
      </div>
      <DisclaimerBand onGrade={goGrade} />
    </div>
  );
}

const REMEDY_DATA = { melatonin: MELATONIN, kava: KAVA, magnesium: MAGNESIUM, valerian: VALERIAN, chamomile: CHAMOMILE, ashwagandha: ASHWAGANDHA };
export function RemedyPage({ go, goGrade, which = 'melatonin' }) {
  const data = REMEDY_DATA[which] || MELATONIN;
  return <RemedyTemplate key={data.key} data={data} go={go} goGrade={goGrade} />;
}
