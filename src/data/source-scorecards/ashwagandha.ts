// Source scorecards — ashwagandha (AU pilot).
//
// SSG from this repo module (mirrors the Supabase publish-view shape). Scores transcribed from the
// per-product dossiers in docs/research/sources/ashwagandha/, rubric applied
// (docs/SOURCE_SCORECARD_RUBRIC.md). RATIFIED by the owner 2026-07-21.
//
// Ashwagandha-specific owner rulings applied:
//   (1) Quality axis = WITHANOLIDE standardisation + whether it's a NAMED CLINICALLY-STUDIED EXTRACT
//       (KSM-66 / Shoden). Non-disclosure of the withanolide figure = a TRANSPARENCY matter;
//       standardisation/potency itself = evidence, not a sourcing penalty. A named extract is a
//       "used in published trials" CONTEXT flag, NOT credit.
//   (2) A NAMED EXTRACT is an INGREDIENT pedigree (raw-material COA from Ixoreal/Arjuna), NOT a
//       finished-product cert — so it earns nothing on testing_purity (it counts under transparency).
//   (3) testing_purity 0 unless a finished-product 3rd-party cert / published assay / public per-lot
//       COA. Only Gaia (per-batch "Meet Your Herbs" COAs) earns testing/label (2/2), as for its valerian.
//   (4) The Caruso's 7500 recall (Dec 2024, batch Q01687, SUSPECTED THIRD-PARTY TAMPERING — not a
//       Caruso's manufacturing defect) + a separate older s30(1)(c) cancellation attaches to the
//       regulatory dimension as a DEDUCTION (owner-ratified regulatory = 3), shown with the tampering
//       context verbatim. All other brand history is other-product and held.
//   (5) The ashwagandha liver-injury advisory is a DISPLAYED page-level SAFETY note (root+leaf is the
//       higher-scrutiny form; imports skip the AU-mandated warning; pregnancy: avoid). Vitamin B6 in
//       Blackmores Ashwagandha+ is a DISPLAYED per-product safety flag (magnesium precedent), not scored.
//
// SAFETY: brand-negative penalties only from primary, verbatim-verified regulator documents naming the
// product or its line; other-product brand history is held ("under review").
//
// TRANSPARENCY scheme (cumulative, cap 5): +2 maker identifiable; +1 withanolide figure disclosed;
// +1 named clinical extract (KSM-66/Shoden); +1 AUST L medicine OR public per-lot COA (Gaia).

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

