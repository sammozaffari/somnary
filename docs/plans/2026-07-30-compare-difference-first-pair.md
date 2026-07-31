# /compare rebuild — difference-first pair (L-01 + L-02) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 31-card filtered catalogue at `/compare` with a difference-first
comparison of **exactly two** remedies — differences expanded, identical values collapsed,
each section stating which difference matters and why, without picking a winner.

**Architecture:** SSG-pure. `getStaticPaths` pre-renders one crawlable page per unordered
remedy pair at `/compare/[pair]` (e.g. `/compare/magnesium-vs-melatonin`); `/compare` becomes
a server-rendered picker/index; `?a=&b=&goal=` is honoured as a thin client-side redirect
alias to the canonical path route. The comparison content is server-rendered (no
client-only corpus content — CLAUDE.md non-negotiable); JS only toggles the collapse/reveal of
identical sections (progressive enhancement, page is complete with JS off). A new pure library,
`src/lib/compare-diff.ts`, computes same-vs-different per dimension with **semantic** rules
(not string inequality) and is unit-tested headless.

**Tech Stack:** Astro 5 (SSG), existing content collection + `src/lib/*` (tiers, evidence-gates,
outcomes, remedy-state), node-based test scripts (`scripts/test-*.mjs` + `verify:*`), tokens-only CSS.

---

## STOP — two owner decisions gate a clean build (see "Open decisions" at the bottom)

1. **Three requested dimensions have no structured field** — *effect magnitude*, *studied
   population*, *time to effect*. They exist only as prose inside `verdict`/`claims`/`doses`.
   Fabricating them is forbidden (health claims are cited + `[HUMAN-GATE]`). This plan ships
   the honest subset now and fences the three; the owner picks how to close the gap.
2. **URL scheme** — the owner-specified `?a=&b=` cannot carry *server-rendered* content on a
   static host. This plan recommends path-canonical + query alias (keeps SSG non-negotiable
   intact AND honours `?a&b&goal`). Confirm before building.

Do not start Task 2+ until both are answered. Task 1 (branch + diff engine) is safe to start —
the engine is needed under every option.

---

## Dimension → data source map (the honest inventory)

| # | Requested dimension | Structured source | Ships v1? |
|---|---|---|---|
| 1 | Evidence grade **+ workflow state** | `tier` + `workflowState` (+ `gradeStampState`, `isDefaultRankingEligible`) | ✅ |
| 2 | Target outcome | `outcomes[]` (+ `outcomes.ts` canonical map, `?goal`) | ✅ |
| 3 | **Effect magnitude** | *No field.* Closest honest signal: gates `effect-size-reported` / `effect-size-small` (derived from tier) | ⚠️ gated |
| 4 | **Studied population** | *No field.* Prose only. | ⚠️ gated |
| 5 | Form & protocol | `doses[].form` (interventions: `format:'intervention'` → no doses, `standardization` = fidelity) | ✅ |
| 6 | Dose & timing | `doses[].studiedDose`, `doses[].timing` | ✅ |
| 7 | **Time to effect** | *No field.* Sometimes inside `doses[].timing`/prose, not separable. | ⚠️ gated |
| 8 | Biggest risk | `biggestRisk` | ✅ |
| 9 | Interaction classes | `safety.interactions[]` (per-remedy only — D4) | ✅ |
| 10 | Uncertainty | `epistemicState` (+ caution gates: heterogeneous-trials, effect-size-small, dose-mismatch) | ✅ |

**Handling the three gated dimensions (⚠):** never blank, never faked. Each renders an explicit
*"Not separately recorded in the corpus yet"* row with a link to each remedy's page where the
prose lives. **Absence must never read as "no difference / no risk"** (reuses the existing
CHK-2.1 discipline). Effect magnitude additionally shows the gate-derived signal
(reported / small / not-reported) labelled as *"strength-of-effect signal, from the grade's
evidence gates — not an effect size."*

---

## The difference-detection rules (semantic, not string inequality)

