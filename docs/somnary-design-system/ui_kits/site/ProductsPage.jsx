import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { ProductListRow } from '../../components/cards/ProductListRow.jsx';
import { Breadcrumb } from '../../components/chrome/Breadcrumb.jsx';

/* /remedies/melatonin/products — the full product list, dense-list layout (C3).
   All twelve are fictional demo entries in a realistic mix: pass-all, partial, failing,
   label-known, not-in-database — identical treatment throughout ("we list every product,
   including the ones we advise against" is most visible here).
   FIXED ORDER: checks passed, descending (assessed first, then label-known, then
   not-in-database; ties by brand A–Z). The checks are the reason the page exists, and the
   order is set by our own published criteria — never by anything commercial. */
/* SCHEMA RULE: name and strength are separate structured fields — the name never contains
   the dose (enforced again in ProductListRow). */
const PRODUCTS = [
  { brand: 'Somnia Labs', name: 'Melatonin', strength: '1 mg per capsule', form: 'Capsules', src: '../../assets/demo-product-photo-1.png',
    criteria: { dose: true, tested: true, disclosed: true, form: true } },
  { brand: 'Nightcap Co', name: 'Melatonin drops', strength: '0.5 mg per dropper', form: 'Drops',
    criteria: { dose: true, tested: true, disclosed: true, form: true } },
  { brand: 'Dreamwell', name: 'Melatonin melts', strength: '1 mg per melt', form: 'Melts', sweetened: true,
    criteria: { dose: true, tested: true, disclosed: true, form: true } },
  { brand: 'PureForm', name: 'Melatonin', strength: '3 mg per capsule', form: 'Capsules',
    criteria: { dose: false, tested: true, disclosed: true, form: true } },
  { brand: 'VitaBasics', name: 'Melatonin gummies', strength: '5 mg per gummy', form: 'Gummies', sweetened: true,
    criteria: { dose: false, tested: true, disclosed: true, form: false } },
  { brand: 'Luna Supply', name: 'Melatonin', strength: '5 mg per capsule', form: 'Capsules',
    criteria: { dose: false, tested: false, disclosed: true, form: true } },
  { brand: 'Nightcap Co', name: 'Fast melts', strength: '10 mg per melt', form: 'Melts', sweetened: true,
    criteria: { dose: false, tested: true, disclosed: true, form: false } },
  { brand: 'Moonleaf', name: 'Sleep tea with melatonin', strength: 'Blend — melatonin amount not disclosed', form: 'Tea', src: '../../assets/demo-product-photo-2.png',
    criteria: { dose: false, tested: false, disclosed: false, form: false } },
  { brand: 'Dreamwell', name: 'Sleep complex', strength: 'Blend — 6 ingredients, amounts not disclosed', form: 'Capsules',
    criteria: { dose: false, tested: false, disclosed: false, form: true } },
  { brand: 'Herbwell', name: 'Night blend', strength: 'Blend — amounts not disclosed', form: 'Capsules',
    criteria: { dose: false, tested: false, disclosed: false, form: false } },
  { brand: 'Somnol', name: 'Melatonin spray', strength: '[Strength pending assessment]', form: 'Spray', status: 'label-known' },
  { brand: 'Driftwood', name: 'Sleep drops', strength: null, form: 'Drops', status: 'not-in-db' },
];

/* MOCK CATALOGUE — ~40 fictional demo entries that exist ONLY to exercise the chrome rule
   above threshold (toggled from the review chrome). Deterministic, clearly fake, never data. */
