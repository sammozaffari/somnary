# Design-QA findings — search-first Phase 2 (`chk-search-first-phase-2`)

Gate version: `.claude/workflows/design-qa.js` @ origin/main. Scope = branch diff vs `origin/main`.

## Rendered-visual pass

### Nav overflow (Task Group B) — RESOLVED, no code change

Measured with a same-origin iframe at the true target widths (so `@media (max-width: 640px)`
is active — the ≥500px desktop-window artifact that produced the stale "412px" reading is avoided).
Route probed: `/tiers` (interior page → nav + back button present).

| viewport | wordmark | `.links` scrollWidth | 2×`--sp-5` | need | fits | nav overflows viewport? |
|---|---|---|---|---|---|---|
| 390px | 40 | 242 | 48 | **330** | ✅ | no (`scrollWidth === clientWidth`) |
| 360px | 40 | 242 | 48 | **330** | ✅ | no |
| desktop (≥640px) | 40 | — | — | — | — | `st-label` shown, trigger = 124px "🔍 Search ⌘K" |

At ≤640px the search trigger collapses to a 44px icon (`st-label`/`st-hint` `display:none`) — this
already existed (`SearchPalette.astro`, CHK-4.2). Conclusion: the nav fits 390 and 360 with headroom;
**Phase-2 required no nav code change**, only verification. The stale "known open finding" in
`qa/README.md` is updated to RESOLVED.

### Keyboard pass (Task Group B)

- Tab order through chrome is logical: Wordmark (home) → Remedies → Which to buy → Search → ← Back.
  All controls `tabindex 0`, visible, focusable.
- Focus ring present: `--ring` = `0 0 0 3px rgba(126,31,43,0.40)` applied via `:focus-visible`.
- Search trigger activates: click opens the overlay, input auto-focuses, Escape closes. ✅

## Static gates (run per task group)

- `verify:tokens` — pass (only pre-existing spacing warnings; no new hardcoded values).
- `verify:search` — 14 passed / 0 failed (Task A).
- `verify:crawl` — pass.
- `build` — exit 0.

## Task Group C — hero search box (`/`, `/sources`)

Rendered-visual pass (Chrome MCP):
- **1440px** `/`: hero renders as primary element above the carousel — heading + full-width input (magnifier + oxblood "Search" button) + 4 example chips; carousel preserved below. Clicking the hero input opens the ⌘K palette and focuses its input (`.search-trigger.click()` reuse). No-JS: form is `method=get action=/search name=q`.
- **768px** `/sources`: "Find a product or ingredient" box sits after the intro, above the scorecard grid; "Which to buy" nav item correctly highlighted.
- **390px** `/`: no horizontal overflow (`body.scrollWidth 388 == viewport`); heading wraps to two lines, input + button fit, chips wrap to two rows.
- Reviews: spec-compliance PASS; design-guardian PASS (tokens/contrast/focus all clean, no new violations).

## Task Group D — corpus short-circuit + inline Lens draft card (`/search`)

Rendered-visual pass (Chrome MCP, live `/api/lens` with local `.env`):
- Short-circuit (server-side): `magnesium` → **302** `/r/magnesium`; exact product name → **302** its `/sources/<ing>/<slug>`; `sleep` → 200 list; genuine no-hit → 200 Lens card.
- No-hit `/search?q=Restavit`: eyebrow "Search" → **Results for "Restavit"** → boundary lead *"No graded remedy or product matched … AI-assisted research, not a Somnary grade"* → query-framed **Here's what we found on "Restavit"** → live `<LensPanel>`. The resolved card showed the verdict, the mandatory **"What it does NOT show"** beat, a **"Safety & interactions"** box routing to `/safety` + when-to-see-a-doctor, the **"not a Somnary grade"** stamp, and a **request-a-review** route. All engine-owned; the page authors no competing medical prose.
- **390px** no-hit page: no `/search` **content** element exceeds the viewport (offender scan empty) — the framed heading + LensPanel fit.
- Reviews: spec-compliance + guardrail audit **SOUND** (no-login-wall guarantee intact — the concrete `getServerSupabase + redirect('/login')` attack still fails the gate; `check-no-auth-wall.mjs` narrowing drops only benign session-less redirects; `check-forbidden-framing.mjs` change is additive/strengthening); compliance-reviewer **PASS** (all authored AI-boundary copy clears D5; stamp/does-NOT-show/safety/review-route not suppressed).

## Cross-cutting observation for owner — signed-in nav overflow (PRE-EXISTING, not a Phase-2 regression)

Measured at true 390px: an **anonymous** visitor's nav needs **330px** (fits, 60px headroom). A **signed-in** visitor's nav renders `SessionNav` ("Account · Sign out", ~99px) and needs **~409px → overflows 390 by ~19px**. This is pre-existing (SessionNav predates Phase 2, is not the search pill the doc flagged, and has no ≤640px collapse) and affects only signed-in users — and accounts are optional with **no login wall**, so nearly all traffic is anonymous and fits. **Not fixed here** (different subsystem, outside Task B's scope). Proposed small follow-up for owner sign-off: give `SessionNav` a ≤640px collapse (icon-only, or hide "Sign out" label) so the nav fits 390 in the signed-in state too.

## Guardrail changes in this branch (flagged for owner)

- `scripts/check-forbidden-framing.mjs` — **additive**: adds `src/pages/search.astro` to the lint TARGETS (the new reader-facing AI-boundary copy is now held to the `/lens` bar).
- `scripts/check-no-auth-wall.mjs` — **narrowed**: the redirect check now fires only when a content route *also* reads a server session (was: any redirect). Needed so `/search`'s benign corpus short-circuit `Astro.redirect` isn't a false positive. Audited: the load-bearing check (no `getServerSupabase` in content routes) is unchanged and still catches any real login wall.
