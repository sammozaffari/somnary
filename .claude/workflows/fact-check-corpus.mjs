export const meta = {
  name: 'fact-check-corpus',
  description: 'Corpus fact-check: deterministic gates, then claim↔source verification with adversarial refutation; writes a dated audit report to docs/audits/',
  whenToUse: 'Audit all remedies (or args {slugs:[...]} for a subset) for citation rot and claim↔source drift. Design: docs/plans/2026-07-21-fact-check-corpus-workflow-design.md',
  phases: [
    { title: 'Gates', detail: 'run the existing deterministic check-* scripts' },
    { title: 'Extract', detail: 'parse claims[] rows + resolve source ids per remedy' },
    { title: 'Verify', detail: 'fetch each source, judge support, refute every finding' },
    { title: 'Synthesize', detail: 'rank findings, write docs/audits/<date>-fact-check.md' },
  ],
}

// ---- args: {slugs?: string[], root?: string} or a bare array of slugs.
// Tolerate a JSON-encoded string (some invocation paths stringify args) so a
// scoped run actually scopes instead of silently auditing the whole corpus. ----
let a = args
if (typeof a === 'string') { try { a = JSON.parse(a) } catch { a = { slugs: a.split(',').map((s) => s.trim()).filter(Boolean) } } }
const requested = Array.isArray(a) ? a : (a && a.slugs) || []
const ROOT = ((a && !Array.isArray(a) && a.root) || '.').replace(/\/$/, '')

const NO_GIT = 'Never run git commands. Never edit any file unless this prompt explicitly names one to write.'

// ---- schemas: every hop is schema-forced; no freeform prose is parsed ----
const GATES_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          script: { type: 'string' },
          passed: { type: 'boolean' },
          failures: { type: 'array', items: { type: 'string' } },
        },
        required: ['script', 'passed', 'failures'],
      },
    },
    slugs: { type: 'array', items: { type: 'string' } },
  },
  required: ['results', 'slugs'],
}

const CLAIMS_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          claimed: { type: 'string' },
          claim: { type: 'string' },
          sources: {
            type: 'array',
            items: {
              type: 'object',
              properties: { id: { type: 'string' }, title: { type: 'string' } },
              required: ['id', 'title'],
            },
          },
        },
        required: ['location', 'claimed', 'claim', 'sources'],
      },
    },
    skippedRows: { type: 'number' },
  },
  required: ['slug', 'claims', 'skippedRows'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['supported', 'overstated', 'unsupported', 'inaccessible'] },
    rationale: { type: 'string' },
    quote: { type: ['string', 'null'] },
    gradeRelevant: { type: 'boolean' },
  },
  required: ['verdict', 'rationale', 'quote', 'gradeRelevant'],
}

const REFUTE_SCHEMA = {
  type: 'object',
  properties: { refuted: { type: 'boolean' }, reason: { type: 'string' } },
  required: ['refuted', 'reason'],
}

const REPORT_SCHEMA = {
  type: 'object',
  properties: { reportPath: { type: 'string' }, summary: { type: 'string' } },
  required: ['reportPath', 'summary'],
}

// ---- prompts ----
const gatesPrompt = `You are the deterministic-gates runner for Somnary's fact-check audit. ${NO_GIT}
From the repo root ${ROOT}, run each of these with Bash and capture exit code + output:
1. node scripts/check-citations.mjs --online   (script: "check-citations --online")
2. node scripts/check-tokens.mjs               (script: "check-tokens")
3. node scripts/check-forbidden-framing.mjs    (script: "check-forbidden-framing")
4. node scripts/check-botanical-completeness.mjs (script: "check-botanical-completeness")
passed = exit code 0. For failures[], copy the script's own error lines verbatim (trim to the meaningful lines, max ~20 per script; empty array when passed). Do not interpret or editorialize — these are deterministic results.
Also list every remedy slug: the .mdx basenames in ${ROOT}/src/content/remedies (exclude files starting with "_"). Return via StructuredOutput.`

const extractPrompt = (slug) => `You are the claim extractor for Somnary's fact-check audit of "${slug}". ${NO_GIT}
Read ${ROOT}/src/content/remedies/${slug}.mdx. In the frontmatter, each claims[] row has {claimed, studiesShow, sources:[n,...]} where n indexes the frontmatter sources[] array (matching its "n" field).
For every row where studiesShow is non-null AND sources is non-empty, emit one claim unit:
- location: "claims[<zero-based row index>]"
- claimed: the row's "claimed" text
- claim: the row's "studiesShow" text VERBATIM — this is the page's evidence assertion to be verified
- sources: for each referenced n, {id, title} where id prefers pmid ("pmid:12345678"), else doi ("doi:10.xxxx/..."), else registry ("registry:NCT...")
Rows with null studiesShow or no sources are deliberate myth-buster rows: count them in skippedRows, do not emit them. Extract only — do not judge, paraphrase, or fix anything. Return via StructuredOutput.`

