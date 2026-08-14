import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Somnary content model — the single structured source the tier board, compare tool,
 * search index and Ask assistant all read (CLAUDE.md "Tech decisions"). Authored as MDX
 * with this Zod schema validating frontmatter on every build. There is no schema-less or
 * plain-Markdown stage.
 *
 * A remedy = { tier, verdict, claims[], data[], doses[], safety[], standardization,
 * mechanism, sources[], aliases[] } per CLAUDE.md. `claims[]` and `data[]` are modeled as
 * one paired `claims` array (claimed ↔ studiesShow) because the signature claims-vs-data
 * table (DESIGN_SYSTEM §2.4) is inherently row-paired with a per-row citation.
 */

// tier is [HUMAN-GATE]: no agent assigns or changes a grade (CLAUDE.md non-negotiable).
// The enum only constrains the shape; the VALUE is owner-ratified, never set by tooling.
const tier = z.enum(['S', 'A', 'B', 'C', 'D', 'F']);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD');

// Publication state is explicit: no record can silently inherit a ratified default.
const workflowState = z.enum([
  'owner_ratified',
  'second_review',
  'pending_signoff',
  'unreviewed',
  'withdrawn',
]);
const epistemicState = z.enum(['established', 'provisional', 'disputed', 'insufficient']);
const freshnessState = z.enum(['current', 'review_due', 'superseded']);

/**
 * Evidence change-log entry (CHK-1.4 evidence-change-log page reads changeLog[]). Records a
 * dated, public change to a page's grade, sources, or content. `fromTier`/`toTier` are set
 * only on grade changes (themselves [HUMAN-GATE]).
 */
const changeLogEntry = z.object({
  date: isoDate,
  type: z.enum(['review', 'grade', 'source', 'correction']).default('review'),
  note: z.string(),
  fromTier: tier.optional(),
  toTier: tier.optional(),
});

/**
 * A citation, stored as DATA not prose (CLAUDE.md "Citations are DATA"): each carries a
 * resolvable identifier so links can be auto-validated. At least one of pmid / doi /
 * registry MUST be present — this is what makes "0 hallucinated cites" enforceable
 * (the CHK-0.5 resolver re-checks the same rule). Formats are pre-validated here so a
 * malformed identifier fails the build at schema time.
 */
// The study field is a NESTED BAR (RULES.md "Evidence display"): three counts — papers cited
// ⊇ measured a sleep outcome ⊇ reported enough to verify — plus ONE plain direction sentence
// ("Of the 3 we could check, all 3 found an improvement"). No scatter, no dots, no per-study
// positioning — the corpus can't support it (best remedy: 3 verifiable papers). That rendering
// only works if these live as STRUCTURED fields — not buried in `finding` / `sourceLine` prose.
//
// TWO findings from the step-2 audit shape this schema:
//  1. Outcome units don't share an axis — sources report minutes, %, PSQI/ISI points, pooled
//     SMD, relative risk, circadian shift. So direction is never charted continuously;
//     `effectDirection` is a THREE-BAND enum (helped / no clear effect / didn't help) feeding
//     the plain direction sentence, and `effectSize` is optional, kept for the plain-language
//     stat line, never for positioning.
//  2. Only ~54% of sources measure a human sleep outcome. The rest are safety, mechanism,
//     label or off-target studies with no sleep direction. `measuresSleepOutcome` gates this:
//     only true sources feed the bar's "measured sleep" count and carry direction/sampleSize;
//     false sources carry none of it (and never a direction). It encodes NO safety signal —
//     that is the separate Step-1 flag.
//
// effect DATA is editorial: read off the actual paper, never inferred or estimated (CLAUDE.md;
// REDESIGN step 2). Each source declares an explicit `effectDataStatus`:
//   - 'complete' → adjudicated; the fields required for its kind are filled (validation below
//                  FAILS LOUDLY if not);
//   - 'pending'  → not yet entered editorially; fields stay null and the nested bar counts the
//                  source outside "reported enough to verify". The honest "not yet" state.
// `studyQuality` is OPTIONAL and NOT a render input (RULES.md Process: the rubric is scoped to
// bucket-determining papers, not the whole corpus). Where populated it is assigned strictly per
// docs/SOURCE_QUALITY_RUBRIC.md (re-derivable, no "feel") to make bucket assignments defensible.
const effectDirection = z.enum([
  'helped',          // a sleep outcome improved
  'no-clear-effect', // no statistically clear change
  'didnt-help',      // no benefit or a worse outcome
]);
const studyQuality = z.enum(['high', 'moderate', 'low']); // bucket-defensibility only (see rubric) — never rendered

