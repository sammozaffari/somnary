import React from 'react';
import ReactDOM from 'react-dom';
import { StudyField } from './StudyField.jsx';
import { PlainStat } from './PlainStat.jsx';
import { LabelVsStudies } from './LabelVsStudies.jsx';
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included.
   PlainStat figure carries the sentence's capital (see its CASING RULE). */
function Demo() {
  return (
    <div style={{padding:'var(--space-5)', display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:'var(--space-5) var(--space-7)', alignItems:'start'}}>
      <div style={{display:'flex', flexDirection:'column', gap:'var(--space-5)'}}>
        <StudyField size="hero" counts={{cited:14, sleep:9, verifiable:5}} helped={5} />
        <LabelVsStudies animate={false} claim="Fall asleep 3× faster" found="The studies found about 7 minutes, on average."
          chip={{ finding: 'People taking melatonin fell asleep about 7 minutes sooner than people taking a placebo.', people: 1683, year: 2013, lastChecked: '1 August 2026' }} />
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:'var(--space-5)'}}>
        <PlainStat size="sm" figure="About 7 minutes" text="faster to sleep, on average" source="From a review of 19 studies covering 1,683 people" />
        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-4)', paddingTop:'var(--space-1)', borderTop:'var(--border-w) solid var(--border-hairline)'}}>
          <StudyField size="thumb" counts={{cited:2, sleep:2, verifiable:1}} />
          <StudyField size="thumb" counts={{cited:5, sleep:0, verifiable:0}} safetyFlag="[Placeholder — serious safety concern wording, pending sourcing]" />
          <StudyField size="thumb" counts={{cited:4, sleep:4, verifiable:4}} />
          <StudyField size="thumb" counts={{cited:0, sleep:0, verifiable:0}} />
          <span style={{fontSize:'var(--text-xs)', color:'var(--text-faint)'}}>edge cases: sparse · nothing measured sleep (flag outranks) · everything measured · none</span>
        </div>
      </div>
    </div>
  );
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
export function mountEvidenceDemo(el) { ReactDOM.createRoot(el).render(<Demo />); }
