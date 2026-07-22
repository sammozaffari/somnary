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
import { resolveSubject, type ResolvedSubject, type LensProductClass } from './resolve.ts';
import { defaultWebResearch, isReputableUrl, domainOf, type WebFinding, type WebResearchFn } from './websearch.ts';
import type { EvidenceProvider, EvidenceDoc } from './retrieval.ts';
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
/** The reputable web tier (CHK-7.7) runs AFTER the study result is composed, so it is bounded by a
 * separate WALL-clock ceiling (just under the Vercel maxDuration of 90s) rather than the study deadline —
 * this guarantees a slow study run + the web call can never blow the platform cap and lose the answer. */
const WEB_WALL_BUDGET_MS = 85_000;
/** Don't start the web tier without at least this much wall-clock left — else the study result ships now. */
const WEB_MIN_BUDGET_MS = 8_000;
/** Upper bound on a single web call regardless of how much budget remains. */
const WEB_MAX_TIMEOUT_MS = 25_000;

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

/** What the Lens took the query to mean (CHK-7.4) — set on any researched card. `line` is the
 * SERVER-composed "read X as Y" sentence (copy.ts); `subject`/`resolvedName` are the sanitised parts a
 * live-progress UI shows as "X → Y". No evidence, no grade — just the interpreted query. */
export interface LensResolvedDisplay {
  subject: string;
  resolvedName: string;
  productClass: LensProductClass;
  line: string;
}

/** A real pipeline milestone, streamed to the UI (CHK-7.4). Every field is server-authored/structural
 * — a count the engine actually reached, or the sanitised resolved names. NEVER model prose. */
export type LensEvent =
  | { type: 'resolved'; resolved: LensResolvedDisplay | null }
  | { type: 'searching' }
  | { type: 'sources'; count: number }
  | { type: 'extracting' }
  | { type: 'verifying'; total: number }
  | { type: 'composing' }
  | { type: 'web-search' };

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
  /** What the query was resolved to (CHK-7.4). Present on assessed/inconclusive researched cards. */
  resolved?: LensResolvedDisplay;
  verdictLine: string;
  evidence: LensEvidence[];
  /** The signature anti-hype block — always populated on assessed/inconclusive. */
  doesNotShow: string[];
  /** Reputable-only web references (CHK-7.7) — a SEPARATE, weaker tier shown below the study evidence;
   * present only when the env-gated web tier ran and grounded ≥1 note. Never peer-reviewed. */
  webFindings?: WebFinding[];
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
  /** Optional streaming hook (CHK-7.4). Fired at each REAL pipeline milestone so the route can emit SSE
   * frames. Non-streaming callers omit it — the run is identical. Never expected to throw (wrapped). */
  onEvent?: (event: LensEvent) => void;
  /** Injectable reputable-only web-references fn (CHK-7.7). Defaults to the ENV-GATED real one
   * (LENS_WEB_SEARCH). Tests inject a mock; when it returns [] (or is disabled) there is simply no web
   * tier. NEVER expected to throw. */
  webResearch?: WebResearchFn;
}

// --- safety routing (deterministic; boundary pages, never a dose/diagnosis) ----------------------

// Reuse the guardrails ROUTES via classify() for refusals; for an ASSESSED card we always surface the
// two standing boundary routes so safety is prominent on every remedy/decision surface (CLAUDE.md).
import { ROUTES } from '../ask/guardrails.ts';
const STANDING_SAFETY_ROUTES: Route[] = [ROUTES.safety, ROUTES.clinician];
/** A resolved OTC/prescription sleep DRUG routes harder — to the medications page + a clinician —
 * because its risks are personal and can be serious (CHK-7.4). All other classes get the standing set. */
const DRUG_SAFETY_ROUTES: Route[] = [ROUTES.meds, ROUTES.clinician];
function safetyRoutesFor(productClass?: LensProductClass): Route[] {
  return productClass === 'otc-drug' || productClass === 'prescription-drug'
    ? DRUG_SAFETY_ROUTES
    : STANDING_SAFETY_ROUTES;
}

