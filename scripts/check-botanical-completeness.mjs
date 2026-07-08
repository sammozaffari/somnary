#!/usr/bin/env node
/**
 * Botanical completeness gate (CHK-5.1) — locks in a re-runnable guarantee that EVERY botanical
 * remedy carries the two fields a reader needs to sanity-check a label: a standardization note
 * (what counts as the real extract) and at least one captured studied dose paired with a
 * market-comparison (what the trials used vs. what's on sale). This is the machine-checkable half
 * of the "proprietary-blend penalty" story on /methodology §04 and /sleep-blends: you can only
 * flag "no dose to match against" if the studied dose is actually recorded per botanical.
 *
 *   node scripts/check-botanical-completeness.mjs
 *     → prints a per-botanical PASS/gap table; exit 0 when all pass, exit 1 on any gap.
 *
 * It ASSIGNS NO GRADE and INVENTS NO DATA — it only asserts the existing fields are non-empty, so
 * the promise "every botanical publishes its standardization + studied dose" stays true as the
 * catalog grows. A botanical is any remedy whose content-index `category` matches /botanical/i —
 * the SAME classification src/lib/label-data.ts uses (isBotanical), applied to the SAME live
 * remedy .mdx corpus the citation resolver scans (frontmatter parsed with gray-matter, and
 * SOMNARY_CONTENT_DIR honored, exactly as scripts/check-citations.mjs does).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

// Same default + override convention as check-citations.mjs, so a throwaway fixture can be pointed
// at without touching the real content.
const CONTENT_DIR = process.env.SOMNARY_CONTENT_DIR || 'src/content/remedies';
// content-index resolved relative to this script so the botanical classification is found no matter
// the cwd. It is the single source of `category` (label-data.ts reads the same file).
const INDEX_PATH = fileURLToPath(new URL('../src/data/content-index.json', import.meta.url));

const BOTANICAL_RE = /botanical/i; // mirrors label-data.ts: isBotanical = /botanical/i.test(category)

/** non-empty string test — an honest "not established…" string counts as CAPTURED (it's non-empty). */
const ne = (v) => v != null && String(v).trim().length > 0;

async function mdxFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await mdxFiles(full)));
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

async function main() {
  const index = JSON.parse(await readFile(INDEX_PATH, 'utf8'));
  // slug → category, then the set of slugs classified as botanical (same regex as the label engine).
  const categoryBySlug = new Map(index.map((e) => [e.slug, e.category ?? '']));
  const botanicalSlugs = new Set(
    index.filter((e) => BOTANICAL_RE.test(e.category ?? '')).map((e) => e.slug),
  );

  const files = await mdxFiles(CONTENT_DIR);
  const rows = [];
  for (const file of files) {
    const slug = basename(file, '.mdx');
    if (!botanicalSlugs.has(slug)) continue; // only botanicals that actually have live content
    const { data } = matter(await readFile(file, 'utf8'));
    const doses = Array.isArray(data.doses) ? data.doses : [];

    const stdOk = ne(data.standardization);
    const studiedOk = doses.some((d) => ne(d?.studiedDose));
    const marketOk = doses.some((d) => ne(d?.marketComparison));
    // The binding assertion: ≥1 dose row that captures BOTH a studied dose and a market comparison,
    // so there is always a concrete "studied dose" to check a label against (the /sleep-blends rule).
    const rowWithBoth = doses.some((d) => ne(d?.studiedDose) && ne(d?.marketComparison));
    const pass = stdOk && rowWithBoth;

    rows.push({
      slug,
      rel: relative(process.cwd(), file),
      category: categoryBySlug.get(slug) ?? '',
      stdOk,
      studiedOk,
      marketOk,
      rowWithBoth,
      pass,
    });
  }

  rows.sort((a, b) => a.slug.localeCompare(b.slug));

  const mark = (ok) => (ok ? 'PASS' : 'GAP ');
  console.log(`\nbotanical completeness — ${rows.length} botanical(s) in ${CONTENT_DIR}\n`);
  console.log(
    `  ${pad('botanical', 16)}${pad('standardization', 17)}${pad('studiedDose', 13)}${pad('marketComparison', 18)}result`,
  );
  console.log(`  ${'-'.repeat(16 + 17 + 13 + 18 + 6)}`);
  for (const r of rows) {
    console.log(
      `  ${pad(r.slug, 16)}${pad(mark(r.stdOk), 17)}${pad(mark(r.studiedOk), 13)}${pad(mark(r.marketOk), 18)}${r.pass ? '✓ pass' : '✗ GAP'}`,
    );
  }

  const gaps = rows.filter((r) => !r.pass);
  if (gaps.length) {
    console.error(`\n✗ botanical completeness FAILED — ${gaps.length} botanical(s) with a data gap:\n`);
    for (const r of gaps) {
      const missing = [];
      if (!r.stdOk) missing.push('empty standardization');
      if (!r.rowWithBoth) {
        if (!r.studiedOk) missing.push('no dose row carries a studiedDose');
        else if (!r.marketOk) missing.push('no dose row carries a marketComparison');
        else missing.push('no single dose row carries BOTH studiedDose and marketComparison');
      }
      console.error(`  • ${r.rel}: ${missing.join('; ')}`);
    }
    console.error(
      '\nevery botanical must publish its standardization + at least one studied dose with a market comparison.\n',
    );
    process.exit(1);
  }

  console.log(`\n✓ all ${rows.length} botanical(s) complete — standardization + a studied dose/market-comparison each.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