export interface AshProduct {
  slug: string;
  brand: string;
  productName: string;
  form: string; // single-herb / combo (+ other actives)
  strength: string; // withanolide figure + extract, the quality axis
  rootPart: 'root' | 'root+leaf';
  regulated: 'medicine' | 'food';
  ausL: string | null;
  channel: string;
  /** Named clinically-studied extract → "used in published trials" context flag. Display only, never scored. */
  trialFlag?: { note: string };
  /** Vitamin-B6 safety flag — displayed, never scored (magnesium precedent). */
  b6?: { note: string };
  /** Import safety note — displayed, never scored: US import skips the AU-mandated liver warning. */
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

// Community read — display-only, NEVER a score input. A general ashwagandha theme.
const ASHWAGANDHA_COMMUNITY = [
  {
    note: 'On r/Supplements, ashwagandha is popular for stress and sleep and many report a real calming effect — but "emotional blunting" or apathy at higher/longer doses, and the liver-caution discussion, are common counter-notes',
    url: 'https://old.reddit.com/r/Supplements/search?q=ashwagandha&restrict_sr=1',
  },
];

// Ratified 2026-07-21. All 12 are AU-available (Chemist Warehouse / Amazon AU / iHerb AU).
// The story: ashwagandha is the MOST transparent of the four ingredients — a named clinical extract
// (KSM-66/Shoden) + a disclosed withanolide figure + a TGA-medicine listing stack to transparency 5.
// Gaia (import) is again the sole verification standout (per-batch COAs → testing/label 2). Caruso's
// is the one regulatory deduction (a Dec-2024 tampering recall, shown with context).
export const ASHWAGANDHA_SOURCES: AshProduct[] = [
  {
    slug: 'carusos-ashwagandha-7500',
    imagePath: '/images/sources/ashwagandha/carusos-ashwagandha-7500.jpg',
    brand: "Caruso's",
    productName: 'Ashwagandha 7500',
    form: 'single-herb (KSM-66)',
    strength: 'withanolides 30 mg · 600 mg extract (7.5 g dry-root eq)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '406701',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'KSM-66 · TGA-listed (AUST L 406701)',
    trialFlag: { note: 'Built on KSM-66, a named ashwagandha extract with published RCTs — a "used in trials" signal for the ingredient (context, not a quality endorsement).' },
    additiveSummary: 'Highest disclosed withanolide in the set; full panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No independent lab testing found — no third-party product cert (USP/NSF/Informed) and no published lab test. KSM-66 is an ingredient pedigree, not a finished-product cert; the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product and no public batch lab report (dimension shows "no lab-test data").' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online (only "contains lactose"); no confirmed additive of concern.' },
      regulatory: { score: 3, note: '−2: a TGA recall (10 Dec 2024, batch Q01687) named this product — but the cause was suspected THIRD-PARTY TAMPERING (unknown inserted capsules), "not yet determined", NOT a Caruso’s manufacturing defect; a separate older listing was also cancelled. The recall was batch-specific and the current listing stays active.' },
      transparency: { score: 5, note: 'Named maker + the highest disclosed withanolide figure in the set (30 mg) + a named clinical extract (KSM-66) + a TGA-listed medicine (AUST L 406701).' },
      marketing_honesty: { score: 5, note: 'No "clinically studied" claim was found for this product; AU-permitted "supports/helps" framing, no disease claim.' },
    },
    verdict:
      'Caruso’s Ashwagandha 7500 carries the highest disclosed withanolide figure in the set (30 mg of KSM-66 root extract per tablet) with full extract disclosure — but a batch of it was recalled in December 2024 over suspected third-party tampering (unknown capsules inserted into packs), which was not a Caruso’s manufacturing or quality defect. No independent lab test of the product is public.',
    heldItems: ['A separate 2024 TGA infringement action ($82,500) against the sponsor named other Caruso’s products, not this ashwagandha — held'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'natures-way-ashwagandha-6000',
    imagePath: undefined, // Nature's Way site uses query-string image URLs (redacted); lettered fallback
    brand: "Nature's Way",
    productName: 'Ashwagandha 6000 mg',
    form: 'single-herb (KSM-66)',
    strength: 'withanolides 15 mg · 300 mg extract (3.75 g dry-root eq)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '384294',
    channel: 'Chemist Warehouse · Woolworths',
    certSummary: 'KSM-66 · TGA-listed (AUST L 384294)',
    trialFlag: { note: 'Built on KSM-66, a named ashwagandha extract with published RCTs — a "used in trials" signal for the ingredient (context, not a quality endorsement).' },
    additiveSummary: 'Discloses its withanolide figure (15 mg); full panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is an ingredient pedigree, the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; an older generic listing was sponsor-cancelled as a routine relist (held), and the current KSM-66 formula is AUST L 384294.' },
      transparency: { score: 5, note: 'Named maker (Pharmacare) + discloses its withanolide figure (15 mg — unlike its sibling Sound Sleep) + a named clinical extract (KSM-66) + a TGA-listed medicine (AUST L 384294).' },
      marketing_honesty: { score: 5, note: 'No unbacked clinical claim on this SKU’s page; AU-permitted framing.' },
    },
    verdict:
      'A single-herb KSM-66 ashwagandha sold as a TGA-listed medicine that discloses its withanolide strength (15 mg) — unlike its own sibling Sound Sleep, which doesn’t — but with no independent lab test of the product.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'switch-nutrition-ksm66-ashwagandha',
    imagePath: '/images/sources/ashwagandha/switch-nutrition-ksm66-ashwagandha.jpg',
    brand: 'Switch Nutrition',
    productName: 'KSM-66 Ashwagandha',
    form: 'single-herb (KSM-66)',
    strength: 'withanolides 15 mg (~5%) · 300 mg extract (3.75 g dry-root eq)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '444675',
    channel: 'Brand webstore · Amazon AU',
    certSummary: 'KSM-66 · TGA-listed (AUST L 444675)',
    trialFlag: { note: 'Built on KSM-66, a named ashwagandha extract with published RCTs — a "used in trials" signal for the ingredient (context, not a quality endorsement).' },
    additiveSummary: 'Single-herb; discloses its withanolide figure (15 mg)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is an ingredient pedigree, the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — single-active capsule; full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; a 2026 TGA advertising fine against the brand was for other products (NMN and vitamin D3), not this ashwagandha — held.' },
      transparency: { score: 5, note: 'Named maker + discloses its withanolide figure (15 mg / ~5%) + a named clinical extract (KSM-66) + a TGA-listed medicine (AUST L 444675).' },
      marketing_honesty: { score: 5, note: 'No clear dose-mismatch overclaim (delivers within the studied 300–600 mg band); no disease claim.' },
    },
    verdict:
      'A single-herb KSM-66 ashwagandha sold as a TGA-listed medicine that discloses its withanolide strength (15 mg). The brand’s separate 2026 TGA advertising fine was for other products (NMN and vitamin D3), not this one. No independent lab test of the product is public.',
    heldItems: ['A 2026 TGA advertising fine ($79,200) against the sponsor was for NMN and vitamin D3, not this ashwagandha — held'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'herbs-of-gold-mind-ease',
    imagePath: '/images/sources/ashwagandha/herbs-of-gold-mind-ease.jpg',
    brand: 'Herbs of Gold',
    productName: 'Mind Ease',
    form: 'combo (+ lavender)',
    strength: 'withanolides 15 mg · 300 mg extract (per tablet, twice daily)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '323152',
    channel: 'Chemist Warehouse · practitioner',
    certSummary: 'KSM-66 · TGA-listed (AUST L 323152)',
    trialFlag: { note: 'Built on KSM-66, a named ashwagandha extract with published RCTs — and at the label’s dose (1 tablet twice daily = 600 mg/day) it matches the 600 mg/day used in the KSM-66 trial its copy cites. Context, not a quality endorsement.' },
    additiveSummary: 'KSM-66 + lavender; discloses its withanolide figure (15 mg)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is an ingredient pedigree, the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; each active is individually dosed (not a proprietary blend); no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; s30(1)(c) cancellations on other Herbs of Gold products are held.' },
      transparency: { score: 5, note: 'Named maker + discloses its withanolide figure (15 mg) + a named clinical extract (KSM-66) + a TGA-listed medicine (AUST L 323152).' },
      marketing_honesty: { score: 5, note: 'Its "clinically trialled" claim checks out: at the label’s 1-tablet-twice-daily direction the product delivers 600 mg/day of KSM-66 — the dose used in the trial it cites — so it isn’t a dose mismatch.' },
    },
    verdict:
      'A KSM-66 ashwagandha + lavender combo sold as a TGA-listed medicine that discloses its withanolide strength (15 mg per tablet), and — taken as directed (1 tablet twice daily) — delivers the 600 mg/day KSM-66 dose used in the trial its "clinically trialled" copy cites. No independent lab test of the product is public.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'natures-way-sound-sleep',
    imagePath: '/images/sources/ashwagandha/natures-way-sound-sleep.jpg',
    brand: "Nature's Way",
    productName: 'Sound Sleep',
    form: 'single-herb (KSM-66)',
    strength: 'active strength not stated · 600 mg extract (7.5 g dry-root eq)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '508647',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'KSM-66 · TGA-listed (AUST L 508647)',
    trialFlag: { note: 'Built on KSM-66, a named ashwagandha extract with published RCTs — a "used in trials" signal for the ingredient (context, not a quality endorsement).' },
    additiveSummary: 'KSM-66 but withanolide figure NOT disclosed; full panel not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is an ingredient pedigree, the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; the parent’s other-product events (a 2020 gummies fine, cancellations) are held.' },
      transparency: { score: 4, note: 'Named maker + a named clinical extract (KSM-66) + a TGA-listed medicine (AUST L 508647), but — unlike its own sibling Ashwagandha 6000 — it does NOT disclose its withanolide figure.' },
      marketing_honesty: { score: 5, note: 'The "clinically trialled" line attaches to the KSM-66 ingredient (which has RCTs); no disease claim.' },
    },
    verdict:
      'A single-herb ashwagandha for sleep built on KSM-66 and sold as a TGA-listed medicine — but, unlike its own sibling Ashwagandha 6000, it never tells you how much withanolide is in the tablet, and no independent lab test of the product is public.',
    heldItems: ['The parent company’s other-product events (a 2020 gummies allergen fine, various cancellations) — other products, not this one'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'fusion-health-stress-anxiety',
    imagePath: undefined,
    brand: 'Fusion Health',
    productName: 'Stress & Anxiety',
    form: 'combo (6-herb: + holy basil, poria, magnolia, polygala, citrus)',
    strength: 'active strength not stated · KSM-66 187.5 mg/tablet',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '353060',
    channel: 'Practitioner · health-store',
    certSummary: 'KSM-66 · TGA-listed (AUST L 353060)',
    trialFlag: { note: 'Contains KSM-66 (a named ashwagandha extract with RCTs); its headline clinical claim actually rests on the holy basil (OciBest), which has its own trial. Context, not a quality endorsement.' },
    additiveSummary: '6-herb combo, each herb dosed; withanolide figure not disclosed',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the named extracts are ingredient pedigrees, the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — each of the six herbs is individually dosed (not a proprietary blend); full excipient panel not published; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; the sponsor’s other-product events (a compliance review with no safety issue, a passed lab test, cancellations) are held.' },
      transparency: { score: 4, note: 'Named maker + a named clinical extract (KSM-66) + a TGA-listed medicine (AUST L 353060), but it does NOT disclose the ashwagandha’s withanolide figure.' },
      marketing_honesty: { score: 5, note: 'The clinical claim rests on the holy basil (OciBest), which has its own trial at a whole-formula dose — backed, not borrowed; a "clinically-proven" title appears only in retailer copy, not the brand label.' },
    },
    verdict:
      'A six-herb stress-and-anxiety combination where ashwagandha is one named KSM-66 component, but the withanolide strength isn’t disclosed and the product’s headline clinical claim actually rests on the holy basil — which has its own trial — not the ashwagandha. Each herb’s dose is stated, and no independent lab test of the product is public.',
    heldItems: ['The sponsor’s other-product TGA events (a compliance review with no safety issue, a passed lab test, s30(1)(c) cancellations) — other products'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'green-nutritionals-shoden-ashwagandha',
    imagePath: '/images/sources/ashwagandha/green-nutritionals-shoden-ashwagandha.jpg',
    brand: 'Green Nutritionals',
    productName: 'Shoden Ashwagandha',
    form: 'single-herb (Shoden)',
    strength: '35% withanolide glycosides · 84 mg per capsule (240 mg Shoden)',
    rootPart: 'root+leaf',
    regulated: 'medicine',
    ausL: '507011',
    channel: 'Health-store · brand',
    certSummary: 'Shoden · TGA-listed (AUST L 507011)',
    trialFlag: { note: 'Built on Shoden, a named ashwagandha extract with published RCTs — and it delivers at/above the studied dose. Context, not a quality endorsement.' },
    additiveSummary: 'Highest standardisation figure in the set; root+leaf',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; Shoden is an ingredient pedigree, the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — single-herb; disclosed excipients match no additive of concern; full panel not independently verified.' },
      regulatory: { score: 5, note: 'No regulator action names this product; other brands’ / sponsor events are held.' },
      transparency: { score: 5, note: 'Named maker + discloses its standardisation (35% withanolide glycosides / 84 mg) + a named clinical extract (Shoden) + a TGA-listed medicine (AUST L 507011).' },
      marketing_honesty: { score: 5, note: 'Its "clinically studied" claim checks out — it delivers 240 mg/day, at or above the Shoden trial dose; no disease claim.' },
    },
    verdict:
      'The highest-standardisation extract in the set (Shoden, 35% withanolide glycosides), sold as a TGA-listed medicine, and its clinical claim is met at the dose delivered. Note it is made from ashwagandha root AND leaf — the plant part under extra liver scrutiny (see the safety note above). No independent lab test of the product is public.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'blackmores-ashwagandha-plus',
    imagePath: '/images/sources/ashwagandha/blackmores-ashwagandha-plus.jpg',
    brand: 'Blackmores',
    productName: 'Ashwagandha+',
    form: 'combo (+ B vitamins, vitamin C, magnesium, zinc)',
    strength: 'withanolides ~4.5 mg · 150 mg extract (generic, ~0.3%)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '310894',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'Generic extract · TGA-listed (AUST L 310894)',
    b6: { note: 'Contains vitamin B6 at ~41 mg/day at label use — above the 10 mg/day the TGA sets its neuropathy warning at — and carries the mandated peripheral-neuropathy warning. Shown for your safety; separate from the scores.' },
    additiveSummary: 'Generic low-withanolide ashwagandha in a B-vitamin/mineral combo',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online (only a sulfites allergen line); each active is individually dosed; no confirmed additive of concern. (Vitamin B6 is a displayed safety flag, not an additive-of-concern deduction.)' },
      regulatory: { score: 5, note: 'No regulator action names this product; the 2025 Blackmores vitamin-B6 matter names other products (this SKU’s B6 is shown as a safety flag, not scored).' },
      transparency: { score: 4, note: 'Named maker + discloses its withanolide figure (~4.5 mg) + a TGA-listed medicine (AUST L 310894), but it uses a generic extract — no named clinical extract.' },
      marketing_honesty: { score: 5, note: 'No clinical-backing claim without a named trial extract; traditional-use framing only.' },
    },
    verdict:
      'A generic, low-withanolide ashwagandha (~4.5 mg) delivered in a B-vitamin, vitamin-C, magnesium and zinc stress-support combo, sold as a TGA-listed medicine — but not a named clinical extract, and it carries a notable amount of vitamin B6 (see its safety flag). No independent lab test of the product is public.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'swisse-ultiboost-ashwagandha-calm',
    imagePath: '/images/sources/ashwagandha/swisse-ultiboost-ashwagandha-calm.jpg',
    brand: 'Swisse',
    productName: 'Ultiboost Ashwagandha Calm+',
    form: 'combo (+ magnesium, passionflower, reishi)',
    strength: 'withanolides 1.5 mg · 30 mg extract (generic, the lowest dose here)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '390319',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'Generic extract · TGA-listed (AUST L 390319)',
    additiveSummary: 'Lowest ashwagandha dose in the set; generic extract',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; each active is individually dosed; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; two sibling "Calm + De-Stress" SKU cancellations are other products, held.' },
      transparency: { score: 4, note: 'Named maker + discloses its withanolide figure (1.5 mg) + a TGA-listed medicine (AUST L 390319), but it uses a generic extract — no named clinical extract.' },
      marketing_honesty: { score: 5, note: 'No "clinically studied" claim on this SKU (a separate Swisse "High Strength" product markets KSM-66 — not this one); no disease claim.' },
    },
    verdict:
      'The lowest-dose ashwagandha in the set — a TGA-listed medicine that discloses its (very small) 1.5 mg withanolide content in a magnesium/passionflower/reishi calm combo, with no named clinical extract and no independent lab test of the product.',
    heldItems: ['Two sibling "Calm + De-Stress" SKU cancellations — other products, not this one'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'thompsons-ashwagandha-complex-stress-sleep',
    imagePath: '/images/sources/ashwagandha/thompsons-ashwagandha-complex-stress-sleep.jpg',
    brand: "Thompson's",
    productName: 'Ashwagandha Complex Stress + Sleep',
    form: 'combo (+ passionflower, lavender oil)',
    strength: 'withanolides 3.75 mg/tablet · 150 mg extract (generic)',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '430133',
    channel: 'Chemist Warehouse · Amazon AU',
    certSummary: 'Generic extract · TGA-listed (AUST L 430133)',
    additiveSummary: 'Generic ashwagandha in a passionflower/lavender sleep combo',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the TGA listing is not testing.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; each active is individually dosed; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product; a cancelled sibling listing was an ownership-transfer retirement (Homart acquired Thompson’s in 2024), not enforcement — held.' },
      transparency: { score: 4, note: 'Named maker + discloses its withanolide figure (3.75 mg) + a TGA-listed medicine (AUST L 430133), but it uses a generic extract — no named clinical extract.' },
      marketing_honesty: { score: 5, note: 'No unbacked clinical claim; traditional-use framing.' },
    },
    verdict:
      'A generic ashwagandha (no named clinical extract) in a passionflower/lavender sleep combo, sold as a TGA-listed medicine that discloses its withanolide strength (3.75 mg per tablet). A cancelled sibling listing was an ownership-transfer retirement, not enforcement. No independent lab test of the product is public.',
    heldItems: ['A cancelled sibling ARTG listing under the former owner (Integria) — an ownership-transfer retirement, not enforcement'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'gaia-herbs-ashwagandha-root',
    imagePath: '/images/sources/ashwagandha/gaia-herbs-ashwagandha-root.jpg',
    brand: 'Gaia Herbs',
    productName: 'Ashwagandha Root',
    form: 'single-herb (proprietary blend — not KSM-66)',
    strength: 'withanolides 2.5 mg · 350 mg per capsule (generic, ~0.7%)',
    rootPart: 'root',
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU (import)',
    certSummary: 'Per-batch lab reports (Meet Your Herbs)',
    certVerified: true,
    importSafety: { note: 'Imported into Australia (no TGA listing). Carries no AU-mandated ashwagandha liver-caution advisory — an AU buyer misses the local warning.' },
    additiveSummary: 'Publishes per-batch lab reports; proprietary blend (not KSM-66)',
    scores: {
      testing_purity: { score: 2, note: 'No third-party product cert and not TGA-listed, but Gaia publishes per-batch lab reports (identity + contaminants + marker compounds, keyed to the bottle’s batch) from its own accredited lab — the strongest signal short of a third-party cert; above the others’ 0, below a third-party product cert.' },
      label_accuracy: { score: 2, note: 'No independent third-party assay, but a public per-batch lab report keyed to the bottle’s batch code — per-batch content verification (the maker’s own testing, not independent), held at 2.' },
      additives: { score: 5, note: 'Disclosed, benign panel (vegetable glycerin, water, vegan capsule); "proprietary extract blend" is a word-match but single-herb with the withanolide marker disclosed — no additive of concern.' },
      regulatory: { score: 5, note: 'No FDA/FTC/TGA action against Gaia Herbs or this product; a 2020 warning letter named a different, unrelated company.' },
      transparency: { score: 4, note: 'Named maker (own-manufacture) + discloses its withanolide figure (2.5 mg) + a public per-batch lab report — but a generic proprietary blend (not KSM-66) and no AUST L (import).' },
      marketing_honesty: { score: 5, note: 'DSHEA structure/function framing; no disease claim, no unbacked cert claim.' },
    },
    verdict:
      'The verification standout of the set: the one ashwagandha here that publishes per-batch lab reports you can pull up from your bottle’s own batch code — though it is a low-withanolide proprietary blend (not KSM-66, despite the common mix-up) and a US import that carries no Australian liver warning.',
    heldItems: ['A 2020 US warning letter named a different company (a similarly-named entity), not Gaia Herbs'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
  {
    slug: 'now-foods-ashwagandha-450',
    imagePath: '/images/sources/ashwagandha/now-foods-ashwagandha-450.jpg',
    brand: 'NOW Foods',
    productName: 'Ashwagandha Standardized Extract 450 mg',
    form: 'single-herb (generic standardised)',
    strength: 'min 2.5% withanolides · ~11 mg · 450 mg extract',
    rootPart: 'root+leaf',
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU (import)',
    certSummary: 'Not TGA-listed (import)',
    importSafety: { note: 'Imported into Australia (no TGA listing) and made from root AND leaf (the higher-liver-scrutiny form). Carries no AU-mandated ashwagandha liver-caution advisory — an AU buyer misses the local warning.' },
    additiveSummary: 'Generic standardised extract (no named clinical extract); root+leaf',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert, no published lab test, and not TGA-listed (import); NOW’s facility GMP is not a product cert and it declines supplement lab reports.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public or on-request lab report.' },
      additives: { score: 5, note: 'Disclosed, benign panel (hypromellose, rice flour, magnesium stearate); no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this ashwagandha product; other NOW products’ history is held.' },
      transparency: { score: 3, note: 'Named maker + discloses its standardisation (min 2.5% / ~11 mg) — but a generic extract (no named clinical extract), no AUST L (import), and no public lab report.' },
      marketing_honesty: { score: 5, note: 'Hedged structure/function wording under the standard disclaimer; no disease claim.' },
    },
    verdict:
      'A generic standardised extract (no named clinical extract) that discloses its 2.5% / ~11 mg withanolides — but it is made from ashwagandha root AND leaf (the higher-liver-scrutiny form) AND is an import carrying no AU liver warning, a double safety flag, with no independent lab test of the product.',
    heldItems: ['Older other-product events for the maker (a 2004 warning letter, food recalls) — different products'],
    communityStatus: 'summarized',
    communityThemes: ASHWAGANDHA_COMMUNITY,
    ratified: true,
  },
];
