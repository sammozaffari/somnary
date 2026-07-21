/**
 * Somnary Lens output-framing copy (CHK-7.1c) — THE [HUMAN-GATE] SURFACE.
 *
 * EVERY user-facing string the Lens can emit lives in this ONE file, so the compliance-reviewer and
 * the owner review a single surface before Phase 2 ships (per the design doc: "Output framing … is a
 * hard human gate before Phase 2"). The engine composes its verdict + doesNotShow lines from the
 * TEMPLATE BUILDERS below — it never writes free prose — so the whole medical-boundary voice of the
 * Lens is auditable here.
 *
 * THE FRAMING CONTRACT (CLAUDE.md D5 + the rulebook's forbidden framings):
 *   - The Lens output is a DRAFT ASSESSMENT, never a grade. The STAMP says so on every card.
 *   - Every line DESCRIBES what the verified evidence shows or does NOT show. It never tells anyone
 *     what to take, never says a dose/product is "safe" or "right for you", never recommends OR
 *     forbids a combination (D4), never diagnoses, and assigns NO tier/grade/score.
 *   - Weak evidence is labeled weak; the anti-hype "what it does NOT show" beat is always present.
 *   - "educational, not medical advice" is stated near the decision, not only in a footer.
 *
 * The forbidden-framing CI lint (scripts/check-forbidden-framing.mjs) scans src/lib/lens/*.ts,
 * including this file. There are NO forbidden framings in the shipped strings below; the handful of
 * NEGATIVE examples that must quote a forbidden phrase to name it are tagged FRAMING-LINT-OK, exactly
 * like the assistant's guardrails.ts and the guide prompt.
 *
 * Written in erasable TS (const strings + pure builders, no runtime-only constructs) so the offline
 * CI runner (scripts/test-lens.mjs) imports it directly. PURE: no I/O, no clock. Never throws.
 */

import type { Route } from '../ask/guardrails.ts';

// --- the two always-present stamps ---------------------------------------------------------------

/** The not-a-grade stamp. Present on EVERY assessed/inconclusive card. This is the D5 promise made
 * visible: the Lens applies Somnary's method to a new input, but the result is AI-assisted research,
 * NOT a human-assigned Somnary grade. */
export const STAMP = 'AI-assisted research · not a Somnary grade';

/** The educational-not-medical-advice line, placed near the decision (not only a footer). */
export const DISCLAIMER =
  'This is educational, not medical advice. It describes what published research does and does not ' +
  'show — it is not a recommendation, a dose, or a judgement about your situation. For anything about ' +
  'your own health, medicines, pregnancy, or a child, talk with a doctor or pharmacist.';

// --- the request-a-human-review route ------------------------------------------------------------

/** The "request a full human review" affordance. A Lens run on an unlisted product is a candidate for
 * the human-graded corpus (the compounding loop, design doc "The moat"); this route is where a reader
 * asks for that. The href points at the reviews/nominations surface; wired to a real page in 7.2/7.3. */
export const REVIEW_ROUTE: Route = {
  href: '/request-a-review',
  label: 'Request a full human review',
};

// --- state messages ------------------------------------------------------------------------------

/** Shown when research ran but NOTHING cleared the adversarial verification bar (or no evidence was
 * found at all). The honest degrade: we say we could not find verifiable published evidence, and we
 * do NOT fabricate a verdict. Anti-hype by construction — silence over a guess. */
export const INCONCLUSIVE_MESSAGE =
  "Somnary's Lens could not find published human evidence it could verify for this subject. That is " +
  'not a verdict that it does or does not work — only that the research to assess it is thin or absent ' +
  "here. Where a label was pasted, any formulation notes below still apply. This is a gap in the " +
  'evidence, not a green light or a warning.';

/** Shown when the input is off-topic for a sleep-remedy reference (topic-fence reject). Neutral. */
export const OFF_TOPIC_MESSAGE =
  'The Lens only assesses sleep supplements, ingredients, and products. Ask about a specific sleep ' +
  'remedy or paste a supplement label, and it will research what the evidence shows.';

/** The safety note that sits above the routed boundary links on every assessed/inconclusive card. It
 * ROUTES the reader to the boundary pages; it never makes a safety call on a product or dose. */
export const SAFETY_NOTE =
  'Safety, interactions, and who should be careful are personal and can be serious. The Lens does not ' +
  'make a safety call on any product or dose — these pages cover the general cautions, and a pharmacist ' +
  'or doctor can weigh them with your own health and medicines.';

// --- resolved-subject line (SERVER-composed; CHK-7.4) --------------------------------------------
//
// The Lens now interprets the input before researching (resolve.ts): a brand → its active ingredient,
// plus a product class. This line SHOWS the reader what the Lens understood ("read 'Restavit' as
// doxylamine…") — the honest "it got my intent" beat. It is SERVER-composed here: the only interpolated
// values are the reader's own bounded subject and a model-derived NAME + a FIXED class label from the
// map below. It states no evidence, no advice, no grade — just what the query was taken to mean.

