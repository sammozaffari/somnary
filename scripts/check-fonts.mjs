#!/usr/bin/env node
/**
 * Font gate (DESIGN_SYSTEM.md "TYPE LOCK"; CLAUDE.md design rules). Fonts are
 * SELF-HOSTED — no Google Fonts, no Fontshare, no third-party font CDN. A CDN font
 * is render-blocking and a GDPR consideration for EU readers (it leaks the reader's
 * IP to the font host). FATAL (exit 1) on any third-party font reference in src.
 *
 * Self-hosting via a local `@font-face` over `public/fonts/` is fine and is NOT
 * flagged; only remote font hosts / font `@import`s are. (An `@fontsource` npm
 * import is also self-hosted and not a CDN, so it does not match.)
 *
 *   node scripts/check-fonts.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = 'src';
const EXT = /\.(astro|ts|tsx|js|mjs|css|html|json)$/;
const BANNED = [
  [/fonts\.googleapis\.com/i, 'Google Fonts CSS CDN'],
  [/fonts\.gstatic\.com/i, 'Google Fonts file CDN'],
  [/(?:api|cdn|www)\.fontshare\.com/i, 'Fontshare CDN'],
  [/use\.typekit\.net/i, 'Adobe Typekit CDN'],
  [/@import\s+url\([^)]*font[^)]*\)/i, 'font @import (self-host with @font-face instead)'],
];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const fails = [];
for (const file of await walk(ROOT)) {
  const src = await readFile(file, 'utf8');
  src.split('\n').forEach((line, i) => {
    for (const [re, label] of BANNED) {
      if (re.test(line)) fails.push(`${file}:${i + 1}  ${label}`);
    }
  });
}

if (fails.length) {
  console.error(`\n✖ font gate: ${fails.length} third-party font reference(s)\n`);
  for (const f of fails) console.error('   ' + f);
  console.error('\nSelf-host fonts (DESIGN_SYSTEM.md TYPE LOCK): woff2 in public/fonts/,');
  console.error('a local @font-face, and <link rel="preload"> for the weights used.\n');
  process.exit(1);
}
console.log('✓ font gate: no third-party font CDN references (self-hosted only).');
