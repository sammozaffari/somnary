---
description: Fact-check remedy pages against their cited sources (all, or the remedies you name)
argument-hint: "[remedy slug(s), or blank for the whole corpus]"
---

Run the corpus fact-check via the **audit-corpus** skill.

Scope from the arguments: `$ARGUMENTS`

- If one or more remedy slugs are given (e.g. `melatonin`, or `valerian hops`),
  audit just those.
- If blank, audit the whole corpus — but chunk it into scoped batches of ~6 with
  `{report: false}` and consolidate, per the skill (a full pass exceeds the
  session token budget).

Invoke the skill now and follow it: it runs the `fact-check-corpus` workflow,
writes the report to `docs/audits/`, and summarizes findings. Never edit a page
or change a grade — report only; flag `[HUMAN-GATE]` findings for the owner.
