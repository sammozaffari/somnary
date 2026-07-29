# CT-02 & CT-05 — copy resolution (before → after)

Evidence log for the two content-truth findings from `docs/audits/01-recon.md`
(CT-02 line 81, CT-05 line 84). Records the exact wording changed, per site,
with the commit that shipped it. Decisions were owner-gated (2026-07-29):
CT-02 rubric softened to "names/quotes"; CT-05 framed as a curated reviewed set.

---

## CT-02 — false traceability promise

**Finding:** copy promised "every point traces to a primary document" / a
document users can open, but scores render as prose notes with no per-dimension
citation link and the data model has no citation field. Fixed by wording that
matches what actually renders.

**Commit:** `4b6c678` — *fix: replace false per-score traceability claim on source scorecards (CT02)*

### Card deks (6 pages) — shared phrase

- **Files:** `src/pages/sources/index.astro`, `sources/valerian.astro`,
  `sources/magnesium.astro`, `sources/melatonin.astro`, `sources/glycine.astro`,
  `sources/ashwagandha.astro`

- **Before:** `… six documented dimensions — every point traces to a primary document.`
- **After:**  `… six documented dimensions, each score explained in a written note that shows its basis.`

### Methodology page — `src/pages/sources/methodology.astro`

**Meta description**
- **Before:** `… no affiliate links. Every point traces to a document you can open.`
- **After:**  `… no affiliate links. Each score is explained in a written note that shows its basis.`

**Dek**
- **Before:** `Six dimensions, each scored 0–5, each point traceable to a document you can open yourself.`
- **After:**  `Six dimensions, each scored 0–5, each score explained in a written note that shows its basis — the certifier directory, published assay, or regulator record it draws on. Those source documents are named in the note; Somnary does not yet publish a clickable citation beside each individual score.`

**Regulatory-record rubric rule** (owner decision: soften "links" → "names/quotes")
- **Before:** `Every deduction links the primary regulator document, dated. We quote regulators; we don't editorialize them.`
- **After:**  `Every deduction names and quotes the primary regulator document, dated. We quote regulators; we don't editorialize them.`

**Residue sweep:** `grep -rn "traces to a primary\|traceable to a document\|document you can open" src/` → clean.

---

## CT-05 — coverage overclaim ("every product you can buy in Australia")

**Finding:** CTA promised "every product you can buy in Australia" but the
dataset holds only ~10–22 curated products per category. Fixed by wiring a real
per-remedy count and stating the curated scope + "as of" date.

**Commit:** `16ae86c` — *fix: replace 'every product you can buy in Australia' with real curated count (CT05)*

### Remedy-page CTA — `src/pages/r/[slug].astro`

- **Before:** `See the {remedyName} source scorecards — every product you can buy in Australia, rated on how well it discloses what's in the bottle. No affiliate links or brand money.`
- **After:**  `See the {remedyName} source scorecards — {scorecardCount} widely used products we've reviewed and rated on how well each discloses what's in the bottle. A curated set, not every product on the market. No affiliate links or brand money.`
- **`{scorecardCount}`** is derived from the same source data `/sources` renders
  (`<REMEDY>_SOURCES.filter(p => p.ratified …)`), e.g. melatonin = 10 (verified
  rendered). Not a hardcoded figure.

### Sources index dek — `src/pages/sources/index.astro`

- **Added sentence:** `This is a curated set — the most widely sold products across five categories (magnesium, ashwagandha, valerian, glycine, melatonin), reviewed as of 2026-07-27, not a complete catalogue of the Australian market.`
- Satisfies all four honesty requirements: real count (per-card, e.g. "22 products"),
  categories, inclusion criteria ("most widely sold"), and an "as of" date
  (`reviewDate`, rendered `2026-07-27`).

**Residue sweep:** `grep -rn "every product you can buy" src/` → clean.

---

*Verification:* production build green; forbidden-framing lint clean; both
surfaces confirmed in a rendered pass at 390px (CTA shows real count "10";
sources dek renders both the CT-02 note wording and the CT-05 scope sentence).
Shipped on branch `fix/publication-states` (PR #145).
