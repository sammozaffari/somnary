# DESIGN_SYSTEM v3 — PROPOSAL (warm / oxblood direction)

**Status: DRAFT PROPOSAL for owner sign-off. NOT adopted, NOT wired.**
The live site still runs the ratified **v2 evidence-teal** system. This document proposes
migrating to the warm / oxblood direction in `docs/design-reference/reimagined-key-pages.png`.
Adopting it **rewrites the source-of-truth `DESIGN_SYSTEM.md`** and **amends a locked decision
(D3, wordmark casing)** — both are `[HUMAN-GATE]`. Nothing here changes tokens or components until
you approve.

**Live preview:** `docs/design-reference/v3-homepage-preview.html` (self-contained — open in any
browser) applies this palette + type to the real homepage content, with a token appendix.

---

## 1. Why this exists

You flagged `reimagined-key-pages.png` and said you like it. The **information architecture** in
that mockup is exactly what we've already built (decision-first homepage, tier board, remedy
lead-blocks, outcome pages, safety hub, label checker, compare). What differs is the **visual
system**: it's a warm, editorial, oxblood-accented palette with Söhne/Inter type and a lowercase
`somnary` wordmark — where v2 is cool evidence-teal, Archivo/IBM Plex, and `Somnary.` capitalized.

This proposal turns that mockup into a concrete, contrast-checked token system so you can decide
whether to migrate.

## 2. What changes from v2 (at a glance)

| | v2 (live, ratified) | v3 (this proposal) |
|---|---|---|
| Brand / primary action | Teal `#006b70` + citron `#b8ff5c` action | **Oxblood `#7E1F2B`** |
| Ground | Cool paper `#f5f7f3` | **Warm chalk `#FCFAF2`** |
| Evidence / positive | Eucalyptus/pistachio (already present) | Eucalyptus `#6C8A7A` / Pistachio `#E9F2DB` (promoted) |
| Safety register | Vermilion `#e34234` | Oxblood (see open question Q2) |
| Display / body type | Archivo / IBM Plex Sans | **Söhne / Inter** |
| Wordmark | `Somnary.` (D3) | **`somnary`** lowercase (amends D3) |

The IA, components, content, and copy **do not change** — this is a re-skin, not a re-build.

## 3. Proposed tokens

### Neutrals (warm, hue-biased toward the accent — not default grey)
| Token | Hex | Role |
|---|---|---|
| `--chalk` | `#FCFAF2` | page ground |
| `--surface` | `#FFFFFF` | cards, tables, panels |
| `--stone` | `#EEE8DA` | sunken fills, secondary surface |
| `--mineral` | `#DBD5CD` | borders, hairlines |
| `--slate` | `#6A6862` | muted / supporting text |
| `--ink` | `#171512` | primary text |
| `--raisin` | `#2B2028` | dark surfaces (footer, active chip) |

### The one bold accent
| Token | Hex | Role |
|---|---|---|
| `--oxblood` | `#7E1F2B` | primary CTA, brand accent, the hero "before", safety |
| `--oxblood-deep` | `#661722` | hover / pressed |
| `--oxblood-tint` | `#F6E7E3` | safety-card / warn fills |

### Evidence / nature (the "good evidence · verified" semantic)
| Token | Hex | Role |
|---|---|---|
| `--eucalyptus` | `#6C8A7A` | accent, positive fills, update kickers |
| `--eucalyptus-deep` | `#3F5A4C` | **text on light** (eucalyptus itself fails small-text contrast — see §5) |
| `--pistachio` | `#E9F2DB` | verified-chip fill (text: `--eucalyptus-deep`) |

### Grade ramp (green → amber → oxblood)
Proposed anchors, **tuned for white-letter legibility** (see §5 — the raw reference greens are too
light to carry a white letter):
| Grade | Proposed hex | Note |
|---|---|---|
| S | `#274B3F` | deep pine |
| A | `#3F6A57` | |
| B | `#4E6E5E` | **darkened** from the reference's `#6C8A7A` (that mid-green fails white-text contrast) |
| C | `#B07A2E` | amber |
| D | `#A0522D` | burnt |
| F | `#7E1F2B` | oxblood |

## 4. Type

**The mockup's display face is Söhne** (Klim Type Foundry). Confirmed by letterform analysis of the
reference (`crop_*` studies of the hero, "Display" sample, and "Melatonin" heading):

- Neo-grotesque, Akzidenz-Grotesk lineage: vertical-sided `M`, horizontal terminals on `e`/`s`,
  round-but-not-geometric bowls, double-story `a` with a modest tail, straight-tailed `y`, flat-topped `t`.
- **Single-story `g`** (visible in "si**g**nal" on the Melatonin subhead) — the decisive tell that
  separates Söhne from Helvetica and Inter (both double-story `g`).

### Free stand-ins, ranked (Söhne is paid)
| Option | Match | Cost / note |
|---|---|---|
| **Söhne** (license) | exact | paid Klim web license, self-host |
| **Hanken Grotesk** ⭐ | ~90% — **same single-story `g`**; **already bundled** (`@fontsource/hanken-grotesk`) | free, **zero new dependency** |
| Inter / Inter Display | good UI grotesque, but **double-story `g`** | free; already the mockup's *body* face |
| Geist | clean neo-grotesque | free |