This is `src/lib/compare-diff.ts`. **Golden invariant:** display always uses the verbatim
original text; normalization produces a *comparison key* used **only** to decide same/different.

### Stage A — text normalization (build the comparison key)

Applied left-to-right to any free-text value before comparison:

1. Unicode NFKD, strip combining diacritics; lowercase; trim; collapse internal whitespace.
2. **Range/connector canonicalization:** `-`, `–`, `—`, `~`, and the word `to` **between two
   numbers** → a single `–`. So `2-3` and `2 to 3` → `2–3`.
3. **Unit lexicon** (canonical ← synonyms), whole-token match:
   - `mg` ← milligram(s); `mcg` ← µg, ug, microgram(s); `g` ← gram(s);
   - `h` ← hr, hrs, hour(s); `min` ← minute(s); `wk` ← week(s); `d` ← day(s).
4. **Phrase lexicon** (domain synonyms → canonical): `before bed` ← "before bedtime",
   "before target bedtime", "pre-bed", "at bedtime"; `evening` ← "in the evening", "pm";
   `immediate-release` ← "ir"; `prolonged-release` ← "pr", "extended-release", "er".
5. **Filler drop** (key only, never display): `about`, `approximately`, `roughly`, `typically`,
   `usually`, `commonly`, `around`, `target`, `a`, `the`.
6. Strip trailing punctuation and standalone parentheticals already captured as an alias
   (e.g. `(IR)`).

`sameText(x, y)  :=  key(x) === key(y)`.
So **"2-3 hours before bed" === "2 to 3 hours before bedtime"** (the required example) and
**"0.5–5 mg" === "0.5 to 5 mg"**, while **"3 mg" !== "0.3 mg"** (Stage B catches the number).

### Stage B — numeric-range awareness (dose & timing)

Before declaring two dose/timing strings equal, extract `{lo, hi, unit}` from each
(`(\d+(?:\.\d+)?)\s*(?:–\s*(\d+(?:\.\d+)?))?\s*(mg|mcg|g|h|min|wk|d)`).
Two values are the **same** iff `lo`, `hi` (hi defaults to lo), and canonical `unit` are all
equal. This is stricter than text-key equality and catches `3 mg` vs `0.3 mg` even when the
surrounding words match. If either side has no parseable quantity, fall back to `sameText`.

### Stage C — typed comparison per dimension

| Dimension | Rule (what "different" means) |
|---|---|
| **Grade** | Compare `tier` letters. **Also** compare `workflowState`: if letters equal but one is provisional (`pending_signoff`/`unreviewed`) and the other `owner_ratified`, that is a **state difference**, surfaced explicitly — see Constraint 1. The section is **never collapsed**. |
| **Outcome / goal** | Set comparison. Map each `outcomes[]` string → canonical goal key (`goalKey()`, then match against `OUTCOMES`; non-matching strings compare by their normalized key). "Different" iff the symmetric difference of the two sets is non-empty. Render: shared goals, then each remedy's unique goals. |
| **Form & protocol** | Structural. Key dose rows by normalized `form`. Shared forms compared on `studiedDose`/`timing` via Stage B. A `format:'intervention'` remedy (no doses) vs a dosed supplement is a **real, stated** difference ("not a dosed supplement — the protocol is the therapy"). |
| **Dose & timing** | Per shared form, Stage B on `studiedDose` and `timing` independently. |
| **Interaction classes** | Set comparison of per-remedy classes. Normalize each `interactions[]` entry → class key: take the head phrase before `(`, map via a small class lexicon (`cns-depressants` ← sedatives/CNS depressant/benzodiazepine; `anticoagulants` ← blood thinner/warfarin; `antihypertensives`; `antidiabetics`; `immunosuppressants`; `cyp-substrate` ← CYP…). Report shared + each-unique classes. **D4: never union the two lists into a combined-stack claim** — every class stays attributed to its own remedy. Section **never collapsed**. |
| **Biggest risk** | `sameText` on `biggestRisk`. Near-always different (different substances) → expanded. Section **never collapsed** (safety). |
| **Uncertainty** | Compare `epistemicState` enums; supporting caution-gate sets compared as sets. "Different" iff epistemic state differs OR caution-gate sets differ. |
| **Effect magnitude** (gated) | Signal ∈ {reported, small, not-reported} from tier gates. Compare signals. Labelled as a grade-derived signal, not a number. |
| **Studied population / time to effect** (gated) | No key → always render the explicit "not separately recorded" row; **excluded from the same/different collapse logic** (never claimed identical). |

