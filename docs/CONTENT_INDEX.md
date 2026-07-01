# somnary — Content Index Seed (CHK-0.6 / Phase 3 research runway)

> **For Claude Code & the editor:** This seeds the content index. It is the worklist for Phase 3 (launch catalog) and later Phase 8 (expansion) + Phase 6 (interventions). It also feeds the search index (aliases/latin names are search fields).
>
> **CRITICAL — provisional tiers are NOT grades.** The `prov. tier` column is a *research starting hypothesis* to prioritize work, NOT a published grade. The real grade is assigned only after the source-first, two-pass process (PLAN §9): pull the meta-analyses/RCTs, read them, grade against the rubric, second-pass verify. A provisional tier may move up or down once the evidence is actually read — that's the process working, not a mistake. **Never ship a `prov. tier` to the live site as the grade.** The live grade comes from the remedy's own researched, cited page.
>
> **Status vocabulary:** `not-started` → `researching` (pulling sources) → `drafting` → `cited` (all claims sourced, PMIDs/DOIs resolve) → `reviewed` (second-pass grade lock) → `live`.
>
> **Machine mirror:** the machine-readable mirror is `src/data/content-index.json` (validated by `src/lib/content-index.ts`) with columns: `slug, name, aliases, latin, category, plannedTier (= prov_tier), researchStatus (= status), sourceCount, sourceTarget (= source_target), notes`. The build reads it for the content index + progress stats; this .md is the human-readable source.

---

## How to use the "research pointer" per row
Each entry names the **highest-value evidence to pull first** (meta-analyses/systematic reviews/Cochrane before RCTs, per the source hierarchy). Start there; the grade follows the evidence. Where I've noted a known landmark study, verify its PMID/DOI resolves and that it says what's claimed before citing (0 hallucinated cites).

---

# PHASE 3 — Launch catalog (~25–30, do these first)

## Group A/B — strongest evidence (build first; best SEO, anchor the tier board)

### melatonin — LIVE ✓ (tier A) — reference template
- aliases: n-acetyl-5-methoxytryptamine · latin/chem: melatonin
- category: hormone / circadian
- status: **live** · 8 cites verified
- (already built — CHK-2.1)

### magnesium
- slug: `magnesium` · aliases: mg, magnesium glycinate, magnesium bisglycinate, magnesium L-threonate, magnesium oxide, magnesium citrate
- category: mineral
- **prov. tier: B** (defensible after quick check — see notes)
- status: not-started
- source target: Mah & Pitre 2021 meta-analysis (BMC Complement Med Ther, PMID 33865376 — ~17 min SOL reduction, but GRADE low/n=151) · Schuster 2025 bisglycinate RCT (DOI 10.2147/NSS.S524348, n=155, ISI −3.9 vs −2.3, d=0.2, small) · Hausenblas 2024 L-threonate RCT (Sleep Med X, DOI 10.1016/j.sleepx.2024.100121)
- notes: **the honesty test case.** meta-analysis exists but small & low-quality; effect real but modest; form matters hugely (glycinate/threonate vs oxide bioavailability — §3.2 killer). B, not A. Claims-vs-data: "cures insomnia" → modest ISI/SOL improvement in poor sleepers, low-certainty evidence.

### L-theanine
- slug: `l-theanine` · aliases: theanine, L-γ-glutamylethylamide, Suntheanine
- category: amino acid
- **prov. tier: B**
- status: not-started
- source target: RCTs on 200–400mg for sleep quality/relaxation (Rao 2015; Hidese 2019 4-week RCT) · note most trials are anxiety/relaxation-adjacent, sleep is secondary outcome
- notes: good safety, plausible mechanism (alpha-waves, no sedation). Honest caveat: sleep is often a secondary endpoint; effect is on subjective quality/latency, not a knockout. Dose-match usually fine.

### ashwagandha
- slug: `ashwagandha` · aliases: withania somnifera, indian ginseng, winter cherry, KSM-66, Shoden
- category: botanical (adaptogen)
- **prov. tier: B**
- status: not-started
- source target: Cheah 2021 systematic review/meta-analysis on sleep (PMID ~34559859) · Langade 2019/2020 RCTs (root extract, 600mg) · standardization = withanolide %
- notes: §3.2 standardization is central — KSM-66/Shoden are standardized; generic "ashwagandha 500mg" often isn't. Meta-analysis exists → could reach B/borderline. Safety: liver-injury case reports (rare) + thyroid/pregnancy cautions → SafetyCallout sev-caution, note hepatotoxicity signal.

### tart cherry
- slug: `tart-cherry` · aliases: montmorency cherry, prunus cerasus, tart cherry juice, CherryPharm
- category: food/botanical
- **prov. tier: B/C**
- status: not-started
- source target: Losso 2018 pilot RCT (insomnia, n=8 — tiny) · Howatson 2012 (melatonin content + sleep) · pooled reviews on tart cherry & sleep
- notes: mechanism = actual melatonin + tryptophan/anti-inflammatory. Human trials are SMALL — honest B/C. Dose-match: juice vs concentrate vs capsule varies wildly.

