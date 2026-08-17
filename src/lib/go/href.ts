// The ONE way a retail link URL is emitted (CHK-B4; REDESIGN Step 9 / A3). Content and
// components build buy links with goHref() → `/go/{product-id}?to={retailer}` and NEVER a raw
// retailer URL. The raw URLs live only in each product's structured `retail_links[]` (the
// registry the /go endpoint reads); scripts/check-go-links.mjs fails the build if a raw retailer
// URL appears in page content. Routing every link through /go is what makes adding affiliate tags
// later a ONE-FILE change (src/lib/go/affiliate.ts) instead of editing hundreds of pages — and it
// never changes a score or the order of results (RULES.md Products; CLAUDE.md non-negotiable 1).

/** Retail-link href for a product + optional retailer. `to` selects which retail_link; omitted →
 * the product's first (primary) link. Retailer is NOT personal data, so it is safe in the query. */
export function goHref(productId: string, retailer?: string): string {
  const base = `/go/${encodeURIComponent(productId)}`;
  return retailer ? `${base}?to=${encodeURIComponent(retailer)}` : base;
}
