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

_(Task Groups C/D findings appended as those land.)_
