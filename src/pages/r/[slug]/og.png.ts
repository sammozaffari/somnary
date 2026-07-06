// Per-remedy Open Graph image (CHK-2.2, the last Phase-2 thread). Build-time generated: satori turns
// a flexbox card into SVG, resvg rasterizes to PNG, one static image per remedy at /r/{slug}/og.png.
// Branded with the real design tokens (DESIGN_SYSTEM v2 evidence-teal: paper base, filled
// grade badge with white letter, Archivo display + IBM Plex Sans body) so every share
// surface renders a share-ready card.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TierId } from '../../../lib/tiers';

export const prerender = true;

// design tokens (literal hex — satori needs real values, not CSS vars; these ARE DESIGN_SYSTEM v2 §1)
const INK = '#091a18';
const MUTED = '#53635f';
const SOFT = '#7a8a86';
const PAPER = '#f5f7f3';
const PRIMARY = '#006b70';
// grade fill · darker gradient anchor · white letter (DESIGN_SYSTEM §3)
const GRADE: Record<TierId, { fill: string; anchor: string }> = {
  S: { fill: '#0d4f44', anchor: '#08382f' },
  A: { fill: '#0a6f5c', anchor: '#064d43' },
  B: { fill: '#006b70', anchor: '#004c50' },
  C: { fill: '#b87900', anchor: '#8f5e00' },
  D: { fill: '#b14a2b', anchor: '#8c3a21' },
  F: { fill: '#b82432', anchor: '#911c27' },
};

const fontFile = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

const fonts = [
  { name: 'Archivo', data: fontFile('archivo', 'archivo-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
  { name: 'Archivo', data: fontFile('archivo', 'archivo-latin-900-normal.woff'), weight: 900 as const, style: 'normal' as const },
  { name: 'IBM Plex Sans', data: fontFile('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'IBM Plex Sans', data: fontFile('ibm-plex-sans', 'ibm-plex-sans-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

// tiny hyperscript for satori element objects
const h = (style: Record<string, unknown>, children: unknown): any => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

function card(name: string, tier: TierId, dek: string) {
  const g = GRADE[tier];
  return h(
    {
      width: '1200px',
      height: '630px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      padding: '68px 76px',
      fontFamily: 'IBM Plex Sans',
    },
    [
      // top row: wordmark + grade badge (filled, white letter)
      h({ justifyContent: 'space-between', alignItems: 'flex-start' }, [
        h({ fontFamily: 'Archivo', fontWeight: 800, fontSize: '36px', color: INK, letterSpacing: '-0.04em' }, [
          h({}, 'Somnary'),
          h({ color: PRIMARY }, '.'),
        ]),
        h(
          {
            width: '150px',
            height: '150px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            background: `linear-gradient(145deg, ${g.fill}, ${g.anchor})`,
          },
          h({ fontFamily: 'Archivo', fontWeight: 900, fontSize: '104px', color: '#ffffff', lineHeight: 1, letterSpacing: '-0.06em' }, tier),
        ),
      ]),
      // middle: name + verdict
      h({ flexDirection: 'column' }, [
        h({ fontFamily: 'Archivo', fontWeight: 900, fontSize: '96px', color: INK, lineHeight: 1.0, letterSpacing: '-0.05em' }, [
          h({}, name),
          h({ color: PRIMARY }, '.'),
        ]),
        h(
          { fontSize: '34px', color: MUTED, lineHeight: 1.4, marginTop: '26px', maxWidth: '960px' },
          dek,
        ),
      ]),
      // bottom strip: the disavowal tagline
      h({ fontSize: '22px', color: SOFT, letterSpacing: '0.02em' },
        'Somnary · evidence-graded sleep remedies · zero brand money'),
    ],
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const remedies = await getCollection('remedies', (e) => !e.data.draft);
  return remedies.map((e) => ({
    params: { slug: e.id },
    props: { name: e.data.name, tier: e.data.tier, dek: e.data.oneLineVerdict },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { name, tier, dek } = props as { name: string; tier: TierId; dek: string };
  const svg = await satori(card(name, tier, dek), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
