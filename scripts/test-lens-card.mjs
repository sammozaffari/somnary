#!/usr/bin/env node
/**
 * Lens-card renderer suite (CHK-7.2) — the offline unit gate for src/lib/lens/render-card.ts, the
 * SAFETY-CRITICAL, framework-free renderer that turns a server-composed LensAssessment into DOM.
 *
 * NO real DOM (no jsdom/linkedom dependency — none is installed, and 7.2 adds no npm dep). Instead a
 * TINY instrumented fake Document/Element records every write and CRUCIALLY makes the invariant
 * observable: our fake `textContent` setter is the ONLY channel that stores content, and any attempt to
 * assign `innerHTML` a non-empty string THROWS. So the suite proves, structurally, that the renderer
 * sets content via textContent only and uses innerHTML solely to clear (`=''`).
 *
 * Proves per status ('assessed'|'short-circuit'|'inconclusive'|'refused'):
 *   • the expected blocks render (verdict/stamp/disclaimer/evidence/doesNotShow/label/safety/etc.);
 *   • every content node was set via textContent, never innerHTML (enforced by the throwing fake);
 *   • strength shows a TEXT label (not color-only);
 *   • every <a> got its href from a server field / fixed route (no invented hrefs);
 *   • no grade/tier/score string is rendered anywhere;
 *   • stamp + disclaimer present on assessed AND inconclusive; absent as verdict on refused.
 *
 *   node scripts/test-lens-card.mjs   # deterministic, fully offline.
 */
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const { renderLensCard } = await import(pathToFileURL(join(ROOT, 'src/lib/lens/render-card.ts')).href);

let pass = 0;
let fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

// --- the instrumented fake DOM --------------------------------------------------------------------
// Minimal: enough surface for render-card.ts (createElement, className, textContent, href/target/rel,
// setAttribute, appendChild, innerHTML='' to clear). The textContent setter is the ONLY content sink;
// innerHTML rejects any non-empty assignment so a markup-injection regression fails loudly.

class FakeElement {
  constructor(doc, tag) {
    this.ownerDocument = doc;
    this.tagName = String(tag).toUpperCase();
    this.className = '';
    this.children = [];
    this.attributes = {};
    this._text = null; // set ONLY via textContent
    this.href = undefined;
    this.target = undefined;
    this.rel = undefined;
  }
  set textContent(v) {
    this._text = String(v);
    // textContent clears children in the real DOM; mirror that so counts are honest.
    this.children = [];
  }
  get textContent() {
    if (this._text != null) return this._text;
    return this.children.map((c) => c.textContent ?? '').join('');
  }
  set innerHTML(v) {
    if (v !== '') throw new Error(`innerHTML assigned non-empty content: ${JSON.stringify(String(v)).slice(0, 60)} — content must go through textContent`);
    this._text = null;
    this.children = [];
  }
  get innerHTML() {
    return '';
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }
  appendChild(node) {
    this.children.push(node);
    return node;
  }
  // helpers for assertions (not part of the DOM API the renderer uses)
  walk() {
    const out = [this];
    for (const c of this.children) out.push(...c.walk());
    return out;
  }
  allText() {
    return this.walk()
      .map((n) => (n._text != null ? n._text : ''))
      .join(' ');
  }
  anchors() {
    return this.walk().filter((n) => n.tagName === 'A');
  }
  byClassContains(sub) {
    return this.walk().filter((n) => (n.className || '').includes(sub));
  }
}

class FakeDocument {
  createElement(tag) {
    return new FakeElement(this, tag);
  }
}

function makeContainer() {
  const doc = new FakeDocument();
  const container = new FakeElement(doc, 'div');
  container.ownerDocument = doc;
  return container;
}

// --- fixtures — one representative assessment per status (shape = engine.ts LensAssessment) --------

const source = { pmid: '12345678', url: 'https://pubmed.ncbi.nlm.nih.gov/12345678/' };
const doiSource = { doi: '10.1000/xyz', url: 'https://doi.org/10.1000/xyz' };

const STAMP = 'AI-assisted research · not a Somnary grade';
const DISCLAIMER = 'This is educational, not medical advice. It describes what published research does and does not show.';
const SAFETY_NOTE = 'Safety, interactions, and who should be careful are personal and can be serious.';

