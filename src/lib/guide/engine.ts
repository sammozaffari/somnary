/**
 * Guide engine (CHK-6.8a) — orchestrates one intake beat of the /guide concierge. It enforces THE
 * INVARIANT: the model's only outputs are (1) fixed-enum signals and (2) one short `ack`; the SERVER
 * deterministically maps signals → a route-plan of REAL, EXISTING corpus URLs. The model can never
 * name a remedy as a recommendation, a dose, a diagnosis, or a URL, and its one prose field (`ack`)
 * is forbidden-framing-filtered and identifier-stripped before it is ever returned.
 *
 * ORDER (each layer is deterministic except the single model extraction call):
 *   0. topic-fence   — reject off-topic / abusive input BEFORE the model (not a model call).
 *   1. classify()    — the ask engine's Layer A refusals (dosing/diagnosis/safe-for-me/combine/
 *                      stop-Rx/crisis) win first, WITHOUT calling the model, and route to a boundary.
 *   2. model extract — the ONE model call; returns JSON we parse+validate (never trusted as prose).
 *   3. sanitize ack  — lintForbiddenFraming(ack) + identifier check → drop & replace with a canned
 *                      neutral ack on ANY hit (forbidden framing, [n], PMID, DOI, or URL).
 *   4. router        — pure signal→URL mapping (src/lib/guide/router.ts).
 *   5. accumulate    — merge this beat's extracted signals into the prior state so the plan reflects
 *                      the whole conversation, then route on the accumulated state.
 *
 * NEVER throws: on a model error the beat degrades to a canned neutral ack + whatever deterministic
 * routing the accumulated prior state allows. The model client is INJECTED exactly like the ask
 * engine (defaults to the OpenRouter/Gemini chain), so the CI runner drives this same code path with
 * a deterministic mock and never touches the network. Erasable TS.
 */
import type { AskRemedy } from '../ask/corpus.ts';
import {
  classify,
  lintForbiddenFraming,
  hasRawIdentifier,
  extractBracketCitations,
  ROUTES,
  type Route,
} from '../ask/guardrails.ts';
import type { AskGemini } from '../ask/engine.ts';
import { callGemini, type GeminiResult } from '../ask/gemini.ts';
import { callOpenRouter, OPENROUTER_DEFAULT_MODEL } from '../ask/openrouter.ts';
import { checkTopic } from './topic-fence.ts';
import { GUIDE_SYSTEM, buildGuideUserPrompt, GUIDE_PROMPT_VERSION } from './prompt.ts';
import {
  parseExtraction,
  validateExtraction,
  NEUTRAL_ACK,
  CHRONICITY,
  type GuideExtraction,
  type Chronicity,
  type AgeBand,
} from './schema.ts';
import { routePlan, type RoutePlan } from './router.ts';

// --- accumulated intake state (across beats) ----------------------------------------------------

/** The running, validated state the router reads. Same shape as GuideExtraction minus the per-beat
 * ack (state has no prose — prose never persists). */
export interface GuideState {
  problems: GuideExtraction['situation']['problems'];
  chronicity: Chronicity;
  ageBand: AgeBand;
  redFlags: GuideExtraction['situation']['redFlags'];
  triedRemedies: string[];
  habitSignals: GuideExtraction['habits']['signals'];
}

export function emptyState(): GuideState {
  return { problems: [], chronicity: 'unknown', ageBand: 'unknown', redFlags: [], triedRemedies: [], habitSignals: [] };
}

const CHRONICITY_RANK: Record<Chronicity, number> = { unknown: 0, occasional: 1, frequent: 2, chronic: 3 };

function mergeUnique<T>(a: readonly T[], b: readonly T[]): T[] {
  const out: T[] = [...a];
  for (const x of b) if (!out.includes(x)) out.push(x);
  return out;
}

/** Fold a beat's validated extraction into the running state (monotonic: signals accumulate, the
 * most-severe chronicity wins, a known ageBand wins over unknown, redFlags union then normalize). */
