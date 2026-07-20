// Source scorecards — valerian (AU pilot).
//
// SSG from this repo module (mirrors the Supabase publish-view shape). Scores are transcribed
// from the per-product dossiers in docs/research/sources/valerian/, rubric applied
// (docs/SOURCE_SCORECARD_RUBRIC.md). RATIFIED by the owner 2026-07-20.
//
// Valerian-specific owner rulings applied (mirroring the magnesium precedent):
//   (1) Whole-root vs standardised extract (potency itself) is NOT a sourcing penalty — it's an
//       evidence/efficacy matter. But NON-DISCLOSURE of the active marker (valerenic acid) is a
//       TRANSPARENCY matter (the brand isn't telling you the active strength).
//   (2) An unbacked "clinically studied/standardised" MARKETING claim is a marketing-honesty
//       deduction (e.g. a claim that borrows a trial from a different extract).
//   (3) AUST L (TGA listing) is a Transparency/legitimacy signal, NOT a testing_purity point.
//   (4) The valerian liver-injury (hepatotoxicity) advisory is a DISPLAYED SAFETY note, not a scored
//       dimension. Imports that skip the AU-mandated on-pack liver warning carry a display flag.
//
// SAFETY: brand-negative penalties only from primary, verbatim-verified regulator documents naming
// the product or its line; other-product brand history is held ("under review").
//
// ADDITIVES CAVEAT: most AU brands don't publish full ingredients lists online, so `additives` is a
// provisional 5 with "panel not disclosed" for those — it is NOT a claim of a clean panel. MediHerb,
// NOW and Gaia DO disclose their panels, so their 5 is firm.

export type DimensionKey =
  | 'testing_purity'
  | 'label_accuracy'
  | 'additives'
  | 'regulatory'
  | 'transparency'
  | 'marketing_honesty';

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  testing_purity: 'Testing & purity',
  label_accuracy: 'Label accuracy',
  additives: 'Additives',
  regulatory: 'Regulatory record',
  transparency: 'Transparency',
  marketing_honesty: 'Marketing honesty',
};

export const DIMENSION_ORDER: DimensionKey[] = [
  'testing_purity',
  'label_accuracy',
  'additives',
  'regulatory',
  'transparency',
  'marketing_honesty',
];

export interface Dimension {
  score: number;
  note: string;
}

export interface ValProduct {
  slug: string;
  brand: string;
  productName: string;
  form: string; // single-herb / combo (+ other herbs)
  strength: string; // dry-root equivalent + active-marker disclosure (the valerian quality axis)
  ausL: string | null; // TGA AUST L number, or null for imports (not TGA-listed)
  channel: string; // where an Australian buys it
  /** Used-in-published-trials display flag (e.g. Flordis' Ze 91019 extract). Display only, never scored. */
  trialFlag?: { note: string };
  /** Import safety note — displayed, never scored: US import skips the AU-mandated valerian liver warning. */
  importSafety?: { note: string };
  certSummary: string;
  certVerified?: boolean;
  additiveSummary: string;
  scores: Record<DimensionKey, Dimension>;
  verdict: string;
  heldItems: string[];
  communityStatus: 'gathering' | 'summarized';
  communityThemes?: { note: string; url?: string }[];
  imagePath?: string;
  ratified: boolean;
}

// Community read — display-only, NEVER a score input (the firewall label makes this explicit on
// every card). This is a GENERAL valerian theme, not product-specific: valerian's efficacy and its
// next-day after-effects are what people actually discuss, and they apply across brands/doses.
const VALERIAN_COMMUNITY = [
  {
    note: 'On r/Supplements, valerian is polarising for sleep — some fall asleep faster, but next-day grogginess (users report feeling "loopy" or "drugged") is a common complaint, especially at the high doses many of these products use',
    url: 'https://old.reddit.com/r/Supplements/comments/1momqc4/does_anyone_take_valerian_root_for_sleep/',
  },
];

