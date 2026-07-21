/**
 * Lens-demand logging (CHK-7.3b) — the ONE fail-open write that turns Lens usage into a signal for the
 * HUMAN grading backlog. It records, in AGGREGATE, which NAMED products/ingredients readers research so
 * the owner can decide what to grade next. It writes to the SEPARATE, firewalled backlog store
 * (lens_demand, supabase/migrations/0003) — it can never set, influence, or gate a grade.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════════════════════
 * PRIVACY (legal hard gate — must match /privacy exactly). We log ONLY a normalized product/ingredient
 * NAME + a bumped counter. We REFUSE to log, in four cases:
 *   1. kind === 'question'  → the LensInput.normalized for a question is RAW TRUNCATED USER TEXT (see
 *      src/lib/lens/input.ts). Logging it would store a free-text search. NEVER. Skip.
 *   2. status 'refused'     → an off-topic/crisis/dosing/diagnosis run. Not a research subject. Skip.
 *   3. status 'short-circuit' → the input named a corpus remedy that already has a human grade; no
 *      research happened and the demand is already covered by a graded page. Skip.
 *   4. empty subject        → nothing to count. Skip.
 * Only 'assessed' / 'inconclusive' runs whose subject is an ingredient/product NAME (or a matched panel
 * ingredient name) are logged. We never store the raw input, never an IP, never a per-query row — the
 * subject is the primary key, so a repeat run bumps one counter (see lens_demand_bump).
 * ═══════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * FIREWALL: nothing in the grading/corpus/tier/scorecard path imports this module, and this module
 * never reads or writes a grade — it only bumps an aggregate counter in a table with no FK into any
 * corpus/grade table.
 *
 * FAIL-OPEN: env-gated (no Supabase → null client → no-op) and wrapped so it NEVER throws and NEVER
 * alters the Lens response. The Lens route awaits it purely for backlog signal; a failure is swallowed.
 */
import type { LensAssessment } from './engine.ts';
import { getSupabaseAdmin } from '../supabase.ts';

/** Cap on a stored subject name — a normalized ingredient/product name is short; this bounds abuse. */
const MAX_SUBJECT_LEN = 200;
/** A NAME fits on one line. If a 'product' input is multi-line (a pasted supplement-facts panel), its
 * `normalized` is raw panel text, not a name — we DO NOT store it. Only a matched panel ingredient
 * NAME (a corpus name) is logged from a panel; the raw text never is. */
const NAME_CHAR_CEIL = 80;

/** The minimal write surface we need — an injectable seam so the offline test can pass a mock/throwing
 * client without a network or a real Supabase. `null` means "not configured": skip silently. */
export interface DemandClient {
  rpc(fn: string, args: Record<string, unknown>): Promise<{ error: unknown }>;
}

/**
 * Derive the single subject NAME to count for this assessment, or null when nothing should be logged.
 * PURE and privacy-safe by construction:
 *   • question / refused / short-circuit → null (never logged).
 *   • ingredient / product → the normalized input NAME (for 'ingredient'/'product' kinds only — the
 *     'question' kind's normalized is raw user text, which we deliberately never reach here).
 *   • when the input carried matched panel ingredient NAMES, prefer those (they are corpus names, not
 *     free text). Only the FIRST is counted (one subject per run; no per-query fan-out).
 */
export function deriveDemandSubject(assessment: LensAssessment): string | null {
  // Refuse the whole class of non-research runs up front.
  if (assessment.status === 'refused' || assessment.status === 'short-circuit') return null;

  const kind = assessment.input?.kind;

  // A 'question' is free text — NEVER log anything from it, not even a matched ingredient name. Gate it
  // out BEFORE any panel-name extraction so the "we don't log question runs" promise is unconditional
  // (the privacy clause's ingredient-name carve-out is for pasted product labels only, not questions).
  if (kind === 'question') return null;

  // A matched panel ingredient name is a clean corpus NAME — safe to log, and preferred over the raw
  // normalized text. (panelLines live on the engine input in some builds; guard defensively.)
  const panelName = firstPanelName(assessment);
  if (panelName) return clampSubject(panelName);

  // Only 'ingredient' / 'product' kinds carry a NAME in `normalized`. The 'question' kind's normalized
  // is raw truncated user text — NEVER log it. For 'product' we additionally require the normalized to
  // READ LIKE A NAME (single line, short): a pasted supplement-facts panel classifies as 'product' but
  // its normalized is raw multi-line label text, which we refuse to store as a subject (only a matched
  // panel ingredient name — handled above — is logged from a panel).
  if (kind === 'ingredient' || kind === 'product') {
    const normalized = assessment.input?.normalized ?? '';
    if (!looksLikeName(normalized)) return null;
    return clampSubject(normalized);
  }

  return null;
}

/** A subject NAME is one non-empty line under the name ceiling. Rejects pasted panels / paragraphs. */
function looksLikeName(raw: string): boolean {
  const s = String(raw ?? '').trim();
  if (!s || s.length > NAME_CHAR_CEIL) return false;
  if (/[\r\n]/.test(s)) return false;
  return true;
}

/** Pull a matched panel ingredient name if the assessment carried one, else null. Defensive: the
 * shape may not include panelLines in every build, so read it optionally and validate. */
function firstPanelName(assessment: LensAssessment): string | null {
  const lines = (assessment as unknown as { input?: { panelLines?: Array<{ name?: unknown; slug?: unknown }> } })
    .input?.panelLines;
  if (!Array.isArray(lines)) return null;
  for (const line of lines) {
    // Prefer a line that matched a corpus slug (a known ingredient), else any named line.
    if (line && typeof line.name === 'string' && line.name.trim()) return line.name;
  }
  return null;
}

/** Lowercase + trim + collapse whitespace + cap. Returns '' (→ skipped) when empty. Never throws. */
function clampSubject(raw: string): string {
  return String(raw ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SUBJECT_LEN)
    .trim();
}

/**
 * Log aggregate research demand for one assessment. FAIL-OPEN + privacy-safe:
 *   • derives a subject only for assessed/inconclusive ingredient/product runs (or matched panel names);
 *   • question / refused / short-circuit / empty → logs NOTHING;
 *   • env-gated (null client → no-op);
 *   • wrapped so it NEVER throws and NEVER alters the Lens response.
 *
 * @param assessment the LensAssessment just produced by runLens.
 * @param client     injectable for tests; defaults to the service-role Supabase admin (or null).
 */
export async function logLensDemand(
  assessment: LensAssessment,
  client: DemandClient | null = getSupabaseAdmin() as unknown as DemandClient | null,
): Promise<void> {
  try {
    if (!client) return; // unconfigured deploy → silent no-op
    const subject = deriveDemandSubject(assessment);
    if (!subject) return; // question / refused / short-circuit / empty → log nothing

    await client.rpc('lens_demand_bump', { p_subject: subject });
  } catch {
    // FAIL-OPEN: a logging failure must never surface to the caller or change the Lens answer.
  }
}
