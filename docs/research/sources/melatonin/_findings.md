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

- **Community read is thin.** reddit.com is blocked to the research crawler, so
  most dossiers record the community read as an absence rather than inventing
  one. Options: a manual human pass, an authenticated Reddit API pull (CHK-6.4
  Supabase community store could feed this), or ship the pilot with the
  community strip explicitly marked "gathering". It is display-only and unscored
  either way.
- **Several regulator pages 404/403 to the fetcher** (FDA warning-letter
  archive URLs, FTC penalty-offense PDFs). Where a datum was corroborated via a
  mirror or trade press, the dossier marks it "search-surfaced, not fetched".
  These are fine as leads but NOT publishable as-is (see next section).

## MUST resolve to a primary document before scoring/publishing (defamation-sensitive)

Every brand-negative regulatory claim has to rest on the primary regulator
document, per the rubric's guardrails. These are the ones currently on a mirror
or unverified source:

- **Life Extension** — the 2017 FDA warning letter that names melatonin was
  sourced via a Quackwatch mirror (FDA URL 404'd). Find the primary FDA
  warning-letter page (FDA warning-letter database) before this becomes a
  scored "regulatory record" datum.
- **Kirkland/LNK** — LNK's 2019 FDA CGMP warning letter and 2001 FTC settlement
  were search-surfaced (FDA 404, FTC 403). Nail to primary before use.
- **Vitafusion** — the 2021 metallic-mesh recall entry sharing this product's
  UPC was corroborated via a DoD Commissary notice (FDA page 404'd). Confirm the
  FDA recall record AND that it covers this exact flavor/lot before it scores.
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
