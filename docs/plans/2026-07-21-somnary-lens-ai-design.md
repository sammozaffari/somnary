# The Somnary Lens — AI strategy re-assessment + design

**Status:** owner-ratified in a live brainstorm, 2026-07-21. Every decision below
was put to the owner and accepted, including the constitutional amendment (D5).
**Supersedes** the "concierge/router is the AI product" framing from the
2026-07-17 guide-concierge design — the concierge ships and stays, but demotes to
a secondary mode.

## Why (the problem with the concierge as the flagship)

The `/guide` concierge is a **router**: it turns your words into a reading list.
That is the weakest defensible use of AI here, because:

1. It competes on **conversation** — what general models (ChatGPT/Perplexity) do
   best — while handicapping itself by refusing to advise. On vague input it is
   strictly worse than a general chat.
2. It layers a slow, fallible step over content a search box already reaches.
3. Its value is capped by the corpus (~31 remedies). Ask about the bottle in
   your hand and it shrugs.

**The reframe (owner-agreed): don't out-chat them, out-*rigor* them.** Somnary's
asset is a *method* — evidence graded S–F on real human studies, the label-checker
rules (R1–R5), the source-scorecard dimensions, conservative safety, real
resolvable citations, no brand money, and the anti-hype stance of *saying what the
evidence does NOT show*. General AIs are sycophantic and hype-amplifying. The
differentiated move is to **apply Somnary's method where the corpus can't reach —
the infinite long tail of real products — and be the anti-hype instrument.**

## What (the flagship: "A via C")

**The Somnary Lens**: one **Perplexity-style prompt box** where you ask about, or
paste/photo, any sleep supplement — *including products the corpus doesn't cover*.
The AI runs bounded, cited, adversarially-verified research and applies Somnary's
rubric, returning a structured, skeptical verdict card — explicitly "AI-assisted,
not a Somnary grade". Delivered as a Perplexity-shaped surface (one prompt → a
cited answer card with source chips + follow-ups), NOT a 4-beat interview.

## The constitutional amendment (D5 — ratified 2026-07-21)

The non-negotiable "AI answers only from the reviewed corpus" is amended to allow
bounded external research ONLY under all guardrails (now in CLAUDE.md D5):
every claim cited to a resolvable source; every evidence claim adversarially
verified (refute-first, unproven claims CUT not hedged); weak evidence labeled
weak + the anti-hype beat mandatory; output is a **draft assessment, NEVER a tier
grade** ("AI-assisted research · not a Somnary grade" + request-a-review route);
no brand money, no personalized dosing/diagnosis, safety routing intact. Published
grades, the corpus bar, citation discipline, and safety conservatism stay sacred —
the AI may only *apply* that discipline to new inputs, fenced as draft/unvetted.

## The answer card (what the user sees)

One prompt box, primary AI front door. Placeholder invites the long tail:
"Ask about any sleep supplement — or paste a product or label." On submit, a
**live "researching" state** reveals the real steps (searching → reading N
sources → verifying claims) — the trust signal a black-box chat can't give. The
result is a **structured card**, not a chat bubble:

- **Verdict line** — evidence-anchored, blunt ("Thin human evidence, and this
  product's dose is a third of what the one positive study used").
- **What the evidence shows** — each claim + inline citation chip; weak labeled weak.
- **What it does NOT show** — the signature anti-hype block, always present.
- **Label reality** (product/label) — dose vs. studied dose, proprietary blend,
  standardization, form: the R1–R5 flags applied live.
- **Safety & interactions** — routed to boundary pages; never a dose or diagnosis.
- **Source chips** — the resolvable citations, clickable.
- **The stamp** — "AI-assisted research · not a Somnary grade" + "request a full review".
- **Follow-ups** — suggested next questions.

Corpus remedies **short-circuit** to the human-graded page (a vetted grade always
beats fresh AI research).

## The pipeline (how the card is produced)

Design principle (mirrors the concierge invariant): **the model researches and
extracts; the SERVER composes the verdict from verified claims + deterministic
rule output; the model never emits a grade, a dose, or an uncited claim.**

1. **Deterministic routing first.** Reuse the guide `classify()` (crisis/dosing/
   diagnosis/combine still refuse-or-route) → `detectRemedyMentions()` (corpus
   remedy → short-circuit to the graded page). Only an unlisted product/ingredient/
   question reaches the Lens.
2. **The Lens research pipeline** — a bounded version of the deep-research harness:
   - **Search** the product/ingredient + evidence (studies, monographs, regulator/
     adverse-event DBs).
   - **Extract** claims + the product's own label facts.
   - **Apply the rubric in CODE, not model judgment** — label-checker R1–R5 (dose
     vs. studied, proprietary blend, standardization, form, interactions) + source-
     scorecard dimensions, run deterministically.
   - **Adversarially verify** every evidence claim — spawn skeptics to refute;
     majority-refute CUTS the claim. This is the anti-hallucination core the
     amendment requires; it makes "cited" mean *true*, not *plausible*.
   - **Compose** the card server-side from verified claims + deterministic flags +
     resolvable citations. Minimal model prose, forbidden-framing-filtered.
3. **Guardrails carry over** — forbidden-framing lint, no-tier-grade, the stamp,
   safety routing.
4. **Cost/caching** — research is slow (10–60s) and burns credit: the "researching"
   UI covers latency; results **cache per normalized product** (repeat lookups
   instant + cheap); reuse the rate limiter as the most expensive endpoint.

~70% assembly of existing parts: guide guardrails, the label engine, the deep-
research harness, the source-scorecard rubric, the limiter, the citation resolver.

## Placement + the compounding loop

The prompt box becomes the primary AI surface (the site-wide "Ask Somnary" upgrades
into it; the homepage "Talk it through" entry repoints here). The 4-beat concierge
survives as a secondary "not sure where to start?" mode. Vague input is handled
honestly: "what helps me sleep?" → a grade-anchored overview of the best-evidenced
corpus options + "want me to check a specific product?" — vague still lands
somewhere useful; specificity unlocks the Lens.

**The moat (compounding):** every Lens run on an unlisted product is a corpus
candidate. "Request a full review" feeds a queue; *what people run the Lens on*
tells you what to grade next. The AI grows the graded corpus toward real demand,
grading stays human-gated. Connects to Source Scorecards + community nominations.

## Phasing

- **Phase 0 (this doc + CLAUDE.md D5 amendment).** Ratified design + constitution.
- **Phase 1 — the Lens engine, headless.** Research → rubric → adversarial
  verification; offline red-team suite (hallucination / no-grade / no-dose /
  refusal). THE RISKY CORE — prove anti-hallucination before any UI. Output framing
  (the "not a grade" stamp, educational-not-advice) is a **hard human gate** before
  Phase 2 ships.
- **Phase 2 — the Perplexity UI.** Prompt + progress-reveal + answer card + caching
  + rate limiting.
- **Phase 3 — the human-grade loop.** Review queue + Lens-demand analytics feeding
  the grading backlog; concierge demotion.

## Risk / open questions for later phases

- Liability concentrates in Phase 1: verification must genuinely kill unproven
  claims; legal/medical framing review is a hard gate.
- Web search + fetch tooling for the research harness in a serverless runtime
  (Vercel) — needs a search API + fetch budget; cost controls essential.
- Label photo → OCR → structured facts is a Phase 2+ nicety, not Phase 1.
- Caching key + staleness policy (re-research after N days).
