# Homepage hero answer card + compression — design (owner-approved 2026-07-13)

## Problem
New users land on the homepage, scroll a lot, and see zero product value above the
fold: no grade, no verdict, no safety line until they click a pill or CTA on faith.
The display headline (up to 128px) and generous section spacing make three sections
feel like endless scroll.

## Decision (owner-ratified in brainstorm)
Add a **live answer card** to the hero — a real remedy answer (grade, verdict,
biggest risk) visible in the first screen — and **compress** the rest of the page.
Rejected alternatives: instant search-in-hero (empty box is not a taste; duplicates
SearchPalette); compress-only (fixes scroll, still shows no value above the fold).

## 1 — HeroAnswerCard

- New component `src/components/HeroAnswerCard.astro`, rendered inside the hero.
- All five popular-check remedies (melatonin, magnesium, valerian, l-theanine,
  ashwagandha) are **server-rendered as five complete cards** at build time from
  remedy frontmatter: `TierBadge` + name + `verdict` one-liner + `biggestRisk`
  line + "Read the full evidence →" to `/r/{slug}`.
- Melatonin card visible by default; the other four carry `hidden`.
- The existing popular-check pills become the switcher: a ~15-line inline script
  toggles `hidden` + `aria-selected`. No fetch, no framework island, no new deps.
- **No-JS fallback:** pills remain plain `<a href="/r/{slug}">` links (today's
  behavior). Page stays fully SSR/crawlable; melatonin's card is real HTML content.
- Guardrails: card text is **verbatim frontmatter** (already cited on source
  pages — no new claims). `biggestRisk` uses the vermilion safety register, putting
  safety in the first screen. No dosing, no recommendations. The oxblood `--action`
  budget stays spent exactly once (hero primary CTA); the card link is a plain
  `--primary` text link.

## 2 — Compression

- **Hero two-column** at ≥900px: headline/dek/CTAs left, answer card right;
  stacks below 900px. Hero vertical footprint roughly halves.
- **Headline** steps down: `--text-display` → `--text-3xl` (existing tokens only).
- **Spacing:** page padding `--sp-9` → `--sp-8`; hero bottom margin `--sp-8` → `--sp-7`.
- **Grade legend** compresses from six stacked rows to one horizontal strip:
  six badges in a row, letter + tier name under each (readable without color
  alone), existing note + methodology link kept beneath. Per-tier
  `decisionTranslation` sentences drop from home (they live on /methodology and
  /tiers).
- Situation tiles unchanged.

## Acceptance criteria

1. Melatonin answer card present in built HTML (`dist/`) — grade, verdict,
   biggestRisk, link. All 5 cards SSR'd.
2. JS disabled: pills work as plain links; nothing broken.
3. Tokens only; `--action` spent exactly once; safety line uses safety register.
4. Card text verbatim from frontmatter — no new claims. compliance-reviewer +
   design-guardian both pass.
5. Homepage scroll height meaningfully reduced; build green.

## Gate status
Not a human gate (no grade/legal/monetization change). Protocol: branch
(`chk-home-hero-answer-card`) → builder → reviewers → auto-merge.

## Status
Design approved by owner 2026-07-13. **Implementation deferred to a later
session** (owner chose "approve doc only").