### Stage D — section state (collapse / order)

For each section compute `state ∈ {different, identical, unrecorded}`:
- `different` → **expanded**, sorted to the top group.
- `identical` (keys equal / empty symmetric difference) → **collapsed** behind
  `Both: <value> · reveal` (a `<details>`; no-JS shows it open).
- `unrecorded` → always shown, own row, never counted as identical.
- **Override:** Grade, Biggest risk, Interaction classes are **always expanded** regardless of
  state — safety and the grade-state warning must never hide (CLAUDE.md safety prominence).
- **Missing on one side** (e.g. `notFor` empty for one) → `different` with an explicit
  "Not recorded for <name>" cell; never silently equal.

### Section order (fixed vertical stack, differences first within it)

1. Grade + state · 2. Biggest risk · 3. Interaction classes · 4. Target outcome ·
5. Effect magnitude · 6. Form & protocol · 7. Dose & timing · 8. Uncertainty ·
9. Studied population (unrecorded) · 10. Time to effect (unrecorded).

Within groups 4–8, `different` sections render before `identical` ones. Safety-critical
(1–3) always lead. `?goal` re-emphasises the matching outcome in section 4 (adds a
"matches your goal" marker) — it never hides or changes any fact.

---

## Constraint 1 — provisional must not look comparable to ratified

`gradeStampState(workflowState)` → `{label, prominent}`; `isDefaultRankingEligible()` →
ratified-and-current. In the Grade section:
- Each grade shows its `<ReviewState>` label beside the letter (as the current card does).
- When the two differ in ranking-eligibility, the "why it matters" line reads, e.g.:
  *"These grades aren't on equal footing: <A>'s is review-complete; <B>'s is provisional
  (final review pending). Read the letters with that in mind — a provisional grade can move."*
- A provisional grade is never rendered as a bare comparable letter without its state chip.

---

## Tasks

### Task 0: Branch
- `git checkout -b chk-L01-compare-difference-pair` (verify with `git branch --show-current`
  before any commit — shared-tree hazard, per memory). Reference L-01/L-02 in commits.

### Task 1: Difference engine `src/lib/compare-diff.ts` (TDD, safe to start pre-decision)

**Files:** Create `src/lib/compare-diff.ts`; Test `scripts/test-compare-diff.mjs`;
Modify `package.json` (add `"verify:compare-diff": "node scripts/test-compare-diff.mjs"`).

**Step 1 — write failing tests** covering, at minimum:
- `sameText("2-3 hours before bed", "2 to 3 hours before bedtime") === true`
- `sameText("0.5–5 mg", "0.5 to 5 mg") === true`
- `sameDose("3 mg", "0.3 mg") === false` and `sameDose("2 h", "2 hours") === true`
- outcome set diff (shared + unique), interaction class-key mapping, `format:'intervention'`
  vs supplement dose diff, missing-on-one-side → different + "not recorded", grade letter-same
  / state-different case, unrecorded dimensions excluded from identical.

**Step 2** — run `npm run verify:compare-diff`, expect FAIL (module missing).
**Step 3** — implement Stages A–D as pure functions (no Astro import; import only the plain
`src/lib/{tiers,evidence-gates,outcomes,remedy-state}.ts` types/data).
**Step 4** — `npm run verify:compare-diff`, expect PASS.
**Step 5** — commit `feat(compare): semantic difference-detection engine (L-01)`.