export function accumulate(prior: GuideState, ext: GuideExtraction): GuideState {
  const redFlags = mergeUnique(prior.redFlags, ext.situation.redFlags).filter(
    (f, _i, arr) => f !== 'none' || arr.length === 1,
  );
  const nextChron =
    CHRONICITY_RANK[ext.situation.chronicity] > CHRONICITY_RANK[prior.chronicity]
      ? ext.situation.chronicity
      : prior.chronicity;
  const nextAge = prior.ageBand !== 'unknown' ? prior.ageBand : ext.situation.ageBand;
  return {
    problems: mergeUnique(prior.problems, ext.situation.problems),
    chronicity: nextChron,
    ageBand: nextAge,
    redFlags,
    triedRemedies: mergeUnique(prior.triedRemedies, ext.history.triedRemedies),
    habitSignals: mergeUnique(prior.habitSignals, ext.habits.signals),
  };
}

/** Reconstruct a GuideExtraction (sans ack) from state, so the router — which reads GuideExtraction —
 * routes on the ACCUMULATED conversation, not just the latest beat. */
function stateToExtraction(state: GuideState, ack: string): GuideExtraction {
  return validateExtraction({
    ack,
    situation: {
      problems: state.problems,
      chronicity: state.chronicity,
      ageBand: state.ageBand,
      redFlags: state.redFlags,
    },
    history: { triedRemedies: state.triedRemedies, notes: '' },
    habits: { signals: state.habitSignals },
  });
}

// --- ack sanitization ---------------------------------------------------------------------------

/** Drop-and-replace the model's ack on ANY forbidden framing, bracketed [n], or raw identifier
 * (PMID/DOI/URL/registry). Returns the safe ack plus the reason (for meta/tests). */
export function sanitizeAck(ack: string): { ack: string; replaced: boolean; reason: string | null } {
  const raw = typeof ack === 'string' ? ack.trim() : '';
  if (!raw) return { ack: NEUTRAL_ACK, replaced: true, reason: 'empty' };
  if (lintForbiddenFraming(raw).length > 0) return { ack: NEUTRAL_ACK, replaced: true, reason: 'forbidden-framing' };
  if (extractBracketCitations(raw).length > 0) return { ack: NEUTRAL_ACK, replaced: true, reason: 'bracket-citation' };
  if (hasRawIdentifier(raw)) return { ack: NEUTRAL_ACK, replaced: true, reason: 'raw-identifier' };
  return { ack: raw, replaced: false, reason: null };
}

// --- model client (injected like the ask engine) ------------------------------------------------

interface ModelClient {
  fn: AskGemini;
  provider: string;
}

function defaultClient(): ModelClient {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  const orKey = env?.OPENROUTER_API_KEY ?? '';
  if (orKey) {
    const model = env?.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL;
    return { fn: ({ system, user }) => callOpenRouter({ apiKey: orKey, system, user, model }), provider: `openrouter/${model}` };
  }
  const gKey = env?.GEMINI_API_KEY ?? '';
  if (gKey) return { fn: ({ system, user }) => callGemini({ apiKey: gKey, system, user }), provider: 'gemini' };
  return { fn: async () => ({ ok: false, text: '', error: 'missing-api-key' }), provider: 'none' };
}

function resolveClient(injected?: AskGemini): ModelClient {
  return injected ? { fn: injected, provider: 'injected' } : defaultClient();
}

// --- beat result --------------------------------------------------------------------------------

export type GuideStatus =
  | 'routed' // normal: extracted, sanitized, routed
  | 'refused' // Layer A classify() refusal (dosing/diagnosis/…)
  | 'crisis' // crisis short-circuit (classify crisis OR redFlag crisis)
  | 'off-topic' // topic-fence rejected before the model
  | 'model-error'; // model failed → degraded routing from prior state

export interface GuideBeatResult {
  status: GuideStatus;
  category: string;
  /** The only model prose surfaced — already forbidden-framing-filtered + identifier-stripped. */
  ack: string;
  /** The deterministic reading map of REAL corpus URLs. */
  plan: RoutePlan;
  /** A boundary route when a refusal/crisis fired (else null). */
  route: Route | null;
  /** The accumulated intake state after this beat (never contains prose). */
  state: GuideState;
  meta: { promptVersion: string; provider: string; modelCalled: boolean; ackReplaced: boolean; ackReason: string | null };
}

