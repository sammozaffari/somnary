// /go/{product-id} — the server-side retail redirect (CHK-B4; REDESIGN Step 9 / A3). This is the
// ONLY way a retail link resolves: content emits `/go/{id}?to={retailer}` via goHref()/RetailLink,
// and this endpoint 302-redirects to the URL held in that product's structured `retail_links[]`.
// Raw retailer URLs never live in page content (scripts/check-go-links.mjs enforces it).
//
// It links EVERY product, including ones we advise against — identical treatment, no score or
// ordering ever consulted here (RULES.md Products; A3). Affiliate tags, if they ever arrive, are a
// one-file change in src/lib/go/affiliate.ts. The click log captures product_id + retailer ONLY —
// NO personal data: the request is never inspected for IP, headers, cookies, or a user (Step 9).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { applyAffiliate } from '../../lib/go/affiliate.ts';
import { logGoClick } from '../../lib/go/click-log.ts';

// Server-rendered (the site is static by default): a real 302 needs a function, not prerendered HTML.
export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const productId = params.id ?? '';
  // retailer is a non-personal selector (never personal data in the query — privacy rule)
  const wanted = url.searchParams.get('to') ?? undefined;

  const products = await getCollection('products');
  const product = products.find((p) => p.id === productId);
  if (!product || product.data.retail_links.length === 0) {
    return new Response('No retail link for this product.', { status: 404 });
  }

  const links = product.data.retail_links;
  const link = (wanted && links.find((l) => l.retailer === wanted)) || links[0];

  // click log — product_id + retailer ONLY, fail-open (never blocks the redirect), no PII read.
  await logGoClick(product.id, link.retailer);

  // the ONE place a future affiliate tag is applied — never changes a score or the order
  return Response.redirect(applyAffiliate(link.url, link.retailer), 302);
};
