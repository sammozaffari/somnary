/**
 * Guide router (CHK-6.8a) — the PURE deterministic map from validated extraction SIGNALS to a
 * route-plan of REAL, EXISTING corpus URLs. This is the heart of the invariant: the model produces
 * only signals (fixed enums) + one ack; the SERVER, here, decides every URL. The model has NO
 * channel to name a remedy as a recommendation, a dose, a diagnosis, or a URL. Every href this
 * module emits is either a hard-coded boundary route (ROUTES), a `/r/<slug>` the corpus actually
 * contains (resolved via detectRemedyMentions), an `/outcome/<id>` from the OUTCOMES taxonomy, an
 * `/anxiety-and-sleep` page, or a `/sleep-habits#<anchor>` from the frozen HABIT map. Nothing is
 * invented; an unresolved signal routes NOWHERE.
 *
 * Framing is fixed here too: remedy leads are "you mentioned X — here's Somnary's graded evidence",
 * never "try X"; CBT-I + clinician routing for chronic/diagnosed cases is matter-of-fact, never
 * preachy. Erasable TS; imported by src/lib/guide/engine.ts and scripts/test-guide.mjs.
 */
import { ROUTES, detectRemedyMentions, type Route, type RemedyRef } from '../ask/guardrails.ts';
import { OUTCOMES } from '../outcomes.ts';
import { HABIT_SUMMARY_BY_ID } from '../habits.ts';
import type { GuideExtraction, HabitSignal, Problem, RedFlag } from './schema.ts';

// --- route-plan shape ---------------------------------------------------------------------------

export interface RouteItem {
  /** An existing site URL — /r/<slug>, /outcome/<id>, /sleep-habits#<anchor>, /anxiety-and-sleep, or a ROUTES href. */
  href: string;
  label: string;
  /** Deterministic, non-model note explaining why this is here (never a recommendation). */
  note?: string;
}

export interface RouteSection {
  kind:
    | 'crisis'
    | 'boundary' // safety / clinician / meds surfaced because of a screener
    | 'clinician-first' // chronic / diagnosed → CBT-I + doctor surfaced prominently
    | 'tried' // user-echoed remedies → their own graded pages
    | 'outcomes' // problem → outcome / anxiety pages
    | 'habits' // habit signals → sleep-habits checklist
    | 'fallback'; // nothing else fired
  title: string;
  items: RouteItem[];
}

export interface RoutePlan {
  /** True when a crisis screener short-circuited routing (no remedy/outcome/habit sections). */
  stop: boolean;
  sections: RouteSection[];
}

// --- frozen signal maps -------------------------------------------------------------------------

/** habit signal → sleep-habits anchor id (the frozen anchor contract). */
const HABIT_ANCHOR: Record<HabitSignal, string> = {
  'late-caffeine': 'caffeine',
  'alcohol-nightcap': 'alcohol',
  'evening-screens': 'light',
  'irregular-schedule': 'schedule',
  'daytime-naps': 'naps',
  'poor-environment': 'environment',
  'late-exercise': 'exercise',
};

/**
 * problem → outcome routes. Each entry is verified against OUTCOMES (src/lib/outcomes.ts) at module
 * load (assertOutcome). `anxious-mind` routes to BOTH the /anxiety-and-sleep hub and the
 * anxiety-driven-insomnia outcome page, per the plan.
 */
interface ProblemTarget {
  outcomeIds: string[]; // → /outcome/<id>, validated to exist
  extra?: Route[]; // non-outcome real pages (e.g. /anxiety-and-sleep)
}

const PROBLEM_ROUTES: Record<Problem, ProblemTarget> = {
  onset: { outcomeIds: ['fall-asleep-faster'] },
  maintenance: { outcomeIds: ['stay-asleep'] },
  'early-waking': { outcomeIds: ['stay-asleep'] },
  'shift-jetlag': { outcomeIds: ['jet-lag-shift-work'] },
  'anxious-mind': {
    outcomeIds: ['anxiety-driven-insomnia'],
    extra: [{ href: '/anxiety-and-sleep', label: 'Anxiety & sleep' }],
  },
};

