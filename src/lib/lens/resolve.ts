/**
 * Lens query understanding / subject resolution (CHK-7.4) — the FRONT of the pipeline.
 *
 * THE FIX this module exists for: the Lens's job is to research the long tail of sleep products the
 * corpus doesn't cover, but the old deterministic keyword topic-fence refused any bare brand/product
 * name it didn't recognise ("Restavit" → doxylamine, a real OTC sleep antihistamine → refused, 0 model
 * calls), and even past the fence retrieval sent the RAW string to PubMed (which doesn't index brand
 * names) → nothing found. This step interprets the input BEFORE research: it resolves a brand to its
 * active ingredient, decides whether the subject is plausibly a sleep remedy at all, and builds a real
 * PubMed query scoped to sleep. One cheap model call.
 *
 * THE INVARIANT HOLDS. This is a CLASSIFICATION + RESOLUTION step, exactly the kind D5 allows ("the
 * model researches and extracts; the server composes"). It NEVER produces user-facing prose: the only
 * model-derived values that can reach a card are a short subject NAME and a product-CLASS enum, both
 * sanitised here and re-lint-checked in the engine; the display line is composed by copy.ts templates.
 * The relevance verdict only decides "research this, or decline as off-topic" — a jailbroken verdict at
 * worst researches an off-topic term (→ PubMed finds nothing → honest inconclusive); it can never make
 * the Lens emit a grade, a dose, a diagnosis, or an unverified claim. The safety-critical refusals
 * (abuse, crisis, dosing, diagnosis) stay deterministic and run BEFORE this step in the engine.
 *
 * NEVER THROWS. Any model failure / malformed JSON degrades to a PASSTHROUGH resolution (treat the raw
 * input as both subject and query, sleepRelevant=true) so a no-key or down-model deploy behaves like a
 * literal search rather than a crash — research then simply degrades to inconclusive on its own.
 *
 * Written in erasable TS so the offline CI runner imports it directly.
 */

import type { LensModelClient, CallBudget } from './verify.ts';
import { LENS_RESOLVE_PROMPT, buildResolveUserPrompt } from './prompts.ts';

/** How the resolver classifies the subject. Drives copy.ts's display label + the engine's safety
 * routing (drugs route harder to a clinician). 'unknown' is the safe default. */
export type LensProductClass =
  | 'supplement'
  | 'herb'
  | 'amino-acid'
  | 'hormone'
  | 'otc-drug'
  | 'prescription-drug'
  | 'food'
  | 'other'
  | 'unknown';

const PRODUCT_CLASSES: ReadonlySet<string> = new Set<LensProductClass>([
  'supplement',
  'herb',
  'amino-acid',
  'hormone',
  'otc-drug',
  'prescription-drug',
  'food',
  'other',
  'unknown',
]);

export interface ResolvedSubject {
  /** True iff the subject is plausibly a sleep supplement/ingredient/product/aid. false ⇒ engine
   * refuses as off-topic. On model failure this defaults TRUE (passthrough — never over-refuse). */
  sleepRelevant: boolean;
  /** The user's own input, bounded — the "you asked" side of the interpreted-as line. */
  subject: string;
  /** The resolved canonical / active-ingredient name (sanitised). '' when the model gives none or the
   * subject already IS the generic name. Model-derived → the engine still lint-checks it before display. */
  resolvedName: string;
  /** Synonyms / active ingredients (sanitised, capped). Informational; not displayed as prose. */
  aka: string[];
  productClass: LensProductClass;
  /** The sanitised PubMed query the retrieval step runs. Falls back to the subject when the model
   * returns nothing usable. */
  pubmedQuery: string;
}

/** Bounds (defense against a pathological model reply). */
const MAX_NAME_CHARS = 80;
const MAX_QUERY_CHARS = 240;
const MAX_AKA = 5;

