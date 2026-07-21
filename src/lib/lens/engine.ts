/**
 * The Somnary Lens engine (CHK-7.1c) — the ORCHESTRATOR + SERVER-COMPOSER.
 *
 * THE INVARIANT (D5, mirrors the concierge): the model RESEARCHES and EXTRACTS; the SERVER composes
 * the verdict from VERIFIED claims + DETERMINISTIC rule output; the model NEVER emits a grade, a dose,
 * a diagnosis, or an uncited claim. This file is where that composition happens, and it is the last
 * line of defense: the verdict line + the "what it does NOT show" block are built BY CODE from
 * templates in copy.ts over the pipeline's structured results — they are NOT free model prose. Every
 * composed line is then run through the forbidden-framing lint + raw-identifier check and dropped on
 * any hit, and every evidence source id is re-validated through citations.ts before it can appear.
 *
 * ORDER (each stage degrades safely, NEVER to a fabricated verdict):
 *   1. checkTopic  → off-topic/abusive ⇒ status:'refused' (no model, no research).
 *   2. classify    → crisis/dosing/diagnosis/combine/… ⇒ status:'refused' + boundary route (no research).
 *   3. normalize   → a corpus remedy ⇒ status:'short-circuit' to /r/<slug> (no research — a human grade
 *                    always beats fresh AI). Empty input ⇒ 'inconclusive'.
 *   4. research    → provider.search(); no docs ⇒ 'inconclusive' (rubric flags + safety + honest msg).
 *   5. extract     → ONE model call, JSON-parsed never-throws, capped, drop claims whose PMID isn't in docs.
 *   6. verify      → verifyClaims (2-of-3 grounded refute); only survivors reach composition.
 *   7. rubric      → applyRubric (R1–R5 verbatim + additive match), deterministic.
 *   8. compose     → build the LensAssessment from verified claims + flags + copy.ts templates;
 *                    lint every composed line; re-validate every source id. ANY error ⇒ 'inconclusive'.
 *
 * NEVER THROWS. All deps (provider, model, clock, budget, deadline) are injectable so the offline
 * red-team suite drives the whole engine with a MOCK model + MOCK provider — no network. Erasable TS
 * so the CI runner imports it directly.
 */

import { checkTopic } from '../guide/topic-fence.ts';
import {
  classify,
  lintForbiddenFraming,
  hasRawIdentifier,
  type RemedyRef,
  type Route,
} from '../ask/guardrails.ts';
import type { Flag, LabelEntry } from '../label-rules.ts';
import { normalizeLensInput, type LensInputKind, type LensShortCircuit } from './input.ts';
import type { EvidenceProvider } from './retrieval.ts';
import { parseCitation, type CitationId } from './citations.ts';
import {
  verifyClaims,
  defaultLensModel,
  LENS_MAX_MODEL_CALLS,
  type LensModelClient,
  type CandidateClaim,
  type VerifiedClaim,
  type CallBudget,
} from './verify.ts';
import { LENS_EXTRACT_PROMPT, buildExtractUserPrompt } from './prompts.ts';
import { applyRubric, type AdditiveFinding } from './rubric.ts';
import type { AdditiveEntry } from './additive-watchlist.ts';
import * as copy from './copy.ts';

// --- tunables ------------------------------------------------------------------------------------

/** Cap on candidate claims taken from ONE extraction reply (bounded research + cost). */
export const LENS_MAX_CLAIMS = 5;
/** Default wall-clock budget for a whole Lens run (ms). Research + N×claims refute calls must fit. */
const DEFAULT_DEADLINE_MS = 60_000;
/** Tokens for the single extraction reply (the JSON claim list is small but larger than a verdict). */
const EXTRACT_MAX_TOKENS = 900;

// --- the assessment schema — NO tier/grade/score FIELD ANYWHERE ----------------------------------

export type LensStatus = 'assessed' | 'short-circuit' | 'refused' | 'inconclusive';

/** A resolvable citation on an evidence line. Exactly the shape citations.ts validates + a url. */
export interface LensSource {
  pmid?: string;
  doi?: string;
  registry?: string;
  url: string;
}