export interface RunGuideBeatParams {
  beat: string;
  text: string;
  corpus: AskRemedy[];
  priorState?: GuideState;
  model?: AskGemini;
}

const REFUSAL_ROUTE_FALLBACK: Route = ROUTES.safety;

/**
 * Run one intake beat. Never throws. See the file header for the fixed order. The route-plan is
 * always computed from the ACCUMULATED state, so even a refused/off-topic/error beat returns
 * whatever deterministic routing the prior conversation supports (never a dead end).
 */
export async function runGuideBeat(params: RunGuideBeatParams): Promise<GuideBeatResult> {
  const { beat, text, corpus } = params;
  const priorState = params.priorState ?? emptyState();
  const client = resolveClient(params.model);
  const baseMeta = { promptVersion: GUIDE_PROMPT_VERSION, provider: client.provider };

  const planFrom = (state: GuideState): RoutePlan => routePlan(stateToExtraction(state, ''), corpus);

  // 0 — topic-fence (deterministic, pre-model). Off-topic/abusive → neutral redirect, prior routing.
  const fence = checkTopic(text, corpus);
  if (!fence.ok) {
    return {
      status: 'off-topic',
      category: fence.reason,
      ack: fence.message,
      plan: planFrom(priorState),
      route: null,
      state: priorState,
      meta: { ...baseMeta, modelCalled: false, ackReplaced: true, ackReason: 'topic-fence' },
    };
  }

  // 1 — Layer A classify() refusals win first, no model call.
  const verdict = classify(text);
  if (verdict.kind === 'refuse') {
    const isCrisis = verdict.category === 'crisis';
    // A crisis screener short-circuits routing entirely (router.stop) regardless of prior state.
    const state = isCrisis ? accumulate(priorState, validateExtraction({ situation: { redFlags: ['crisis'] } })) : priorState;
    return {
      status: isCrisis ? 'crisis' : 'refused',
      category: verdict.category,
      ack: verdict.message,
      plan: isCrisis ? routePlan(stateToExtraction(state, ''), corpus) : planFrom(priorState),
      route: verdict.route ?? REFUSAL_ROUTE_FALLBACK,
      state,
      meta: { ...baseMeta, modelCalled: false, ackReplaced: true, ackReason: 'classify-refusal' },
    };
  }

  // 2 — the ONE model call. Never trusted as prose; parsed + validated to signals.
  let result: GeminiResult;
  try {
    result = await client.fn({ system: GUIDE_SYSTEM, user: buildGuideUserPrompt(beat, text) });
  } catch {
    result = { ok: false, text: '', error: 'engine-exception' };
  }

  if (!result.ok || !result.text) {
    // Model error → degrade to a canned neutral ack + deterministic routing from prior state.
    return {
      status: 'model-error',
      category: 'model-error',
      ack: NEUTRAL_ACK,
      plan: planFrom(priorState),
      route: null,
      state: priorState,
      meta: { ...baseMeta, modelCalled: true, ackReplaced: true, ackReason: 'model-error' },
    };
  }

  // 3 — parse + validate the extraction (unknown enums dropped/coerced; never throws).
  const extraction = parseExtraction(result.text);

  // 3b — sanitize the ONLY prose field.
  const { ack, replaced, reason } = sanitizeAck(extraction.ack);

  // 4 — accumulate signals into state, then route on the ACCUMULATED conversation.
  const state = accumulate(priorState, extraction);
  const plan = routePlan(stateToExtraction(state, ''), corpus);

  // A crisis red flag extracted by the model still short-circuits to the crisis route.
  const crisisFlag = state.redFlags.includes('crisis');
  return {
    status: crisisFlag ? 'crisis' : 'routed',
    category: crisisFlag ? 'crisis' : 'routed',
    ack: crisisFlag ? ROUTES.urgent.label : ack,
    plan,
    route: crisisFlag ? ROUTES.urgent : null,
    state,
    meta: { ...baseMeta, modelCalled: true, ackReplaced: crisisFlag ? true : replaced, ackReason: crisisFlag ? 'crisis' : reason },
  };
}

// Re-export so callers/tests import one place.
export { CHRONICITY };
