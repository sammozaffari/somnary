/**
 * Pure label-check engine (CHK-4.1) — NO astro:content import, so it bundles straight into the
 * client island (LabelChecker.astro imports this directly), exactly as search-rank.ts does for the
 * ⌘K palette. The build-time index builder (src/lib/label-data.ts) imports the SAME dose parser, so
 * the studied-dose floors shipped in /label-index.json are derived identically. All parsing runs in
 * the browser; nothing is sent to a server.
 *
 * COMPLIANCE (CLAUDE.md D2/D4, forbidden framings): every output string below is a FIXED template
 * that interpolates ONLY an ingredient name, a parsed milligram value, or a studied-dose string
 * already published in the corpus. The engine DESCRIBES what a label does or doesn't state and
 * ROUTES safety questions to /safety. It NEVER tells anyone what to take, never says a dose or a
 * product is "safe", never recommends OR forbids a combination (D4), never diagnoses, and assigns
 * NO grade to a pasted panel.
 */

/** One remedy, projected to the fields the rules need. Shipped as /label-index.json (build-time). */
export interface LabelEntry {
  slug: string;
  url: string;
  name: string;
  aliases: string[];
  keyCompound: string | null;
  category: string;
  isBotanical: boolean;
  studiedDoseText: string | null; // the dose-form string that produced the floor (verbatim from corpus)
  studiedDoseFloorMg: number | null; // lowest studied dose in mg, or null when nothing parses cleanly
  interactions: string[];
  tier: string;
}

export type RuleId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';
export type FlagSeverity = 'observation' | 'caution';

type NonEmpty<T> = readonly [T, ...T[]];
const loadedIndexBrand: unique symbol = Symbol('loaded-label-index');

/**
 * A checked result carries the exact loaded index that produced it. The private brand means callers
 * cannot construct a LoadedIndex from an arbitrary array and accidentally manufacture a result.
 */
export interface LoadedIndex {
  readonly kind: 'loaded_label_index';
  readonly entries: NonEmpty<LabelEntry>;
  readonly [loadedIndexBrand]: true;
}

export type IndexFailureReason = 'request_failed' | 'invalid_index';
export type ParseFailureReason = 'no_label_items' | 'parser_error';

export interface RecognisedItem {
  slug: string;
  name: string;
  doseMg: number | null;
}

export interface DoseCheckGap {
  ingredient: string;
  reason: 'form_unknown' | 'amount_missing' | 'studied_floor_missing';
}

interface CheckedStateBase {
  /** Exact branded index reference used to derive checked, flags, and coverage. */
  index: LoadedIndex;
  checked: readonly RecognisedItem[];
  doseChecksNotApplied: readonly DoseCheckGap[];
}

export type CheckerState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'index_unavailable'; reason: IndexFailureReason }
  | { kind: 'parsing' }
  | { kind: 'parse_failed'; reason: ParseFailureReason }
  | (CheckedStateBase & {
      kind: 'partial';
      checked: NonEmpty<RecognisedItem>;
      unrecognised: NonEmpty<string>;
      flags: readonly CheckerFlag[];
    })
  | (CheckedStateBase & {
      kind: 'unrecognised';
      checked: readonly [];
      items: NonEmpty<string>;
      flags: readonly [];
    })
  | (CheckedStateBase & {
      kind: 'flags_found';
      flags: NonEmpty<CheckerFlag>;
    })
  | (CheckedStateBase & {
      kind: 'no_flags_checked';
      checked: NonEmpty<RecognisedItem>;
      flags: readonly [];
    });

/** A single surfaced observation. `text` is the allowed-framing message; `href` routes to its basis. */
export interface Flag {
  rule: RuleId;
  ingredient: string | null; // matched remedy name when the flag is ingredient-specific, else null
  text: string;
  href: string;
  linkLabel: string;
}

/** Label-checker rules always classify their display severity; other Flag consumers stay compatible. */
export interface CheckerFlag extends Flag {
  severity: FlagSeverity;
}

/** Empty-state copy (data, so compliance can vet it): honest, never an endorsement. */
export const EMPTY_STATE =
  'No automated flags fired on this text. That does NOT mean a product is fine, effective, or safe — this checker only applies the handful of documented rules below, and it can only see what you pasted. Read the rules and each ingredient’s own evidence page.';

const UNIT_TOKENS = new Set(['mg', 'mcg', 'g', 'ug', 'iu', 'ml', 'kg']);

