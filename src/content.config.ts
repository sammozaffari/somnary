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

// The evidence BUCKET (does the ingredient work) — the new grade, replacing the S–F tier.
// SAME [HUMAN-GATE] rule as tier: no agent assigns or changes it; the enum is shape only, the
// VALUE is owner-ratified at CHK-E6. Four buckets (RULES.md); each renders with its permanent
// plain sentence (in BucketBadge). Bucket 4 ("avoid") requires papers that MEASURED sleep and
// found no effect — risk is the SEPARATE safety flag, never folded into the bucket. `null` until
// E6 ratifies it → the remedy page renders the honest "grade in review" pending state.
const bucket = z.enum(['works', 'maybe', 'unknown', 'avoid']);
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
  //     sleep-outcome source must carry the fields the nested bar's counts and direction
  //     sentence read (sampleSize, effectDirection) — a half-filled source must never count
  //     as "reported enough to verify".
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
      // [HUMAN-GATE] — owner-ratified at CHK-E6, never by tooling. null → "grade in review".
      bucket: bucket.nullable().default(null),
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
      name: z.string(), // inline/prose + search form (kept for existing consumers)
      // Authoritative on-screen display name — NOT derivable from the slug (a
      // title-cased slug gets "Tart-cherry" / "5-htp" / "Magnolia-bark" wrong).
      // Rule: sentence case, EXCEPT where scientific convention fixes the form
      // (5-HTP, CBD, CBN, CBT-I, GABA, L-theanine, L-tryptophan, vitamin D).
      // Required + non-empty so a page can never silently fall back to a
      // title-cased slug; check-displaynames (verify:displaynames) additionally
      // asserts it only re-cases the slug's own tokens and guards the render layer.
      displayName: z.string().min(1),
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

/* ============================================================================
   PRODUCT + BRAND model (CHK-B3) — per CLAUDE.md content model +
   docs/plans/2026-08-12-product-form-schema.md.

   THREE SEPARATE SIGNALS (Reference A4 / RULES.md): the ingredient evidence bucket
   (on the remedy, above) and the product score's four checks (here) and the safety flag
   are NEVER merged into one number — there is deliberately NO combined field anywhere in
   this schema, rendering, or sorting.
   ============================================================================ */

// deliveryForm — controlled vocabulary (plan §2a). Ingestion maps label wording into this
// enum; an unmappable label is `needs-review`, NEVER an invented or silent value (plan §3).
const deliveryForm = z.enum([
  'tablet', 'capsule', 'softgel', 'gummy', 'melt-lozenge',
  'liquid-drops', 'spray', 'tea', 'powder', 'patch',
]);
// releaseProfile is SEPARATE from deliveryForm (plan §2b). 'not-stated' is load-bearing: most
// labels never state release, and forcing immediate-vs-slow would be inventing. form-matches-
// studied treats 'not-stated' as unverified, never an auto-pass (plan §5).
const releaseProfile = z.enum(['immediate', 'slow-release', 'not-stated']);
const composition = z.enum(['single-ingredient', 'blend']);
// assessment_state — the interface renders honestly against coverage rather than implying
// uniform assessment (CLAUDE.md product model). Label-known-but-unassessed is NOT a pass.
const assessmentState = z.enum([
  'fully assessed',
  'label known, not yet assessed',
  'not in database',
]);
// Additive policy: THREE flag states only, NO hazard spectrum / invented gradient (RULES.md
// Products). 'no-known-concern' is neutral, NOT green. Every non-neutral flag CITES a paper
// (enforced in superRefine below) — no source id → the flag cannot ship.
const additiveFlag = z.enum(['no-known-concern', 'worth-knowing', 'documented-concern']);

const money = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().min(1),
  retailer: z.string().min(1),
  checkedDate: isoDate,
});

// name/strength split (validation gate — item-9): the name string must NOT carry a dose or
// strength; strength is structured {amount, unit}. The rule drifted twice in design, so it is a
// build-time failure here. `%` excluded from the pattern (it appears in extract standardisation).
const DOSE_IN_NAME = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|iu|ml)\b/i;

const productIngredient = z.object({
  remedy_id: z.string().min(1),
  amount: z.number().positive().nullable().default(null),
  unit: z.string().nullable().default(null),
  form: z.string().nullable().default(null), // chemical form / salt at the ingredient level
});

const excipient = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  amount: z.string().nullable().default(null),
  flag: additiveFlag,
  source: z.string().nullable().default(null), // resolvable id — REQUIRED when flag is non-neutral
});

