/**
 * Accounts save-input validation (CHK-6.9b) — the defensive boundary between the untrusted HTTP
 * client and the saved_maps table. `src/pages/api/save-map.ts` is a thin shell; ALL of its
 * "never trust the client" logic lives here as pure, testable functions so the offline suite
 * (scripts/test-accounts.mjs) can drive them without a live server or a real database.
 *
 * THE FIREWALL, ENFORCED HERE:
 *   1. guide_state — routed THROUGH the guide schema validator (coercePriorState → validateExtraction).
 *      Only fixed-enum signals survive; any smuggled prose / transcript / notes / ack / unknown enum
 *      / over-long list / injected key is dropped. There is no code path by which client prose is
 *      persisted. This is the same coercer /api/guide uses on priorState.
 *   2. route_plan — the client sends back what the SERVER produced, but we do not trust it. Every
 *      href must be an internal, `/`-rooted path (no `//host`, no `/\host`, no absolute/`javascript:`
 *      URL). An external href REJECTS the whole payload. Section/item shape is re-derived from a
 *      strict allow-list; extra keys and prose beyond {href,label,note} are dropped.
 *   3. habits_checklist — coerced to a FLAT {string: boolean} map, key-count and key-length capped.
 *
 * Erasable TS (types + plain functions) so Node's type-stripping can import it directly in the CI
 * runner, exactly like src/lib/guide/route-input.ts. This file composes the guide validators; it does
 * NOT modify them.
 */
import { coercePriorState } from '../guide/route-input.ts';
import type { GuideState } from '../guide/engine.ts';
import type { RoutePlan, RouteItem, RouteSection, SummaryFragment } from '../guide/router.ts';

// --- caps (a saved map is small; anything larger is abuse/padding) ------------------------------
export const MAX_SECTIONS = 12;
export const MAX_ITEMS_PER_SECTION = 24;
export const MAX_HREF_LEN = 256;
export const MAX_LABEL_LEN = 200;
export const MAX_NOTE_LEN = 500;
export const MAX_CHECKLIST_KEYS = 64;
export const MAX_CHECKLIST_KEY_LEN = 64;
export const MAX_SUMMARY_FRAGMENTS = 24;
export const MAX_FRAGMENT_TEXT_LEN = 600;
/** Reject a raw body larger than this many bytes BEFORE parsing shape (defence against padding). */
export const MAX_BODY_BYTES = 64 * 1024;

const SECTION_KINDS = [
  'crisis',
  'boundary',
  'clinician-first',
  'tried',
  'outcomes',
  'habits',
  'fallback',
] as const;
type SectionKind = (typeof SECTION_KINDS)[number];

const SUMMARY_TONES = ['crisis', 'boundary', 'normal'] as const;
type SummaryTone = (typeof SUMMARY_TONES)[number];

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function cappedString(v: unknown, maxLen: number): string {
  return typeof v === 'string' ? v.slice(0, maxLen) : '';
}

/**
 * Is this an internal, same-origin, `/`-rooted path? Mirrors the open-redirect guard in
 * auth/callback.ts: a single leading slash, but NOT `//host` (protocol-relative) or `/\host`
 * (backslash trick). Absolute (`https://`, `http://`) and `javascript:` URLs fail because they do
 * not start with `/`. An empty/non-string href fails. This is the ONLY href shape we persist.
 */
export function isInternalHref(href: unknown): href is string {
  if (typeof href !== 'string' || href.length === 0 || href.length > MAX_HREF_LEN) return false;
  if (!href.startsWith('/')) return false;
  if (href.startsWith('//') || href.startsWith('/\\')) return false;
  return true;
}

export type RoutePlanCheck =
  | { ok: true; plan: RoutePlan }
  | { ok: false; error: 'invalid-route-plan' | 'external-href' };

/**
 * Re-derive a clean RoutePlan from untrusted input. Shape is rebuilt from an allow-list (never
 * spread), every href is internal-only (an external href REJECTS the whole payload — we do not want
 * a stored map that quietly links off-site), and prose fields are capped. `stop` is coerced to bool.
 * A structurally-broken plan (no sections array, or a section with no items) → invalid-route-plan.
 */
