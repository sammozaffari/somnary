// The evidence-bucket definitions — the single source of the plain labels + PERMANENT plain
// sentences (RULES.md: each bucket always renders with its explanatory sentence). Kept in a .ts
// module so BucketBadge.astro and any consumer (browse, how-we-grade) read ONE map.
//
// RULE (locked, from the bundle kit): a bucket describes ONLY what the research shows about
// effectiveness. Safety NEVER moves a bucket. "Tested — doesn't seem to help sleep" (avoid)
// requires papers that MEASURED sleep and found no effect — kava (0 sleep papers, serious safety
// concern) sits in "unknown", with the safety flag carrying the warning.
export const BUCKETS = {
  works:   { plain: 'Helps most people sleep',             evidence: 'Strong evidence',     color: 'var(--bucket-works)',   tint: 'var(--bucket-works-tint)',   sentence: 'Solid studies show a real, if modest, benefit for most adults.' },
  maybe:   { plain: 'May help sleep a little',             evidence: 'Some evidence',       color: 'var(--bucket-maybe)',   tint: 'var(--bucket-maybe-tint)',   sentence: 'A few studies point to a small benefit; it may not do much for you.' },
  unknown: { plain: 'Not properly tested for sleep',       evidence: 'Not enough evidence', color: 'var(--bucket-unknown)', tint: 'var(--bucket-unknown-tint)', sentence: "The research hasn't been done — that's a gap in the studies, not a verdict on the remedy." },
  avoid:   { plain: "Tested — doesn't seem to help sleep", evidence: 'Avoid',               color: 'var(--bucket-avoid)',   tint: 'var(--bucket-avoid-tint)',   sentence: 'Decent studies looked and found little or no benefit for sleep.' },
} as const;

export type BucketKey = keyof typeof BUCKETS;
