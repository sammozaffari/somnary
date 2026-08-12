# Product delivery-form schema — controlled vocabulary + release profile

**Status:** `[HUMAN-GATE]` — schema change; owner ratification required before build.
**Owner ask (2026-08-12):** delivery form becomes a controlled-vocabulary enum
(never free text from the label); ingestion maps label wording into the
vocabulary and flags anything it can't map for human review rather than inventing
a form; delivery form is kept **separate** from release profile (immediate vs
slow release) — two fields, the first a consumer filter, the second feeding the
form-matches-studied check.

This doc is the plan for owner ratification. Nothing here is self-merged.

---

## 1. Grounding: what the data actually holds today

Products live in `src/data/source-scorecards/*.ts` (5 ingredients:
ashwagandha, glycine, magnesium, melatonin, valerian). Each product carries a
single free-text `form: string`. `src/lib/sources/browse.ts:deriveForm()`
regexes that string at **build time** into a coarse 6-value bucket
(`capsule | gummy | tablet | powder | liquid | unspecified`).

**The blocking finding:** that one `form` string is three axes crammed together.

| Axis | Example values found in the data |
|---|---|
| Composition / combo | `single-ingredient`, `combo (+ magnesium, hops, calcium)`, `single-herb (KSM-66)` |
| Chemical form / salt | `citrate + glycinate`, `bisglycinate`, `magnesium L-threonate (Magtein)`, `oxide-dominant` |
| Physical delivery form | `powder`, `capsules`, `effervescent` — present only *sometimes* |

For glycine the string happens to hold a physical shape (`powder`/`capsules`).
For **every magnesium product the string holds the salt, not the shape** —
`"citrate + glycinate"` says nothing about tablet vs capsule. This is why the
Form facet is "honestly partial": `deriveForm()` finds no shape token in most
magnesium strings and drops them to `unspecified`. The delivery form genuinely
was never recorded for them.

**Consequence for the ask:** delivery form must be **captured as a new field**,
not re-parsed from `form`. Running the ingestion mapper over today's data would
(correctly) flag nearly every magnesium product `needs-review`: there is no
shape in the string to map. And the two requested fields cannot be clean while
the salt axis still shares the same string — so the split is really four fields,
not two (§2).

---

## 2. Proposed field set (four fields, replacing the one overloaded string)

Delivery form and release profile are properties of the **bottle/SKU**, so they
sit at **product level** — not nested under `ingredients[]` as CLAUDE.md's
current schema sketch shows (a bottle has exactly one physical form). The
per-ingredient studied-form comparison stays on the remedy (see §5).

### 2a. `deliveryForm` — the controlled vocabulary (consumer filter)

```ts
export type DeliveryForm =
  | 'tablet' | 'capsule' | 'softgel' | 'gummy' | 'melt-lozenge'
  | 'liquid-drops' | 'spray' | 'tea' | 'powder' | 'patch';   // extendable
```

Plain display labels (plain-language non-negotiable — no jargon in body copy):

| enum | label |
|---|---|
| `tablet` | Tablet |
| `capsule` | Capsule |
| `softgel` | Softgel |
| `gummy` | Gummy |
| `melt-lozenge` | Dissolvable (melt / lozenge) |
| `liquid-drops` | Liquid or drops |
| `spray` | Spray |
| `tea` | Tea |
| `powder` | Powder |
| `patch` | Patch |

This **replaces** the build-time `deriveForm()` regex: delivery form becomes a
stored, validated enum mapped once at ingestion, never re-guessed per build. It
also un-collapses today's 6 buckets — softgel splits from capsule, melt/lozenge
from capsule; spray/tea/patch/drops are new. Facets already render only the
values present in the data, so no empty facets appear.

**Extendable** = add an enum value + a label row + synonym entries (§3). One
small, reviewable edit — never an ad-hoc value invented at ingestion.

### 2b. `releaseProfile` — immediate vs slow release (feeds form-matches-studied)

```ts
export type ReleaseProfile = 'immediate' | 'slow-release' | 'not-stated';
```

The **third value is load-bearing**: most labels never state a release profile.
Forcing immediate-vs-slow when the label is silent would be inventing —
`not-stated` is the honest known-unknown, the same discipline as
`measuresSleepOutcome: null`. The form-matches-studied check treats `not-stated`
as **unverified, never an auto-pass** (§5). Seed signal already exists in the
data: `"6-salt blend (time-release)"` → `slow-release`; `"effervescent"` →
`immediate`. `sustained` / `extended` / `controlled` / `timed` all map to
`slow-release`.

### 2c. `chemicalForm` — split out of the string (not a new axis, a disentangle)

The salt / standardised-extract content (`citrate + glycinate`, `L-threonate`,
`KSM-66`, `oxide-dominant`) is the real body of the magnesium/ashwagandha `form`
strings. It stays free-text for now (a controlled vocab for salts is a separate,
larger question) but **moves out of the delivery-form field** so `deliveryForm`
is never polluted by it.

### 2d. combo / composition — already handled

