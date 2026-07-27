# Search-First IA Redesign — Design Doc

> **Status:** Owner-driven design, ratified in direction on 2026-07-27. NOT yet implemented.
> Hand this to a fresh session for execution. Confirm the "Open decisions" with the owner
> before building any phase that depends on them.
>
> **For the executing session:** this is a design/strategy doc, not a task-by-task plan.
> Turn each phase into a `superpowers:writing-plans` implementation plan as you reach it.
> Ship Phase 1 first (chrome-only, low risk); later phases depend on owner sign-off on the
> open decisions below.

## Trigger

Owner reviewed EWG Skin Deep's IA and flagged that Somnary's navbar is overloaded (9 items,
half wrapping to two lines) and that the "Lens"/"Ask" naming does not communicate a use case.
Owner directives, verbatim intent:
- Remove **Safety** from the navbar ("nobody looks for it").
- Remove **Label checker** as a separate tool — "the user should be able to type in their
  product and get the information that the *which product do I buy* pages return."
- Rethink the navbar + titles entirely; make nav text less light (darker).
- Every page needs a **back button**.
- Question whether "Ask"/"Lens" is clear, whether an EWG-style **search** subsumes it, and
  whether **on-page questions / autofilled FAQs** (e.g. per additive) are worth building.

## The thesis

**Somnary's front door is a single search box. Search unifies corpus lookup + Lens research.
The Lens is an engine, not a destination. The navbar collapses to two pillars + search.**

EWG Skin Deep's top bar carries *no* content links — just logo, two CTAs, and a search/menu
icon. The navigation *is* a big hero search box ("Search for an ingredient, brand or product")
over a two-pillar database (Ingredients = the science, Products = the things you buy).
Somnary's parallel: **Remedies** (does it work) + **Which to buy** (which product), with the
Lens as the AI edge — but surfaced *through* search, not as its own tab.

### Why search unifies everything

One user intent — *"tell me about this thing"* — is today split across four surfaces
(Lens, Label checker, the scorecard hub, remedy pages). One box collapses them:

| User types… | Corpus? | Result |
|---|---|---|
| a graded remedy (e.g. "magnesium") | hit | the vetted evidence-grade page |
| a scored product (one of 88) | hit | the vetted product scorecard page |
| an ungraded product/ingredient/brand | miss | **Lens researches it live** — cited, adversarially verified, stamped "AI-assisted research · not a Somnary grade", with a route to request human review |

The user never has to know which path fired. This is exactly the D5 boundary already
ratified in CLAUDE.md — the Lens *may* research beyond the corpus under the anti-hallucination
guarantees. Search is just the honest front door to it.

## New information architecture

### Navbar (rethought, EWG-minimal, darker text)

```
◐ Somnary            Remedies        Which to buy            🔍  Search
                     (does it work?)  (which product?)
```

- **Two real destinations** + a first-class search affordance. That's it.
- **Remedies** — the evidence grades (the corpus / tier board).
- **Which to buy** — the source scorecards (kept from the just-shipped discoverability work).
- **Search** — elevated from the current ⌘K `SearchPalette` to a primary item (icon + label),
  and mirrored as a large box in the hero (see Phase 2).
- **Nav text darker:** links currently use `var(--muted)` (light grey, low contrast). Move the
  resting colour toward `var(--ink)` (or a near-ink token), keep the current/hover state
  distinct (e.g. `--primary` or an underline). Tokens only — confirm the exact token against
  `src/styles/global.css`; do not invent a value.
- **Back button:** add globally in `src/layouts/Base.astro`, top-left under the bar, on every
  **interior** page (not the homepage). "← Back" using `history.back()` with a `<noscript>` /
  no-referrer fallback to `/`. Small, mono, muted-but-legible.

### What leaves the navbar (and where it goes — no orphans, crawlability intact)

| Item | New home |
|---|---|
| **Lens / Ask** | Dissolved as a nav destination. Becomes the search fallback engine (Phase 2) + the FAQ generator (Phase 4). A `/lens` *methodology/about* page may remain, reachable from the footer and from Lens result cards (see Open decision 2). |
| **Label checker** | Folded into search (type a product → scorecard info). Page 301-redirects to search (Open decision 3). |
| **Safety** | **Page KEPT** — it is the boundary destination the Lens, label rules, and guide router all route to (a hard non-negotiable: "route safety concerns to boundary pages"). ~10 content pages link to it. Only the *nav item* is removed. Reachable via footer + all the existing routed links. |
| **Start here** | Footer (the homepage hero does first-timer onboarding, EWG-style). |
| **Sleep habits** | Footer (content). |
| **Compare** | Footer (tool). |
| **Methodology** | Already in the footer. |