const source = z
  .object({
    n: z.number().int().positive(), // footnote number, referenced by claims[].sources — NOT sample size
    title: z.string(),
    sourceLine: z.string(), // journal · authors · year (human-readable citation line)
    finding: z.string(), // plain-language what-it-found (citation popover body)
    // year — structured, required. Migrated by parsing the existing citation line (an existing
    // datum, not an inference); every new source states it explicitly.
    year: z.number().int().gte(1960).lte(2100),
    type: z.enum([
      'meta-analysis',
      'systematic-review',
      'rct',
      'cohort',
      'case-series',
      'animal',
      'in-vitro',
      'registry',
      'guideline',
      'review',
      'other',
    ]),
    // --- effect data (study-field fields) — editorial, never inferred ---
    effectDataStatus: z.enum(['complete', 'pending']),
    // does this source measure a sleep outcome IN HUMANS? Only true sources feed the nested
    // bar's "measured sleep" count. Animal/in-vitro sleep models are false (buckets reflect
    // human evidence). Set when a source is adjudicated (required on complete sources).
    measuresSleepOutcome: z.boolean().nullable().default(null),
    sampleSize: z.number().int().positive().nullable().default(null), // people in the study — plain stat + popover's "how many people", never a dot size
    effectDirection: effectDirection.nullable().default(null),
    effectSize: z.string().min(1).nullable().default(null), // OPTIONAL plain-language magnitude, e.g. "~7 minutes faster"
    studyQuality: studyQuality.nullable().default(null),
    // --- identifier (at least one required) ---
    pmid: z
      .string()
      .regex(/^\d+$/, 'pmid must be digits only')
      .optional(),
    doi: z
      .string()
      .regex(/^10\.\d{4,9}\/\S+$/, 'doi must look like 10.xxxx/suffix')
      .optional(),
    registry: z
      .string()
      .regex(/^NCT\d{8}$/, 'registry must be a ClinicalTrials.gov id (NCT + 8 digits)')
      .optional(),
    url: z.string().url().optional(),
  })
  .refine((s) => Boolean(s.pmid || s.doi || s.registry), {
    message: 'each source needs a resolvable identifier: pmid, doi, or registry (NCT…)',
  })
  // Fail loudly on a source whose effect data is internally inconsistent. Two honesty rules:
  //  1. A `complete` source must be adjudicated (measuresSleepOutcome set); a `complete`
  //     sleep-outcome source must carry the three fields the study field renders it from
  //     (sampleSize, effectDirection, studyQuality) — a half-filled point must never render.
  //  2. A NON-sleep-outcome source may NEVER carry an effectDirection (any status) — that
  //     would place a safety/mechanism study on the helped/didn't-help axis, the exact
  //     dishonesty this schema exists to prevent.
  .superRefine((s, ctx) => {
    const fail = (path, message) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message: `source [${s.n}]: ${message}` });

    // rule 2 — applies regardless of status
    if (s.measuresSleepOutcome === false && s.effectDirection !== null) {
      fail(
        'effectDirection',
        'has effectDirection but measuresSleepOutcome is false — a non-sleep-outcome source cannot sit on the helped/didn’t-help axis'
      );
    }

    if (s.effectDataStatus !== 'complete') return;

    // rule 1 — completeness
    if (s.measuresSleepOutcome === null || s.measuresSleepOutcome === undefined) {
      fail('measuresSleepOutcome', 'is effectDataStatus: complete but measuresSleepOutcome is not set — adjudicate it or set effectDataStatus: pending');
      return;
    }
    if (s.measuresSleepOutcome === true) {
      // studyQuality is NOT required here (RULES.md Process: the rubric is scoped to
      // bucket-determining papers only) — it stays optional alongside effectSize.
      const missing = (
        [
          ['sampleSize', s.sampleSize],
          ['effectDirection', s.effectDirection],
        ] as const
      )
        .filter(([, v]) => v === null || v === undefined)
        .map(([k]) => k);
      if (missing.length) {
        fail(
          'effectDataStatus',
          `is a complete sleep-outcome source but is missing ${missing.join(', ')} — fill the field(s) or set effectDataStatus: pending (effectSize and studyQuality stay optional)`
        );
      }
    }
  });

/** One row of the claims-vs-data table. `studiesShow: null` → renders the .nodata marker. */
const claimRow = z.object({
  claimed: z.string(),
  studiesShow: z.string().nullable(),
  sources: z.array(z.number().int().positive()).default([]), // → source.n
});

/** Evidence-gate chip (DESIGN_SYSTEM §2.3) — self-documents the grade. */
const evidenceGate = z.object({
  label: z.string(),
  variant: z.enum(['positive', 'caution', 'neutral']),
});

const dose = z.object({
  form: z.string(),
  studiedDose: z.string(),
  timing: z.string(),
  marketComparison: z.string(), // how studied dose compares to typical products
});

// A risk row may footnote its own sources[] — safety claims are health claims and get cited too
// ("cite or don't claim"). Optional/defaulted so pages with general, uncited cautions still validate.
const riskRow = z.object({
  category: z.string(),
  text: z.string(),
  sources: z.array(z.number().int().positive()).default([]), // → source.n
});

/** Safety & interactions — surfaced prominently, never fine print (CLAUDE.md medical safety). */
const safety = z.object({
  severity: z.enum(['caution', 'serious']), // → .sev-caution / .sev-serious (DESIGN §2.12)
  lead: z.string(),
  risks: z.array(riskRow).default([]),
  pregnancy: z.string(),
  interactions: z.array(z.string()).default([]),
  interactionsSources: z.array(z.number().int().positive()).default([]), // footnotes for the interactions list
});

