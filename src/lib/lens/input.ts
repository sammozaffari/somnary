/**
 * Lens input normalization + classification (CHK-7.1a).
 *
 * The engine's first step: take whatever the reader pasted (an ingredient name, a product name, a
 * question, or a whole supplement facts panel) and turn it into a bounded, classified input the
 * later stages can act on — WITHOUT calling any model or network. Pure.
 *
 * THE SHORT-CIRCUIT (D5): if the input resolves to a remedy already in Somnary's graded corpus, we
 * set `shortCircuit` to that remedy's graded page. The engine then runs NO external research — a
 * corpus remedy already has a human-assigned grade and cited page, so the honest answer is "read the
 * graded page", never a fresh, ungraded model synthesis. Detection reuses the SAME detectRemedyMentions
 * + norm as the assistant and search, so "l-theanine" ↔ "l theanine" resolve identically everywhere.
 *
 * For a pasted panel we reuse the label checker's matchIngredients/parseLineAmountMg (one dose parser
 * across the whole app) to extract the ingredient lines — no new parsing logic, no second store.
 *
 * NEVER THROWS. Mirrors the guide schema coercers: hostile/oversized/empty input is coerced to a safe
 * bounded value; empty input is rejected with a valid empty result, never a crash. Written in erasable
 * TS so the offline CI runner (scripts/test-lens.mjs) can import it directly.
 */

// detectRemedyMentions + matchIngredients both normalize internally with the shared `norm`
// (search-rank / label-rules), so "l-theanine" ↔ "l theanine" resolve identically to everywhere else
// in the app — this module never re-implements normalization.
import { detectRemedyMentions, type RemedyRef } from '../ask/guardrails.ts';
import { matchIngredients, parseLineAmountMg, type LabelEntry } from '../label-rules.ts';

/** Upper bound on accepted input length (a pasted panel is long; anything past this is truncated,
 * never rejected — bounded, not brittle). */
export const MAX_LENS_INPUT_LEN = 4000;
/** A panel is "many lines" — used only to bias classification toward `product` for pasted facts. */
const PANEL_LINE_THRESHOLD = 3;

export type LensInputKind = 'ingredient' | 'product' | 'question';

/** Where a corpus-remedy input short-circuits to — the graded page. `href` is always `/r/<slug>`. */
export interface LensShortCircuit {
  slug: string;
  name: string;
  href: string;
}

/** One ingredient line parsed from a pasted supplement facts panel. */
export interface LensPanelLine {
  /** The corpus remedy this line matched (when it matched a known ingredient), else null. */
  slug: string | null;
  name: string;
  doseMg: number | null;
}

export interface LensInput {
  kind: LensInputKind;
  normalized: string;
  /** Set ONLY when the input resolves to a corpus remedy — the engine then researches nothing. */
  shortCircuit?: LensShortCircuit;
  /** Parsed ingredient lines when the input is a pasted panel (empty otherwise). */
  panelLines: LensPanelLine[];
  /** True when the raw input was empty/whitespace after coercion (nothing to research). */
  empty: boolean;
}

/** Coerce any value to a bounded, trimmed string. Never throws. */
function coerceRaw(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.slice(0, MAX_LENS_INPUT_LEN).trim();
}

function countNonEmptyLines(s: string): number {
  return s.split(/\r?\n/).filter((l) => l.trim().length > 0).length;
}

/**
 * Heuristic classification when the input is NOT a corpus remedy. A multi-line pasted panel →
 * `product`; a phrase that reads like a natural-language question (has a question word / mark, or is
 * long) → `question`; otherwise a bare `ingredient` name. This only biases later prompting; every
 * kind still runs the same bounded research (or, for corpus remedies, none).
 */
function classify(normalized: string, rawLineCount: number, panelLineCount: number): LensInputKind {
  if (rawLineCount >= PANEL_LINE_THRESHOLD || panelLineCount >= 2) return 'product';
  const looksLikeQuestion =
    /\?/.test(normalized) ||
    /\b(does|do|is|are|can|should|will|what|why|how|which|when|who|whom|whose|any)\b/.test(normalized) ||
    normalized.split(/\s+/).length > 6;
  return looksLikeQuestion ? 'question' : 'ingredient';
}

/**
 * Normalize + classify a raw Lens input against the corpus. Pure — no model, no network.
 *
 * @param raw            the reader's input (any type; coerced safely)
 * @param corpus         the remedy refs for short-circuit detection (slug/name/aliases)
 * @param labelEntries   the label-index entries for panel ingredient parsing (optional; [] disables it)
 */
export function normalizeLensInput(
  raw: unknown,
  corpus: RemedyRef[] = [],
  labelEntries: LabelEntry[] = [],
): LensInput {
  const original = typeof raw === 'string' ? raw.slice(0, MAX_LENS_INPUT_LEN) : '';
  const normalized = coerceRaw(raw);
  if (!normalized) {
    return { kind: 'question', normalized: '', panelLines: [], empty: true };
  }

  const rawLineCount = countNonEmptyLines(original);

  // Parse panel ingredient lines (label checker's shared matcher/parser). Safe on any text: a short
  // single ingredient name simply yields 0 or 1 matches.
  const matched = labelEntries.length ? matchIngredients(original, labelEntries) : [];
  const panelLines: LensPanelLine[] = matched.map((mt) => ({
    slug: mt.entry.slug,
    name: mt.entry.name,
    doseMg: mt.doseMg,
  }));

  // Short-circuit: does the input NAME a single corpus remedy? Use the same whole-token detector as
  // the assistant. When EXACTLY one remedy is named we short-circuit to its graded page; when the
  // input names several (a panel, a "melatonin vs valerian" question) we do NOT short-circuit —
  // that is a compare/research case, not a single graded page.
  const named = corpus.length ? detectRemedyMentions(normalized, corpus) : [];
  let shortCircuit: LensShortCircuit | undefined;
  if (named.length === 1) {
    const r = named[0];
    shortCircuit = { slug: r.slug, name: r.name, href: `/r/${r.slug}` };
  }

  const kind = classify(normalized, rawLineCount, panelLines.length);

  return { kind, normalized, shortCircuit, panelLines, empty: false };
}

// Re-export the shared parser so the engine has a single import site for panel-dose parsing.
export { parseLineAmountMg };
