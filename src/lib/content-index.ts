import { z } from 'zod';
import indexData from '../data/content-index.json';

/**
 * Content index — the single source of truth for what's PLANNED vs done (CHK-0.6,
 * PLAN §5). Every remedy, intervention, and context page is registered here with its
 * planned tier and research status. Later phases read this: the build checklist, the
 * search index (CHK-4), and the tier board all consult it. It is data, validated on
 * import so a malformed registry fails the build.
 *
 * researchStatus lifecycle: not-started → drafting → cited → reviewed → live.
 * plannedTier is null for context pages (ramelteon, "when to see a doctor"), which are
 * educational and NOT graded as remedies (PLAN §5a).
 */
const entrySchema = z.object({
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  kind: z.enum(['remedy', 'intervention', 'context']),
  aliases: z.array(z.string()), // synonyms + latin names → feeds search (CHK-4)
  plannedTier: z.enum(['S', 'A', 'B', 'C', 'D', 'F']).nullable(),
  researchStatus: z.enum(['not-started', 'drafting', 'cited', 'reviewed', 'live']),
  sourceCount: z.number().int().nonnegative(),
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

/** Entries already published (live) — what the homepage stat row will count once real. */
export const liveCount = countByStatus('live');
