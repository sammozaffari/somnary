// Source scorecards — glycine (AU pilot).
//
// SSG from this repo module (mirrors the Supabase publish-view shape). Scores transcribed from the
// per-product dossiers in docs/research/sources/glycine/, rubric applied
// (docs/SOURCE_SCORECARD_RUBRIC.md). RATIFIED by the owner 2026-07-20.
//
// Glycine-specific owner rulings applied:
//   (1) Glycine is a single amino acid — there is no "form" axis. The quality axis is PURITY +
//       DOSE HONESTY + who verified it. testing_purity = 0 unless a FINISHED-PRODUCT third-party
//       cert (USP Verified / NSF / Informed) OR a published product-naming assay OR a public per-lot
//       COA. Facility GMP and "pharmaceutical grade" self-claims earn nothing.
//   (2) DOSE HONESTY (reaches the studied ~3 g in one serving vs needs 6 capsules vs an underdosed
//       combo) is displayed CONTEXT, NOT a scored penalty (mirrors the magnesium-oxide ruling).
//   (3) FOOD vs AUST L medicine is a first-class signal: the pure glycine people take for sleep is a
//       food, outside TGA medicine oversight; only the therapeutic-claim combos are listed medicines.
//   (4) Marketing honesty: a generic "pharmaceutical grade" self-claim is NOT docked (a grade
//       descriptor; transparency already withholds the substantiation point). Marketing −1 is reserved
//       for a claim implying a certification/specific result that does NOT exist — Thorne's "third-party
//       certified" (not in any product-cert directory) and NOW Pure Powder's "(USP)" (implies USP
//       Verified; it is not) and Bulk Nutrients' unbacked "removes lactic acid".
//
// SAFETY: brand-negative penalties only from primary, verbatim-verified regulator documents naming the
// product or its line; other-product brand history is held ("under review").
//
// TRANSPARENCY scheme (cumulative, cap 5): +2 maker identifiable; +1 glycine dose disclosed per
// serving; +1 grade substantiated beyond a bare self-claim (a named raw-material pedigree or a real
// COA/testing program); +1 public per-lot COA retrievable OR (for a TGA medicine) the AUST L listing.

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

