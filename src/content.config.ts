import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * somnary content model — the single structured source the tier board, stack builder,
 * search index and Ask assistant all read (CLAUDE.md "Tech decisions"). Authored as MDX
 * with this Zod schema validating frontmatter on every build. There is no schema-less or
 * plain-Markdown stage.
 *
 * A remedy = { tier, verdict, claims[], data[], doses[], safety[], standardization,
 * mechanism, sources[], aliases[] } per CLAUDE.md. `claims[]` and `data[]` are modeled as
 * one paired `claims` array (claimed ↔ studiesShow) because the signature claims-vs-data
 * table (DESIGN_SYSTEM §2.4) is inherently row-paired with a per-row citation.
 */

const tier = z.enum(['S', 'A', 'B', 'C', 'D', 'F']);

/**
 * A citation, stored as DATA not prose (CLAUDE.md "Citations are DATA"): each carries a
 * resolvable identifier so links can be auto-validated. At least one of pmid / doi /
 * registry MUST be present — this is what makes "0 hallucinated cites" enforceable
 * (the CHK-0.5 resolver re-checks the same rule). Formats are pre-validated here so a
 * malformed identifier fails the build at schema time.
 */
const source = z
  .object({
    n: z.number().int().positive(), // footnote number, referenced by claims[].sources
    title: z.string(),
    sourceLine: z.string(), // journal · authors · year
    finding: z.string(), // plain-language what-it-found (citation popover body)
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

const riskRow = z.object({ category: z.string(), text: z.string() });

/** Safety & interactions — surfaced prominently, never fine print (CLAUDE.md medical safety). */
const safety = z.object({
  severity: z.enum(['caution', 'serious']), // → .sev-caution / .sev-serious (DESIGN §2.12)
  lead: z.string(),
  risks: z.array(riskRow).default([]),
  pregnancy: z.string(),
  interactions: z.array(z.string()).default([]),
});

const remedies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/remedies' }),
  schema: z
    .object({
      tier,
      name: z.string(), // lowercase in UI
      aliases: z.array(z.string()).default([]), // synonyms + latin names → search
      oneLineVerdict: z.string(),
      verdict: z.string(), // 2–3 sentence verdict block
      keyCompound: z.string().nullable().default(null),
      bestFor: z.array(z.string()).default([]),
      outcomes: z.array(z.string()).default([]), // search field
      symptoms: z.array(z.string()).default([]), // search field
      claims: z.array(claimRow).default([]),
      evidenceGates: z.array(evidenceGate).default([]),
      doses: z.array(dose).default([]),
      safety,
      standardization: z.string(),
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
      draft: z.boolean().default(false),
    })
    // Integrity: every footnote a claim points to must exist in sources[].
    .superRefine((data, ctx) => {
      const known = new Set(data.sources.map((s) => s.n));
      data.claims.forEach((c, ci) => {
        c.sources.forEach((ref) => {
          if (!known.has(ref)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['claims', ci, 'sources'],
              message: `claim references source [${ref}] which is not in sources[]`,
            });
          }
        });
      });
    }),
});

export const collections = { remedies };
