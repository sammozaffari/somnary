/**
 * CHK-B3 — migrate the source-scorecard products into the new product/brand content model.
 *
 * The old `SourceProduct` (src/data/source-scorecards/*.ts) is a 6-dimension scoring model with
 * one overloaded free-text `form` string. The new model (CLAUDE.md; content.config.ts) is the
 * two-axis one: the ingredient evidence bucket lives on the remedy; the product-score's FOUR
 * checks live here — never merged. This script maps what the old data actually holds and marks
 * everything it does NOT hold as unresolved (null / needs-review), reporting per product rather
 * than guessing. deliveryForm is mapped via the plan's synonym table (§3); an unmappable label
 * lands `needs-review`, never an invented value.
 *
 *   node scripts/migrate-scorecards.ts
 */
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { MELATONIN_SOURCES } from '../src/data/source-scorecards/melatonin.ts';
import { ASHWAGANDHA_SOURCES } from '../src/data/source-scorecards/ashwagandha.ts';
import { GLYCINE_SOURCES } from '../src/data/source-scorecards/glycine.ts';
import { MAGNESIUM_SOURCES } from '../src/data/source-scorecards/magnesium.ts';
import { VALERIAN_SOURCES } from '../src/data/source-scorecards/valerian.ts';

// each scorecard file = one remedy (ingredient); remedy_id is the ingredient slug
const SETS = [
  { remedy: 'melatonin', rows: MELATONIN_SOURCES },
  { remedy: 'ashwagandha', rows: ASHWAGANDHA_SOURCES },
  { remedy: 'glycine', rows: GLYCINE_SOURCES },
  { remedy: 'magnesium', rows: MAGNESIUM_SOURCES },
  { remedy: 'valerian', rows: VALERIAN_SOURCES },
];

const DOSE_IN_NAME = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|iu|ml)\b/i;

// deliveryForm synonym table (plan §3) — specific shapes before generic. A miss = null (needs-review).
const FORM_RULES: [string, RegExp][] = [
  ['softgel', /\b(softgels?|soft[- ]?gels?|liquid capsules?)\b/i],
  ['melt-lozenge', /\b(lozenges?|troche|melts?|dissolve|sublingual tablet|odt)\b/i],
  ['gummy', /\b(gumm(y|ies)|pastilles?|jelly)\b/i],
  ['spray', /\b(sprays?)\b/i],
  ['tea', /\b(tea|teabags?)\b/i],
  ['patch', /\b(patch|transdermal)\b/i],
  ['powder', /\b(powder|stick pack)\b/i],
  ['liquid-drops', /\b(liquid|drops|tincture|elixir|syrup|oil)\b/i],
  ['capsule', /\b(veg(gie|etable)?[- ]?caps?(ule)?s?|v-?caps?|vegicaps?|capsules?|caps)\b/i],
  ['tablet', /\b(tablets?|caplets?|effervescent)\b/i],
];
const SLOW = /\b(extended|sustained|controlled|timed|prolonged|modified|time[- ]?release|slow[- ]?release)\b/i;

function mapForm(raw: string) {
  const s = raw || '';
  let deliveryForm: string | null = null;
  for (const [form, re] of FORM_RULES) {
    if (re.test(s)) { deliveryForm = form; break; }
  }
  let releaseProfile: 'immediate' | 'slow-release' | 'not-stated' = 'not-stated';
  if (SLOW.test(s)) releaseProfile = 'slow-release';
  else if (/\beffervescent\b/i.test(s)) releaseProfile = 'immediate';
  // when no shape maps, the string is salt / chemical form (e.g. magnesium "citrate + glycinate")
  const chemicalForm = deliveryForm ? null : (s.trim() || null);
  return { deliveryForm, releaseProfile, chemicalForm, formStatus: deliveryForm ? 'mapped' : 'needs-review' };
}

const kebab = (s: string) =>
  s.toLowerCase().replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const brands = new Map<string, { name: string; slug: string; product_list: string[] }>();
const report: string[] = [];
const bySlug = new Map<string, any>(); // merge combo products that appear under >1 ingredient
const merged: string[] = [];
let withheld = 0;
let nameCleaned = 0;
const needsReviewForm: string[] = [];