/** One verified evidence line on the card. `strength` is the verifier's min-strength (weak labeled
 * weak). `sources` are resolver-validated. */
export interface LensEvidence {
  text: string;
  strength: 'strong' | 'weak';
  sources: LensSource[];
}

/**
 * The Lens assessment — the server-composed card. There is DELIBERATELY no tier/grade/score field:
 * the Lens applies Somnary's method to a new input but NEVER emits a grade (D5). The card is a draft
 * assessment, stamped as such.
 */
export interface LensAssessment {
  input: { kind: LensInputKind; normalized: string };
  status: LensStatus;
  /** Set only on status:'short-circuit' — the graded page to read instead of fresh AI research. */
  shortCircuit?: LensShortCircuit;
  verdictLine: string;
  evidence: LensEvidence[];
  /** The signature anti-hype block — always populated on assessed/inconclusive. */
  doesNotShow: string[];
  labelFlags: Flag[];
  safety: { routes: Route[]; note: string };
  stamp: string;
  reviewRoute: Route;
  disclaimer: string;
  meta: {
    modelCalls: number;
    claimsExtracted: number;
    claimsCut: number;
    provider: string;
    deadlineHit: boolean;
    cached: boolean;
  };
}

export interface RunLensArgs {
  input: unknown;
  corpus: RemedyRef[];
  labelEntries: LabelEntry[];
  additiveWatchlist: AdditiveEntry[];
  provider: EvidenceProvider;
  model?: LensModelClient;
  now?: () => number;
  budget?: CallBudget;
  deadlineMs?: number;
  /** Provider label for meta (e.g. 'pubmed'); purely informational. */
  providerName?: string;
}

// --- safety routing (deterministic; boundary pages, never a dose/diagnosis) ----------------------

// Reuse the guardrails ROUTES via classify() for refusals; for an ASSESSED card we always surface the
// two standing boundary routes so safety is prominent on every remedy/decision surface (CLAUDE.md).
import { ROUTES } from '../ask/guardrails.ts';
const STANDING_SAFETY_ROUTES: Route[] = [ROUTES.safety, ROUTES.clinician];

// --- extraction parsing (never throws) -----------------------------------------------------------

/** Parse ONE extraction reply into candidate claims. Tolerant of code-fence/prose wrapping (extract
 * the first {...}); ANY failure → []. Caps at LENS_MAX_CLAIMS and drops any claim whose sourcePmid is
 * not one of the fetched docs' PMIDs (an invented citation can never enter the pipeline). */
export function parseExtraction(raw: string, docPmids: Set<string>): CandidateClaim[] {
  const text = typeof raw === 'string' ? raw : '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  const root = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  const rawClaims = Array.isArray(root.claims) ? root.claims : [];
  const out: CandidateClaim[] = [];
  for (const c of rawClaims) {
    if (!c || typeof c !== 'object') continue;
    const rec = c as Record<string, unknown>;
    const claimText = typeof rec.text === 'string' ? rec.text.trim() : '';
    const pmid = typeof rec.sourcePmid === 'string' ? rec.sourcePmid.trim() : '';
    // Drop empty claims and any claim tied to a PMID that was NOT in the fetched docs (no ungrounded,
    // no invented citation). verify.ts re-checks this too — belt and suspenders at the data boundary.
    if (!claimText || !pmid || !docPmids.has(pmid)) continue;
    out.push({ text: claimText, sourcePmid: pmid });
    if (out.length >= LENS_MAX_CLAIMS) break;
  }
  return out;
}

// --- composition helpers -------------------------------------------------------------------------

/** Re-validate an evidence source's ids through citations.ts; return the resolvable {pmid?,doi?,
 * registry?,url} or null if NONE of its ids resolves (drop it — a malformed id never reaches a card). */
function toResolvableSource(id: CitationId): LensSource | null {
  const parsed = parseCitation(id);
  if (!parsed) return null;
  const src: LensSource = { url: parsed.url };
  src[parsed.kind] = parsed.value;
  return src;
}