const BRANDS40 = ['Somnia Labs', 'Nightcap Co', 'Dreamwell', 'PureForm', 'VitaBasics', 'Luna Supply', 'Moonleaf', 'Herbwell', 'Somnol', 'Driftwood'];
const FORMS40 = ['Capsules', 'Tablets', 'Gummies', 'Melts', 'Drops', 'Spray', 'Tea', 'Powder'];
const NAME_BY_FORM = { Capsules: 'Melatonin', Tablets: 'Melatonin tablets', Gummies: 'Melatonin gummies', Melts: 'Melatonin melts', Drops: 'Melatonin drops', Spray: 'Melatonin spray', Tea: 'Sleep tea with melatonin', Powder: 'Melatonin powder' };
const PRODUCTS_LARGE = Array.from({ length: 40 }, (_, i) => {
  /* Powder appears exactly ONCE (its other cycle slots become capsules) so the single-result
     edge state — "The only powder product we've checked · Clear filter" — is reachable
     above the chrome threshold. */
  const cycled = FORMS40[i % FORMS40.length];
  const form = cycled === 'Powder' && i > 7 ? 'Capsules' : cycled;
  return { brand: BRANDS40[i % BRANDS40.length], name: NAME_BY_FORM[form], strength: '[Strength placeholder — fictional entry]',
    form, sweetened: ['Gummies', 'Melts', 'Tea'].includes(form),
    criteria: { dose: i % 2 === 0, tested: i % 3 !== 0, disclosed: i % 4 !== 0, form: i % 5 !== 0 } };
});

/* SYSTEM RULE — CHROME SCALES WITH CATALOGUE SIZE. Under ~20 items there is NO filter row
   and NO sort control: the list is the interface, its order declared in the intro line.
   Above ~20: one derived "Form" dropdown (options computed from the page's data, with
   counts; zero-result options never render) plus genuine-preference filters
   ("Independently tested", "No artificial sweeteners"), each rendered only when the list
   contains both states. Sort controls never exist at ANY scale — checks-passed is the
   fixed order, set by our published criteria, never by anything commercial. Brand A–Z was
   cut deliberately at every scale AS A CONTROL — someone who knows the brand searches; it
   survives only as the tiebreak WITHIN equal checks-passed (a deterministic, non-commercial
   way to settle ties, not a user-facing sort). */
const CHROME_THRESHOLD = 20;

/* FORM TAXONOMY: tablets, capsules, softgels, gummies, melts, drops, sprays, teas, and
   powders are DISTINCT forms — never merged (a tablet is not a capsule). The filter options
   are derived from the data with per-form counts, so a new form appears automatically and
   an unused one never shows. */
const met = (p) => p.criteria ? Object.values(p.criteria).filter(Boolean).length : p.status === 'label-known' ? -1 : -2;

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

