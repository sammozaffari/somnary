# CMP-01 — label checker state handling

## Failure, cause, and fix

Before this change, a failed `/label-index.json` request was caught and cached as `entries = []`. The checker then ran against that empty array and rendered the ordinary no-flags result. With `Melatonin 20 mg`, the working path produced R2 and R5, while an aborted index request produced reassuring copy even though nothing had been checked.

The failure and empty-result paths now have different, mutually exclusive states. A failed or invalid index enters `index_unavailable`, says that the check did not run, and offers Retry. Only results produced with a validated, non-empty `LoadedIndex` can enter `partial`, `unrecognised`, `flags_found`, or `no_flags_checked`; each result retains the exact branded index reference that produced it.

Rule rows also show their severity, rule identifier, and a plain-language “Why this fired” explanation. R2 dose and R5 interaction rules are cautions; lower-severity R1, R3, and R4 rules are observations.

## Before / after: aborted index request

| Width | Before — false no-flags result | After — check could not run |
| --- | --- | --- |
| 375 | [before](before-index-failure-375.png) | [after](after-index-failure-375.png) |
| 768 | [before](before-index-failure-768.png) | [after](after-index-failure-768.png) |
| 1440 | [before](before-index-failure-1440.png) | [after](after-index-failure-1440.png) |

## Unknown-form decision

The corpus contains 31 remedies and 56 dose rows. Twenty remedies have multiple dose rows, accounting for 46 of the 56 rows. Per-form dose modelling is therefore not a magnesium-only adjustment: it would require form entities, per-form thresholds, free-text form matching, index migration, and form-specific fixtures.

That schema work is deferred. Rule R3 now runs only for a remedy with exactly one dose row. A recognised remedy with multiple forms, such as `Magnesium 100 mg`, reports that its dose check was not applied because the form is unresolved; other applicable rules still run.

## Verification fixtures

| Fixture | Required result |
| --- | --- |
| `Melatonin 20 mg`, loaded index | `flags_found`; R2 and R5 |
| `Melatonin 20 mg`, aborted index | `index_unavailable`; never a result |
| `Melatonin 20 mg` + `Moon Root 10 mg` | `partial`; Moon Root named; headline leads with two cautions |
| `Moon Root 10 mg` | `unrecognised` |
| `Magnesium 100 mg` | R3 not applied because form is unresolved; other rules continue |
| empty or whitespace-only input | `idle` |
| unreadable input | `parse_failed` |
| injected parser exception | `parse_failed` |
| 5,000-line input | completes as `partial` |

The focused state suite covers these fixtures, invalid and empty index data, the retained index-reference invariant, and rule provenance. A browser-scoped accessibility audit reported zero violations. The result region is `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`; each transition inserts “Label checker state entered: [state]” into the live region.

## Responsive review

Every state was reviewed at 375, 768, and 1440 pixels. The final captures are named `[state]-[width].png` in this directory. The review resulted in three corrections:

- The 375-pixel navigation uses short visible labels while preserving full accessible names, avoiding wrapping and horizontal overflow.
- Rule identity and provenance remain visible on mobile instead of hiding the rule identifier.
- In `no_flags_checked`, the “does not mean … safe” sentence keeps the strongest weight. Checked coverage, dose gaps, and the “Not covered” list use separated secondary treatment; the safety boundary is never hidden.

The nine state captures are `idle`, `loading`, `index-unavailable`, `parsing`, `parse-failed`, `partial`, `unrecognised`, `flags-found`, and `no-flags-checked`. `unknown-form` is included as an additional coverage-gap capture.
