export const meta = {
  name: 'design-qa',
  description: 'Design QA gate for the current branch: scope to the diff, run the static gates and the read-only reviewers, and merge ranked findings into qa/pr-findings.md. Report only — never fixes.',
  whenToUse: 'Run on any branch that touches UI, chrome, templates, tokens, or user-facing copy before opening/merging a PR. Re-run after fixes to re-verify.',
  phases: [
    { title: 'Scope', detail: 'diff -> changed files, routes, and which gates apply' },
    { title: 'Static gates', detail: 'token linter, crawlability, forbidden-framing, citations (as applicable)' },
    { title: 'Review', detail: 'design-guardian + compliance-reviewer + citation-auditor, scoped to the diff, read-only' },
    { title: 'Merge', detail: 'rank P0-P3 with evidence + fix; write qa/pr-findings.md + a paste-ready PR comment' },
  ],
};

// -----------------------------------------------------------------------------
// Design QA on every PR — Somnary's saved gate.
//
// Modelled on agenticdesign.school's "Design QA on Every PR": scope the review to
// the branch diff, fan out READ-ONLY reviewers, and merge ranked findings the
// author can act on. Every finding must carry file:line + the offending value +
// severity (P0-P3) + concrete fix + evidence — the Brief->Generate->CRITIQUE->
// Revise->Ship loop, with critique as a first-class step (see the memory note
// "agentic-design-operating-loop" and CLAUDE.md "Operating loop & review gate").
//
// What this gate PROVES: token discipline, crawlability, forbidden-framing,
// citation integrity, and a design/compliance read of the changed surfaces.
// What it CANNOT prove: that the rendered pixels are right at every width. Somnary
// has no headless screenshot tool checked in (adding Playwright is a new-dependency
// HUMAN-GATE), so the RENDERED-VISUAL pass is a documented Chrome-MCP step in
// qa/README.md — run it by hand for any chrome/layout change and paste the result
// into the findings. This script honestly reports that the visual pass is manual
// rather than pretending it ran. Silence is never treated as success.
// -----------------------------------------------------------------------------

const FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'line', 'severity', 'summary', 'fix', 'evidence'],
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          severity: { type: 'string', enum: ['P0', 'P1', 'P2', 'P3'] },
          summary: { type: 'string', description: 'one sentence: the defect + the offending value' },
          fix: { type: 'string', description: 'the concrete change that resolves it' },
          evidence: { type: 'string', description: 'quote, token name, computed ratio, or capture path' },
        },
      },
    },
  },
};

const BASE = 'origin/main';

phase('Scope');
// The diff is the scope. A gate that checks everything blocks everything.
const scope = await agent(
  `You are scoping a design-QA run. Do NOT review anything yet.\n` +
    `1. Run: git fetch origin --quiet; git diff ${BASE}...HEAD --name-only\n` +
    `2. Read qa/pages-map.json.\n` +
    `Classify the changed files and decide which gates apply. Return JSON with:\n` +
    `- changedFiles: string[]\n` +
    `- uiFiles: string[] (anything under src/ that renders or styles UI: .astro, .css, components, layouts, pages)\n` +
    `- copyFiles: string[] (files with user-facing prose/labels)\n` +
    `- contentFiles: string[] (remedy/decision/source content or data with health claims + citations)\n` +
    `- affectedRoutes: string[] (page files -> their routes; for shared chrome/layout/component files, pull the representative routes from qa/pages-map.json.shared; dedupe)\n` +
    `- touchesChrome: boolean (Nav/Footer/Base/global styles — flags the mandatory rendered-visual pass)\n` +
    `- uncovered: string[] (changed shared components with NO entry in pages-map.json.shared — report the gap, do not skip silently)`,
  {
    label: 'scope-diff',
    phase: 'Scope',
    schema: {
      type: 'object', additionalProperties: false,
      required: ['changedFiles', 'uiFiles', 'copyFiles', 'contentFiles', 'affectedRoutes', 'touchesChrome', 'uncovered'],
      properties: {
        changedFiles: { type: 'array', items: { type: 'string' } },
        uiFiles: { type: 'array', items: { type: 'string' } },
        copyFiles: { type: 'array', items: { type: 'string' } },
        contentFiles: { type: 'array', items: { type: 'string' } },
        affectedRoutes: { type: 'array', items: { type: 'string' } },
        touchesChrome: { type: 'boolean' },
        uncovered: { type: 'array', items: { type: 'string' } },
      },
    },
  },
);

