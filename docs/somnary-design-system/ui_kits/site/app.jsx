import React from 'react';
import ReactDOM from 'react-dom';
import { HomePage } from './HomePage.jsx';
import { RemedyPage } from './RemedyPage.jsx';
import { RemediesPage } from './RemediesPage.jsx';
import { GradePage } from './GradePage.jsx';
import { ProblemPage } from './ProblemPage.jsx';
import { ProductsPage } from './ProductsPage.jsx';
import { ProductPage } from './ProductPage.jsx';
import { SafetyPage } from './SafetyPage.jsx';
import { BrandPage } from './BrandPage.jsx';

function Chrome({ theme, setTheme, screen, which, setWhich, product, setProduct, catalogue, setCatalogue, brand, setBrand }) {
  const dusk = theme === 'dusk';
  const btn = {
    minHeight: 36, padding: '0 14px', borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border-strong)', background: 'var(--surface-card)',
    color: 'var(--text-muted)', font: '600 12px var(--font-sans)', cursor: 'pointer',
  };
  return (
    <div style={{ position: 'fixed', bottom: 14, right: 14, zIndex: 50, display: 'flex', gap: 8 }}>
      {screen === 'remedy' && (
        <button type="button" onClick={() => setWhich(which === 'kava' ? 'melatonin' : 'kava')} style={btn}>
          {which === 'kava' ? 'View: Kava (worst case)' : 'View: Melatonin'}
        </button>
      )}
      {screen === 'product' && (
        <button type="button" onClick={() => setProduct(product === 'complex' ? 'melts' : 'complex')} style={btn}>
          {product === 'complex' ? 'View: Failing (1 of 4)' : 'View: Passing (4 of 4)'}
        </button>
      )}
      {screen === 'brand' && (
        <button type="button" onClick={() => setBrand(brand === 'dreamwell' ? 'somnol' : brand === 'somnol' ? 'herbwell' : 'dreamwell')} style={btn}>
          {brand === 'dreamwell' ? 'View: Somnol (1 product)' : brand === 'somnol' ? 'View: Herbwell (recall)' : 'View: Dreamwell (2 products)'}
        </button>
      )}
      {screen === 'products' && (
        <button type="button" onClick={() => setCatalogue(catalogue === 'large' ? 'melatonin' : 'large')} style={btn}>
          {catalogue === 'large' ? 'View: Melatonin (12 — no chrome)' : 'View: ~40-product mock (chrome)'}
        </button>
      )}
      <button type="button" onClick={() => setTheme(dusk ? 'day' : 'dusk')} aria-pressed={dusk} style={btn}>
        {dusk ? 'day' : 'dusk'}
      </button>
    </div>
  );
}

function App() {
  const [screen, setScreen] = React.useState('home');
  const [which, setWhich] = React.useState('melatonin');
  const [product, setProduct] = React.useState('melts');
  const [catalogue, setCatalogue] = React.useState('melatonin');
  const [brand, setBrand] = React.useState('dreamwell');
  const [gradeSection, setGradeSection] = React.useState(null);
  const [theme, setTheme] = React.useState('day');
  React.useEffect(() => {
    if (theme === 'dusk') document.documentElement.setAttribute('data-theme', 'dusk');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);
  React.useEffect(() => { if (screen !== 'grade') window.scrollTo(0, 0); }, [screen, which]);
  /* one section-aware grade route, shared by every badge and footer link */
  const goGrade = (s) => { setGradeSection(s || null); setScreen('grade'); };
  return (
    <React.Fragment>
      <Chrome theme={theme} setTheme={setTheme} screen={screen} which={which} setWhich={setWhich} product={product} setProduct={setProduct} catalogue={catalogue} setCatalogue={setCatalogue} brand={brand} setBrand={setBrand} />
      {screen === 'remedy'
        ? <RemedyPage go={setScreen} goGrade={goGrade} which={which} />
        : screen === 'remedies'
        ? <RemediesPage go={setScreen} goRemedy={(w) => { setWhich(w); setScreen('remedy'); }}
            goGrade={goGrade} />
        : screen === 'grade'
        ? <GradePage go={setScreen} section={gradeSection} />
        : screen === 'problem'
        ? <ProblemPage go={setScreen} goRemedy={(w) => { setWhich(w); setScreen('remedy'); }} goGrade={goGrade} />
        : screen === 'products'
        ? <ProductsPage go={setScreen} goProduct={(p) => { setProduct(p); setScreen('product'); }} goGrade={goGrade} catalogue={catalogue} />
        : screen === 'product'
        ? <ProductPage go={setScreen} goRemedy={(w) => { setWhich(w); setScreen('remedy'); }} goGrade={goGrade} goBrand={(k) => { setBrand(k); setScreen('brand'); }} which={product} />
        : screen === 'brand'
        ? <BrandPage go={setScreen} goProduct={(p) => { setProduct(p); setScreen('product'); }} goGrade={goGrade} which={brand} />
        : screen === 'safety'
        ? <SafetyPage go={setScreen} goRemedy={(w) => { setWhich(w); setScreen('remedy'); }} goGrade={goGrade} />
        : <HomePage go={setScreen} goGrade={goGrade} goRemedy={(w) => { setWhich(w); setScreen('remedy'); }} goBrand={(k) => { setBrand(k); setScreen('brand'); }} />}
    </React.Fragment>
  );
}

/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
export function mountSite(el) {
  ReactDOM.createRoot(el).render(<App />);
}
