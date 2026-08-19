# CHK-E6 — bucket ratification packet, all 31 remedies

**For the owner to ratify, amend, or reject — per remedy. No bucket has been written to any
file.** `bucket:` is `null` on all 31 and stays that way until each line below is signed off.
CLAUDE.md is unconditional: *no agent assigns or changes an evidence bucket.* This document is
the proposal that makes a human decision fast; it is not the decision.

Assessed against the rubric ratified today (CHK-E1) and the four-bucket definitions in RULES.md.
**Safety is not in this table** except as a reminder column — it never moves a bucket in either
direction.

---

## The finding that should drive this: 16 of 31 are not gradable yet

A remedy's bucket depends on what its papers **found**, which lives in `effectDirection` +
`sampleSize`. Only **20 of 65** sleep-outcome sources carry those yet (CHK-E2's second half is
unfinished). For 16 remedies that means **zero verifiable results** — not because the science is
absent, but because we haven't finished reading the papers.

**Grading those 16 now would encode our own data backlog as a verdict about the remedy.** The
clearest case is **CBT-I**: three systematic reviews and two clinical guidelines, the
best-evidenced insomnia treatment there is — and it would currently score "not properly tested
for sleep", which is false. That is the exact failure the four-bucket model exists to prevent.

**Recommendation: grade the 15 below in Group A and B now; finish CHK-E2 for the other 16
first.**

---

## Group A — confident, grade now (4)

No paper measured a sleep outcome. "Not properly tested for sleep" is precisely and
uncontroversially true, and it is the bucket that exists for exactly this.

| Remedy | Cited | Measured sleep | Proposed | Why | Safety |
|---|---|---|---|---|---|
| **kava** | 3 | 0 | `unknown` | All 3 read; none measured sleep. They are about the liver and about anxiety. | serious |
| **reishi** | 8 | 0 | `unknown` | 8 papers, none with a human sleep outcome; the two sleep papers are in rats. | serious |
| **taurine** | 5 | 0 | `unknown` | All 5 read; none measured sleep. | caution |
| **magnolia-bark** | 2 | 0 | `unknown` | Human trial measured cortisol and mood; the sleep paper is in rodents. | caution |

## Group B — proposed, contestable, grade now if you accept the reasoning (11)

These have at least one verifiable result. **Two house rules bite here:** the rubric caps
industry-designed trials at *middling* unless independently replicated, and the standing
preference is to **grade down on a coin-flip when the evidence is manufacturer-only or
unreplicated**.

| Remedy | c/s/v | Verifiable found | Proposed | Why | Safety |
|---|---|---|---|---|---|
| **melatonin** | 8/5/3 | 3 helped | **`works`** | Three independent meta-analyses, all positive, all verifiable. Effect is modest (~7 min) but consistent — which is what this bucket says. | caution |
| **saffron** | 7/5/3 | 3 helped | `maybe` | All positive, but the positive trials substantially involve the affron extract's own manufacturer. Graded down per the unreplicated/manufacturer rule. | caution |
| **ashwagandha** | 4/2/2 | 2 helped | `maybe` | A meta-analysis of 5 RCTs (n=400) found a *small but significant* effect, plus one n=60 insomnia RCT. Real, small, thin base. | caution |
| **magnesium** | 4/2/2 | 2 helped | `maybe` | ~17 min faster onset pooled, and a modest ISI improvement — but the review itself calls the literature "substandard". | caution |
| **l-theanine** | 2/2/2 | 2 helped | `maybe` | Both positive, but only two papers total and one is in boys with ADHD. Very thin. | caution |
| **lemon-verbena** | 4/3/2 | 2 helped | `maybe` | Both positive; both small and manufacturer-linked (the rubric's own worked example). Graded down. | caution |
| **valerian** | 5/4/2 | 1 helped, 1 no clear effect | `maybe` | Genuinely mixed: one meta-analysis positive but flagged for publication bias, one finding no difference on any of thirteen measures. **Closest call in the table — `unknown` is defensible.** | caution |
| **chamomile** | 2/2/1 | 1 no clear effect | `maybe` | The one verifiable trial was equivocal on sleep; a meta-analysis found a sleep-quality benefit but reports no N so it isn't verifiable. **Close call.** | caution |
| **apigenin** | 5/1/1 | 1 no clear effect | `unknown` | Isolated apigenin has never been tested for sleep at any dose; the one sleep trial is whole chamomile extract, ~1% apigenin. | caution |
| **iron** | 7/1/1 | 1 no clear effect | `unknown` | The Cochrane review measured sleep and found no difference — but on 3 studies / 128 people, as a secondary outcome. Too thin to call it *tested and failed*. **Contestable: see note.** | serious |
| **bacopa** | 7/1/1 | 1 didn't help | **`avoid`** | One well-run RCT (n=100) took the Bergen Insomnia Scale as its **primary** outcome and found no benefit. **The most contestable call here** — see note. | caution |

### The two calls worth arguing about

**bacopa → `avoid`.** RULES.md says the bottom bucket "requires papers that measured sleep and
found no effect" — plural. Bacopa has *one*. Calling it `unknown` understates that a proper test
was run and failed; calling it `avoid` rests the site's harshest grade on a single trial. I lean
`avoid` because the trial was well-designed, adequately sized, and negative on its *primary*
sleep endpoint — but `unknown` is a legitimate reading and this is your call, not mine.

**iron → `unknown`.** Iron has genuine evidence for restless legs; it does not have evidence for
sleep as such, and its one sleep analysis was null and thin. `unknown` says "not properly tested
for sleep", which is accurate. Anyone reading it as "iron does nothing" would be misreading —
worth checking the page copy makes the RLS distinction clear.

## Group C — do NOT grade yet (16)

Every one has papers that measured sleep and **no verifiable results**, because their effect data
is unfilled. Grading them now grades our backlog.

`jujube` (4 sleep papers) · `tart-cherry` (4) · `vitamin-d` (4) · `zinc` (4) · `cbd` (3) ·
**`cbt-i` (3)** · `hops` (3) · `cbn` (2) · `glycine` (2) · `l-tryptophan` (2) · `5-htp` (1) ·
`gaba` (1) · `lavender` (1) · `lemon-balm` (1) · `passionflower` (1) · `skullcap` (1)

**CBT-I is the proof of the point.** It is the first-line treatment for chronic insomnia in two
clinical guidelines, and on today's data it would grade "not properly tested for sleep". Finish
its effect data and it is a strong candidate for `works` — plausibly the only one besides
melatonin.

---

## What ratification looks like

Reply per group, or per remedy where you differ. On sign-off I will write `bucket:` plus
`ratifiedBy` and `ratifiedAt` for exactly the lines you approve, leave the rest `null`, and the
"grade in review" state keeps carrying the ungraded ones honestly — it is built for this.
