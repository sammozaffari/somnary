import React from 'react';
import ReactDOM from 'react-dom';
import { BucketBadge } from './BucketBadge.jsx';
import { ProductScoreBadge } from './ProductScoreBadge.jsx';
import { PairedVerdict } from './PairedVerdict.jsx';
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included. */
function Demo() {
  return (
    <div style={{padding:'var(--space-5)', display:'flex', flexDirection:'column', gap:'var(--space-5)'}}>
      <div style={{display:'flex', flexWrap:'wrap', gap:'var(--space-4) var(--space-7)', alignItems:'flex-start'}}>
        <BucketBadge bucket="works" />
        <BucketBadge bucket="unknown" />
        <BucketBadge bucket="avoid" compact />
        <ProductScoreBadge criteria={{dose:true, tested:true, disclosed:true, form:false}} />
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)', alignItems:'start'}}>
        <PairedVerdict bucket="unknown" ingredientName="valerian" productName="x"
          criteria={{dose:true, tested:true, disclosed:true, form:true}} />
        <PairedVerdict bucket="works" ingredientName="melatonin" productName="x"
          criteria={{dose:false, tested:false, disclosed:true, form:true}} />
      </div>
    </div>
  );
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
export function mountVerdictsDemo(el) { ReactDOM.createRoot(el).render(<Demo />); }