const PRODUCTS_DIR = 'src/content/products';
const BRANDS_DIR = 'src/content/brands';
rmSync(PRODUCTS_DIR, { recursive: true, force: true });
rmSync(BRANDS_DIR, { recursive: true, force: true });
mkdirSync(PRODUCTS_DIR, { recursive: true });
mkdirSync(BRANDS_DIR, { recursive: true });

for (const { remedy, rows } of SETS) {
  for (const r of rows as any[]) {
    if (!r.ratified) { withheld++; continue; } // ratified:false is withheld (mirrors the publish gate)

    // name must not carry a dose (strength is structured). Strip + record if the old name did.
    let name = String(r.productName || '').trim();
    if (DOSE_IN_NAME.test(name)) { name = name.replace(DOSE_IN_NAME, '').replace(/\s{2,}/g, ' ').trim(); nameCleaned++; }

    const { deliveryForm, releaseProfile, chemicalForm, formStatus } = mapForm(r.form || '');
    const composition = r.singleOrCombo === 'combo' ? 'blend' : 'single-ingredient';

    // retail_links from the old retailers map (string | {url,status,lastCheckedAt})
    const retail_links: any[] = [];
    for (const [retailer, ref] of Object.entries(r.retailers || {})) {
      if (!ref) continue;
      const url = typeof ref === 'string' ? ref : (ref as any).url;
      const last_checked = typeof ref === 'string' ? null : ((ref as any).lastCheckedAt ?? null);
      if (url) retail_links.push({ retailer, url, price: null, last_checked });
    }

    const product = {
      id: r.slug,
      brand: r.brand,
      name,
      strength: typeof r.doseMg === 'number' ? { amount: r.doseMg, unit: 'mg' } : null,
      composition,
      // blends: per-ingredient amounts were never captured structurally → unknown (report), not false
      perIngredientAmountsDisclosed: composition === 'blend' ? null : null,
      deliveryForm,
      releaseProfile,
      rawFormLabel: r.form || '',
      chemicalForm,
      formStatus,
      // single-ingredient: the one ingredient at the labelled dose; blends: the primary only
      // (other actives' amounts were not structured — flagged in the report)
      ingredients: [{ remedy_id: remedy, amount: typeof r.doseMg === 'number' ? r.doseMg : null, unit: typeof r.doseMg === 'number' ? 'mg' : null, form: chemicalForm }],
      // the four product-score checks — NOT derivable from the old 6-dimension model → unassessed
      dose_match: null,
      third_party_tested: null,
      label_discloses_all: null,
      proprietary_blend: null,
      form_matches_studied: null,
      price: null,
      pricePerNight: null,
      dietary: null,
      allergens: [],
      excipients: [], // old additiveSummary is prose — not structured/flagged/cited here (report)
      howToTake: null,
      retail_links,
      data_source: 'source-scorecard-migration-2026-08-17',
      last_checked: null,
      // label facts are known (brand, name, dose, form) but the four checks are NOT assessed
      assessment_state: 'label known, not yet assessed',
    };

    // A combo product can appear under >1 ingredient scorecard (one bottle, multiple actives).
    // Merge on slug: accumulate ingredients[], and a multi-ingredient product is a blend.
    const existing = bySlug.get(r.slug);
    if (existing) {
      if (!existing.ingredients.some((i: any) => i.remedy_id === remedy)) existing.ingredients.push(product.ingredients[0]);
      existing.composition = existing.ingredients.length > 1 ? 'blend' : existing.composition;
      merged.push(`${r.brand} — ${name} (${existing.ingredients.map((i: any) => i.remedy_id).join(' + ')})`);
    } else {
      bySlug.set(r.slug, product);
    }

    // per-product missing-field report (first occurrence only — merged rows share the product)
    if (!existing) {
      const missing: string[] = [];
      if (!deliveryForm) missing.push('deliveryForm (needs-review — no shape in the label string)');
      missing.push('four checks: dose_match, label_discloses_all, form_matches_studied, proprietary_blend');
      missing.push('third_party_tested{organisation, verified_date}');
      missing.push('price + pricePerNight');
      missing.push('dietary{sugarFree, glutenFree, vegan, artificialSweetenerPresent} + allergens');
      if (r.additiveSummary) missing.push(`excipients (unmigrated prose: "${String(r.additiveSummary).slice(0, 60)}…")`);
      else missing.push('excipients');
      missing.push('howToTake');
      if (composition === 'blend') missing.push('perIngredientAmountsDisclosed + other blend ingredients');
      report.push(`- **${r.brand} — ${name}** \`${r.slug}\` · state: label known, not yet assessed\n  - missing: ${missing.join('; ')}`);
    }
  }
}