export function ProductsPage({ go, goProduct, goGrade, catalogue = 'melatonin' }) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 760px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 760px)');
    const f = (e) => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const list = catalogue === 'large' ? PRODUCTS_LARGE : PRODUCTS;
  const showChrome = list.length > CHROME_THRESHOLD;
  const [form, setForm] = React.useState('');
  const [testedOnly, setTestedOnly] = React.useState(false);
  const [noSweetener, setNoSweetener] = React.useState(false); /* serves the preference without declaring a verdict — same pattern as "Without safety flags" */
  React.useEffect(() => { setForm(''); setTestedOnly(false); setNoSweetener(false); }, [catalogue]);
  /* derived options: counts computed with the OTHER filters applied; zero-result options never render */
  const base = list.filter(p => (!testedOnly || (p.criteria && p.criteria.tested)) && (!noSweetener || !p.sweetened));
  const formOptions = [...new Set(list.map(p => p.form))].sort()
    .map(f => ({ f, count: base.filter(p => p.form === f).length }))
    .filter(o => o.count > 0);
  const shown = base.filter(p => !form || p.form === form);
  /* genuine-preference filters render only when both states exist in the data */
  const hasTestedBoth = list.some(p => p.criteria && p.criteria.tested) && list.some(p => p.criteria && !p.criteria.tested);
  const hasSweetBoth = list.some(p => p.sweetened) && list.some(p => !p.sweetened);
  /* fixed order: checks passed desc (assessed, then label-known, then not-in-db), ties brand A–Z */
  const sorted = [...shown].sort((a, b) => met(b) - met(a) || a.brand.localeCompare(b.brand));
  const filtering = !!form || testedOnly || noSweetener;
  const passAll = list.filter(p => met(p) === 4).length;
  const clear = (e) => { e.preventDefault(); setForm(''); setTestedOnly(false); setNoSweetener(false); };
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 880, margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' }}>
        <Breadcrumb mobile={!desktop} current="Products"
          trail={[{ label: 'Remedies', onClick: () => go('remedies') }, { label: 'Melatonin', onClick: () => go('remedy') }]} />
        <h1 style={{ margin: 'var(--space-1) 0 var(--space-2)', fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)',
          letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)' }}>Melatonin products</h1>
        {/* the intro line declares the order — below threshold it IS the interface */}
        <p style={{ margin: '0 0 var(--space-5)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-muted)', maxWidth: 'var(--measure)', fontVariantNumeric: 'tabular-nums' }}>
          {list.length} products checked — {passAll} pass every check, listed first. Every product we know about is here, including the ones we'd tell you to skip. Same four checks either way.
        </p>
        {showChrome && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', paddingBottom: 'var(--space-4)' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-ui)', color: 'var(--text-muted)' }}>
              Form
              {/* --border-input: this border is the control's sole boundary (3:1 non-text contrast) */}
              <select value={form} onChange={(e) => setForm(e.target.value)}
                style={{ minHeight: 'var(--control-md)', padding: '0 var(--space-3)', borderRadius: 'var(--radius-sm)',
                  border: 'var(--border-w) solid var(--border-input)', background: 'var(--surface-card)', color: 'var(--text-body)',
                  font: 'var(--weight-ui) var(--text-sm) var(--font-sans)' }}>
                <option value="">All forms · {base.length}</option>
                {formOptions.map(o => <option key={o.f} value={o.f}>{o.f} · {o.count}</option>)}
              </select>
            </label>
            {hasTestedBoth && <Chip active={testedOnly} onClick={() => setTestedOnly(t => !t)}>Independently tested</Chip>}
            {hasSweetBoth && <Chip active={noSweetener} onClick={() => setNoSweetener(s => !s)}>No artificial sweeteners</Chip>}
          </div>
        )}
        {filtering && (
          <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {sorted.length === 0 ? <React.Fragment>Nothing matches those filters. <a href="#clear" onClick={clear} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Clear filters</a></React.Fragment>
              : sorted.length === 1 && form ? <React.Fragment>The only {form.toLowerCase()} product we've checked · <a href="#clear" onClick={clear} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Clear filter</a></React.Fragment>
              : sorted.length === 1 ? <React.Fragment>One product matches. <a href="#clear" onClick={clear} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Clear filters</a></React.Fragment>
              : <React.Fragment>{sorted.length} of {list.length} products match. <a href="#clear" onClick={clear} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Clear filters</a></React.Fragment>}
          </p>
        )}
        <div style={{ borderBottom: sorted.length ? 'var(--border-w) solid var(--border-hairline)' : 'none' }}>
          {sorted.map((p, i) => (
            <ProductListRow key={p.brand + p.name + i} {...p} mobile={!desktop}
              onClick={() => goProduct && goProduct(p.name === 'Sleep complex' ? 'complex' : 'melts')} />
          ))}
        </div>
        <p style={{ margin: 'var(--space-4) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}>
          All products shown are fictional demo entries. Order is by our published checks — never by price, brand deals, or anything commercial.
        </p>
        {/* review artifact: the mobile row at 390px, six rows for rhythm */}
        {desktop && (
          <section style={{ marginTop: 'var(--space-9)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-6)' }}>
            <p style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-muted)' }}>
              The mobile row at 390px — six rows, mostly placeholders, one photo
            </p>
            <div style={{ width: 390, maxWidth: '100%', background: 'var(--surface-page)', border: 'var(--border-w) solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)', padding: '0 var(--space-4)', overflow: 'hidden' }}>
              {list.slice(0, 6).map((p, i) => (
                <ProductListRow key={'m' + p.brand + p.name + i} {...p} mobile onClick={() => {}} />
              ))}
            </div>
          </section>
        )}
      </main>
      <DisclaimerBand onGrade={goGrade} />
    </div>
  );
}