### glycine
- slug: `glycine` · aliases: aminoacetic acid, 2-aminoacetic acid
- category: amino acid
- **prov. tier: B/C**
- status: not-started
- source target: Yamadera 2007 & Inagawa 2006 (3g before bed, subjective sleep quality, polysomnography — small Japanese RCTs, some industry-linked) · Bannai/Kawai work
- notes: decent mechanism (core body temp drop via peripheral vasodilation). Trials small and few, some funded by Ajinomoto → note conflict. B if trials hold, C if replication thin.

## Group C — mixed / popular beyond evidence

### valerian
- slug: `valerian` · aliases: valeriana officinalis, valerian root, valerenic acid
- category: botanical
- **prov. tier: C**
- status: not-started
- source target: Bent 2006 systematic review (Am J Med — mixed, methodological problems) · Cochrane-adjacent reviews · Fernández-San-Martín 2010 meta-analysis
- notes: classic "popular > evidence." Meta-analyses exist but heterogeneous, high risk of bias, inconsistent. §3.2 standardization (valerenic acid) all over the place. Honest C — the site's credibility depends on NOT giving this a B just because it's famous.

### lemon balm
- slug: `lemon-balm` · aliases: melissa officinalis
- category: botanical
- **prov. tier: C/D**
- status: not-started
- source target: Cases 2011 (anxiety+sleep, small) · often studied in combination (with valerian) → confounded
- notes: mostly combination trials → hard to isolate. Thin. C/D.

### GABA
- slug: `gaba` · aliases: gamma-aminobutyric acid, PharmaGABA
- category: amino acid / neurotransmitter
- **prov. tier: C/D**
- status: not-started
- source target: small RCTs (Byun 2018 latency) · the oral bioavailability / blood-brain-barrier question is the crux
- notes: big mechanistic controversy — does oral GABA even cross the BBB? Lead with that honesty. C at best; the "does it reach the brain" debate is the story.

### 5-HTP
- slug: `5-htp` · aliases: 5-hydroxytryptophan, oxitriptan, griffonia simplicifolia
- category: amino acid / precursor
- **prov. tier: C**
- status: not-started
- source target: sleep RCTs sparse; often combined with GABA · serotonin-syndrome interaction risk is the key safety item
- notes: SAFETY-heavy page — serotonergic interaction risk (SSRIs/MAOIs), EMS historical concern. sev-caution or sev-serious depending. Efficacy evidence thin → C, safety flag prominent.

### magnolia bark
- slug: `magnolia-bark` · aliases: magnolia officinalis, houpu, honokiol, magnolol
- category: botanical (TCM)
- **prov. tier: C/D**
- status: not-started
- source target: mostly preclinical (honokiol GABA-A modulation); human sleep RCTs scarce
- notes: strong mechanism, weak human data → likely D unless human trials found. Menopause-combination trials exist (confounded).

### L-tryptophan
- slug: `l-tryptophan` · aliases: tryptophan, TRP
- category: amino acid / precursor
- **prov. tier: B/C**
- status: not-started
- source target: older meta-analyses (1980s, 1g+ for latency) · EMS/contamination history (safety)
- notes: actually has older RCT support for sleep latency → could be B, but data is dated + EMS safety history (1989 contamination) needs a clear safety note.

### apigenin / chamomile
- slug: `chamomile` · aliases: matricaria chamomilla, apigenin, chamomile tea, german chamomile
- category: botanical
- **prov. tier: C/D**
- status: not-started
- source target: Zick 2011 (chamomile extract RCT, modest) · Chang 2016 (postnatal women) · apigenin mechanism preclinical
- notes: chamomile as tea (cultural) vs apigenin as isolated compound — separate the two. Human RCTs small/modest. C/D.

## Group D — weak / claims outrun data

### passionflower
- slug: `passionflower` · aliases: passiflora incarnata, maypop
- category: botanical
- **prov. tier: D**
- status: not-started
- source target: Ngan 2011 (tea, small) · mostly small/combination
- notes: popular in "sleep blends," minimal standalone human data → D. Honest example of a D done well.

### hops
- slug: `hops` · aliases: humulus lupulus
- category: botanical
- **prov. tier: D**
- status: not-started
- source target: almost always studied WITH valerian → confounded; standalone data scarce
- notes: the valerian-hops combination confound is the whole story. D standalone.

### lavender (oral + aromatherapy)
- slug: `lavender` · aliases: lavandula angustifolia, silexan, lavender oil, lavender aromatherapy
- category: botanical / aromatherapy
- **prov. tier: C/D** (split: Silexan oral has better data than aromatherapy)
- status: not-started
- source target: Silexan (oral lavender oil) anxiety RCTs (Kasper) — decent but anxiety-primary · aromatherapy sleep trials = weaker/blinding-impossible
- notes: IMPORTANT to separate oral Silexan (real RCTs, anxiety→sleep) from aromatherapy (weak, unblindable). Could be two entries or one with a clear split. Honest treatment of a marketing-heavy category.

