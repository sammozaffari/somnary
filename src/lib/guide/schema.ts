/**
 * Guide extraction schema (CHK-6.8a) — the ONLY output surface the model has.
 *
 * THE INVARIANT: the model may emit exactly two things — a set of extracted SIGNALS drawn from
 * fixed enums, and one short free-text `ack` acknowledgment. It has NO channel to name a remedy as
 * a recommendation, a dose, a diagnosis, or a URL. The SERVER (src/lib/guide/router.ts) maps the
 * validated signals to real, existing corpus URLs. Everything in this file exists to make the
 * extraction TRUSTWORTHY: unknown enum values are coerced to `unknown`/dropped, `ack` is length-
 * capped, extra keys are ignored, and the validator NEVER throws — a malformed model reply degrades
 * to an empty-but-valid GuideExtraction, never a crash and never a smuggled instruction.
 *
 * Written in erasable TS (types + plain functions) so Node's type-stripping can import it directly
 * in the CI runner (scripts/test-guide.mjs), exactly like the ask corpus/guardrails modules.
 */

// --- fixed enums (the model's entire vocabulary) ------------------------------------------------

/** The sleep problems the concierge can route on → outcome pages / anxiety hub (see router.ts). */
export const PROBLEMS = [
  'onset', // trouble falling asleep
  'maintenance', // waking through the night
  'early-waking', // waking too early and unable to return
  'shift-jetlag', // body clock out of sync (shift work / travel)
  'anxious-mind', // a racing, anxious mind at night
] as const;
export type Problem = (typeof PROBLEMS)[number];

export const CHRONICITY = ['occasional', 'frequent', 'chronic', 'unknown'] as const;
export type Chronicity = (typeof CHRONICITY)[number];

export const AGE_BAND = ['adult', 'older-adult', 'child', 'unknown'] as const;
export type AgeBand = (typeof AGE_BAND)[number];

/** Screeners that change routing. Any of the non-`none` flags suppresses/caveats remedy leads and
 * routes to a boundary page first (see router.ts). `crisis` short-circuits everything. */
export const RED_FLAGS = [
  'pregnancy',
  'breastfeeding',
  'child',
  'prescription-med',
  'diagnosed-condition',
  'crisis',
  'none',
] as const;
export type RedFlag = (typeof RED_FLAGS)[number];

/** Habit signals → /sleep-habits#<anchor> checklist items (frozen map in router.ts). */
export const HABIT_SIGNALS = [
  'late-caffeine',
  'alcohol-nightcap',
  'evening-screens',
  'irregular-schedule',
  'daytime-naps',
  'poor-environment',
  'late-exercise',
] as const;
export type HabitSignal = (typeof HABIT_SIGNALS)[number];

// --- the extraction shape -----------------------------------------------------------------------

export interface GuideSituation {
  problems: Problem[];
  chronicity: Chronicity;
  ageBand: AgeBand;
  redFlags: RedFlag[];
}

export interface GuideHistory {
  /** User-echoed remedy names — resolved by the SERVER via detectRemedyMentions to a real /r/<slug>
   * or silently dropped. Never a model channel to invent a remedy: unresolved strings route nowhere. */
  triedRemedies: string[];
  notes: string;
}

export interface GuideHabits {
  signals: HabitSignal[];
}

export interface GuideExtraction {
  ack: string;
  situation: GuideSituation;
  history: GuideHistory;
  habits: GuideHabits;
}

// --- caps -----------------------------------------------------------------------------------------

export const ACK_MAX_LEN = 200;
export const NOTES_MAX_LEN = 400;
export const TRIED_MAX_ITEMS = 12;
export const TRIED_ITEM_MAX_LEN = 60;

/** Canned, model-free acknowledgment substituted whenever the model's `ack` is unusable (forbidden
 * framing, smuggled identifier/citation, or non-string). Neutral, never validating, never advising. */
export const NEUTRAL_ACK = 'Thanks — noted. Here is where to read on Somnary.';

// --- strict validator / coercer (NEVER throws) --------------------------------------------------

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/** Keep only enum members present in the input array; dedupe; drop everything else. Order-preserving. */
function coerceEnumArray<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(value)) return [];
  const set = new Set(allowed);
  const out: T[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== 'string') continue;
    if (set.has(item as T) && !seen.has(item)) {
      seen.add(item);
      out.push(item as T);
    }
    // unknown enum value → dropped (never coerced into a signal it isn't)
  }
  return out;
}

/** A single enum scalar; unknown/missing → the provided fallback (always the enum's `unknown` member). */
function coerceEnumScalar<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function coerceString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLen);
}

/** triedRemedies: array of short strings; non-strings dropped, each trimmed+capped, list capped. */
function coerceTried(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') continue;
    const s = item.trim().slice(0, TRIED_ITEM_MAX_LEN);
    if (s) out.push(s);
    if (out.length >= TRIED_MAX_ITEMS) break;
  }
  return out;
}

/**
 * Coerce ANY parsed value into a valid GuideExtraction. Unknown enum values → dropped/`unknown`;
 * extra keys ignored; `ack`/`notes` length-capped; missing fields → safe empties. Never throws.
 *
 * `redFlags` is normalized so `none` never co-exists with a real flag (a real flag wins); an empty
 * result is left empty (the router treats empty and `[none]` identically).
 */
export function validateExtraction(parsed: unknown): GuideExtraction {
  const root = asRecord(parsed);
  const situation = asRecord(root.situation);
  const history = asRecord(root.history);
  const habits = asRecord(root.habits);

  let redFlags = coerceEnumArray(situation.redFlags, RED_FLAGS);
  if (redFlags.length > 1) redFlags = redFlags.filter((f) => f !== 'none');

  return {
    ack: coerceString(root.ack, ACK_MAX_LEN),
    situation: {
      problems: coerceEnumArray(situation.problems, PROBLEMS),
      chronicity: coerceEnumScalar(situation.chronicity, CHRONICITY, 'unknown'),
      ageBand: coerceEnumScalar(situation.ageBand, AGE_BAND, 'unknown'),
      redFlags,
    },
    history: {
      triedRemedies: coerceTried(history.triedRemedies),
      notes: coerceString(history.notes, NOTES_MAX_LEN),
    },
    habits: {
      signals: coerceEnumArray(habits.signals, HABIT_SIGNALS),
    },
  };
}

/**
 * Parse a raw model reply (expected JSON) into a validated GuideExtraction. Tolerant of code-fence
 * wrapping and leading/trailing prose: extracts the first {...} block. On ANY parse failure returns
 * a valid empty extraction — the model can never crash the engine, and unparsable output routes
 * deterministically from prior state instead.
 */
export function parseExtraction(raw: string): GuideExtraction {
  const text = typeof raw === 'string' ? raw : '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return validateExtraction(null);
  try {
    return validateExtraction(JSON.parse(text.slice(start, end + 1)));
  } catch {
    return validateExtraction(null);
  }
}
