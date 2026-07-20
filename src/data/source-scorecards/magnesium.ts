// Source scorecards — magnesium (AU pilot).
//
// SSG from this repo module (mirrors the Supabase publish-view shape). Scores are transcribed
// from the per-product dossiers in docs/research/sources/magnesium/, rubric applied
// (docs/SOURCE_SCORECARD_RUBRIC.md). RATIFIED by the owner 2026-07-20.
//
// Magnesium-specific owner rulings applied: (1) magnesium OXIDE/form is NOT a sourcing penalty
// (evidence/efficacy matter) — but an oxide-heavy blend marketed as "high absorption/bioavailable"
// is a marketing-honesty deduction; (2) a HIDDEN per-form breakdown is a TRANSPARENCY deduction,
// not an Additives proprietary-blend deduction (the total magnesium is disclosed); (3) AUST L
// (TGA listing) is a Transparency/legitimacy signal, NOT a testing_purity point (self-certified
// listing, not third-party content verification); (4) vitamin B6 is a DISPLAYED SAFETY FLAG, not a
// scored dimension, unless a primary TGA action names the product/line.
//
// SAFETY: brand-negative penalties only from primary, verbatim-verified regulator documents naming
// the product or its line; other-product brand history is held ("under review").
//
// ADDITIVES CAVEAT: most AU brands don't publish full excipient panels online, so `additives` is a
// provisional 5 with "panel not disclosed" for those — it is NOT a claim of a clean panel.

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

