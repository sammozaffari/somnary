// Source scorecards — melatonin (Phase C, pilot).
//
// SHIPPING NOTE: this repo data module is the tonight-ship source of truth, rendered at
// build time (SSG). It mirrors the shape of the Supabase source_scorecards_published view
// (supabase/migrations/0001_source_scorecards.sql) so it can be swapped to a build-time
// Supabase read later without changing the page. Data is transcribed from the per-product
// dossiers in docs/research/sources/melatonin/ — every score traces to the rubric
// (docs/SOURCE_SCORECARD_RUBRIC.md) applied to that dossier's primary-sourced facts.
//
// GATE: scores are owner-ratified drafts. `ratified` must be true for a product to render
// (mirrors the view's `ratified_at IS NOT NULL` publish gate). ratified:false is withheld.
//
// SAFETY: brand-negative regulatory penalties apply ONLY where the dossier has a primary,
// verbatim-verified regulator document that names THIS product or its manufacturing line.
// Everything else (mirror-only items, other-product brand history, private lawsuits, state-AG
// actions outside the rubric's four event types) is listed in `heldItems`, carries NO penalty,
// and is shown as "under review". We never publish an unverified negative claim about a brand.

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
  score: number; // 0–5
  note: string;
}

export interface SourceProduct {
  slug: string;
  brand: string;
  productName: string;
  form: string;
  doseMg: number;
  market: string;
  singleOrCombo: 'single' | 'combo';
  manufacturerUrl: string;
  certSummary: string;
  /** True only for a genuine, directory-confirmed third-party product certification (drives the positive cert-chip color). */
  certVerified?: boolean;
  additiveSummary: string;
  scores: Record<DimensionKey, Dimension>;
  verdict: string;
  heldItems: string[];
  communityStatus: 'gathering' | 'summarized';
  communityNote?: string;
  /** Recurring themes from public Reddit/forum threads — display-only, never scored. */
  communityThemes?: { note: string; url?: string }[];
  /** Product photo in public/images/sources/melatonin/. Omit for a graceful lettered fallback. */
  imagePath?: string;
  ratified: boolean;
  /** Whether an Australian can buy this OTC. Melatonin is Rx in AU, so the only OTC route is
   * personal import via iHerb. Products not sold to AU (US pharmacy house brands, gummies iHerb
   * doesn't ship to AU) are set false and withheld from the AU page. Defaults to available. */
  availableInAU?: boolean;
}

