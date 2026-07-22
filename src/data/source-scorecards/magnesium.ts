// Source scorecards — magnesium (AU pilot).
//
// SSG from this repo module (mirrors the Supabase publish-view shape). Scores are transcribed
// from the per-product dossiers in docs/research/sources/magnesium/, rubric applied
// (docs/SOURCE_SCORECARD_RUBRIC.md). RATIFIED by the owner 2026-07-20.
//
// Magnesium-specific owner rulings applied: (1) magnesium OXIDE/form is NOT a sourcing penalty
// (evidence/efficacy matter) — but an oxide-heavy blend marketed as "high absorption/bioavailable"
// is a marketing-honesty deduction; (2) a HIDDEN how much of each type of magnesium is a TRANSPARENCY deduction,
// not an Additives proprietary-blend deduction (the total magnesium is disclosed); (3) AUST L
// (TGA listing) is a Transparency/legitimacy signal, NOT a testing_purity point (self-certified
// listing, not third-party content verification); (4) vitamin B6 is a DISPLAYED SAFETY FLAG, not a
// scored dimension, unless a primary TGA action names the product/line.
//
// SAFETY: brand-negative penalties only from primary, verbatim-verified regulator documents naming
// the product or its line; other-product brand history is held ("under review").
//
// ADDITIVES CAVEAT: most AU brands don't publish full full ingredients lists online, so `additives` is a
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
  /** One-line, plain-language bottom line — the 2-second scan (leads the card, above the fuller verdict). */
  bottomLine: string;
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
// additives = 5 is provisional ("panel not disclosed") for AU brands that don't publish ingredients.
export const MAGNESIUM_SOURCES: MagProduct[] = [
  {
    slug: 'blackmores-sleep-sound-magnesium',
    imagePath: '/images/sources/magnesium/blackmores-sleep-sound-magnesium.jpg',
    brand: 'Blackmores',
    productName: 'Sleep Sound Magnesium',
    bottomLine:
      'A TGA-listed citrate + glycinate sleep combo that discloses how much of each type is inside, and adds no B6 — but no independent lab test.',
    form: 'citrate + glycinate (+ glycine, hops)',
    elementalMg: 320,
    ausL: '312974',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 312974)',
    additiveSummary: 'Per-form fully disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (USP/NSF/Informed) and no published lab test; AUST L is a TGA listing, not third-party testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product and no public batch lab report (dimension shows "no lab-test data").' },
      additives: { score: 5, note: 'Provisional — full full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No TGA/FDA action names this product; the 2025 B6 class action and Daily Magnesium cancellation are other products (this SKU is B6-free).' },
      transparency: { score: 4, note: 'Named maker + AUST L, and a high-water-mark disclosure of how much of each type is inside (citrate 296 + glycinate 24 mg); no public lab report.' },
      marketing_honesty: { score: 5, note: 'Indications hedged in TGA-permitted form; blend is genuinely citrate + glycinate, so absorption claims aren’t oxide-mislabeling.' },
    },
    verdict:
      'A clearly-made, TGA-listed multi-salt sleep combo with a standout disclosure of how much of each type is inside (citrate 296 mg + glycinate 24 mg) and no B6, but no independent lab testing, and an undisclosed full ingredients list.',
    heldItems: ['2025 vitamin-B6 class action and 2024 Daily Magnesium cancellation — both other Blackmores products, not this SKU'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide)', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'cabot-health-magnesium-ultra-potent',
    imagePath: '/images/sources/magnesium/cabot-health-magnesium-ultra-potent.png',
    brand: 'Cabot Health',
    productName: 'Magnesium Ultra Potent Powder',
    bottomLine:
      'A four-salt powder that fully discloses how much of each type is inside, with a "no oxide" claim verified accurate — but no independent lab test.',
    form: '4-salt chelate/ascorbate/glycinate/phosphate — no oxide (+ taurine, zinc)',
    elementalMg: 400,
    ausL: '221456',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 221456)',
    additiveSummary: 'Per-form fully disclosed; “no oxide” claim verified accurate',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a TGA listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Excipient panel disclosed and clean (stevia; residual SO₂ <10 ppm — neither is a additive of concern).' },
      regulatory: { score: 5, note: 'No enforcement action names this product or line.' },
      transparency: { score: 4, note: 'Named maker + AUST L + full disclosure of how much of each type is inside (4 salts summing to 400 mg elemental); no public lab report.' },
      marketing_honesty: { score: 5, note: 'The "no oxide" claim is verified true against the label and ARTG; no disease or unsupported-proof claim.' },
    },
    verdict:
      'A four-salt magnesium powder from a named Australian company with a fully disclosed breakdown of how much of each type of magnesium is inside, and a "no oxide" claim verified accurate — but no independent lab testing.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide) — and its oxide-free blend matches that preference', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'herbs-of-gold-magnesium-forte',
    imagePath: '/images/sources/magnesium/herbs-of-gold-magnesium-forte.png',
    brand: 'Herbs of Gold',
    productName: 'Magnesium Forte',
    bottomLine:
      'A magnesium-only four-salt tablet that discloses how much of each type is inside, with no added B6 — but no independent lab test.',
    form: '4-salt chelate/citrate/glycinate/orotate',
    elementalMg: 220,
    ausL: '465031',
    channel: 'Amazon AU · health stores',
    certSummary: 'TGA-listed (AUST L 465031)',
    additiveSummary: 'Per-form fully disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names this product/line; the B6-containing sibling "High Strength" is a separate product.' },
      transparency: { score: 4, note: 'Named maker + AUST L + full 4-salt disclosure of how much of each type is inside; compound weights and full ingredients list not given.' },
      marketing_honesty: { score: 5, note: 'AU-permitted indication copy; no disease or unsupported-proof claim.' },
    },
    verdict:
      'A magnesium-only 4-salt tablet with a fully disclosed breakdown of how much of each type of magnesium is inside, and no added B6, but no independent lab testing and no public lab report, and an unpublished full ingredients list.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide)', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'swisse-ultiboost-magnesium',
    imagePath: '/images/sources/magnesium/swisse-ultiboost-magnesium.jpg',
    brand: 'Swisse',
    productName: 'Ultiboost Magnesium',
    bottomLine:
      'A single-salt magnesium citrate tablet from a named Australian maker with hedged marketing and no B6 — but no independent lab test.',
    form: 'citrate (single salt)',
    elementalMg: 150,
    ausL: '355159',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (ARTG 355159)',
    additiveSummary: 'Single-salt disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the TGA listing is not third-party testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — AU full ingredients list not published; a titanium-dioxide match from a different-market variant is NOT confirmed on the AU bottle, so not applied.' },
      regulatory: { score: 5, note: 'No action names this product; sibling-SKU maker cancellations are held; "formulated without B6".' },
      transparency: { score: 4, note: 'Named maker + AUST L + single-salt disclosure; no public lab report or sourcing.' },
      marketing_honesty: { score: 5, note: 'Absorption claim hedged ("to help optimise absorption"); no disease claim.' },
    },
    verdict:
      'A single-salt magnesium citrate tablet from a named Australian company with hedged marketing and no B6, but no independent lab testing and no public lab report.',
    heldItems: ['Sibling-SKU maker cancellations (incl. a B6 variant, ARTG 344493) — other products, held'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is generally preferred over citrate for sleep; citrate is seen as more of a laxative', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'bioglan-active-magnesium-pm',
    imagePath: '/images/sources/magnesium/bioglan-active-magnesium-pm.jpg',
    brand: 'Bioglan',
    productName: 'Active Magnesium PM',
    bottomLine:
      'Markets "3 bioavailable forms", but about 44% of the magnesium is poorly-absorbed oxide — a fully-disclosed blend with no independent lab test.',
    form: 'oxide + phosphate + glycinate (+ poppy, hops)',
    elementalMg: 225,
    ausL: '353356',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 353356)',
    additiveSummary: 'Per-form disclosed; oxide-heavy (~44%)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full full ingredients list not published; the aspartame implied by the phenylalanine line is a watchlist-excluded sweetener (no deduction).' },
      regulatory: { score: 5, note: 'No action names this product/line; B6-free.' },
      transparency: { score: 4, note: 'Named maker + AUST L + full disclosure of how much of each type is inside (oxide 100 + phosphate 100 + glycinate 25); no public lab report.' },
      marketing_honesty: { score: 4, note: '−1: markets "3 bioavailable forms" while ~44% of the magnesium is poorly-absorbed oxide.' },
    },
    verdict:
      'An oxide-heavy multi-salt sleep tablet with a fully disclosed breakdown of how much of each type is inside, but no independent lab testing and no public lab report; its "3 bioavailable forms" copy is docked because ~44% is poorly-absorbed oxide.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'Reddit’s r/magnesium commonly flags magnesium oxide as poorly absorbed — this blend leans on oxide', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'carusos-super-magnesium',
    imagePath: '/images/sources/magnesium/carusos-super-magnesium.jpg',
    brand: "Caruso's",
    productName: 'Super Magnesium',
    bottomLine:
      'Its maker received 2024 TGA infringement notices after this product’s performance claims were found unsubstantiated — a fully-disclosed 6-salt blend, no independent lab test.',
    form: '6-salt blend (time-release)',
    elementalMg: 300,
    ausL: '298635',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 298635)',
    additiveSummary: 'Per-form fully disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full full ingredients list not published; no confirmed additive of concern.' },
      regulatory: { score: 3, note: '−2: a 2024 TGA compliance report named this product (ARTG 298635) for unsubstantiated performance claims and the maker received infringement notices.' },
      transparency: { score: 4, note: 'Named maker + AUST L + full 6-salt disclosure of how much of each type is inside; no public lab report.' },
      marketing_honesty: { score: 4, note: '−1: the TGA formally found this product’s exercise/muscle/performance claims unsubstantiated (2024).' },
    },
    verdict:
      'A 6-salt time-release tablet with a fully disclosed breakdown of how much of each type is inside, but whose maker received TGA infringement notices in 2024 after performance claims for this product were found unsubstantiated; no independent lab testing and no public lab report.',
    heldItems: ['Section-14 consent CON-845 (supply while non-compliant) — nature of non-compliance not on the ARTG summary, held for review'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'Reddit’s r/magnesium commonly flags magnesium oxide as poorly absorbed — this blend leans on oxide', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'swisse-magnesium-glycinate',
    imagePath: '/images/sources/magnesium/swisse-magnesium-glycinate.jpg',
    brand: 'Swisse',
    productName: 'Ultiboost Magnesium Glycinate',
    bottomLine:
      'A single-salt glycinate tablet with oxide-qualified absorption claims and no B6 — but it discloses only the elemental amount, and has no independent lab test.',
    form: 'glycinate (single salt)',
    elementalMg: 150,
    ausL: '460629',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 460629)',
    additiveSummary: 'Elemental disclosed, compound weight not; panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — AU full ingredients list not published; a titanium-dioxide match is search-sourced and unconfirmed for the AU SKU, so not applied.' },
      regulatory: { score: 5, note: 'No action names this product; sibling-SKU cancellations held; B6-free.' },
      transparency: { score: 3, note: 'Named maker + AUST L, but only elemental (not compound) weight is disclosed — partial disclosure; no public lab report.' },
      marketing_honesty: { score: 5, note: 'Absorption/"gentle" claims are qualified as "compared to magnesium oxide" (comparator named); no disease claim.' },
    },
    verdict:
      'A single-salt magnesium glycinate tablet from a named Australian company with oxide-qualified absorption claims and no B6, but no independent lab testing and no public lab report, and an undisclosed compound weight.',
    heldItems: ['Titanium-dioxide watchlist deduction held pending confirmation on the AU SKU panel; other-Swisse-SKU cancellations held'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide)', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'natures-own-magnesium-sleep-effervescent',
    imagePath: '/images/sources/magnesium/natures-own-magnesium-sleep-effervescent.jpg',
    brand: "Nature's Own",
    productName: 'Magnesium + Sleep Effervescent',
    bottomLine:
      'A single-salt carbonate effervescent from an identifiable maker with no regulator action against it — but an unconfirmed AUST L and no independent lab test.',
    form: 'carbonate (+ passionflower)',
    elementalMg: 320,
    ausL: null,
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L unconfirmed)',
    additiveSummary: 'Single-salt disclosed; effervescent base not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full effervescent ingredients list not published; sucralose is watchlist-excluded (no deduction).' },
      regulatory: { score: 5, note: 'The June 2026 glass-fragment recall covers other Nature’s Own SKUs, not this one (held).' },
      transparency: { score: 3, note: 'Sponsor identifiable (Sanofi/Opella) + single-salt disclosure, but this SKU’s AUST L could not be confirmed; no public lab report.' },
      marketing_honesty: { score: 5, note: 'No disease or unsupported-proof claim; not oxide-heavy.' },
    },
    verdict:
      'A single-salt magnesium carbonate effervescent with an identifiable maker and no regulator action against it, but no independent lab testing and no public lab report, an unconfirmed AUST L, and an undisclosed full ingredients list.',
    heldItems: ['June 2026 TGA glass-fragment recall — other Nature’s Own SKUs, not this product'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the sleep favourite; carbonate (used here) is discussed mainly for its antacid effect', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'bioceuticals-ultra-muscleze-night',
    imagePath: '/images/sources/magnesium/bioceuticals-ultra-muscleze-night.jpg',
    brand: 'BioCeuticals',
    productName: 'Ultra Muscleze Night',
    bottomLine:
      'A practitioner-brand sleep powder with no B6 and no regulator events — but it hides the split between magnesium types in a "proprietary blend", with no independent lab test.',
    form: 'amino-acid chelate/glycinate "UltraMag" (+ glycine, inositol, choline)',
    elementalMg: 244,
    ausL: '366872',
    channel: 'Chemist Warehouse · Amazon AU · practitioner',
    certSummary: 'TGA-listed (AUST L 366872)',
    additiveSummary: 'Per-form hidden — a "proprietary blend"',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full full ingredients list not published; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names this product; the B6-overage recall was Ethical Nutrients (a different brand), not attributed; the Night SKU is B6-free.' },
      transparency: { score: 3, note: 'Named maker + AUST L, but the manufacturer calls its own magnesium a "proprietary blend" and hides the split between the different types of magnesium; no public lab report.' },
      marketing_honesty: { score: 5, note: 'Claims hedged; absorption claim carries a named comparator ("vs Mg oxide alone").' },
    },
    verdict:
      'A practitioner-brand magnesium sleep powder from an identifiable maker with no B6 and no regulator events, but no independent lab testing and no public lab report, and a split between the different types of magnesium hidden inside a self-described "proprietary blend".',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide)', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'doctors-best-high-absorption-magnesium',
    imagePath: '/images/sources/magnesium/doctors-best-high-absorption-magnesium.jpg',
    brand: "Doctor's Best",
    productName: 'High Absorption Magnesium',
    bottomLine:
      'Its "up to 6× better absorbed" claim uses an unnamed comparator and an unpinned source — a clean, well-disclosed US import (not TGA-listed) with no independent lab test.',
    form: 'lysinate glycinate chelate (Albion TRAACS)',
    elementalMg: 200,
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Not TGA-listed (US import)',
    additiveSummary: 'Panel disclosed and clean; per-form fully disclosed',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (not in NSF/USP directories) and no published lab test; Albion TRAACS is a raw-material supplier assurance, not a product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Full full ingredients list disclosed and clean — no additive of concern.' },
      regulatory: { score: 5, note: 'No FDA/FTC action against the product (a similarly-named moringa recall is a different company, quarantined).' },
      transparency: { score: 3, note: 'Named manufacturer + full disclosure of how much of each type is inside (elemental + compound), but no AUST L (US import, no TGA oversight of this product) and no public lab report.' },
      marketing_honesty: { score: 4, note: '−1: "up to 6× better absorbed" uses an unnamed comparator and an unpinned source.' },
    },
    verdict:
      'A US single-chelate magnesium personally imported into Australia (no TGA listing), with a clean disclosed panel and strong disclosure of how much of each type is inside, but no independent finished-product testing, no public lab report, and one unsupported "6× absorption" claim.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide); chelated forms like this are well-regarded', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },
  {
    slug: 'ethical-nutrients-mega-magnesium-powder',
    imagePath: '/images/sources/magnesium/ethical-nutrients-mega-magnesium-powder.jpg',
    brand: 'Ethical Nutrients',
    productName: 'Mega Magnesium Powder',
    bottomLine:
      'Carries the mandated B6 neuropathy warning at the adult maximum, and belongs to a powder line recalled for double the labelled B6 — no independent lab test.',
    form: 'glycinate ("Meta Mag"/"MagActive")',
    elementalMg: 300,
    ausL: '489275',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains vitamin B6 (pyridoxine) at ~100 mg/day at label use — the TGA adult maximum — and carries the mandated peripheral-neuropathy warning.' },
    certSummary: 'TGA-listed (AUST L 489275)',
    additiveSummary: 'Compound weight inconsistent across channels',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; the only measured-content evidence in the line is a recalled batch found at ~2× the labelled B6.' },
      additives: { score: 5, note: 'Provisional — no confirmed additive of concern (steviol glycosides are watchlist-excluded); full panel not on-pack-confirmed.' },
      regulatory: { score: 2, note: '−3: a TGA recall in this Mega Magnesium powder line (Raspberry batch 007764) for pyridoxine/B6 at ~2× the labelled amount.' },
      transparency: { score: 3, note: 'Named maker + AUST L, but the compound weight is inconsistent across channels (partial disclosure); no public lab report.' },
      marketing_honesty: { score: 4, note: '−1: absorption claims are quantified inconsistently ("4×" vs a search-surfaced "8× / clinical studies") with no citable trial of this product.' },
    },
    verdict:
      'A TGA-listed magnesium glycinate powder that carries the mandated B6 neuropathy warning at the adult maximum and belongs to a powder line recalled for double the labelled B6; no independent lab testing and no public lab report, and inconsistent absorption claims.',
    heldItems: ['Recall scope: the recalled batch was the Raspberry flavour of the same powder line — applied to the line per owner ratification; the Citrus SKU scored here was not the recalled batch'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'Reddit (r/magnesium, r/B6Toxicity) actively warns the B6 added to some magnesium supplements can build up — directly relevant here, as this product sits at the B6 maximum', url: 'https://old.reddit.com/r/Biohackers/comments/1kqqyao/why_tf_is_b6_so_high_in_some_magnesium/' },
    ],
    ratified: true,
  },
  {
    slug: 'thorne-magnesium-bisglycinate',
    imagePath: '/images/sources/magnesium/thorne-magnesium-bisglycinate.jpg',
    brand: 'Thorne',
    productName: 'Magnesium Bisglycinate',
    bottomLine:
      'The only product here with a genuine, directory-confirmed NSF Certified for Sport — a real per-batch content check — with a clean disclosed panel; a US import, not TGA-listed.',
    form: 'bisglycinate (single chelate)',
    elementalMg: 200,
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'NSF Certified for Sport',
    certVerified: true,
    additiveSummary: 'Panel disclosed and clean (2 ingredients)',
    scores: {
      testing_purity: { score: 2, note: 'NSF Certified for Sport, directory-confirmed for this exact SKU (nsfsport.com) — a genuine third-party product certification.' },
      label_accuracy: { score: 2, note: 'NSF Certified for Sport batch-tests every lot for compliance with label claims — per-batch content verification (no separate published lab test or public lab report, so held at 2).' },
      additives: { score: 5, note: 'Full panel disclosed and clean — two ingredients (citric acid, monk fruit), neither a additive of concern.' },
      regulatory: { score: 5, note: 'No action against a Thorne magnesium product; brand-history items are other products / non-adverse (held).' },
      transparency: { score: 2, note: 'Named manufacturer, but no AUST L (US import), no public per-batch lab report located, and compound weight not disclosed.' },
      marketing_honesty: { score: 5, note: 'Structure/function claims with the NSF batch-testing claim genuinely backed; the "TGA-certified facility" line is a facility/GMP claim, not a product registration.' },
    },
    verdict:
      'A single-chelate magnesium bisglycinate powder, personally imported (not TGA-listed), that is the only product here with a genuine, directory-confirmed NSF Certified for Sport — a real per-batch content check — with a clean disclosed panel, though it posts no public lab report and doesn’t disclose compound weight.',
    heldItems: ['Brand-history FDA/FTC items (2014 recall, 2004 letter, 2023 FTC mass notice) — other products / non-adverse, held'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'On Reddit’s r/magnesium, glycinate is the form most people favour for sleep (over citrate and oxide)', url: 'https://old.reddit.com/r/magnesium/comments/1syzxoo/magnesium_glycinate_vs_citrate_which_one_is/' },
    ],
    ratified: true,
  },

  // ── Phase 2: Chemist Warehouse + Amazon AU bestsellers (deduped into the set). Ratified 2026-07-21.
  {
    slug: 'natures-way-high-strength-magnesium',
    imagePath: '/images/sources/magnesium/natures-way-high-strength-magnesium.jpg',
    brand: "Nature's Way",
    productName: 'High Strength Magnesium 600mg',
    bottomLine:
      'A mostly-oxide magnesium that adds vitamin B6 and is marketed “for better absorption” despite the form — TGA-listed, but no independent lab test.',
    form: '4-salt, oxide-dominant (~94% from magnesium oxide)',
    elementalMg: 322,
    ausL: '185943',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains vitamin B6 — label figures range 9–41 mg/day across SKU versions (confirm on the physical pack). Below the 50 mg/day TGA on-pack-warning threshold, but it is added B6.' },
    certSummary: 'TGA-listed (AUST L 185943)',
    additiveSummary: 'Per-form partly disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (USP/NSF/Informed) and no published lab test; AUST L is a TGA listing, not third-party testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product and no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No TGA action names this product or line.' },
      transparency: { score: 3, note: 'Named maker + AUST L, but the per-form elemental split is not clearly disclosed online for this oxide-dominant blend.' },
      marketing_honesty: { score: 4, note: 'The formula is ~94% magnesium oxide yet marketed “for better absorption” — an absorption claim the form doesn’t support (owner-ratified −1).' },
    },
    verdict:
      'A TGA-listed, high-elemental tablet that is almost entirely magnesium oxide, adds vitamin B6, and leans on a “better absorption” claim the form doesn’t support — with no independent lab testing.',
    heldItems: ['Exact on-pack B6 figure (9 vs 41 mg/day) and AUST L — read the physical pack / live ARTG to confirm'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'natures-own-high-strength-magnesium',
    imagePath: '/images/sources/magnesium/natures-own-high-strength-magnesium.jpg',
    brand: "Nature's Own",
    productName: 'High Strength Magnesium (3 forms)',
    bottomLine:
      'B6-free and TGA-listed, but it’s ~86% oxide while headlining the “easily-absorbed citrate” that’s only ~7% of the dose — and no independent lab test.',
    form: '3-salt, oxide-dominant (~86% oxide + chelate + citrate)',
    elementalMg: 350,
    ausL: '394052',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 394052)',
    additiveSummary: 'Three forms disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names this product or line.' },
      transparency: { score: 4, note: 'Named maker (Opella/Sanofi) + AUST L + discloses all three forms and the elemental split.' },
      marketing_honesty: { score: 4, note: 'Headlines “3 forms including easily-absorbed citrate,” but citrate is only ~7% (25/350 mg) of the dose while oxide is ~86% — absorption emphasis on a minor component (owner-ratified −1).' },
    },
    verdict:
      'A B6-free, TGA-listed 3-form tablet that discloses its split honestly on the panel, but markets the ~7% citrate for absorption while ~86% is oxide — with no independent lab testing.',
    heldItems: ['AUST L 394052 — confirm on the live ARTG'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'natures-own-magnesium-glycinate',
    imagePath: '/images/sources/magnesium/natures-own-magnesium-glycinate.jpg',
    brand: "Nature's Own",
    productName: 'Magnesium Glycinate 1150mg',
    bottomLine:
      'A single batch was recalled in 2026 for a glass fragment in the bottle (a packaging defect, not the tablets) — otherwise a B6-free, well-absorbed glycinate, but no independent lab test.',
    form: 'glycinate (single salt)',
    elementalMg: 300,
    ausL: '464493',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 464493)',
    additiveSummary: 'Single-salt disclosed; “Ezyglide” coating additive not itemised',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online (the “Ezyglide” coating is not itemised); no confirmed additive of concern.' },
      regulatory: { score: 3, note: 'A consumer-level TGA recall (Jun 2026, sponsor Sanofi-Aventis Healthcare) named this exact SKU — batch 4644931665576, for a glass fragment inside the bottle (not the tablets): a single-batch packaging defect, not a formulation or potency problem. Refund via place of purchase.' },
      transparency: { score: 3, note: 'Named maker + AUST L; single-salt glycinate with elemental disclosed, but no public lab report.' },
      marketing_honesty: { score: 5, note: 'Glycinate is a genuinely well-absorbed form, so absorption framing isn’t oxide-mislabeling; no disease or unsupported-proof claim.' },
    },
    verdict:
      'A B6-free, well-absorbed single-salt glycinate whose one blemish is a 2026 single-batch recall for a glass fragment in the bottle (a packaging defect, not the tablets or the formula) — with no independent lab testing.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'cenovis-magnesium',
    imagePath: '/images/sources/magnesium/cenovis-magnesium.jpg',
    brand: 'Cenovis',
    productName: 'Magnesium',
    bottomLine:
      'Adds a high dose of vitamin B6 (near the daily max at 2 tablets) and is under a TGA labelling consent — TGA-listed with the forms disclosed, but no independent lab test.',
    form: 'oxide-dominant (oxide + amino-acid chelate) (+ manganese)',
    elementalMg: 325,
    ausL: '154312',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains a high dose of vitamin B6 — pyridoxine ~49 mg per tablet; at 2 tablets/day (~99 mg/day) it nears the TGA 100 mg/day adult maximum, and it carries the on-pack neuropathy warning.' },
    certSummary: 'TGA-listed (AUST L 154312)',
    additiveSummary: 'Per-form disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 4, note: 'Under a TGA Section 14 consent (2022–2026) permitting supply while a labelling-presentation non-compliance is corrected — a documented compliance record naming the product, though a permitted transition rather than a recall or penalty (owner-ratified −1).' },
      transparency: { score: 4, note: 'Named maker (Sanofi) + AUST L + per-form elemental disclosed (oxide 295 + chelate 30 mg).' },
      marketing_honesty: { score: 5, note: 'Indications hedged in TGA-permitted form; no absorption overclaim on the oxide blend.' },
    },
    verdict:
      'A TGA-listed oxide+chelate tablet that discloses its forms, but adds a high dose of vitamin B6 (near the daily max at label use) and sits under a TGA labelling consent — with no independent lab testing.',
    heldItems: ['AUST L 154312 and the Section 14 consent dates — confirm on the live ARTG'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'wagner-super-bio-magnesium',
    imagePath: '/images/sources/magnesium/wagner-super-bio-magnesium.jpg',
    brand: 'Wagner',
    productName: 'Super Bio Magnesium',
    bottomLine:
      'Adds vitamin B6 and leans on “Super Bio” branding despite a mostly-oxide form — TGA-listed with the forms disclosed, but no independent lab test.',
    form: 'oxide-dominant (oxide + phosphate) (+ vitamin C, D3)',
    elementalMg: 500,
    ausL: '349297',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains vitamin B6 — pyridoxine 50 mg (≡ ~41 mg B6) per tablet, with the on-pack neuropathy warning.' },
    certSummary: 'TGA-listed (AUST L 349297)',
    additiveSummary: 'Per-form disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No enforcement action names the current product; a superseded prior formulation (AUST L 287531) was administratively cancelled at the sponsor’s request in 2023 — routine, not a safety recall.' },
      transparency: { score: 4, note: 'Named maker + AUST L + per-form elemental disclosed (oxide 440 + phosphate 60 mg).' },
      marketing_honesty: { score: 4, note: '“Super Bio” branding implies bioavailability on a mostly-oxide formula — an absorption implication the form doesn’t match (owner-ratified −1).' },
    },
    verdict:
      'A TGA-listed, high-elemental oxide blend that discloses its forms, but adds vitamin B6 and trades on “Super Bio” bioavailability branding the oxide form doesn’t support — with no independent lab testing.',
    heldItems: ['AUST L 349297 — confirm on the live ARTG'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'nutra-life-magnesium-complete-forte',
    imagePath: '/images/sources/magnesium/nutra-life-magnesium-complete-forte.jpg',
    brand: 'Nutra-Life',
    productName: 'Magnesium Complete Forte',
    bottomLine:
      'B6-free with the fullest form breakdown of the oxide blends here, but under a TGA labelling consent — TGA-listed, no independent lab test.',
    form: 'oxide-dominant (oxide + phosphate + chelate) (+ zinc)',
    elementalMg: 400,
    ausL: '314036',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 314036)',
    additiveSummary: 'Per-form fully disclosed; gelatin capsule',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online (gelatin shell noted); no confirmed additive of concern.' },
      regulatory: { score: 4, note: 'Under a TGA Section 14 consent (CON-998, 2022–2026) permitting supply while a medicine-name labelling non-compliance is corrected — a documented compliance record naming the product, though a permitted transition, not a recall (owner-ratified −1).' },
      transparency: { score: 4, note: 'Named maker (Vitaco) + AUST L + the fullest per-form elemental disclosure of the oxide blends here.' },
      marketing_honesty: { score: 5, note: 'AU-permitted indication copy; no absorption overclaim on the oxide blend.' },
    },
    verdict:
      'A B6-free oxide blend with the fullest form disclosure of its peers, held back only by a TGA labelling consent naming the product — and, like almost all AU magnesium, no independent lab testing.',
    heldItems: ['AUST L 314036 and the CON-998 consent dates — confirm on the live ARTG'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'healthy-care-good-night-sleep',
    imagePath: '/images/sources/magnesium/healthy-care-good-night-sleep.jpg',
    brand: 'Healthy Care',
    productName: 'Good Night Sleep with Magnesium + Ashwagandha',
    bottomLine:
      'A sleep combo whose sleep angle rides its herbs (ashwagandha, chamomile) more than its modest 100 mg magnesium, and it adds a little B6 — TGA-listed, no independent lab test.',
    form: 'magnesium chelate (single) + ashwagandha, magnolia, chamomile, passionflower',
    elementalMg: 100,
    ausL: '463467',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains vitamin B6 at a low dose (~2–4 mg/day) — well below the TGA neuropathy-warning band, but it is added B6.' },
    certSummary: 'TGA-listed (AUST L 463467)',
    additiveSummary: 'Actives disclosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; the added actives are herbs, not additives of concern.' },
      regulatory: { score: 5, note: 'No action names this product or line (registered 2024).' },
      transparency: { score: 3, note: 'Named maker + AUST L; a single magnesium form (100 mg) with the sleep botanicals and their doses disclosed, but no public lab report.' },
      marketing_honesty: { score: 5, note: 'Sleep positioning is carried by the botanicals under TGA-permitted traditional-medicine framing, not by an overstated magnesium claim.' },
    },
    verdict:
      'A TGA-listed sleep combo whose sleep story rides ashwagandha, magnolia, chamomile and passionflower more than its modest 100 mg magnesium, with a little added B6 — and no independent lab testing.',
    heldItems: ['AUST L 463467 and on-pack B6 figure — confirm on the physical pack / live ARTG'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'voost-magnesium-effervescent',
    imagePath: '/images/sources/magnesium/voost-magnesium-effervescent.jpg',
    brand: 'Voost',
    productName: 'Magnesium (effervescent)',
    bottomLine:
      'A B6-free effervescent magnesium from a named maker with nothing on its regulatory record — TGA-listed, but single-form disclosure only and no independent lab test.',
    form: 'carbonate (single salt), effervescent',
    elementalMg: 200,
    ausL: '325773',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'TGA-listed (AUST L 325773)',
    additiveSummary: 'Single-salt disclosed; effervescent sweeteners + sodium are format-inherent (on-pack)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; AUST L is a listing, not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — effervescent excipients (sorbitol, saccharin, sucralose) and ~222 mg sodium/tablet are format-inherent and disclosed on-pack; none is a watchlist additive of concern.' },
      regulatory: { score: 5, note: 'No action names the current product; a prior listing (AUST L 207174) was sponsor-cancelled in 2022 as a routine re-listing, not a safety action.' },
      transparency: { score: 3, note: 'Named maker (Procter & Gamble) + AUST L; single-salt carbonate with elemental disclosed, but no public lab report.' },
      marketing_honesty: { score: 5, note: 'Sold as a general magnesium (not a sleep claim); no absorption overclaim.' },
    },
    verdict:
      'A B6-free, single-salt effervescent from a named maker with a clean regulatory record — held to a middle tier only by single-form disclosure and, like its peers, no independent lab testing.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'life-extension-neuro-mag',
    imagePath: '/images/sources/magnesium/life-extension-neuro-mag.jpg',
    brand: 'Life Extension',
    productName: 'Neuro-Mag Magnesium L-Threonate',
    bottomLine:
      'The one novel form here (L-threonate), but its “cognitive health” claim rests on ingredient trials, not this product — an import with no AUST L or lab report.',
    form: 'magnesium L-threonate (Magtein), single',
    elementalMg: 144,
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Not TGA-listed (import)',
    additiveSummary: 'Single-form disclosed; vegetarian capsule',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product third-party cert (a company-level NSF GMP registration is a facility badge, not a product cert) and no public product lab report; Magtein is a branded raw material, i.e. ingredient pedigree, not a product test.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — single-active capsule; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No FDA/FTC action names this product or line.' },
      transparency: { score: 2, note: 'Named maker + elemental disclosed, but an import with no AUST L and no public product lab report.' },
      marketing_honesty: { score: 4, note: '“Well-studied for cognitive health” rests on maker-funded trials of the Magtein *ingredient* (one used a multi-ingredient formula), not this finished product — borrowed-trial framing (owner-ratified −1).' },
    },
    verdict:
      'The only novel form on the page — magnesium L-threonate — but the cognition/sleep marketing leans on branded-ingredient trials rather than this finished product, and as an import it carries no AUST L and no product lab report.',
    heldItems: ['Life Extension brand-history FDA items — other products / non-adverse, held'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'now-magnesium-glycinate',
    imagePath: '/images/sources/magnesium/now-magnesium-glycinate.jpg',
    brand: 'NOW Foods',
    productName: 'Magnesium Glycinate',
    bottomLine:
      'The best-disclosed import here — full breakdown and a named Albion chelate — but no third-party product test and, as an import, no AUST L.',
    form: 'magnesium bisglycinate (Albion), single',
    elementalMg: 200,
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Not TGA-listed (import)',
    additiveSummary: 'Full elemental + compound + excipient panel disclosed',
    scores: {
      testing_purity: { score: 0, note: 'In-house ISO-accredited testing and an Eurofins NSF/ANSI-455-2 facility GMP are real but facility/in-house, not a finished-product third-party cert (the Informed Sport cover is on NOW’s separate Sports line, not this SKU).' },
      label_accuracy: { score: 0, note: 'No independent third-party lab test of the exact product; no public batch COA for this SKU.' },
      additives: { score: 5, note: 'Full excipient panel disclosed and clean; no additive of concern.' },
      regulatory: { score: 5, note: 'No FDA/FTC action names this product or line (unrelated food recalls are quarantined as different products).' },
      transparency: { score: 3, note: 'Named maker + full elemental + compound + excipient disclosure and a named Albion chelate — the best-disclosed import here — but no AUST L and no public product lab report.' },
      marketing_honesty: { score: 5, note: 'Names the exact chelate and dose; no absorption or cert overclaim.' },
    },
    verdict:
      'The most transparent import on the page — full panel, named Albion bisglycinate, clean record — held below the top only because its testing is in-house/facility-level rather than a third-party product cert, and it carries no AUST L.',
    heldItems: ['NOW brand-history FDA/FTC items — other products / non-adverse, held'],
    communityStatus: 'gathering',
    ratified: true,
  },
];
