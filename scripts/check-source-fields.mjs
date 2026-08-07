#!/usr/bin/env node
/**
 * Source study-field guard + coverage report (REDESIGN step 2 / Reference C2).
 *
 * The signature study-field visual (step 11) renders each source from seven STRUCTURED
 * fields: sample size, effect direction, effect size, study quality, year, study type, and a
 * resolvable identifier. This script is the standalone, CI-runnable guard for that contract —
 * the same relationship check-citations.mjs has to the identifier rule. The Zod schema
 * (src/content.config.ts) enforces the same rules at build time; this is the report + a gate
 * that can run without a full Astro build.
 *
 *   node scripts/check-source-fields.mjs           # coverage report + FAIL (exit 1) on any
 *                                                   # structurally-invalid source
 *   node scripts/check-source-fields.mjs --report  # coverage report only, never exits non-zero
 *
 * FAIL conditions (loud, per acceptance):
 *   - missing/invalid year, type, or identifier (pmid|doi|registry)     — always required
 *   - effectDataStatus missing or not one of complete|pending
 *   - effectDataStatus: complete but any of the four effect fields null  — half-filled source
 *
 * A source with effectDataStatus: pending and null effect fields is VALID — it is honestly
 * flagged incomplete, and the study-field generator omits its point. This is the expected
 * state of the whole corpus today (effect data is filled editorially, never inferred).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = process.env.SOMNARY_CONTENT_DIR || 'src/content/remedies';
const REPORT_ONLY = process.argv.includes('--report');

const EFFECT_FIELDS = ['sampleSize', 'effectDirection', 'effectSize', 'studyQuality'];
const REQUIRED = ['sampleSize', 'effectDirection', 'effectSize', 'studyQuality', 'year', 'type', 'identifier'];

const hasId = (s) => Boolean(s.pmid || s.doi || s.registry);
const filled = (v) => v !== null && v !== undefined && v !== '';

async function main() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.mdx')).sort();
  const errors = [];
  const totals = Object.fromEntries(REQUIRED.map((k) => [k, 0]));
  let totalSources = 0;
  let pending = 0;
  let complete = 0;

  for (const f of files) {
    const { data } = matter(await readFile(join(CONTENT_DIR, f), 'utf8'));
    for (const s of data.sources || []) {
      totalSources++;
      const at = `${f} [${s.n}]`;

      // always-required
      if (Number.isInteger(s.year) && s.year >= 1960 && s.year <= 2100) totals.year++;
      else errors.push(`${at}: missing/invalid year`);
      if (typeof s.type === 'string' && s.type) totals.type++;
      else errors.push(`${at}: missing study type`);
      if (hasId(s)) totals.identifier++;
      else errors.push(`${at}: no resolvable identifier (pmid|doi|registry)`);

      // effect-data status discriminant
      if (s.effectDataStatus === 'complete') complete++;
      else if (s.effectDataStatus === 'pending') pending++;
      else errors.push(`${at}: effectDataStatus must be 'complete' or 'pending' (got ${JSON.stringify(s.effectDataStatus)})`);

      // effect fields: count coverage, and fail on a half-filled "complete"
      const missing = EFFECT_FIELDS.filter((k) => !filled(s[k]));
      for (const k of EFFECT_FIELDS) if (filled(s[k])) totals[k]++;
      if (s.effectDataStatus === 'complete' && missing.length) {
        errors.push(`${at}: effectDataStatus: complete but missing ${missing.join(', ')}`);
      }
    }
  }

  // ---- coverage report ----
  const pct = (a) => (totalSources === 0 ? '—' : `${Math.round((a / totalSources) * 100)}%`);
  console.log(`\nSOURCE FIELD COVERAGE · ${files.length} remedies · ${totalSources} sources`);
  console.log(`  effectDataStatus: ${complete} complete · ${pending} pending\n`);
  for (const k of REQUIRED) {
    console.log(`  ${k.padEnd(16)} ${String(totals[k]).padStart(4)} / ${totalSources}  ${pct(totals[k]).padStart(4)}`);
  }

  if (errors.length) {
    console.error(`\n✗ ${errors.length} structurally-invalid source(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    if (!REPORT_ONLY) process.exit(1);
  } else {
    console.log(`\n✓ every source carries year, study type, an identifier, and a valid effectDataStatus.`);
  }
}

main();
