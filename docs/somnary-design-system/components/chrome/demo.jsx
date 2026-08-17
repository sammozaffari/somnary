import React from 'react';
import ReactDOM from 'react-dom';
import { Wordmark } from './Wordmark.jsx';
import { SearchField } from './SearchField.jsx';
import { SafetyCallout, LastChecked, DisclaimerBand } from './SafetyCallout.jsx';
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included.
   CONTENT RULE: safety copy in design files is always a [Placeholder — …] string (see the
   drift history on SafetyCallout). */
const PH = '[Placeholder — interaction wording pending sourcing]';
const PH_SERIOUS = '[Placeholder — serious safety concern wording, pending sourcing]';
function Label({ children }) {
  return <p style={{margin:0, fontSize:'var(--text-xs)', fontWeight:'var(--weight-strong)', color:'var(--text-faint)'}}>{children}</p>;
}
/* the callout at its three legal widths — full (side-by-side renders, self-measured),
   card (~320px, stacks), and the narrowest row context it can appear in (~200px) */
function Callouts() {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:'var(--space-3)'}}>
      <Label>Safety callout — full / card / narrowest; caution outline vs serious filled</Label>
      <SafetyCallout level="caution">{PH}</SafetyCallout>
      <div style={{display:'flex', gap:'var(--space-4)', alignItems:'flex-start', flexWrap:'wrap'}}>
        <div style={{width:320}}><SafetyCallout level="serious">{PH_SERIOUS}</SafetyCallout></div>
        <div style={{width:200}}><SafetyCallout level="caution">{PH}</SafetyCallout></div>
      </div>
    </div>
  );
}
function Demo({ dusk }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:'var(--space-5)', padding:'var(--space-5) var(--space-5) 0'}}>
      {!dusk && (
        <React.Fragment>
          <div style={{display:'flex', alignItems:'center', gap:'var(--space-6)'}}>
            <Wordmark size={30} />
            <LastChecked date="1 August 2026" />
          </div>
          <SearchField />
        </React.Fragment>
      )}
      <Callouts />
      {/* dusk view: same page re-loaded in a frame with data-theme on documentElement —
         the aliases are computed at :root, so a nested wrapper can't retheme */}
      {!dusk && (
        <React.Fragment>
          <Label>The same callouts at dusk</Label>
          <iframe src="chrome.card.html#dusk" title="Dusk" style={{width:'100%', height:280, border:'var(--border-w) solid var(--border-hairline)', borderRadius:'var(--radius-md)'}}></iframe>
          <DisclaimerBand style={{margin:'0 calc(-1 * var(--space-5))'}} />
        </React.Fragment>
      )}
    </div>
  );
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
export function mountChromeDemo(el) {
  const dusk = window.location.hash.indexOf('dusk') !== -1;
  if (dusk) document.documentElement.setAttribute('data-theme', 'dusk');
  ReactDOM.createRoot(el).render(<Demo dusk={dusk} />);
}
