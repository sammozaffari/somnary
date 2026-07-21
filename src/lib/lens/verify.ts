/**
 * Somnary Lens adversarial verifier (CHK-7.1b) — the anti-hallucination CORE (D5).
 *
 * THE LOAD-BEARING GUARANTEE: every evidence claim is adversarially verified REFUTE-FIRST against the
 * FETCHED SOURCE TEXT. A claim that cannot be defended against its source is CUT — dropped, never
 * hedged, never included with a caveat. This is what makes "cited" mean TRUE, not merely plausible.
 *
 * The verify contract, enforced in CODE (never by trusting the model):
 *   - Each candidate claim is tied to ONE source PMID (from the fetched docs). If that PMID is not in
 *     `docs`, the claim is CUT (it can't be grounded).
 *   - For each claim we run N=3 INDEPENDENT refute calls (temp ~0.3 for diversity), each grounded
 *     ONLY on the claim + its one source doc's abstractText — never the whole corpus, never model
 *     memory. Each reply is parsed by a never-throws coercer; malformed → treated as supported:'no'.
 *   - A claim SURVIVES only if >=2 of 3 verifiers return supported:'yes' AND a NON-EMPTY quote that
 *     the SERVER re-confirms is a verbatim substring of the source's abstractText (whitespace-
 *     normalized on both sides). A fabricated or paraphrased "quote" is NOT a substring, so it fails
 *     deterministically. Any other outcome → the claim is CUT.
 *   - Strength of a survivor = the MIN across its supporting verifiers ('weak' if any supporter said
 *     weak) — weak is labeled weak, anti-hype by default.
 *
 * BUDGET + DEADLINE degrade to "fewer verified, NEVER unverified": every model call is gated on a
 * shared mutable call-budget (ceiling LENS_MAX_MODEL_CALLS) and an absolute deadline (ms). When
 * either is exhausted mid-run we STOP and treat every not-yet-fully-verified claim as CUT — the
 * output can never contain a claim that didn't clear the full 2-of-3 grounded bar. `deadlineHit` is
 * recorded in meta.
 *
 * NEVER THROWS. Model + fetch are injectable so tests run fully offline. Written in erasable TS so
 * the offline CI runner (scripts/test-lens.mjs) can import it directly.
 */

import type { GeminiResult } from '../ask/gemini.ts';
import { callOpenRouter, OPENROUTER_DEFAULT_MODEL } from '../ask/openrouter.ts';
import type { EvidenceDoc } from './retrieval.ts';
import { LENS_REFUTE_PROMPT, buildRefuteUserPrompt } from './prompts.ts';

// --- tunables ------------------------------------------------------------------------------------

/** Independent refute calls per claim. */
export const REFUTE_N = 3;
/** Survivors need at least this many grounded 'yes' verdicts (of REFUTE_N). */
export const REFUTE_QUORUM = 2;
/** Ceiling on total model calls for ONE Lens run — a hard cap on cost + latency, shared across the
 * resolve (1, CHK-7.4) + extract (1) + verify (up to LENS_MAX_CLAIMS × REFUTE_N) stages. Sized so a
 * full 5-claim run still gets all three verifiers each (1 + 1 + 5×3 = 17) after the added resolve call,
 * so query understanding did NOT come at the cost of verification depth. Owner-tunable cost ceiling. */
export const LENS_MAX_MODEL_CALLS = 18;
/** Temperature for refute calls — a little diversity so the 3 verifiers aren't identical. */
const REFUTE_TEMPERATURE = 0.3;
/** Floor on the per-call timeout; below this we don't bother calling (deadline effectively hit). */
const MIN_CALL_MS = 250;
/** Tokens per refute reply — the JSON verdict is tiny. */
const REFUTE_MAX_TOKENS = 300;

// --- public types --------------------------------------------------------------------------------