// --- extraction parsing (never throws) -----------------------------------------------------------

/** A candidate evidence claim must mention a SLEEP concept to survive (CHK-7.4). The Lens is a SLEEP
 * reference: for a subject with a large unrelated literature (e.g. propranolol → migraine / portal
 * hypertension), PubMed's Best Match returns broadly-cited reviews that mention sleep only incidentally,
 * and the extractor can surface their off-topic main finding. This DETERMINISTIC gate drops any claim
 * with no sleep concept — a reliable backstop over the extractor's instruction (which an LLM may not
 * obey). Broad on purpose (help AND harm to sleep); a genuine sleep claim almost always names one. */
const SLEEP_CLAIM_RE =
  /\b(?:sleep|asleep|insomnia|sedat|somnolen|somnif|drows|hypnotic|circadian|nightmare|parasomnia|apn(?:o?ea|eic)|polysomn|nocturn|bedtime|sleepiness|wakeful)\w*|\b(?:naps?|napping|napped|psqi|waso|rem\ssleep|restless\sleg|night\sterror)\b/i;

/** True iff a claim text names a sleep concept (help or harm). Exported for the red-team suite. */
export function isSleepConcept(text: string): boolean {
  return typeof text === 'string' && SLEEP_CLAIM_RE.test(text);
}

/** Preclinical (animal / in-vitro) markers. Broader indexes (Europe PMC, CHK-7.6) surface more animal
 * studies; a mouse or cell-line finding is never "strong" HUMAN evidence, so the composer caps it to
 * weak (anti-hype). The claim text itself still names the model ("in mice"), so it stays transparent. */
const PRECLINICAL_RE =
  /\b(?:mice|mouse|murine|rats?|rodents?|zebrafish|drosophila|preclinical|in\svitro|in\ssilico|animal\smodels?|cell\s(?:line|culture)s?)\b/i;

/** True iff a claim reads as a preclinical (non-human) finding. Exported for the red-team suite. */
export function isPreclinical(text: string): boolean {
  return typeof text === 'string' && PRECLINICAL_RE.test(text);
}

// --- retrieval recall: two searches, merge, rerank by sleep relevance (CHK-7.5) ------------------
//
// PubMed's Best Match ranks by overall relevance, so for a subject with a large NON-sleep literature
// (e.g. propranolol → cirrhosis/migraine reviews) a bounded top-N misses its sleep papers entirely,
// and the Lens wrongly degrades to inconclusive. To find MORE citable evidence WITHOUT loosening the
// verification firewall (every surviving claim is still verbatim-verified), we: (1) run the resolver's
// query AND a deterministic sleep-FOCUSED query; (2) merge + dedupe; (3) rerank so the most
// sleep-relevant abstracts are the ones fed to extraction. No model prose is ever trusted — this only
// changes WHICH real papers we read.

/** Global counter form of the sleep-concept regex (for scoring term density in a doc). */
const SLEEP_TERM_G = new RegExp(SLEEP_CLAIM_RE.source, 'gi');

/** Specific sleep-PROBLEM terms — deliberately NOT the bare word "sleep" (which nearly every clinical
 * review mentions and so cannot discriminate). Used to build a second, sleep-focused query. */
const SLEEP_FOCUS_TERMS =
  '(insomnia OR nightmares OR "sleep quality" OR "sleep disturbance" OR somnolence OR "daytime sleepiness" OR sedation OR "sleep architecture" OR "sleep onset")';

/** How many of the most-sleep-relevant merged docs to feed extraction (bounds prompt size + cost). */
const EXTRACT_DOC_CAP = 8;

/** A deterministic sleep-focused PubMed query from a resolved name — surfaces papers ABOUT the
 * subject's sleep effect that Best Match buried. '' when there's no usable name. */