function isLabelEntry(value: unknown): value is LabelEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === 'string' &&
    typeof entry.url === 'string' &&
    typeof entry.name === 'string' &&
    Array.isArray(entry.aliases) &&
    entry.aliases.every((alias) => typeof alias === 'string') &&
    (typeof entry.keyCompound === 'string' || entry.keyCompound === null) &&
    typeof entry.category === 'string' &&
    typeof entry.isBotanical === 'boolean' &&
    (typeof entry.studiedDoseText === 'string' || entry.studiedDoseText === null) &&
    (typeof entry.studiedDoseFloorMg === 'number' || entry.studiedDoseFloorMg === null) &&
    Array.isArray(entry.interactions) &&
    entry.interactions.every((interaction) => typeof interaction === 'string') &&
    typeof entry.tier === 'string'
  );
}

/** Validate and brand fetched JSON. An empty or malformed index is unavailable, never "no matches". */
export function createLoadedIndex(value: unknown): LoadedIndex | null {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isLabelEntry)) return null;
  return {
    kind: 'loaded_label_index',
    entries: value as unknown as NonEmpty<LabelEntry>,
    [loadedIndexBrand]: true,
  };
}

/**
 * Normalize for forgiving matching (mirrors search-rank.norm): lowercase, decompose accents,
 * drop apostrophes, turn any other punctuation into spaces so "l-theanine" ↔ "l theanine".
 */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toMg(n: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u === 'g') return n * 1000;
  if (u === 'mcg' || u === 'ug' || u === 'µg') return n / 1000;
  return n; // mg
}

/** Trim a trailing ".0" so 250.0 → "250" while keeping 0.5. */
function fmtMg(n: number): string {
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(3)));
}

/**
 * Parse the LOWEST studied dose in a `studiedDose` string to a milligram floor, or null when
 * nothing parses cleanly (so the dose-mismatch rule stays SILENT rather than inventing a
 * threshold). Only amounts explicitly tagged `mg`/`g` count — a bare number ("~4% absorbed",
 * "8 weeks", "not established for sleep") never becomes a dose.
 */
export function parseDoseFloorMg(text: string | null | undefined): number | null {
  if (!text) return null;
  const found: number[] = [];
  // range "A–B mg|g": the low end A carries the trailing unit (en/em dash or hyphen)
  const rangeRe = /(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)\s*(mg|g)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = rangeRe.exec(text))) found.push(toMg(parseFloat(m[1]), m[3]));
  // standalone "N mg|g"
  const singleRe = /(\d+(?:\.\d+)?)\s*(mg|g)\b/gi;
  while ((m = singleRe.exec(text))) found.push(toMg(parseFloat(m[1]), m[2]));
  return found.length ? Math.min(...found) : null;
}

/**
 * The first explicit amount on a line, in mg. mcg/g converted; unrecognised units (IU, %, none)
 * → null, so the dose comparison stays silent rather than guessing.
 */
export function parseLineAmountMg(line: string): number | null {
  const m = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|ug|g)\b/i.exec(line);
  if (!m) return null;
  return toMg(parseFloat(m[1].replace(',', '.')), m[2]);
}

