/**
 * Ask guardrails (CHK-6.3, Layers A + D) — the deterministic safety envelope around the model.
 *
 * Layer A (pre-model): classify() catches personalized dosing, diagnosis, "is it safe for me",
 * "can I mix this with my meds" / "combine", stop-my-prescription, and self-harm/overdose/crisis.
 * Any hit returns a CANNED refusal + the correct boundary-page route WITHOUT calling Gemini.
 *
 * Layer D (post-model): checkCitations() rejects any [n] the model emits that is not in the page's
 * real sources[], and flags any raw PMID/DOI/URL the model tried to write — either downgrades the
 * answer to a refusal. lintForbiddenFraming() scans text for the rulebook's forbidden framings.
 *
 * EVERY string below is medical-boundary copy (CLAUDE.md: "educational, not medical advice" near
 * decisions; conservative on pregnancy/children/interactions). The compliance-reviewer vets each.
 * The forbidden-framing CI lint (scripts/check-forbidden-framing.mjs) scans this file; lines that
 * must quote a forbidden phrase in order to refuse it are marked `FRAMING-LINT-OK`.
 *
 * Written in erasable TS so Node type-stripping can import it in the CI scripts.
 */

const BOUNDARY = 'This is educational, not medical advice.';

export interface Route {
  href: string;
  label: string;
}

export const ROUTES = {
  clinician: { href: '/when-to-see-a-doctor', label: 'When to see a doctor' },
  safety: { href: '/safety', label: 'Safety & who should be careful' },
  meds: { href: '/medications-and-sleep-aids', label: 'Medications & sleep aids' },
  urgent: { href: '/when-to-see-a-doctor#urgent', label: "When it's urgent" },
} as const;

export interface ClassifyRefusal {
  kind: 'refuse';
  category: string;
  message: string;
  route: Route | null;
}
export interface ClassifyAllow {
  kind: 'allow';
}
export type ClassifyResult = ClassifyRefusal | ClassifyAllow;

// --- Layer A refusal copy (conservative; ends on the educational boundary) ----------------------

const MSG = {
  crisis:
    'If you might be in danger — thoughts of self-harm, or a possible overdose, or someone who cannot be woken — please stop and contact your local emergency number or a crisis line now. Somnary is an educational reference and cannot help in an emergency. ' +
    BOUNDARY,
  dosing:
    'Somnary does not give personal dosing instructions — the right amount for one person depends on their age, health, and other medicines, which a reference page cannot assess. The dosing-reality section on this page shows the doses used in studies; a doctor or pharmacist can advise what fits your situation. ' +
    BOUNDARY,
  diagnosis:
    'Somnary cannot tell you whether you have insomnia, sleep apnea, anxiety, or any other condition — that needs a clinician who can assess you directly. If you want to understand when sleep problems are worth a professional visit, the page below explains it. ' +
    BOUNDARY,
  safeForMe:
    'Somnary cannot judge whether a remedy is appropriate in your particular situation — that depends on your health, pregnancy, other medicines, and age, which we cannot see. The safety overview covers the general cautions, and a doctor or pharmacist can weigh them with you. ' +
    BOUNDARY,
  combine:
    'Somnary will not advise on mixing a supplement with your medications or combining products — interaction risk is personal and can be serious, so it belongs with a pharmacist or doctor who can see your full list. The page below explains what to bring to that conversation. ' +
    BOUNDARY,
  stopRx:
    'Somnary cannot advise you to start, stop, or change a prescription — stopping some medicines suddenly is dangerous. Please talk with the clinician who prescribed it before changing anything. ' +
    BOUNDARY,
} as const;

// --- Layer A classifier -------------------------------------------------------------------------
// Ordered most-urgent first. Patterns err toward refusing/routing (safety over coverage).

const CRISIS =
  /\b(kill myself|killing myself|end my life|end it all|suicid\w*|self[-\s]?harm|hurt myself|harm myself|overdos\w*|took (a whole|the whole|too many|too much)|whole bottle|can'?t wake|cannot wake|won'?t wake|unrousable|unconscious|unresponsive|not breathing|stopped breathing)\b/i;