/** Run a composed line through the forbidden-framing lint + raw-identifier check. Returns the line if
 * clean, or a safe replacement if it trips either gate — a composed line can NEVER ship a forbidden
 * framing or a smuggled raw identifier even if a template were ever mis-fed model-derived text. */
function safeLine(line: string, replacement: string): string {
  if (typeof line !== 'string' || !line) return replacement;
  if (lintForbiddenFraming(line).length > 0 || hasRawIdentifier(line)) return replacement;
  return line;
}

/** Build the always-present base fields of an assessment (stamp, disclaimer, review route, input). */
function baseFields(kind: LensInputKind, normalized: string) {
  return {
    input: { kind, normalized },
    stamp: copy.STAMP,
    reviewRoute: copy.REVIEW_ROUTE,
    disclaimer: copy.DISCLAIMER,
  };
}

function emptyMeta(provider: string): LensAssessment['meta'] {
  return { modelCalls: 0, claimsExtracted: 0, claimsCut: 0, provider, deadlineHit: false, cached: false };
}

// --- the orchestrator ----------------------------------------------------------------------------

/**
 * Run the full Lens pipeline over one input. Returns a LensAssessment. NEVER throws — any unexpected
 * error degrades to an honest 'inconclusive' assessment (rubric flags kept where available, never a
 * fabricated verdict).
 */
export async function runLens(args: RunLensArgs): Promise<LensAssessment> {
  const providerName = args.providerName ?? 'pubmed';
  const now = args.now ?? Date.now;
  const corpus = Array.isArray(args.corpus) ? args.corpus : [];
  const labelEntries = Array.isArray(args.labelEntries) ? args.labelEntries : [];
  const additiveWatchlist = Array.isArray(args.additiveWatchlist) ? args.additiveWatchlist : [];

  // A defensive outer try: nothing below may throw out of the engine.
  try {
    const rawInput = typeof args.input === 'string' ? args.input : '';

    // (1) TOPIC FENCE — off-topic/abusive is refused before any model call, unjailbreakably.
    const topic = checkTopic(rawInput, corpus);
    if (!topic.ok) {
      return {
        ...baseFields('question', typeof rawInput === 'string' ? rawInput.slice(0, 4000).trim() : ''),
        status: 'refused',
        verdictLine: copy.OFF_TOPIC_MESSAGE,
        evidence: [],
        doesNotShow: [],
        labelFlags: [],
        safety: { routes: [ROUTES.search], note: copy.SAFETY_NOTE },
        meta: emptyMeta(providerName),
      };
    }

    // (2) DETERMINISTIC CLASSIFY — crisis/dosing/diagnosis/combine/safe-for-me refuse-or-route; NO
    // research runs. The canned message + boundary route come from the shared guardrails.
    const cls = classify(rawInput);
    if (cls.kind === 'refuse') {
      const normalized = rawInput.slice(0, 4000).trim();
      return {
        ...baseFields('question', normalized),
        status: 'refused',
        verdictLine: cls.message,
        evidence: [],
        doesNotShow: [],
        labelFlags: [],
        safety: { routes: cls.route ? [cls.route] : [ROUTES.safety], note: copy.SAFETY_NOTE },
        meta: emptyMeta(providerName),
      };
    }

    // (3) NORMALIZE — short-circuit corpus remedies to their graded page (NO research), reject empty.
    const normalized = normalizeLensInput(rawInput, corpus, labelEntries);
    const base = baseFields(normalized.kind, normalized.normalized);

    if (normalized.shortCircuit) {
      return {
        ...base,
        status: 'short-circuit',
        shortCircuit: normalized.shortCircuit,
        verdictLine: '',
        evidence: [],
        doesNotShow: [],
        labelFlags: [],
        safety: { routes: STANDING_SAFETY_ROUTES, note: copy.SAFETY_NOTE },
        meta: emptyMeta(providerName),
      };
    }

    // Rubric is deterministic and cheap; run it up front so it's present on every non-refused path.
    const rubric = applyRubric({
      panelText: rawInput,
      normalized,
      labelEntries,
      additiveWatchlist,
    });

    if (normalized.empty) {
      return inconclusive(base, rubric.labelFlags, rubric.additiveFindings, normalized.normalized, emptyMeta(providerName));
    }

    // (4) RESEARCH — bounded external search. No docs ⇒ inconclusive (never a fabricated verdict).
    let docs;
    try {
      docs = await args.provider.search(normalized.normalized);
    } catch {
      docs = [];
    }
    docs = Array.isArray(docs) ? docs : [];
    if (docs.length === 0) {
      return inconclusive(base, rubric.labelFlags, rubric.additiveFindings, normalized.normalized, emptyMeta(providerName));
    }

    // (5) EXTRACT — ONE model call. Shared budget/deadline across extract + verify.
    const budget: CallBudget = args.budget ?? { used: 0, max: LENS_MAX_MODEL_CALLS };
    const deadline = now() + (typeof args.deadlineMs === 'number' ? args.deadlineMs : DEFAULT_DEADLINE_MS);
    const model = args.model ?? defaultLensModel();
    const docPmids = new Set(docs.map((d) => d.pmid).filter((p): p is string => typeof p === 'string' && !!p));

    let candidates: CandidateClaim[] = [];
    if (budget.used < budget.max && deadline - now() > 0) {
      budget.used += 1;
      const extractRes = await model({
        system: LENS_EXTRACT_PROMPT,
        user: buildExtractUserPrompt(normalized.normalized, docs),
        temperature: 0.1,
        timeoutMs: Math.max(1, deadline - now()),
      });
      candidates = parseExtraction(extractRes && extractRes.ok ? extractRes.text : '', docPmids);
    }

    // (6) VERIFY — refute-first; only survivors reach composition. Shares the budget + deadline.
    const { verified, meta: vmeta } = await verifyClaims({
      claims: candidates,
      docs,
      model,
      deadline,
      budget,
      now,
    });

    const meta: LensAssessment['meta'] = {
      modelCalls: budget.used,
      claimsExtracted: candidates.length,
      claimsCut: vmeta.claimsCut,
      provider: providerName,
      deadlineHit: vmeta.deadlineHit,
      cached: false,
    };

    // (7)+(8) COMPOSE — server-side, from verified claims + rubric flags + copy.ts templates.
    return compose(base, verified, rubric.labelFlags, rubric.additiveFindings, normalized.normalized, candidates.length, meta);
  } catch {
    // Any unexpected error ⇒ honest inconclusive with empty rubric (never a fabricated verdict).
    const normalized = typeof args.input === 'string' ? args.input.slice(0, 4000).trim() : '';
    return inconclusive(
      baseFields('question', normalized),
      [],
      [],
      normalized,
      emptyMeta(providerName),
    );
  }
}