/** Sanitise a short entity NAME: keep letters/digits/spaces and the punctuation real ingredient names
 * use (parens, hyphen, comma, apostrophe, period, slash, plus, ampersand). Collapse whitespace, cap
 * length. This strips newlines/markup/control chars so a name can never smuggle prose or an injection. */
export function sanitizeName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[^A-Za-z0-9 ()\-,'./+&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_CHARS)
    .trim();
}

/** Sanitise a PubMed query string: allow names plus the boolean/field syntax esearch understands
 * (parens, quotes, brackets, colon), single-line, capped. Never throws. */
export function sanitizeQuery(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[^A-Za-z0-9 ()\[\]":\-,'./+&*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_CHARS)
    .trim();
}

function coerceProductClass(raw: unknown): LensProductClass {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  return (PRODUCT_CLASSES.has(s) ? s : 'unknown') as LensProductClass;
}

/**
 * Parse ONE resolution reply into a ResolvedSubject. Tolerant of code-fence/prose wrapping (extract the
 * first {...}); ANY failure → a passthrough resolution over `subject`. Never throws.
 */
export function parseResolution(raw: string, subject: string): ResolvedSubject {
  const boundedSubject = typeof subject === 'string' ? subject.slice(0, 4000).trim() : '';
  const passthrough: ResolvedSubject = {
    sleepRelevant: true,
    subject: boundedSubject,
    resolvedName: '',
    aka: [],
    productClass: 'unknown',
    pubmedQuery: sanitizeQuery(boundedSubject) || boundedSubject,
  };

  const text = typeof raw === 'string' ? raw : '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return passthrough;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return passthrough;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return passthrough;
  const rec = parsed as Record<string, unknown>;

  // sleepRelevant: only an EXPLICIT boolean false refuses. Anything else → true (never over-refuse on a
  // malformed field — the honest failure mode is "research it and find nothing", not "wrongly decline").
  const sleepRelevant = rec.sleepRelevant === false ? false : true;

  const resolvedName = sanitizeName(rec.resolvedName);
  const akaRaw = Array.isArray(rec.aka) ? rec.aka : [];
  const aka: string[] = [];
  for (const a of akaRaw) {
    const n = sanitizeName(a);
    if (n && !aka.includes(n)) aka.push(n);
    if (aka.length >= MAX_AKA) break;
  }
  const productClass = coerceProductClass(rec.productClass);

  // The query: prefer the model's, sanitised; fall back to the resolved name, then the subject. Never
  // empty (an empty term would make esearch return everything).
  const modelQuery = sanitizeQuery(rec.pubmedQuery);
  const pubmedQuery = modelQuery || sanitizeQuery(resolvedName) || sanitizeQuery(boundedSubject) || boundedSubject;

  return { sleepRelevant, subject: boundedSubject, resolvedName, aka, productClass, pubmedQuery };
}

export interface ResolveArgs {
  subject: string;
  model: LensModelClient;
  budget: CallBudget;
  /** Absolute ms deadline; if already passed we skip the call and passthrough. */
  deadline: number;
  now: () => number;
}

/**
 * Resolve one Lens subject with a single model call. Respects the shared budget + deadline: if either
 * is exhausted we skip the call and passthrough (research the raw subject). NEVER throws.
 */
export async function resolveSubject(args: ResolveArgs): Promise<ResolvedSubject> {
  const subject = typeof args.subject === 'string' ? args.subject.slice(0, 4000).trim() : '';
  const { model, budget, deadline, now } = args;

  // No budget or no time left → passthrough (behaves like a literal search; never a crash).
  if (!model || budget.used >= budget.max || deadline - now() <= 0) {
    return parseResolution('', subject);
  }

  budget.used += 1;
  const res = await model({
    system: LENS_RESOLVE_PROMPT,
    user: buildResolveUserPrompt(subject),
    temperature: 0.1,
    timeoutMs: Math.max(1, deadline - now()),
  });
  return parseResolution(res && res.ok ? res.text : '', subject);
}
