// Shared Open Graph card machinery (satori → SVG → resvg → PNG). Both the per-remedy card
// (/r/{slug}/og.png) and the site-wide default card (/og.png) render from here so the brand
// tokens and wordmark live in ONE place — that is what stops an outward-facing asset drifting
// out of sync (the earlier per-remedy card still carried the retired `Somnary.` trailing-period
// wordmark, dropped per CLAUDE.md D3 amendment 2026-07-08).
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TierId } from './tiers';

// Design tokens (literal hex — satori needs real values, not CSS vars; these ARE DESIGN_SYSTEM v3 §1)
export const INK = '#171512';
export const MUTED = '#5C574F';
export const SOFT = '#8C867B';
export const PAPER = '#FCFAF2';
export const PRIMARY = '#7E1F2B';
export const PRIMARY_DEEP = '#661722';

// Grade fill · darker gradient anchor · white letter (DESIGN_SYSTEM §3)
export const GRADE: Record<TierId, { fill: string; anchor: string }> = {
  S: { fill: '#274B3F', anchor: '#1B3A30' },
  A: { fill: '#3F6A57', anchor: '#2E5343' },
  B: { fill: '#47695A', anchor: '#35564A' },
  C: { fill: '#8F5E12', anchor: '#6E470E' },
  D: { fill: '#9A4F28', anchor: '#78401F' },
  F: { fill: '#96323E', anchor: '#77232D' },
};

// The disavowal strip shared by every share surface (DESIGN_SYSTEM voice: describe evidence, no hype).
export const OG_TAGLINE = 'Somnary · evidence-graded sleep remedies · zero brand money';

const fontFile = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

// Instrument Sans (static @fontsource weights) for display + body; caps at 700 (all-sans site-wide).
export const fonts = [
  { name: 'Instrument Sans', data: fontFile('instrument-sans', 'instrument-sans-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Instrument Sans', data: fontFile('instrument-sans', 'instrument-sans-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Instrument Sans', data: fontFile('instrument-sans', 'instrument-sans-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
];

// Tiny hyperscript for satori element objects.
export const h = (style: Record<string, unknown>, children: unknown): any => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

// The wordmark — plain "Somnary" in ink, NO trailing period (CLAUDE.md D3, amended 2026-07-08:
// the `Somnary.` trailing-period form is retired). Sized by the caller.
export const wordmark = (fontSize: string) =>
  h({ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize, color: INK, letterSpacing: '-0.04em' }, 'Somnary');

// Render a satori element tree to a 1200×630 PNG buffer.
export async function toPng(element: unknown): Promise<Buffer> {
  const svg = await satori(element as any, { width: 1200, height: 630, fonts });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}
