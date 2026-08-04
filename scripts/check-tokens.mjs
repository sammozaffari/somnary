#!/usr/bin/env node
/**
 * Token linter — enforces the "tokens only, never raw values" guardrail
 * (DESIGN_SYSTEM.md v3 §10; CHK-0.2). EVERY finding below is FATAL (exit 1).
 *
 * A raw value is legal ONLY if it is justified: the offending line — or the line
 * directly above it — must carry a `raw-ok:` comment naming the reason (CMP-04).
 * That keeps the gate honest. Intentional off-scale values do exist (badge/chip
 * geometry, 1px hairline seams, sr-only clip rects, viewport-relative overlays,
 * luminance-mask anchors, generated inline dimensions); each is accounted for and
 * greppable, and everything unjustified fails. A gate that passes while the
 * contract is violated is worse than no gate — this one used to exit 0 on 32 raw
 * spacing values and never looked at font-size, rgba, radii, or generated inline
 * literals at all. It does now.
 *
 * Checks (all fatal unless justified with a nearby `raw-ok:`):
 *   1 · retired v1.2 token names (base, sunken, line-strong, ink-*, lavender/sage,
 *       tier-{s..f}). NEVER justifiable — a retired name is always a bug, so this
 *       check ignores raw-ok.
 *   2 · hardcoded color hex (#rgb..#rrggbbaa). White/black (#fff/#000) stay allowed
 *       as on-color / shadow / mask ink.
 *   3 · rgba()/rgb()/hsla()/hsl() color literals.
 *   4 · raw font-size — a literal px/em/rem, or a generated ${...}px|em|rem.
 *   5 · raw border-radius — a literal px/%/em/rem (use var(--r-*)).
 *   6 · raw px on box spacing (padding/margin/gap/row-gap/column-gap), value >= 4px.
 *       Sub-step px (1/2/3px, negative clips) sit BELOW the 4px token scale and cannot be
 *       expressed as a --sp-* token — they are hairlines, optical nudges and sr-only clip
 *       rects, allowed the same documented way #fff/#000 are allowed for colour. scroll-margin
 *       is a scroll anchor, not box spacing, and is not flagged.
 *
 *   node scripts/check-tokens.mjs      # exit 1 on any unjustified raw value. Wired as prebuild.
 *
 * Token DEFINITIONS legitimately hold raw values and are exempt: the global
 * stylesheet (the token source of truth) and the OG generators (satori needs literals).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = 'src';
const EXEMPT = new Set([
  'src/styles/global.css',
  'src/lib/og.ts', // shared OG card tokens/machinery — satori needs literal hex
  'src/pages/r/[slug]/og.png.ts',
  'src/pages/og.png.ts', // site-wide default OG card
]);
const EXT = /\.(astro|ts|tsx|js|mjs|css)$/;

// Retired color words. `base` is handled separately: it must NOT match the `text-`
// prefix (that collides with the `text-base` font-size utility and the `--text-base`
// type token, both current) — only `--base` and `bg-/border-/…-base` color utils are retired.
const COLOR = 'sunken|line-strong|ink-soft|ink-faint|lavender(?:-ink|-tint)?|sage(?:-ink|-tint)?|tier-[sabcdf](?:-ink|-tint)?';
const RETIRED_STRICT = [
  new RegExp(`--(?:base|${COLOR})\\b`),                                              // CSS vars, incl --base
  new RegExp(`\\b(?:bg|border|ring|from|to|divide|decoration|fill|stroke)-(?:base|${COLOR})\\b`), // color utils, incl -base
  new RegExp(`\\btext-(?:${COLOR})\\b`),                                             // text-* color utils, EXCLUDING base
];
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const HEX_OK = /^#(?:fff|ffffff|000|000000)$/i;
const COLOR_FN = /\b(?:rgba?|hsla?)\s*\(/;                                            // rgb/rgba/hsl/hsla literal
const FONT_SIZE = /font-size\s*:\s*[^;]*?(?:\d+(?:\.\d+)?\s*(?:px|em|rem)\b|\$\{[^}]*\}\s*(?:px|em|rem)\b)/; // literal OR generated
const RADIUS = /border-radius\s*:\s*[^;]*?\d+(?:\.\d+)?\s*(?:px|%|em|rem)\b/;          // literal radius
// box spacing only; the negative lookbehind keeps `scroll-margin-top` (a scroll anchor,
// not box spacing) from matching the `margin-top` inside it. The value is inspected in JS so
// only px >= 4 (the smallest --sp-* step) is flagged; sub-step/negative px is below the scale.
const SPACING_PROP = /(?<![-\w])(?:padding|margin|gap|row-gap|column-gap|padding-(?:top|right|bottom|left)|margin-(?:top|right|bottom|left))\s*:\s*([^;{}]*)/;
const spacingHasRawScale = (line) => {
  const m = line.match(SPACING_PROP);
  if (!m) return false;
  // flag any non-negative literal px >= 4 (negatives are clips, sub-step is below the scale)
  return [...m[1].matchAll(/(-?)(\d+)px/g)].some(([, sign, n]) => sign !== '-' && Number(n) >= 4);
};

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const fails = [];
let exemptions = 0;

for (const file of await walk(ROOT)) {
  if (EXEMPT.has(file)) continue;
  const src = await readFile(file, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const ln = i + 1;

    // #1 retired tokens — never justifiable.
    for (const re of RETIRED_STRICT) {
      const m = line.match(re);
      if (m) fails.push(`${file}:${ln}  retired token "${m[0]}"`);
    }

    // A raw value is legal if this line, or the line directly above it, is justified.
    const justified = /raw-ok/.test(line) || (i > 0 && /raw-ok/.test(lines[i - 1]));

    const raw = [];
    for (const m of line.matchAll(HEX)) {
      if (!HEX_OK.test(m[0])) raw.push(`hardcoded hex "${m[0]}" — use a token`);
    }
    if (COLOR_FN.test(line)) raw.push('raw color literal (rgba/rgb/hsl) — use a token');
    if (FONT_SIZE.test(line)) raw.push('raw font-size — use var(--text-*)');
    if (RADIUS.test(line)) raw.push('raw border-radius — use var(--r-*)');
    if (spacingHasRawScale(line)) raw.push('raw px spacing (>=4px) — use var(--sp-*)');

    if (raw.length) {
      if (justified) exemptions += raw.length;
      else for (const r of raw) fails.push(`${file}:${ln}  ${r}`);
    }
  });
}

if (fails.length) {
  console.error(`\n✖ token linter: ${fails.length} error(s)  (${exemptions} raw-ok exemption(s) honored)\n`);
  for (const f of fails) console.error('   ' + f);
  console.error('\nFix: use a token, or justify a deliberate off-scale value with a nearby');
  console.error('`raw-ok: <reason>` comment. See DESIGN_SYSTEM.md v3 §1/§10.\n');
  process.exit(1);
}
console.log(`✓ token linter: no unjustified raw values (${exemptions} raw-ok exemption(s) honored).`);