// Scores from the rubric applied to each dossier. RATIFIED by the owner 2026-07-19 with these
// rulings: (Q1) state-AG actions are NOT one of the rubric's four event types → held;
// (Q2) regulatory penalties attach only to events naming THIS product/line, not other-product
// brand history → held; (Q3) dose −1 uses strict ">2× studied ceiling" per the product's form;
// (Q4) all mirror-only / lot-unconfirmed negatives held pending the verbatim browser pass.
// Held items surface on the card as "under review" and re-score only after primary verification.
export const MELATONIN_SOURCES: SourceProduct[] = [
  {
    slug: 'natrol-melatonin-5mg-time-release',
    imagePath: '/images/sources/melatonin/natrol-melatonin-5mg-time-release.png',
    brand: 'Natrol',
    productName: 'Melatonin Time Release',
    form: 'tablet (extended-release)',
    doseMg: 5,
    market: 'US',
    singleOrCombo: 'combo',
    manufacturerUrl:
      'https://www.natrol.com/products/melatonin-sleep-support-time-release-tablets-5mg',
    certSummary: 'No third-party certification',
    additiveSummary: 'Benign excipients; dose above the studied extended-release amount',
    scores: {
      testing_purity: { score: 0, note: 'No product-specific USP/NSF/Informed cert and no published assay of this SKU (facility-level GMP does not count).' },
      label_accuracy: { score: 0, note: 'No assay names this product; no public or on-request batch COA found.' },
      additives: { score: 4, note: 'Panel is fully benign, but −1: 5 mg exceeds twice the studied extended-release dose.' },
      regulatory: { score: 5, note: 'No verified regulator action against this product (a 2021 recall of a different Natrol product is held).' },
      transparency: { score: 2, note: 'Manufacturer identifiable; no public batch COA, no sourcing disclosed.' },
      marketing_honesty: { score: 5, note: 'No disease claim; market-share and structure/function claims only.' },
    },
    verdict:
      'No independent testing or product-specific assay; a fully itemized label of benign excipients at a dose above the studied extended-release amount, from an identifiable manufacturer with no verified regulator action against this product.',
    heldItems: ['2021 FDA Class II recall of a different Natrol product (ALA lot mislabeled as melatonin)'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'Time-release melatonin draws recurring threads about next-morning grogginess, and people seeking doses well below this 5 mg', url: 'https://old.reddit.com/r/melatonin/comments/1hd7wgx/time_release_formulas/' },
    ],
    ratified: true,
  },
  {
    slug: 'nature-made-melatonin-3mg',
    imagePath: '/images/sources/melatonin/nature-made-melatonin-3mg.png',
    brand: 'Nature Made',
    productName: 'Melatonin',
    form: 'tablet',
    doseMg: 3,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://www.naturemade.com/products/nature-made-melatonin-3-mg-tablets',
    certSummary: 'USP Verified',
    certVerified: true,
    additiveSummary: 'No flagged additives',
    scores: {
      testing_purity: { score: 2, note: 'USP Verified, confirmed in USP’s own directory (+2); no NSF/Informed.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA (dimension shows "no assay data").' },
      additives: { score: 5, note: 'Only watchlist match is magnesium stearate, which is on the benign not-flagged list.' },
      regulatory: { score: 5, note: 'No verified regulator action against this product; other-product recalls/FTC matters held.' },
      transparency: { score: 2, note: 'Manufacturer identifiable (Pharmavite/Otsuka); no public batch COA or sourcing disclosure.' },
      marketing_honesty: { score: 5, note: 'No disease claim; superlatives are brand-survey, not efficacy claims.' },
    },
    verdict:
      'A USP Verified tablet from a named manufacturer with a clean additive panel and no verified regulator action, but no independent published assay of this product and no public batch certificate of analysis.',
    heldItems: [],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'No threads specific to this product surfaced. On Reddit, melatonin discussion is dose-level rather than brand-level — many prefer 1 mg or less and cite next-morning grogginess.' },
    ],
    ratified: true,
  },
  {
    slug: 'natures-bounty-melatonin-5mg-dual-spectrum',
    brand: "Nature's Bounty",
    productName: 'Melatonin Dual Spectrum',
    form: 'tablet (bi-layer)',
    doseMg: 5,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://naturesbounty.com/collections/melatonin',
    certSummary: 'No third-party certification',
    additiveSummary: 'No flagged additives',
    scores: {
      testing_purity: { score: 0, note: 'No product cert (facility-level NSF GMP does not count) and no product-naming assay.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA found.' },
      additives: { score: 5, note: 'Silica and magnesium stearate are on the benign not-flagged list; no flagged additives.' },
      regulatory: { score: 5, note: 'No FDA/FTC/TGA action of a scored type against this product; a state-AG action and a private lawsuit are held.' },
      transparency: { score: 2, note: 'Manufacturer identifiable (Nestlé Health Science); no public batch COA or sourcing disclosure.' },
      marketing_honesty: { score: 5, note: 'No disease claim; "clinically studied" is scoped to the ingredient (flagged for review, not deducted).' },
    },
    verdict:
      'A manufacturer-identifiable single-ingredient tablet with a clean excipient panel and no scored regulator action against it, but no independent testing, no product-specific assay, and no public batch COA.',
    heldItems: [
      '2015 NY Attorney General action + 2016 NBTY agreement (a state-AG matter on herbal store brands, not among the rubric’s four event types, and not this product)',
      'Pearson v. NBTY (a private class action, not a regulator action)',
    ],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'No threads specific to this product surfaced. On Reddit, melatonin discussion is dose-level rather than brand-level — many prefer 1 mg or less and cite next-morning grogginess.' },
    ],
    ratified: true,
  },
  {
    slug: 'now-foods-melatonin-3mg',
    imagePath: '/images/sources/melatonin/now-foods-melatonin-3mg.png',
    brand: 'NOW Foods',
    productName: 'Melatonin',
    form: 'capsule',
    doseMg: 3,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://www.nowfoods.com/products/supplements/melatonin-3-mg-veg-capsules',
    certSummary: 'No third-party cert (self-published COAs)',
    additiveSummary: 'No flagged additives (two-ingredient)',
    scores: {
      testing_purity: { score: 0, note: 'No third-party product certification and no published product-naming assay (self-testing does not count here).' },
      label_accuracy: { score: 1, note: 'No product-naming assay; a self-published COA lookup exists but this SKU’s coverage is unconfirmed (on-request-equivalent).' },
      additives: { score: 5, note: 'Two-ingredient panel (rice flour, hypromellose); no watchlist match.' },
      regulatory: { score: 5, note: 'No verified regulator action against this product; other-product/food recalls held.' },
      transparency: { score: 3, note: 'Manufacturer identifiable (+2) and a self-published lot-COA lookup (+1); sourcing not disclosed.' },
      marketing_honesty: { score: 5, note: 'Structure/function claims under the DSHEA disclaimer; no disease claim.' },
    },
    verdict:
      'No third-party certification or product assay and no regulator action against it, but a clean two-ingredient label and an identifiable US manufacturer — quality assurance rests on NOW’s own self-published COAs and in-house lab rather than independent verification.',
    heldItems: ['Older non-melatonin recalls and warning letter (other products; primary documents not all confirmed)'],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'No threads specific to this product surfaced. On Reddit, melatonin discussion is dose-level rather than brand-level — many prefer 1 mg or less and cite next-morning grogginess.' },
    ],
    ratified: true,
  },
  {
    slug: 'life-extension-melatonin-300mcg',
    imagePath: '/images/sources/melatonin/life-extension-melatonin-300mcg.png',
    brand: 'Life Extension',
    productName: 'Melatonin',
    form: 'capsule',
    doseMg: 0.3,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://www.lifeextension.com/vitamins-supplements/item01668/melatonin',
    certSummary: 'No third-party certification',
    additiveSummary: 'No flagged additives',
    scores: {
      testing_purity: { score: 0, note: 'No product cert (facility GMP does not count) and no product-naming assay.' },
      label_accuracy: { score: 1, note: 'No product-naming assay; brand states COA-on-request (on-request credit only).' },
      additives: { score: 5, note: 'Only watchlist match is silica (benign not-flagged); low physiologic dose.' },
      regulatory: { score: 5, note: 'No verified action against this product; a 2017 FDA disease-claims letter is held pending verbatim confirmation, and a 2021 EU withdrawal was a different (EU 3 mg) SKU.' },
      transparency: { score: 2, note: 'Manufacturer identifiable; no public batch COA, no sourcing disclosure.' },
      marketing_honesty: { score: 5, note: 'No disease claim in this product’s current captured copy.' },
    },
    verdict:
      'No independent testing or product-specific assay for this low-dose capsule; a fully itemized label of benign excipients from an identifiable manufacturer, with no verified regulator action against this product.',
    heldItems: [
      '2017 FDA warning letter — verified verbatim on fda.gov (2026-07-19): it cites the brand’s website for disease claims (melatonin appears in a breast-cancer protocol list, not among the lead cited products). A marketing/labeling matter, not a potency or safety action against this product; not applied to the score.',
    ],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'Low physiologic doses like this 0.3 mg are what r/melatonin regulars tend to favour, though a few report next-day fatigue even on extended-release', url: 'https://old.reddit.com/r/melatonin/comments/1gsdkv4/low_dose_extendedrelease_melatonin_and_fatigue/' },
    ],
    ratified: true,
  },
  {
    slug: 'olly-sleep-gummy-3mg',
    availableInAU: false, // gummy — not shipped to AU by iHerb, not sold OTC on Amazon AU
    brand: 'OLLY',
    productName: 'Sleep Gummy (Blackberry Zen)',
    form: 'gummy',
    doseMg: 3,
    market: 'US',
    singleOrCombo: 'combo',
    manufacturerUrl: 'https://www.olly.com/products/sleep',
    certSummary: 'NSF badge shown, unverified for this SKU',
    additiveSummary: 'No flagged additives (real sugar, natural color)',
    scores: {
      testing_purity: { score: 0, note: 'OLLY shows an NSF badge, but this exact SKU was not found in NSF’s directory; the cert point is withheld.' },
      label_accuracy: { score: 0, note: 'No published product-naming assay; no public or on-request COA found.' },
      additives: { score: 5, note: 'Real sugar (no polyols), colors from carrot/blueberry juice; botanicals individually dosed (no hidden blend).' },
      regulatory: { score: 5, note: 'No FDA/FTC/TGA action; two private class actions are held (not regulator actions).' },
      transparency: { score: 2, note: 'Manufacturer identifiable (Unilever); no public batch COA or sourcing disclosure.' },
      marketing_honesty: { score: 4, note: '−1: the site displays an NSF certification claim that could not be matched to this SKU in NSF’s directory.' },
    },
    verdict:
      'A clean additive panel and no regulator enforcement on record, but no independent test or certification could be confirmed for this exact product, its melatonin content is untested by any published assay, and the brand shows an NSF badge Somnary could not match to this SKU in NSF’s own directory.',
    heldItems: [
      'Murphy v. Olly and Tarvin v. Olly (private class actions alleging mislabeling — unproven allegations, not regulator actions)',
    ],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'natures-truth-melatonin-10mg-gummies',
    availableInAU: false, // gummy — not shipped to AU by iHerb, not sold OTC on Amazon AU
    brand: "Nature's Truth",
    productName: 'Extra Strength Melatonin Gummies',
    form: 'gummy',
    doseMg: 10,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl:
      'https://naturestruth.com/products/melatonin-10-mg-gummies-delicious-mixed-berry-nt15501',
    certSummary: 'No third-party certification',
    additiveSummary: 'No flagged additives (natural colors, real sugar)',
    scores: {
      testing_purity: { score: 0, note: 'No product cert (only a cosmetics-GMP facility registration) and no product-naming assay.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA (Cohen 2023 is gummy-category context only).' },
      additives: { score: 5, note: 'Pectin-gelled, natural colors, real sugar; no watchlist match. 10 mg sits exactly at (not above) twice the studied ceiling.' },
      regulatory: { score: 5, note: 'No US regulator action; non-US advisories and private suits do not count.' },
      transparency: { score: 2, note: 'Manufacturer identifiable (Piping Rock); no public batch COA or sourcing disclosure.' },
      marketing_honesty: { score: 5, note: 'Mechanism/structure-function copy; no disease claim.' },
    },
    verdict:
      'A high-dose (10 mg) mixed-berry gummy with a clean additive panel and no US regulatory action on record, but no independent product testing, no published assay of this SKU, and no publicly posted batch COA.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'cvs-health-melatonin-5mg',
    availableInAU: false, // US pharmacy house brand — not sold to Australia
    brand: 'CVS Health',
    productName: 'Melatonin',
    form: 'tablet',
    doseMg: 5,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://www.cvs.com/shop/cvs-melatonin-5-mg-tablets-120-ct-prodid-1280123',
    certSummary: 'No third-party certification',
    additiveSummary: 'No flagged additives (talc present, not flagged)',
    scores: {
      testing_purity: { score: 0, note: 'No product cert and no product-naming assay; retailer "quality guarantee" is not third-party certification.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA found.' },
      additives: { score: 5, note: 'Silica and magnesium stearate are benign not-flagged; talc is present but not a watchlist entry.' },
      regulatory: { score: 5, note: 'No verified regulator action; CVS was not a named party in the 2015 NY AG action.' },
      transparency: { score: 0, note: 'No manufacturer named on the tablet label (house brand); no COA or sourcing disclosure.' },
      marketing_honesty: { score: 5, note: 'Structure/function claims with the FDA disclaimer; no disease claim.' },
    },
    verdict:
      'An unverified pharmacy house-brand tablet with no independent testing or public assay and no manufacturer disclosed on the label, whose formulation carries no flagged additives and whose maker has no located supplement regulatory action.',
    heldItems: [],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'walgreens-melatonin-5mg-liquid',
    availableInAU: false, // US pharmacy house brand — not sold to Australia
    brand: 'Walgreens',
    productName: 'Melatonin Liquid',
    form: 'liquid',
    doseMg: 5,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl:
      'https://www.walgreens.com/store/c/walgreens-melatonin-5-mg-liquid-natural-cherry/ID=prod6288323-product',
    certSummary: 'No third-party certification',
    additiveSummary: 'Ingredient panel not captured',
    scores: {
      testing_purity: { score: 0, note: 'No product cert and no product-naming assay found.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA (no label record located).' },
      additives: { score: 5, note: 'Provisional: the ingredient panel could not be captured, so no deduction can be asserted (a liquid may carry a preservative or sweetener — unverified).' },
      regulatory: { score: 5, note: 'No FDA/FTC/TGA action of a scored type; the 2015 NY AG matter (state-AG, herbal store brands) is held.' },
      transparency: { score: 3, note: 'Contract maker NBTY identified from a 2016 state regulator document (+2); a self-published COA lookup context aside, no public batch COA (+1 general).' },
      marketing_honesty: { score: 5, note: 'Provisional: this SKU’s marketing copy could not be captured, so no claim can be quoted or deducted.' },
    },
    verdict:
      'No independent testing or product-specific assay was found for this house-brand liquid; its contract maker (NBTY) is identifiable from a 2016 state regulator document, but its full ingredient panel and marketing copy could not be captured from any reachable primary source.',
    heldItems: [
      '2015 NY Attorney General action naming Walgreens (a state-AG matter on herbal store brands, not among the rubric’s four event types, and not this product)',
    ],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'vitafusion-melatonin-3mg-gummy',
    availableInAU: false, // gummy — not shipped to AU by iHerb, not sold OTC on Amazon AU
    brand: 'Vitafusion',
    productName: 'Melatonin Sugar-Free Gummy',
    form: 'gummy',
    doseMg: 3,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl:
      'https://vitafusion.com/products/melatonin-3-mg-sugar-free-gummy-vitamin-140-gummies-vf11806',
    certSummary: 'No third-party certification',
    additiveSummary: 'Maltitol (sugar-alcohol load)',
    scores: {
      testing_purity: { score: 0, note: 'No product cert and no product-naming assay.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public batch COA (Cohen 2023 is category context only).' },
      additives: { score: 4, note: '−1: maltitol (a sugar alcohol with dose-dependent GI effects) is listed first. Sucralose is present but not watchlist-flagged.' },
      regulatory: { score: 5, note: 'No verified action against this product; a 2021 metallic-mesh recall is held pending confirmation it covers this exact flavor/lot.' },
      transparency: { score: 2, note: 'Manufacturer identifiable (Church & Dwight); no public batch COA or sourcing disclosure.' },
      marketing_honesty: { score: 5, note: 'Structure/function claims under the DSHEA disclaimer; no disease claim.' },
    },
    verdict:
      'No independent certification or public assay; the maker (Church & Dwight) is disclosed but posts no batch COA, the gummy contains the sugar alcohol maltitol, and its marketing stays within structure-function claims.',
    heldItems: [
      '2021 Church & Dwight metallic-mesh voluntary recall — primary FDA page fetch-blocked and coverage of this exact sugar-free 3 mg flavor/lot not yet confirmed',
    ],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'thorne-melaton-5',
    availableInAU: false, // this Melaton-5 SKU isn't on iHerb AU; the AU-available + NSF-certified Thorne is Melaton-3 (returns on rescore)
    brand: 'Thorne',
    productName: 'Melaton-5',
    form: 'capsule',
    doseMg: 5,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://www.thorne.com/products/dp/melaton-5-trade',
    certSummary: 'Cert is for Melaton-3, not this SKU',
    additiveSummary: 'No flagged additives',
    scores: {
      testing_purity: { score: 0, note: 'The NSF Certified for Sport listing is for Melaton-3 (3 mg), a different SKU; this 5 mg SKU is not directory-confirmed and has no product-naming assay.' },
      label_accuracy: { score: 0, note: 'No product-naming assay; no public or confirmed on-request COA for this SKU.' },
      additives: { score: 5, note: 'Only watchlist match is silica (benign not-flagged); fully itemized, no blend.' },
      regulatory: { score: 5, note: 'No action against a Thorne melatonin product; other-product recall/letter and an FTC notice (not a finding) are held.' },
      transparency: { score: 2, note: 'Manufacturer identifiable (named US facility); no public batch COA confirmed for this SKU.' },
      marketing_honesty: { score: 4, note: '−1: the product carries a generic "third-party certified" badge that could not be tied to any certifier directory for this SKU.' },
    },
    verdict:
      'A fully itemized 5 mg capsule from a named US manufacturer with a clean additive panel, but no independent testing or assay confirmed for this exact SKU — and a "third-party certified" badge that could not be tied to any certifier directory, because the located NSF certification belongs to the different 3 mg Melaton-3 product.',
    heldItems: [
      'Brand-history items on other Thorne products (2014 recall, 2004 letter) and a 2023 FTC penalty-offense notice (not a finding of wrongdoing)',
    ],
    communityStatus: 'gathering',
    ratified: true,
  },
  {
    slug: 'pure-encapsulations-melatonin-0-5mg',
    brand: 'Pure Encapsulations',
    productName: 'Melatonin 0.5 mg',
    form: 'capsule',
    doseMg: 0.5,
    market: 'US',
    singleOrCombo: 'single',
    manufacturerUrl: 'https://www.pureencapsulationspro.com/melatonin-0-5-mg.html',
    certSummary: 'Facility GMP only; public batch COAs',
    additiveSummary: 'No flagged additives (two-ingredient)',
    scores: {
      testing_purity: { score: 0, note: 'Only a facility-level NSF GMP registration (does not count as product certification); no product-naming content assay.' },
      label_accuracy: { score: 2, note: 'No product-naming assay, but the brand posts public lot-level COAs (public-COA credit, capped at 2).' },
      additives: { score: 5, note: 'Two-ingredient panel (plant-fiber cellulose, veg capsule); no watchlist match.' },
      regulatory: { score: 5, note: 'No verified action naming this product or its line; a 2017 sulfites recall on other Pure Encapsulations products is held (per-product scoring).' },
      transparency: { score: 4, note: 'Manufacturer identifiable (+2) and public per-batch COAs (+2); melatonin raw-material origin not disclosed.' },
      marketing_honesty: { score: 5, note: 'Structure/function claims under the DSHEA disclaimer; no disease claim.' },
    },
    verdict:
      'A low-dose single-ingredient capsule from an identifiable manufacturer that posts per-batch certificates of analysis and carries a clean excipient panel, but with no independent product testing or content-verifying assay. (Used as dosing material in a 2025 published trial.)',
    heldItems: [
      '2017 undeclared-sulfites recall on other Pure Encapsulations products (held: for a per-product scorecard we penalize only events naming this product or its line)',
    ],
    communityStatus: 'summarized',
    communityThemes: [
      { note: 'No threads specific to this product surfaced. On Reddit, melatonin discussion is dose-level rather than brand-level — many prefer 1 mg or less and cite next-morning grogginess.' },
    ],
    ratified: true,
  },
];

/** A registered medicine, held OUT of the OTC-rubric grid (owner-flagged separate track). */
export const PRESCRIPTION_NOTE = {
  brand: 'Circadin',
  productName: 'Circadin 2 mg Prolonged-Release',
  note: 'A prescription medicine (TGA/EMA-registered, GMP-guaranteed content), not an OTC supplement. The six-dimension supplement rubric would understate it, so it is not scored here. See its dossier for the registered-medicine evidence base.',
};