// Ratified 2026-07-20. All 12 are AU-available (Chemist Warehouse / Amazon AU / iHerb AU).
// The valerian quality axis is STANDARDISATION: does the label disclose valerenic acid (the active
// marker)? The "Forte 2000 test" — Blackmores/Caruso's/Thompson's disclose it at ~2000 mg dry-root;
// Nature's Own does not at the same dose. Gaia (import) is the only product that publishes per-batch
// lab reports, so it's the only one above 0 on independent testing/label verification.
export const VALERIAN_SOURCES: ValProduct[] = [
  {
    slug: 'blackmores-valerian-forte',
    brand: 'Blackmores',
    productName: 'Valerian Forte',
    form: 'single-herb',
    strength: '2000 mg dry-root eq · valerenic acids 3.2 mg',
    ausL: '351518',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 351518)',
    additiveSummary: 'Active strength disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (USP/NSF/Informed) and no published lab test; the TGA listing is a self-certified listing, not third-party testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product and no public batch lab report (dimension shows "no lab-test data").' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online (label shows the active plus a "contains sulfites" allergen line only); no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No enforcement action, recall or alert names this product; the only older listing on this name was cancelled at the sponsor’s own request (routine, not enforcement).' },
      transparency: { score: 4, note: 'Named maker + AUST L + the active strength fully disclosed (valerenic acids 3.2 mg, 5:1 extract, 2000 mg dry-root equivalent); no public per-batch lab report.' },
      marketing_honesty: { score: 5, note: 'Sleep claims use TGA-permitted "traditionally used in Western herbal medicine" wording; no disease claim and no unbacked "clinically proven" claim.' },
    },
    verdict:
      'A TGA-listed single-herb valerian that clearly states its active strength on the pack (valerenic acids 3.2 mg, equal to 2000 mg of dried root), but no independent lab has tested this exact product, its full ingredients list isn’t published online, and its regulatory record is clean.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'carusos-valerian',
    brand: "Caruso's",
    productName: 'Valerian',
    form: 'single-herb',
    strength: '2250 mg dry-root eq · valerenic acid 4.5 mg',
    ausL: '292332',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 292332)',
    additiveSummary: 'Active strength disclosed (highest in set); full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a TGA listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'The only TGA items naming this valerian are benign (a warning-statement review it passed, and an expired label-layout consent); the brand’s 2024 fines and a 2024 tampering recall are other Caruso’s products, held.' },
      transparency: { score: 4, note: 'Named maker + AUST L + the highest disclosed active strength in the set (valerenic acid 4.5 mg + 2250 mg dry-root equivalent); no public per-batch lab report.' },
      marketing_honesty: { score: 5, note: 'AU-standard "traditionally used / may help" wording; the "standardised extract" claim is backed by the disclosed 4.5 mg figure, so no deduction.' },
    },
    verdict:
      'Caruso’s Valerian is a TGA-listed single-herb product that discloses the highest active strength in our set — valerenic acid 4.5 mg per tablet — but no independent lab or certifier has tested it, and the maker publishes no batch report or full ingredients list. The one TGA review of this exact product passed; the brand’s separate penalties are on other Caruso’s products.',
    heldItems: ['A 2024 TGA $82,500 infringement and a Dec-2024 tampering recall (Wee Less / Bloat Eze / Ashwagandha 7500) — both other Caruso’s products, not this valerian'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'thompsons-one-a-day-valerian-2000',
    brand: "Thompson's",
    productName: 'One-A-Day Valerian 2000',
    form: 'single-herb',
    strength: '2000 mg dry-root eq · valerenic acids 3.56 mg',
    ausL: '400382',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 400382)',
    additiveSummary: 'Active strength disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — "other ingredients" line is only "contains encapsulating aids"; excipients not itemised, no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No recall or enforcement; a 2025 TGA warning-statement review of this product was non-adverse ("continues to be permitted", no safety issue).' },
      transparency: { score: 4, note: 'Named maker (Homart Wellness) + AUST L + active strength disclosed (valerenic acids 3.56 mg + 2000 mg dry-root equivalent); no public per-batch lab report.' },
      marketing_honesty: { score: 5, note: 'Copy stays inside the modest "traditional use" claims the regulator permits; no disease claim, no "clinically proven".' },
    },
    verdict:
      'A single-herb Australian-listed valerian that’s unusually open about what’s inside — it names its maker, carries a TGA listing, and states both its extract weight and 3.56 mg of valerenic acids per capsule — but no one independent of the brand has tested a bottle, and no batch report is published.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'natures-own-valerian-forte-2000',
    brand: "Nature's Own",
    productName: 'Valerian Forte 2000',
    form: 'single-herb',
    strength: '2000 mg dry-root eq · active strength not stated',
    ausL: '375755',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 375755)',
    additiveSummary: 'Active strength NOT disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No primary regulator doc names this product adversely; a June 2026 glass-fragment recall was other Nature’s Own SKUs (held), and a 2025 warning-statement review passed.' },
      transparency: { score: 3, note: 'Named maker (Opella/Sanofi) + AUST L, but — unlike Blackmores, Caruso’s and Thompson’s at the same 2000 mg dose — it discloses no valerenic-acid figure, so it earns no active-strength point; no public lab report.' },
      marketing_honesty: { score: 5, note: 'TGA-permitted traditional-use wording only; no disease claim and no unbacked "clinically proven" claim.' },
    },
    verdict:
      'This Australian-listed valerian tells you how much root is behind each capsule (2000 mg dried-root equivalent) but not its active strength: nowhere does it print a valerenic-acid figure. Rival 2000 mg valerians (Blackmores, Caruso’s, Thompson’s) print that number; this one doesn’t, which is why it scores lower on transparency. No independent lab test or batch report is public.',
    heldItems: ['June 2026 TGA glass-fragment recall — other Nature’s Own SKUs, not this product'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'blackmores-deep-sleep',
    brand: 'Blackmores',
    productName: 'Deep Sleep',
    form: 'combo (+ ziziphus, hops, magnesium)',
    strength: '1200 mg valerian dry-root eq · active strength not stated',
    ausL: '394694',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 394694)',
    additiveSummary: 'Each herb dosed; valerian active strength not disclosed; panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — the itemised "other ingredients" panel is not published; each of the four actives is individually dosed (not a proprietary blend), no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No primary regulator document names this domestic product; a cancelled sibling listing is the separate export SKU, cancelled at the sponsor’s request.' },
      transparency: { score: 3, note: 'Named maker + AUST L, and each herb’s dose is itemised, but valerian’s active strength (valerenic acid) isn’t disclosed; no public lab report.' },
      marketing_honesty: { score: 5, note: 'TGA-permitted Listed-medicine / traditional-use framing; no disease claim, no "clinically proven" claim for this product.' },
    },
    verdict:
      'Blackmores Deep Sleep is a well-known Australian brand that lists each herb’s dose on the label, but no independent lab has verified what’s in the bottle, the amount of valerian’s active compound isn’t stated, and the full ingredients list isn’t published online.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'swisse-ultiboost-sleep',
    brand: 'Swisse',
    productName: 'Ultiboost Sleep',
    form: 'combo (+ hops, magnesium)',
    strength: '1300 mg valerian dry-root eq · valerenic acids 2.6 mg',
    ausL: '327845',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 327845)',
    additiveSummary: 'Every active dosed; valerenic acid disclosed (on some channels); panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — the AU excipient panel is unpublished; a different-market variant is a separate formula, so its panel isn’t applied here; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'The one product-naming record (a 2025 TGA compliance report) is a passed review — "issues related to safety: none".' },
      transparency: { score: 4, note: 'Named maker + AUST L + active strength disclosed (valerenic acids 2.6 mg) — though that figure appears on Amazon AU but not on swisse.com.au or Chemist Warehouse; no public lab report.' },
      marketing_honesty: { score: 5, note: 'AU copy uses TGA-permitted indication language; no disease claim and no unbacked "clinically proven" claim.' },
    },
    verdict:
      'A mainstream, regulator-listed Australian combo from an identifiable maker that discloses every active’s dose and standardises valerian to valerenic acids — but that standardisation figure only appears on some retail channels, no independent lab has tested this exact product, and no batch report is public.',
    heldItems: ['The valerenic-acid figure (2.6 mg) is printed on the Amazon AU listing but omitted from swisse.com.au and Chemist Warehouse — the transparency point is awarded because it’s disclosed and verifiable somewhere'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'natures-own-sleep-ezy',
    brand: "Nature's Own",
    productName: 'Sleep Ezy',
    form: 'combo (+ hops, chamomile, passionflower)',
    strength: '556 mg valerian dry-root eq · active strength not stated',
    ausL: '248434',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 248434)',
    additiveSummary: 'Each herb dosed; valerian active strength not disclosed; panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full excipient panel unpublished; every active is individually dosed (not a proprietary blend), no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No primary regulator doc names this product adversely; a June 2026 glass-fragment recall was other Nature’s Own SKUs (held).' },
      transparency: { score: 3, note: 'Named maker (Opella/Sanofi) + AUST L, each herb itemised, but valerian’s active strength isn’t disclosed; no public lab report.' },
      marketing_honesty: { score: 5, note: 'No disease claim, no unbacked "clinically proven" claim; TGA-permitted indications only.' },
    },
    verdict:
      'A fully-itemised, low-dose four-herb sleep combo from a named maker (Opella/Sanofi) with a confirmed AU listing and a clean regulatory and marketing record. Its weak spots are verification, not conduct: no independent lab has tested this product, no assay or batch report is public, and the valerian’s active strength isn’t disclosed.',
    heldItems: ['June 2026 TGA glass-fragment recall — other Nature’s Own SKUs, not this product'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'mediherb-valerian-complex',
    brand: 'MediHerb',
    productName: 'Valerian Complex',
    form: 'combo (+ passionflower, ziziphus)',
    strength: '700 mg valerian dry-herb eq (5:1) · extract ratios + dry-herb equivalents disclosed',
    ausL: '226203',
    channel: 'Practitioner · iHerb',
    certSummary: 'TGA-listed (AUST L 226203)',
    additiveSummary: 'Full excipient panel disclosed (the only AU product here that does)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the brand’s own HPLC program is in-house self-testing, not a third-party product certification.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Full "other ingredients" panel disclosed and clean — no additive of concern (this is a firm 5, not provisional).' },
      regulatory: { score: 5, note: 'No enforcement; the one consent on file is a cosmetic label-layout matter, and a 2025 compliance review passed.' },
      transparency: { score: 4, note: 'Named maker + AUST L + active strength signalled via extract ratios and dry-herb equivalents; it also publishes its full excipient panel (a genuine strength) — but no public per-batch lab report.' },
      marketing_honesty: { score: 5, note: 'Efficacy copy is hedged and low-level; the HPLC "high levels" line is a process assurance, not a clinical-proof claim.' },
    },
    verdict:
      'A practitioner-channel three-herb combination that’s unusually open about the tablet: it lists every herb’s extract ratio and dry-herb equivalent separately — no proprietary blend — and, uncommonly for this category, publishes its full "other ingredients" panel, none of which is a flagged additive. Where it stops short is independent verification — there’s no third-party certification, no published assay, and no public batch report; its own HPLC program is in-house assurance, not outside confirmation.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'bioceuticals-sleep-complex',
    brand: 'BioCeuticals',
    productName: 'Sleep Complex',
    form: 'combo (+ ziziphus, lavender)',
    strength: '1500 mg valerian dry-root eq · valerenic acid 1.13 mg',
    ausL: '366873',
    channel: 'Practitioner · iHerb',
    certSummary: 'TGA-listed (AUST L 366873)',
    additiveSummary: 'Active strength disclosed (only combo here that keeps the marker); panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full excipient panel not primary-source verified; the two watchlist-listed excipients seen are both benign (not_flagged), no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No primary regulator doc names this product/line; a 2021 recall was a different (artemisia) product.' },
      transparency: { score: 4, note: 'Named maker + AUST L + active strength disclosed (valerenic acid 1.13 mg — the only combo here that keeps the marker); no public per-batch lab report.' },
      marketing_honesty: { score: 4, note: '−1: its "clinically trialled" wording leans on a trial of a different, phyto-equivalent extract (LI-156 / Sedonium), not this product — a clinical claim with no citable trial of the product itself.' },
    },
    verdict:
      'This practitioner combo names its maker and unusually prints its valerian potency (1.13 mg valerenic acid per tablet), but no independent lab test or batch report is public, and its "clinically trialled" wording leans on a trial of a different, equivalent extract rather than this product.',
    heldItems: ['Marketing deduction verified on a live retail listing (2026-07-20): the product markets "the clinically trialled Bio-156 valerian extract, phyto-equivalent to LI-156" — the trial is of LI-156, a different extract, so "clinically trialled" isn’t established for this product’s own extract'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'flordis-redormin-forte',
    brand: 'Flordis',
    productName: 'ReDormin Forte',
    form: 'combo (valerian + hops, Ze 91019 extract)',
    strength: '≈2500 mg eq · named clinical extract (Ze 91019)',
    ausL: '283649',
    channel: 'Pharmacy · Amazon AU',
    certSummary: 'TGA-listed (AUST L 283649)',
    certVerified: true,
    additiveSummary: 'Named, trial-studied extract; per-herb doses disclosed; panel not published',
    trialFlag: {
      note: 'Built on the named Ze 91019 valerian-hops extract, which has multiple published RCTs — one (Schicktanz 2025, PMID 40462685) names "Redormin 500", i.e. this exact product. Its "clinically researched" claim is genuinely backed (caveat: the trials are largely maker-sponsored).',
    },
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test of the finished product; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — excipient panel undisclosed on surveyed pages; the actives are individually quantified (not a proprietary blend), no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No primary regulator document names this product/line/sponsor.' },
      transparency: { score: 4, note: 'Named maker + AUST L + active strength signalled via the named clinical extract (Ze 91019); no public per-batch lab report. (ARTG sponsor of record is Actor Pharmaceuticals.)' },
      marketing_honesty: { score: 5, note: 'The "clinically researched" claim is substantiated — the Ze 91019 extract has published RCTs and one names this product; no deduction (maker-sponsored trials noted, not deducted).' },
    },
    verdict:
      'A named, trial-studied combination extract (Ze 91019) with clearly disclosed per-herb doses and a confirmed Australian listing — its "clinically researched" claim genuinely points to published trials of this exact extract — but no independent lab testing, batch report, or full ingredients panel is publicly available to verify what’s in the bottle.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'now-foods-valerian-root-500',
    brand: 'NOW Foods',
    productName: 'Valerian Root 500 mg',
    form: 'single-herb (whole root)',
    strength: '1000 mg root / serving · whole root, no active figure',
    ausL: null,
    channel: 'iHerb AU (import)',
    certSummary: 'Not TGA-listed (US import)',
    additiveSummary: 'Panel disclosed and clean (vegetarian capsule only)',
    importSafety: {
      note: 'Imported into Australia (no TGA listing). Carries a US California Prop-65 lead warning and does NOT carry Australia’s mandated valerian liver-caution warning — an AU buyer misses the local safety warning.',
    },
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (not in NSF/USP directories); NOW’s in-house lab and GMP facility registration are self/facility testing, not a product cert. Not TGA-listed.' },
      label_accuracy: { score: 0, note: 'No published product-naming lab test; no per-batch lab report for this product was retrievable.' },
      additives: { score: 5, note: 'Full panel disclosed and clean — the sole inactive is a vegetarian capsule (hypromellose), no additive of concern.' },
      regulatory: { score: 5, note: 'No primary regulator doc names this valerian product/line; a Prop-65 lead warning is a label statement, not an enforcement event.' },
      transparency: { score: 2, note: 'Named maker, but it’s whole root with no active-strength figure, not TGA-listed (import), and no public per-batch lab report.' },
      marketing_honesty: { score: 5, note: 'Manufacturer copy is restrained (heritage framing); no disease claim, no "clinically proven", no standardisation claim.' },
    },
    verdict:
      'NOW Foods Valerian Root is whole valerian root powder — not an extract — so there’s no active-strength figure: the label states 1000 mg of milled root per serving but gives no valerenic-acid content, so you can’t know the active dose from the bottle. It’s a genuinely single-ingredient capsule from an identifiable, long-established maker with a clean record, but no independent party has verified what’s in this bottle.',
    heldItems: ['A paywalled ConsumerLab valerian result may name this product — a human with a subscription should retrieve it before finalising label accuracy'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'gaia-herbs-valerian-root',
    brand: 'Gaia Herbs',
    productName: 'Valerian Root',
    form: 'single-herb (standardised extract)',
    strength: '450 mg extract / serving · valerenic acids 1.8 mg',
    ausL: null,
    channel: 'iHerb AU (import)',
    certSummary: 'Per-batch lab reports (Meet Your Herbs)',
    certVerified: true,
    additiveSummary: 'Panel disclosed and clean; per-batch lab reports published',
    importSafety: {
      note: 'Imported into Australia (no TGA listing). Does NOT carry Australia’s mandated valerian liver-caution warning — an AU buyer misses the local safety warning.',
    },
    scores: {
      testing_purity: { score: 2, note: 'No third-party product cert (USP/NSF/Informed) and not TGA-listed, but Gaia publishes per-batch contaminant + identity + potency results, run in its own accredited (ISO-17025) lab — the strongest signal short of a third-party cert, so above the AU brands’ 0 but below a third-party product cert.' },
      label_accuracy: { score: 2, note: 'No independent third-party assay, but a public per-batch lab report (identity + potency, keyed to the bottle’s batch ID) — per-batch content verification, held at 2 (the maker’s own testing, not independent).' },
      additives: { score: 5, note: 'Full panel disclosed and clean — vegetable glycerin, water, vegan capsule; no additive of concern.' },
      regulatory: { score: 5, note: 'No FDA/FTC/TGA action against Gaia Herbs or this product; a 2020 COVID warning letter names a different, unrelated company.' },
      transparency: { score: 4, note: 'Named maker (own-manufacture, own farm) + active strength disclosed (valerenic acids 1.8 mg) + a public per-batch lab report — the transparency standout of the set; no AUST L (import).' },
      marketing_honesty: { score: 5, note: 'Hedged "traditionally used / support" framing; no disease claim, no "clinically proven"; the "no added synthetic melatonin" line is a neutral factual differentiator.' },
    },
    verdict:
      'The transparency standout of the set: the one product here that publishes per-batch lab reports you can pull up from the code on your own bottle — identity, heavy-metal, pesticide and potency results — through its "Meet Your Herbs" program, tested in Gaia’s own accredited lab. That in-house testing is a real, checkable signal, though it isn’t the same as an independent third-party certification (which no product here carries). The label is clean and fully disclosed, and the maker is named and grows its own herbs.',
    heldItems: ['Before publishing the per-batch report signal, re-verify live that a current batch ID for this product returns downloadable test documents (Gaia notes the platform is being updated)'],
    communityStatus: 'summarized',
    communityThemes: VALERIAN_COMMUNITY,
    ratified: true,
  },
];
