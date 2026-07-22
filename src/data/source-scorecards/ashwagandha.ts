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
  /** One-line, plain-language bottom line — the 2-second scan (leads the card, above the fuller verdict). */
  bottomLine: string;
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
    bottomLine:
      'The highest-strength KSM-66 here (30 mg) — but a batch was recalled in Dec 2024 over suspected tampering (not a Caruso’s quality defect).',
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
    bottomLine:
      'Names KSM-66 and tells you its strength (15 mg) — a TGA-listed medicine, no red flags. Discloses more than its own sibling, Sound Sleep.',
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
    bottomLine:
      'A single-herb KSM-66 that discloses its strength (15 mg) and is a TGA-listed medicine — no red flags on the product itself.',
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
    bottomLine:
      'A KSM-66 + lavender combo that discloses its strength — and, taken as directed, actually delivers the studied dose its "clinically trialled" claim cites.',
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
    bottomLine:
      'Built on KSM-66 and a TGA medicine — but, unlike its own sibling Ashwagandha 6000, it never tells you its withanolide strength.',
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
    bottomLine:
      'A six-herb combo with KSM-66; it doses each herb but doesn’t disclose the ashwagandha’s strength, and its clinical claim rests on the holy basil.',
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
    bottomLine:
      'The highest-standardisation extract here (Shoden), a TGA medicine, and its clinical claim is met at the dose delivered — note it’s root + leaf.',
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
    bottomLine:
      'A generic, low-dose ashwagandha in a vitamin/mineral combo — and it adds a notable amount of vitamin B6 (carries the nerve-damage warning).',
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
    bottomLine:
      'The lowest ashwagandha dose here (1.5 mg) — a generic extract in a calm combo; a TGA medicine, no red flags but very little herb.',
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
    bottomLine:
      'A generic ashwagandha (no named extract) in a passionflower/lavender sleep combo; discloses its strength, a TGA medicine.',
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
    bottomLine:
      'The one you can actually verify — it publishes per-batch lab reports — though it’s a generic low-dose blend (not KSM-66) and a no-AU-warning import.',
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
    bottomLine:
      'A generic standardised extract that discloses its strength — but no named studied extract, an import with no AU liver warning, and root + leaf.',
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

  // ── Phase 2: Chemist Warehouse + Amazon AU bestsellers (deduped into the set). Ratified 2026-07-22.
  {
    slug: 'emrald-labs-ashwagandha-ksm',
    imagePath: '/images/sources/ashwagandha/emrald-labs-ashwagandha-ksm.jpg',
    brand: 'Emrald Labs',
    productName: 'Ashwagandha KSM',
    bottomLine:
      'The best-disclosed of the new set — a KSM-66 tablet that prints its withanolide %, names its extract, and lists its full ingredients panel; still no independent lab test.',
    form: 'single-herb (KSM-66)',
    strength: 'min 5% withanolides · ~15 mg · 300 mg extract',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '403964',
    channel: 'sports retailers · brand',
    trialFlag: { note: 'Uses the named KSM-66 extract, which has published stress/sleep trials — a factual "used in trials" signal, not a quality endorsement of this product.' },
    certSummary: 'TGA-listed (AUST L 403964)',
    additiveSummary: 'Full excipient panel disclosed (rice flour, HPMC, magnesium stearate, silica)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert (USP/NSF/Informed) and no published lab test; the KSM-66 branded extract is ingredient pedigree, not a finished-product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Full excipient panel disclosed and benign (rice flour, HPMC, magnesium stearate, silica); no additive of concern.' },
      regulatory: { score: 5, note: 'No regulator action names this product or sponsor.' },
      transparency: { score: 5, note: 'Named maker + AUST L + names the KSM-66 extract AND prints its withanolide standardisation (min 5%) AND discloses the full excipient panel — the fullest disclosure in this batch.' },
      marketing_honesty: { score: 5, note: 'References the KSM-66 research without an unsupported finished-product claim; no disease or unsupported-proof claim.' },
    },
    verdict:
      'The most transparent of the new products — a named KSM-66 tablet that prints its withanolide standardisation and its full ingredients panel and carries a clean record — held below the very top only because there is still no independent lab test of the finished product.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'bioglan-ashwagandha-plus',
    imagePath: '/images/sources/ashwagandha/bioglan-ashwagandha-plus.jpg',
    brand: 'Bioglan',
    productName: 'Ashwagandha Plus',
    bottomLine:
      'A KSM-66 tablet at the studied 600 mg/day dose from a named maker — but it hides its withanolide figure and has no independent lab test.',
    form: 'single-herb (KSM-66) (+ vitamin B5)',
    strength: 'KSM-66 600 mg · 7.5 g dry-root eq · withanolide mg not stated',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '378376',
    channel: 'Chemist Warehouse · Amazon AU',
    trialFlag: { note: 'Uses the named KSM-66 extract at 600 mg/day — the dose used in its published stress trials — a factual "used in trials" signal, not a quality endorsement.' },
    certSummary: 'TGA-listed (AUST L 378376)',
    additiveSummary: 'Named KSM-66 + B5; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; the KSM-66 branded extract is ingredient pedigree, not a finished-product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names this exact product; a same-line TGA compliance report (ARTG 289121) and a gummies cancellation (444123) are other products, held.' },
      transparency: { score: 4, note: 'Named maker + AUST L + names the KSM-66 extract, but does not print the withanolide mg (inferred ~30 mg at 5%).' },
      marketing_honesty: { score: 5, note: '"Clinically researched KSM-66" is substantiated — it delivers the 600 mg/day KSM-66 trial dose (owner-ratified; same basis that cleared Herbs of Gold).' },
    },
    verdict:
      'A KSM-66 tablet that delivers the studied 600 mg/day dose and carries a clean record for this SKU, so its "clinically researched" copy holds up — but it withholds the withanolide figure and has no independent lab testing.',
    heldItems: ['Same-line TGA compliance report (ARTG 289121) and a Bioglan gummies cancellation (444123) — other products, held'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'carusos-ashwagandha-sleep',
    imagePath: '/images/sources/ashwagandha/carusos-ashwagandha-sleep.jpg',
    brand: "Caruso's",
    productName: 'Ashwagandha + Sleep',
    bottomLine:
      'A KSM-66 sleep combo, TGA-listed and NOT named in any recall — but it hides its withanolide figure and has no independent lab test.',
    form: 'combo (KSM-66 + skullcap, hops, magnesium)',
    strength: 'KSM-66 600 mg · 7.5 g dry-root eq · withanolide mg not stated',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '474850',
    channel: 'Chemist Warehouse · Amazon AU',
    trialFlag: { note: 'Uses the named KSM-66 extract at 600 mg/day — a factual "used in trials" signal, not a quality endorsement.' },
    certSummary: 'TGA-listed (AUST L 474850)',
    additiveSummary: 'Named KSM-66 sleep combo; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is ingredient pedigree, not a finished-product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'This SKU (AUST L 474850) is not named in any recall or cancellation. The Dec-2024 tampering recall named the separate Ashwagandha 7500 (AUST L 406701) and the s30(1)(c) cancellation was AUST L 308970 — different products, held as brand context.' },
      transparency: { score: 4, note: 'Named maker + AUST L + names the KSM-66 extract, but does not print the withanolide mg (the single-herb 7500 sibling does; this combo omits it).' },
      marketing_honesty: { score: 5, note: 'Indications hedged in TGA-permitted form; delivers the KSM-66 trial dose, so its research framing holds up.' },
    },
    verdict:
      'A KSM-66 sleep combo from a named maker that — unlike its recalled 7500 sibling — carries a clean regulatory record for this exact listing, but withholds the withanolide figure and has no independent lab testing.',
    heldItems: ["Caruso's Ashwagandha 7500 Dec-2024 tampering recall (AUST L 406701, batch Q01687) and the AUST L 308970 cancellation — different SKUs, held as brand-level context, not this product"],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'oriental-botanicals-anxiolift',
    imagePath: '/images/sources/ashwagandha/oriental-botanicals-anxiolift.jpg',
    brand: 'Oriental Botanicals',
    productName: 'Anxiolift',
    bottomLine:
      'A KSM-66 stress combo from a named maker with a clean record — but the lowest KSM-66 dose here, no withanolide figure, and no independent lab test.',
    form: 'combo (KSM-66 + holy basil OciBest, polygala, magnolia, poria, citrus)',
    strength: 'KSM-66 187.5 mg · 1.88 g dry-root eq · withanolide mg not stated',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '369796',
    channel: 'Chemist Warehouse · practitioner',
    trialFlag: { note: 'Uses two named extracts with published trials (KSM-66 ashwagandha + OciBest holy basil) — a factual "used in trials" signal, not a quality endorsement.' },
    certSummary: 'TGA-listed (AUST L 369796)',
    additiveSummary: 'Named KSM-66 + OciBest six-herb combo; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66/OciBest are ingredient pedigree, not finished-product certs.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names the current product; a prior Anxiolift listing (AUST L 156409) was cancelled at the sponsor’s request in 2015 — a superseded listing, held, not attributed.' },
      transparency: { score: 4, note: 'Named maker + AUST L + names the KSM-66 (and OciBest) extracts, but does not print the withanolide mg and carries the lowest KSM-66 dose in the set.' },
      marketing_honesty: { score: 5, note: 'AU-permitted indication copy; no "clinically proven" claim found on the captured listing.' },
    },
    verdict:
      'A named-extract six-herb stress combo with a clean record, but it carries the lowest KSM-66 dose of the set, withholds the withanolide figure, and has no independent lab testing.',
    heldItems: ['A prior Anxiolift listing (AUST L 156409) cancelled at the sponsor’s request in 2015 — superseded, not the current SKU'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'nutricost-ksm66-ashwagandha',
    brand: 'Nutricost',
    productName: 'Ashwagandha KSM-66',
    bottomLine:
      'A KSM-66 import that discloses its withanolide figure and keeps its marketing restrained — but no AUST L, no AU liver warning, and no independent lab test.',
    form: 'single-herb (KSM-66) (+ BioPerine)',
    strength: '5% withanolides · 30 mg · 600 mg extract',
    rootPart: 'root',
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    trialFlag: { note: 'Uses the named KSM-66 extract at 600 mg — a factual "used in trials" signal, not a quality endorsement.' },
    importSafety: { note: 'Imported into Australia (no TGA listing), so it carries no AU-mandated ashwagandha liver-caution advisory — an AU buyer misses the local warning. Also adds BioPerine (piperine), which can affect how the body processes some medicines.' },
    certSummary: 'Not TGA-listed (import)',
    additiveSummary: 'Discloses withanolide + BioPerine (piperine); benign panel',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product third-party cert and no public COA; a dagger-footnoted "Third-Party Tested" claim does not resolve to a named certifier (USP/NSF/Informed), and a GMP facility is not a product cert.' },
      label_accuracy: { score: 0, note: 'No independent third-party lab test of the exact product; no public per-lot COA.' },
      additives: { score: 5, note: 'Benign disclosed panel; BioPerine (piperine) is a disclosed co-active, not an additive of concern.' },
      regulatory: { score: 5, note: 'No FDA/FTC action names this product; a civil class action on other Nutricost products (EAA/pre-workout) is held.' },
      transparency: { score: 4, note: 'Named maker + names the KSM-66 extract AND discloses its withanolide figure (30 mg / 5%) — but an import with no AUST L and no public lab report.' },
      marketing_honesty: { score: 5, note: 'Comparatively restrained — no "clinically proven" claim; the softer dagger-footnoted "third-party tested" wording is not an explicit certification claim (owner-ratified: not docked).' },
    },
    verdict:
      'A KSM-66 import that discloses its withanolide figure and keeps its copy restrained, but carries no AUST L, no AU liver warning, and no independent finished-product test.',
    heldItems: ['A civil class action on other Nutricost products (EAA/pre-workout powders) — other products, held'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'swisse-ashwagandha-gummies',
    imagePath: '/images/sources/ashwagandha/swisse-ashwagandha-gummies.jpg',
    brand: 'Swisse',
    productName: 'Ashwagandha Gummies',
    bottomLine:
      'The only gummy here — a KSM-66 gummy that discloses its sulfites and sugar alcohols, but hides its withanolide figure and has no independent lab test.',
    form: 'single-herb (KSM-66), gummy',
    strength: 'KSM-66 300 mg/day · 1.875 g dry-root eq · withanolide mg not stated',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '523413',
    channel: 'Chemist Warehouse · Amazon AU',
    trialFlag: { note: 'Uses the named KSM-66 extract — a factual "used in trials" signal, not a quality endorsement.' },
    certSummary: 'TGA-listed (AUST L 523413)',
    additiveSummary: 'Gummy — discloses sulfites + sugar alcohols; no artificial colours',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is ingredient pedigree, not a finished-product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — as a gummy it discloses sulfites and sugar alcohols (6.36 g per 2 gummies, with a laxative caution) and states "99% sugar-free" with no artificial colours; format-inherent and disclosed, no watchlist additive of concern (owner-ratified).' },
      regulatory: { score: 5, note: 'No action names this product or line.' },
      transparency: { score: 4, note: 'Named maker + AUST L + names the KSM-66 extract, but does not print the withanolide mg (inferred ~15 mg/day at 5%).' },
      marketing_honesty: { score: 5, note: 'AU-permitted indication copy; no unsupported cert or proof claim.' },
    },
    verdict:
      'The one gummy in the set — a KSM-66 gummy that is unusually upfront about its sulfites and sugar alcohols, but withholds the withanolide figure and has no independent lab testing.',
    heldItems: ['AUST L 523413 — confirm on the live ARTG'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'natures-own-ashwagandha-plus',
    imagePath: '/images/sources/ashwagandha/natures-own-ashwagandha-plus.jpg',
    brand: "Nature's Own",
    productName: 'Ashwagandha+',
    bottomLine:
      'A KSM-66 combo at the studied 600 mg/day dose, but it adds a little vitamin B6, hides its withanolide figure, and has no independent lab test.',
    form: 'combo (KSM-66 + Siberian ginseng)',
    strength: 'KSM-66 300 mg (600 mg/day) · withanolide mg not stated',
    rootPart: 'root',
    regulated: 'medicine',
    ausL: '520807',
    channel: 'Chemist Warehouse · Amazon AU',
    trialFlag: { note: 'Uses the named KSM-66 extract at 600 mg/day — a factual "used in trials" signal, not a quality endorsement.' },
    b6: { note: 'Contains vitamin B6 at a low dose (~4 mg/day) — well below the TGA neuropathy-warning band, but it is added B6.' },
    certSummary: 'TGA-listed (AUST L 520807)',
    additiveSummary: 'Named KSM-66 + Siberian ginseng; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; KSM-66 is ingredient pedigree, not a finished-product cert.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names this product or line.' },
      transparency: { score: 4, note: 'Named maker + AUST L + names the KSM-66 extract, but does not print the withanolide mg (inferred ~15 mg at 5%).' },
      marketing_honesty: { score: 5, note: 'Uses "evidence-based extract" (not "clinically proven") and delivers the 600 mg/day KSM-66 trial dose — no wrong-dose mismatch.' },
    },
    verdict:
      'A KSM-66 combo that delivers the studied 600 mg/day dose with restrained copy, held back mainly by a little added B6 (low, below the warning band), a withheld withanolide figure, and no independent lab testing.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'natures-own-mild-anxiety-ashwagandha',
    imagePath: '/images/sources/ashwagandha/natures-own-mild-anxiety-ashwagandha.jpg',
    brand: "Nature's Own",
    productName: 'Mild Anxiety Ashwagandha',
    bottomLine:
      'A rare root + leaf AU product, but it adds a high dose of vitamin B6, doesn’t name a studied extract or its withanolide figure, and has no independent lab test.',
    form: 'combo (root+leaf extract + chamomile, magnesium)',
    strength: 'root ext 62.5 mg + leaf ext 62.5 mg · withanolide mg not stated',
    rootPart: 'root+leaf',
    regulated: 'medicine',
    ausL: '416008',
    channel: 'Chemist Warehouse · Amazon AU',
    b6: { note: 'Contains a high dose of vitamin B6 — pyridoxine 25 mg per tablet; at 2 tablets/day (~50 mg/day) it is above the TGA on-pack-warning threshold and carries the mandated tingling/numbness warning.' },
    certSummary: 'TGA-listed (AUST L 416008)',
    additiveSummary: 'Root+leaf extract; no named clinical extract confirmed; full ingredients list not published',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product cert and no published lab test; no named branded extract confirmed on the active line.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Provisional — full ingredients list not published online; no confirmed additive of concern.' },
      regulatory: { score: 5, note: 'No action names this product or line.' },
      transparency: { score: 3, note: 'Named maker + AUST L, but does not print the withanolide figure and does not confirm a named clinical extract on the active line (a retailer "Sensoril" reference is unverified).' },
      marketing_honesty: { score: 5, note: 'TGA-permitted "mild anxiety" listed-medicine indication; no unsupported cert or proof claim.' },
    },
    verdict:
      'A rare root + leaf AU listed medicine, but it adds a high dose of vitamin B6 (above the warning band), does not confirm a named studied extract or print its withanolide figure, and has no independent lab testing.',
    heldItems: ['A retailer "Sensoril" extract reference — unverified on the active-ingredient line; confirm on the physical pack before crediting a named extract'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'thorne-ashwagandha',
    brand: 'Thorne',
    productName: 'Ashwagandha',
    bottomLine:
      'A high-standardisation Shoden import that discloses its withanolide figure — but its "third-party certified" claim doesn’t resolve, it’s root + leaf with no AU warning, and there’s no independent product test.',
    form: 'single-herb (Shoden)',
    strength: '35% withanolide glycosides · 120 mg Shoden',
    rootPart: 'root+leaf',
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU (import)',
    trialFlag: { note: 'Uses the named Shoden extract (35% withanolide glycosides), which has published trials — a factual "used in trials" signal, not a quality endorsement.' },
    importSafety: { note: 'Imported into Australia (no TGA listing) and made from root AND leaf (the higher-liver-scrutiny form). Carries no AU-mandated ashwagandha liver-caution advisory — an AU buyer misses the local warning.' },
    certSummary: 'Not TGA-listed (import)',
    additiveSummary: 'Named Shoden extract; root+leaf',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product third-party cert that resolves and no public COA; Shoden is ingredient pedigree, not a finished-product cert, and a company GMP is a facility claim.' },
      label_accuracy: { score: 0, note: 'No independent third-party lab test of the exact product; no public per-lot COA.' },
      additives: { score: 5, note: 'Single-herb capsule; no additive of concern noted.' },
      regulatory: { score: 5, note: 'No FDA/FTC action names this product; other Thorne products’ history is held.' },
      transparency: { score: 4, note: 'Named maker + names the Shoden extract AND discloses its 35% withanolide-glycoside standardisation — but an import with no AUST L and no public lab report.' },
      marketing_honesty: { score: 4, note: 'A "Third-Party Certified" claim does not resolve to a public finished-product certification (this SKU is not in the NSF Certified-for-Sport directory) — owner-ratified −1.' },
    },
    verdict:
      'A high-standardisation Shoden import that discloses its withanolide figure, but its "third-party certified" marketing does not resolve to any public product certification, it is root + leaf carrying no AU liver warning, and there is no independent finished-product test.',
    heldItems: ['Thorne "Third-Party Certified" body claim — does not resolve to a public directory for this SKU; other Thorne products’ history held'],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'himalaya-organic-ashwagandha',
    imagePath: '/images/sources/ashwagandha/himalaya-organic-ashwagandha.jpg',
    brand: 'Himalaya',
    productName: 'Organic Ashwagandha',
    bottomLine:
      'An "organic" import whose "clinically studied" claim rests on an unnamed low-withanolide blend with no cited trial — an agricultural cert, not a content test, and no AU warning.',
    form: 'single-herb (proprietary 3-fraction blend)',
    strength: '~2.96 mg withanolides · proprietary root blend',
    rootPart: 'root',
    regulated: 'food',
    ausL: null,
    channel: 'iHerb AU · Amazon AU (import)',
    importSafety: { note: 'Imported into Australia (no TGA listing), so it carries no AU-mandated ashwagandha liver-caution advisory — an AU buyer misses the local warning.' },
    certSummary: 'Not TGA-listed (import)',
    additiveSummary: 'USDA-Organic/cGMP are agricultural/facility certs, not content tests',
    scores: {
      testing_purity: { score: 0, note: 'No finished-product content/potency cert and no public COA; USDA-Organic and cGMP are agricultural/facility certifications, not a third-party test of what is in the product.' },
      label_accuracy: { score: 0, note: 'No independent lab test of the exact product; no public batch lab report.' },
      additives: { score: 5, note: 'Single-herb caplet; no additive of concern noted.' },
      regulatory: { score: 5, note: 'No FDA/FTC action names this product; other Himalaya products’ history is held.' },
      transparency: { score: 3, note: 'Named maker + discloses a total withanolide figure (~2.96 mg), but a proprietary blend with no named clinical extract, no AUST L (import), and no public lab report.' },
      marketing_honesty: { score: 4, note: 'A "clinically studied to reduce stress" claim rests on an unnamed proprietary ~2.96 mg-withanolide blend with no cited trial or named extract — owner-ratified −1.' },
    },
    verdict:
      'An "organic" import whose "clinically studied" framing is attached to an unnamed, low-withanolide proprietary blend with no cited trial, whose organic/GMP badges are agricultural/facility certs rather than content tests, and which carries no AU liver warning.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
];
