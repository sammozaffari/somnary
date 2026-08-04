Verification is not optional. For any visual change: run the page, screenshot at
375/768/1440, compare against the reference, list every difference explicitly,
fix each one, screenshot again. Report the comparison, not just "done".

Never use a hardcoded colour, spacing, radius, or font-size. Semantic tokens only.
If a needed value doesn't exist, stop and ask.

Every interactive element has hover, focus-visible, active, and disabled states.
Every data surface has empty, loading, error, and no-results states.

Ask before inventing. Surface gaps rather than filling them with plausible guesses.

## Standing decisions

Unknown is a first-class state. Never convert an unknown into an optimistic
default. This is the governing principle for this codebase — every high-severity
finding in the reconnaissance audit was a violation of it.

Somnary is researched, written, and reviewed by one person. No copy may imply
multiple reviewers, peer review, or independent verification.

Product editorial stance is factual evaluation only. Somnary does not rank or
recommend products. No "best", no "top pick", no winner language.

Error states and empty states are never interchangeable. A failed fetch may not
render as a no-results or no-flags result. This was CMP-01, the label checker
false negative.

## Deferred — do not start

Entity IDs and per-form dose modelling. EvaluationContribution and per-dimension
source trails. Interaction claims graph. Universal product/brand search. URL
migration. Retailer offer model.

All are XL by the IA audit's estimate — 120+ hours each — and out of scope. See
docs/decisions/deferred.md for what each is, why it matters, and what was done
instead.

If you identify one of these as the correct fix for something, say so and stop.
Do not begin it.

## Known gate limitations

npm run verify:tokens exits 0 while printing 32 violations. Read its output;
a passing run is not compliance until build 6 fixes the checker.

npm run check has one pre-existing error at src/lib/lens/websearch.ts:199.
Anything beyond that is new.

## Sources of truth

docs/audits/01-recon.md        34 findings, evidence, severity
docs/audits/02-ia.md           entity model, intents, 17 decisions
docs/audits/04-grade-states.md grade state audit, 31 remedies
docs/decisions/deferred.md     what was scoped out and why
src/styles/global.css          authoritative token layer until build 6
