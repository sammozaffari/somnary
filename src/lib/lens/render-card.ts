/**
 * Shared Lens-card renderer (CHK-7.2) — the SINGLE, framework-free place a server-composed
 * `LensAssessment` is turned into DOM. LensPanel (the live island) calls this, so the SAFETY-CRITICAL
 * render path lives in exactly one file, mirroring render-map.ts (the guide's reading-map renderer).
 *
 * THE INVARIANT, ENFORCED HERE (it must NOT undo what the engine guarantees):
 *   • Every rendered CONTENT string is set via `textContent` — NEVER innerHTML, never a template string
 *     assigned as markup. `innerHTML=''` is used ONLY to clear the container. No server, model, or user
 *     text is ever injected as HTML.
 *   • This renderer AUTHORS NO medical prose. Every medical sentence (verdict, evidence text,
 *     doesNotShow, label-flag text, safety note, stamp, disclaimer) is a SERVER field, rendered
 *     verbatim. The only strings this file introduces are STRUCTURAL LABELS ("What the evidence shows",
 *     "Stronger evidence", follow-up prompts) — never a claim, dose, grade, or judgement.
 *   • Every link is an `<a href>` whose href is the SERVER-provided href (a source url, a flag href, or
 *     a route href) and whose visible text is a server label or a fixed structural label (textContent).
 *   • There is NO grade/tier/score anywhere — the engine emits none, and this renderer invents none.
 *   • Evidence strength is shown as a TEXT label AND a chip class — never color alone (design G-rule).
 *
 * Erasable TS: types (re-declared structurally so the CI runner / island both import cleanly) + a plain
 * function, no framework imports. Never throws on a well-formed assessment.
 */

// --- the assessment shape (structural mirror of engine.ts LensAssessment — this file renders it) -----
// Re-declared here (not imported from engine.ts) so the renderer stays a leaf module the offline harness
// and the island can both import without pulling the whole engine graph. Kept in sync by the T1 harness.

export type LensCardStatus = 'assessed' | 'short-circuit' | 'refused' | 'inconclusive';

export interface LensCardSource {
  pmid?: string;
  doi?: string;
  registry?: string;
  url: string;
}
export interface LensCardEvidence {
  text: string;
  strength: 'strong' | 'weak';
  sources: LensCardSource[];
}
export interface LensCardFlag {
  rule: string;
  ingredient: string | null;
  text: string;
  href: string;
  linkLabel: string;
}
export interface LensCardRoute {
  href: string;
  label: string;
}
export interface LensCardShortCircuit {
  slug: string;
  name: string;
  href: string;
}
/** What the Lens took the query to mean (CHK-7.4). `line` is the server-composed "read X as Y" sentence
 * — rendered verbatim via textContent, exactly like every other server field. */
export interface LensCardResolved {
  subject: string;
  resolvedName: string;
  productClass: string;
  line: string;
}
export interface LensCardAssessment {
  input: { kind: 'ingredient' | 'product' | 'question'; normalized: string };
  status: LensCardStatus;
  shortCircuit?: LensCardShortCircuit;
  resolved?: LensCardResolved;
  verdictLine: string;
  evidence: LensCardEvidence[];
  doesNotShow: string[];
  labelFlags: LensCardFlag[];
  safety: { routes: LensCardRoute[]; note: string };
  stamp: string;
  reviewRoute: LensCardRoute;
  disclaimer: string;
  meta?: unknown;
}

// --- fixed structural labels (client-authored — NOT medical prose) -----------------------------------
// These are the only strings this file introduces. They name the STRUCTURE of the card; none is a
// claim, a dose, a grade, or a judgement. Every medical sentence comes from the server assessment.

const LABEL = {
  evidenceHead: 'What the evidence shows',
  doesNotShowHead: 'What it does NOT show',
  labelHead: 'Label reality',
  safetyHead: 'Safety & interactions',
  sourcesLabel: 'Sources',
  strengthStrong: 'stronger evidence',
  strengthWeak: 'weaker evidence',
  followUpHead: 'Keep looking',
  // The short-circuit line is a fixed STRUCTURAL string (verdictLine is '' in this state) — it is not a
  // grade or a judgement, only a pointer to the human-graded page.
  shortCircuitLine: 'Somnary already grades this — read the vetted page.',
} as const;

/** A source id → its short textContent chip label (never a raw-HTML render; textContent only). */
function sourceLabel(s: LensCardSource): string {
  if (s.pmid) return `PMID ${s.pmid}`;
  if (s.doi) return `DOI ${s.doi}`;
  if (s.registry) return s.registry;
  return 'source';
}

/**
 * Deterministic, client-authored follow-up prompts keyed off status + input.kind. These are FIXED
 * structural templates — NO model or server field feeds them, so they can never smuggle a claim. They
 * are navigation nudges (where to look next), never advice. Empty array ⇒ no follow-up block.
 */