/** Whole-word (word-sequence) match against space-normalized text — prevents "gaba" ⊂ "gabapentin". */
function wordInText(normText: string, normTerm: string): boolean {
  if (!normTerm) return false;
  return new RegExp(`(^|\\s)${normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(normText);
}

function entryTerms(entry: LabelEntry): string[] {
  return [...new Set([entry.name, entry.keyCompound ?? '', ...entry.aliases].map(norm))].filter(
    (term) => term.replace(/\s+/g, '').length >= 3 && !UNIT_TOKENS.has(term),
  );
}

function lineMatchesEntry(line: string, entry: LabelEntry): boolean {
  const normLine = norm(line);
  return entryTerms(entry).some((term) => wordInText(normLine, term));
}

export interface Matched {
  entry: LabelEntry;
  doseMg: number | null; // amount parsed from the matched line, if any
}

/**
 * Which corpus ingredients appear in the pasted panel, and at what dose. Matches on name +
 * keyCompound + aliases, whole-word only. Terms shorter than 3 chars and unit abbreviations
 * ("mg", "g", "iu"…) are dropped so a unit token can't be mistaken for an ingredient (magnesium's
 * "mg" alias must never match every panel that lists a dose).
 */
export function matchIngredients(panel: string, entries: readonly LabelEntry[]): Matched[] {
  const normLines = panel.split(/\r?\n/).map((raw) => ({ raw, norm: norm(raw) }));
  const out: Matched[] = [];
  for (const entry of entries) {
    const terms = entryTerms(entry);
    let hit: { raw: string; norm: string } | null = null;
    for (const line of normLines) {
      if (terms.some((t) => wordInText(line.norm, t))) {
        hit = line;
        break;
      }
    }
    if (hit) out.push({ entry, doseMg: parseLineAmountMg(hit.raw) });
  }
  return out;
}

export interface ParsedPanelItem {
  raw: string;
  name: string;
  ingredientCandidate: boolean;
}

export type PanelParser = (panel: string) => NonEmpty<ParsedPanelItem> | null;

const STRUCTURAL_LINE =
  /^(?:supplement\s+facts?|amount\s+per\s+serving|serving\s+size|servings?\s+per\s+container|daily\s+value|other\s+ingredients?|directions?|warning|contains)\b/i;

/** Parse plausible label rows without treating headings or blend totals as unknown ingredients. */
export const parsePanelItems: PanelParser = (panel) => {
  const items: ParsedPanelItem[] = [];
  for (const rawLine of panel.split(/\r?\n/)) {
    const raw = rawLine.trim();
    if (!raw || !/[a-z]/i.test(raw) || STRUCTURAL_LINE.test(raw)) {
      continue;
    }
    const amountAt = raw.search(/\d+(?:[.,]\d+)?\s*(?:mg|mcg|µg|ug|g|iu|ml)\b/i);
    const beforeAmount = amountAt >= 0 ? raw.slice(0, amountAt) : raw;
    const name = beforeAmount
      .replace(/^[\s•*†‡\-–—]+/, '')
      .replace(/[\s*†‡:;,\-–—]+$/, '')
      .trim();
    if (name && /[a-z]/i.test(name)) {
      const ingredientCandidate = !/\bproprietary\s+blend\b/i.test(raw) && !/\bblend\b/i.test(name);
      items.push({ raw, name, ingredientCandidate });
    }
  }
  return items.length ? (items as unknown as NonEmpty<ParsedPanelItem>) : null;
};

/**
 * Parse and check only against a branded, non-empty index. Transitional network states are owned
 * by the component; completed result states all retain the exact index reference used here.
 */
export function checkLabelState(panel: string, index: LoadedIndex, parser: PanelParser = parsePanelItems): CheckerState {
  if (!panel.trim()) return { kind: 'idle' };

  let parsed: NonEmpty<ParsedPanelItem> | null;
  try {
    parsed = parser(panel);
  } catch {
    return { kind: 'parse_failed', reason: 'parser_error' };
  }
  if (!parsed) return { kind: 'parse_failed', reason: 'no_label_items' };

  const matched = matchIngredients(panel, index.entries);
  const checked = matched.map((match) => ({
    slug: match.entry.slug,
    name: match.entry.name,
    doseMg: match.doseMg,
  }));
  const unrecognised = [
    ...new Set(
      parsed
        .filter(
          (item) => item.ingredientCandidate && !index.entries.some((entry) => lineMatchesEntry(item.raw, entry)),
        )
        .map((item) => item.name),
    ),
  ];
  const flags = checkLabel(panel, index.entries);
  const base = { index, checked, doseChecksNotApplied: [] as const };

  // Coverage always wins over result severity: partial is the state, with flags retained inside it.
  if (checked.length > 0 && unrecognised.length > 0) {
    return {
      ...base,
      kind: 'partial',
      checked: checked as unknown as NonEmpty<RecognisedItem>,
      unrecognised: unrecognised as unknown as NonEmpty<string>,
      flags,
    };
  }
  if (flags.length > 0) {
    return { ...base, kind: 'flags_found', flags: flags as unknown as NonEmpty<CheckerFlag> };
  }
  if (checked.length === 0) {
    const items = unrecognised.length ? unrecognised : parsed.map((item) => item.name);
    return {
      ...base,
      kind: 'unrecognised',
      checked: [] as const,
      items: items as unknown as NonEmpty<string>,
      flags: [] as const,
    };
  }
  return {
    ...base,
    kind: 'no_flags_checked',
    checked: checked as unknown as NonEmpty<RecognisedItem>,
    flags: [] as const,
  };
}

/**
 * Does the panel clearly state a standardized extract? Kept conservative on the FALSE-NEGATIVE
 * side (a real standardized label almost always says "standardized" or names a standardized
 * extract / a quantified active), and deliberately does NOT treat a bare "%" as a marker — a
 * "% Daily Value" column would otherwise suppress the rule for every botanical.
 */
function hasStandardizationMarker(panel: string): boolean {
  return (
    /standardi[sz]ed|standardi[sz]ation|\bstd\.?\s*to\b|ksm-?66|shoden|suntheanine|silexan/i.test(panel) ||
    /\d+(?:\.\d+)?\s*%\s*(?:withanolide|valerenic|apigenin|honokiol|magnolol|kavalactone|flavon|glycoside|rosmarinic|carnosic)/i.test(
      panel,
    )
  );
}

/**
 * Apply the five static rules to a pasted panel. Pure: same input → same flags, no I/O, no clock.
 * Order: R1 (blend) · R2 (high-dose melatonin) · then per-ingredient R3/R4/R5 · then the R5
 * multi-sedation routing note.
 */
export function checkLabel(panel: string, entries: readonly LabelEntry[]): CheckerFlag[] {
  const flags: CheckerFlag[] = [];
  if (!panel.trim()) return flags;

  const lines = panel.split(/\r?\n/);
  const matched = matchIngredients(panel, entries);

  // R1 — proprietary blend: an explicit "proprietary blend", or a "blend" line carrying only a
  // combined total, hides each ingredient's amount, so no dose can be checked against a study.
  const blendLine = lines.some(
    (l) => /\bblend\b/i.test(l) && /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|ug|g)\b/i.test(l),
  );
  if (/proprietary\s+blend/i.test(panel) || blendLine) {
    flags.push({
      rule: 'R1',
      severity: 'observation',
      ingredient: null,
      text: "This panel lists a proprietary blend, so the amount of each ingredient is hidden. No ingredient's dose can be checked against the dose that was studied.",
      href: '/sleep-blends',
      linkLabel: 'why hidden doses can’t be checked',
    });
  }

  // R2 — high-dose melatonin: describes the STUDIED RANGE, not a safety verdict on 5 mg.
  const mel = matched.find((mt) => mt.entry.slug === 'melatonin');
  if (mel && mel.doseMg !== null && mel.doseMg > 5) {
    flags.push({
      rule: 'R2',
      severity: 'caution',
      ingredient: 'melatonin',
      text: `This lists melatonin at ${fmtMg(mel.doseMg)} mg. Trials found the benefit at 0.5–5 mg; higher amounts haven't been shown to work better and raise next-day grogginess.`,
      href: '/melatonin-dose-timing',
      linkLabel: 'what the melatonin trials actually used',
    });
  }

  const stdMarker = hasStandardizationMarker(panel);

  for (const mt of matched) {
    const e = mt.entry;

    // R3 — dose below the studied floor. Fires ONLY when both a clean numeric floor and a parsed
    // panel amount exist; otherwise silent (no invented threshold, no false flag).
    if (e.studiedDoseFloorMg !== null && mt.doseMg !== null && mt.doseMg < e.studiedDoseFloorMg) {
      flags.push({
        rule: 'R3',
        severity: 'observation',
        ingredient: e.name,
        text: `This lists ${e.name} at ${fmtMg(mt.doseMg)} mg. Studies of ${e.name} used ${e.studiedDoseText}.`,
        href: e.url,
        linkLabel: `${e.name}: the dose studies used`,
      });
    }

    // R4 — a botanical with no standardized-extract marker anywhere in the panel.
    if (e.isBotanical && !stdMarker) {
      flags.push({
        rule: 'R4',
        severity: 'observation',
        ingredient: e.name,
        text: `${e.name} is a botanical whose active content varies by extract; this panel doesn't state a standardized extract.`,
        href: e.url,
        linkLabel: `${e.name}: what to look for on a label`,
      });
    }

    // R5 — documented interaction cautions for a matched ingredient. Routes to /safety; never
    // says "don't combine" and never implies any combination is safe (D4 salvage).
    if (e.interactions.length > 0) {
      flags.push({
        rule: 'R5',
        severity: 'caution',
        ingredient: e.name,
        text: `${e.name} has documented interaction cautions (${e.interactions.join('; ')}). This is a question for a pharmacist or clinician, especially if you take other medications.`,
        href: '/safety',
        linkLabel: `${e.name}: safety & interactions`,
      });
    }
  }

  // R5 (routing only) — more than one matched ingredient carries a sedation-type caution. This
  // OBSERVES and routes; it is NOT advice to avoid a combination and implies no safe combination.
  const sedationRe = /sedat|cns depressant|depressant|drowsi|additive/i;
  const sedaters = matched.filter((mt) => mt.entry.interactions.some((i) => sedationRe.test(i)));
  if (sedaters.length >= 2) {
    flags.push({
      rule: 'R5',
      severity: 'caution',
      ingredient: null,
      text: 'More than one ingredient here carries a sedation caution — worth raising with a pharmacist or clinician.',
      href: '/safety',
      linkLabel: 'read the safety boundary',
    });
  }

  return flags;
}
