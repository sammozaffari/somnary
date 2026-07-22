# Fact-checking the remedy corpus

How to audit remedy pages against their cited sources. Reports land in this
folder as `YYYY-MM-DD-fact-check.md`.

## Run it — plain English

You don't need to remember any tool name. In a Claude Code session, just ask:

- "fact-check melatonin"
- "audit the corpus"
- "do the citations on valerian hold up?"
- "re-audit the tart cherry page"
- "verify the sources on l-theanine"

The **`audit-corpus`** skill (`.claude/skills/audit-corpus/`) triggers on
phrasing like that and runs the audit.

## Run it — `/audit`

A slash command shortcut for the same thing:

- `/audit melatonin` — audit one remedy
- `/audit valerian hops` — audit several
- `/audit` — audit the whole corpus (chunked automatically)

Type `/` in the session to see it listed.

## What actually runs

The **`fact-check-corpus`** dynamic workflow
(`.claude/workflows/fact-check-corpus.mjs`). Four phases:

1. **Gates** — the deterministic `check-*` scripts, run online
   (`check-citations --online`, `check-tokens`, `check-forbidden-framing`,
   `check-botanical-completeness`).
2. **Extract** — parse each remedy's `claims[]` rows, resolve `sources:[n]` to
   real PMID / DOI / registry identifiers.
3. **Verify** — for every cited claim, an agent fetches the *actual* source and
   rules `supported` / `overstated` / `unsupported` / `inaccessible`; a
   `supported` verdict must carry a verbatim quote.
4. **Synthesize** — rank findings, write the dated report here.

Every non-`supported` verdict is sent to **two independent adversarial refuters**
(each re-fetches the source) before it counts as a finding. Schema-forced output
at every hop.

Design rationale: `../plans/2026-07-21-fact-check-corpus-workflow-design.md`.

## Reading a report

- **`supported`** — the cited source says what the page says.
- **`overstated` (medium)** — directionally right, but the page states a specific
  number/subgroup/conclusion the *accessible* source (often just the abstract;
  full text may be paywalled) doesn't carry. Re-source or re-word — not
  necessarily wrong.
- **`unsupported` (high)** — the accessible source is silent on, or contradicts,
  the claim. Look here first.
- **`inaccessible`** — the load-bearing source couldn't be read (paywall /
  reCAPTCHA). Reported, never guessed at — re-check by hand.
- **dropped** — a finding the refuters killed by reading full text; kept in the
  report for transparency.
- **`[HUMAN-GATE]`** — the finding could bear on a tier grade. Only the owner
  rules on grades; the audit never changes one.

## Cost and batching

Auditing **one remedy** is cheap (~150k tokens, one shot) — do it right after
editing a page. A **full 31-remedy** sweep is ~4.6M tokens and can exceed a
single session's token limit, so the skill chunks it into scoped batches of ~6
(`{report: false}`) and consolidates. Expect a full audit to sometimes span more
than one session.

## Hard rules

The audit is **read-only on content**. No agent edits a remedy page, changes a
grade, or runs git. It reports; you act. See `CLAUDE.md` (non-negotiables).