// Personalized dosing: "how much / how many … (should I / to give / for me)", "what dose for me".
const DOSING =
  /\b(how much|how many|what dose|what dosage|how many mg|how much mg)\b[^.?!]*\b(should i|do i|can i|to take|to give|to use|for me|for my|for a|per night|each night)\b/i;
const DOSING2 = /\b(how much|how many)\b[^.?!]*\b(take|give|use|need|dose)\b/i;

// Diagnosis: asking us to name/confirm a condition in them.
const DIAGNOSIS =
  /\b(do i have|have i got|could i have|might i have|am i|is this|is it)\b[^.?!]*\b(insomnia|sleep apnea|apnea|anxiety|anxious|depress\w*|adhd|narcolep\w*|disorder|condition)\b|\bdiagnos\w*\b/i;

// Is it safe / okay FOR ME (personal), incl. pregnancy/child/condition framings.
const SAFE_FOR_ME =
  /\b(safe|okay|ok|alright|fine|dangerous|risky|harmful|bad)\b[^.?!]*\b(for me|for my|in my case|with my|during (my )?pregnan\w*|while pregnan\w*|while breast[-\s]?feed\w*|for my (kid|child|son|daughter|baby|toddler|infant)|at my age)\b|\bcan i (take|use|try|have)\b/i;

// Mixing with the user's meds / combining products (D4).
const COMBINE =
  /\b(mix|combine|combining|stack|stacking|take together|together with|alongside|on top of)\b[^.?!]*\b(medication|meds|medicine|prescription|antidepressant|ssri|snri|maoi|warfarin|blood thinner|blood pressure|antihistamine|sedative|benzo\w*|ambien|zolpidem|zoloft|prozac|lexapro|xanax|alcohol|birth control|the pill)\b|\bcombine\b[^.?!]*\band\b|\b(mix|combine|take)\b[^.?!]*\bwith my\b|\bcan i (take|use)\b[^.?!]*\bwith\b[^.?!]*\b(medication|meds|medicine|prescription|antidepressant|warfarin|alcohol)\b/i;

// Start/stop/replace a prescription.
const STOP_RX =
  /\b(stop|quit|come off|get off|wean off|taper off|replace|instead of)\b[^.?!]*\b(prescription|my (medication|meds|pills|antidepressant|sleeping pill|sleep meds|ambien|zolpidem|benzo\w*|ssri))\b|\bcan i stop (my|taking)\b/i;

/**
 * Layer A. Returns a canned refusal + route, or { kind: 'allow' } to continue to retrieval.
 * Crisis is checked first; the two most dangerous framings (combine-meds, stop-Rx) precede the
 * softer personal-question buckets so they win a tie.
 */
export function classify(question: string): ClassifyResult {
  const q = ` ${question} `;
  if (CRISIS.test(q)) return { kind: 'refuse', category: 'crisis', message: MSG.crisis, route: ROUTES.urgent };
  if (STOP_RX.test(q)) return { kind: 'refuse', category: 'stop-prescription', message: MSG.stopRx, route: ROUTES.clinician };
  if (COMBINE.test(q)) return { kind: 'refuse', category: 'combine-meds', message: MSG.combine, route: ROUTES.meds };
  if (DOSING.test(q) || DOSING2.test(q)) return { kind: 'refuse', category: 'personal-dosing', message: MSG.dosing, route: ROUTES.clinician };
  if (DIAGNOSIS.test(q)) return { kind: 'refuse', category: 'diagnosis', message: MSG.diagnosis, route: ROUTES.clinician };
  if (SAFE_FOR_ME.test(q)) return { kind: 'refuse', category: 'safe-for-me', message: MSG.safeForMe, route: ROUTES.safety };
  return { kind: 'allow' };
}

// --- Layer D templates --------------------------------------------------------------------------

export function noEvidenceMessage(name: string): string {
  return (
    `I don't have that in Somnary's reviewed evidence for ${name}. This assistant only answers from ` +
    `what's cited on this page, so if it isn't covered here I won't guess. You can read the full page ` +
    `above, or search Somnary for another remedy. ` +
    BOUNDARY
  );
}

