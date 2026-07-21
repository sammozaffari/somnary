# Source-scorecard UI — non-negotiable build rules

These rules keep the `/sources/<remedy>` pages consistent and agency-grade. They are binding for the
shared components (`src/components/scorecards/*`) and for every product image. Do not ship a scorecard
change that breaks one of these.

## Card containers (uniform size)

- Cards render in a CSS grid (`ScorecardGrid.astro`): **3 across desktop → 2 at ≤900px → 1 at ≤560px**.
- **Every card in a row is the same height.** Use `align-items: stretch` on the grid (never `start`).
- The card is a flex column; the image sits on top, the content below, and the **"Why these scores"
  toggle is pinned to the bottom of every card** (`.why { margin-top: auto }`) so the toggles line up
  across a row regardless of how long a product's bottom line is.
- The image area is a **fixed `aspect-ratio: 4 / 3`** box with `object-fit: contain` — identical for a
  real photo or a lettered fallback tile, so the container never changes size.
- No per-card min/max-width, no one-off padding. Spacing comes only from the shared component + tokens.

## Product images (never pixelated)

- **Source at ≥ 1000 px on the long edge.** Grab the largest the retailer offers:
  - iHerb (Cloudinary): the `/l/` (large) variant, or bump the transform to `w_1200` and drop
    `q_auto:eco` → use `q_auto:good`.
  - Chemist Warehouse: try `…/pi/<sku>/2DF_1000.jpg` (and larger) before `2DF_800.jpg`.
  - Shopify brand sites: append `&width=1200` to the `cdn/shop/...` URL.
  - Amazon: use the `._SL1500_.` (or `._SL1200_.`) size token, not `._AC_.`.
- **Never upscale.** `sips -Z` enlarges anything smaller than the target — forbidden. Resize **down only**:
  `sips --resampleWidthMax 800 <file>` shrinks only if wider, leaves smaller images untouched. If a source
  can't reach ~700 px, DON'T ship a blurry version — use the lettered fallback tile instead and note it.
- **Standard output: 1000 px on the long edge, JPEG.** 1000 px covers 2× retina for the largest render
  (single-column mobile, ~500 px CSS). A real 1000 px product photo is ~100–200 KB; anything much smaller
  is a red flag that the source was low-res (re-source it).
- Keep the same filename per slug (`public/images/sources/<remedy>/<slug>.jpg`) so the data `imagePath`
  is stable.
- A card with no clean ≥700 px source keeps its **lettered fallback tile** — which is a designed state,
  not a failure. Better a clean initial tile than a mushy photo.

## Quick recipe (per image)

```
# fetch the HIGH-RES source (example patterns)
curl -sL -A 'Mozilla/5.0' -o <slug>.jpg '<high-res source url>'
# downscale-only to 800px long edge, convert to jpeg
sips -s format jpeg --resampleWidthMax 800 <slug>.jpg >/dev/null
# verify: must be >= ~600px wide and > ~40KB, else re-source
sips -g pixelWidth -g pixelHeight <slug>.jpg
```

Check the built page at 3-across and zoom a card image before calling it done.