const remedies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/remedies' }),
  schema: z
    .object({
      tier,
      workflowState,
      epistemicState,
      freshnessState,
      statusReason: z.string().min(1).optional(),
      ratifiedBy: z.string().min(1).optional(),
      ratifiedAt: isoDate.optional(),
      reviewDueAt: isoDate.optional(),
      supersededBy: z.string().min(1).optional(),
      validFrom: isoDate,
      validTo: isoDate.optional(),
      // supplement (default) vs behavioral/environmental intervention (Phase 6, e.g. cbt-i). Drives
      // template adaptation: interventions have no dose/compound, so those blocks are skipped and
      // the "standardization" block reframes as fidelity ("what counts as the real thing").
      format: z.enum(['supplement', 'intervention']).default('supplement'),
      name: z.string(), // lowercase in UI
      aliases: z.array(z.string()).default([]), // synonyms + latin names → search
      oneLineVerdict: z.string(),
      verdict: z.string(), // 2–3 sentence verdict block
      keyCompound: z.string().nullable().default(null),
      bestFor: z.array(z.string()).default([]),
      // Lead-block fields (DESIGN_SYSTEM decision-first lead; strategy doc 03). notFor and
      // biggestRisk are editorial judgments drawn from the page's OWN cited content — optional
      // so a page validates before the evidence-editor populates them, but the lead block
      // renders them when present.
      notFor: z.array(z.string()).default([]),
      biggestRisk: z.string().nullable().default(null),
      outcomes: z.array(z.string()).default([]), // search field
      symptoms: z.array(z.string()).default([]), // search field
      claims: z.array(claimRow).default([]),
      evidenceGates: z.array(evidenceGate).default([]),
      doses: z.array(dose).default([]),
      safety,
      standardization: z.string(),
      // Top-of-page Label & Brands card (docs/plans/2026-08-04-label-brand-card-design.md).
      // Both OPTIONAL — when labelChecklist is empty the card falls back to the `standardization`
      // prose above, so every supplement page renders the card from day one. Items may carry
      // <strong> emphasis (rendered via set:html, same as the scorecard LabelReadingPanel).
      labelChecklist: z.array(z.string()).default([]), // 2–4 short "look for" items → ✓ bullets
      labelAvoid: z.array(z.string()).default([]),     // 1–2 red-flag items → the ⚠ avoid line
      mechanism: z.string(),
      sources: z.array(source).default([]),
      // Community data is walled off from the grade (CLAUDE.md evidence firewall): a count
      // only, here, and it must NEVER feed tier logic.
      community: z
        .object({ reportsCount: z.number().int().nonnegative().default(0) })
        .default({ reportsCount: 0 }),
      seo: z.object({
        questionTitle: z.string(), // question-format SEO title
        ogImage: z.string().optional(),
        canonical: z.string().optional(),
      }),
      // Review date + correction link on every article-type page (CLAUDE.md Definition of Done).
      // Required so no page ships without it; value is the real last-reviewed date (seeded from
      // each file's git history — never a fabricated date, per the real-promises rule).
      reviewDate: isoDate,
      changeLog: z.array(changeLogEntry).default([]),
      draft: z.boolean().default(false),
    })
    // Integrity: every footnote (claims, risks, interactions) must exist in sources[].
    .superRefine((data, ctx) => {
      if (data.workflowState === 'owner_ratified') {
        if (!data.ratifiedBy) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['ratifiedBy'],
            message: 'owner_ratified records require ratifiedBy',
          });
        }
        if (!data.ratifiedAt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['ratifiedAt'],
            message: 'owner_ratified records require ratifiedAt',
          });
        }
      }
      if (data.epistemicState === 'disputed' && !data.statusReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['statusReason'],
          message: 'disputed records require a public statusReason',
        });
      }
      if (data.freshnessState === 'review_due' && !data.reviewDueAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reviewDueAt'],
          message: 'review_due records require reviewDueAt',
        });
      }
      if (data.freshnessState === 'superseded' && !data.supersededBy) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['supersededBy'],
          message: 'superseded records require supersededBy',
        });
      }
      if (data.validTo && data.validTo < data.validFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['validTo'],
          message: 'validTo cannot be earlier than validFrom',
        });
      }

      const known = new Set(data.sources.map((s) => s.n));
      const check = (refs: number[], path: (string | number)[]) => {
        refs.forEach((ref) => {
          if (!known.has(ref)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path,
              message: `references source [${ref}] which is not in sources[]`,
            });
          }
        });
      };
      data.claims.forEach((c, ci) => check(c.sources, ['claims', ci, 'sources']));
      data.safety.risks.forEach((r, ri) => check(r.sources, ['safety', 'risks', ri, 'sources']));
      check(data.safety.interactionsSources, ['safety', 'interactionsSources']);
    }),
});

export const collections = { remedies };