`deriveCombo()` / `singleOrCombo` already carry the single-vs-combination axis.
It simply stops sharing the `form` string.

---

## 3. Ingestion mapping + the "never invent" rule

Store the enum value **plus the preserved raw label** — the source string is
never discarded:

```ts
deliveryForm: DeliveryForm | null   // null until adjudicated
rawFormLabel: string                // original label wording, kept verbatim
formStatus:  'mapped' | 'needs-review'
```

A synonym table does the mapping at ingestion. Starter table (extend as new
label wordings appear):

| label wording (case-insensitive, word-boundary) | → enum |
|---|---|
| `veggie capsule`, `vegetable capsule`, `vcap`, `v-cap`, `vegicap`, `capsule`, `caps` | `capsule` |
| `softgel`, `soft gel`, `soft-gel`, `liquid capsule` | `softgel` |
| `tablet`, `caplet`, `effervescent` (+ `releaseProfile: immediate`) | `tablet` |
| `gummy`, `gummies`, `pastille`, `jelly` | `gummy` |
| `lozenge`, `troche`, `melt`, `dissolve`, `sublingual tablet`, `ODT` | `melt-lozenge` |
| `liquid`, `drops`, `tincture`, `elixir`, `syrup`, `oil` | `liquid-drops` |
| `spray`, `oral spray`, `sublingual spray` | `spray` |
| `tea`, `sachet` (infusion), `teabag` | `tea` |
| `powder`, `sachet` (dissolvable), `stick pack` | `powder` |
| `patch`, `transdermal` | `patch` |

**The rule:** a miss → `deliveryForm: null` + `formStatus: 'needs-review'` —
**never a guessed value, never a silent `unspecified`.** A build-time gate lists
the `needs-review` products (mirroring the `effectDataStatus: pending` coverage
report already wired into prebuild / `verify:source-fields`), so the review queue
is visible, not buried. Ambiguous overloaded tokens (`sachet` = powder or tea)
resolve to `needs-review`, not a coin-flip.

---

## 4. What this touches

- **Schema change → `[HUMAN-GATE]`.** Not self-merged.
- Feeds the **product score's** form-matches-studied criterion — one of the
  three separate signals (evidence bucket · safety flag · product score). This is
  an assessment *about the bottle*, never an evidence bucket. Not the hardest
  gate, but owner-ratified.
- `browse.ts`: `FormBucket` (6) → `DeliveryForm` (10); `deriveForm()` regex is
  retired as the source of truth (may survive transitionally as a *seed
  suggestion* for the human-review queue, never as the stored value).
- `products.astro`: `FORM_LABELS` / `FORM_ORDER` regenerate from the new enum;
  facet UI handles 10 values (facets are data-driven, so this is mechanical).
- Adds a new consumer filter (release profile) — decision below on whether it's a
  visible facet at launch or data-only feeding the check.

---

## 5. How release profile feeds form-matches-studied

The studied form/release lives on the **remedy** (`content.config.ts` `dose.form`,
today free text — e.g. a melatonin trial used immediate-release). The product's
`deliveryForm` + `releaseProfile` are compared against it:

- studied `immediate` vs product `slow-release` (or vice-versa) → **mismatch**,
  flagged on the product (a slow-release melatonin gummy is a different PK object
  than the immediate-release dose trials used, even at the same milligrams).
- product `not-stated` → **unverified**, rendered honestly as "release profile
  not disclosed" — never scored as a match.

(A follow-up may add a structured `studiedRelease` to the remedy `dose` block so
the comparison is enum-vs-enum instead of enum-vs-prose. Out of scope here;
noted as the natural next step.)

---

## 6. Migration

Small file count (5 ingredients) but **not mechanical**: delivery form must be
sourced from the actual labels, because for magnesium/ashwagandha it is not in
the current data at all (the string holds the salt). This is a bounded
human-review pass, not a regex sweep. Plan:

1. Land the schema (enum, `releaseProfile`, `rawFormLabel`, `formStatus`) +
   the synonym table + the `needs-review` build gate.
2. Move each product's existing `form` string into `chemicalForm` verbatim
   (no data loss), set `rawFormLabel` = that string, run the mapper.
3. Everything the mapper can't resolve to a shape (≈ all magnesium) lands
   `needs-review`; a human fills `deliveryForm` + `releaseProfile` from the label.
4. `verify` green; open per-ingredient fill for owner review.

---

## 7. Decisions owed before build (owner)

1. **Confirm the four-field split** (delivery form · release profile ·
   chemical/salt · combo) rather than the literal two — the two can't be clean
   while salt still shares the string. *(Assumed yes.)*
2. **Release-profile data source for the migration:** labels only (most land
   `not-stated`), or pull from product pages during the fill. *(Assumed
   labels-only.)*
3. **Release profile at launch:** visible consumer facet, or data-only feeding
   the form-matches-studied check until enough products carry it?
4. **Plain label wording:** is "Dissolvable (melt / lozenge)" the right consumer
   phrasing, or prefer "Melt / lozenge"?
