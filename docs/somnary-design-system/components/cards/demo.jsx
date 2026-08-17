import React from 'react';
import ReactDOM from 'react-dom';
import { RemedyCard } from './RemedyCard.jsx';
import { ProductCard } from './ProductCard.jsx';
import { BrandResultRow } from './BrandResultRow.jsx';
import { WhereToBuyRow } from './WhereToBuyRow.jsx';
import { BrandMark } from './BrandMark.jsx';
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included. */
const melatonin = { counts: { cited: 14, sleep: 9, verifiable: 5 } };
function Demo() {
  return (
    <div style={{padding:'var(--space-5)', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'var(--space-4)', alignItems:'start'}}>
      <RemedyCard name="Melatonin" bucket="works" meta="14 sources" research={melatonin} />
      <ProductCard state="assessed" brand="Somnia Labs" name="Melatonin gummies" strength="10 mg" bucket="works"
        criteria={{dose:false, tested:true, disclosed:true, form:true}} lastChecked="14 July 2026" />
      <div style={{display:'flex', flexDirection:'column', gap:'var(--space-3)'}}>
        <ProductCard state="labelOnly" brand="Dreamwell" name="Sleep complex" blend="6 ingredients, 2 undisclosed" />
        <ProductCard state="notFound" brand="Nightcap Co" name="Deep sleep drops" />
      </div>
      <div style={{gridColumn:'1 / 3', display:'flex', flexDirection:'column', gap:'var(--space-1)'}}>
        <BrandResultRow name="Somnia Labs" productCount={4} buckets={['works','maybe','unknown','avoid']} />
        <BrandResultRow name="Nightcap Co" productCount={0} />
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:'var(--space-3)'}}>
        <WhereToBuyRow retailer="Walgreens" price="$14.99" disclosure="Somnary earns nothing from this link." />
        <div style={{display:'flex', gap:'var(--space-3)', alignItems:'center'}}>
          <BrandMark name="Somnia Labs" />
          <BrandMark name="Dreamwell" />
          <BrandMark name="Nightcap Co" />
          <span style={{fontFamily:'var(--font-sans)', fontSize:'var(--text-xs)', color:'var(--text-faint)'}}>BrandMark — the placeholder is the common case</span>
        </div>
      </div>
    </div>
  );
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
export function mountCardsDemo(el) { ReactDOM.createRoot(el).render(<Demo />); }
