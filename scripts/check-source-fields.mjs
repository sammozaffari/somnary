#!/usr/bin/env node
/**
 * Source study-field guard + coverage report (REDESIGN step 2 / Reference C2).
 *
 * The study field (step 11) renders each HUMAN sleep-outcome source as a point of light:
 * sample size → radius, effect direction → one of three bands, study quality → brightness.
 * This is the standalone, CI-runnable guard for that contract — the same relationship
 * check-citations.mjs has to the identifier rule. The Zod schema (src/content.config.ts)
 * enforces the same rules at build time; this is the report + a gate that runs without a build.
 *
 *   node scripts/check-source-fields.mjs           # coverage report + FAIL (exit 1) on any
 *                                                   # structurally-invalid source
 *   node scripts/check-source-fields.mjs --report  # coverage report only, never exits non-zero
 *
 * FAIL conditions (loud, per acceptance):
 *   - missing/invalid year, type, or identifier (pmid|doi|registry)     — always required
 *   - effectDataStatus missing or not one of complete|pending
 *   - a source with effectDirection but measuresSleepOutcome=false       — dishonest axis placement
 *   - effectDataStatus: complete but measuresSleepOutcome not set
 *   - complete + measuresSleepOutcome=true but missing sampleSize / effectDirection / studyQuality
 *
 * A `pending` source (any fields null) is VALID — honestly flagged incomplete; the generator
 * omits its point. `effectSize` is always optional (stat line only, never positioning).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = process.env.SOMNARY_CONTENT_DIR || 'src/content/remedies';
const REPORT_ONLY = process.argv.includes('--report');

const DIRECTIONS = ['helped', 'no-clear-effect', 'didnt-help'];
const QUALITIES = ['high', 'moderate', 'low'];
const hasId = (s) => Boolean(s.pmid || s.doi || s.registry);
const set = (v) => v !== null && v !== undefined && v !== '';

async function main() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.mdx')).sort();
  const errors = [];
  let total = 0, pending = 0, complete = 0;
  let adjudicated = 0, efficacy = 0, nonEfficacy = 0;
  const base = { year: 0, type: 0, identifier: 0 };
  // coverage among efficacy (measuresSleepOutcome=true) sources
  const eff = { sampleSize: 0, effectDirection: 0, studyQuality: 0, effectSize: 0 };

  for (const f of files) {
    const { data } = matter(await readFile(join(CONTENT_DIR, f), 'utf8'));
    for (const s of data.sources || []) {
      total++;
      const at = `${f} [${s.n}]`;

      // always-required
      if (Number.isInteger(s.year) && s.year >= 1960 && s.year <= 2100) base.year++;
      else errors.push(`${at}: missing/invalid year`);
      if (typeof s.type === 'string' && s.type) base.type++;
      else errors.push(`${at}: missing study type`);
      if (hasId(s)) base.identifier++;
      else errors.push(`${at}: no resolvable identifier (pmid|doi|registry)`);

      // status
      if (s.effectDataStatus === 'complete') complete++;
      else if (s.effectDataStatus === 'pending') pending++;
      else errors.push(`${at}: effectDataStatus must be 'complete' or 'pending' (got ${JSON.stringify(s.effectDataStatus)})`);

      // sanity on enum values when present
      if (set(s.effectDirection) && !DIRECTIONS.includes(s.effectDirection))
        errors.push(`${at}: effectDirection '${s.effectDirection}' not one of ${DIRECTIONS.join('|')}`);
      if (set(s.studyQuality) && !QUALITIES.includes(s.studyQuality))
        errors.push(`${at}: studyQuality '${s.studyQuality}' not one of ${QUALITIES.join('|')}`);

      // adjudication + efficacy split
      if (s.measuresSleepOutcome === true) { adjudicated++; efficacy++; }
      else if (s.measuresSleepOutcome === false) { adjudicated++; nonEfficacy++; }

      // rule 2 — no direction on a non-sleep source
      if (s.measuresSleepOutcome === false && set(s.effectDirection))
        errors.push(`${at}: has effectDirection but measuresSleepOutcome=false (cannot sit on the helped/didn't-help axis)`);

      // efficacy-field coverage (only meaningful for sleep-outcome sources)
      if (s.measuresSleepOutcome === true) {
        if (set(s.sampleSize)) eff.sampleSize++;
        if (set(s.effectDirection)) eff.effectDirection++;
        if (set(s.studyQuality)) eff.studyQuality++;
        if (set(s.effectSize)) eff.effectSize++;
      }

      // rule 1 — completeness
      if (s.effectDataStatus === 'complete') {
        if (s.measuresSleepOutcome === null || s.measuresSleepOutcome === undefined) {
          errors.push(`${at}: complete but measuresSleepOutcome not set`);
        } else if (s.measuresSleepOutcome === true) {
          const miss = ['sampleSize', 'effectDirection', 'studyQuality'].filter((k) => !set(s[k]));
          if (miss.length) errors.push(`${at}: complete sleep-outcome source missing ${miss.join(', ')}`);
        }
      }
    }
  }

  const pctOf = (a, b) => (b === 0 ? '  —' : `${Math.round((a / b) * 100)}%`.padStart(4));
  console.log(`\nSOURCE FIELD COVERAGE · ${files.length} remedies · ${total} sources`);
  console.log(`  status:       ${complete} complete · ${pending} pending`);
  console.log(`  adjudicated:  ${adjudicated}/${total}  (sleep-outcome: ${efficacy} · non-sleep: ${nonEfficacy})\n`);

  console.log(`  always-required:`);
  for (const k of ['year', 'type', 'identifier'])
    console.log(`    ${k.padEnd(14)} ${String(base[k]).padStart(4)} / ${total}  ${pctOf(base[k], total)}`);

  console.log(`\n  study-field fields — coverage among the ${efficacy} sleep-outcome source(s):`);
  for (const k of ['sampleSize', 'effectDirection', 'studyQuality'])
    console.log(`    ${k.padEnd(14)} ${String(eff[k]).padStart(4)} / ${efficacy}  ${pctOf(eff[k], efficacy)}   (required on complete)`);
  console.log(`    ${'effectSize'.padEnd(14)} ${String(eff.effectSize).padStart(4)} / ${efficacy}  ${pctOf(eff.effectSize, efficacy)}   (optional)`);

  if (errors.length) {
    console.error(`\n✗ ${errors.length} structurally-invalid source(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    if (!REPORT_ONLY) process.exit(1);
  } else {
    console.log(`\n✓ all sources valid: year/type/identifier present, status set, no dishonest axis placement, every complete source whole.`);
  }
}

main();