// Fail-fast at load if a mapped outcome id ever drifts from the taxonomy — the invariant is that
// every routed URL exists, so an invalid id must break the build/test, never ship.
const OUTCOME_IDS = new Set(OUTCOMES.map((o) => o.id));
function outcomeRoute(id: string): Route {
  const o = OUTCOMES.find((x) => x.id === id);
  if (!o) throw new Error(`guide/router: outcome id "${id}" is not in OUTCOMES — route target does not exist`);
  return { href: `/outcome/${o.id}`, label: o.title };
}
for (const t of Object.values(PROBLEM_ROUTES)) {
  for (const id of t.outcomeIds) {
    if (!OUTCOME_IDS.has(id)) throw new Error(`guide/router: outcome id "${id}" missing from OUTCOMES`);
  }
}

// --- CBT-I route (cbt-i is a real, non-draft remedy: /r/cbt-i, tier S) --------------------------
const CBT_I: RouteItem = {
  href: '/r/cbt-i',
  label: 'CBT-I (cognitive behavioural therapy for insomnia)',
  note: "Somnary's highest-graded intervention for ongoing insomnia — a structured programme, not a supplement.",
};

// --- the router ---------------------------------------------------------------------------------

/** Which screeners suppress or caveat remedy leads and route to a boundary first. */
function activeScreeners(redFlags: RedFlag[]): Set<RedFlag> {
  return new Set(redFlags.filter((f) => f !== 'none'));
}

/**
 * Map a validated extraction (+ the corpus, for triedRemedies resolution) to a route-plan of real
 * URLs. Pure and synchronous. Ordering encodes the safety policy:
 *
 *   1. crisis → crisis refusal + urgent route, STOP (no remedy/outcome/habit routing).
 *   2. screener boundaries (pregnancy/breastfeeding/child/diagnosed-condition → /safety first;
 *      prescription-med → /medications-and-sleep-aids first).
 *   3. chronic OR diagnosed-condition → CBT-I + /when-to-see-a-doctor surfaced FIRST/prominently.
 *   4. triedRemedies → each resolved to ONLY its own /r/<slug> (never invented; framed as evidence).
 *   5. problems → outcome / anxiety pages.
 *   6. habit signals → /sleep-habits#<anchor> checklist with the verbatim HABIT summary.
 *   7. nothing fired → a neutral fallback (browse / search / habits hub).
 *
 * When a screener is active, remedy leads (tried + outcome) are suppressed or caveated: the reader is
 * routed to the boundary page first and told to read the evidence there rather than being handed
 * remedy pages as if they were cleared for them.
 */