export function sleepFocusedQuery(name: string): string {
  const n = (typeof name === 'string' ? name : '').replace(/["\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
  return n ? `${n} AND ${SLEEP_FOCUS_TERMS}` : '';
}

/** A doc's sleep relevance: sleep-term hits in the title count triple (a title match means the paper is
 * ABOUT sleep), abstract hits count once. Used to rerank so sleep papers reach extraction first. */
export function sleepScore(doc: { title?: string; abstractText?: string }): number {
  const title = typeof doc?.title === 'string' ? doc.title : '';
  const abs = typeof doc?.abstractText === 'string' ? doc.abstractText : '';
  const titleHits = (title.match(SLEEP_TERM_G) || []).length;
  const absHits = (abs.match(SLEEP_TERM_G) || []).length;
  return titleHits * 3 + absHits;
}

/** Merge doc lists, deduped by PMID, preserving first-seen order. */
export function mergeDocs(...lists: EvidenceDoc[][]): EvidenceDoc[] {
  const seen = new Set<string>();
  const out: EvidenceDoc[] = [];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const d of list) {
      if (!d || typeof d.pmid !== 'string' || !d.pmid || seen.has(d.pmid)) continue;
      seen.add(d.pmid);
      out.push(d);
    }
  }
  return out;
}

/** Rerank merged docs by sleep relevance (desc), stable on ties (V8 sort is stable, so Best-Match order
 * survives as the tiebreak), then cap to EXTRACT_DOC_CAP. */
export function rerankBySleep(docs: EvidenceDoc[]): EvidenceDoc[] {
  return (Array.isArray(docs) ? docs.slice() : [])
    .sort((a, b) => sleepScore(b) - sleepScore(a))
    .slice(0, EXTRACT_DOC_CAP);
}

/** Parse ONE extraction reply into candidate claims. Tolerant of code-fence/prose wrapping (extract
 * the first {...}); ANY failure → []. Caps at LENS_MAX_CLAIMS, drops any claim whose sourcePmid is not
 * one of the fetched docs' PMIDs (no invented citation), and drops any claim that names NO sleep concept
 * (the Lens only reports a subject's sleep effect, never its unrelated findings). */
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
    // Drop empty claims, any claim tied to a PMID that was NOT in the fetched docs (no ungrounded, no
    // invented citation — verify.ts re-checks too), and any claim that names NO sleep concept (a sleep
    // reference never reports a subject's unrelated findings).
    if (!claimText || !pmid || !docPmids.has(pmid) || !isSleepConcept(claimText)) continue;
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

/** Letter-grade-shaped prose the Lens output must NEVER carry (it is never a Somnary grade). Targets
 * S/A–F tier/grade phrasings — "grade A", "tier S", "A grade", "earns a solid B", "rated C" — while
 * deliberately NOT matching numeric clinical scores (PSQI/ISI "score of 8") or plain counts ("10 of 12
 * patients"), which are legitimate evidence. Defense-in-depth over the framing lint (which has no grade
 * pattern). Applied to composed evidence text AND (CHK-7.4) to the model-derived resolved name/line. */
const GRADE_SMELL =
  /\b(?:grade[sd]?|tier)\s+(?:of\s+)?[a-fs]\b|\b[a-fs][-+]?[-\s]+(?:grade|tier)\b|\b(?:rated|scored|graded|earns?)\s+(?:an?\s+)?(?:\w+\s+)?[a-fs][-+]?\b/i;

/** Run a composed line through the forbidden-framing lint + raw-identifier + grade-smell checks. Returns
 * the line if clean, or a safe replacement if it trips any gate — a composed line can NEVER ship a
 * forbidden framing, a smuggled raw identifier, or grade-shaped prose even if a template were ever
 * mis-fed model-derived text (e.g. a resolved name like "grade A doxylamine"). */