/** Fixed, human-readable label per resolved product class. '' ⇒ no class phrase is shown. */
const PRODUCT_CLASS_LABEL: Record<string, string> = {
  supplement: 'a supplement',
  herb: 'a herbal remedy',
  'amino-acid': 'an amino acid',
  hormone: 'a hormone',
  'otc-drug': 'an over-the-counter sleep medicine',
  'prescription-drug': 'a prescription sleep medicine',
  food: 'a food or food-derived compound',
  other: '',
  unknown: '',
};

function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase().replace(/\s+/g, ' ') === b.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * The "what the Lens took your query to mean" line. `subject` is the reader's input; `resolvedName` +
 * `productClass` come from resolve.ts (already sanitised). Returns '' when there is nothing useful to
 * say (no resolved name and no class). Never advice, never a grade.
 */
export function interpretedAsLine(subject: string, resolvedName: string, productClass: string): string {
  const s = (typeof subject === 'string' ? subject : '').trim();
  const r = (typeof resolvedName === 'string' ? resolvedName : '').trim();
  const label = PRODUCT_CLASS_LABEL[productClass] || '';
  if (!s) return '';
  if (r && !sameName(r, s)) {
    return `The Lens read “${s}” as ${r}${label ? `, ${label}` : ''}, and researched the published evidence for it below.`;
  }
  if (label) {
    return `The Lens researched the published evidence for ${s}, ${label}, below.`;
  }
  return '';
}

/**
 * The safety note, augmented for medicines. An OTC or prescription sleep drug carries real, personal
 * risk that a supplement note under-states, so we prepend a "this is a medicine" reminder — still a
 * ROUTING note, never a safety call on a dose. All other classes get the standing SAFETY_NOTE.
 */
export function safetyNoteFor(productClass: string): string {
  if (productClass === 'otc-drug' || productClass === 'prescription-drug') {
    return (
      'This is a medicine, not a supplement — its risks, interactions, and who should avoid it are ' +
      'personal and can be serious. The Lens makes no safety call; talk with a pharmacist or doctor ' +
      'before using it, and see the pages below.'
    );
  }
  return SAFETY_NOTE;
}

// --- verdict-line templates (SERVER-composed; NOT model prose) -----------------------------------
//
// The engine composes the single verdict line by picking exactly ONE of these builders from the
// DETERMINISTIC shape of the verified result (how many claims survived, their minimum strength, and
// whether any label flags fired). No number, name, or phrasing here comes from model free-text — the
// only interpolated values are integer counts and a subject string the engine has already bounded.

/** Pluralize "study"/"studies" style helper for a bare count. */
function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/**
 * The verdict line when at least one evidence claim SURVIVED verification. `verifiedCount` is how many
 * cleared the 2-of-3 grounded bar; `minStrength` is the weakest surviving strength (anti-hype: if any
 * survivor is weak the whole line is hedged to weak); `flagCount` is how many R1–R5/additive flags
 * fired on a pasted label. Evidence-descriptive, no recommendation, no grade.
 */
export function verdictAssessed(verifiedCount: number, minStrength: 'strong' | 'weak', flagCount: number): string {
  const n = Math.max(0, Math.trunc(verifiedCount));
  const claims = `${n} ${plural(n, 'claim', 'claims')}`;
  const base =
    minStrength === 'weak'
      ? `The Lens verified ${claims} against published sources, and the supporting evidence is weak — small, preliminary, or hedged in the studies themselves. Read each below and judge for yourself.`
      : `The Lens verified ${claims} against published sources. Read each finding and its source below; strength is noted per claim.`;
  if (flagCount > 0) {
    const flags = `${flagCount} ${plural(flagCount, 'formulation note', 'formulation notes')}`;
    return `${base} The pasted label also raised ${flags} — see the label section.`;
  }
  return base;
}

// --- "what it does NOT show" templates (SERVER-composed; the signature anti-hype block) ----------
//
// These lines are composed BY CODE from what the pipeline CUT or never found — not from model prose.
// The engine feeds them integer counts and the (already-bounded) subject string; nothing here is
// free-text from the model. The block is ALWAYS present, even when claims survived: saying what the
// evidence does not establish is the Lens's defining beat.

/** doesNotShow line when candidate claims were extracted but did NOT survive verification. */
export function doesNotShowCut(cutCount: number): string {
  const n = Math.max(0, Math.trunc(cutCount));
  const claims = `${n} ${plural(n, 'candidate claim', 'candidate claims')}`;
  return `${claims} did not survive verification — the cited sources did not clearly support them, so they were dropped rather than shown with a caveat.`;
}

/** doesNotShow line when NO human evidence was found/verified for the subject at all. */
export function doesNotShowNoHumanEvidence(subject: string): string {
  const s = typeof subject === 'string' && subject.trim() ? subject.trim() : 'this subject';
  return `No human trial evidence survived verification for ${s}. Absence of evidence is not evidence it works — or that it does not.`;
}

/** The standing anti-hype reminder appended to every assessed card's doesNotShow block. It never
 * mentions a dose, a diagnosis, or a combination — it names the general limits of the method. */
export const DOES_NOT_SHOW_STANDING =
  'This assessment covers only what the cited studies measured. It does not establish long-term ' +
  'safety, effects for any particular person, or how a product performs outside the studied conditions.';
