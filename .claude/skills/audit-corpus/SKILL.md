---
name: audit-corpus
description: >-
  Use whenever the owner asks — in any plain-English phrasing — to audit,
  fact-check, spot-check, sanity-check, or verify the Somnary remedy corpus or
  any specific remedy against its cited sources. Triggers include "audit the
  corpus", "fact-check melatonin", "check melatonin's citations", "do the
  citations on X hold up", "verify the sources", "run the fact checker",
  "re-audit valerian", "spot-check the new page". Runs the fact-check-corpus
  dynamic workflow (claim↔source verification with adversarial refutation) and
  reports findings. Read-only on content — never edits pages or grades.
---

# Audit the remedy corpus

The owner should never have to remember the workflow name. When they ask to
audit / fact-check / verify anything about the remedy corpus in plain English,
this skill runs it for them.

## What it does

Runs the **`fact-check-corpus`** workflow (`.claude/workflows/fact-check-corpus.mjs`):
deterministic gates (`check-*` scripts online) → extract each remedy's `claims[]`
rows → fetch the real PubMed/DOI/ClinicalTrials.gov source for every cited claim
and rule `supported` / `overstated` / `unsupported` / `inaccessible` → send every
non-`supported` verdict to two adversarial refuters before it counts → write a
dated report to `docs/audits/<date>-fact-check.md`.

## How to run it

**1. Figure out the scope from what they said.**
- Named one or more remedies ("fact-check melatonin", "check valerian and hops")
  → audit just those slugs.
- "the corpus", "everything", "all of them", or no target → full corpus (see the
  budget warning below).
- Slugs are the `.mdx` basenames in `src/content/remedies/` (e.g. `melatonin`,
  `l-theanine`, `tart-cherry`, `cbt-i`).

**2. Invoke the workflow.**

Small / common case — one to ~6 remedies, one shot with a report:

```
Workflow({ name: "fact-check-corpus", args: { slugs: ["melatonin"] } })
```

Full corpus — do NOT run all 31 in one call. A full pass is ~4.6M subagent
tokens and will hit the session token limit. Run **scoped batches of ~6**
sequentially with `{report: false}` (returns raw JSON, no colliding report
file), then consolidate the batches into one `docs/audits/<date>-fact-check.md`
yourself. Expect to spread a full audit across more than one session if the
limit trips.

```
Workflow({ name: "fact-check-corpus",
           args: { report: false, slugs: ["<batch of ~6 slugs>"] } })
```

If the workflow isn't resolvable by name (branch not merged yet), invoke it by
`scriptPath` pointing at the `.claude/workflows/fact-check-corpus.mjs` on the
current branch.

**3. Report back.** Summarize in chat: gates pass/fail, claims checked vs
supported, and each confirmed/contested finding (remedy, the claim, why it was
flagged, refuter votes). Point the owner at the written report for detail.

## Hard rules (from CLAUDE.md — do not break)

- **Never edit a remedy page or change a tier grade.** This audit only *reports*.
  Findings that could bear on efficacy/grade are flagged `[HUMAN-GATE]` for the
  owner — surface them, don't act on them.
- **No agent runs git.** You commit the report yourself after the run.
- Report `inaccessible` sources honestly (paywall / reCAPTCHA) — never guess a
  source's contents.

## Notes

- Re-running a remedy re-checks all its claims (idempotent) — good after editing
  a page.
- The batch-token lesson and the `{report:false}` consolidation flow are why a
  full audit is chunked; see `docs/plans/2026-07-21-fact-check-corpus-workflow-design.md`.
