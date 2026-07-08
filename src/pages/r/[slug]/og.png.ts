// Per-remedy Open Graph image (CHK-2.2, the last Phase-2 thread). Build-time generated: satori turns
// a flexbox card into SVG, resvg rasterizes to PNG, one static image per remedy at /r/{slug}/og.png.
// Branded with the real design tokens (DESIGN_SYSTEM v3 warm/oxblood: warm paper base, filled
// grade badge with white letter, Instrument Sans display + body) so every share
// surface renders a share-ready card.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TierId } from '../../../lib/tiers';

export const prerender = true;

// design tokens (literal hex — satori needs real values, not CSS vars; these ARE DESIGN_SYSTEM v3 §1)
const INK = '#171512';
const MUTED = '#5C574F';
const SOFT = '#8C867B';
const PAPER = '#FCFAF2';
const PRIMARY = '#7E1F2B';
// grade fill · darker gradient anchor · white letter (DESIGN_SYSTEM §3)
const GRADE: Record<TierId, { fill: string; anchor: string }> = {
  S: { fill: '#274B3F', anchor: '#1B3A30' },
  A: { fill: '#3F6A57', anchor: '#2E5343' },
  B: { fill: '#47695A', anchor: '#35564A' },
  C: { fill: '#B0791F', anchor: '#8A5D12' },
  D: { fill: '#A65A2E', anchor: '#82441F' },
  F: { fill: '#96323E', anchor: '#77232D' },
};

const fontFile = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

// Instrument Sans (static @fontsource weights) for display + body; caps at 700.
const fonts = [
  { name: 'Instrument Sans', data: fontFile('instrument-sans', 'instrument-sans-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Instrument Sans', data: fontFile('instrument-sans', 'instrument-sans-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Instrument Sans', data: fontFile('instrument-sans', 'instrument-sans-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
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
      fontFamily: 'Instrument Sans',
    },
    [
      // top row: wordmark + grade badge (filled, white letter)
      h({ justifyContent: 'space-between', alignItems: 'flex-start' }, [
        h({ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '36px', color: INK, letterSpacing: '-0.04em' }, [
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
          h({ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '104px', color: '#ffffff', lineHeight: 1, letterSpacing: '-0.06em' }, tier),
        ),
      ]),
      // middle: name + verdict
      h({ flexDirection: 'column' }, [
        h({ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '96px', color: INK, lineHeight: 1.0, letterSpacing: '-0.05em' }, [
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
