import React from 'react';
import ReactDOM from 'react-dom';
import { StudyField } from './StudyField.jsx';
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included. */
const C = { melatonin: { cited: 14, sleep: 9, verifiable: 5 }, kava: { cited: 5, sleep: 0, verifiable: 0 },
  sparse: { cited: 2, sleep: 2, verifiable: 1 }, all: { cited: 9, sleep: 9, verifiable: 6 } };
function Col({ title, children }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:'var(--space-4)', minWidth:0}}>
      <div style={{fontSize:'var(--text-sm)', fontWeight:'var(--weight-strong)', color:'var(--text-body)', borderBottom:'var(--border-w) solid var(--border-hairline)', paddingBottom:'var(--space-2)'}}>{title}</div>
      {children}
    </div>
  );
}
function Label({ children }) {
  return <div style={{fontSize:'var(--text-xs)', color:'var(--text-faint)', marginBottom:'calc(-1 * var(--space-2))'}}>{children}</div>;
}
function Demo() {
  return (
    <div style={{padding:'var(--space-5)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-5) var(--space-7)', alignItems:'start'}}>
      <Col title="(a) Three tiers — the verify count lives in the bar">
        <Label>Hero — melatonin</Label>
        <StudyField counts={C.melatonin} helped={5} />
        <Label>Thumb (compact, standalone)</Label>
        <StudyField size="thumb" counts={C.melatonin} />
        <Label>Edge: measured sleep, none verifiable</Label>
        <StudyField size="thumb" counts={{cited:5, sleep:2, verifiable:0}} />
      </Col>
      <Col title="(b) Two tiers — verify count expands beneath">
        <Label>Hero — melatonin</Label>
        <StudyField variant="two" counts={C.melatonin} helped={5} />
        <Label>Thumb (compact, standalone)</Label>
        <StudyField variant="two" size="thumb" counts={C.melatonin} />
        <Label>Edge: measured sleep, none verifiable</Label>
        <StudyField variant="two" size="thumb" counts={{cited:5, sleep:2, verifiable:0}} />
      </Col>
      <div style={{gridColumn:'1 / -1', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'var(--space-6)', borderTop:'var(--border-w) solid var(--border-hairline)', paddingTop:'var(--space-4)'}}>
        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-2)'}}><Label>Edge: none measured sleep (kava) + flag</Label>
          <StudyField size="thumb" counts={C.kava} safetyFlag="[Placeholder — serious safety concern wording, pending sourcing]" /></div>
        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-2)'}}><Label>Edge: everything measured sleep</Label>
          <StudyField size="thumb" counts={C.all} /></div>
        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-2)'}}><Label>Edge: no papers at all</Label>
          <StudyField size="thumb" counts={{cited:0, sleep:0, verifiable:0}} /></div>
      </div>
    </div>
  );
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
export function mountFilterVariantsDemo(el) { ReactDOM.createRoot(el).render(<Demo />); }