**Recommendation:** for a free build, **Hanken Grotesk** is the closest match to the mockup's display
face (the `g` tell) and it's already a project dependency — no license, no new dep. Reserve a Söhne
license only if you want the mockup replicated exactly. Body stays Inter (or Hanken for a single-family
system).

**Preview note:** the preview now **embeds Hanken Grotesk** (base64 data-URIs, weights 400–800) so it
renders identically on every device — not the earlier `system-ui`/SF-Pro fallback (which is why the
first pass read "close but off"). **Owner decision (Q3):** Söhne license vs Hanken Grotesk (free, installed).

**Scale** (from the mockup): Display 800 · H1 650 32/40 · H2 600 24/32 · H3 550 20/28 · Body 400 16/24
· Small 400 14/20 · Caption 400 12/16 · Label 600 11/16. Tight tracking on display (`-0.02em`).

## 5. Contrast — the honest part (v2's §8 discipline still applies)

The design system requires **computed contrast**, not eyeballing. Spot-checks of the v3 palette:

| Pair | Ratio (approx) | Verdict |
|---|---|---|
| `--ink` on `--chalk` | ~16:1 | ✅ AAA |
| white on `--oxblood` | ~8:1 | ✅ AA (incl. small) |
| `--oxblood` on `--chalk` (hero "before", large) | ~7:1 | ✅ AA large |
| `--slate` on `--chalk` | ~4.5:1 | ⚠️ **AA large only** — for small body text, darken to a `--slate-deep` (~`#565149`) |
| **white on `--eucalyptus` `#6C8A7A`** | **~2.9:1** | ❌ **fails** — eucalyptus is a *fill/accent only*, never white-text bearer |
| `--eucalyptus-deep` on `--pistachio` | ~6:1 | ✅ AA (the verified chip) |
| white on grade-B `#4E6E5E` (tuned) | ~4.6:1 | ✅ AA large (badge is ≥19px bold) |

**Takeaways baked into the proposal:** (1) the grade ramp uses *darkened* greens so white letters stay
legible; (2) eucalyptus is a fill/accent, with `--eucalyptus-deep` for any green text; (3) small muted
text uses a darker slate than the reference's mid-grey. These are the same guardrails v2 enforces.

## 6. Semantic model

- **Oxblood** = brand + primary action + the "before" thesis + safety register.
- **Green (eucalyptus/pistachio)** = evidence strength / "source checked" / positive.
- **Amber** = caution (mid-grade, label warnings).
- **Grades** ride the green→amber→oxblood ramp — evidence-meaning, never brand.

This reads coherently ("red = stop & check before you take it; green = the evidence"). See Q2 for the
one tension.

## 7. Migration plan (if approved)

Because every component already consumes CSS custom properties, most of the change is **centralized**:

1. **Tokens** — rewrite the color block in `src/styles/global.css` + `tailwind.config.mjs` to the v3
   values, *keeping the existing token names where possible* so components inherit automatically.
   (e.g. `--primary` → oxblood, `--paper` → chalk, `--action` retired or repurposed).
2. **Grade colors** — swap the `--grade-*` anchors to the tuned ramp (§3); re-verify the big-badge
   white-letter contrast (design-guardian gate).
3. **Type** — self-host Inter (+ chosen display face); update `--font-display` / `--font-body`.
4. **Wordmark** — update the `Wordmark` component to lowercase `somnary` **iff D3 is amended** (Q1).
5. **Safety register** — decide oxblood-vs-separate-red (Q2); update `--vermilion`/`--safety-ink`.
6. **Rewrite `DESIGN_SYSTEM.md`** to v3 and re-run the token linter + design-guardian across all pages.
7. **Visual QA** — headless screenshots of home / tiers / a remedy / safety / label-checker / compare.

Estimated: a focused re-skin, mostly token-level + a font swap + a contrast pass. The token linter
(`check-tokens.mjs`) and design-guardian make this safe and mechanical, not a rebuild.

## 8. Open questions for the owner (each blocks adoption)

- **Q1 — Wordmark casing (amends locked D3).** The mockup shows lowercase `somnary`. D3 locks
  `Somnary.` capitalized with a trailing-period mark. Adopting v3 means **amending D3**. Keep the
  trailing-period dot in oxblood on lowercase (`somnary.`), or drop it? *(I kept `somnary.` in the preview.)*
- **Q2 — Oxblood does double duty** as both *brand/action* and *safety*. In v2 these are separate
  (teal brand vs vermilion safety) so a red always means "caution." If oxblood is the primary CTA,
  a red button no longer uniquely signals danger. Options: (a) accept it (context disambiguates);
  (b) reserve a distinct deeper/brighter red for safety only. **Your call.**
- **Q3 — Display font.** Buy Söhne's web license, or use **Hanken Grotesk** (free, already installed,
  same single-story `g` — recommended; see §4)? The preview now embeds Hanken Grotesk so you can judge it.
- **Q4 — Scope of first cut.** Migrate the whole site at once, or ship v3 behind a preview route
  first for a side-by-side before committing?

## 9. Recommendation

The direction is strong and on-brand for the product's thesis (caution-before-consumption). It's
adoptable with modest, mostly-token-level work — **provided** the grade ramp and muted text are
contrast-tuned (§5) and Q1/Q2 are decided. Say the word and I'll open the actual v3 re-skin as its
own reviewed PR (tokens → grades → fonts → wordmark → QA), gated exactly like every other change.