// --- state builders ------------------------------------------------------------------------------

type Base = ReturnType<typeof baseFields>;

/** The honest degrade: research found/verified nothing, so we say so and never invent a verdict.
 * Rubric flags (if a label was pasted) are still surfaced — they are deterministic, not a guess. */
function inconclusive(
  base: Base,
  labelFlags: Flag[],
  additiveFindings: AdditiveFinding[],
  subject: string,
  meta: LensAssessment['meta'],
): LensAssessment {
  const doesNotShow = [
    safeLine(copy.doesNotShowNoHumanEvidence(subject), copy.DOES_NOT_SHOW_STANDING),
    copy.DOES_NOT_SHOW_STANDING,
  ];
  return {
    ...base,
    status: 'inconclusive',
    verdictLine: safeLine(copy.INCONCLUSIVE_MESSAGE, copy.INCONCLUSIVE_MESSAGE),
    evidence: [],
    doesNotShow,
    labelFlags: mergeAdditiveIntoFlags(labelFlags, additiveFindings),
    safety: { routes: STANDING_SAFETY_ROUTES, note: copy.SAFETY_NOTE },
    meta,
  };
}

/**
 * Compose an ASSESSED (or, if nothing survived, INCONCLUSIVE) card from verified claims + flags.
 *
 * The verdictLine + doesNotShow lines are built by CODE from copy.ts templates over the verified data
 * — never model prose. Each composed line is lint-checked (forbidden framing + raw identifier); on any
 * hit the line is replaced with a safe standing line. Each evidence line's sources are re-validated
 * through citations.ts; any evidence whose sources ALL fail to resolve is dropped (never an uncited
 * claim). If NO evidence survives resolver validation, the whole card degrades to inconclusive.
 */