const retailLink = z.object({
  retailer: z.string().min(1),
  url: z.string().url(),
  price: z.number().nonnegative().nullable().default(null),
  last_checked: isoDate.nullable().default(null),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z
    .object({
      id: z.string().min(1),
      brand: z.string().min(1),
      // sentence/label case as printed; NO dose/strength (strength is structured — see below)
      name: z.string().min(1).refine((v) => !DOSE_IN_NAME.test(v), {
        message: 'product name must not contain a dose/strength — strength is the structured { amount, unit } field',
      }),
      strength: z.object({ amount: z.number().positive(), unit: z.string().min(1) }).nullable().default(null),
      composition,
      perIngredientAmountsDisclosed: z.boolean().nullable().default(null), // blends only; what the proprietary-blend penalty reads
      // deliveryForm null = needs-review (never invented); formStatus is coupled to it below.
      deliveryForm: deliveryForm.nullable().default(null),
      releaseProfile: releaseProfile.default('not-stated'),
      rawFormLabel: z.string().default(''), // original label wording, kept verbatim (plan §3)
      chemicalForm: z.string().nullable().default(null), // salt / standardised-extract, disentangled from deliveryForm (plan §2c)
      formStatus: z.enum(['mapped', 'needs-review']).default('needs-review'),
      ingredients: z.array(productIngredient).default([]),
      // --- the four product-score checks (an assessment about the BOTTLE, never a therapeutic
      // recommendation). null = not yet assessed — HONEST, never guessed (report, don't guess). ---
      dose_match: z.boolean().nullable().default(null),
      third_party_tested: z.object({ organisation: z.string().min(1), verified_date: isoDate }).nullable().default(null),
      label_discloses_all: z.boolean().nullable().default(null),
      proprietary_blend: z.boolean().nullable().default(null),
      form_matches_studied: z.boolean().nullable().default(null),
      price: money.nullable().default(null),
      pricePerNight: money.nullable().default(null), // derived
      dietary: z
        .object({
          sugarFree: z.boolean().nullable().default(null),
          glutenFree: z.boolean().nullable().default(null),
          vegan: z.boolean().nullable().default(null),
          artificialSweetenerPresent: z.boolean().nullable().default(null),
        })
        .nullable()
        .default(null),
      allergens: z.array(z.string()).default([]),
      excipients: z.array(excipient).default([]),
      howToTake: z.object({ timing: z.string(), withFood: z.string(), timeToKnow: z.string() }).nullable().default(null), // sourced from the STUDIES, never invented
      retail_links: z.array(retailLink).default([]), // where-to-buy row is identical regardless of score, never commercially ordered (routed via /go at B4)
      data_source: z.string().min(1),
      last_checked: isoDate.nullable().default(null),
      assessment_state: assessmentState,
      // Product photo under /images/products/, keyed by id. Owner-directed 2026-08-20 (private,
      // personal-use site): photos sourced from brand/retailer catalogues. null → the drawn
      // dose-form object (ProductObject) renders instead — never a broken-image state.
      image: z.string().regex(/^\/images\/products\//).nullable().default(null),
    })
    .superRefine((p, ctx) => {
      // RULES.md Products: a non-neutral additive flag CANNOT ship without a cited paper.
      p.excipients.forEach((e, i) => {
        if (e.flag !== 'no-known-concern' && !e.source) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['excipients', i, 'source'],
            message: `excipient "${e.name}" carries a non-neutral flag (${e.flag}) but no source id — a worth-knowing/documented-concern flag must cite its paper`,
          });
        }
      });
      // 'fully assessed' must mean the visible four checks are actually resolved (honesty of the
      // state). third_party_tested may legitimately be null ("not third-party tested" is an answer),
      // so it is not required; the three boolean checks are.
      if (p.assessment_state === 'fully assessed') {
        const missing = (
          [
            ['dose_match', p.dose_match],
            ['label_discloses_all', p.label_discloses_all],
            ['form_matches_studied', p.form_matches_studied],
          ] as const
        )
          .filter(([, v]) => v === null || v === undefined)
          .map(([k]) => k);
        if (missing.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['assessment_state'],
            message: `assessment_state 'fully assessed' but these checks are unresolved: ${missing.join(', ')}`,
          });
        }
      }
      // honesty coupling: a resolved deliveryForm ⇒ formStatus 'mapped'; null ⇒ 'needs-review'.
      if (p.deliveryForm && p.formStatus !== 'mapped') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['formStatus'], message: 'deliveryForm is set but formStatus is not "mapped"' });
      }
      if (!p.deliveryForm && p.formStatus !== 'needs-review') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['formStatus'], message: 'deliveryForm is null but formStatus is not "needs-review"' });
      }
    }),
});

const brands = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/brands' }),
  // A brand page derives a COUNT summary from its products, NEVER a brand grade (CLAUDE.md).
  // recalls[] renders a row ONLY when one exists.
  schema: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    product_list: z.array(z.string()).default([]), // product ids
    recalls: z
      .array(z.object({ date: isoDate, description: z.string().min(1), source: z.string().nullable().default(null) }))
      .default([]),
  }),
});

export const collections = { remedies, products, brands };
