// The ONE place affiliate tags would ever be applied (CHK-B4; REDESIGN Step 9 / A3). Today it is
// the identity function — launch links are plain outbound links, no commission. When/if affiliate
// revenue arrives it becomes a one-file change HERE, and per non-negotiable 1 (CLAUDE.md) + RULES.md
// Products it must STILL:
//   - never influence a score or the ORDER of results (the where-to-buy row is identical on a
//     well-scoring product and one we advise against);
//   - list and assess every product whether or not it carries a commercial link;
//   - carry an inline one-line disclosure at the link (A3), added alongside the tag here.
// Adding a tag is a code change to this function only — never an edit to content or product data.

/** Apply the retailer's affiliate parameters to an outbound URL. Identity at launch. */
export function applyAffiliate(url: string, _retailer: string): string {
  return url;
}