// write the merged products, and derive brands from the FINAL product set
for (const p of bySlug.values()) {
  p.composition = p.ingredients.length > 1 ? 'blend' : p.composition;
  writeFileSync(join(PRODUCTS_DIR, `${p.id}.json`), JSON.stringify(p, null, 2) + '\n');
  if (!p.deliveryForm) needsReviewForm.push(`${p.brand} — ${p.name}`);
  const bslug = kebab(p.brand);
  if (!brands.has(bslug)) brands.set(bslug, { name: p.brand, slug: bslug, product_list: [] });
  brands.get(bslug)!.product_list.push(p.id);
}
const migrated = bySlug.size;

// brands (recalls[] empty — no recall data in the old model; sourcing is a later editorial pass)
for (const b of brands.values()) {
  b.product_list.sort();
  writeFileSync(join(BRANDS_DIR, `${b.slug}.json`), JSON.stringify({ ...b, recalls: [] }, null, 2) + '\n');
}

const md = `# Product migration report — source-scorecards → product/brand model (CHK-B3, 2026-08-17)

Migrated **${migrated}** ratified products into \`src/content/products/\` and **${brands.size}**
brands into \`src/content/brands/\`. **${withheld}** unratified products were withheld (they never
rendered under the old publish gate either). ${nameCleaned} product name(s) had a dose token
stripped (strength is structured now). **${needsReviewForm.length}** products could not map a
deliveryForm from the label string (mostly magnesium, where the string holds the salt not the
shape — plan §1) and are \`needs-review\`. **${merged.length}** combo products appeared under more
than one ingredient scorecard and were MERGED into one product carrying multiple \`ingredients[]\`
(one bottle, multiple actives) rather than duplicated.

## §7 owner decisions — FLAGGED, not resolved (CHK-Rprod.2, HUMAN-GATE)

The delivery-form schema plan (\`docs/plans/2026-08-12-product-form-schema.md\` §7) owes four
owner rulings. B3 built to the plan's stated assumptions where a structural choice was
unavoidable, and flags all four here rather than resolving them:

1. **Four-field split** (deliveryForm · releaseProfile · chemical/salt · combo) vs the literal
   two. *Built to the four-field split* — the two can't be clean while the salt shares the string
   (this migration proves it: ${needsReviewForm.length} products have no shape in the label). Owner
   to confirm.
2. **Release-profile data source** for the fill: labels only (most land \`not-stated\`) vs pull
   from product pages. *Built labels-only* (so most products are \`not-stated\`, honest). Owner to confirm.
3. **Release profile at launch:** a visible consumer facet, or data-only feeding the
   form-matches-studied check? **Unresolved** — does not block the schema; a facet decision for B6.
4. **Plain label wording:** "Dissolvable (melt / lozenge)" vs "Melt / lozenge". **Unresolved** —
   the sample page uses "Dissolvable (melt / lozenge)" as a placeholder pending the ruling.

## Merged combo products (${merged.length})
${[...new Set(merged)].map((m) => `- ${m}`).join('\n') || '- none'}

Every product migrated with \`assessment_state: "label known, not yet assessed"\`: the label facts
(brand, name, structured strength, form where mappable, retail links) carried over, but the four
product-score checks are NOT derivable from the old 6-dimension model and are left null — to be
assessed editorially (CHK-E8), never guessed. The ingredient evidence bucket and the product
score stay two separate axes; no combined number exists in the data.

## deliveryForm needs-review (${needsReviewForm.length})
${needsReviewForm.map((n) => `- ${n}`).join('\n') || '- none'}

## Per-product missing fields (${migrated})
${report.join('\n')}
`;
mkdirSync('docs/audits', { recursive: true });
writeFileSync('docs/audits/2026-08-17-product-migration-report.md', md);

console.log(`✓ migrated ${migrated} products, ${brands.size} brands, ${withheld} withheld, ${needsReviewForm.length} deliveryForm needs-review`);
console.log('  → src/content/products/, src/content/brands/, docs/audits/2026-08-17-product-migration-report.md');
