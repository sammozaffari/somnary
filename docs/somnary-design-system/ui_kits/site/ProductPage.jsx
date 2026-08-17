import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { SafetyCallout, LastChecked, DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { StudyChip } from '../../components/evidence/StudyChip.jsx';
import { BrandMark } from '../../components/cards/BrandMark.jsx';
import { VerdictPill } from '../../components/cards/ProductListRow.jsx';
import { BucketShape } from '../../components/verdicts/BucketShape.jsx';
import { BUCKETS } from '../../components/verdicts/BucketBadge.jsx';
import { CRITERIA, PASSES_THRESHOLD } from '../../components/verdicts/ProductScoreBadge.jsx';

/* The product page — a DECISION NARRATIVE read top to bottom: no TOC, no sidebar; the
   section order is the argument. The one jump is "Where to buy ↓" in the header (the only
   high-intent jump on the page). "What people report" is deliberately NOT here — anecdote
   at the moment of purchase is where it does most damage; it lives on the remedy page
   behind the firewall. Two datasets: a pass-all product and a failing one (1 of 4) with
   identical structure — failed checks explained as plainly as passes, where-to-buy
   identical. All prices, protocols, certifier details and label notes are placeholders. */

const CHIP_7MIN = { finding: 'People taking melatonin fell asleep about 7 minutes sooner, on average, than people taking a placebo.',
  people: 1683, year: 2013, url: '#', linkText: 'Read the review (19 studies)', lastChecked: '14 July 2026' };

const PASSING = {
  /* SCHEMA RULE: product name and strength are separate fields — the name never contains the dose. */
  key: 'melts', brand: 'Dreamwell', name: 'Melatonin melts',
  strengthLine: '1 mg per melt · Sublingual · 30 melts',
  priceLine: '$19.95 · $0.67 per night · lasts 30 nights',
  criteria: { dose: true, tested: true, disclosed: true, form: true },
  verdictLine: 'This bottle gives you what was studied.',
  dose: 1,
  dietary: ['Sugar-free', 'Gluten-free', 'Vegan', 'No artificial colours', 'Contains artificial sweeteners'],
  checks: [
    { key: 'dose', why: '1 mg sits inside the 0.5–3 mg range the research used. Most melatonin products sell 5–10 mg — more than was ever studied for sleep.', chip: CHIP_7MIN },
    { key: 'tested', why: 'An independent laboratory confirmed the melatonin content matches the label. [Certifier details placeholder pending verification.]' },
    { key: 'disclosed', why: 'Every ingredient and its amount is printed on the label — no proprietary blend hiding the numbers.' },
    { key: 'form', why: 'Sublingual melts were used in [placeholder — studied-form citation pending]; this is the form the results describe.', chip: { finding: '[Placeholder — finding pending write-up]', linkText: 'Read the study' } },
  ],
  ingredients: [
    { name: 'Melatonin', role: 'Active ingredient', amount: '1 mg', note: 'The studied dose range is 0.5–3 mg.', flag: 'none' },
    { name: 'Mannitol', role: 'Bulking agent', amount: null, note: '[Placeholder note pending review]', flag: 'none' },
    /* POLICY (system-wide): non-sugar sweeteners are ALWAYS "Worth knowing" in a
       daily-use product — a stated policy, not a per-product judgement. Basis:
       [placeholder — WHO 2023 guideline on non-sugar sweeteners, pending verification].
       The boundary holds both ways: a flag never says "bad" or "avoid" without a
       documented concern. */
    { name: 'Sucralose', role: 'Sweetener', amount: null, note: "Policy: non-sugar sweeteners are always worth knowing about in a product designed to be taken every night — anything in it, you're having daily. [Placeholder — WHO 2023 guideline on non-sugar sweeteners, pending verification.]", flag: 'worth' },
    { name: 'Peppermint oil', role: 'Flavour', amount: null, note: '[Placeholder note pending review]', flag: 'none' },
  ],
  allergens: 'Per the label: no gluten, lactose, soy, nuts, or shellfish.',
  alternatives: [
    { brand: 'Somnia Labs', name: 'Melatonin', why: 'Cheaper per night', criteria: { dose: true, tested: true, disclosed: true, form: true } },
    { brand: 'Nightcap Co', name: 'Melatonin drops', why: 'Lower dose', criteria: { dose: true, tested: true, disclosed: true, form: true } },
  ],
  retailers: [
    { name: 'ChemistDirect', price: '$19.95' }, { name: 'Wellworth', price: '$21.50' }, { name: '[Retailer placeholder]', price: '[price]' },
  ],
  lastChecked: '14 July 2026', pricesChecked: '1 August 2026',
};

const FAILING = {
  key: 'complex', brand: 'Dreamwell', name: 'Sleep complex',
  strengthLine: 'Blend — 6 ingredients, amounts not disclosed · Capsules · 60 capsules',
  priceLine: '$34.00 · $1.13 per night · lasts 30 nights',
  criteria: { dose: false, tested: false, disclosed: false, form: true },
  verdictLine: "This bottle doesn't give you what was studied.",
  dose: null,
  dietary: ['Gluten-free', 'Contains artificial colours'],
  checks: [
    { key: 'dose', why: "The label doesn't say how much melatonin is in each capsule, so nobody can check it against the studied 0.5–3 mg range — including you.", chip: CHIP_7MIN },
    { key: 'tested', why: 'No independent laboratory has verified what these capsules contain. The manufacturer\u2019s own certificate is not a substitute.' },
    { key: 'disclosed', why: 'Five of six ingredients hide inside a "proprietary blend" — a total weight with no individual amounts. That single device is what fails this check.' },
    { key: 'form', why: 'Capsules match a studied form. This is the one check that passes.' },
  ],
  ingredients: [
    { name: 'Proprietary sleep blend', role: 'Blend — 6 ingredients', amount: '410 mg total', note: 'Individual amounts not disclosed; none of the checks below it can be verified.', flag: 'worth' },
    { name: 'Melatonin', role: 'Active ingredient', amount: 'Not disclosed', note: 'Inside the blend.', flag: 'worth' },
    { name: '[Placeholder ingredient]', role: '[Role]', amount: null, note: '[Placeholder — documented findings summary pending]', flag: 'documented' },
    { name: 'Brilliant blue FCF', role: 'Colour', amount: null, note: '[Placeholder note pending review]', flag: 'none' },
  ],
  allergens: 'Per the label: contains soy. No gluten, lactose, nuts, or shellfish.',
  alternatives: [
    { brand: 'Somnia Labs', name: 'Melatonin', why: 'Passes every check', criteria: { dose: true, tested: true, disclosed: true, form: true } },
    { brand: 'Dreamwell', name: 'Melatonin melts', why: 'Same brand, full disclosure', criteria: { dose: true, tested: true, disclosed: true, form: true } },
  ],
  retailers: [
    { name: 'ChemistDirect', price: '$34.00' }, { name: 'Wellworth', price: '$33.25' },
  ],
  lastChecked: '14 July 2026', pricesChecked: '1 August 2026',
};

const FLAGS = {
  /* colour states what's DOCUMENTED, nothing more — three states, never a hazard spectrum.
     "No known concern" is neutral, NOT green: green means passes/endorsed, which it doesn't
     claim. Non-neutral rows carry a tinted left edge (the system-wide "concern" signal)
     and their label links to the paper that earned it. */
  none: { label: 'No known concern', color: 'var(--text-muted)', edge: 'transparent', tint: 'transparent' },
  worth: { label: 'Worth knowing', color: 'var(--bucket-maybe)', edge: 'var(--bucket-maybe)', tint: 'var(--bucket-maybe-tint)' },
  documented: { label: 'Documented concern', color: 'var(--bucket-avoid)', edge: 'var(--bucket-avoid)', tint: 'var(--bucket-avoid-tint)' },
};

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

const body = { margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', maxWidth: 'var(--measure)' };
const muted = { ...body, color: 'var(--text-muted)' };

function Section({ id, label, children }) {
  return (
    <section id={id} style={{ marginTop: 'var(--space-8)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-8)' }}>
      <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
        letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' }}>{label}</h2>
      {children}
    </section>
  );
}

function CheckMark({ met }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" style={{ flex: 'none', marginTop: 3 }}>
      {met
        ? <path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" fill="none" stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M3.5 3.5 L10.5 10.5 M10.5 3.5 L3.5 10.5" fill="none" stroke="var(--bucket-avoid)" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

/** Dose diagram: this product's dose vs the studied range vs the typical market, one 0–10 mg scale. */
function DoseDiagram({ dose }) {
  const W = 100; // percentages
  const x = (mg) => `${(mg / 10) * W}%`;
  /* A11Y RULE: a diagram carries its OWN accessible description (role="img" + label) —
     never rely on nearby caption text to explain a graphic. */
  return (
    <div role="img" aria-label={`Dose diagram: this product contains ${dose} mg per serving; the studies used 0.5 to 3 mg; typical products on the market contain 5 to 10 mg.`}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: 560 }}>
      <div style={{ position: 'relative', height: 44 }}>
        {/* typical market band 5–10, hatched */}
        <div style={{ position: 'absolute', left: x(5), width: x(5), top: 8, bottom: 8, borderRadius: 'var(--radius-xs)',
          border: 'var(--border-w) solid var(--border-strong)',
          background: 'repeating-linear-gradient(45deg, var(--surface-sunken), var(--surface-sunken) 4px, transparent 4px, transparent 8px)' }} />
        {/* studied band 0.5–3, solid evidence tint */}
        <div style={{ position: 'absolute', left: x(0.5), width: x(2.5), top: 8, bottom: 8, borderRadius: 'var(--radius-xs)',
          background: 'var(--evidence-tint)', border: 'var(--border-w) solid var(--evidence-line)' }} />
        {/* baseline */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: 'var(--border-strong)' }} />
        {/* product marker */}
        {dose != null && (
          <div style={{ position: 'absolute', left: x(dose), top: 0, bottom: 0, width: 3, marginLeft: -1.5,
            background: 'var(--evidence)', borderRadius: 'var(--radius-pill)' }} />
        )}
        {[0, 5, 10].map(mg => (
          <span key={mg} style={{ position: 'absolute', left: x(mg), bottom: -20, transform: mg === 0 ? 'none' : mg === 10 ? 'translateX(-100%)' : 'translateX(-50%)',
            whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{mg} mg</span>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-5)', paddingTop: 'var(--space-5)' }}>
        {dose != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontWeight: 'var(--weight-meta)' }}>
          <span style={{ width: 3, height: 14, background: 'var(--evidence)', borderRadius: 'var(--radius-pill)' }} />This product</span>}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontWeight: 'var(--weight-meta)' }}>
          <span style={{ width: 14, height: 14, borderRadius: 'var(--radius-xs)', background: 'var(--evidence-tint)', border: 'var(--border-w) solid var(--evidence-line)' }} />What studies used (0.5–3 mg)</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontWeight: 'var(--weight-meta)' }}>
          <span style={{ width: 14, height: 14, borderRadius: 'var(--radius-xs)', border: 'var(--border-w) solid var(--border-strong)',
            background: 'repeating-linear-gradient(45deg, var(--surface-sunken), var(--surface-sunken) 3px, transparent 3px, transparent 6px)' }} />Typical on the market (5–10 mg)</span>
      </div>
    </div>
  );
}

