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

// The strip shared by every share surface.
// RULES.md Language — this line USED to read "Somnary · evidence-graded sleep remedies · zero
// brand money", which contains TWO banned phrases ("evidence-graded", "zero brand money") and
// shipped on every share card the site produced. A share card is user-facing copy and is held to
// exactly the same bar as a page. Replaced at CHK-B16 with the quiet claim the charter allows.
export const OG_TAGLINE = 'Somnary · every claim links to the study it came from';

const fontFile = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

// ONEST — the site's one family (RULES.md Identity / the CHK-B1 type lock). Swapped from
// Instrument Sans at CHK-B16, which DESIGN_SYSTEM.md had recorded as this item's explicit
// acceptance criterion: the pages render Onest, so a share card in a different typeface is the
// one surface where the type lock silently didn't hold.
// satori needs woff/ttf, not the woff2 the pages self-host, so the static @fontsource weights are
// read here. This REPLACES the instrument-sans dependency rather than adding to it.
export const fonts = [
  { name: 'Onest', data: fontFile('onest', 'onest-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Onest', data: fontFile('onest', 'onest-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Onest', data: fontFile('onest', 'onest-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
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