export interface GlyProduct {
  slug: string;
  brand: string;
  productName: string;
  /** One-line, plain-language bottom line — the 2-second scan (leads the card, above the fuller verdict). */
  bottomLine: string;
  form: string; // single-ingredient powder / capsules / combo (+ other actives)
  dose: string; // glycine per serving — the label figure
  /** Dose-honesty context — displayed, never scored. `reaches` styles it as a positive/neutral note. */
  doseReach: { note: string; reaches: boolean };
  /** Food vs TGA medicine — a first-class structural signal. */
  regulated: 'medicine' | 'food';
  ausL: string | null;
  channel: string;
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

// Community read — display-only, NEVER a score input. A general glycine theme (efficacy + the fishy
// smell/taste + next-day feel are what people actually discuss), not product-specific.
const GLYCINE_COMMUNITY = [
  {
    note: 'On r/Supplements, glycine before bed is one of the better-liked sleep amino acids — people report deeper, calmer sleep at ~3 g — though a fishy/sweet taste and "no effect for me" are common counter-notes',
    url: 'https://old.reddit.com/r/Supplements/comments/1eaw2w0/mix_of_tryptophan_glycine_and_valerian_root_for/',
  },
];

// Ratified 2026-07-20. All 12 are AU-available (Chemist Warehouse / Amazon AU / iHerb AU).
// The glycine story: no one holds a finished-product cert, so testing/label are near-uniformly 0
// (BulkSupplements earns label 1 via COA-on-request). Additives are uniformly 5 — glycine is a
// genuinely pure single ingredient. Differentiation is transparency (maker+dose = 3 floor; +1 for a
// real extra signal) and dose honesty (displayed, not scored).
export const GLYCINE_SOURCES: GlyProduct[] = [
  {
    slug: 'healthwise-glycine-powder',
    imagePath: undefined,
    brand: 'HealthWise',
    productName: 'Glycine Pure Powder',
    bottomLine:
      'Pure single-ingredient glycine, and one teaspoon hits the studied ~3 g — but it’s a food with no testing and an unbacked "pharmaceutical grade" claim.',
    form: 'single-ingredient powder',
    dose: '~3.5 g per teaspoon',
    doseReach: { note: 'Reaches the studied ~3 g in one teaspoon', reaches: true },
    regulated: 'food',
    ausL: null,
    channel: 'Pharmacy Online · Natural Chemist',
    certSummary: 'Food — not TGA-listed',
    additiveSummary: 'Single-ingredient, no fillers or flow agents',
    scores: {
      testing_purity: { score: 0, note: 'No independent lab testing found — no third-party product cert (USP/NSF/Informed), no published lab test, no public batch lab report. "Pharmaceutical grade" is a self-claim.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product and no public or on-request lab report (dimension shows "no lab-test data").' },
      additives: { score: 5, note: 'Single-ingredient pure glycine; the maker declares no fillers and no flow/anti-caking agent. No additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product or maker (TGA/ACCC checked); clean record.' },
      transparency: { score: 3, note: 'Named maker (HealthWise / KRPAN) + the glycine dose clearly stated (3,500 mg/tsp); but the "pharmaceutical grade" claim isn’t backed by any lab report, and it’s a food with no TGA listing.' },
      marketing_honesty: { score: 5, note: 'Soft, hedged sleep wording; no disease claim and no claim implying a certification it doesn’t hold. The unbacked "pharmaceutical grade" descriptor is handled under transparency, not docked here.' },
    },
    verdict:
      'A clean, single-ingredient glycine powder: one teaspoon delivers ~3.5 g, so it hits the ~3 g used in sleep studies in a single serving, and the label declares no fillers. But it’s sold as a food — outside the medicines regulator — with no independent testing, no lab report, and a "pharmaceutical grade" claim no document backs up.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'bulk-nutrients-glycine',
    imagePath: '/images/sources/glycine/bulk-nutrients-glycine.jpg',
    brand: 'Bulk Nutrients',
    productName: 'Glycine',
    bottomLine:
      'Its "removes lactic acid" line is an unbacked claim — but this is a named Australian maker running a real public lab-report program, the strongest here.',
    form: 'single-ingredient powder',
    dose: 'user-measured (label serving to confirm)',
    doseReach: { note: 'Bulk powder — reaching the studied ~3 g is trivial', reaches: true },
    regulated: 'food',
    ausL: null,
    channel: 'Brand webstore · Amazon AU',
    certSummary: 'Food — not TGA-listed',
    certVerified: true,
    additiveSummary: 'Single-ingredient; runs a public lab-report program',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test. Bulk Nutrients runs a genuine public lab-report program, but a glycine-specific report could not be confirmed posted — so no testing credit until it’s verified (held).' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; the public lab-report program is the strongest here, but a glycine batch report isn’t confirmed retrievable — held at 0 pending that check.' },
      additives: { score: 5, note: 'Single-ingredient pure glycine; no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; the maker’s corporate entity has only other-product history (held).' },
      transparency: { score: 4, note: 'Named Australian maker + glycine dose disclosed + a real public lab-report program (the strongest testing model in the set, above the "third-party tested" lines of its peers) — though the glycine report itself isn’t confirmed public yet.' },
      marketing_honesty: { score: 4, note: '−1: the muscle-recovery / "removes lactic acid" marketing is an unbacked structure/function claim. "Pharmaceutical grade" is a self-claim on a food (handled under transparency).' },
    },
    verdict:
      'A fully identifiable Australian maker selling a pure single-ingredient glycine powder, and the one brand here that runs a genuine public lab-report program — a real transparency edge over its peers’ "third-party tested" marketing. But a glycine-specific report couldn’t be confirmed posted, so it earns no independent-testing credit yet, and it’s a food outside TGA oversight.',
    heldItems: [
      'Testing & label held at 0 pending a live check that a glycine batch lab report is actually posted (would move label accuracy to 2 and transparency to 5 if confirmed)',
      'The maker’s corporate entity (Bioflex) has other-product regulatory history — not this glycine product',
    ],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'vpa-glycine',
    imagePath: '/images/sources/glycine/vpa-glycine.jpg',
    brand: 'VPA',
    productName: 'Glycine Powder',
    bottomLine:
      'A clean single-ingredient food powder from a named Australian maker — but no testing, and the 1 g serving is a third of the studied ~3 g.',
    form: 'single-ingredient powder',
    dose: '1 g per serving',
    doseReach: { note: 'Label serving is 1 g — treble it to reach the studied ~3 g', reaches: false },
    regulated: 'food',
    ausL: null,
    channel: 'Brand webstore · Amazon AU',
    certSummary: 'Food — not TGA-listed',
    additiveSummary: 'Single-ingredient; no fillers, flavours, colours or sweeteners',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert, no published lab test, no public batch report. "Pharmaceutical-grade" is a self-claim.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report.' },
      additives: { score: 5, note: 'Single-ingredient pure glycine; label affirms no fillers, flavours, colours or sweeteners. No additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product or maker; clean record.' },
      transparency: { score: 3, note: 'Named Australian own-manufacturer + glycine dose disclosed (1 g); the "pharmaceutical-grade" claim isn’t backed by any lab report, and it’s a food with no TGA listing.' },
      marketing_honesty: { score: 5, note: 'Structure/function wording; no disease claim and no claim implying a certification it doesn’t hold.' },
    },
    verdict:
      'A clean, single-ingredient pure-glycine food powder from a named Australian maker (own-manufacture) — but its "pharmaceutical-grade" claim is self-asserted with no independent testing or lab report, and the 1 g label serving is a third of the ~3 g used in sleep studies (you’d treble it).',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'now-foods-glycine-pure-powder',
    imagePath: '/images/sources/glycine/now-foods-glycine-pure-powder.jpg',
    brand: 'NOW Foods',
    productName: 'Glycine Pure Powder',
    bottomLine:
      'Its "Pharmaceutical Grade (USP)" label implies a USP certification it doesn’t hold — though the powder is pure and reaches the studied ~3 g in one serving.',
    form: 'single-ingredient powder',
    dose: '3 g per ¾ teaspoon',
    doseReach: { note: 'Reaches the studied ~3 g in one serving', reaches: true },
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Food — not TGA-listed (import)',
    additiveSummary: 'Single-ingredient — "other ingredients: none"',
    scores: {
      testing_purity: { score: 0, note: 'No independent testing found. "Pharmaceutical Grade (USP)" is a grade-spec claim, not USP Verified certification (not in USP’s directory), and NOW declines to produce supplement lab reports; facility GMP is not a product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; NOW declines supplement lab reports, so none is public or on request.' },
      additives: { score: 5, note: 'Pure single-ingredient — "other ingredients: none". No additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this glycine product; other NOW products’ history is held.' },
      transparency: { score: 3, note: 'Named maker + glycine dose disclosed (3 g/serving); but the "USP" grade is a spec claim with no lab report behind it, and it’s a food import with no TGA listing.' },
      marketing_honesty: { score: 4, note: '−1: "Pharmaceutical Grade (USP)" implies a USP certification the product does not hold (it is not USP Verified) — a claim suggesting a certification that doesn’t exist.' },
    },
    verdict:
      'A pure single-ingredient powder that reaches the studied ~3 g in one serving from an identifiable maker — but its loud "Pharmaceutical Grade (USP)" label is a spec claim, not the USP Verified certification it implies, and no lab report is available. Sold as a food import, outside TGA oversight.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'bulksupplements-glycine-powder',
    imagePath: '/images/sources/glycine/bulksupplements-glycine-powder.jpg',
    brand: 'BulkSupplements.com',
    productName: 'Glycine Powder',
    bottomLine:
      'The one with a real verification route — an NSF-registered facility and lab reports on request — and one serving reaches the studied ~3 g.',
    form: 'single-ingredient powder',
    dose: '3 g per serving',
    doseReach: { note: 'Reaches the studied ~3 g in one serving', reaches: true },
    regulated: 'food',
    ausL: null,
    channel: 'Amazon AU (import)',
    certSummary: 'Food — not TGA-listed (import)',
    certVerified: true,
    additiveSummary: 'Single-ingredient; NSF-registered facility; lab reports on request',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product third-party cert and no published lab test. The NSF listing is a registered-FACILITY GMP registration (directory-confirmed), not a product certification — so it earns nothing in this dimension.' },
      label_accuracy: { score: 1, note: 'No independent lab test, but a lab report is available on request (a verified support-ticket channel) — the only product here with any lab-report route (scored on the report-transparency scale, capped at 2).' },
      additives: { score: 5, note: 'Single-ingredient pure glycine; no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this glycine product; the entity’s other-product history is held.' },
      transparency: { score: 4, note: 'Named maker + glycine dose disclosed + a directory-confirmed NSF-registered facility and a documented lab-report-on-request channel — a real verification signal above a bare self-claim; no public per-lot report though.' },
      marketing_honesty: { score: 5, note: 'Its "third-party lab tests each batch" line is backed by the real on-request lab-report channel, so it’s not overstated; no disease or unbacked-cert claim.' },
    },
    verdict:
      'A pure single-ingredient powder that hits the studied ~3 g in one serving, made in a directory-confirmed NSF-registered facility with lab reports available on request — more verification signal than most products here — but there’s no public per-lot report and no finished-product certification, so you can’t open and confirm what’s in the bottle yourself.',
    heldItems: ['Other-product history for the parent entity (a 2015 caffeine warning letter, a 2025 inositol recall, magnesium-glycinate class actions) — none names this glycine product'],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'swanson-ajipure-glycine-powder',
    imagePath: '/images/sources/glycine/swanson-ajipure-glycine-powder.jpg',
    brand: 'Swanson',
    productName: 'AjiPure Glycine Powder',
    bottomLine:
      'Its grade rests on a real, named raw material (Ajinomoto AjiPure), not a bare self-claim — but there’s no lab report for the tub, and 1 g a scoop needs about three.',
    form: 'single-ingredient powder',
    dose: '1 g per scoop',
    doseReach: { note: 'About 3 scoops to reach the studied ~3 g', reaches: false },
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Food — not TGA-listed (import)',
    certVerified: true,
    additiveSummary: 'Single-ingredient; Ajinomoto AjiPure raw material',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product third-party cert, no published lab test, no public batch report. The AjiPure/Ajinomoto pedigree is a raw-material assurance, not a finished-product certification.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report.' },
      additives: { score: 5, note: 'Single-ingredient pure glycine; no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this glycine product; a decades-old other-product warning letter is held.' },
      transparency: { score: 4, note: 'Named maker + glycine dose disclosed + the glycine is Ajinomoto’s branded AjiPure pharmaceutical-grade amino acid — a named, reputable raw-material maker, a real pedigree above a bare self-claim. No finished-product lab report though.' },
      marketing_honesty: { score: 5, note: 'The "pharmaceutical grade / AjiPure" claim is backed by the real Ajinomoto raw-material pedigree, so it’s not overstated; no disease claim.' },
    },
    verdict:
      'The one import whose grade rests on a named, reputable raw-material maker — Ajinomoto’s AjiPure pharmaceutical-grade amino acid — rather than a bare self-claim, giving it a real transparency edge; but there’s still no finished-product certification and no lab report you can open for the Swanson tub itself.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'now-foods-glycine-1000-caps',
    imagePath: '/images/sources/glycine/now-foods-glycine-1000-caps.jpg',
    brand: 'NOW Foods',
    productName: 'Glycine 1,000 mg Veg Capsules',
    bottomLine:
      'Pure glycine in a disclosed, benign capsule; three reach the studied ~3 g — but no testing, no lab report, and a food import outside TGA oversight.',
    form: 'single-ingredient capsules',
    dose: '1 g per capsule',
    doseReach: { note: '3 capsules to reach the studied ~3 g (a mild load)', reaches: true },
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Food — not TGA-listed (import)',
    additiveSummary: 'Disclosed benign capsule shell',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product third-party cert, no published lab test, no public batch report; NOW declines supplement lab reports and facility GMP is not a product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report.' },
      additives: { score: 5, note: 'Disclosed, benign capsule shell (hypromellose, hydroxypropyl cellulose, stearic acid, silicon dioxide); no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this glycine product; other NOW products’ history is held.' },
      transparency: { score: 3, note: 'Named maker + glycine dose disclosed (1 g/cap); "Pharmaceutical Grade" here is a bare descriptor (no "USP", no lab report), and it’s a food import with no TGA listing.' },
      marketing_honesty: { score: 5, note: 'Structure/function wording under the standard disclaimer; the "Pharmaceutical Grade" descriptor carries no "(USP)" and implies no certification — not docked.' },
    },
    verdict:
      'Pure single-ingredient glycine in a disclosed, benign capsule from an identifiable maker; the 3-capsule serving reaches the studied ~3 g at a mild load. But there’s no independent testing and no lab report, and it’s a food import outside TGA oversight.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'thorne-glycine',
    imagePath: '/images/sources/glycine/thorne-glycine.jpg',
    brand: 'Thorne',
    productName: 'Glycine',
    bottomLine:
      'Its "third-party certified" line doesn’t hold for this SKU — the glycine isn’t in the NSF directory — and reaching the studied ~3 g takes six capsules, the heaviest load here.',
    form: 'single-ingredient capsules',
    dose: '500 mg per capsule',
    doseReach: { note: '6 capsules to reach the studied ~3 g (the heaviest load here)', reaches: false },
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Food — not TGA-listed (import)',
    additiveSummary: 'Disclosed benign capsule shell',
    scores: {
      testing_purity: { score: 0, note: 'No independent testing found for this product. Thorne’s glycine is NOT in the NSF Certified for Sport directory (checked 2026-07-20 — 35+ Thorne products are listed, glycine is not); its in-house facility testing is process quality, not per-product content verification.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report located for this SKU.' },
      additives: { score: 5, note: 'Disclosed, benign capsule shell (hypromellose, silicon dioxide); no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this glycine product; older other-product history is held.' },
      transparency: { score: 3, note: 'Named maker + glycine dose disclosed (500 mg/cap); but no product-specific lab report or certification, and it’s a food import with no TGA listing.' },
      marketing_honesty: { score: 4, note: '−1: this glycine is marketed as "third-party certified", but the product is not in any third-party product-cert directory (the NSF Certified for Sport directory was checked and lists 35+ Thorne products, not glycine) — a claim implying a certification that doesn’t exist for this SKU.' },
    },
    verdict:
      'From a maker with a strong quality reputation and in-house testing — but this specific glycine isn’t third-party certified, despite a "third-party certified" line implying it is (the NSF directory was checked and lists 35+ Thorne products, not glycine). Reaching the studied ~3 g takes 6 capsules — the heaviest load here — and no lab report is available for the product.',
    heldItems: ['Older other-product events (a 2014 recall, a 2004 warning letter) — different products, not this glycine'],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'solgar-glycine-500',
    imagePath: '/images/sources/glycine/solgar-glycine-500.jpg',
    brand: 'Solgar',
    productName: 'Glycine 500 mg Vegetable Capsules',
    bottomLine:
      'A clean, fully disclosed capsule that makes no grade or testing claims at all — but no independent testing, and six capsules to reach the studied ~3 g.',
    form: 'single-ingredient capsules',
    dose: '500 mg per capsule',
    doseReach: { note: '6 capsules to reach the studied ~3 g (tied heaviest)', reaches: false },
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    certSummary: 'Food — not TGA-listed (import)',
    additiveSummary: 'Disclosed benign panel; makes no grade claim',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert, no published lab test, no public batch report.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report located.' },
      additives: { score: 5, note: 'Disclosed, benign panel (vegetable cellulose, microcrystalline cellulose, vegetable magnesium stearate, vegetable stearic acid); no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this glycine product; a 25-year-old other-product recall is held.' },
      transparency: { score: 3, note: 'Named maker + glycine dose disclosed (500 mg/cap); notably makes no grade or testing claim at all, and it’s a food import with no TGA listing.' },
      marketing_honesty: { score: 5, note: 'Restrained structure/function copy; no grade/cert claim to overstate and no disease claim.' },
    },
    verdict:
      'An identifiable maker with a clean, fully disclosed capsule panel that notably makes no grade or testing claims at all — but reaching the studied ~3 g takes six capsules, and there’s no independent testing or lab report to verify what’s in the bottle.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'orthoplex-white-glycine',
    imagePath: undefined,
    brand: 'Orthoplex White',
    productName: 'Glycine',
    bottomLine:
      'A restrained practitioner-brand pure glycine ("excipients nil") — but sold as a food with no testing, and a 1.5 g serving, half the studied ~3 g.',
    form: 'single-ingredient powder',
    dose: '1.5 g per serving',
    doseReach: { note: 'Label serving is 1.5 g — half the studied ~3 g', reaches: false },
    regulated: 'food',
    ausL: null,
    channel: 'Practitioner (Bio Concepts)',
    certSummary: 'Food — not TGA-listed',
    additiveSummary: 'Single-ingredient — "excipients nil"',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert, no published lab test, no public batch report.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report located.' },
      additives: { score: 5, note: 'Single-ingredient pure glycine ("excipients nil"); no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; a 2025 recall of other Orthoplex products is held.' },
      transparency: { score: 3, note: 'Named maker + glycine dose disclosed (1.5 g); no lab report or certification. Notably, its sponsor Bio Concepts is a prolific TGA-medicine sponsor yet sells this SKU as a food, outside TGA oversight.' },
      marketing_honesty: { score: 5, note: 'Restrained practitioner-brand copy ("no therapeutic indications"); no disease or unbacked-cert claim.' },
    },
    verdict:
      'A restrained practitioner-brand pure glycine with a clean single-ingredient panel — but sold as a food with no independent testing or lab report, and a 1.5 g serving, half the ~3 g used in sleep studies. Notably its maker is a prolific TGA-medicine sponsor yet sells this one as a food.',
    heldItems: ['A 2025 TGA recall of other Orthoplex products (an iodine/manufacturing error) — different SKUs, not this glycine'],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'blackmores-sleep-sound-magnesium',
    imagePath: '/images/sources/glycine/blackmores-sleep-sound-magnesium.jpg',
    brand: 'Blackmores',
    productName: 'Sleep Sound Magnesium Powder',
    bottomLine:
      'A TGA-listed magnesium sleep powder where glycine is one of five actives; a scoop delivers 3.1 g — but no lab report, and the full ingredients list isn’t published.',
    form: 'combo (+ magnesium, hops, calcium)',
    dose: '3.1 g glycine per scoop',
    doseReach: { note: 'Glycine reaches ~3 g, but it’s one of five actives in a magnesium combo', reaches: true },
    regulated: 'medicine',
    ausL: '312974',
    channel: 'Chemist Warehouse · Woolworths',
    certSummary: 'TGA-listed medicine (AUST L 312974)',
    additiveSummary: 'Each active dosed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the TGA listing is a self-certified listing, not independent testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — the full ingredients list isn’t published online; each of the four actives is individually dosed, and no additive of concern is confirmed.' },
      regulatory: { score: 5, note: 'No regulator action names this product; a cancelled sibling listing is a different (Formula tablet) product, and the 2025 B6 matter names other B6 products — this powder has no B6.' },
      transparency: { score: 4, note: 'Named maker + glycine dose clearly disclosed (3.1 g) + it’s a TGA-listed medicine (AUST L 312974) with a regulated label; no public lab report.' },
      marketing_honesty: { score: 5, note: 'TGA-permitted framing; no disease claim and no unbacked-cert claim on the powder (a "clinically trialled" line belongs to a different Blackmores product).' },
    },
    verdict:
      'A magnesium-led sleep powder sold as a TGA-listed medicine (AUST L 312974) in which glycine is one of five actives; one scoop delivers 3.1 g of glycine, meeting the ~3 g used in sleep studies — but no independent lab test or lab report of the product is public, and the full ingredients list isn’t published online.',
    heldItems: ['A cancelled sibling listing (the Sleep Sound Formula tablet) and the 2025 Blackmores vitamin-B6 matter — other products; this powder has no B6'],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'ethical-nutrients-mega-magnesium-night',
    imagePath: '/images/sources/glycine/ethical-nutrients-mega-magnesium-night.jpg',
    brand: 'Ethical Nutrients',
    productName: 'Mega Magnesium Night Powder',
    bottomLine:
      'A TGA-listed magnesium sleep combo where glycine is a minor ingredient — just 0.74 g a scoop, a quarter of the studied ~3 g.',
    form: 'combo (+ magnesium glycinate, passionflower)',
    dose: '0.74 g free glycine per scoop',
    doseReach: { note: 'Only 0.74 g free glycine — a quarter of the studied ~3 g', reaches: false },
    regulated: 'medicine',
    ausL: '490772',
    channel: 'Chemist Warehouse · pharmacy',
    certSummary: 'TGA-listed medicine (AUST L 490772)',
    additiveSummary: 'Panel disclosed (stevia, flavour, silica, sucrose)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the TGA listing is not independent testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Disclosed panel (stevia, natural flavour, silica, sucrose); no additive of concern, no proprietary blend.' },
      regulatory: { score: 5, note: 'No regulator action names this product; the Mega Magnesium B6 recall was the Raspberry flavour SKU (batch 007764) — this Night powder contains no B6 (held).' },
      transparency: { score: 4, note: 'Named maker + free-glycine dose disclosed (0.74 g) + it’s a TGA-listed medicine (AUST L 490772) with a regulated label; no public lab report.' },
      marketing_honesty: { score: 5, note: 'No disease or unbacked-cert claim for the glycine; TGA-permitted indications. (A manufacturer retail claim about sleep duration isn’t something we can verify, and it isn’t scored here.)' },
    },
    verdict:
      'A TGA-listed magnesium + passionflower sleep combo in which glycine is a minor ingredient (0.74 g), well below the ~3 g used in sleep studies. No independent lab test or lab report was found. The Mega Magnesium B6 recall applies to a different flavour SKU; this Night powder contains no B6.',
    heldItems: ['The Mega Magnesium B6 recall — the Raspberry flavour SKU (batch 007764), not this Night powder, which has no B6'],
    communityStatus: 'summarized',
    communityThemes: GLYCINE_COMMUNITY,
    ratified: true,
  },
];