export function ProductPage({ go, goRemedy, goGrade, goBrand, which = 'melts' }) {
  const desktop = useDesktop();
  const p = which === 'complex' ? FAILING : PASSING;
  const met = CRITERIA.filter(c => p.criteria[c.key]).length;
  const jumpBuy = (e) => { e.preventDefault(); if (location.hash === '#buy') history.replaceState(null, '', '#'); location.hash = 'buy'; };
  const cluster = { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' };
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' }}>
        {/* SYSTEM RULE: breadcrumbs on every page, always — Products › Brand › Product.
           On mobile, truncate to the parent only ("‹ Products"). This is the back
           affordance — never a referrer-dependent "back" link. */}
        <p style={{ margin: 'var(--space-5) 0 var(--space-5)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-ui)', color: 'var(--text-muted)' }}>
          {desktop ? (
            <React.Fragment>
              <a href="#products" onClick={(e) => { e.preventDefault(); go('products'); }} style={{ color: 'var(--text-link)' }}>Products</a>
              {' › '}<a href="#brand" onClick={(e) => { e.preventDefault(); goBrand && goBrand(p.brand.toLowerCase()); }} style={{ color: 'var(--text-link)' }}>{p.brand}</a>
              {' › '}<span>{p.name}</span>
            </React.Fragment>
          ) : (
            <a href="#products" onClick={(e) => { e.preventDefault(); go('products'); }} style={{ color: 'var(--text-link)' }}>‹ Products</a>
          )}
        </p>
        {/* header block: image top-aligned with the brand line; the text column is four
           clusters (identity / verdict / context / meta), tight within, spaced between */}
        <div style={{ display: 'flex', flexDirection: desktop ? 'row' : 'column', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
          <BrandMark name={p.brand} size={desktop ? 288 : 160} radius="var(--radius-lg)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', minWidth: 0, flex: 1 }}>
            <div style={cluster}>
              <a href="#brand" onClick={(e) => { e.preventDefault(); goBrand && goBrand(p.brand.toLowerCase()); }} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-link)' }}>{p.brand}</a>
              <h1 style={{ margin: 0, fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)', letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)', textWrap: 'pretty' }}>{p.name}</h1>
              {/* two different kinds of fact, two treatments: the strength line is what the
                 thing IS (body ink, reads with the title); the price line is market data
                 (smaller, muted, spaced apart). Placeholder marker is a footnote asterisk. */}
              <p style={{ margin: 'var(--space-3) 0 0', fontSize: 'var(--text-base)', color: 'var(--text-body)', fontWeight: 'var(--weight-ui)', fontVariantNumeric: 'tabular-nums' }}>{p.strengthLine}</p>
              <div style={{ margin: 'var(--space-2) 0 0', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-1) var(--space-4)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{p.priceLine}*</p>
                <a href="#buy" onClick={jumpBuy} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Where to buy ↓</a>
              </div>
            </div>
            <div style={{ ...cluster, gap: 'var(--space-2)', alignItems: 'flex-start' }}>
              <VerdictPill criteria={p.criteria} />
              {/* verdict-line colour follows the ONE placeholder threshold — PASSES_THRESHOLD in
                 ProductScoreBadge (needs an owner; do not tune in design). */}
              <p style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-ui)', lineHeight: 'var(--leading-snug)',
                color: met >= PASSES_THRESHOLD ? 'var(--text-body)' : 'var(--bucket-avoid)' }}>{p.verdictLine}</p>
            </div>
            <div style={{ ...cluster, gap: 'var(--space-2)' }}>
              <p style={{ margin: 0, fontSize: 'var(--text-base)' }}>
                Active ingredient:{' '}
                <a href="#remedy" onClick={(e) => { e.preventDefault(); goRemedy('melatonin'); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Melatonin</a>
                {/* SYSTEM RULE: every bucket badge links to "How we grade", deep-linked to its bucket section. */}
                {' '}<a href="#works" title="How we grade" onClick={(e) => { e.preventDefault(); goGrade && goGrade('works'); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: BUCKETS.works.color, verticalAlign: 'middle', textDecoration: 'none' }}>
                  <BucketShape bucket="works" size={12} />{BUCKETS.works.plain}
                </a>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {p.dietary.map(d => (
                  <span key={d} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', border: 'var(--border-w) solid var(--border-hairline)',
                    borderRadius: 'var(--radius-pill)', padding: 'var(--space-1) var(--space-3)' }}>{d}</span>
                ))}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>
              * Price and per-night figures are placeholder values. · Last checked {p.lastChecked} · <a href="#report" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)' }}>Report an error</a>
            </p>
          </div>
        </div>

        <Section label="The four checks">
          {/* failed checks float to the top; ✕ in the avoid tint + tinted left edge — the
             same visual language as an ingredient concern: one signal means "concern"
             everywhere. Failures are explained as plainly as passes; no full red boxes. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {p.checks.map((c, i) => ({ c, i, met: !!p.criteria[c.key] })).sort((a, b) => Number(a.met) - Number(b.met)).map(({ c, i, met: ok }) => (
              <div key={c.key} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
                borderLeft: ok ? '3px solid transparent' : '3px solid var(--bucket-avoid)',
                paddingLeft: 'var(--space-3)', marginLeft: 'calc(-1 * var(--space-3) - 3px)' }}>
                <CheckMark met={ok} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>
                    {CRITERIA[i].label} — {ok ? 'yes' : 'no'}
                  </p>
                  <p style={muted}>{c.why}</p>
                  {c.chip && <StudyChip {...c.chip} style={{ marginTop: 'var(--space-1)' }} />}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="What's in it">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {p.ingredients.map(ing => {
              const f = FLAGS[ing.flag];
              return (
                <li key={ing.name} style={{ display: 'grid', gridTemplateColumns: desktop ? 'minmax(0, 1fr) auto' : '1fr', gap: 'var(--space-1) var(--space-5)',
                  padding: 'var(--space-3) var(--space-3)', borderTop: 'var(--border-w) solid var(--border-hairline)',
                  borderLeft: `3px solid ${f.edge}`, background: ing.flag === 'none' ? 'transparent' : f.tint,
                  marginLeft: 'calc(-1 * var(--space-3) - 3px)' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>
                      {ing.name} {ing.amount && <span style={{ fontWeight: 'var(--weight-body)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>· {ing.amount}</span>}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{ing.role} · {ing.note}</p>
                  </div>
                  <a href="#paper" onClick={(e) => e.preventDefault()} style={{ alignSelf: 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: f.color, whiteSpace: 'nowrap', textDecoration: ing.flag === 'none' ? 'none' : 'underline', textUnderlineOffset: 3, pointerEvents: ing.flag === 'none' ? 'none' : 'auto' }}>{f.label}</a>
                </li>
              );
            })}
          </ul>
          <p style={{ ...muted, fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
            We flag only documented concerns — we don't invent hazard scores. "No known concern" means no documented evidence of harm at these amounts, not a guarantee. One standing policy: non-sugar sweeteners are always "Worth knowing" in a daily-use product [placeholder — WHO 2023 guideline pending verification] — and the boundary holds both ways: a flag never says "bad" or "avoid" without a documented concern, the same rule that stops us calling an untested remedy useless.
          </p>
          <p style={{ ...body, fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>{p.allergens}</p>
        </Section>

        <Section label={p.dose != null ? `Is ${p.dose} mg enough?` : 'Is the dose enough?'}>
          {p.dose != null ? (
            <React.Fragment>
              <DoseDiagram dose={p.dose} />
              <p style={{ ...body, marginTop: 'var(--space-5)' }}>
                More isn't better here: the higher doses on the market weren't the ones studied for sleep, and they're likelier to leave you groggy the next morning. [Placeholder citation.]
              </p>
            </React.Fragment>
          ) : (
            <p style={body}>Nobody can say — the label doesn't disclose the melatonin amount, so there's nothing to place on the scale. That's what the failed dose check means.</p>
          )}
        </Section>

        <Section label="How to take it">
          <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr' : '1fr', gap: 'var(--space-3)' }}>
            {[
              ['When', '[Placeholder — timing from the studied protocols]'],
              ['How', which === 'complex' ? 'Swallow with water.' : 'Dissolve under the tongue — don\u2019t swallow it whole.'],
              ['With food?', '[Placeholder — pending protocol review]'],
              ['How long until you know it\u2019s working', '[Placeholder — expected timescale and when to stop, from the studied protocols. No manufacturer prints this.]'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)' }}>{k}</p>
                <p style={{ ...muted, marginTop: 'var(--space-1)', fontSize: 'var(--text-base)' }}>{v}</p>
              </div>
            ))}
          </div>
          <p style={{ ...muted, fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>Timing comes from the studied protocols, not the manufacturer's marketing.</p>
        </Section>

        

        

        

        <Section label="Before you take it">
          <SafetyCallout level="caution" title="Check with your pharmacist first if any of these apply">
            [Placeholder list — interaction classes, pregnancy, children — pending sourcing.]{' '}
            The full safety picture is on the{' '}
            <a href="#remedy" onClick={(e) => { e.preventDefault(); goRemedy('melatonin'); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>melatonin page</a>
            {' '}— it applies to every melatonin product, not just this one.
          </SafetyCallout>
        </Section>

        <Section label="What to expect">
          <p style={body}>A nudge, not a knockout — in studies people fell asleep about 7 minutes faster, on average. If you're expecting a sleeping pill, this isn't that.</p>
          <p style={{ ...muted, marginTop: 'var(--space-3)' }}>
            {which === 'complex'
              ? 'Because the melatonin amount is undisclosed, there is no way to relate this product to those studies at all.'
              : 'At 1 mg this sits at the lower end of the studied range — the studies found low doses work about as well as higher ones.'}
            {' '}[Placeholder pending review.]
          </p>
          {p.dietary.includes('Contains artificial sweeteners') && (
            <p style={{ ...muted, marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>Sweetened with sucralose — noted under "What's in it".</p>
          )}
        </Section>

        <Section label="If this isn't right for you">
          <p style={{ ...muted, marginBottom: 'var(--space-4)' }}>Alternatives that also pass every check — same checks, not recommendations.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {p.alternatives.map(a => (
              <a key={a.name} href="#product" onClick={(e) => e.preventDefault()}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', color: 'var(--text-body)', minHeight: 'var(--control-lg)' }}>
                <BrandMark name={a.brand} size={44} />
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>{a.brand} — {a.name}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{a.why}</span>
                </span>
                <span style={{ marginLeft: 'auto' }}><VerdictPill criteria={a.criteria} /></span>
              </a>
            ))}
            <a href="#products" onClick={(e) => { e.preventDefault(); go('products'); }}
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-link)', padding: 'var(--space-2) 0' }}>
              All 12 melatonin products, including the ones we'd skip ›
            </a>
          </div>
        </Section>

        <Section label="Where this information comes from">
          <ul style={{ ...body, margin: 0, paddingLeft: '1.2em', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Label — [government label database placeholder].</li>
            <li>Independent testing — [testing register placeholder].</li>
            <li>Research — the papers on the <a href="#remedy" onClick={(e) => { e.preventDefault(); goRemedy('melatonin'); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>melatonin page</a>.</li>
            <li style={{ fontVariantNumeric: 'tabular-nums' }}>Prices checked {p.pricesChecked} · page last checked {p.lastChecked}.</li>
          </ul>
          <div style={{ marginTop: 'var(--space-4)', background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 'var(--measure)' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>Spotted something wrong?</p>
            <p style={{ ...muted, marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
              Formulations change, and this page is only as good as its last check. <a href="#report" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Tell us</a> and we'll recheck it.
            </p>
          </div>
        </Section>

        <Section id="buy" label="Where to buy">
          {/* identical treatment regardless of score — same component, same weight, room for
             a one-line disclosure. Retailers in no particular order. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {p.retailers.map(r => (
              <div key={r.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <a href="#out" onClick={(e) => e.preventDefault()}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 'var(--control-lg)',
                    padding: '0 var(--space-4)', background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
                    borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-body)' }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>{r.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>{r.price}</span>
                  <span aria-hidden="true" style={{ color: 'var(--text-faint)' }}>↗</span>
                </a>
                <p style={{ margin: 0, padding: '0 var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>[Room for a one-line disclosure]</p>
              </div>
            ))}
            <p style={{ ...muted, fontSize: 'var(--text-sm)' }}>Retailers in no particular order. Somnary earns nothing from these links.</p>
          </div>
        </Section>

            </main>
      <DisclaimerBand onGrade={goGrade} />
    </div>
  );
}
