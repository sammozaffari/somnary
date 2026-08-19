# CHK-E5 — the sweetener standing rule does not survive its own citation

**`[HUMAN-GATE]` — a policy conflict between two binding documents, resting on a source that
doesn't support the stronger reading. Not resolved here; the evidence is below so it can be.**

## The conflict

**CLAUDE.md, additive policy** states a standing rule:

> Standing rule: non-sugar sweeteners are always at least "worth knowing" in daily-use products
> (WHO 2023 basis — verify and cite properly; currently a placeholder).

**`src/data/additive-watchlist.yaml`** — the sourced editorial artefact CHK-E5 is seeded from —
states the opposite, in a section headed EXPLICIT EXCLUSION:

> High-intensity artificial sweeteners (sucralose, acesulfame-K, aspartame, etc.) do not appear
> on this watchlist. Where a brand markets a product with fear-based or false "no nasty
> sweeteners" claims, that dishonesty is penalised under the Marketing honesty dimension — not
> here. […] never for "sweetener toxicity".

Both are ratified. They cannot both be implemented.

## What the WHO 2023 guideline actually says

CLAUDE.md asked for this to be verified rather than assumed, and the verification is the point:

- The recommendation is **"against the use of NSS to control body weight or reduce the risk of
  noncommunicable diseases."** It is about **weight control and disease risk** — not about the
  safety of a sweetener in a supplement.
- It is explicitly **conditional**, and WHO notes the evidence may be confounded, such that
  "policy decisions based on this recommendation may require substantive discussion in specific
  country contexts."
- It describes **"potential undesirable effects from long-term use"**. It does **not** conclude
  that non-sugar sweeteners are unsafe or harmful.

## Why this blocks implementation rather than merely informing it

The additive system's own rule is that **every non-neutral flag cites a paper that supports the
claim as written** — enforced in the schema (`superRefine`: a non-neutral flag without a source id
fails the build) and by the citation-auditor standard in CLAUDE.md.

Implementing the standing rule as written would attach a "worth knowing" flag to every sweetened
product, citing a guideline about **weight control** as the basis for a claim about **a nightly
supplement**. That is a citation that does not support its claim — the precise failure the flag
system was built to prevent. **So the rule cannot be shipped as written without breaking the rule
that makes flags trustworthy.**

## The three ways out, for the owner to choose

1. **Drop the standing rule.** Adopt the watchlist's position: sweeteners are not flagged;
   fear-based "no nasty sweeteners" marketing is penalised as marketing dishonesty. This is the
   position best supported by the evidence as it stands, and it is internally consistent with
   "colour states what's documented, nothing more".
2. **Keep a rule, but narrow it to what WHO said.** A "worth knowing" note is defensible if it
   states the actual finding — that WHO advises against non-sugar sweeteners *for weight control*
   on conditional, low-certainty evidence, and notes possible effects of long-term use — and does
   not imply the sweetener in that bottle is a documented concern. This needs the note's exact
   wording ratified, because the whole risk is in the phrasing.
3. **Keep the rule and find a source that carries it.** If the intent is a claim about daily
   ingestion specifically, it needs a source about daily ingestion specifically. None is cited
   today.

Option 2 is the narrowest change and the one that keeps a flag while making it true. Option 1 is
the most defensible on the evidence. **Either way this is an editorial and policy call, not an
engineering one, and it is the owner's.**

## Not affected

The rest of the watchlist is sound. All ten entries' identifiers resolve and their titles match
the claims they support — the Southampton additives trial (17825405) for azo dyes and sodium
benzoate, erythrosine carcinogenicity (2824305), trans fats and cardiovascular disease
(16611951), sugar alcohols and gastrointestinal disturbance (27840639, which is exactly the
dose-dependent tolerability claim it is cited for), EFSA on titanium dioxide
(10.2903/j.efsa.2021.6585) and on silicon dioxide (10.2903/j.efsa.2018.5088), and magnesium
stearate's lack of in-vitro toxicity (29090120) supporting a neutral entry.

No additive flag renders anywhere on the site today: no product carries `excipients[]` data yet
(that is CHK-E8). So nothing is currently mis-stated to a reader — this is a gate to clear before
that data lands, not a live defect.