/** A claim proposed by extraction, tied to ONE source PMID. Verified independently. */
export interface CandidateClaim {
  text: string;
  sourcePmid: string;
}

/** A claim that CLEARED the adversarial bar. `sources` are resolvable {pmid,url}; strength is the
 * min across supporting verifiers. Only survivors reach the composer (7.1c). */
export interface VerifiedClaim {
  text: string;
  strength: 'strong' | 'weak';
  sources: { pmid: string; url: string }[];
}

/** The injectable model client. Mirrors the ask/guide `AskGemini` shape but threads per-call
 * temperature + timeout (the verifier needs both). Default wraps callOpenRouter; tests inject a
 * mock. NEVER expected to throw (returns a GeminiResult error instead). */
export type LensModelClient = (args: {
  system: string;
  user: string;
  temperature?: number;
  timeoutMs?: number;
}) => Promise<GeminiResult>;

/** A mutable model-call budget shared across a request. `used` is incremented before each call;
 * `max` is the ceiling. Passing one object lets extraction (7.1c) + verification share a cap. */
export interface CallBudget {
  used: number;
  max: number;
}

export interface VerifyMeta {
  claimsExtracted: number;
  claimsCut: number;
  modelCalls: number;
  deadlineHit: boolean;
}

export interface VerifyArgs {
  claims: CandidateClaim[];
  docs: EvidenceDoc[];
  /** Injected model client; defaults to the env-gated OpenRouter wrapper. */
  model?: LensModelClient;
  /** Absolute ms timestamp (Date.now()-based) after which no new model call is started. */
  deadline?: number;
  /** Shared, mutable model-call budget. Defaults to a fresh {used:0, max:LENS_MAX_MODEL_CALLS}. */
  budget?: CallBudget;
  /** Injected clock for tests (defaults to Date.now). */
  now?: () => number;
}

export interface VerifyResult {
  verified: VerifiedClaim[];
  meta: VerifyMeta;
}

// --- default model client (env-gated; never throws) ---------------------------------------------

/** The default client: uses OpenRouter when OPENROUTER_API_KEY is set, else returns a never-throws
 * error result (so the engine degrades — no key ⇒ no survivors ⇒ "inconclusive", never a guess). */
export function defaultLensModel(): LensModelClient {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  const apiKey = env?.OPENROUTER_API_KEY ?? '';
  const model = env?.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
  if (!apiKey) {
    return async () => ({ ok: false, text: '', error: 'missing-api-key' });
  }
  return ({ system, user, temperature, timeoutMs }) =>
    callOpenRouter({ apiKey, system, user, model, temperature, timeoutMs, maxTokens: REFUTE_MAX_TOKENS });
}

// --- refute-verdict coercer (NEVER throws) ------------------------------------------------------

export interface RefuteVerdict {
  supported: 'yes' | 'no' | 'unclear';
  strength: 'strong' | 'weak';
  quote: string;
}

const SUPPORTED = new Set(['yes', 'no', 'unclear']);

/** Coerce ANY parsed value into a RefuteVerdict. Unknown/missing → the skeptical default
 * (supported:'no', strength:'weak', quote:''). Never throws. */
export function coerceVerdict(parsed: unknown): RefuteVerdict {
  const root = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  const supported = typeof root.supported === 'string' && SUPPORTED.has(root.supported) ? (root.supported as RefuteVerdict['supported']) : 'no';
  const strength = root.strength === 'strong' ? 'strong' : 'weak';
  const quote = typeof root.quote === 'string' ? root.quote : '';
  return { supported, strength, quote };
}

/** Parse a raw model reply (expected JSON) into a RefuteVerdict. Tolerant of code-fence wrapping and
 * leading/trailing prose: extracts the first {...} block. ANY parse failure → the skeptical default
 * (treated as supported:'no') — a malformed reply can never smuggle a claim through. */
