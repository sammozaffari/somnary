#!/usr/bin/env node
/**
 * Display-name gate (CLAUDE.md content model). Every remedy carries an explicit,
 * authored `displayName` — display names are NOT derivable from slugs (a title-cased
 * slug renders "Tart-cherry" / "5-htp" / "Magnolia-bark" wrong). The schema already
 * makes displayName required; this gate adds what Zod can't express:
 *
 *   1 · Present + non-empty on every remedy (belt-and-suspenders with the schema).
 *   2 · Re-casing invariant: displayName must contain the SAME letters/digits as its
 *       slug, in order — i.e. it only RE-CASES the slug's own tokens (adds case,
 *       spaces, scientific hyphens), never invents or drops characters. This catches
 *       a typo, a wrong-remedy paste, or an arbitrary value, while allowing every
 *       legitimate form: "5-HTP", "L-theanine", "Vitamin D", "Tart cherry", "CBT-I".
 *   3 · Render-layer guard: the remedy page must NOT title-case the slug/id into a
 *       name. That is the exact "silent fallback to a title-cased slug" this field
 *       exists to prevent — the page reads `displayName`, never derives from `id`.
 *
 * FATAL (exit 1) on any violation.  node scripts/check-displaynames.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'src/content/remedies';
// The greenfield remedy page. Was `src/pages/r/[slug].astro` until CHK-B18 deleted the old
// presentation layer — the gate guards whichever page RENDERS a remedy, and that is now this one.
const REMEDY_PAGE = 'src/pages/remedies/[slug].astro';

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const slugKey = (slug) => slug.replace(/-/g, '');

const fails = [];

const files = (await readdir(DIR)).filter((f) => f.endsWith('.mdx'));
if (files.length === 0) fails.push(`${DIR}: no remedy .mdx files found`);

for (const f of files) {
  const slug = f.replace(/\.mdx$/, '');
  const src = await readFile(join(DIR, f), 'utf8');
  const m = src.match(/^displayName:\s*(.+?)\s*$/m);
  const raw = m ? m[1].replace(/^["']|["']$/g, '').trim() : '';
  if (!raw) {
    fails.push(`${slug}: missing or empty displayName — author one (never a title-cased slug)`);
    continue;
  }
  if (norm(raw) !== slugKey(slug)) {
    fails.push(
      `${slug}: displayName "${raw}" is not a re-casing of the slug ` +
        `(normalised "${norm(raw)}" ≠ "${slugKey(slug)}") — it must re-case the slug's own tokens, not invent characters`,
    );
  }
  // A slug seam: a hyphen right after a lowercase letter ("Tart-cherry", "Lemon-balm").
  // Scientific hyphens follow a capital or digit ("L-theanine", "5-HTP", "CBT-I"), so a
  // lowercase-then-hyphen is a title-cased slug that should be a space.
  if (/[a-z]-/.test(raw)) {
    fails.push(
      `${slug}: displayName "${raw}" keeps a slug hyphen (lowercase letter then "-") — ` +
        `use a space ("Tart cherry"); a scientific hyphen may follow only a capital or digit`,
    );
  }
  // A title-cased interior word ("Tart Cherry") is the other title-cased-slug artifact;
  // sentence case keeps words after the first lowercase (single letters like "D" and
  // all-caps tokens are allowed and don't match /^[A-Z][a-z]+$/).
  const badInterior = raw.split(' ').slice(1).find((w) => /^[A-Z][a-z]+$/.test(w));
  if (badInterior) {
    fails.push(
      `${slug}: displayName "${raw}" title-cases an interior word ("${badInterior}") — ` +
        `sentence case keeps it lowercase ("Tart cherry", "Magnolia bark")`,
    );
  }
}

// Render-layer guard: the remedy page must not build a name by title-casing the id/slug.
try {
  const page = await readFile(REMEDY_PAGE, 'utf8');
  const badPatterns = [
    /\bentry\.id\.charAt\(0\)\.toUpperCase\(\)/, // "Xyz" from the slug's first letter
    /\bentry\.id\.replace\(\/-\/g/,               // "tart cherry" from the slug
    /\bd\.slug\b.*toUpperCase\(\)/,
  ];
  for (const re of badPatterns) {
    if (re.test(page)) {
      fails.push(
        `${REMEDY_PAGE}: derives a remedy name from the slug/id (${re}) — read displayName instead`,
      );
    }
  }
} catch {
  fails.push(`${REMEDY_PAGE}: not found (expected the remedy page here)`);
}

if (fails.length) {
  console.error(`\n✖ display-name gate: ${fails.length} error(s)\n`);
  for (const f of fails) console.error('   ' + f);
  console.error('\nFix: give every remedy an explicit, rule-correct displayName; never');
  console.error('title-case a slug for display. See CLAUDE.md content model.\n');
  process.exit(1);
}
console.log(`✓ display-name gate: ${files.length} remedies carry an explicit, slug-faithful displayName; no slug title-casing in the render layer.`);
