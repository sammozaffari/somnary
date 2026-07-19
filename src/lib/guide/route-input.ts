/**
 * Guide route input validation (CHK-6.8b) — the defensive boundary between the untrusted HTTP client
 * and the deterministic engine. `src/pages/api/guide.ts` is a thin shell; ALL of its
 * "never trust the client" logic lives here as pure, testable functions so the offline suite
 * (scripts/test-guide.mjs) can drive them without a live server.
 *
 * Two jobs:
 *   1. validateBeat / validateText — the beat must be one of the four fixed intake beats; the text is
 *      trimmed and length-capped exactly like /api/ask (MAX_GUIDE_TEXT).
 *   2. coercePriorState — the client posts back the engine's `state` (a GuideState) between beats. A
 *      hostile client MUST NOT be able to inject arbitrary state (e.g. a fake `redFlags` value, an
 *      unknown problem, an over-long triedRemedies list, or a smuggled prose field). We do NOT spread
 *      the client object into the engine. Instead we route every field through the ALREADY-MERGED,
 *      never-throwing schema coercer (validateExtraction from schema.ts): unknown enum members are
 *      dropped, scalars fall back to `unknown`, arrays are capped, `redFlags` is `none`-normalized, and
 *      any extra keys are ignored. The result is mapped to a clean GuideState. If the input is not a
 *      plain object it degrades to emptyState() (first-beat), never a throw.
 *
 * This file does NOT modify the engine/schema/router (CHK-6.8a, merged) — it only composes them.
 * Erasable TS so the Node test runner can import it directly, like the rest of src/lib/guide/*.
 */
import { validateExtraction } from './schema.ts';
import { emptyState, type GuideState } from './engine.ts';

/** The four fixed intake beats (see docs/plans/2026-07-17-guide-concierge-accounts-design.md). The
 * engine uses `beat` only as prompt context, but the route is the trust boundary: an unknown beat is
 * a malformed/hostile request and is rejected with 400 rather than silently passed to the model. */
export const GUIDE_BEATS = ['situation', 'history', 'habits', 'reading-map'] as const;
export type GuideBeat = (typeof GUIDE_BEATS)[number];

/** Same cap as /api/ask MAX_QUESTION — one intake message is short; anything longer is abuse/padding. */
export const MAX_GUIDE_TEXT = 500;
/** Below this the message carries no signal (mirrors /api/ask empty-question guard). */
export const MIN_GUIDE_TEXT = 1;

export function isGuideBeat(value: unknown): value is GuideBeat {
  return typeof value === 'string' && (GUIDE_BEATS as readonly string[]).includes(value);
}

export type TextCheck =
  | { ok: true; text: string }
  | { ok: false; error: 'empty-text' | 'text-too-long' };

/** Trim + validate a raw text field. Returns the capped string or a typed error the route maps to a
 * status code (empty → 400, too-long → 413), exactly like /api/ask. */
export function validateText(raw: unknown): TextCheck {
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (text.length < MIN_GUIDE_TEXT) return { ok: false, error: 'empty-text' };
  if (text.length > MAX_GUIDE_TEXT) return { ok: false, error: 'text-too-long' };
  return { ok: true, text };
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/**
 * Coerce an untrusted client `priorState` into a clean GuideState.
 *
 * The client sends back the engine's `state` (GuideState field names). We reshape those fields into
 * the GuideExtraction the merged validator understands and let validateExtraction() do ALL the
 * sanitizing (enum allow-listing, scalar fallbacks, array caps, redFlags normalization, extra-key
 * drop — it never throws). The validated extraction is then mapped back to GuideState. A missing or
 * non-object input yields emptyState() (a fresh first beat). No client-supplied prose survives: the
 * engine's GuideState has no prose field, and `ack`/`notes` are discarded here.
 */
export function coercePriorState(raw: unknown): GuideState {
  if (raw === undefined || raw === null) return emptyState();
  const s = asRecord(raw);
  // Reshape GuideState field names → the GuideExtraction shape validateExtraction() expects. Anything
  // that is not a recognized enum/shape is dropped by the validator; we never spread `s` anywhere.
  const ext = validateExtraction({
    situation: {
      problems: s.problems,
      chronicity: s.chronicity,
      ageBand: s.ageBand,
      redFlags: s.redFlags,
    },
    history: { triedRemedies: s.triedRemedies, notes: '' },
    habits: { signals: s.habitSignals },
  });
  return {
    problems: ext.situation.problems,
    chronicity: ext.situation.chronicity,
    ageBand: ext.situation.ageBand,
    redFlags: ext.situation.redFlags,
    triedRemedies: ext.history.triedRemedies,
    habitSignals: ext.habits.signals,
  };
}