function compose(
  base: Base,
  verified: VerifiedClaim[],
  labelFlags: Flag[],
  additiveFindings: AdditiveFinding[],
  subject: string,
  extractedCount: number,
  meta: LensAssessment['meta'],
): LensAssessment {
  // Map verified claims → evidence, re-validating every source id. Drop a claim if NONE resolves.
  const evidence: LensEvidence[] = [];
  for (const v of verified) {
    const sources: LensSource[] = [];
    for (const s of v.sources ?? []) {
      const resolved = toResolvableSource(s);
      if (resolved) sources.push(resolved);
    }
    if (sources.length === 0) continue; // an evidence line with NO resolvable source is not shown
    // The claim text came from the model (extraction) but was adversarially verified against a
    // verbatim source span; still, we defensively lint it and drop it if it trips a framing/identifier
    // gate (it must never carry a raw PMID/DOI or a forbidden framing).
    if (lintForbiddenFraming(v.text).length > 0 || hasRawIdentifier(v.text)) continue;
    evidence.push({ text: v.text, strength: v.strength === 'strong' ? 'strong' : 'weak', sources });
  }

  const mergedFlags = mergeAdditiveIntoFlags(labelFlags, additiveFindings);

  // Nothing survived verification+resolution ⇒ honest inconclusive, not a fabricated verdict.
  if (evidence.length === 0) {
    const inc = inconclusive(base, labelFlags, additiveFindings, subject, meta);
    // Keep the true meta (claimsExtracted/cut) from this run rather than emptyMeta.
    return { ...inc, meta };
  }

  const minStrength: 'strong' | 'weak' = evidence.some((e) => e.strength === 'weak') ? 'weak' : 'strong';
  const flagCount = mergedFlags.length;

  const verdictLine = safeLine(
    copy.verdictAssessed(evidence.length, minStrength, flagCount),
    // Fallback if a template ever tripped a lint gate: a bland, safe, evidence-descriptive line.
    copy.verdictAssessed(evidence.length, 'weak', 0),
  );

  // doesNotShow — ALWAYS present: what was cut, plus the standing anti-hype reminder.
  const cutCount = Math.max(0, extractedCount - evidence.length);
  const doesNotShow: string[] = [];
  if (cutCount > 0) doesNotShow.push(safeLine(copy.doesNotShowCut(cutCount), copy.DOES_NOT_SHOW_STANDING));
  doesNotShow.push(copy.DOES_NOT_SHOW_STANDING);

  return {
    ...base,
    status: 'assessed',
    verdictLine,
    evidence,
    doesNotShow,
    labelFlags: mergedFlags,
    safety: { routes: STANDING_SAFETY_ROUTES, note: copy.SAFETY_NOTE },
    meta,
  };
}

/**
 * Merge additive findings into the labelFlags list as R5-style observations so the card has ONE flags
 * surface. Each additive finding becomes a neutral, cited Flag routed to /safety — the SAME allowed
 * framing as the label checker's R5 (observe + route, never "avoid this"). An additive with NO
 * resolvable source is still shown (the concern is real + regulatory) but carries no source url; the
 * proprietary-blend structural entry never reaches here (rubric skips it — already R1).
 */
function mergeAdditiveIntoFlags(labelFlags: Flag[], additiveFindings: AdditiveFinding[]): Flag[] {
  const base = Array.isArray(labelFlags) ? [...labelFlags] : [];
  for (const a of additiveFindings ?? []) {
    base.push({
      rule: 'R5',
      ingredient: a.matchedName,
      text: `This label lists ${a.matchedName}, an additive on Somnary's cited watchlist. It is worth raising with a pharmacist or clinician; the linked source explains the basis.`,
      href: '/safety',
      linkLabel: `${a.matchedName}: why it's on the watchlist`,
    });
  }
  return base;
}