function followUps(status: LensCardStatus, kind: LensCardAssessment['input']['kind']): LensCardRoute[] {
  if (status === 'assessed' || status === 'inconclusive') {
    const out: LensCardRoute[] = [
      { href: '/tiers', label: 'Compare with a graded remedy' },
      { href: '/label-checker', label: 'Check a different product' },
    ];
    // A pasted product/ingredient can also be searched in the corpus by name.
    if (kind === 'product' || kind === 'ingredient') {
      out.push({ href: '/search', label: 'Search Somnary for this ingredient' });
    }
    return out;
  }
  return [];
}

// --- small DOM helpers (textContent only) ------------------------------------------------------------

function el<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (typeof text === 'string') node.textContent = text; // ALWAYS textContent — never innerHTML
  return node;
}

/** A titled section wrapper: <section class="lc-block"><p class="lc-head">…</p> … </section>. */
function block(doc: Document, headText: string, className: string): { section: HTMLElement } {
  const section = el(doc, 'section', 'lc-block ' + className);
  section.appendChild(el(doc, 'p', 'lc-head', headText));
  return { section };
}

// --- the renderer ------------------------------------------------------------------------------------

/**
 * Render a server-composed `LensAssessment` into `container`. Clears the container, then appends the
 * blocks appropriate to `assessment.status`. EVERYTHING is set with textContent / element props — the
 * only innerHTML use is the leading clear. Returns nothing; never navigates.
 *
 * The assessment MUST come from /api/lens (the engine already lints/validates every field). This
 * renderer does no medical composition — it only lays out the server fields with fixed structural
 * labels.
 */