if (!scope || scope.changedFiles.length === 0) {
  log('No changes vs ' + BASE + ' — nothing to QA.');
  return { findings: [], note: 'empty diff' };
}
log(`Scoped: ${scope.changedFiles.length} changed file(s), ${scope.affectedRoutes.length} route(s). touchesChrome=${scope.touchesChrome}.`);
if (scope.uncovered.length) log(`⚠ Uncovered shared components (extend qa/pages-map.json): ${scope.uncovered.join(', ')}`);

phase('Static gates');
// The repo's own verify:* scripts are the cheap, deterministic gates. Run only
// the ones the diff makes relevant; capture pass/fail + output as evidence.
const gatePlan = [
  { key: 'tokens', cmd: 'npm run -s verify:tokens', when: scope.uiFiles.length > 0 },
  { key: 'crawlability', cmd: 'npm run -s verify:crawl', when: scope.uiFiles.length > 0 || scope.contentFiles.length > 0 },
  { key: 'forbidden-framing', cmd: 'npm run -s verify:framing', when: scope.copyFiles.length > 0 || scope.contentFiles.length > 0 },
  { key: 'citations', cmd: 'npm run -s verify:cites', when: scope.contentFiles.length > 0 },
].filter((g) => g.when);

const gateResults = await parallel(
  gatePlan.map((g) => () =>
    agent(
      `Run exactly this command from the repo root and report the result. Do not change code.\n` +
        `Command: ${g.cmd}\n` +
        `Return JSON: { gate: "${g.key}", passed: boolean, summary: string (one line), output: string (the last ~25 lines, trimmed) }.`,
      { label: `gate:${g.key}`, phase: 'Static gates', effort: 'low',
        schema: { type: 'object', additionalProperties: false, required: ['gate', 'passed', 'summary', 'output'],
          properties: { gate: { type: 'string' }, passed: { type: 'boolean' }, summary: { type: 'string' }, output: { type: 'string' } } } },
    ),
  ),
);
const gates = gateResults.filter(Boolean);
log(`Static gates: ${gates.map((g) => `${g.gate}=${g.passed ? 'pass' : 'FAIL'}`).join(', ') || 'none applicable'}`);

phase('Review');
// Read-only reviewers, each scoped to the changed files. The author fixes; the
// review run never edits. Each returns evidence+severity+fix findings.
const reviewJobs = [];
if (scope.uiFiles.length) {
  reviewJobs.push(() =>
    agent(
      `Review ONLY these changed UI files for DESIGN_SYSTEM compliance (tokens-only, contrast per §8, ` +
        `grades legible without colour alone, no hidden disclaimers, no wellness clichés). Read-only — do not edit.\n` +
        `Files:\n${scope.uiFiles.join('\n')}\n\n` +
        `For every issue return file, line, severity (P0 breaks the page/safety; P1 brand colour or core spacing / contrast fail; ` +
        `P2 lesser token or spacing; P3 nit / needs-new-token), a one-sentence summary naming the offending value, a concrete fix, ` +
        `and evidence (the raw value, token name, or computed contrast ratio). Empty findings array if clean.`,
      { label: 'review:design', phase: 'Review', agentType: 'design-guardian', schema: FINDINGS_SCHEMA },
    ),
  );
}
if (scope.copyFiles.length || scope.contentFiles.length) {
  const files = [...new Set([...scope.copyFiles, ...scope.contentFiles])];
  reviewJobs.push(() =>
    agent(
      `Review ONLY these changed files for TGA/FDA/FTC-safe language, forbidden framings (no "take X tonight", ` +
        `"your ideal dose", "safe for you", diagnosis, treatment promises), disclaimer placement near decisions, and ` +
        `no invented stats/SLAs. Read-only — do not edit.\n` +
        `Files:\n${files.join('\n')}\n\n` +
        `Return findings with file, line, severity, summary (name the offending phrase), fix, and evidence (quote the phrase). ` +
        `Empty array if clean.`,
      { label: 'review:compliance', phase: 'Review', agentType: 'compliance-reviewer', schema: FINDINGS_SCHEMA },
    ),
  );
}
if (scope.contentFiles.length) {
  reviewJobs.push(() =>
    agent(
      `Audit ONLY these changed content files: every factual health claim must resolve to a real source ` +
        `(PMID/DOI/registry) AND the source must support the claim as written. Read-only.\n` +
        `Files:\n${scope.contentFiles.join('\n')}\n\n` +
        `Return findings with file, line, severity (P0 = unsupported/mis-cited claim), summary, fix, and evidence ` +
        `(the claim + what the source actually says). Empty array if every claim checks out.`,
      { label: 'review:citations', phase: 'Review', agentType: 'citation-auditor', schema: FINDINGS_SCHEMA },
    ),
  );
}
const reviews = (await parallel(reviewJobs)).filter(Boolean);
const reviewFindings = reviews.flatMap((r) => r.findings || []);
log(`Reviewers returned ${reviewFindings.length} finding(s).`);