export function validateRoutePlan(raw: unknown): RoutePlanCheck {
  const root = asRecord(raw);
  if (!Array.isArray(root.sections)) return { ok: false, error: 'invalid-route-plan' };
  if (root.sections.length > MAX_SECTIONS) return { ok: false, error: 'invalid-route-plan' };

  const sections: RouteSection[] = [];
  for (const rawSection of root.sections) {
    const s = asRecord(rawSection);
    const kind = SECTION_KINDS.includes(s.kind as SectionKind) ? (s.kind as SectionKind) : 'fallback';
    if (!Array.isArray(s.items) || s.items.length === 0) return { ok: false, error: 'invalid-route-plan' };
    if (s.items.length > MAX_ITEMS_PER_SECTION) return { ok: false, error: 'invalid-route-plan' };

    const items: RouteItem[] = [];
    for (const rawItem of s.items) {
      const it = asRecord(rawItem);
      // An external / malformed href rejects the ENTIRE payload — a stored map must never carry one.
      if (!isInternalHref(it.href)) return { ok: false, error: 'external-href' };
      const item: RouteItem = {
        href: it.href,
        label: cappedString(it.label, MAX_LABEL_LEN),
      };
      const note = cappedString(it.note, MAX_NOTE_LEN);
      if (note) item.note = note;
      items.push(item);
    }
    sections.push({ kind, title: cappedString(s.title, MAX_LABEL_LEN), items });
  }

  // The woven narrative summary (CHK-6.8c). Rebuilt from an allow-list the same way as sections:
  // capped text, tone validated against the enum (default 'normal'), and every link internal-only
  // (an external href rejects the whole payload). A missing/non-array summary → []. Not required, so a
  // structurally-odd summary is dropped to [] rather than failing the save (unlike a broken section).
  const summary: SummaryFragment[] = [];
  if (Array.isArray(root.summary)) {
    for (const rawFrag of root.summary.slice(0, MAX_SUMMARY_FRAGMENTS)) {
      const f = asRecord(rawFrag);
      const links: RouteItem[] = [];
      const rawLinks = Array.isArray(f.links) ? f.links.slice(0, MAX_ITEMS_PER_SECTION) : [];
      for (const rawLink of rawLinks) {
        const l = asRecord(rawLink);
        if (!isInternalHref(l.href)) return { ok: false, error: 'external-href' };
        links.push({ href: l.href, label: cappedString(l.label, MAX_LABEL_LEN) });
      }
      const tone: SummaryTone = SUMMARY_TONES.includes(f.tone as SummaryTone)
        ? (f.tone as SummaryTone)
        : 'normal';
      summary.push({ text: cappedString(f.text, MAX_FRAGMENT_TEXT_LEN), links, tone });
    }
  }

  return { ok: true, plan: { stop: root.stop === true, sections, summary } };
}

/**
 * Coerce untrusted habits tick-state into a FLAT {string: boolean} map. Non-object → {}. Only
 * string→boolean entries survive; non-boolean values are dropped, keys are trimmed+capped, and the
 * map is capped at MAX_CHECKLIST_KEYS. No nesting, no prototype pollution (__proto__ etc. are just
 * plain string keys on a null-prototype object and are never assigned onto Object.prototype).
 */
export function coerceHabitsChecklist(raw: unknown): Record<string, boolean> {
  const out: Record<string, boolean> = Object.create(null);
  const src = asRecord(raw);
  let count = 0;
  for (const [k, v] of Object.entries(src)) {
    if (typeof v !== 'boolean') continue;
    const key = k.trim().slice(0, MAX_CHECKLIST_KEY_LEN);
    if (!key) continue;
    out[key] = v;
    count++;
    if (count >= MAX_CHECKLIST_KEYS) break;
  }
  // Return a plain object (JSON-serializable) — copy off the null-proto accumulator.
  return { ...out };
}

// --- the composed validator ---------------------------------------------------------------------

export interface SavePayload {
  guide_state: GuideState;
  route_plan: RoutePlan;
  habits_checklist: Record<string, boolean>;
}

export type SaveCheck =
  | { ok: true; payload: SavePayload }
  | { ok: false; error: 'invalid-json' | 'payload-too-large' | 'invalid-route-plan' | 'external-href' };

/**
 * Validate a full save body. `guide_state` is coerced through the guide schema (prose/transcript
 * stripped), `route_plan` re-derived internal-only, `habits_checklist` flattened. Never throws.
 * The route calls this on the parsed body; a rejected route_plan/external href is surfaced as a
 * typed error the route maps to 400. This function assumes the raw-byte size gate already ran (or
 * pass `rawBytes` to enforce it here).
 */
export function validateSaveBody(raw: unknown, rawBytes?: number): SaveCheck {
  if (typeof rawBytes === 'number' && rawBytes > MAX_BODY_BYTES) {
    return { ok: false, error: 'payload-too-large' };
  }
  const body = asRecord(raw);

  // 1 — guide_state through the SAME coercer /api/guide uses. Any smuggled prose/transcript/unknown
  // enum/over-long list is dropped; a non-object degrades to emptyState(). No prose can survive.
  const guide_state = coercePriorState(body.guide_state);

  // 2 — route_plan re-derived internal-only; an external href rejects the whole payload.
  const planCheck = validateRoutePlan(body.route_plan);
  if (!planCheck.ok) return { ok: false, error: planCheck.error };

  // 3 — habits_checklist flattened to {string: boolean}, size-capped.
  const habits_checklist = coerceHabitsChecklist(body.habits_checklist);

  return { ok: true, payload: { guide_state, route_plan: planCheck.plan, habits_checklist } };
}

/**
 * Derive a short, human title for a saved map from its reading map's first item — used by the list
 * endpoint so the UI can label a saved map without shipping the whole plan. Falls back to a generic
 * label. Pure; never throws.
 */
export function deriveMapTitle(plan: unknown): string {
  const root = asRecord(plan);
  const sections = Array.isArray(root.sections) ? root.sections : [];
  for (const rawSection of sections) {
    const s = asRecord(rawSection);
    const items = Array.isArray(s.items) ? s.items : [];
    for (const rawItem of items) {
      const it = asRecord(rawItem);
      const label = typeof it.label === 'string' ? it.label.trim() : '';
      if (label) return label.slice(0, MAX_LABEL_LEN);
    }
  }
  return 'Saved reading map';
}
