// Per-remedy Open Graph image (CHK-2.2, the last Phase-2 thread). Build-time generated: satori turns
// a flexbox card into SVG, resvg rasterizes to PNG, one static image per remedy at /r/{slug}/og.png.
// Branded with the real design tokens (warm base, tier-color badge, Newsreader display + Hanken body)
// so every share surface — the tier board and home hero next — renders a share-ready card.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TierId } from '../../../lib/tiers';

export const prerender = true;

// design tokens (literal hex — satori needs real values, not CSS vars; these ARE the §1 tokens)
const INK = '#1A1A1F';
const INK_SOFT = '#4C4B52';
const INK_FAINT = '#726F63';
const BASE = '#F7F5F0';
const LAVENDER = '#8480C4';
const TIER: Record<TierId, { solid: string; ink: string; tint: string }> = {
  S: { solid: '#3D7A54', ink: '#2E6342', tint: '#E4EEE6' },
  A: { solid: '#6E8B3F', ink: '#566E2F', tint: '#ECEFDF' },
  B: { solid: '#94791F', ink: '#75600F', tint: '#F1ECD9' },
  C: { solid: '#A8682E', ink: '#864F1F', tint: '#F3E8DA' },
  D: { solid: '#AD5538', ink: '#8C4127', tint: '#F4E3DB' },
  F: { solid: '#9B5161', ink: '#7C3F4D', tint: '#F1E2E4' },
};

const fontFile = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

const fonts = [
  { name: 'Newsreader', data: fontFile('newsreader', 'newsreader-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
  { name: 'Hanken Grotesk', data: fontFile('hanken-grotesk', 'hanken-grotesk-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Hanken Grotesk', data: fontFile('hanken-grotesk', 'hanken-grotesk-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

// tiny hyperscript for satori element objects
const h = (style: Record<string, unknown>, children: unknown): any => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

function card(name: string, tier: TierId, dek: string) {
  const t = TIER[tier];
  return h(
    {
      width: '1200px',
      height: '630px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: BASE,
      padding: '68px 76px',
      fontFamily: 'Hanken Grotesk',
    },
    [
      // top row: wordmark + tier badge
      h({ justifyContent: 'space-between', alignItems: 'flex-start' }, [
        h({ fontFamily: 'Newsreader', fontSize: '34px', color: INK }, [
          h({}, 'somnary'),
          h({ color: LAVENDER }, '.'),
        ]),
        h(
          {
            width: '150px',
            height: '150px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '22px',
            backgroundColor: t.tint,
            border: `3px solid ${t.solid}`,
          },
          h({ fontFamily: 'Newsreader', fontSize: '96px', color: t.ink, lineHeight: 1 }, tier),
        ),
      ]),
      // middle: name + verdict
      h({ flexDirection: 'column' }, [
        h({ fontFamily: 'Newsreader', fontSize: '96px', color: INK, lineHeight: 1.02 }, [
          h({}, name),
          h({ color: LAVENDER }, '.'),
        ]),
        h(
          { fontSize: '34px', color: INK_SOFT, lineHeight: 1.4, marginTop: '26px', maxWidth: '960px' },
          dek,
        ),
      ]),
      // bottom strip: the disavowal tagline
      h({ fontSize: '22px', color: INK_FAINT, letterSpacing: '0.02em' },
        'somnary · evidence-graded sleep remedies · zero brand money'),
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