const verifyPrompt = (slug, c) => `You are a citation verifier for Somnary ("${slug}"). Your job is the citation-auditor contract: does the cited source support the page's assertion AS WRITTEN? ${NO_GIT}
Page assertion (about the myth "${c.claimed}"):
"""${c.claim}"""
Cited source(s): ${c.sources.map((s) => `${s.id} — ${s.title}`).join('; ')}
Fetch each source yourself with WebFetch using the canonical URL: pmid → https://pubmed.ncbi.nlm.nih.gov/<id>/ ; doi → https://doi.org/<id> ; registry → https://clinicaltrials.gov/study/<id>. One retry per URL at most; if a source still cannot be read, do not guess at its content.
Rule exactly one verdict:
- supported: the source(s), jointly, say what the assertion says. REQUIRES quote = a verbatim passage from a fetched source that carries the assertion's key numbers/conclusions. No quote, no "supported".
- overstated: source is real and related but weaker than the assertion (e.g. assertion implies significance the source doesn't show, or drops the source's caveats).
- unsupported: source does not address or contradicts the assertion.
- inaccessible: could not read enough of any cited source to judge. quote = null.
rationale: 1–2 sentences, specific. gradeRelevant: true if this verdict, were the finding real, could bear on the remedy's evidence-tier grade (efficacy claims usually yes; tolerability phrasing usually no). Return via StructuredOutput.`

const refutePrompt = (slug, c, v, angle) => `You are an adversarial refuter for Somnary's fact-check audit. A verifier flagged a finding on "${slug}"; your ONLY job is to try to KILL it. ${angle} If you cannot decisively refute it, refuted stays false — but default to refuted=true when genuinely uncertain.
Finding: the page's assertion was ruled "${v.verdict}".
Page assertion: """${c.claim}"""
Source(s): ${c.sources.map((s) => `${s.id} — ${s.title}`).join('; ')}
Verifier's rationale: ${v.rationale}
Verifier's quote: ${v.quote || '(none)'}
Fetch the source(s) yourself (canonical URLs: pubmed.ncbi.nlm.nih.gov/<pmid>/, doi.org/<doi>, clinicaltrials.gov/study/<nct>) and check whether the verifier misread, quote-mined, missed a section (full text vs abstract), or misjudged the assertion's actual strength. refuted=true means the finding is WRONG and the page's assertion is fine as written. reason: 1–2 specific sentences. ${NO_GIT} Return via StructuredOutput.`

// ---- phase 1: deterministic gates ----
phase('Gates')
const gates = await agent(gatesPrompt, { label: 'deterministic-gates', schema: GATES_SCHEMA, effort: 'low' })
if (!gates) throw new Error('gates agent failed — aborting; nothing was audited')
const failedGates = gates.results.filter((r) => !r.passed)
log(`Gates: ${gates.results.length - failedGates.length}/${gates.results.length} passed${failedGates.length ? ` — FAILED: ${failedGates.map((r) => r.script).join(', ')}` : ''}`)

const unknown = requested.filter((s) => !gates.slugs.includes(s))
if (unknown.length) throw new Error(`unknown slug(s): ${unknown.join(', ')}`)
const targets = requested.length ? requested : gates.slugs

// ---- phases 2+3: waves of 3 remedies; ≤3 concurrent verifiers per remedy ----
const WAVE = 3
const CLAIM_CHUNK = 3
const perRemedy = []

