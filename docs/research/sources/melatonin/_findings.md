# Melatonin dossiers — consolidation & owner decisions (Phase B)

Research complete for all 14 candidates (2026-07-19). **Gather-only: no scores
drafted.** This note summarizes what the dossiers found, the universe
corrections that need an owner call, the systemic data gaps, and — most
importantly — the brand-negative regulatory claims that must be re-sourced to a
primary document before any scoring or publication.

## Universe corrections needing an owner decision

1. **Kirkland (Costco) melatonin — could not be verified to exist.** Costco's
   only house-brand sleep product is doxylamine (an antihistamine); its actual
   melatonin on shelf is third-party (Natrol, Nature's Bounty). The dossier
   documents the negative result and identifies LNK International as the
   doxylamine contract manufacturer. **Recommend: drop Kirkland from the pilot,
   or you confirm a live in-warehouse melatonin SKU.** Net universe → 13.
2. **Thorne Melaton-5 is not the certified SKU.** Thorne's NSF Certified for
   Sport listing belongs to **Melaton-3 (3 mg)**, confirmed in NSF's directory;
   the 5 mg carries only a generic, directory-untied "third-party certified"
   badge. **Recommend: swap the candidate to Melaton-3**, or keep Melaton-5 and
   show its testing dimension as the weaker generic badge (honest either way).
3. **Circadin is a registered medicine, not a supplement.** It has an EMA EPAR,
   a TGA ARTG registration, an approved SmPC, and pivotal RCTs — its content is
   GMP-guaranteed. The six-dimension OTC rubric will *understate* it (it would
   look "uncertified" because supplement certs don't apply). **Recommend: give
   it a separate "prescription option" treatment, not a scorecard row beside
   OTC supplements.**
4. **CVS 5 mg current label adds Calcium 84 mg** — not strictly single-active;
   note or re-pick the SKU.
5. **Nature Made 3 mg** manufacturer page shows "Discontinued" while USP/retail
   listings persist, and two "other ingredients" panels are in circulation —
   confirm the live SKU before publishing.

## Systemic data gaps (apply to the whole set)

- **Community read is DEFERRED (every automated path to Reddit is blocked).**
  Verified 2026-07-19: the Reddit Data API is approval-gated and likely
  commercial-classified since the Nov 2025 Responsible Builder Policy; the
  WebSearch tool filters reddit.com out entirely (both the `site:` operator and
  organic results return zero Reddit URLs); direct fetch 403s. The one path that
  works is a **browser pass through the owner's real Chrome session** (Claude-in-
  Chrome extension) — owner chose this, but it's parked until they can log in to
  the extension. Until then the community strip ships marked "gathering". It is
  display-only and unscored, so this blocks nothing on the critical path.
- **Several regulator pages 404/403 to the fetcher** (FDA warning-letter
  archive URLs, FTC penalty-offense PDFs). Where a datum was corroborated via a
  mirror or trade press, the dossier marks it "search-surfaced, not fetched".
  These are fine as leads but NOT publishable as-is (see next section).

## MUST resolve to a primary document before scoring/publishing (defamation-sensitive)

Every brand-negative regulatory claim has to rest on the primary regulator
document, per the rubric's guardrails. **Progress 2026-07-19:** the canonical
primary FDA URLs for all three items below were LOCATED and confirmed to exist
in FDA's own search index (they are now the cited primary sources). FDA.gov
bot-blocks the fetch tool (404 to the fetcher), so the remaining step for each is
verbatim-text confirmation via the browser/human pass — URL existence is verified.

- **Life Extension** — 2017 warning letter, primary URL confirmed:
  `.../warning-letters/life-extension-foundation-buyers-club-inc-500619-02012017`.
  **Verified via full-text mirror (2026-07-19): melatonin IS named in the letter**,
  but only as an item in the site's breast-cancer disease-protocol list — the
  letter's lead cited-violation products are apigenin, astragalus, blueberry,
  chrysin, cruciferous extract. So this scores against the BRAND's regulatory
  record as a disease-claim/website matter, and must NOT be presented as the
  melatonin product being cited for a violation. Dossier updated with this precision.
- **Kirkland/LNK** — LNK's 2019 CGMP warning letter primary URL confirmed
  (`.../warning-letters/lnk-international-inc-582253-09262019`) plus its 2021
  close-out (`...-582253-12012021`). Note: this is CGMP on LNK's OTC DRUG
  manufacturing (the doxylamine line), not melatonin — and Kirkland melatonin may
  be dropped from the universe anyway. Verbatim confirmation still pending.
- **Vitafusion** — 2021 Church & Dwight voluntary recall primary URL confirmed
  (`.../recalls-market-withdrawals-safety-alerts/church-dwight-initiates-voluntary-recall-select-vitamins-due-isolated-manufacturing-issue`).
  FDA's summary lists adult "Melatonin" among affected products (lots made
  2020-10-29 to 11-03, distributed 2020-11-13 to 2021-04-09). Still to confirm:
  the exact lot/UPC covers this specific sugar-free 3 mg SKU (dossier scope note).