function safeLine(line: string, replacement: string): string {
  if (typeof line !== 'string' || !line) return replacement;
  if (lintForbiddenFraming(line).length > 0 || hasRawIdentifier(line) || GRADE_SMELL.test(line)) return replacement;
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

/** Build the server-composed resolved display from a ResolvedSubject (CHK-7.4). The interpreted-as LINE
 * is composed by copy.ts and lint-checked (safeLine → '' on any gate hit); the resolvedName is shown
 * only if it trips no framing/identifier gate. productClass is ALWAYS carried — it drives safety routing
 * even when there is nothing to display. */
function buildResolvedDisplay(resolved: ResolvedSubject): LensResolvedDisplay {
  const line = safeLine(copy.interpretedAsLine(resolved.subject, resolved.resolvedName, resolved.productClass), '');
  const name =
    resolved.resolvedName &&
    lintForbiddenFraming(resolved.resolvedName).length === 0 &&
    !hasRawIdentifier(resolved.resolvedName) &&
    !GRADE_SMELL.test(resolved.resolvedName)
      ? resolved.resolvedName
      : '';
  return { subject: resolved.subject, resolvedName: name, productClass: resolved.productClass, line };
}

/** True when the resolved display carries something worth SHOWING (a composed line or a resolved name);
 * an empty display still travels internally (for productClass-based safety routing) but isn't rendered. */
function hasResolvedDisplay(d: LensResolvedDisplay): boolean {
  return !!(d.line || d.resolvedName);
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
  const runStart = now(); // wall-clock start, for the web tier's platform-cap budget (CHK-7.7)
  const corpus = Array.isArray(args.corpus) ? args.corpus : [];
  const labelEntries = Array.isArray(args.labelEntries) ? args.labelEntries : [];
  const additiveWatchlist = Array.isArray(args.additiveWatchlist) ? args.additiveWatchlist : [];

  // A safe streaming sink: a broken onEvent must never break the run.
  const emit = (event: LensEvent) => {
    if (typeof args.onEvent === 'function') {
      try {
        args.onEvent(event);
      } catch {
        /* a broken sink is swallowed — streaming is best-effort, the returned assessment is truth */
      }
    }
  };

  // A defensive outer try: nothing below may throw out of the engine.
  try {
    const rawInput = typeof args.input === 'string' ? args.input : '';

    // (1) ABUSE FENCE — prompt-injection / abusive input is refused before any model call,
    // deterministically and unjailbreakably. CHK-7.4: we NO LONGER honour the fence's *off-topic*
    // keyword verdict here — the Lens's whole job is to research the long tail it doesn't recognise
    // (a brand like "Restavit"), so relevance is decided later by the resolver. Only ABUSE refuses now.
    const topic = checkTopic(rawInput, corpus);
    if (!topic.ok && topic.reason === 'abusive') {
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
    // research runs, NO model call. This safety-critical gate stays deterministic and pre-model.
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

    // Shared model-call budget + wall-clock deadline across resolve + extract + verify.
    const budget: CallBudget = args.budget ?? { used: 0, max: LENS_MAX_MODEL_CALLS };
    const deadline = now() + (typeof args.deadlineMs === 'number' ? args.deadlineMs : DEFAULT_DEADLINE_MS);
    const model = args.model ?? defaultLensModel();
    const webResearch = args.webResearch ?? defaultWebResearch();

    if (normalized.empty) {
      return inconclusive(base, rubric.labelFlags, rubric.additiveFindings, normalized.normalized, emptyMeta(providerName));
    }

    // (3.5) RESOLVE (CHK-7.4) — interpret the input BEFORE research: brand→ingredient, sleep relevance,
    // and a real PubMed query. ONE model call (shares budget/deadline). Degrades to a passthrough on any
    // model failure. The relevance verdict is the ONLY new refusal, and it refuses strictly LESS than the
    // old keyword fence — the safety-critical refusals above stayed deterministic and already ran.
    const resolved = await resolveSubject({ subject: normalized.normalized, model, budget, deadline, now });
    const resolvedDisplay = buildResolvedDisplay(resolved);
    emit({ type: 'resolved', resolved: hasResolvedDisplay(resolvedDisplay) ? resolvedDisplay : null });

    if (!resolved.sleepRelevant) {
      return {
        ...base,
        status: 'refused',
        verdictLine: copy.OFF_TOPIC_MESSAGE,
        evidence: [],
        doesNotShow: [],
        labelFlags: [],
        safety: { routes: [ROUTES.search], note: copy.SAFETY_NOTE },
        meta: { ...emptyMeta(providerName), modelCalls: budget.used },
      };
    }

    // (4) RESEARCH — bounded external search. Runs the resolver's query AND a deterministic
    // sleep-FOCUSED query (CHK-7.5), so a subject with a large non-sleep literature still surfaces its
    // sleep papers; results are merged, deduped, and reranked so the most sleep-relevant abstracts reach
    // extraction. Sequential (not parallel) to respect NCBI's ~3 req/s polite-use limit. No docs ⇒
    // inconclusive (never a fabricated verdict). The verification firewall downstream is UNCHANGED —
    // this only widens WHICH real papers we read, never what we trust.
    emit({ type: 'searching' });
    const safeSearch = async (q: string): Promise<EvidenceDoc[]> => {
      if (!q) return [];
      try {
        const searched = await args.provider.search(q);
        return Array.isArray(searched) ? searched : [];
      } catch {
        return [];
      }
    };
    const primaryDocs = await safeSearch(resolved.pubmedQuery);
    const focusedDocs = await safeSearch(sleepFocusedQuery(resolved.resolvedName || normalized.normalized));
    const docs = rerankBySleep(mergeDocs(primaryDocs, focusedDocs));
    emit({ type: 'sources', count: docs.length });
    if (docs.length === 0) {
      const studyResult = inconclusive(
        base,
        rubric.labelFlags,
        rubric.additiveFindings,
        normalized.normalized,
        { ...emptyMeta(providerName), modelCalls: budget.used },
        resolvedDisplay,
      );
      // Even with NO study evidence, reputable web references (if enabled) can still help — this is
      // exactly when a reader most wants them. Enrich before returning.
      return await enrichWithWeb(studyResult, resolved.resolvedName || normalized.normalized, webResearch, runStart, now, emit);
    }

    // (5) EXTRACT — ONE model call over the docs fetched for the resolved subject.
    const extractSubject = resolved.resolvedName || normalized.normalized;
    const docPmids = new Set(docs.map((d) => d.pmid).filter((p): p is string => typeof p === 'string' && !!p));

    let candidates: CandidateClaim[] = [];
    if (budget.used < budget.max && deadline - now() > 0) {
      budget.used += 1;
      emit({ type: 'extracting' });
      const extractRes = await model({
        system: LENS_EXTRACT_PROMPT,
        user: buildExtractUserPrompt(extractSubject, docs),
        temperature: 0.1,
        timeoutMs: Math.max(1, deadline - now()),
      });
      candidates = parseExtraction(extractRes && extractRes.ok ? extractRes.text : '', docPmids);
    }

    // (6) VERIFY — refute-first; only survivors reach composition. Shares the budget + deadline.
    emit({ type: 'verifying', total: candidates.length });
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
    emit({ type: 'composing' });
    const studyResult = compose(base, verified, rubric.labelFlags, rubric.additiveFindings, normalized.normalized, candidates.length, meta, resolvedDisplay);
    return await enrichWithWeb(studyResult, extractSubject, webResearch, runStart, now, emit);
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
  resolved?: LensResolvedDisplay,
): LensAssessment {
  const doesNotShow = [
    safeLine(copy.doesNotShowNoHumanEvidence(subject), copy.DOES_NOT_SHOW_STANDING),
    copy.DOES_NOT_SHOW_STANDING,
  ];
  const productClass = resolved?.productClass ?? 'unknown';
  return {
    ...base,
    ...(resolved && hasResolvedDisplay(resolved) ? { resolved } : {}),
    status: 'inconclusive',
    verdictLine: safeLine(copy.INCONCLUSIVE_MESSAGE, copy.INCONCLUSIVE_MESSAGE),
    evidence: [],
    doesNotShow,
    labelFlags: mergeAdditiveIntoFlags(labelFlags, additiveFindings),
    safety: { routes: safetyRoutesFor(resolved?.productClass), note: copy.safetyNoteFor(productClass) },
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
  resolved?: LensResolvedDisplay,
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
    // gate (it must never carry a raw PMID/DOI or a forbidden framing) OR reads like a letter grade
    // (defense-in-depth: the Lens output is NEVER a Somnary grade — an evidence line must not smuggle
    // grade-shaped prose past the composer even if it happened to be a verbatim span of an abstract).
    if (
      lintForbiddenFraming(v.text).length > 0 ||
      hasRawIdentifier(v.text) ||
      GRADE_SMELL.test(v.text)
    )
      continue;
    // A preclinical (animal / in-vitro) finding is never "strong" HUMAN evidence — cap it to weak.
    const strength: 'strong' | 'weak' = v.strength === 'strong' && !isPreclinical(v.text) ? 'strong' : 'weak';
    evidence.push({ text: v.text, strength, sources });
  }

  const mergedFlags = mergeAdditiveIntoFlags(labelFlags, additiveFindings);

  // Nothing survived verification+resolution ⇒ honest inconclusive, not a fabricated verdict.
  if (evidence.length === 0) {
    const inc = inconclusive(base, labelFlags, additiveFindings, subject, meta, resolved);
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
    ...(resolved && hasResolvedDisplay(resolved) ? { resolved } : {}),
    status: 'assessed',
    verdictLine,
    evidence,
    doesNotShow,
    labelFlags: mergedFlags,
    safety: { routes: safetyRoutesFor(resolved?.productClass), note: copy.safetyNoteFor(resolved?.productClass ?? 'unknown') },
    meta,
  };
}

/**
 * Enrich a researched study result with the reputable-only web tier (CHK-7.7). Runs ONLY on assessed/
 * inconclusive cards, ONLY with deadline headroom, and ONLY when the injected webResearch fn is live
 * (env-gated). Every note is re-filtered server-side: it must name a sleep concept AND pass the SAME
 * forbidden-framing + raw-identifier + grade-smell gates as study evidence. Never throws; on any failure
 * the study result is returned unchanged (the study tiers never depend on the web tier).
 */
async function enrichWithWeb(
  result: LensAssessment,
  subject: string,
  webResearch: WebResearchFn,
  runStart: number,
  now: () => number,
  emit: (event: LensEvent) => void,
): Promise<LensAssessment> {
  if (result.status !== 'assessed' && result.status !== 'inconclusive') return result;
  if (typeof webResearch !== 'function') return result;
  // WALL-clock budget (not the study deadline): only run with real headroom under the platform cap, and
  // clamp the call so a slow study run + the web call can never exceed it and lose the composed answer.
  const webBudget = Math.min(WEB_MAX_TIMEOUT_MS, WEB_WALL_BUDGET_MS - (now() - runStart));
  if (webBudget < WEB_MIN_BUDGET_MS) return result;
  emit({ type: 'web-search' });
  let findings: WebFinding[] = [];
  try {
    findings = await webResearch(subject, webBudget);
  } catch {
    findings = [];
  }
  if (!Array.isArray(findings) || findings.length === 0) return result;
  const clean: WebFinding[] = [];
  const seen = new Set<string>();
  for (const f of findings) {
    if (!f || typeof f.text !== 'string' || typeof f.url !== 'string' || !f.url) continue;
    // Defense-in-depth: the engine INDEPENDENTLY enforces reputability (webResearch is injectable) and
    // recomputes the shown domain from the URL — never trusts a passed-in domain.
    if (!isReputableUrl(f.url)) continue;
    if (!isSleepConcept(f.text)) continue; // only the subject's SLEEP effect, same as study evidence
    if (lintForbiddenFraming(f.text).length > 0 || hasRawIdentifier(f.text) || GRADE_SMELL.test(f.text)) continue;
    const key = f.text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    clean.push({ text: f.text, url: f.url, domain: domainOf(f.url) });
    if (clean.length >= 4) break;
  }
  if (clean.length === 0) return result;
  return { ...result, webFindings: clean };
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