export function routePlan<T extends RemedyRef>(extraction: GuideExtraction, corpus: T[]): RoutePlan {
  const { situation, history, habits } = extraction;
  const screeners = activeScreeners(situation.redFlags);
  const sections: RouteSection[] = [];

  // 1 — crisis short-circuits everything.
  if (screeners.has('crisis')) {
    return {
      stop: true,
      sections: [
        {
          kind: 'crisis',
          title: 'Please get help now',
          items: [{ href: ROUTES.urgent.href, label: ROUTES.urgent.label }],
        },
      ],
    };
  }

  // Defense-in-depth: an under-18 age band suppresses remedy leads on its own, not only via the
  // `child` red flag. A malformed/adversarial extraction could set ageBand='child' while omitting the
  // flag; conservative-on-children (CLAUDE.md) means either signal is enough to route to safety first.
  const suppressRemedies =
    situation.ageBand === 'child' ||
    screeners.has('pregnancy') ||
    screeners.has('breastfeeding') ||
    screeners.has('child') ||
    screeners.has('diagnosed-condition');

  // 2 — screener boundaries, most-conservative first.
  const boundaryItems: RouteItem[] = [];
  if (screeners.has('prescription-med')) {
    boundaryItems.push({
      href: ROUTES.meds.href,
      label: ROUTES.meds.label,
      note: 'Because you mentioned a prescription medication, start here — interaction risk is personal and belongs with a pharmacist or doctor.',
    });
  }
  if (suppressRemedies) {
    boundaryItems.push({
      href: ROUTES.safety.href,
      label: ROUTES.safety.label,
      note: 'Read the general cautions here first; whether anything is appropriate in your situation is a conversation for your clinician, not this page.',
    });
  }
  if (boundaryItems.length) {
    sections.push({ kind: 'boundary', title: 'Read this first', items: boundaryItems });
  }

  // 3 — chronic OR diagnosed → CBT-I + clinician, surfaced prominently and matter-of-factly.
  const chronicOrDiagnosed = situation.chronicity === 'chronic' || screeners.has('diagnosed-condition');
  if (chronicOrDiagnosed) {
    sections.push({
      kind: 'clinician-first',
      title: 'For an ongoing or diagnosed sleep problem',
      items: [
        {
          href: ROUTES.clinician.href,
          label: ROUTES.clinician.label,
          note: 'Ongoing sleep trouble is worth a professional visit — here is what makes it worth raising and what to bring.',
        },
        CBT_I,
      ],
    });
  }

  // 4 — triedRemedies → ONLY their own graded pages. Resolved via the SAME detector the ask engine
  // uses; an unresolved name routes NOWHERE (never invented). Suppressed to a caveat when a screener
  // is active (we don't hand remedy pages to a pregnant/child/diagnosed reader as if cleared).
  const triedItems: RouteItem[] = [];
  const seenSlugs = new Set<string>();
  for (const name of history.triedRemedies) {
    const matches = detectRemedyMentions(name, corpus);
    for (const m of matches) {
      if (seenSlugs.has(m.slug)) continue;
      seenSlugs.add(m.slug);
      triedItems.push({
        href: `/r/${m.slug}`,
        label: m.name,
        note: `You mentioned ${m.name} — here's Somnary's graded evidence for it.`,
      });
    }
  }
  // Under an active screener (pregnancy/breastfeeding/child/diagnosed) we do NOT hand back a specific
  // remedy page even caveated — the reader is routed to the boundary page instead. Remedy leads are
  // fully SUPPRESSED here (conservative on pregnancy/children/conditions, per CLAUDE.md).
  if (triedItems.length && !suppressRemedies) {
    sections.push({ kind: 'tried', title: 'The remedies you mentioned', items: triedItems });
  }

  // 5 — problems → outcome / anxiety pages (suppressed to a caveat under an active screener).
  const outcomeItems: RouteItem[] = [];
  const seenHrefs = new Set<string>();
  for (const p of situation.problems) {
    const target = PROBLEM_ROUTES[p];
    if (!target) continue;
    for (const id of target.outcomeIds) {
      const r = outcomeRoute(id);
      if (seenHrefs.has(r.href)) continue;
      seenHrefs.add(r.href);
      outcomeItems.push({ href: r.href, label: r.label, note: 'Somnary ranks these by the strength of their evidence for this goal — not by popularity.' });
    }
    for (const r of target.extra ?? []) {
      if (seenHrefs.has(r.href)) continue;
      seenHrefs.add(r.href);
      outcomeItems.push({ href: r.href, label: r.label });
    }
  }
  if (outcomeItems.length && !suppressRemedies) {
    sections.push({ kind: 'outcomes', title: 'Where to read for what you described', items: outcomeItems });
  } else if (outcomeItems.length && suppressRemedies) {
    sections.push({
      kind: 'outcomes',
      title: 'Where to read — after the safety page',
      items: outcomeItems,
    });
  }

  // 6 — habit signals → sleep-habits checklist, each with the VERBATIM habit summary (no model prose).
  const habitItems: RouteItem[] = [];
  const seenAnchors = new Set<string>();
  for (const s of habits.signals) {
    const anchor = HABIT_ANCHOR[s];
    if (!anchor || seenAnchors.has(anchor)) continue;
    seenAnchors.add(anchor);
    const summary = HABIT_SUMMARY_BY_ID[anchor];
    if (!summary) continue; // defensive: an anchor with no summary routes nowhere
    habitItems.push({
      href: `/sleep-habits#${anchor}`,
      label: `${anchor.charAt(0).toUpperCase()}${anchor.slice(1)} — ${summary.label}`,
      note: summary.summary,
    });
  }
  if (habitItems.length) {
    sections.push({ kind: 'habits', title: 'Habits worth a look', items: habitItems });
  }

  // 7 — nothing fired → neutral fallback (never empty; always a real place to read).
  if (sections.length === 0) {
    sections.push({
      kind: 'fallback',
      title: 'Where to start',
      items: [
        { href: '/sleep-habits', label: 'Sleep habits — what the evidence shows' },
        { href: ROUTES.tiers.href, label: ROUTES.tiers.label },
        { href: ROUTES.search.href, label: ROUTES.search.label },
      ],
    });
  }

  return { stop: false, sections };
}

/** Flatten a plan to the set of hrefs it routes to (used by the engine and the real-URL test). */
export function planHrefs(plan: RoutePlan): string[] {
  return plan.sections.flatMap((s) => s.items.map((i) => i.href));
}