- **Nature's Bounty / NBTY** — NY AG 2015 C&D + 2016 DNA agreement quoted from
  ag.ny.gov (primary, good). The glucosamine matter is a private class action,
  correctly NOT labeled FTC — keep it out of the regulatory dimension.

## One-line headline per product (gather findings, NOT scores)

- **Natrol 5 mg TR** — no product-specific cert (USP claim belongs to a
  different Natrol SKU); one 2021 Class II labeling recall (ALA mislabeled), not
  this product; clean additive panel.
- **Nature Made 3 mg** — USP Verified CONFIRMED in USP's directory; clean
  melatonin regulatory record; discontinued-status ambiguity.
- **Nature's Bounty 5 mg** — no product cert; NY AG 2015/2016 actions on the
  parent (primary-sourced); no melatonin-specific FDA/FTC action.
- **NOW 3 mg** — no third-party cert but robust self-published COA program +
  ISO-17025 in-house lab (transparency signal); regulatory items all
  non-melatonin.
- **Life Extension 0.3 mg** — low-dose anchor; FDA warning letter names
  melatonin (RE-SOURCE); 2021 Spain withdrawal is the EU 3 mg SKU, not this one.
- **OLLY Sleep** — Murphy v. Olly class action alleges 165–274% of labeled
  melatonin (private suit, quoted); on-site NSF badge not found in NSF directory.
- **Nature's Truth 10 mg** — high-dose gummy; clean panel; no US regulator
  action; Cohen 2023 cited as category context only.
- **Kirkland** — melatonin SKU unverifiable (see corrections).
- **CVS 5 mg** — house brand, no manufacturer on label (Aurohealth signal on the
  liquid SPL); NOT named in 2015 NY AG action; current label adds Calcium.
- **Walgreens 5 mg liquid** — NBTY-made (2016 NY AG doc); named in 2015 NY AG
  action; exact-SKU ingredient panel not capturable (gap).
- **Vitafusion 3 mg** — maltitol → `sugar-alcohol-load` watchlist match;
  UPC-matched 2021 recall (RE-SOURCE/confirm).
- **Thorne Melaton-5** — cert belongs to Melaton-3 (see corrections); clean
  panel; brand-history recalls all other-product.
- **Pure Encapsulations 0.5 mg** — NSF facility-GMP only (not product cert);
  used in a 2025 JMIR trial (PMID 41004640 — real trial-usage flag); clean panel.
- **Circadin 2 mg PR** — registered medicine (separate track; see corrections).

## Next step
On rubric ratification (PR #62): re-source the defamation-sensitive items above,
apply the rubric mechanically to produce DRAFT scores, then owner ratifies each
(`[HUMAN-GATE]`) before any scorecard page is built or published.
