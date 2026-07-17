# Guide concierge, accounts, habits hub, and product panels — design

**Status:** owner-ratified in conversation, 2026-07-17. Every decision below was
put to the owner as an explicit choice and accepted.
**Scope:** the next Phase 6 arc — checklist items CHK-6.6 through CHK-6.11.
**Binding constraints:** CLAUDE.md non-negotiables and the rulebook
(`docs/strategy/06-decision-frameworks-operating-system.md`) apply unamended.
Nothing here changes a locked decision.

## The idea, and the constitutional shape it takes

The owner wants an AI chat "at the start" that asks what sleep problems you
have, what remedies and specific products you've tried, and what your habits
are — building a profile — plus OAuth accounts, AI-integrated search, and
(down the track) a community-trusted product list.

The rulebook forbids the AI from ever recommending a remedy, dose, product, or
combination ("take X tonight", "this is safe for you", D4). The ratified shape
is therefore a **concierge/router**: the chat gathers your situation and
outputs a personalized **reading map** — ranked corpus pages with grades and
safety boundaries — never "what to take." Products appear as **criteria-verified
quality data** on remedy pages ("if you and your clinician land on magnesium,
these passed our label checks"), never as an AI recommendation.

Owner-ratified decisions:

1. **AI boundary:** concierge/router. Routed reading, never a recommendation.
2. **Accounts:** optional, never a wall. Supabase Auth OAuth (Google + Apple,
   magic-link fallback). Offered once, at the end of the chat, to save the
   reading map and habits checklist.
3. **Placement:** dedicated `/guide` page + a hero-level homepage entry
   ("Not sure where to start? Talk it through"). Homepage design stays.
4. **Products:** middle path in this build — per-remedy quality panels,
   evidence-first framing, no purchase links in v1, AI describes criteria but a
   hard filter blocks brand names in any "you should" sentence shape.
5. **Severity-proportionate routing:** occasional bad nights → habits checklist
   + remedy reading; chronic/severe patterns → CBT-I and clinician routing,
   surfaced matter-of-factly, never preachy. Most visitors have minor issues;
   the concierge must not prescribe maximal effort for them, nor discredit
   CBT-I or people with real insomnia.

## Information architecture — three front doors, one spine

- **Search** — existing palette, upgraded with an ask fallback (below).
- **Browse** — remedies overview, tiers, outcomes, compare (unchanged).
- **Guide** — new: `/guide`, linked from the homepage hero and nav.

`/guide` is a tool page like the label checker: SSG shell (what it is, what it
will and won't do, disclaimer, privacy note — all crawlable), chat as an
island. Nothing the AI says is site content; every output resolves to an
existing corpus URL (remedy, outcome, safety, compare, habits hub, product
panel). The chat is a router over the IA, not a parallel content surface —
nothing exists only inside a transcript. `/safety` and `/start-here`
cross-link to `/guide` as the interactive alternative.

## The concierge conversation

A structured interview with free-text answers, not an open chatbot. The
model's job is to understand; the flow's job is to decide what happens next.
Four beats:

1. **Situation.** What's going on (falling asleep / staying asleep / early
   waking / shift-jet-lag / anxious mind…), age band, safety screeners
   (pregnancy, child, prescription meds, diagnosed conditions). Any red flag →
   stop routing remedies; route to `/safety`, `/when-to-see-a-doctor`, or
   `/medications-and-sleep-aids` first. Same logic as the safety router,
   conversationally delivered.
2. **History.** Remedies tried; for each, the specific product/brand, what
   happened, would they use it again — including supplier/brand experience.
   Stored in the **community store** (CHK-6.4 firewall: separate tables, never
   joins the corpus, never displayed as evidence, never colors a grade). The
   AI acknowledges, never validates ("noted that magnesium didn't help you" —
   never "that means it doesn't work" or "try more").
3. **Habits.** Caffeine timing, screens, alcohol, schedule regularity, naps,
   environment, exercise timing. Powers the habits checklist and CBT-I/outcome
   routing — often the honest best answer.
4. **Reading map.** The output: a persistent results page (not chat bubbles) —
   ranked corpus pages with grades, biggest-risk lines, the safety boundaries
   relevant to *their* screeners, the personal habits checklist, and product
   panels where they exist. Framed as "where to read," never "what to take."

**Model & guardrails.** OpenRouter, `deepseek/deepseek-chat` (DeepSeek V3),
model swappable by env var; key server-side only. The existing four-layer ask
engine carries over, plus two layers for open intake:

- **Input topic-fence:** a cheap classifier pass rejects off-topic or
  inappropriate use before the main model sees it.
- **Structured extraction:** the model outputs JSON matching the intake
  schema; the *server* maps that JSON to routes deterministically. The model
  has no channel through which to recommend anything. Short conversational
  acknowledgments are the only model prose, passed through the
  forbidden-framing filter.

## Habits education + the personal habits plan

**Content hub:** `/sleep-habits` plus per-habit sections (caffeine, alcohol,
screens/light, schedule, naps, environment, exercise timing). Ordinary corpus
content: source-first, 10-part-skeleton honesty — including that standalone
"sleep hygiene" evidence is weaker than people assume and CBT-I as a package
is the S-tier item. SSG, cited, auditor-gated.

**Habits plan:** beat 3 produces a "worth changing" checklist by
**deterministic mapping** (coffee at 4pm → the caffeine-timing item), not
model creativity. Each item = habit + verbatim cited one-liner from the hub +
link. Saved to the profile with tick-state if signed in. Educational-checklist
framing; "may help" language; compliance-reviewed.

## AI-in-search

The palette keeps instant lexical results and gains one row when results are
weak or the query is a question: **"Ask Somnary →"** → a site-wide version of
the existing ask engine (corpus-wide scope, same corpus-only / cite-back /
refuse-and-route guardrails). One shared engine powers page-ask, search-ask,
and the concierge's understanding step: three surfaces, one guardrail stack.

## Product-quality panels

**Module:** per-remedy "Quality-checked products" on remedy pages, reachable
from the reading map. Each entry: product + brand + results against the
site's existing objective criteria — dose vs. studied dose, proprietary-blend
check, standardized-extract check, third-party testing certs (USP / NSF /
Informed Choice), form match. The label checker's R1–R5 run editorially
against real market products, published as data.

**Framing (compliance-critical):** panel sits below grade, verdict, and
biggest-risk — evidence first, products last. Header: "If you and your
clinician decide to try X, these passed our label checks." Disclaimer
adjacent. **No affiliate links ever (locked). No purchase links in v1** —
name, brand, criteria results; a plain link to the manufacturer's label PDF
is allowed (it's a source, not a shop).

**Data model:** new `products` collection, separate from the remedy corpus:
`{ slug, remedySlug, brand, name, form, doseClaim, criteria{r1..r5 + rationale},
testingCerts[], labelSource, verifiedDate }`. Versioned; every criteria result
traceable to the label checked.

**Community nominations:** chat history-beats (and later a form) feed a
nomination queue; nothing publishes without editorial verification against
the criteria. Community says *look at this one*; criteria decide *whether it
appears*. Grades never touch any of this. Start with magnesium + melatonin.

## Accounts and profiles

Supabase Auth (project already owner-ratified for data capture). Stored per
profile: structured intake answers (never transcripts), reading map, habits
checklist + tick-state, saved pages. Experience reports go to the separate
community store pseudonymously even for logged-in users — keyed to prevent
duplicates, never displayed with identity, never joined into content. Raw
transcripts are not retained. The privacy page must be updated to say exactly
what is kept — **hard human-gate PR**.

## Architecture

Astro stays SSG-first. Server routes alongside `api/ask.ts`:

- `api/guide.ts` — intake turns: topic-fence → DeepSeek extraction →
  deterministic router → route-plan JSON.
- `api/search-ask.ts` — site-wide ask.

Supabase for auth / profiles / nominations; all keys server-side. The reading
map renders from route-plan JSON.

## Testing and CI

- Refusal + hallucination suite extends to the guide: red-team fixtures
  (dosing, diagnosis-fishing, combinations, inappropriate use, jailbreaks)
  must all refuse-or-route.
- Schema test: every routable output is a real URL.
- Forbidden-framing lint on every template string, including panel copy and
  the brand-name/imperative filter.
- Community-store firewall verified in code (per CHK-6.4).

## Phasing — each independently shippable

| Item | What | Gate |
|---|---|---|
| CHK-6.6 | Sleep-habits content hub | content gates only |
| CHK-6.7 | Site-wide ask in search; engine moves to OpenRouter/DeepSeek | — |
| CHK-6.8 | `/guide` concierge: intake → reading map + habits plan (anonymous) | — |
| CHK-6.9 | Accounts + saved profiles | `HG` privacy page |
| CHK-6.10 | Product-quality panels (magnesium, melatonin first) | `HG` framing sign-off |
| CHK-6.11 | Community nomination pipeline | builds on CHK-6.4 firewall |

## Future (recorded, not designed)

A community-trusted product registry beyond per-remedy panels — "trusted"
earned through the objective criteria, community input as nomination signal
only. Needs its own `[HUMAN-GATE]` design pass. No affiliate/brand money,
ever, under any version of this.