for (let i = 0; i < targets.length; i += WAVE) {
  const wave = targets.slice(i, i + WAVE)
  log(`Wave ${i / WAVE + 1}/${Math.ceil(targets.length / WAVE)}: ${wave.join(', ')}`)

  const results = await pipeline(
    wave,
    (slug) => agent(extractPrompt(slug), { label: `extract:${slug}`, phase: 'Extract', schema: CLAIMS_SCHEMA, effort: 'low' }),
    async (extracted, slug) => {
      if (!extracted) return { slug, status: 'not-audited', skippedRows: 0, checked: [] }

      const checked = []
      for (let j = 0; j < extracted.claims.length; j += CLAIM_CHUNK) {
        const chunk = extracted.claims.slice(j, j + CLAIM_CHUNK)
        const verdicts = await parallel(
          chunk.map((c) => () =>
            agent(verifyPrompt(slug, c), { label: `verify:${slug}:${c.location}`, phase: 'Verify', schema: VERDICT_SCHEMA })
              .then((v) => ({ claim: c, verdict: v }))
          )
        )
        checked.push(...verdicts.filter(Boolean))
      }

      // adversarial refutation of every overstated/unsupported verdict (2 lenses)
      for (const item of checked) {
        const v = item.verdict
        if (!v || v.verdict === 'supported' || v.verdict === 'inaccessible') continue
        const votes = await parallel([
          () => agent(refutePrompt(slug, item.claim, v, 'Lens: misreading — did the verifier misread or quote-mine the source?'),
            { label: `refute:${slug}:${item.claim.location}:a`, phase: 'Verify', schema: REFUTE_SCHEMA }),
          () => agent(refutePrompt(slug, item.claim, v, 'Lens: strength — is the page assertion actually calibrated to what the source shows?'),
            { label: `refute:${slug}:${item.claim.location}:b`, phase: 'Verify', schema: REFUTE_SCHEMA }),
        ])
        const usable = votes.filter(Boolean)
        const refutedCount = usable.filter((r) => r.refuted).length
        item.refuters = usable
        // a dead refuter counts as not-refuted: findings die only by real votes
        item.status = refutedCount === usable.length && usable.length > 0 ? 'dropped'
          : refutedCount > 0 ? 'contested' : 'confirmed'
      }

      const findings = checked.filter((x) => x.status === 'confirmed' || x.status === 'contested').length
      log(`${slug}: ${extracted.claims.length} claims checked, ${findings} finding(s)`)
      return { slug, status: 'audited', skippedRows: extracted.skippedRows, checked }
    }
  )
  perRemedy.push(...results.map((r, k) => r || { slug: wave[k], status: 'not-audited', skippedRows: 0, checked: [] }))
}

// ---- phase 4: synthesize (barrier: needs every result) ----
phase('Synthesize')
const dropped = perRemedy.flatMap((r) => r.checked.filter((c) => c.status === 'dropped'))
log(`Verification done: ${perRemedy.length} remedies, ${dropped.length} finding(s) killed by refuters`)

const report = await agent(
  `You are the synthesis writer for Somnary's fact-check audit. ${NO_GIT}
Get today's date with Bash (date +%F), then write the report to ${ROOT}/docs/audits/<date>-fact-check.md (create the directory if needed). That file is the ONLY file you may write.
Full results JSON (statuses: confirmed/contested findings are reportable; "dropped" were killed by refuters and appear only in Method counts; verdict "inaccessible" is its own info bucket, never a guessed finding):
${JSON.stringify({ gates: gates.results, remedies: perRemedy }, null, 1)}
Report structure (severity: deterministic gate failure = high, unsupported = high, overstated = medium, inaccessible = low/info):
1. "# Somnary corpus fact-check — <date>" then a corpus scorecard table: remedies audited / not-audited, claims checked, supported, findings by severity, inaccessible sources, myth-buster rows skipped. One line per zero-finding remedy (name + "N claims, all supported").
2. Any deterministic gate failures first, tagged "deterministic (CI-breaking)", with the verbatim failure lines.
3. One "## <remedy>" section ONLY for remedies with confirmed/contested findings or not-audited status. Per finding: the page assertion as written, source id + title, verdict + severity, the verifier's rationale, the quote if any, refuter votes (e.g. "refuters: 0/2 refuted" or "contested — 1/2"). Append " **[HUMAN-GATE]**" to any finding whose gradeRelevant is true — those may bear on a tier grade and only the owner rules on grades.
4. "## Method" footer: what ran (gates list, waves of ${WAVE} remedies, ${CLAIM_CHUNK} concurrent verifiers per remedy, 2 adversarial refuters per finding), counts of dropped findings, inaccessible sources by remedy, and any not-audited remedies with the note that a re-run can target them via args {slugs:[...]}. No silent truncation: every skipped or unverifiable item must be counted somewhere.
Style: factual, terse, no hedging boilerplate. Return {reportPath, summary} via StructuredOutput — summary is 3-5 sentences a human reads in chat.`,
  { label: 'write-report', phase: 'Synthesize', schema: REPORT_SCHEMA }
)

const scorecard = {
  remediesAudited: perRemedy.filter((r) => r.status === 'audited').length,
  remediesNotAudited: perRemedy.filter((r) => r.status === 'not-audited').map((r) => r.slug),
  claimsChecked: perRemedy.reduce((n, r) => n + r.checked.length, 0),
  supported: perRemedy.reduce((n, r) => n + r.checked.filter((c) => c.verdict && c.verdict.verdict === 'supported').length, 0),
  confirmedFindings: perRemedy.reduce((n, r) => n + r.checked.filter((c) => c.status === 'confirmed').length, 0),
  contestedFindings: perRemedy.reduce((n, r) => n + r.checked.filter((c) => c.status === 'contested').length, 0),
  droppedByRefuters: dropped.length,
  gateFailures: failedGates.map((r) => r.script),
}

return { scorecard, reportPath: report ? report.reportPath : null, summary: report ? report.summary : 'synthesis agent failed — findings JSON is in the workflow return value', remedies: perRemedy }