export interface MagProduct {
  slug: string;
  brand: string;
  productName: string;
  form: string; // magnesium salt(s)
  elementalMg: number; // elemental magnesium per serving
  ausL: string | null; // TGA AUST L number, or null for imports (not TGA-listed)
  channel: string; // where an Australian buys it
  /** Vitamin-B6 safety flag — displayed, never scored (per TGA neuropathy enforcement). */
  b6?: { note: string };
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

// Ratified 2026-07-20. All 12 are AU-available (Chemist Warehouse / Amazon AU / iHerb AU).
// additives = 5 is provisional ("panel not disclosed") for AU brands that don't publish excipients.
export const MAGNESIUM_SOURCES: MagProduct[] = [
  {
    slug: 'blackmores-sleep-sound-magnesium',
    brand: 'Blackmores',
    productName: 'Sleep Sound Magnesium',
    form: 'citrate + glycinate (+ glycine, hops)',
    elementalMg: 320,
    ausL: '312974',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 312974)',
    additiveSummary: 'Per-form fully disclosed; excipient panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (USP/NSF/Informed) and no published assay; AUST L is a TGA listing, not third-party testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay and no public batch COA (dimension shows "no assay data").' },
      additives: { score: 5, note: 'Provisional — full excipient panel not published online; no confirmed watchlist additive.' },
      regulatory: { score: 5, note: 'No TGA/FDA action names this product; the 2025 B6 class action and Daily Magnesium cancellation are other products (this SKU is B6-free).' },
      transparency: { score: 4, note: 'Named sponsor + AUST L, and a high-water-mark per-form disclosure (citrate 296 + glycinate 24 mg); no public COA.' },
      marketing_honesty: { score: 5, note: 'Indications hedged in TGA-permitted form; blend is genuinely citrate + glycinate, so absorption claims aren’t oxide-mislabeling.' },
    },
    verdict:
      'A sponsor-identifiable, AUST L-listed multi-salt sleep combo with a standout per-form disclosure (citrate 296 mg + glycinate 24 mg) and no B6, but no independent third-party testing, no assay, and an undisclosed excipient panel.',
    heldItems: ['2025 vitamin-B6 class action and 2024 Daily Magnesium cancellation — both other Blackmores products, not this SKU'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'cabot-health-magnesium-ultra-potent',
    brand: 'Cabot Health',
    productName: 'Magnesium Ultra Potent Powder',
    form: '4-salt chelate/ascorbate/glycinate/phosphate — no oxide (+ taurine, zinc)',
    elementalMg: 400,
    ausL: '221456',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 221456)',
    additiveSummary: 'Per-form fully disclosed; “no oxide” claim verified accurate',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a TGA listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Excipient panel disclosed and clean (stevia; residual SO₂ <10 ppm — neither is a watchlist additive).' },
      regulatory: { score: 5, note: 'No enforcement action names this product or line.' },
      transparency: { score: 4, note: 'Named sponsor + AUST L + full per-form disclosure (4 salts summing to 400 mg elemental); no public COA.' },
      marketing_honesty: { score: 5, note: 'The "no oxide" claim is verified true against the label and ARTG; no disease or unsupported-proof claim.' },
    },
    verdict:
      'A four-salt magnesium powder from a named AU sponsor with fully disclosed per-form dosing and a "no oxide" claim verified accurate — but no independent third-party testing or published assay.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'herbs-of-gold-magnesium-forte',
    brand: 'Herbs of Gold',
    productName: 'Magnesium Forte',
    form: '4-salt chelate/citrate/glycinate/orotate',
    elementalMg: 220,
    ausL: '465031',
    channel: 'Amazon AU · health stores',
    certSummary: 'TGA-listed (AUST L 465031)',
    additiveSummary: 'Per-form fully disclosed; excipient panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — full excipient panel not published online; no confirmed watchlist additive.' },
      regulatory: { score: 5, note: 'No action names this product/line; the B6-containing sibling "High Strength" is a separate product.' },
      transparency: { score: 4, note: 'Named sponsor + AUST L + full 4-salt per-form disclosure; compound weights and excipient panel not given.' },
      marketing_honesty: { score: 5, note: 'AU-permitted indication copy; no disease or unsupported-proof claim.' },
    },
    verdict:
      'A magnesium-only 4-salt tablet with fully disclosed per-form dosing and no added B6, but no independent testing, assay, or public COA, and an unpublished excipient panel.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'swisse-ultiboost-magnesium',
    brand: 'Swisse',
    productName: 'Ultiboost Magnesium',
    form: 'citrate (single salt)',
    elementalMg: 150,
    ausL: '355159',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (ARTG 355159)',
    additiveSummary: 'Single-salt disclosed; excipient panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; the TGA listing is not third-party testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — AU excipient panel not published; a titanium-dioxide match from a different-market variant is NOT confirmed on the AU bottle, so not applied.' },
      regulatory: { score: 5, note: 'No action names this product; sibling-SKU sponsor cancellations are held; "formulated without B6".' },
      transparency: { score: 4, note: 'Named sponsor + AUST L + single-salt disclosure; no public COA or sourcing.' },
      marketing_honesty: { score: 5, note: 'Absorption claim hedged ("to help optimise absorption"); no disease claim.' },
    },
    verdict:
      'A single-salt magnesium citrate tablet from a named AU sponsor with hedged marketing and no B6, but no independent testing, no assay, and no public COA.',
    heldItems: ['Sibling-SKU sponsor cancellations (incl. a B6 variant, ARTG 344493) — other products, held'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'bioglan-active-magnesium-pm',
    brand: 'Bioglan',
    productName: 'Active Magnesium PM',
    form: 'oxide + phosphate + glycinate (+ poppy, hops)',
    elementalMg: 225,
    ausL: '353356',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 353356)',
    additiveSummary: 'Per-form disclosed; oxide-heavy (~44%)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — full excipient panel not published; the aspartame implied by the phenylalanine line is a watchlist-excluded sweetener (no deduction).' },
      regulatory: { score: 5, note: 'No action names this product/line; B6-free.' },
      transparency: { score: 4, note: 'Named sponsor + AUST L + full per-form disclosure (oxide 100 + phosphate 100 + glycinate 25); no public COA.' },
      marketing_honesty: { score: 4, note: '−1: markets "3 bioavailable forms" while ~44% of the magnesium is poorly-absorbed oxide.' },
    },
    verdict:
      'An oxide-heavy multi-salt sleep tablet with fully disclosed per-form dosing but no independent testing, assay, or public COA; its "3 bioavailable forms" copy is docked because ~44% is poorly-absorbed oxide.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'carusos-super-magnesium',
    brand: "Caruso's",
    productName: 'Super Magnesium',
    form: '6-salt blend (time-release)',
    elementalMg: 300,
    ausL: '298635',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 298635)',
    additiveSummary: 'Per-form fully disclosed; excipient panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — full excipient panel not published; no confirmed watchlist additive.' },
      regulatory: { score: 3, note: '−2: a 2024 TGA compliance report named this product (ARTG 298635) for unsubstantiated performance claims and the sponsor received infringement notices.' },
      transparency: { score: 4, note: 'Named sponsor + AUST L + full 6-salt per-form disclosure; no public COA.' },
      marketing_honesty: { score: 4, note: '−1: the TGA formally found this product’s exercise/muscle/performance claims unsubstantiated (2024).' },
    },
    verdict:
      'A 6-salt time-release tablet with a fully disclosed per-form breakdown, but whose sponsor received TGA infringement notices in 2024 after performance claims for this product were found unsubstantiated; no independent testing, assay, or public COA.',
    heldItems: ['Section-14 consent CON-845 (supply while non-compliant) — nature of non-compliance not on the ARTG summary, held for review'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'swisse-magnesium-glycinate',
    brand: 'Swisse',
    productName: 'Ultiboost Magnesium Glycinate',
    form: 'glycinate (single salt)',
    elementalMg: 150,
    ausL: '460629',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 460629)',
    additiveSummary: 'Elemental disclosed, compound weight not; panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — AU excipient panel not published; a titanium-dioxide match is search-sourced and unconfirmed for the AU SKU, so not applied.' },
      regulatory: { score: 5, note: 'No action names this product; sibling-SKU cancellations held; B6-free.' },
      transparency: { score: 3, note: 'Named sponsor + AUST L, but only elemental (not compound) weight is disclosed — partial disclosure; no public COA.' },
      marketing_honesty: { score: 5, note: 'Absorption/"gentle" claims are qualified as "compared to magnesium oxide" (comparator named); no disease claim.' },
    },
    verdict:
      'A single-salt magnesium glycinate tablet from a named AU sponsor with oxide-qualified absorption claims and no B6, but no independent testing, no assay, no public COA, and an undisclosed compound weight.',
    heldItems: ['Titanium-dioxide watchlist deduction held pending confirmation on the AU SKU panel; other-Swisse-SKU cancellations held'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'natures-own-magnesium-sleep-effervescent',
    brand: "Nature's Own",
    productName: 'Magnesium + Sleep Effervescent',
    form: 'carbonate (+ passionflower)',
    elementalMg: 320,
    ausL: null,
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L unconfirmed)',
    additiveSummary: 'Single-salt disclosed; effervescent base not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — full effervescent excipient base not published; sucralose is watchlist-excluded (no deduction).' },
      regulatory: { score: 5, note: 'The June 2026 glass-fragment recall covers other Nature’s Own SKUs, not this one (held).' },
      transparency: { score: 3, note: 'Sponsor identifiable (Sanofi/Opella) + single-salt disclosure, but this SKU’s AUST L could not be confirmed; no public COA.' },
      marketing_honesty: { score: 5, note: 'No disease or unsupported-proof claim; not oxide-heavy.' },
    },
    verdict:
      'A single-salt magnesium carbonate effervescent with an identifiable sponsor and no regulator action against it, but no independent testing, assay, or public COA, an unconfirmed AUST L, and an undisclosed excipient base.',
    heldItems: ['June 2026 TGA glass-fragment recall — other Nature’s Own SKUs, not this product'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'bioceuticals-ultra-muscleze-night',
    brand: 'BioCeuticals',
    productName: 'Ultra Muscleze Night',
    form: 'amino-acid chelate/glycinate "UltraMag" (+ glycine, inositol, choline)',
    elementalMg: 244,
    ausL: '366872',
    channel: 'Chemist Warehouse · Amazon AU · practitioner',
    certSummary: 'TGA-listed (AUST L 366872)',
    additiveSummary: 'Per-form hidden — a "proprietary blend"',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Provisional — full excipient panel not published; no confirmed watchlist additive.' },
      regulatory: { score: 5, note: 'No action names this product; the B6-overage recall was Ethical Nutrients (a different brand), not attributed; the Night SKU is B6-free.' },
      transparency: { score: 3, note: 'Named sponsor + AUST L, but the manufacturer calls its own magnesium a "proprietary blend" and hides the per-form split; no public COA.' },
      marketing_honesty: { score: 5, note: 'Claims hedged; absorption claim carries a named comparator ("vs Mg oxide alone").' },
    },
    verdict:
      'A practitioner-brand magnesium sleep powder from an identifiable sponsor with no B6 and no regulator events, but no independent testing, no assay, no public COA, and a per-form split hidden inside a self-described "proprietary blend".',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'doctors-best-high-absorption-magnesium',
    brand: "Doctor's Best",
    productName: 'High Absorption Magnesium',
    form: 'lysinate glycinate chelate (Albion TRAACS)',
    elementalMg: 200,
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Not TGA-listed (US import)',
    additiveSummary: 'Panel disclosed and clean; per-form fully disclosed',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (not in NSF/USP directories) and no published assay; Albion TRAACS is a raw-material supplier assurance, not a product cert.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA.' },
      additives: { score: 5, note: 'Full excipient panel disclosed and clean — no watchlist additive.' },
      regulatory: { score: 5, note: 'No FDA/FTC action against the product (a similarly-named moringa recall is a different company, quarantined).' },
      transparency: { score: 3, note: 'Named manufacturer + full per-form disclosure (elemental + compound), but no AUST L (US import, no TGA oversight of this product) and no public COA.' },
      marketing_honesty: { score: 4, note: '−1: "up to 6× better absorbed" uses an unnamed comparator and an unpinned source.' },
    },
    verdict:
      'A US single-chelate magnesium personally imported into Australia (no TGA listing), with a clean disclosed panel and strong per-form disclosure, but no independent finished-product testing, no public COA, and one unsupported "6× absorption" claim.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'ethical-nutrients-mega-magnesium-powder',
    brand: 'Ethical Nutrients',
    productName: 'Mega Magnesium Powder',
    form: 'glycinate ("Meta Mag"/"MagActive")',
    elementalMg: 300,
    ausL: '489275',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains vitamin B6 (pyridoxine) at ~100 mg/day at label use — the TGA adult maximum — and carries the mandated peripheral-neuropathy warning.' },
    certSummary: 'TGA-listed (AUST L 489275)',
    additiveSummary: 'Compound weight inconsistent across channels',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published assay; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; the only measured-content evidence in the line is a recalled batch found at ~2× the labelled B6.' },
      additives: { score: 5, note: 'Provisional — no confirmed watchlist additive (steviol glycosides are watchlist-excluded); full panel not on-pack-confirmed.' },
      regulatory: { score: 2, note: '−3: a TGA recall in this Mega Magnesium powder line (Raspberry batch 007764) for pyridoxine/B6 at ~2× the labelled amount.' },
      transparency: { score: 3, note: 'Named sponsor + AUST L, but the compound weight is inconsistent across channels (partial disclosure); no public COA.' },
      marketing_honesty: { score: 4, note: '−1: absorption claims are quantified inconsistently ("4×" vs a search-surfaced "8× / clinical studies") with no citable trial of this product.' },
    },
    verdict:
      'A TGA-listed magnesium glycinate powder that carries the mandated B6 neuropathy warning at the adult maximum and belongs to a powder line recalled for double the labelled B6; no independent testing or public COA, and inconsistent absorption claims.',
    heldItems: ['Recall scope: the recalled batch was the Raspberry flavour of the same powder line — applied to the line per owner ratification; the Citrus SKU scored here was not the recalled batch'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'thorne-magnesium-bisglycinate',
    brand: 'Thorne',
    productName: 'Magnesium Bisglycinate',
    form: 'bisglycinate (single chelate)',
    elementalMg: 200,
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'NSF Certified for Sport',
    certVerified: true,
    additiveSummary: 'Panel disclosed and clean (2 excipients)',
    scores: {
      testing_purity: { score: 2, note: 'NSF Certified for Sport, directory-confirmed for this exact SKU (nsfsport.com) — a genuine third-party product certification.' },
      label_accuracy: { score: 2, note: 'NSF Certified for Sport batch-tests every lot for compliance with label claims — per-batch content verification (no separate published assay or public COA, so held at 2).' },
      additives: { score: 5, note: 'Full panel disclosed and clean — two excipients (citric acid, monk fruit), neither a watchlist additive.' },
      regulatory: { score: 5, note: 'No action against a Thorne magnesium product; brand-history items are other products / non-adverse (held).' },
      transparency: { score: 2, note: 'Named manufacturer, but no AUST L (US import), no public per-lot COA located, and compound weight not disclosed.' },
      marketing_honesty: { score: 5, note: 'Structure/function claims with the NSF batch-testing claim genuinely backed; the "TGA-certified facility" line is a facility/GMP claim, not a product registration.' },
    },
    verdict:
      'A single-chelate magnesium bisglycinate powder, personally imported (not TGA-listed), that is the only product here with a genuine, directory-confirmed NSF Certified for Sport — a real per-batch content check — with a clean disclosed panel, though it posts no public COA and doesn’t disclose compound weight.',
    heldItems: ['Brand-history FDA/FTC items (2014 recall, 2004 letter, 2023 FTC mass notice) — other products / non-adverse, held'],
    communityStatus: 'gathering',
    ratified: true,
  },
];
