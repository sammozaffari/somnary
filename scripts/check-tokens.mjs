#!/usr/bin/env node
/**
 * Token linter — enforces the "tokens only, never raw values" guardrail
 * (DESIGN_SYSTEM.md v2 §10; CHK-0.2). Scans source for two hard failures and
 * one warning:
 *
 *   FAIL 1 · retired v1.2 token names (base, sunken, line-strong, ink-soft,
 *            ink-faint, lavender/sage and their -ink/-tint, tier-{s..f}). The
 *            evidence-teal migration renamed these; the legacy aliases are
 *            gone, so any use is a bug.
 *   FAIL 2 · hardcoded color hex (#rgb/#rrggbb/#rrggbbaa) outside the token
 *            definition files. Colors must come from named tokens. White/black
 *            (#fff/#ffffff/#000/#000000) are allowed as on-color/shadow ink.
 *   WARN   · raw px on spacing properties (padding/margin/gap) — should use
 *            var(--sp-*). Reported, not fatal (the type/badge dimension system
 *            carries some intentional off-scale px); tighten to fatal later.
 *
 *   node scripts/check-tokens.mjs      # exit 1 on any FAIL. Wired as prebuild.
 *
 * Token DEFINITIONS legitimately hold raw values and are exempt: the Tailwind
 * theme, the global stylesheet, and the OG generator (satori needs literals).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = 'src';
const EXEMPT = new Set([
  'src/styles/global.css',
  'src/pages/r/[slug]/og.png.ts',
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
const SPACING_PX = /\b(?:padding|margin|gap|padding-(?:top|right|bottom|left)|margin-(?:top|right|bottom|left)|row-gap|column-gap)\s*:\s*[^;{}]*?\b\d+px/;

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
const warns = [];

for (const file of await walk(ROOT)) {
  if (EXEMPT.has(file)) continue;
  const src = await readFile(file, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const ln = i + 1;
    for (const re of RETIRED_STRICT) {
      const m = line.match(re);
      if (m) fails.push(`${file}:${ln}  retired token "${m[0]}"`);
    }
    for (const m of line.matchAll(HEX)) {
      if (!HEX_OK.test(m[0])) fails.push(`${file}:${ln}  hardcoded hex "${m[0]}" — use a token`);
    }
    if (SPACING_PX.test(line)) warns.push(`${file}:${ln}  raw px spacing — prefer var(--sp-*): ${line.trim().slice(0, 70)}`);
  });
}

if (warns.length) {
  console.warn(`\n⚠  ${warns.length} spacing warning(s):`);
  for (const w of warns) console.warn('   ' + w);
}
if (fails.length) {
  console.error(`\n✖ token linter: ${fails.length} error(s)\n`);
  for (const f of fails) console.error('   ' + f);
  console.error('\nSee DESIGN_SYSTEM.md v2 §1/§10 for the token vocabulary.\n');
  process.exit(1);
}
console.log(`✓ token linter: no retired tokens or hardcoded colors (${warns.length} spacing warning(s)).`);