export function citationDowngradeMessage(name: string): string {
  return (
    `I can't answer that from Somnary's reviewed evidence for ${name} without relying on a source I ` +
    `can't verify on this page, so I won't guess. You can read the cited sources for ${name} below and ` +
    `judge for yourself. ` +
    BOUNDARY
  );
}

export const FRAMING_DOWNGRADE_MESSAGE =
  "I can only describe what Somnary's reviewed evidence says — I can't tell you what to take or what's " +
  'right for you. For anything about your own situation, please talk with a doctor or pharmacist. ' +
  BOUNDARY;

export const ERROR_MESSAGE =
  "Something went wrong reaching the assistant, so I'd rather not show a half-answer. You can read this " +
  "page's evidence summary and its cited sources above. " +
  BOUNDARY;

// --- Layer D citation post-check ----------------------------------------------------------------

/** All bracketed [n] footnotes the model emitted. */
export function extractBracketCitations(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(/\[(\d{1,3})\]/g)) out.push(Number(m[1]));
  return out;
}

/** True if the model tried to write a raw identifier (PMID/DOI/registry/link) — an invention path
 * that bypasses the [n] scheme, so it is always rejected. */
export function hasRawIdentifier(text: string): boolean {
  return (
    /\bPMID\b/i.test(text) ||
    /\bdoi\b\s*:/i.test(text) ||
    /\b10\.\d{4,9}\/\S+/.test(text) ||
    /\bNCT\d{6,8}\b/i.test(text) ||
    /pubmed\.ncbi\.nlm\.nih\.gov/i.test(text) ||
    /doi\.org/i.test(text) ||
    /clinicaltrials\.gov/i.test(text)
  );
}

export interface CitationCheck {
  ok: boolean;
  cited: number[];
  invalid: number[];
  rawIdentifier: boolean;
}

/** Reject any citation not present in the page's real sources[] (allowedNs), and any raw identifier. */
export function checkCitations(text: string, allowedNs: number[]): CitationCheck {
  const allowed = new Set(allowedNs);
  const cited = extractBracketCitations(text);
  const invalid = cited.filter((n) => !allowed.has(n));
  const rawIdentifier = hasRawIdentifier(text);
  return { ok: invalid.length === 0 && !rawIdentifier, cited, invalid, rawIdentifier };
}

// --- Layer D forbidden-framing lint -------------------------------------------------------------
// The rulebook's forbidden framings (doc 06 lines ~120–126), as output-detecting patterns. Used by
// the engine on model output AND by scripts/check-forbidden-framing.mjs on source/fixtures.

export interface FramingPattern {
  re: RegExp;
  label: string;
}

export const FORBIDDEN_FRAMINGS: FramingPattern[] = [
  { re: /\btake\s+[a-z0-9-]+\s+tonight\b/i, label: '"take X tonight"' },
  { re: /\byou should take\b/i, label: '"you should take …"' },
  { re: /\bi(?:'d| would)? recommend\b[^.?!]*\btak\w+/i, label: '"I recommend taking …"' },
  { re: /\byour (ideal|best|optimal|correct|right|recommended|perfect) dose\b/i, label: '"your ideal dose"' },
  { re: /\bis safe for you\b/i, label: '"this is safe for you"' },
  { re: /\bsafe for you to (take|use)\b/i, label: '"safe for you to take"' },
  { re: /\bcombine (these|those|them|your)\b/i, label: '"combine these"' },
  { re: /\bstack (these|those|them|of)\b/i, label: '"stack these"' },
  { re: /\byou (probably|likely|might|may|must) have\b[^.?!]*\b(apnea|insomnia|anxiety|depress\w*|disorder)\b/i, label: '"you probably have <condition>"' },
];

/** Returns the labels of any forbidden framings found in the text (empty = clean). */
export function lintForbiddenFraming(text: string): string[] {
  return FORBIDDEN_FRAMINGS.filter((p) => p.re.test(text)).map((p) => p.label);
}