> **Non-negotiable checkpoint:** do NOT delete `/safety`, `/methodology`, or any legal page.
> Removing `/safety` outright would break AI safety-routing (Lens `engine.ts`, `label-rules.ts`,
> `guide/router.ts`, `ask/guardrails.ts`) and is a medical-boundary change = HUMAN-GATE.
> This redesign removes it from the *navbar only*.

## The Lens, repositioned

Nothing about the Lens *engine* or its D5 guarantees changes. Only its **positioning** moves
from "a place you go" to two clearer jobs:

1. **Search fallback** — when search finds no corpus match, the Lens researches the query and
   returns a cited draft card ("not a Somnary grade" + route to request human review). Framed
   by the user's own query, its use case is finally self-evident.
2. **FAQ generator (offline)** — the Lens engine pre-generates cited Q&A for additive and
   product pages; answers are human-reviewed and shipped as *static* content (Phase 4).

This is *more* consistent with the 2026-07-21 "out-rigor, not out-chat" reframe than a
standalone "Lens" tab was — search-first is inherently less chatty.

## On-page cited FAQ system (Phase 4)

- **Additive pages** (`/sources/additives` + any per-additive route): autofilled, cited FAQ
  drawn from `src/data/additive-watchlist.yaml` (already carries class + rationale + sources).
  e.g. "Why is this on the watchlist?", "What names does it hide under on a label?"
- **Product pages** (`ProductPage.astro`): a "Questions about this product" block — pre-baked,
  cited, and/or a "research a question about this product" affordance that pre-fills search with
  product context.
- **All static, SSG, human-gated content** (evidence-editor drafts → citation-auditor verifies
  → compliance-reviewer lints). No live runtime hallucination surface. Great for SEO.

## Execution phases (for the new session)

1. **Chrome redesign** *(low risk, ship first, no open decisions block it)* — new 2-pillar +
   search navbar, darker nav text, global back button in `Base.astro`, Safety/Start here/
   Sleep habits/Compare demoted to footer (add a footer "Tools" group for Compare). Run
   design-guardian + compliance-reviewer. `Nav.astro` currently has an uncommitted
   "Which to buy" label edit — fold it in.
2. **Search-first front door** — elevate `SearchPalette` to a hero search box on `/` and
   `/sources`; build/verify the corpus search index (remedies + 88 products + additives);
   wire the no-hit path to the existing Lens endpoint; result framing (vetted vs. draft).
   Evaluate index approach (Pagefind vs. prebuilt JSON + fuzzy match) in-session.
3. **Fold in the label checker** — 301 `/label-checker` → search; migrate any label-rule
   safety routing that must survive; remove the nav/tool entry. (label-rules.ts routing to
   `/safety` must remain intact.)
4. **On-page cited FAQ system** — additives first (data already exists), then products.
   Content-gated (evidence-editor + citation-auditor + compliance-reviewer).
5. **Lens cleanup** — footer link to a `/lens` methodology page (if kept), result-card
   "draft, not a grade" framing, remove residual "Lens"/"Ask" nav references.

## Open decisions for the owner (confirm before the phase that needs them)

1. **Search item presentation** — icon-only (🔍) like EWG, or **🔍 + "Search"** label? (Recommend
   icon **+ label**: Somnary's search does more than EWG's, so name it.)
2. **Does the Lens keep a landing page** at `/lens` (methodology/about + "how our AI research
   works"), reachable from footer + result cards, even though it's out of the nav? (Recommend
   **yes** — it explains the rigor and the "draft, not a grade" boundary; killing it loses that
   trust surface.)
3. **Label-checker page** — 301-redirect to search (preserve links/SEO) or hard-remove?
   (Recommend **redirect**.)
4. **FAQ scope** — which additives/products get pre-generated FAQ first? (Recommend the 8
   flagged watchlist additives + the melatonin products, where data is richest.)
5. **"Ask"/"Lens" wording anywhere user-facing** — the result-card verb. (Recommend framing by
   query — "Here's what we found on *X*" — not a product name.)

## Guardrails (unchanged, load-bearing)

- No composite score, no #1, **zero affiliate / zero brand money** (D2).
- Every factual claim cites a real resolvable source (PMID/DOI/registry).
- Lens output is a **draft, never a tier grade**; adversarially verified; "what the evidence
  does NOT show" beat mandatory; stamped "AI-assisted research · not a Somnary grade".
- Safety routing intact; `/safety` boundary page preserved.
- Tokens only (no hardcoded style values); design-guardian + compliance-reviewer must pass.
- Grades and legal/medical-boundary/monetization changes remain HUMAN-GATE — never auto-merged.