phase('Merge');
// Turn gate failures + reviewer findings into gate-failure findings, then let one
// agent write the ranked report + a paste-ready PR comment. The rendered-visual
// pass is surfaced as an explicit REQUIRED-MANUAL item when chrome changed, so a
// clean automated run is never mistaken for a clean visual run.
const gateFailures = gates
  .filter((g) => !g.passed)
  .map((g) => ({ file: 'package.json', line: 0, severity: 'P1', summary: `Static gate '${g.gate}' failed`, fix: `Fix the violations then re-run \`${gatePlan.find((p) => p.key === g.gate)?.cmd || g.gate}\``, evidence: g.output.slice(0, 800) }));

const allFindings = [...gateFailures, ...reviewFindings];
const visualNote = scope.touchesChrome
  ? 'CHROME CHANGED — the rendered-visual + keyboard pass in qa/README.md is REQUIRED and has NOT run in this script. Capture the affected routes at 390/768/1440px and measure nav overflow before merge.'
  : 'No chrome/layout change detected — rendered-visual pass optional.';

const report = await agent(
  `Write qa/pr-findings.md for this design-QA run. Do NOT change any other file.\n\n` +
    `Inputs (JSON):\n${JSON.stringify({ scope: { changedFiles: scope.changedFiles, affectedRoutes: scope.affectedRoutes, touchesChrome: scope.touchesChrome, uncovered: scope.uncovered }, gates: gates.map((g) => ({ gate: g.gate, passed: g.passed, summary: g.summary })), findings: allFindings }, null, 2)}\n\n` +
    `Structure the file as:\n` +
    `1. A one-line verdict: BLOCK if any P0/P1 remains, else PASS-WITH-NOTES or CLEAN.\n` +
    `2. Findings ranked P0 -> P3, each as: **[Pn] file:line** — summary. _Fix:_ … _Evidence:_ …\n` +
    `3. A "Static gates" table (gate, pass/fail).\n` +
    `4. A "Rendered-visual pass" section containing verbatim: "${visualNote}"${scope.uncovered.length ? ` Also list uncovered files: ${scope.uncovered.join(', ')}.` : ''}\n` +
    `5. A fenced "PR comment" block: a tight paste-ready summary for \`gh pr comment --body-file qa/pr-findings.md\`.\n` +
    `Write the file with the Write tool, then return a 2-line summary (verdict + counts).`,
  { label: 'merge:report', phase: 'Merge', effort: 'medium' },
);

const p0p1 = allFindings.filter((f) => f.severity === 'P0' || f.severity === 'P1').length;
log(`Wrote qa/pr-findings.md — ${allFindings.length} finding(s), ${p0p1} blocking (P0/P1). ${scope.touchesChrome ? 'Rendered-visual pass still required.' : ''}`);
return { verdict: p0p1 > 0 ? 'BLOCK' : 'PASS-WITH-NOTES', findings: allFindings, gates, report };
