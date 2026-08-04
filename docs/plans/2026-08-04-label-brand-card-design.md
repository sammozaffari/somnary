# Label & Brands card — top-of-remedy design

**Date:** 2026-08-04
**Status:** Ratified (owner-confirmed in brainstorm 2026-08-04)
**Scope:** Surface "what to look for on a label" and "what brands to look for"
at the top of every supplement remedy page, in one compact card.

## Problem

"What to look for on a label" and "what brands to look for" are the two most
actionable things a reader needs before buying, but both are buried:

- The label guidance renders from the remedy's `standardization` field at
  **position 9 of 17** on the page (`src/pages/r/[slug].astro:146`), after
  dosing and safety.
- The brands entry (scorecard CTA) sits at **position 10**
  (`src/pages/r/[slug].astro:153`), gated on a ratified scorecard existing.

A reader scanning the top of the page cannot see either. We want both easily
accessible at the top without inverting the mandated "bottom line first"
article skeleton.

## Decision summary (owner-confirmed)

1. **Compact summary card**, not full sections moved up. Detail sections stay
   in their skeleton positions; the card is an entry point that links down.
2. **Content from a new structured field**, `labelChecklist[]`, rendered as
   crisp ✓ bullets — with a graceful fallback to the existing prose
   `standardization` string so the card ships for every supplement immediately.
3. **Position: just under the lead block.** The verdict/grade stays #1
   (honors "bottom line first"); the card is the first *actionable* block.
4. **Brands slot hidden when no scorecard.** Shown only when a ratified
   scorecard exists (currently melatonin); no dead links, no empty promises.
5. **Include a short "avoid" line.** Keeps the corpus's anti-hype balance —
   the card is not a rosy "look for" list only.

## Component

**New:** `src/components/LabelBrandCard.astro` — a self-contained, non-island
card (no interactivity → stays SSG-clean).

**Rendered in** `src/pages/r/[slug].astro`, immediately after `RemedyLeadBlock`
and before `PublicationStatePanel`.

**Render gate:** only when `format === 'supplement'`. Interventions (CBT-I,
sleep hygiene, etc.) have no label, so the card does not render for them.

### Anatomy

```
┌─ On the label, look for ──────────────┐
│  ✓ Standardized to X% / third-party    │
│  ✓ Lowest effective dose (0.5–1 mg)    │
│  ⚠ Avoid: proprietary blends, 10 mg+   │
│  ─────────────────────────────────────│
│  → See full label guide                │   anchor to the standardization section
│  → Compare N rated brands              │   only if a ratified scorecard exists
└────────────────────────────────────────┘
```

- **✓ bullets** — from `labelChecklist[]` (2–4 items). If empty, fall back to
  rendering the `standardization` prose paragraph.
- **⚠ avoid line** — from `labelAvoid[]` (1–2 items). Hidden if empty.
- **→ See full label guide** — in-page anchor to the existing standardization
  section further down (which stays in place).
- **→ Compare N rated brands** — reuses the existing `scorecardCount` logic in
  `[slug].astro:153`. Shown only when count > 0; hidden otherwise.

### Copy — brands link

"**Compare N rated brands**" — honest (a comparison of reviewed products, not a
recommendation), consistent with the existing scorecard CTA. No "#1", no "buy",
no ranked winner (per the Source Scorecards no-ranking rule).

## Data model

Two new **optional** fields on the remedy schema in `src/content.config.ts`
(near the existing `standardization` field, ~line 164):

```ts
labelChecklist: z.array(z.string()).optional(),  // 2–4 short "look for" items
labelAvoid:     z.array(z.string()).optional(),  // 1–2 red-flag items
```

Both optional so existing content validates unchanged. The card degrades:

| field state                | card shows                                  |
|----------------------------|---------------------------------------------|
| `labelChecklist` populated | ✓ bullets                                   |
| `labelChecklist` empty     | `standardization` prose (fallback)          |
| `labelAvoid` populated     | ⚠ avoid line                                |
| `labelAvoid` empty         | no avoid line                               |
| ratified scorecard exists  | "Compare N rated brands" link               |
| no scorecard               | brands row hidden                           |

No product/brand data enters the remedy schema — brand data stays in the
separate `src/data/source-scorecards/{remedy}.ts` modules, reached by link only.

## Styling

Tokens only (DESIGN_SYSTEM.md); zero raw values; `check-tokens.mjs` must pass.
Any deliberate value carries a nearby `raw-ok:` comment.

- Card surface/border/radius reuse the same tokens as `RemedyLeadBlock` and the
  scorecard panels, so it reads as part of the same family.
- ✓ uses the evidence/positive accent.
- ⚠ "avoid" line uses the **caution** register already defined for
  `SafetyCallout` — **not** the serious-safety red, so it does not cry wolf.
- Links use the standard link token.
- **Mobile reflow:** content collapses to a single column at 390px; no
  horizontal overflow (known Somnary 390px nav/overflow risk).

## Content rollout — staged

**Phase A — ships the card (this branch).**
Schema fields + component + wiring + prose fallback. Every supplement page
immediately shows the card via the `standardization` fallback. No content debt
blocks the ship.

**Phase B — content pass (follow-up, evidence-editor).**
Fill `labelChecklist[]` / `labelAvoid[]` per remedy, source-first, so cards
become crisp ✓ bullets. Every "avoid" item must be defensible against the
corpus (e.g. the 10 mg+ melatonin caution is already cited). **Melatonin
first** — it already has a scorecard and the `LabelReadingPanel`
`lookFor[]`/`cautious[]` data to mine
(`src/components/scorecards/LabelReadingPanel.astro`,
`src/pages/sources/melatonin.astro:43`).

## QA & gates

- Touches a **shared template + new component** → the mandated
  **rendered-visual + keyboard pass at 390 / 768 / 1440px** is required
  (Chrome MCP, by hand). The card must reflow to single column at 390px.
- Run the saved `/design-qa` gate to scope + rank findings.
- `design-guardian` (token-only, contrast) and `compliance-reviewer` (the
  "avoid" copy is health-adjacent — must describe evidence, never alarm or
  promise) both run.
- **Not a hard gate** — no tier grade, no legal page, no monetization — so it
  follows the normal build → review → merge loop after QA passes.

## Definition of done

- [ ] `LabelBrandCard.astro` created, token-only, no raw values.
- [ ] `labelChecklist[]` + `labelAvoid[]` added to remedy schema, both optional.
- [ ] Card wired into `[slug].astro` after the lead block, gated on
      `format === 'supplement'`.
- [ ] Prose fallback verified: a remedy with no `labelChecklist` still shows
      the card populated from `standardization`.
- [ ] Brands row shows only when a ratified scorecard exists; hidden otherwise.
- [ ] Anchor to the standardization section works.
- [ ] Server-rendered content confirmed in build output (SSG).
- [ ] Rendered-visual + keyboard pass at 390/768/1440px; no 390px overflow.
- [ ] `check-tokens.mjs`, citation resolver, crawlability, build all green.
- [ ] Session log line appended to BUILD_CHECKLIST.
