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
- The image area is a **fixed `aspect-ratio: 1 / 1`** box with `object-fit: contain` — identical for a
  real photo or a lettered fallback tile, so the container never changes size. (Square keeps a portrait
  supplement bottle and a squat tub the same footprint, and matches the lettered fallback tile.)
- No per-card min/max-width, no one-off padding. Spacing comes only from the shared component + tokens.

## Product images (never pixelated)

- **Source at ≥ 1000 px on the long edge.** Grab the largest the retailer offers:
  - iHerb (Cloudinary): the `/l/` (large) variant, or bump the transform to `w_1200` and drop
    `q_auto:eco` → use `q_auto:good`.
  - Chemist Warehouse: try `…/pi/<sku>/2DF_1000.jpg` (and larger) before `2DF_800.jpg`.
  - Shopify brand sites: append `&width=1200` to the `cdn/shop/...` URL.
  - Amazon: use the `._SL1500_.` (or `._SL1200_.`) size token, not `._AC_.`.
- **Never upscale.** `sips -Z <n>` enlarges anything smaller than `<n>` — forbidden (it's what produced the
  mushy first pass). It resizes **down only** when you guard it: read the width first and skip the resize if
  the source is already at/under target — `w=$(sips -g pixelWidth f | grep -o '[0-9]*$'); [ "$w" -gt 1000 ] && sips -Z 1000 f`.
  (`--resampleWidthMax` is a no-op on this macOS build — don't rely on it.) If a source can't reach ~700 px,
  DON'T ship a blurry version — use the lettered fallback tile instead and note it.
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
# convert to jpeg, then downscale-only to 1000px long edge — guard so sips never UPSCALES
sips -s format jpeg <slug>.jpg >/dev/null
w=$(sips -g pixelWidth <slug>.jpg | grep -o '[0-9]*$'); [ "$w" -gt 1000 ] && sips -Z 1000 <slug>.jpg >/dev/null
# verify: must be >= ~700px wide and > ~80KB, else re-source (or use the fallback tile)
sips -g pixelWidth -g pixelHeight <slug>.jpg
```

Check the built page at 3-across and zoom a card image before calling it done.