const assessed = {
  input: { kind: 'ingredient', normalized: 'apigenin' },
  status: 'assessed',
  verdictLine: 'The Lens verified 2 claims against published sources. Read each finding and its source below.',
  evidence: [
    { text: 'A small trial reported a modest reduction in time to fall asleep.', strength: 'weak', sources: [source] },
    { text: 'A second study found improved self-reported sleep quality.', strength: 'strong', sources: [doiSource] },
  ],
  doesNotShow: [
    '1 candidate claim did not survive verification.',
    'This assessment covers only what the cited studies measured.',
  ],
  labelFlags: [
    { rule: 'R5', ingredient: 'melatonin', text: 'This label lists melatonin, an additive on the watchlist.', href: '/safety', linkLabel: "melatonin: why it's on the watchlist" },
  ],
  safety: { routes: [{ href: '/safety', label: 'Safety & who should be careful' }, { href: '/when-to-see-a-doctor', label: 'When to see a doctor' }], note: SAFETY_NOTE },
  stamp: STAMP,
  reviewRoute: { href: '/request-a-review', label: 'Request a full human review' },
  disclaimer: DISCLAIMER,
  meta: {},
};

const inconclusive = {
  input: { kind: 'product', normalized: 'sleepy-time gummies' },
  status: 'inconclusive',
  verdictLine: "Somnary's Lens could not find published human evidence it could verify for this subject.",
  evidence: [],
  doesNotShow: ['No human trial evidence survived verification.', 'This assessment covers only what the cited studies measured.'],
  labelFlags: [{ rule: 'R1', ingredient: null, text: 'This label uses a proprietary blend.', href: '/label-checker', linkLabel: 'How proprietary blends hide doses' }],
  safety: { routes: [{ href: '/safety', label: 'Safety & who should be careful' }], note: SAFETY_NOTE },
  stamp: STAMP,
  reviewRoute: { href: '/request-a-review', label: 'Request a full human review' },
  disclaimer: DISCLAIMER,
  meta: {},
};

const shortCircuit = {
  input: { kind: 'ingredient', normalized: 'melatonin' },
  status: 'short-circuit',
  shortCircuit: { slug: 'melatonin', name: 'Melatonin', href: '/r/melatonin' },
  verdictLine: '',
  evidence: [],
  doesNotShow: [],
  labelFlags: [],
  safety: { routes: [{ href: '/safety', label: 'Safety & who should be careful' }], note: SAFETY_NOTE },
  stamp: STAMP,
  reviewRoute: { href: '/request-a-review', label: 'Request a full human review' },
  disclaimer: DISCLAIMER,
  meta: {},
};

const refused = {
  input: { kind: 'question', normalized: 'how much should I take tonight' },
  status: 'refused',
  verdictLine: 'That is a question for a person who knows your health — please talk with a doctor or pharmacist.',
  evidence: [],
  doesNotShow: [],
  labelFlags: [],
  safety: { routes: [{ href: '/when-to-see-a-doctor', label: 'When to see a doctor' }], note: SAFETY_NOTE },
  stamp: STAMP,
  reviewRoute: { href: '/request-a-review', label: 'Request a full human review' },
  disclaimer: DISCLAIMER,
  meta: {},
};

// A grade-shaped string must NEVER appear from the renderer's own labels. This regex is the guard.
const GRADE_RE = /\b(?:grade|tier)\s+[A-FS]\b|\b[A-FS]\s+(?:grade|tier)\b|\btier\s+list\b/i;

