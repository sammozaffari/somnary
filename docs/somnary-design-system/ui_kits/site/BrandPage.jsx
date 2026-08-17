import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { LastChecked, DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { Breadcrumb } from '../../components/chrome/Breadcrumb.jsx';
import { BrandMark } from '../../components/cards/BrandMark.jsx';
import { ProductListRow } from '../../components/cards/ProductListRow.jsx';
import { PASSES_THRESHOLD } from '../../components/verdicts/ProductScoreBadge.jsx';

/* /brands/dreamwell — one question: "Can I trust this brand's bottles?" — answered the
   Somnary way: DERIVED from the per-product checks, never an editorial opinion or a brand
   score. The counts ARE the sentence; no adjectives ("a good brand", "trusted") anywhere.
   NOT ON THIS PAGE, ever: anything resembling a brand rating, grade, or seal — Somnary
   scores BOTTLES, not companies; a brand page is an aggregation of bottle facts. When most
   products fail, the honest summary carries it — the page never softens it and never
   editorialises beyond the counts.
   Three routes land here: the product breadcrumb, the brand link in the product header,
   and BrandResultRow in search. */

/* SCHEMA RULE: name and strength are separate structured fields — the name never contains
   the dose (see ProductListRow). All entries fictional demo data. */
const BRANDS = {
  dreamwell: {
    key: 'dreamwell', name: 'Dreamwell',
    /* brand-wide certification renders ONLY as a fact line with its register link —
       a fact about scope ("every product"), never a seal, badge, or trust graphic */
    certification: { text: 'Every Dreamwell product we list has been independently tested by a third party.', register: '[Placeholder — testing register link pending verification]' },
    labelSource: '[Placeholder — where Dreamwell label data comes from (own labels, retailer listings), pending verification]',
    batchResults: '[Placeholder — whether Dreamwell publishes batch test results, pending verification]',
    recalls: null,
    products: [
      { key: 'dreamwell-melts', view: 'melts', brand: 'Dreamwell', name: 'Melatonin melts', strength: '1 mg per melt', criteria: { dose: true, tested: true, disclosed: true, form: true } },
      { key: 'dreamwell-complex', view: 'complex', brand: 'Dreamwell', name: 'Sleep complex', strength: 'Blend — 6 ingredients, amounts not disclosed', criteria: { dose: false, tested: true, disclosed: false, form: true } },
    ],
    lastChecked: '14 July 2026',
  },
  /* edge state: ONE product — the summary sentence and list must read complete, not broken */
  somnol: {
    key: 'somnol', name: 'Somnol',
    certification: null,
    labelSource: '[Placeholder — where Somnol label data comes from, pending verification]',
    batchResults: '[Placeholder — whether Somnol publishes batch test results, pending verification]',
    recalls: null,
    products: [
      /* keys are unique and truthful; `view` names the demo product-page view where one
         exists — only Dreamwell's two products have built pages */
      { key: 'somnol-spray', brand: 'Somnol', name: 'Melatonin spray', strength: '[Strength pending assessment]', status: 'label-known' },
    ],
    lastChecked: '14 July 2026',
  },
  /* edge state: most products fail — the summary carries it ("3 products checked — 0 pass
     every check, 3 we'd tell you to skip"), stated as counts, never softened, no
     editorial beyond them. Also the recall-on-record state: the recalls row renders ONLY
     here; absence of the row is the good state, never "no recalls!" as a boast */
  herbwell: {
    key: 'herbwell', name: 'Herbwell',
    certification: null,
    labelSource: '[Placeholder — where Herbwell label data comes from, pending verification]',
    batchResults: '[Placeholder — whether Herbwell publishes batch test results, pending verification]',
    recalls: '[Placeholder — recall or regulatory action on record, with date and regulator link, pending verification]',
    products: [
      { key: 'herbwell-night-blend', brand: 'Herbwell', name: 'Night blend', strength: 'Blend — amounts not disclosed', criteria: { dose: false, tested: false, disclosed: false, form: false } },
      { key: 'herbwell-valerian', brand: 'Herbwell', name: 'Valerian capsules', strength: '400 mg per capsule', criteria: { dose: false, tested: false, disclosed: true, form: true } },
      { key: 'herbwell-chamomile-tea', brand: 'Herbwell', name: 'Chamomile tea', strength: 'Not stated on label', criteria: { dose: false, tested: false, disclosed: false, form: false } },
    ],
    lastChecked: '14 July 2026',
  },
};

const met = (p) => p.criteria ? Object.values(p.criteria).filter(Boolean).length : -1;

/* HONEST SUMMARY LINE — derived from the data, stated as counts, not adjectives.
   Grammar bends to the count: 1 → "1 product checked — it passes every check";
   skip-count appears only when > 0 ("2 we'd tell you to skip"). Assessed = has criteria;
   label-known products are counted as "not yet assessed", never as passes or failures. */
function summaryLine(products) {
  const assessed = products.filter(p => p.criteria);
  const pending = products.length - assessed.length;
  const pass = assessed.filter(p => met(p) === 4).length;
  const skip = assessed.filter(p => met(p) < PASSES_THRESHOLD).length;
  const n = products.length;
  if (n === 1 && pending === 1) return '1 product on record — not yet assessed.';
  if (n === 1) return `1 product checked — it ${met(assessed[0]) === 4 ? 'passes every check' : met(assessed[0]) >= PASSES_THRESHOLD ? `passes ${met(assessed[0])} of 4 checks` : "fails our checks; we'd tell you to skip it"}.`;
  let s = `${assessed.length} products checked — ${pass} pass${pass === 1 ? 'es' : ''} every check`;
  if (skip > 0) s += `, ${skip} we'd tell you to skip`;
  if (pending > 0) s += `; ${pending} more on record, not yet assessed`;
  return s + '.';
}

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

export function BrandPage({ go, goProduct, goGrade, which = 'dreamwell' }) {
  const desktop = useDesktop();
  const b = BRANDS[which] || BRANDS.dreamwell;
  const sorted = [...b.products].sort((a, c) => met(c) - met(a) || a.name.localeCompare(c.name));
  /* SYSTEM RULE: chrome scales with catalogue size — under ~20 items no filter row, no sort;
     the list is the interface (see ProductsPage). No demo brand is near threshold. */
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 880, margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' }}>
        {/* SYSTEM RULE: breadcrumbs on every page (root exempt); mobile truncates to "‹ Parent". */}
        <Breadcrumb mobile={!desktop} current={b.name} trail={[{ label: 'Products', onClick: () => go('products') }]} />

        {/* HEADER — placeholder mark at ~120px (the common no-image case, as everywhere),
           h1, and the derived summary line */}
        <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', padding: 'var(--space-2) 0 var(--space-6)' }}>
          <BrandMark name={b.name} size={desktop ? 120 : 88} radius="var(--radius-lg)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)',
              letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)' }}>{b.name}</h1>
            <p style={{ ...muted, fontVariantNumeric: 'tabular-nums' }}>{summaryLine(b.products)}</p>
            {b.certification && (
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>
                {b.certification.text}{' '}<a href="#register" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>{b.certification.register}</a>
              </p>
            )}
          </div>
        </div>

        {/* THE PRODUCT LIST — same C3 row as everywhere, same fixed order (checks passed
           desc, name A–Z as tiebreak), declared in prose; failing products identical treatment */}
        <section>
          <h2 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
            letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' }}>Their products we know about</h2>
          <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            {sorted.length === 1 ? 'The one product of theirs in our database.' : 'Most checks passed first — including anything we\'d tell you to skip.'}
          </p>
          <div style={{ borderBottom: 'var(--border-w) solid var(--border-hairline)' }}>
            {sorted.map(p => (
              /* rows without a built demo product page are non-links — never route a demo
                 product to another product's page */
              <ProductListRow key={p.key} {...p} mobile={!desktop} onClick={p.view && goProduct ? () => goProduct(p.view) : undefined} />
            ))}
          </div>
        </section>

        {/* WHAT WE KNOW ABOUT THE BRAND — short factual block; the recalls row renders only
           when a recall EXISTS. Its absence is the good state — never "no recalls" as a boast. */}
        <section style={{ marginTop: 'var(--space-8)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-8)' }}>
          <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)',
            letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' }}>What we know about {b.name}</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {[['Label data', b.labelSource], ['Batch test results', b.batchResults], ...(b.recalls ? [['On record', b.recalls]] : [])].map(([label, text]) => (
              <li key={label} style={{ display: 'grid', gridTemplateColumns: desktop ? '160px minmax(0, 1fr)' : '1fr', gap: 'var(--space-1) var(--space-5)',
                padding: 'var(--space-3) 0', borderTop: 'var(--border-w) solid var(--border-hairline)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--text-body)' }}>{label}</span>
                <span style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-snug)', color: 'var(--text-muted)', maxWidth: 'var(--measure)' }}>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* corrections + staleness — brand pages go stale the same way product pages do */}
        <div style={{ marginTop: 'var(--space-8)', background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)',
          borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 'var(--measure)' }}>
          <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>Spotted something wrong?</p>
          <p style={{ ...muted, marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
            Brands change hands, formulations, and labels. <a href="#report" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-strong)' }}>Tell us</a> and we'll re-check.
          </p>
        </div>
        <div style={{ marginTop: 'var(--space-4)' }}><LastChecked date={b.lastChecked} prefix="This page last checked" /></div>
      </main>
      <DisclaimerBand onGrade={goGrade} />
    </div>
  );
}