export function parseVerdict(raw: string): RefuteVerdict {
  const text = typeof raw === 'string' ? raw : '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return coerceVerdict(null);
  try {
    return coerceVerdict(JSON.parse(text.slice(start, end + 1)));
  } catch {
    return coerceVerdict(null);
  }
}

// --- verbatim-quote grounding (the deterministic gate) ------------------------------------------

/** Normalize whitespace for the substring check: collapse all runs of whitespace to a single space
 * and trim. Applied to BOTH the source text and the quote so incidental spacing (line breaks,
 * doubled spaces from XML entity stripping) doesn't defeat an otherwise-verbatim span — but a
 * paraphrase or reworded quote still fails. */
function normalizeWs(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/** A verbatim substring alone is not enough: a trivial span the model picks BECAUSE it is common
 * ("trial", "sleep") could anchor an arbitrary false claim. So a grounding quote must ALSO be
 * non-trivial in length AND topically tied to the claim it supposedly supports. */
const MIN_QUOTE_CHARS = 20; // a one/two-word span can't anchor a claim
const MIN_SHARED_TOKENS = 2; // the quote must share content words with the claim
const QUOTE_STOPWORDS = new Set([
  'that', 'this', 'with', 'from', 'were', 'have', 'been', 'their', 'which', 'these', 'those',
  'study', 'trial', 'group', 'groups', 'result', 'results', 'effect', 'effects', 'compared',
  'placebo', 'patients', 'participants', 'significant', 'significantly', 'associated', 'evidence',
]);

/** Content tokens: lowercased words ≥4 chars, minus generic study-boilerplate stopwords, so overlap
 * reflects the SUBJECT of the claim (e.g. "apigenin", "latency") not filler both texts share. */
function contentTokens(s: string): Set<string> {
  const out = new Set<string>();
  for (const w of normalizeWs(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(' ')) {
    if (w.length >= 4 && !QUOTE_STOPWORDS.has(w)) out.add(w);
  }
  return out;
}

/** TRUE iff `quote` is a verbatim substring of `sourceText` (whitespace-normalized) AND non-trivial
 * (≥ MIN_QUOTE_CHARS) AND shares ≥ MIN_SHARED_TOKENS content words with `claim`. This is the
 * server-side re-check the model cannot fake: a fabricated/paraphrased quote isn't a substring, and a
 * real-but-irrelevant span (e.g. a lone "trial") can't anchor an unrelated claim. Conservative by
 * design — it prefers cutting a genuine claim to admitting an unsupported one. */
export function quoteIsGrounded(quote: string, sourceText: string, claim: string): boolean {
  if (typeof quote !== 'string' || typeof sourceText !== 'string') return false;
  const q = normalizeWs(quote);
  if (q.length < MIN_QUOTE_CHARS) return false;
  if (!normalizeWs(sourceText).includes(q)) return false;
  const claimTokens = contentTokens(typeof claim === 'string' ? claim : '');
  let shared = 0;
  for (const t of contentTokens(q)) {
    if (claimTokens.has(t) && ++shared >= MIN_SHARED_TOKENS) return true;
  }
  return false;
}

// --- the verifier --------------------------------------------------------------------------------

/** One refute call, budget/deadline gated. Increments `budget.used` only when a call is actually
 * made. Returns null when there is no room to call (budget/deadline exhausted) — the caller treats a
 * null as "not verified" (skeptical). Never throws. */
async function refuteOnce(
  claim: string,
  sourceText: string,
  model: LensModelClient,
  budget: CallBudget,
  deadline: number,
  now: () => number,
): Promise<{ verdict: RefuteVerdict; called: true } | null> {
  const remaining = deadline - now();
  if (budget.used >= budget.max || remaining < MIN_CALL_MS) return null;
  budget.used += 1;
  const res = await model({
    system: LENS_REFUTE_PROMPT,
    user: buildRefuteUserPrompt(claim, sourceText),
    temperature: REFUTE_TEMPERATURE,
    timeoutMs: Math.max(MIN_CALL_MS, deadline - now()),
  });
  // A failed/empty model result parses to the skeptical default (supported:'no').
  const verdict = parseVerdict(res && res.ok ? res.text : '');
  return { verdict, called: true };
}

/**
 * Adversarially verify candidate claims REFUTE-FIRST. Returns only survivors. Never throws.
 *
 * Survival (enforced here, not by the model): a claim needs >=REFUTE_QUORUM of REFUTE_N verifiers
 * that BOTH say supported:'yes' AND supply a quote that quoteIsGrounded() confirms is a verbatim
 * substring of the claim's source abstract. Strength = MIN across supporters. Anything else → CUT.
 *
 * Budget/deadline: gated per call; when exhausted we stop and every not-yet-survived claim is CUT.
 */
export async function verifyClaims(args: VerifyArgs): Promise<VerifyResult> {
  const claims = Array.isArray(args.claims) ? args.claims : [];
  const docs = Array.isArray(args.docs) ? args.docs : [];
  const model = args.model ?? defaultLensModel();
  const now = args.now ?? Date.now;
  const deadline = typeof args.deadline === 'number' ? args.deadline : now() + 60_000;
  const budget: CallBudget = args.budget ?? { used: 0, max: LENS_MAX_MODEL_CALLS };

  // Index the fetched docs by PMID so a claim can be grounded ONLY on its own source's abstract.
  const byPmid = new Map<string, EvidenceDoc>();
  for (const d of docs) {
    if (d && typeof d.pmid === 'string' && d.pmid) byPmid.set(d.pmid, d);
  }

  const claimsExtracted = claims.length;
  const verified: VerifiedClaim[] = [];
  let deadlineHit = false;

  for (const claim of claims) {
    const text = claim && typeof claim.text === 'string' ? claim.text.trim() : '';
    const pmid = claim && typeof claim.sourcePmid === 'string' ? claim.sourcePmid.trim() : '';
    const doc = pmid ? byPmid.get(pmid) : undefined;

    // Can't ground it → CUT (no source in docs, or empty claim text).
    if (!text || !doc) continue;

    // If budget/deadline is already exhausted, this claim can never clear the full bar → CUT.
    if (budget.used >= budget.max || deadline - now() < MIN_CALL_MS) {
      deadlineHit = true;
      continue; // and every subsequent claim will hit the same gate → all remaining CUT.
    }

    const source = doc.abstractText ?? '';
    let groundedYes = 0;
    let anyWeak = false;
    let ranAllVerifiers = true;

    for (let i = 0; i < REFUTE_N; i++) {
      const outcome = await refuteOnce(text, source, model, budget, deadline, now);
      if (!outcome) {
        // Budget/deadline hit mid-claim: we did NOT complete the full N verifiers, so this claim
        // cannot be confirmed to the full bar → treat as CUT (do not include a partial survivor).
        deadlineHit = true;
        ranAllVerifiers = false;
        break;
      }
      const v = outcome.verdict;
      // A verdict only counts toward quorum if it says 'yes' AND its quote is a server-confirmed
      // verbatim substring of THIS source's abstract. Fabricated/paraphrased quotes fail here.
      if (v.supported === 'yes' && quoteIsGrounded(v.quote, source, text)) {
        groundedYes += 1;
        if (v.strength === 'weak') anyWeak = true;
      }
    }

    if (ranAllVerifiers && groundedYes >= REFUTE_QUORUM) {
      verified.push({
        text,
        // MIN strength: weak if ANY supporting verifier said weak.
        strength: anyWeak ? 'weak' : 'strong',
        sources: [{ pmid: doc.pmid, url: doc.url }],
      });
    }
    // else → CUT (never hedged, never partially included).
  }

  return {
    verified,
    meta: {
      claimsExtracted,
      claimsCut: claimsExtracted - verified.length,
      modelCalls: budget.used,
      deadlineHit,
    },
  };
}