// --- ASSESSED ------------------------------------------------------------------------------------
{
  const c = makeContainer();
  renderLensCard(assessed, c); // if a markup-innerHTML regression existed, the fake throws here
  const text = c.allText();
  ok('assessed: renders without innerHTML markup injection (fake DOM would have thrown)', true);
  ok('assessed: verdict line present', text.includes('verified 2 claims'));
  ok('assessed: stamp present', text.includes(STAMP));
  ok('assessed: disclaimer present (near verdict)', text.includes('educational, not medical advice'));
  ok('assessed: evidence head present', text.includes('What the evidence shows'));
  ok('assessed: both evidence texts rendered', text.includes('time to fall asleep') && text.includes('self-reported sleep quality'));
  ok('assessed: strength shown as TEXT label (weaker/stronger), not color-only', text.includes('weaker evidence') && text.includes('stronger evidence'));
  ok('assessed: doesNotShow head + lines present', text.includes('What it does NOT show') && text.includes('did not survive verification'));
  ok('assessed: label-flag head + text present', text.includes('Label reality') && text.includes('additive on the watchlist'));
  ok('assessed: safety head + note present', text.includes('Safety & interactions') && text.includes('who should be careful are personal'));

  const anchors = c.anchors();
  const hrefs = anchors.map((a) => a.href);
  ok('assessed: source chip hrefs come from server sources', hrefs.includes(source.url) && hrefs.includes(doiSource.url));
  ok('assessed: source chip labels are pmid/doi text', c.allText().includes('PMID 12345678') && c.allText().includes('DOI 10.1000/xyz'));
  ok('assessed: label-flag link href is server flag href', hrefs.includes('/safety'));
  ok('assessed: safety route links present', hrefs.includes('/when-to-see-a-doctor'));
  ok('assessed: review route link present', hrefs.includes('/request-a-review'));
  ok('assessed: follow-ups render (tiers/label-checker/search)', hrefs.includes('/tiers') && hrefs.includes('/label-checker') && hrefs.includes('/search'));
  ok('assessed: every anchor has a non-empty href (no invented/empty href)', anchors.every((a) => typeof a.href === 'string' && a.href.length > 0));
  ok('assessed: NO grade/tier/score string anywhere', !GRADE_RE.test(text));
  // strength chip carries a class encoding strength too (belt-and-suspenders with the text label)
  ok('assessed: strength chip has is-weak / is-strong class (redundant with text)', c.byClassContains('is-weak').length >= 1 && c.byClassContains('is-strong').length >= 1);
}

// --- INCONCLUSIVE --------------------------------------------------------------------------------
{
  const c = makeContainer();
  renderLensCard(inconclusive, c);
  const text = c.allText();
  ok('inconclusive: verdict (engine INCONCLUSIVE message) present', text.includes('could not find published human evidence'));
  ok('inconclusive: stamp present', text.includes(STAMP));
  ok('inconclusive: disclaimer present', text.includes('educational, not medical advice'));
  ok('inconclusive: NO evidence block (no evidence to show)', !text.includes('What the evidence shows'));
  ok('inconclusive: doesNotShow present', text.includes('What it does NOT show'));
  ok('inconclusive: labelFlags still surface (deterministic)', text.includes('proprietary blend'));
  ok('inconclusive: safety block present', text.includes('Safety & interactions'));
  ok('inconclusive: review route present', c.anchors().some((a) => a.href === '/request-a-review'));
  ok('inconclusive: NO grade/tier/score string', !GRADE_RE.test(text));
}

// --- SHORT-CIRCUIT -------------------------------------------------------------------------------
{
  const c = makeContainer();
  renderLensCard(shortCircuit, c);
  const text = c.allText();
  ok('short-circuit: fixed client line present (not a grade)', text.includes('Somnary already grades this'));
  const a = c.anchors();
  ok('short-circuit: prominent link to the graded page', a.some((x) => x.href === '/r/melatonin' && /Melatonin/.test(x.textContent)));
  ok('short-circuit: NO evidence/doesNotShow/verdict blocks', !text.includes('What the evidence shows') && !text.includes('What it does NOT show'));
  ok('short-circuit: NO grade/tier/score string', !GRADE_RE.test(text));
}

// --- REFUSED -------------------------------------------------------------------------------------
{
  const c = makeContainer();
  renderLensCard(refused, c);
  const text = c.allText();
  ok('refused: engine canned boundary message present', text.includes('question for a person who knows your health'));
  ok('refused: safety routes present (safety register)', c.anchors().some((x) => x.href === '/when-to-see-a-doctor'));
  ok('refused: routes wrapper carries the safety register class', c.byClassContains('lc-safety-register').length >= 1);
  ok('refused: NO evidence/stamp-as-verdict/label blocks', !text.includes('What the evidence shows') && !text.includes('Label reality'));
  ok('refused: stamp NOT rendered as a verdict', !text.includes(STAMP));
  ok('refused: NO grade/tier/score string', !GRADE_RE.test(text));
}

// --- clear-on-rerender: a second render must not duplicate the first ------------------------------
{
  const c = makeContainer();
  renderLensCard(assessed, c);
  renderLensCard(shortCircuit, c);
  const text = c.allText();
  ok('re-render clears prior card (no assessed content lingering)', !text.includes('verified 2 claims') && text.includes('Somnary already grades this'));
}

console.log(`\n${fail === 0 ? '✓' : '✗'} lens-card suite: ${pass} passed, ${fail} failed.`);
process.exit(fail === 0 ? 0 : 1);