### Task 2: Compare data projection `src/lib/compare-data.ts`
Project each non-withdrawn remedy into a stable `CompareEntity` (slug, name, tier,
workflowState, rankingEligible, outcomes, doses, notFor, biggestRisk, interactions,
epistemicState, category, tier gates). One place both the picker and the pair page read.
TDD a small shape/ordering test; commit.

### Task 3: `PairComparison.astro` component
Renders the ordered sections from two `CompareEntity` + `compare-diff` output. Tokens-only.
`<details>` for identical sections; always-expanded safety/grade/interaction sections; the
"why it matters" line per section; the D4 per-remedy interaction framing reused from the
current page; disclaimer + "not a graded pairing" banner retained.

### Task 4: `/compare/[pair].astro` (getStaticPaths, all unordered pairs)
Canonical `a-vs-b` alphabetical; reverse order 301-style canonical link to the canonical.
Server-renders `PairComparison`. `?goal=` read at build is impossible → `goal` handled by the
tiny client enhancer (emphasis only). Confirm `verify:crawl` passes (content is server-rendered).

### Task 5: `/compare.astro` picker/index + `?a&b&goal` alias
Server-rendered two-select (or two remedy lists) → builds the canonical path link. A `<script>`
reads `?a&b` and, if both valid, `location.replace()`s to `/compare/[pair]?goal=`. No-JS: the
picker is fully usable (real links). Keep the intro/framing/disclaimer.

### Task 6: L-02 fix (goal chips overflow)
In the new markup, goal chips must wrap: the chip container uses `flex-wrap: wrap` and chips
drop `white-space: nowrap` (or allow wrap within the value column). Add an assertion to the
visual pass that "stay asleep / fewer awakenings" no longer exceeds its column at 1440.

### Task 7: QA + screenshots + height report
- `npm run verify` (tokens, cites, crawl, framing, responsive as relevant) green.
- Run `/design-qa` (scopes to diff, ranked findings → `qa/pr-findings.md`).
- Rendered-visual + keyboard pass (chrome/template change): view `/compare` and a representative
  `/compare/[pair]` at 390/768/1440; measure nav intrinsic width; keyboard pass on the picker
  selects, the reveal `<details>`, and section links.
- **Screenshots at 375/768/1440 before & after + height delta** — see tooling note below.

---

## Screenshot tooling note (must resolve for the "before/after at 375/768" ask)

The Claude-in-Chrome MCP in this environment renders at a **fixed 1440 CSS viewport**
(`window.innerWidth` stays 1440 through `resize_window`), so true 375/768 captures aren't
achievable with it — consistent with `qa/README.md` (headless screenshotting is a HUMAN-GATE;
Playwright is not a repo dep). Live baseline captured at 1440: **17,708px, 31 cards**. The
audit's headless run is the authoritative 375 baseline (**33,717px**). Options for true
375/768 before/after: (a) owner runs the same headless capture used for the recon audit;
(b) accept 1440 live + the audit's 375 numbers + intrinsic-width measurement per the existing
manual protocol. Expected after: a two-remedy page is a short stack (target < ~3–4 viewports at
375, i.e. > ~90% height reduction vs 33,717px), not a 31-card feed.

---

## Open decisions (owner)

- **D-A Dimension gap:** (1) ship honest subset + fence the 3 as "not recorded" [recommended];
  (2) add cited schema fields for population/effect/time-to-effect (HUMAN-GATE + evidence-editor
  populates 31 remedies); (3) drop the 3 from the dimension list.
- **D-B URL scheme:** (1) path-canonical `/compare/[a]-vs-[b]` + `?a&b&goal` alias [recommended,
  SSG-pure]; (2) single `/compare` client island reading `?a&b` (accept compare as a client tool
  per D1; risks `verify:crawl`).
- **D-C Screenshots:** how to obtain true 375/768 before/after (owner headless run vs 1440-live +
  audit numbers).
