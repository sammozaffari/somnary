import { z } from 'zod';
import indexData from '../data/content-index.json';

/**
 * Content index — the single source of truth for what's PLANNED vs done (CHK-0.6,
 * PLAN §5). Every remedy, intervention, and context page is registered here with its
 * planned tier and research status. Later phases read this: the build checklist, the
 * search index (CHK-4), and the tier board all consult it. It is data, validated on
 * import so a malformed registry fails the build.
 *
 * researchStatus lifecycle: not-started → researching → drafting → cited → reviewed → live.
 * plannedTier is null for context pages (ramelteon, "when to see a doctor"), which are
 * educational and NOT graded as remedies (PLAN §5a).
 *
 * plannedTier is a PROVISIONAL research hypothesis to prioritize work — NEVER the published
 * grade. The live grade is assigned only after the source-first, two-pass process (PLAN §9) and
 * comes from the remedy's own researched, cited page. A provisional tier may move once the
 * evidence is actually read. Hedged seed values ("B/C") collapse to the primary letter here; the
 * nuance lives in `notes`. See docs/CONTENT_INDEX.md (the human-readable worklist this mirrors).
 */
const entrySchema = z.object({
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  kind: z.enum(['remedy', 'intervention', 'context']),
  aliases: z.array(z.string()), // synonyms + latin names → feeds search (CHK-4)
  latin: z.string().nullable().default(null), // binomial / chemical name (its own search field)
  category: z.string().default(''), // mineral · amino acid · botanical · behavioral · context …
  plannedTier: z.enum(['S', 'A', 'B', 'C', 'D', 'F']).nullable(), // provisional hypothesis, NOT a grade
  researchStatus: z.enum(['not-started', 'researching', 'drafting', 'cited', 'reviewed', 'live']),
  sourceCount: z.number().int().nonnegative(),
  // Highest-value evidence to pull first (source hierarchy). UNVERIFIED research lead — every
  // PMID/DOI here is checked against PubMed only when the actual page is built (as melatonin's were);
  // it must never be copied to a live page as a citation without that check ("0 hallucinated cites").
  sourceTarget: z.string().nullable().default(null),
  notes: z.string().nullable().default(null), // honest-treatment / provisional-tier nuance
});

export type ContentIndexEntry = z.infer<typeof entrySchema>;
export type ResearchStatus = ContentIndexEntry['researchStatus'];

// Validate at import (build time). Unique slugs enforced so two pages can't collide.
export const contentIndex: ContentIndexEntry[] = z
  .array(entrySchema)
  .superRefine((entries, ctx) => {
    const seen = new Set<string>();
    for (const e of entries) {
      if (seen.has(e.slug)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `duplicate slug "${e.slug}"` });
      }
      seen.add(e.slug);
    }
  })
  .parse(indexData);

export const plannedCount = contentIndex.length;

export const countByKind = (kind: ContentIndexEntry['kind']): number =>
  contentIndex.filter((e) => e.kind === kind).length;

export const countByStatus = (status: ResearchStatus): number =>
  contentIndex.filter((e) => e.researchStatus === status).length;

/** Entries already published (live), any kind. */
export const liveCount = countByStatus('live');

/**
 * Live GRADED remedies/interventions — excludes `context` pages (explainers like /sleep-blends,
 * educational pages) which are published but carry no evidence grade. This is the honest count
 * behind the "remedies graded" stat: a context explainer isn't a graded remedy.
 */
export const liveRemedyCount = contentIndex.filter(
  (e) => e.researchStatus === 'live' && e.kind !== 'context',
).length;
