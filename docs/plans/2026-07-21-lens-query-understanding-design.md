# The Somnary Lens — query understanding + Perplexity-grade UX (CHK-7.4)

**Owner-gated (medical-boundary AI core).** Extends the shipped Lens (CHK-7.1/7.2/7.3).
Not a new product — a fix + polish so the Lens actually does the job it was reframed for.

## The problem (owner-reported)

Searching **"Restavit"** (an AU brand of doxylamine, a sedating antihistamine sold as a
sleep aid) returns **nothing** — `status:"refused"`, 0 model calls. Root cause:

1. **The topic fence over-refuses.** `src/lib/guide/topic-fence.ts` is a hard-coded
   ~120-word keyword allowlist built for the *concierge* (whose job was to *stay on*
   sleep topics). It was reused verbatim for the Lens — whose job is the **opposite**:
   research the long tail of products it does *not* already recognise. Any bare
   brand/product name the corpus doesn't know (Restavit, ZzzQuil, Unisom, a novel
   supplement) fails the keyword match and is refused before any research runs.
2. **No query understanding.** Even past the fence, retrieval sends the *raw string*
   straight to PubMed (`esearch term="Restavit"`). PubMed doesn't index brand names,
   so it returns nothing → "inconclusive". There is no brand→ingredient resolution and
   no sleep-context scoping of the query.

The Lens's *synthesis* (adversarial verification, no fabricated grade) is strong. What
it lacks is the **front** (understand the query) and the **feel** (live reveal + loop) —
exactly the two things that make Perplexity work.

## The fix

### A. A query-understanding / resolution step (the core)

One cheap model call at the front (`resolve.ts` + `LENS_RESOLVE_PROMPT`) that turns any
input into a bounded, server-coerced `ResolvedSubject`:

```
{ sleepRelevant, subject, resolvedName, aka[], productClass, pubmedQuery, note }
```

- **Brand → ingredient**: "Restavit" → resolvedName "doxylamine", productClass
  "otc-drug", pubmedQuery `doxylamine AND (sleep OR insomnia OR sedation)`, note
  "Restavit is an Australian brand of doxylamine, a sedating antihistamine used as a
  sleep aid."
- **Relevance**: `sleepRelevant:false` (e.g. "Toyota Corolla") → refuse as off-topic.
  This is strictly *less* refusing than today (which refuses the whole long tail).
- Fixes the bug **and** sharpens every retrieval (real PubMed query, sleep-scoped).

### The guardrail change — and why it is safe (D5)

The relevance decision moves from a deterministic keyword list to a model call. The
**safety-critical gates stay deterministic and in front of the model, unchanged**:

1. **Abuse / prompt-injection** — `checkTopic`'s abuse patterns still refuse pre-model.
   (We stop honouring only its *off-topic* keyword verdict; abuse is untouched.)
2. **Crisis / dosing / diagnosis / combine** — the deterministic `classify()` refuse-or-
   route still runs pre-model and pre-research. No dosing/diagnosis question reaches
   research.

The model resolution only decides **"research this, or politely decline as off-topic"**
and **"what to search"**. The worst case of a jailbroken relevance verdict is that the
Lens researches an off-topic term → PubMed returns nothing → honest "inconclusive". No
safety harm: **the invariant is untouched** — the model still never emits a grade, dose,
diagnosis, or uncited claim; every evidence claim is still adversarially verified against
a verbatim source span; the server still composes every user-facing line from `copy.ts`
templates; `note`/`resolvedName` are lint-checked (forbidden-framing + raw-identifier)
and dropped to a safe fallback on any hit.

**Drug scope (owner, please confirm):** the Lens will now assess OTC sleep drugs
(doxylamine, diphenhydramine, promethazine) and could be handed a prescription hypnotic
(zolpidem). It never doses or recommends — it reports verified published-evidence claims
(efficacy *and* harms the abstracts state) and routes safety to the boundary pages, with
`productClass` driving stronger clinician routing for drugs. This is the honest,
anti-hype value; flagged here because it widens scope beyond "natural" remedies.

### B. Perplexity-grade UX

- **Remove** the two static disclosure paragraphs on the panel (owner request). The
  answer card keeps its `STAMP` + `DISCLAIMER` ("educational, not medical advice"), and
  `/privacy` still discloses the AI provider — so the framing contract holds.
- **Show the resolved entity** ("Restavit → doxylamine · sedating antihistamine") so the
  reader sees it understood them — the Perplexity "it got my intent" moment.
- **Real SSE streaming** of true pipeline milestones (`resolving → doxylamine`,
  `read N sources`, `verifying claim i/n`, `composing`) — replaces the fake fixed-timer
  reveal. Counts shown are real, emitted by the engine as they happen.
- **Research loop**: persistent ask box + example chips so it's not a dead end.

## Architecture

- `resolve.ts` — pure coercer + `resolveSubject()` (one model call, never throws;
  degrades to raw-input passthrough on model failure so no-key → current behaviour).
- `engine.ts` — gate order becomes: abuse (det.) → classify (det.) → corpus short-circuit
  (det.) → **resolve (model)** → research(resolved.pubmedQuery) → extract → verify →
  compose. `runLens` gains an optional `onEvent(LensEvent)` callback fired at each real
  milestone; non-streaming callers pass nothing (behaviour identical).
- `LensAssessment` gains an optional server-sanitised `resolved` block.
- `/api/lens` streams `text/event-stream` when the client asks (`Accept`), else returns
  JSON exactly as today. Vercel Node streaming; `maxDuration:90` already set.
- `LensPanel.astro` consumes the SSE stream (fetch + ReadableStream reader), shows real
  progress + the resolved entity, renders the same `renderLensCard` on the final frame.

## Testing

Offline red-team (`scripts/test-lens*.mjs`) extends with a mock resolver: brand→ingredient
resolution, off-topic relevance refusal, model-failure passthrough, note lint-drop, and a
streaming-route frame test. The existing invariant tests (no grade, verified-only, corpus
short-circuit, firewall) must stay green.

## Review + merge

Compliance + design-guardian + adversarial (general-purpose) review. Opens as a **PR for
owner sign-off** — medical-boundary AI core, never self-merged.
