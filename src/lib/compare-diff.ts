/**
 * compare-diff — the semantic difference-detection engine behind the difference-first /compare
 * pair (L-01). It decides, per dimension, whether two remedies are the SAME or DIFFERENT so the
 * page can expand differences and collapse identical values.
 *
 * GOLDEN INVARIANT: the UI always displays the VERBATIM corpus text. Normalisation here produces
 * a hidden *comparison key* used ONLY to decide same-vs-different — never rendered. So
 * "2-3 hours before bed" and "2 to 3 hours before bedtime" collapse as identical, while
 * "3 mg" and "0.3 mg" stay different.
 *
 * D4 (CLAUDE.md): interactions are compared strictly PER REMEDY. Nothing here unions the two
 * interaction lists into a combined-stack claim; the class sets stay attributed to each remedy.
 *
 * Pure module: no Astro imports. Types only from the plain lib layer.
 */
import type { TierId } from './tiers';
import type { GateId } from './evidence-gates';
import type { WorkflowState, EpistemicState } from './remedy-state';
import { EPISTEMIC_LABELS, gradeStampState } from './remedy-state.ts';
import { getTier } from './tiers.ts';

export interface DoseRow {
  form: string;
  studiedDose: string;
  timing: string;
}

/** The stable projection both the picker and the pair page compare. Built in compare-data.ts. */
export interface CompareEntity {
  slug: string;
  name: string;
  verdict: string; // oneLineVerdict — identity header only, used verbatim
  tier: TierId;
  workflowState: WorkflowState;
  epistemicState: EpistemicState;
  rankingEligible: boolean;
  format: 'supplement' | 'intervention';
  outcomes: string[];
  doses: DoseRow[];
  notFor: string[];
  biggestRisk: string | null;
  interactions: string[];
  gates: GateId[];
  category: string;
}

export type SectionState = 'different' | 'identical' | 'unrecorded';

// ---------------------------------------------------------------------------------------------
// Stage A — text normalisation → comparison key
// ---------------------------------------------------------------------------------------------

const stripDiacritics = (s: string): string =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '');

/**
 * Normalise free text to a comparison key. Order is deliberate: canonicalise number ranges before
 * units, units before domain phrases, phrases before filler removal. Never shown to the user.
 */