### skullcap
- slug: `skullcap` · aliases: scutellaria lateriflora, scutellaria baicalensis, baikal skullcap
- category: botanical
- **prov. tier: D**
- status: not-started
- source target: minimal human sleep data; note american vs chinese skullcap differ; hepatotoxicity reports (often adulteration)
- notes: D. Safety note re: liver (historically tied to germander adulteration).

### "sleep blends" (proprietary)
- slug: `sleep-blends` · aliases: proprietary sleep blend, sleep stack, sleep gummy blend
- category: category page / concept
- **prov. tier: D/F**
- status: not-started
- source target: N/A — this is a §3.2 proprietary-blend-penalty explainer page
- notes: not one ingredient — a concept page on WHY proprietary blends get downgraded (unfalsifiable dosing). High-value, differentiating. Links out to individual ingredients.

## Group F — caution / documented harm

### kava
- slug: `kava` · aliases: piper methysticum, kava kava, kavalactones
- category: botanical
- **prov. tier: F** (safety-driven, not efficacy-driven)
- status: not-started
- source target: hepatotoxicity literature (Teschke reviews) · anxiety RCTs (Pittler/Ernst — it DOES work for anxiety) · the efficacy-vs-safety tension is the story
- notes: UNUSUAL case — kava has REAL anxiolytic evidence but an F for documented hepatotoxicity + the fact it's used for sleep off the back of anxiety data. sev-serious SafetyCallout. This page proves the F tier isn't "doesn't work" — it's "risk outweighs / or no evidence." Model F entry.

### high-dose melatonin / melatonin in children
- slug: `melatonin-children` (or fold into melatonin page as a prominent section)
- category: safety context
- **prov. tier: caution context, not a separate remedy grade**
- status: not-started
- notes: likely a prominent safety section on the melatonin page + a standalone context page, NOT a separately-graded remedy. Accidental-ingestion/ER-visit data in kids, dosing purity problems (TGA found mislabeled melatonin — cite the TGA finding). Care around children.

---

# PHASE 8 — Expansion catalog (the long tail — after launch, ongoing)
Grade the niche honestly; D/F here is content, not filler. Provisional tiers omitted (research on demand).

- **Amino acids/precursors:** taurine · phenibut *(F — dependence/withdrawal, prominent)* · picamilon · theanine+caffeine combos
- **Minerals/vitamins:** zinc · vitamin D (sleep) · iron *(RLS context)* · calcium · potassium
- **Western botanicals:** california poppy · ziziphus/jujube · st john's wort *(interaction caution — CYP450/serotonergic)* · valerian-alternatives
- **TCM/Ayurvedic:** suanzaoren (ziziphus spinosa) · reishi (ganoderma) · schisandra · polygala · albizia · bacopa/brahmi · jatamansi (nardostachys) · shankhpushpi · tagara (indian valerian)
- **Cannabinoids:** CBD (sleep) · CBN · CBD:THC ratios *(legal/safety context, AU-specific)*
- **Other:** inositol · saffron/affron · kiwifruit · L-ornithine · PEA-luteolin · lactium/casein hydrolysate · glycine variants
- **The "probably not" file:** homeopathic sleep aids · "moon milk" · most gummy stacks · CBD-isolate-only products

---

# PHASE 6 — Interventions (non-supplement, same S–F rubric)
These often OUT-GRADE supplements — the thesis in action. First batch (CHK-6.2):

- **CBT-I** — slug `cbt-i` · **prov. tier: S/A** (first-line, strongest evidence in the whole catalog) · source: AASM guidelines, Cochrane, multiple meta-analyses. The likely single highest-graded thing on the site.
- **sleep restriction therapy** — prov. A · component of CBT-I with own RCT base
- **stimulus control** — prov. A/B · behavioral, good evidence
- **morning bright light** — prov. A/B · circadian, strong for phase/timing
- **temperature / warm bath before bed** — prov. B · the "warm bath effect" has real RCTs/meta-analysis (Haghayegh 2019)
- **paced breathing / slow breathing / 4-7-8** — prov. C/B · HRV/relaxation data
- **PMR (progressive muscle relaxation)** — prov. B · established relaxation evidence
- **white/pink noise** — prov. C · mixed, some positive; honest about weak/heterogeneous data
- **weighted blankets** — prov. C · small RCTs, anxiety-adjacent
- **sleep hygiene (standalone)** — prov. C · honest: weak AS A STANDALONE despite being everywhere
- **blue-light glasses (evening)** — prov. C/D · **honest downgrade** — evidence weaker than marketed; model "popular but overstated"

**Context pages (labeled, NOT graded as remedies):** when to see a doctor · sleep apnea/CPAP · RLS · Rx hypnotics overview (z-drugs, DORAs, sedating antihistamines) — educational, point to clinicians.

---

### Build tasks
- [x] Machine mirror lives in `src/data/content-index.json` (schema `src/lib/content-index.ts`); build reads it for stats + search. (This .md is the human source; no separate `_index.csv`.)
- [x] Wire the content index so home/methodology stat counts read from it (melatonin live).
- [ ] Each Phase 3 remedy: `researching → cited → reviewed → live`, provisional tier replaced by researched grade.
- [ ] Aliases + latin names populate the search index (Phase 4).
