# AI Product, Research, And Recommendation Framework

## AI Position

Somnary should use AI to make the reviewed evidence more usable, not to generate free-form health advice.

The product principle:

> AI may explain the corpus. AI may not exceed the corpus.

## What AI Should Do

AI is useful for:

- summarizing a remedy page in plain English;
- comparing two remedies using Somnary evidence gates;
- explaining why a claim did or did not pass;
- translating effect sizes into user-readable meaning;
- routing safety concerns to the right boundary page;
- helping editors find missing source support;
- generating draft content that a human fact-checks;
- finding where a new study might affect an existing grade.

## What AI Should Not Do

AI should not:

- diagnose insomnia, sleep apnea, anxiety, depression, or other conditions;
- provide personalized dosage instructions;
- tell a user what to take;
- combine supplements into a stack;
- downplay safety signals;
- cite papers that have not been verified;
- answer from the open web without a review layer;
- change a grade without human editorial review.

## AI Assistant Design

Recommended assistant types:

1. Page assistant
   - answers only from the current remedy page and its cited sources.

2. Compare assistant
   - compares two or three remedies by Somnary grade, effect size, safety boundary, and evidence gates.

3. Label assistant
   - parses a Supplement Facts panel and flags missing dose, proprietary blends, high melatonin, CBD/THC risk, and standardization gaps.

4. Research assistant for editors
   - helps monitor new trials, guideline updates, retractions, and source conflicts.

## Response Structure

Every AI answer should use this structure:

- Bottom line
- What Somnary's reviewed evidence says
- What is uncertain
- Safety boundary
- Source links
- “This is educational, not medical advice” boundary when relevant

## Refusal And Routing Rules

Refuse or route when the user asks:

- “What should I take?”
- “How much should I give my child?”
- “Can I mix this with my medication?”
- “Do I have insomnia/sleep apnea?”
- “Can I stop my prescription?”
- “I feel unsafe / self-harm / overdose / unrousable person.”

Routing destinations:

- clinician/pharmacist page;
- when-to-see-a-doctor page;
- emergency/poison/crisis resources;
- specific safety page.

## Competitive Advantage Against Generic AI

Generic AI advantages:

- fast;
- conversational;
- broad;
- can synthesize general information.

Generic AI weaknesses:

- may hallucinate citations;
- may blur evidence quality;
- may personalize beyond safe boundaries;
- may reflect supplement-marketing language;
- usually has no public editorial method or correction log.

Somnary advantage:

- verified citations;
- visible S-F rubric;
- conflict-free editorial stance;
- explicit safety boundaries;
- public corrections;
- product-label skepticism;
- community anecdotes separated from evidence;
- no affiliate incentive to inflate weak remedies.

## Research Workflow

Use this workflow for every new remedy or grade change:

1. Define the claim exactly.
2. Define the sleep outcome being tested.
3. Search for systematic reviews and meta-analyses.
4. Search for randomized controlled trials.
5. Check population, dose, form, duration, and comparator.
6. Extract effect size, not only significance.
7. Check safety signals and interaction concerns.
8. Compare studied dose to market dose.
9. Apply evidence gates.
10. Draft the page.
11. Human verifies every citation.
12. Publish with review date.
13. Add to change log.

## AI Development Governance

Before shipping any AI feature, require:

- corpus boundary documented;
- retrieval citations visible;
- red-team prompts tested;
- medical-advice refusals tested;
- pediatric/pregnancy/medication-risk routing tested;
- hallucination rate measured;
- source coverage measured;
- legal review for high-risk flows;
- user feedback loop for wrong or unclear answers.

## AI Quality Metrics

Track:

- citation accuracy;
- unsupported claim rate;
- refusal correctness;
- safety-route correctness;
- user comprehension after answer;
- click-through to source page;
- correction submissions;
- editor review time saved.

The AI assistant should be considered successful only if it increases trust and comprehension without increasing medical-risk exposure.
