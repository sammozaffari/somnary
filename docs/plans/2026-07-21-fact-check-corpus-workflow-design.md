# fact-check-corpus — dynamic fact-checking workflow (design)

**Date:** 2026-07-21 · **Status:** ratified in session, implemented same day
**Deliverable:** `.claude/workflows/fact-check-corpus.mjs` — a saved Claude Code
dynamic workflow that audits the remedy corpus for citation rot and
claim↔source drift.

## Why

CI already enforces the deterministic layer on every push (`check-citations`,
`check-tokens`, `check-forbidden-framing`), and the citation-auditor agent
checks new content at merge time. Nothing re-audits the **back catalog**: links
die, claims drift from what their sources say, and no single gate runs the
deterministic and semantic layers together. This workflow is that audit,
runnable on demand for the whole corpus or one remedy.

## Invocation

- `Workflow({name: "fact-check-corpus"})` — audit all remedies.
- `args: {slugs: ["melatonin"]}` (or a bare array) — audit a subset, e.g.
  after editing one remedy, or to re-run remedies marked `not-audited`.
- `args: {root: "/abs/path/"}` — run against a worktree instead of the cwd.

## Architecture — four phases

**1. Gates (deterministic, no LLM judgment).** One agent runs the existing
scripts — `check-citations.mjs --online`, `check-tokens.mjs`,
`check-forbidden-framing.mjs`, `check-botanical-completeness.mjs` — and returns
structured pass/fail plus the discovered slug list. Deterministic failures are
tagged as such in the report and never conflated with judgment calls.
(`check-crawlable` is excluded: it needs a build and checks rendering, not
facts.)

**2. Extract (per remedy, mechanical).** An agent parses the remedy's
`claims[]` rows, resolving each row's `sources: [n]` indices against the
frontmatter `sources[]` array into identifiers (`pmid:…`, `doi:…`,
`registry:…`). The unit of verification is the row's `studiesShow` text — the
page's stated evidence read. Rows with `studiesShow: null` and no sources
(myth-buster rows) are counted as skipped, not findings. Extraction reports
what the file says; it does not judge.

**3. Verify (semantic, adversarially checked).** Each claim fans out to a
verifier that fetches the actual source (canonical PubMed / doi.org /
ClinicalTrials.gov URL via WebFetch) and rules exactly one verdict:

| Verdict | Meaning | Severity |
|---|---|---|
| `supported` | source says what the page says — requires a verbatim quote | — |
| `overstated` | source real and related, but weaker than the claim | medium |
| `unsupported` | source does not address the claim | high |
| `inaccessible` | paywalled/dead — reported, never guessed at | low/info |

Deterministic Phase-1 failures are always high (CI-breaking by definition).
Every `overstated`/`unsupported` verdict then goes to **two independent
refuters** prompted to kill the finding (given the verifier's rationale and
quote; "default to refuted if uncertain"). Both refute → dropped; split →
reported as `contested`; neither → `confirmed`. Verifiers also flag whether a
finding, if true, could bear on the tier grade — those lines carry
`[HUMAN-GATE]` in the report.

**4. Synthesize (barrier).** A final agent receives all results, writes
`docs/audits/YYYY-MM-DD-fact-check.md` (it computes the date itself — workflow
scripts cannot), and returns the path plus a summary.

## Report structure

Corpus scorecard up top (N claims checked / supported / findings by severity /
remedies `not-audited`), then one section **per remedy with findings only**:
the claim as written, the cited source (id + title), the verifier's rationale
in a sentence or two, the quote where one exists, and the refuter votes.
Zero-finding remedies get one scorecard line. A `## Method` footer states what
ran, what was skipped (inaccessible sources, myth-buster rows), and the wave
pacing — no silent truncation.

## Pacing and failure handling

- **Waves of 3 remedies** (rate-limit lesson from prior fleets), with per-remedy
  verifier concurrency also capped at 3 — ≤ ~9 concurrent light agents.
- An agent that dies marks its remedy `not-audited` in the scorecard rather
  than vanishing; re-run those via slug args.
- If a source host rate-limits, verifiers rule `inaccessible` rather than
  retrying forever; the Method footer names affected remedies.
- **No workflow agent runs git**, edits content, or touches grades. The report
  is the only file written; the main session commits it.

## Deterministic backbone

Three JSON schemas force structure at every hop (gates results, extracted
claims, verdicts) — no freeform agent prose is parsed anywhere; malformed
output retries at the tool layer. A `supported` verdict without a verbatim
quote from the source is invalid by prompt contract.

## Constitution fit

- No agent assigns or changes a grade; grade-relevant findings are flagged
  `[HUMAN-GATE]` (CLAUDE.md, non-negotiables).
- This is the citation-auditor contract ("source resolves AND says what the
  page claims") orchestrated at corpus scale — it extends, not replaces, the
  merge-time audit.
- Adding a future deterministic checker = one line in the Phase-1 prompt.

## Verification plan

First run targets one remedy (`args: {slugs: ["valerian"]}`) end-to-end before
any full-corpus run.
