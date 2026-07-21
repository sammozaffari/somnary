/**
 * Lens deterministic rubric (CHK-7.1c) — Somnary's METHOD applied in CODE, never model judgment.
 *
 * The D5 invariant: the model researches and extracts; the SERVER applies the rubric deterministically.
 * This module is that deterministic application. Given a pasted panel it runs:
 *
 *   1. The label checker's R1–R5 rules VERBATIM (import checkLabel — the SAME engine the /label-checker
 *      island and the label-index run; no rule is re-implemented, so a rule change lands in ONE place).
 *   2. The DETERMINISTIC additive-watchlist match: does the panel NAME a flagged additive? If so,
 *      surface a neutral finding with the additive's cited sources. Whole-token name matching over the
 *      SAME norm() the label checker uses. The proprietary-blend `structural` entry is skipped here —
 *      that transparency defect is already covered by R1, so surfacing it twice would double-count.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: no score, no composite, no severity sum, no ranking, no tier, no
 * grade. The Source Scorecard's numeric rubric is itself a not-in-force human gate (per the build
 * spec) — the Lens surfaces the SAME cited observations the human rubric is built on, but computes no
 * verdict number. The engine composes the card's prose from these findings + the verified claims.
 *
 * PURE and NEVER THROWS. Erasable TS so the offline CI runner imports it directly.
 */

import { checkLabel, type Flag, type LabelEntry, norm } from '../label-rules.ts';
import type { LensInput } from './input.ts';
import type { CitationId } from './citations.ts';
import type { AdditiveEntry } from './additive-watchlist.ts';

/** One additive surfaced from the pasted panel — the matched flagged additive + its cited sources. */
export interface AdditiveFinding {
  id: string;
  /** The additive name (verbatim from the watchlist) that matched a line in the panel. */
  matchedName: string;
  severity: AdditiveEntry['severity'];
  /** The raw citation ids from the watchlist; the engine re-validates each through citations.ts. */
  sources: CitationId[];
}

export interface RubricResult {
  labelFlags: Flag[];
  additiveFindings: AdditiveFinding[];
}

export interface ApplyRubricArgs {
  /** The pasted panel text (the raw subject). Empty/non-panel input yields no flags — safe. */
  panelText: string;
  /** The normalized Lens input (unused for logic today, threaded for future rule inputs). */
  normalized?: LensInput | null;
  /** Label-index entries (the corpus projection). [] disables R1–R5. */
  labelEntries: LabelEntry[];
  /** The flagged additive watchlist. [] disables additive findings. */
  additiveWatchlist: AdditiveEntry[];
}

/** Whole-token presence of `term` in the space-padded normalized panel — mirrors the label checker's
 * wordInText so "azo dye" ⊄ "azodyestuff" and a 1–2 char token never matches. */
function panelNames(normPanel: string, term: string): boolean {
  const t = norm(term).trim();
  if (t.replace(/\s+/g, '').length < 3) return false;
  return ` ${normPanel} `.includes(` ${t} `);
}

/**
 * Apply the deterministic rubric to a pasted panel. Returns the R1–R5 flags (verbatim from
 * checkLabel) plus any flagged additives NAMED in the panel. Pure; never throws.
 */
export function applyRubric(args: ApplyRubricArgs): RubricResult {
  const panelText = typeof args?.panelText === 'string' ? args.panelText : '';
  const labelEntries = Array.isArray(args?.labelEntries) ? args.labelEntries : [];
  const watchlist = Array.isArray(args?.additiveWatchlist) ? args.additiveWatchlist : [];

  // R1–R5 verbatim from the shared engine. checkLabel is pure and returns [] on empty/whitespace.
  let labelFlags: Flag[] = [];
  try {
    labelFlags = checkLabel(panelText, labelEntries);
  } catch {
    labelFlags = [];
  }

  // Deterministic additive matching: which flagged (non-structural) additives does the panel NAME?
  const additiveFindings: AdditiveFinding[] = [];
  if (panelText.trim() && watchlist.length) {
    const normPanel = norm(panelText);
    for (const entry of watchlist) {
      if (entry.structural) continue; // proprietary-blend defect is already R1 — never double-count
      const matchedName = entry.names.find((n) => panelNames(normPanel, n));
      if (matchedName) {
        additiveFindings.push({
          id: entry.id,
          matchedName,
          severity: entry.severity,
          sources: entry.sources ?? [],
        });
      }
    }
  }

  return { labelFlags, additiveFindings };
}
