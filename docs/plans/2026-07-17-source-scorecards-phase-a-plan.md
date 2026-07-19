# Source Scorecards Phase A Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship the four owner-ratifiable Phase A artifacts of the Source Scorecards feature (design: `docs/plans/2026-07-17-source-scorecards-design.md`): the exact scoring rubric, the cited additive watchlist, the Supabase schema, and the public methodology page.

**Architecture:** All four artifacts land on one branch (`chk-src-a-scorecards-phase-a`) as a single human-gated PR. The rubric is a binding repo doc (like the strategy rulebook); the watchlist is repo data with resolver-validated citations; the schema is a standalone SQL migration (independent of unmerged PR #36); the methodology page is a static Astro page mirroring the voice and structure of the existing `/methodology`.

**Tech Stack:** Astro (SSG, tokens-only styling), YAML data + `js-yaml` (already a transitive dep — verify, else parse with `gray-matter`'s YAML engine), Postgres/Supabase SQL, Node script extension for the citation resolver.

**Verification model:** No unit-test framework exists in this repo. Each task verifies via the repo's real gates: `node scripts/check-citations.mjs`, `npm run build`, the pre-commit token linter, and the three reviewer agents (citation-auditor, compliance-reviewer, design-guardian) before the PR opens.

**Constitution constraints binding on every task:** no affiliate anything; every factual claim carries pmid/doi/registry; community data never scores; no agent ratifies a score (`[HUMAN-GATE]`); forbidden framings lint-clean; SSG only; tokens only.

---

### Task 1: Scoring rubric document

**Files:**
- Create: `docs/SOURCE_SCORECARD_RUBRIC.md`

**Step 1: Write the rubric.** Six dimensions, each 0–5 with exact, mechanical point rules. Required content per dimension: what earns each point, what evidence document is required for the point to count, and what the dimension does NOT measure. Must include:

- **Testing & purity:** points for current third-party certification (USP Verified = 2, NSF/Informed Choice = 2, TGA AUST L listing = 1 — cumulative, cap 5); a published independent assay meeting label claim substitutes for certification (2). Zero certifications + no assay = 0, displayed as "no independent testing found", never "untested garbage".
- **Label accuracy:** anchored to published assays naming the product (within ±10% of claim = 5, ±20% = 3, worse or undisclosed variance = 0–1); batch-level public COA = +1 (cap 5). If no product-naming assay exists, dimension shows "no assay data" state, scored on COA transparency only (cap 2) — the rubric must say this cap exists so absence of data never reads as passing.
- **Additives & formulation:** starts at 5, −1 per watchlist-flagged additive present (by watchlist severity: flag = −1, concern = −2), −2 for proprietary blend hiding the active dose, −1 for dose >2× the remedy's `studiedDose` ceiling. Floor 0.
- **Regulatory record:** starts at 5; FDA warning letter −3, recall −3, FTC action −2, TGA alert −2; each penalty halves after 3 years, quarters after 6 (round to nearest int); floor 0. Every penalty must link the primary regulator document.
- **Transparency:** manufacturer identifiable (not white-label-anonymous) = 2, batch COA on request = 1, public = 2 (supersedes), sourcing origin disclosed = 1. Cap 5.
- **Marketing honesty:** starts at 5; −2 per disease-treatment claim ("cures/treats insomnia"), −1 per unsupported "clinically proven"/"doctor recommended", −1 per fear-based competitor claim. Claims quoted verbatim with capture date + URL. Floor 0.

Also required sections: **what is never scored** (community sentiment, trial-usage flag — display-only, with the firewall sentence); **ratification protocol** (scores drafted mechanically → owner ratifies → `ratified_at/by` set; unratified never publishes; no agent may ratify); **re-review triggers** (new regulator action, new assay, cert lapse, 12-month staleness); **defamation guardrails** (primary documents only, regulator language quoted not paraphrased, corrections = right of reply).

**Step 2: Verify:** file exists, includes all six dimensions with numeric rules, includes ratification + guardrail sections. Read it back once for internal consistency (no dimension exceeds 5, penalties have floors).

**Step 3: Commit** `docs(sources): Phase A — scoring rubric with exact point rules [HUMAN-GATE]`.

### Task 2: Additive watchlist (cited data)

**Files:**
- Create: `src/data/additive-watchlist.yaml`

**Step 1: Write the watchlist.** ~10–14 entries. Schema per entry:

```yaml
- id: titanium-dioxide
  names: ["titanium dioxide", "E171", "CI 77891"]
  class: colorant
  severity: concern        # flag (-1) | concern (-2), matching rubric Task 1
  rationale: >
    Banned as a food additive in the EU (2022) after EFSA could not rule out
    genotoxicity; serves no function in a supplement except whitening.
  sources:
    - doi: 10.2903/j.efsa.2021.6585
      title: "EFSA safety assessment of titanium dioxide (E171) as a food additive"
      year: 2021
      type: regulatory-assessment
```

Include (severity per evidence, each with a real resolvable doi/pmid — the drafting agent must verify each one resolves and supports the rationale as written; any entry without a checkable source gets CUT, not kept with a placeholder): titanium dioxide, artificial azo dyes (as a class entry naming FD&C Red 40 / Yellow 5), partially hydrogenated oils, high-dose sugar-alcohol load in gummies (GI tolerability), melatonin overage practice (declared overages), undisclosed proprietary blends (cross-reference rubric — structural, no citation needed, mark `structural: true`), talc/magnesium silicate, BHT/BHA, artificial sweeteners only-if-fear-marketed EXCLUDED (rubric penalizes marketing lies, not sweeteners — note this exclusion in a header comment so the watchlist can't be read as clean-label ideology; silicon dioxide and magnesium stearate are explicitly listed in an `not-flagged:` section with rationale, because flagging benign excipients is exactly the pseudoscience we're countering).

**Step 2: Extend the citation resolver to cover the watchlist.** Modify `scripts/check-citations.mjs`: after the remedies scan, load `src/data/additive-watchlist.yaml` (reuse `matter`'s YAML engine: `matter('---\n' + raw + '\n---')` or import `js-yaml` if already in the tree — check `npm ls js-yaml` first), run each entry's `sources[]` through the existing `validateSource()`, skip `structural: true` entries. Keep the env-var override behavior intact so the regression fixture still works (guard: only scan the watchlist when it exists relative to cwd).

**Step 3: Run** `node scripts/check-citations.mjs` in the worktree. Expected: existing 133 remedy citations still pass + new watchlist citations counted and passing. A deliberately broken id (test locally by temporarily mangling one doi) must fail the script — then restore.

**Step 4: Commit** `feat(sources): Phase A — cited additive watchlist + resolver coverage`.

### Task 3: Supabase schema migration

**Files:**
- Create: `supabase/migrations/0001_source_scorecards.sql`

**Step 1: Write the migration.** Standalone (does not reference PR #36 tables; safe to run in the owner's existing project `mjlzzjyalpaekzxcipft`). Tables, all `public.`, all RLS ON with NO policies (server/service-role only), `pgcrypto` asserted, `comment on table` for each:

- `source_products` (id uuid pk, slug text unique not null, remedy_slug text not null, brand, product_name, form, dose_mg numeric, serving_type, manufacturer_link text, retailer_links jsonb default '[]', review_date date, created_at, updated_at)
- `source_certifications` (id, product_id fk → source_products on delete cascade, cert_type text check in ('usp','nsf','informed-choice','tga-austl','other'), verifier, url not null, verified_date, lapsed boolean default false)
- `source_assays` (id, product_id fk, source_kind check in ('pmid','doi','our-lab'), source_id text not null, claimed_mg numeric, measured_mg numeric, year int)
- `source_regulatory` (id, product_id fk, event_type check in ('warning-letter','recall','ftc-action','tga-alert'), agency, event_date date not null, url not null, summary text not null)
- `source_additives` (id, product_id fk, watchlist_id text not null, evidence_url)
- `source_marketing_flags` (id, product_id fk, claim_verbatim text not null, captured_url not null, captured_date date not null, violation_class)
- `source_scores` (id, product_id fk unique, testing int check 0–5, label_accuracy int check 0–5, additives int check 0–5, regulatory int check 0–5, transparency int check 0–5, marketing int check 0–5, verdict text, drafted_at timestamptz, **ratified_at timestamptz, ratified_by text** — comment: unratified rows never publish; ratification is human-only)
- `source_sentiment` (id, product_id fk, summary, themes jsonb, example_links jsonb, last_read date) — table comment MUST state the firewall: "Display-only. Never read by any scoring path. Community data never sets a grade (CLAUDE.md non-negotiable)."
- `source_changelog` (id, product_id fk, changed_at, field, old_value, new_value, reason)

Publish-gate view: `create view public.source_scorecards_published as select … from source_scores join source_products … where ratified_at is not null;` — the build reads ONLY this view. Comment it accordingly.

**Step 2: Validate SQL syntax.** `npx --yes @supabase/cli@latest db lint` is unavailable offline — instead verify with a local parse: `node -e` is useless for SQL; use `npx sql-formatter --language postgresql < file > /dev/null` if available, else careful read-through + rely on owner running it in the SQL editor (schema.sql precedent from CHK-4.2 was owner-run). Do not add new deps for this.

**Step 3: Commit** `feat(sources): Phase A — Supabase schema for source scorecards (RLS-locked, ratification-gated view)`.

### Task 4: Public methodology page

**Files:**
- Create: `src/pages/sources/methodology.astro`
- Reference (read first, copy patterns): `src/pages/methodology.astro`, `src/layouts/Base.astro`, `docs/DESIGN_SYSTEM.md`

**Step 1: Write the page.** Route `/sources/methodology`, title "How we rate sources — Somnary methodology". Structure mirrors `/methodology`: eyebrow header, dek, principle band, then sections:

1. **Why sourcing matters** — the melatonin assay story, cited inline (Erland & Saxena 2017, pmid 28095978; gummies study JAMA 2023, doi 10.1001/jama.2023.2296 — VERIFY both identifiers resolve and support the claim before publishing; if either fails, find the correct id or cut the specific number it supports).
2. **The six dimensions** — plain-language rendering of the rubric doc with the exact point rules in expandable/plain lists. State explicitly: "no composite score, no #1 pick — a ranking is a recommendation, and we don't make those."
3. **Whose test is it** — aggregated third-party data now (named: USP, NSF, Informed Choice, TGA, published assays); our own commissioned assays are a stated future step, not implied as current (real-promises rule).
4. **What we never score** — community sentiment + trial-usage flags, with the firewall explained.
5. **Where the data comes from** — named sources incl. regulator databases; states plainly that Facebook and Amazon reviews are excluded because their terms prohibit scraping and we don't launder star ratings.
6. **Money** — "No affiliate links — Somnary earns nothing if you buy. No brand pays to appear, improve a score, or remove one."
7. **Mistakes** — corrections link, right-of-reply for brands, review-date discipline.

Styling: tokens only (`var(--sp-*)`, existing color/type tokens — check `docs/DESIGN_SYSTEM.md` for the current set; NO new tokens, that's a `[HUMAN-GATE]`). Must be readable without color alone. Educational-not-medical-advice placement not needed here (no health decisions on the page) but the page must not make product recommendations either — it describes the method only. Review date + correction link at the foot, matching `/methodology`'s pattern.

**Step 2: Build check.** `npm run build` from the worktree (symlinked node_modules; build runs the citation prebuild + page build). Expected: builds clean, page in `dist/sources/methodology/index.html`, server-rendered content present (grep for "How we rate sources" in the dist file).

**Step 3: Commit** `feat(sources): Phase A — public source-rating methodology page`.

### Task 5: Reviewer gates + human-gated PR

**Step 1:** Run the three reviewer agents against the branch (paths + diff): citation-auditor (watchlist + page citations), compliance-reviewer (rubric doc + methodology copy — forbidden framings, promise language), design-guardian (methodology page — tokens, contrast, no-color-alone).

**Step 2:** Fix every finding; re-run the failing gate; amend commits or add fix commits.

**Step 3:** `git fetch origin main` (freshness check), push branch, open PR titled `[HUMAN-GATE] Source Scorecards Phase A: rubric, watchlist, schema, methodology page` with a per-artifact ratification checklist for the owner (4 checkboxes). Do NOT merge — Phase A artifacts are owner-ratified by definition.

**Step 4:** Append the session-log line to `docs/BUILD_CHECKLIST.md` **in the PR branch** (one line, references the design doc; no checkbox ticked since ratification is pending).