export function normKey(input: string): string {
  let k = stripDiacritics(input).toLowerCase().trim().replace(/\s+/g, ' ');

  // range/connector: "-", en/em dash, "~", or the word "to" BETWEEN two numbers → one connector.
  k = k.replace(/(\d(?:\.\d+)?)\s*(?:-|–|—|~|to)\s*(\d(?:\.\d+)?)/g, '$1-$2');

  // unit lexicon (whole-token). micro sign µ/greek mu μ both fold to mcg.
  k = k
    .replace(/\bmilligrams?\b/g, 'mg')
    // micro units: \b fails before µ/μ (ASCII-only word boundary, mu is a non-word char), so the
    // leading boundary is omitted for the symbol forms and required only for the ascii "ug".
    .replace(/\bmicrograms?\b/g, 'mcg')
    .replace(/[µμ]g\b/g, 'mcg')
    .replace(/\bug\b/g, 'mcg')
    .replace(/\bgrams?\b/g, 'g')
    .replace(/\bhours?\b|\bhrs?\b/g, 'h')
    .replace(/\bminutes?\b|\bmins?\b/g, 'min')
    .replace(/\bweeks?\b|\bwks?\b/g, 'wk')
    .replace(/\bdays?\b/g, 'd');

  // phrase lexicon — domain synonyms to one canonical form.
  k = k
    .replace(/before (?:target )?bed(?:time)?/g, 'before bed')
    .replace(/\bat bedtime\b/g, 'before bed')
    .replace(/\bpre[- ]bed\b/g, 'before bed')
    .replace(/\bin the evening\b/g, 'evening')
    .replace(/\bimmediate[- ]release\b|\bir\b/g, 'immediate-release')
    .replace(/\bprolonged[- ]release\b|\bextended[- ]release\b|\ber\b|\bpr\b/g, 'prolonged-release');

  // filler drop (key only, never display).
  k = k.replace(
    /\b(?:about|approximately|roughly|typically|usually|commonly|around|target|the|a)\b/g,
    ' ',
  );

  // punctuation → space; keep the "-" range connector AND decimal points ("0.3" must survive —
  // only periods at a token boundary, e.g. "before bed.", are dropped).
  return k
    .replace(/[(),;:/]/g, ' ')
    .replace(/\.(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const sameText = (a: string, b: string): boolean => normKey(a) === normKey(b);

// ---------------------------------------------------------------------------------------------
// Stage B — numeric-range awareness (dose & timing)
// ---------------------------------------------------------------------------------------------

export interface Quantity {
  lo: number;
  hi: number;
  unit: string;
}

/** Extract {lo, hi, unit} from a value (normalised first). null when there's no parseable amount. */
export function parseQuantity(value: string): Quantity | null {
  const k = normKey(value);
  const m = k.match(/(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*(mg|mcg|g|h|min|wk|d)\b/);
  if (!m) return null;
  const lo = parseFloat(m[1]);
  const hi = m[2] !== undefined ? parseFloat(m[2]) : lo;
  return { lo, hi, unit: m[3] };
}

/**
 * Same amount? Stricter than sameText: compares parsed lo/hi/unit so "3 mg" ≠ "0.3 mg" even when
 * the surrounding words match. Falls back to sameText when either side has no parseable quantity.
 */
export function sameDose(a: string, b: string): boolean {
  const qa = parseQuantity(a);
  const qb = parseQuantity(b);
  if (!qa || !qb) return sameText(a, b);
  return qa.lo === qb.lo && qa.hi === qb.hi && qa.unit === qb.unit;
}

// ---------------------------------------------------------------------------------------------
// Stage C — set comparisons (outcomes, interaction classes)
// ---------------------------------------------------------------------------------------------

/** Outcome comparison key. Mirrors compare.astro's goalKey — a slug of the verbatim outcome. */
export const outcomeKey = (o: string): string =>
  o
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Interaction CLASS key — heuristic mapping of a free-text interaction to a drug/mechanism class,
 * so the many "Sedatives and CNS depressants (…)" phrasings collapse to one class. First matching
 * rule wins; unmapped strings fall back to their normalised text so they still compare sensibly.
 * These classes are for same/different detection only — never a combined-interaction claim (D4).
 */
const CLASS_RULES: readonly [RegExp, string][] = [
  [/cns depressant|sedativ|benzodiazepin|opioid|sedating antihistamine|hypnotic|alcohol/, 'cns-depressants'],
  [/warfarin|anticoagulant|antiplatelet|blood thinner|clopidogrel|aspirin|bleeding/, 'anticoagulants'],
  [/ssri|snri|maoi|serotonergic|serotonin|antidepressant|triptan/, 'serotonergic'],
  [/blood[- ]pressure|antihypertensive|calcium-channel/, 'antihypertensives'],
  [/diabet|blood sugar|insulin/, 'antidiabetics'],
  [/immunosuppress/, 'immunosuppressants'],
  [/cyp|liver enzyme|metabolized by (?:the )?liver|metabolised by (?:the )?liver|hepat/, 'cyp-metabolism'],
  [/thyroid|levothyroxine|\bt4\b/, 'thyroid'],
  [/antibiotic|tetracycline|quinolone|aminoglycoside/, 'antibiotics'],
  [/antacid|proton-pump|\bppi\b|bisphosphonate|absorption|chelat|copper|calcium|levodopa|iron/, 'absorption'],
  [/lithium/, 'lithium'],
  [/clozapine/, 'clozapine'],
  [/melatonin/, 'melatonin-additive'],
];

export function interactionClassKey(entry: string): string {
  const k = normKey(entry);
  for (const [re, cls] of CLASS_RULES) if (re.test(k)) return cls;
  // fall back to the head phrase before any parenthetical, normalised.
  return normKey(entry.split('(')[0]);
}

export interface SetDiff {
  shared: string[]; // display values present (by key) in both
  aOnly: string[];
  bOnly: string[];
  same: boolean; // symmetric difference empty
}

/** Compare two lists as sets under `keyer`; returns verbatim display values, not keys. */
export function diffSets(
  aVals: string[],
  bVals: string[],
  keyer: (v: string) => string,
): SetDiff {
  const index = (vals: string[]) => {
    const m = new Map<string, string>();
    for (const v of vals) {
      const k = keyer(v);
      if (!m.has(k)) m.set(k, v);
    }
    return m;
  };
  const a = index(aVals);
  const b = index(bVals);
  const shared: string[] = [];
  const aOnly: string[] = [];
  const bOnly: string[] = [];
  for (const [k, v] of a) (b.has(k) ? shared : aOnly).push(v);
  for (const [k, v] of b) if (!a.has(k)) bOnly.push(v);
  return { shared, aOnly, bOnly, same: aOnly.length === 0 && bOnly.length === 0 };
}

// ---------------------------------------------------------------------------------------------
// Stage C (typed) — grade, effect signal, dose rows
// ---------------------------------------------------------------------------------------------

export interface GradeComparison {
  sameLetter: boolean;
  /** letters equal but one grade is provisional and the other review-complete → not comparable */
  provisionalMismatch: boolean;
  aStamp: { label: string; prominent: boolean };
  bStamp: { label: string; prominent: boolean };
  whyItMatters: string;
}

const GRADE_BASE =
  'The grade rates how strong the published human evidence is — not how safe it is, and not how big the effect feels. This compares evidence strength, not a recommendation to pick one.';

export function compareGrade(a: CompareEntity, b: CompareEntity): GradeComparison {
  const aStamp = gradeStampState(a.workflowState);
  const bStamp = gradeStampState(b.workflowState);
  const provisionalMismatch = a.rankingEligible !== b.rankingEligible;
  let whyItMatters = GRADE_BASE;
  if (provisionalMismatch) {
    const ratified = a.rankingEligible ? a : b;
    const provisional = a.rankingEligible ? b : a;
    whyItMatters = `${GRADE_BASE} These two grades aren't on equal footing: ${ratified.name}'s is review-complete, while ${provisional.name}'s is provisional (final review pending). Read the letters with that in mind — a provisional grade can still move.`;
  }
  return {
    sameLetter: a.tier === b.tier,
    provisionalMismatch,
    aStamp,
    bStamp,
    whyItMatters,
  };
}

/** Strength-of-effect SIGNAL from the tier's evidence gates — NOT a measured effect size. */
export type EffectSignal = 'reported' | 'small' | 'not-reported';

export function effectSignal(e: CompareEntity): EffectSignal {
  if (e.gates.includes('effect-size-small')) return 'small';
  if (e.gates.includes('effect-size-reported')) return 'reported';
  return 'not-reported';
}

/** The caution-gate subset that speaks to uncertainty. */
const CAUTION_GATES: readonly GateId[] = [
  'effect-size-small',
  'heterogeneous-trials',
  'unstandardized',
  'dose-mismatch',
  'mechanism-only',
  'little-no-human-data',
];

export function uncertaintySame(a: CompareEntity, b: CompareEntity): boolean {
  if (a.epistemicState !== b.epistemicState) return false;
  const aC = a.gates.filter((g) => CAUTION_GATES.includes(g));
  const bC = b.gates.filter((g) => CAUTION_GATES.includes(g));
  return diffSets(aC, bC, (g) => g).same;
}

// ---------------------------------------------------------------------------------------------
// Stage D — ordered sections with state
// ---------------------------------------------------------------------------------------------

export interface Section {
  id: string;
  label: string;
  state: SectionState;
  /** safety/grade sections that must never hide behind a reveal, whatever their state */
  alwaysExpanded: boolean;
  whyItMatters: string;
}

/**
 * The fixed vertical stack, in order. Safety-critical (grade, biggest risk, interactions) lead and
 * never collapse. `studied-population` and `time-to-effect` have no structured field yet, so they
 * are always `unrecorded` — never claimed identical, never read as "no difference".
 */
export function orderedSections(a: CompareEntity, b: CompareEntity): Section[] {
  const grade = compareGrade(a, b);

  const outcomes = diffSets(a.outcomes, b.outcomes, outcomeKey);
  const interactions = diffSets(a.interactions, b.interactions, interactionClassKey);

  // biggest risk: missing on one side → different + explicit "not recorded" (handled in view).
  const riskState: SectionState =
    a.biggestRisk && b.biggestRisk
      ? sameText(a.biggestRisk, b.biggestRisk)
        ? 'identical'
        : 'different'
      : a.biggestRisk || b.biggestRisk
        ? 'different'
        : 'unrecorded';

  // form/protocol: an intervention (no dose) vs a dosed supplement is a real, stated difference.
  const formState: SectionState =
    a.format !== b.format
      ? 'different'
      : sameFormSet(a.doses, b.doses)
        ? 'identical'
        : 'different';

  const doseState: SectionState = a.doses.length && b.doses.length
    ? sameDoseSet(a.doses, b.doses)
      ? 'identical'
      : 'different'
    : a.doses.length || b.doses.length
      ? 'different'
      : 'unrecorded';

  const effectState: SectionState =
    effectSignal(a) === effectSignal(b) ? 'identical' : 'different';

  return [
    {
      id: 'grade',
      label: 'Evidence grade & review state',
      state: grade.sameLetter && !grade.provisionalMismatch ? 'identical' : 'different',
      alwaysExpanded: true,
      whyItMatters: grade.whyItMatters,
    },
    {
      id: 'biggest-risk',
      label: 'Biggest risk',
      state: riskState,
      alwaysExpanded: true,
      whyItMatters:
        "Each remedy's headline risk is its own. A difference here is not a ranking — it's a different thing to check with a clinician or pharmacist.",
    },
    {
      id: 'interactions',
      label: 'Interaction classes',
      state: interactions.same ? 'identical' : 'different',
      alwaysExpanded: true,
      whyItMatters:
        'Interaction classes are listed per remedy. This is never a readout of what happens if you take them together — it is what to raise about each one on its own.',
    },
    {
      id: 'outcome',
      label: 'Target outcome',
      state: outcomes.same ? 'identical' : 'different',
      alwaysExpanded: false,
      whyItMatters:
        'Two remedies can target different sleep problems. Matching the goal you came with often matters more than the grade.',
    },
    {
      id: 'effect-magnitude',
      label: 'Effect magnitude',
      state: effectState,
      alwaysExpanded: false,
      whyItMatters:
        "This is a strength-of-effect signal read from the grade's evidence gates — not a measured effect size.",
    },
    {
      id: 'form-protocol',
      label: 'Form & protocol',
      state: formState,
      alwaysExpanded: false,
      whyItMatters:
        'Form changes what is actually being compared: an intervention has no dose, and two forms of the same supplement can behave differently.',
    },
    {
      id: 'dose-timing',
      label: 'Dose & timing',
      state: doseState,
      alwaysExpanded: false,
      whyItMatters:
        'The dose and timing that were studied are not always what is sold, or when people take it.',
    },
    {
      id: 'uncertainty',
      label: 'Uncertainty',
      state: uncertaintySame(a, b) ? 'identical' : 'different',
      alwaysExpanded: false,
      whyItMatters: `How settled the evidence is (${EPISTEMIC_LABELS[a.epistemicState].toLowerCase()} vs ${EPISTEMIC_LABELS[b.epistemicState].toLowerCase()}) shapes how much weight the grade can bear.`,
    },
    {
      id: 'studied-population',
      label: 'Studied population',
      state: 'unrecorded',
      alwaysExpanded: false,
      whyItMatters: 'Not separately recorded in the corpus yet — see each remedy page for who was studied.',
    },
    {
      id: 'time-to-effect',
      label: 'Time to effect',
      state: 'unrecorded',
      alwaysExpanded: false,
      whyItMatters: 'Not separately recorded in the corpus yet — see each remedy page.',
    },
  ];
}

/** two dose sets share the same forms with same amounts+timing per form */
function sameFormSet(a: DoseRow[], b: DoseRow[]): boolean {
  if (a.length === 0 && b.length === 0) return true;
  return diffSets(a.map((d) => d.form), b.map((d) => d.form), normKey).same;
}

function sameDoseSet(a: DoseRow[], b: DoseRow[]): boolean {
  const byForm = (rows: DoseRow[]) => {
    const m = new Map<string, DoseRow>();
    for (const r of rows) if (!m.has(normKey(r.form))) m.set(normKey(r.form), r);
    return m;
  };
  const am = byForm(a);
  const bm = byForm(b);
  if (am.size !== bm.size) return false;
  for (const [form, ra] of am) {
    const rb = bm.get(form);
    if (!rb) return false;
    if (!sameDose(ra.studiedDose, rb.studiedDose) || !sameDose(ra.timing, rb.timing)) return false;
  }
  return true;
}

/** tier decision-translation passthrough, used by the view for the grade section */
export const tierDecision = (t: TierId): string => getTier(t).decisionTranslation;