export function renderLensCard(assessment: LensCardAssessment, container: HTMLElement): void {
  const doc = container.ownerDocument;
  container.innerHTML = ''; // clear only — never used to inject content
  if (!assessment || typeof assessment !== 'object') return;

  const card = el(doc, 'div', 'lc-card lc-' + assessment.status);
  card.setAttribute('role', 'group');

  const status = assessment.status;

  // --- REFUSED — boundary/crisis. verdictLine is the engine's canned message; routes in the SAFETY
  // register (vermilion) prominently. No evidence/flags/stamp-as-verdict. -----------------------------
  if (status === 'refused') {
    const boundary = el(doc, 'div', 'lc-refused');
    boundary.appendChild(el(doc, 'p', 'lc-refused-line', assessment.verdictLine || ''));
    appendSafetyRoutes(doc, boundary, assessment.safety, /* safetyRegister */ true, /* withNote */ false);
    card.appendChild(boundary);
    container.appendChild(card);
    return;
  }

  // --- SHORT-CIRCUIT — a fixed client line + a prominent link to the graded page. --------------------
  if (status === 'short-circuit') {
    const sc = el(doc, 'div', 'lc-shortcircuit');
    sc.appendChild(el(doc, 'p', 'lc-sc-line', LABEL.shortCircuitLine));
    const scRef = assessment.shortCircuit;
    if (scRef && scRef.href) {
      const a = el(doc, 'a', 'lc-sc-link');
      a.href = scRef.href; // server-provided /r/<slug>
      a.textContent = `Read the graded ${scRef.name} page →`;
      sc.appendChild(a);
    }
    card.appendChild(sc);
    container.appendChild(card);
    return;
  }

  // --- ASSESSED / INCONCLUSIVE — the full card. ------------------------------------------------------
  // "What the Lens read your query as" (CHK-7.4) — the server-composed interpreted-as line, at the very
  // top so the reader sees the entity was understood (the Perplexity "it got my intent" beat). Verbatim
  // server field via textContent; it states no evidence, no advice, no grade.
  if (assessment.resolved && typeof assessment.resolved.line === 'string' && assessment.resolved.line) {
    card.appendChild(el(doc, 'p', 'lc-resolved', assessment.resolved.line));
  }

  // verdict + disclaimer sit together near the top (disclaimer prominent, near the decision).
  if (assessment.verdictLine) {
    card.appendChild(el(doc, 'p', 'lc-verdict', assessment.verdictLine));
  }
  if (assessment.stamp) {
    card.appendChild(el(doc, 'p', 'lc-stamp', assessment.stamp)); // the not-a-grade stamp, prominent
  }
  if (assessment.disclaimer) {
    card.appendChild(el(doc, 'p', 'lc-disclaimer', assessment.disclaimer));
  }

  // "What the evidence shows" — one row per evidence[]; strength as TEXT label + chip; sources → chips.
  if (status === 'assessed' && Array.isArray(assessment.evidence) && assessment.evidence.length) {
    const { section } = block(doc, LABEL.evidenceHead, 'lc-evidence');
    const list = el(doc, 'ul', 'lc-ev-list');
    assessment.evidence.forEach((ev) => {
      const li = el(doc, 'li', 'lc-ev-row');
      li.appendChild(el(doc, 'p', 'lc-ev-text', ev.text));

      // strength: BOTH a text label and a chip class — never color alone.
      const isStrong = ev.strength === 'strong';
      const strengthText = isStrong ? LABEL.strengthStrong : LABEL.strengthWeak;
      const chip = el(doc, 'span', 'lc-strength ' + (isStrong ? 'is-strong' : 'is-weak'), strengthText);
      li.appendChild(chip);

      if (Array.isArray(ev.sources) && ev.sources.length) {
        const srcWrap = el(doc, 'p', 'lc-ev-sources');
        srcWrap.appendChild(el(doc, 'span', 'lc-sources-label', LABEL.sourcesLabel + ': '));
        ev.sources.forEach((s) => {
          if (!s || !s.url) return;
          const a = el(doc, 'a', 'lc-source-chip');
          a.href = s.url; // server-provided canonical url
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = sourceLabel(s);
          srcWrap.appendChild(a);
        });
        li.appendChild(srcWrap);
      }
      list.appendChild(li);
    });
    section.appendChild(list);
    card.appendChild(section);
  }

  // "What it does NOT show" — the signature anti-hype block. Always present on assessed/inconclusive.
  if (Array.isArray(assessment.doesNotShow) && assessment.doesNotShow.length) {
    const { section } = block(doc, LABEL.doesNotShowHead, 'lc-doesnot');
    const list = el(doc, 'ul', 'lc-dn-list');
    assessment.doesNotShow.forEach((line) => {
      if (typeof line !== 'string' || !line) return;
      list.appendChild(el(doc, 'li', 'lc-dn-row', line));
    });
    section.appendChild(list);
    card.appendChild(section);
  }

  // "Label reality" — each labelFlags[] → text + a link to its basis.
  if (Array.isArray(assessment.labelFlags) && assessment.labelFlags.length) {
    const { section } = block(doc, LABEL.labelHead, 'lc-label');
    const list = el(doc, 'ul', 'lc-flag-list');
    assessment.labelFlags.forEach((flag) => {
      if (!flag || typeof flag.text !== 'string') return;
      const li = el(doc, 'li', 'lc-flag-row');
      li.appendChild(el(doc, 'p', 'lc-flag-text', flag.text));
      if (flag.href && flag.linkLabel) {
        const a = el(doc, 'a', 'lc-flag-link');
        a.href = flag.href; // server-provided (e.g. /safety)
        a.textContent = flag.linkLabel;
        li.appendChild(a);
      }
      list.appendChild(li);
    });
    section.appendChild(list);
    card.appendChild(section);
  }

  // "Safety & interactions" — the note + routed boundary links, in the SAFETY register.
  const { section: safetySection } = block(doc, LABEL.safetyHead, 'lc-safety');
  appendSafetyRoutes(doc, safetySection, assessment.safety, /* safetyRegister */ true, /* withNote */ true);
  card.appendChild(safetySection);

  // Deterministic, client-authored follow-ups (navigation, never advice).
  const fu = followUps(status, assessment.input?.kind ?? 'question');
  if (fu.length) {
    const { section } = block(doc, LABEL.followUpHead, 'lc-followups');
    const list = el(doc, 'ul', 'lc-fu-list');
    fu.forEach((r) => {
      const li = el(doc, 'li', 'lc-fu-row');
      const a = el(doc, 'a', 'lc-fu-link');
      a.href = r.href;
      a.textContent = r.label; // fixed structural label
      li.appendChild(a);
      list.appendChild(li);
    });
    section.appendChild(list);
    card.appendChild(section);
  }

  // review route — request a human review (the real-promise page).
  if (assessment.reviewRoute && assessment.reviewRoute.href) {
    const review = el(doc, 'p', 'lc-review');
    const a = el(doc, 'a', 'lc-review-link');
    a.href = assessment.reviewRoute.href;
    a.textContent = `${assessment.reviewRoute.label} →`;
    review.appendChild(a);
    card.appendChild(review);
  }

  container.appendChild(card);
}

/**
 * Append the safety note (optional) + the routed boundary links to `parent`. In the safety register the
 * wrapper carries `lc-safety-register` (vermilion). Every link is an <a href> with a server href/label.
 */
function appendSafetyRoutes(
  doc: Document,
  parent: HTMLElement,
  safety: LensCardAssessment['safety'] | undefined,
  safetyRegister: boolean,
  withNote: boolean,
): void {
  const wrap = el(doc, 'div', 'lc-safety-routes' + (safetyRegister ? ' lc-safety-register' : ''));
  if (withNote && safety && typeof safety.note === 'string' && safety.note) {
    wrap.appendChild(el(doc, 'p', 'lc-safety-note', safety.note));
  }
  const routes = Array.isArray(safety?.routes) ? safety!.routes : [];
  if (routes.length) {
    const list = el(doc, 'ul', 'lc-route-list');
    routes.forEach((r) => {
      if (!r || !r.href) return;
      const li = el(doc, 'li', 'lc-route-row');
      const a = el(doc, 'a', 'lc-route-link');
      a.href = r.href; // server-provided boundary route
      a.textContent = r.label; // server label
      li.appendChild(a);
      list.appendChild(li);
    });
    wrap.appendChild(list);
  }
  parent.appendChild(wrap);
}
