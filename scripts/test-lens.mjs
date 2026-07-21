#!/usr/bin/env node
/**
 * Lens engine foundation suite (CHK-7.1a) — the offline unit gate for the 7.1a retrieval + input +
 * citation layer. Drives the REAL modules with an INJECTED mock fetch (canned esearch/efetch
 * fixtures) so CI NEVER touches the network — the same style as scripts/test-ask.mjs / test-guide.mjs.
 *
 * Proves:
 *   citations.ts — a fabricated/malformed PMID & DOI are rejected; a real one yields the right
 *                  canonical URL; isResolvableId mirrors the resolver's "at least one valid id" rule.
 *   retrieval.ts — PubMedProvider parses PMIDs + titles + abstracts from canned XML; a bad PMID from
 *                  esearch is dropped; a malformed/empty/erroring fetch degrades to [] (no throw).
 *   input.ts     — a corpus remedy name short-circuits to /r/<slug>; an unlisted product/ingredient
 *                  classifies with NO shortCircuit; a pasted panel parses ingredient lines; hostile/
 *                  empty input is coerced safely.
 *
 *   node scripts/test-lens.mjs   # mock, deterministic — fully offline.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, 'src/content/remedies');

const imp = (rel) => import(pathToFileURL(join(ROOT, rel)).href);
const { isValidId, isResolvableId, parseCitation, canonicalUrl, canonicalUrlByKind } = await imp(
  'src/lib/lens/citations.ts',
);
const { PubMedProvider } = await imp('src/lib/lens/retrieval.ts');
const { normalizeLensInput, MAX_LENS_INPUT_LEN } = await imp('src/lib/lens/input.ts');
const { verifyClaims, quoteIsGrounded, parseVerdict, coerceVerdict, REFUTE_N, REFUTE_QUORUM, LENS_MAX_MODEL_CALLS } =
  await imp('src/lib/lens/verify.ts');
const { LENS_EXTRACT_PROMPT, LENS_REFUTE_PROMPT, LENS_EXTRACT_VERSION, LENS_REFUTE_VERSION, buildRefuteUserPrompt, buildExtractUserPrompt } =
  await imp('src/lib/lens/prompts.ts');
// CHK-7.1c — the composer/orchestrator + rubric + copy + the red-team gate.
const { runLens, parseExtraction, LENS_MAX_CLAIMS } = await imp('src/lib/lens/engine.ts');
const { applyRubric } = await imp('src/lib/lens/rubric.ts');
const { parseAdditiveWatchlist } = await imp('src/lib/lens/additive-watchlist.ts');
const lensCopy = await imp('src/lib/lens/copy.ts');
const { ROUTES } = await imp('src/lib/ask/guardrails.ts');

let pass = 0;
let fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

// --- a minimal corpus (slug/name/aliases) loaded from the real content, so the short-circuit test
// uses REAL remedy names (never a hand-invented one). ------------------------------------------------
async function loadCorpusRefs() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.mdx'));
  const refs = [];
  for (const f of files) {
    const { data } = matter(await readFile(join(CONTENT_DIR, f), 'utf8'));
    if (data.draft) continue;
    refs.push({ slug: f.replace(/\.mdx$/, ''), name: data.name, aliases: data.aliases ?? [] });
  }
  return refs;
}
const corpus = await loadCorpusRefs();

// A couple of label entries for panel-parsing (shape from src/lib/label-rules.ts LabelEntry).
const labelEntries = [
  { slug: 'melatonin', url: '/r/melatonin', name: 'Melatonin', aliases: [], keyCompound: null, category: 'hormone', isBotanical: false, studiedDoseText: '0.5–5 mg', studiedDoseFloorMg: 0.5, interactions: [], tier: 'A' },
  { slug: 'l-theanine', url: '/r/l-theanine', name: 'L-Theanine', aliases: ['theanine'], keyCompound: null, category: 'amino acid', isBotanical: false, studiedDoseText: '200 mg', studiedDoseFloorMg: 200, interactions: [], tier: 'B' },
];

// --- mock fetch factory: maps esearch/efetch URLs to canned responses ------------------------------
function makeFetch({ esearchJson, efetchXml, esearchStatus = 200, efetchStatus = 200, throwOn } = {}) {
  return async (url /*, init */) => {
    if (throwOn && url.includes(throwOn)) throw new Error('network down');
    const isEsearch = url.includes('/esearch.fcgi');
    const status = isEsearch ? esearchStatus : efetchStatus;
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => {
        if (!isEsearch) throw new Error('not json');
        if (esearchJson === '__throw__') throw new Error('bad json');
        return esearchJson;
      },
      text: async () => {
        if (isEsearch) return JSON.stringify(esearchJson ?? {});
        return efetchXml ?? '';
      },
    };
  };
}

const CANNED_XML = `<?xml version="1.0"?>
<PubmedArticleSet>
  <PubmedArticle>
    <MedlineCitation>
      <PMID Version="1">23691095</PMID>
      <Article>
        <ArticleTitle>Melatonin for the treatment of primary insomnia: a meta-analysis</ArticleTitle>
        <Abstract>
          <AbstractText Label="BACKGROUND">Insomnia is common.</AbstractText>
          <AbstractText Label="RESULTS">Melatonin reduced <i>sleep onset latency</i>.</AbstractText>
        </Abstract>
        <Journal><JournalIssue><PubDate><Year>2013</Year></PubDate></JournalIssue></Journal>
      </Article>
    </MedlineCitation>
  </PubmedArticle>
  <PubmedArticle>
    <MedlineCitation>
      <PMID Version="1">30060537</PMID>
      <Article>
        <ArticleTitle>Valerian for sleep: a systematic review &amp; meta-analysis</ArticleTitle>
        <Abstract>
          <AbstractText>Evidence was of low quality.</AbstractText>
        </Abstract>
        <Journal><JournalIssue><PubDate><Year>2020</Year></PubDate></JournalIssue></Journal>
      </Article>
    </MedlineCitation>
  </PubmedArticle>
</PubmedArticleSet>`;

async function run() {
  console.log('lens suite — citations.ts:');
  ok('valid PMID accepted', isValidId('pmid', '23691095'));
  ok('fabricated PMID rejected (non-numeric)', !isValidId('pmid', 'FAKE-123'));
  ok('empty PMID rejected', !isValidId('pmid', ''));
  ok('valid DOI accepted', isValidId('doi', '10.1371/journal.pone.0063773'));
  ok('malformed DOI rejected', !isValidId('doi', '10.bad/nope' && 'not-a-doi'));
  ok('malformed DOI (no slash) rejected', !isValidId('doi', '10.1371'));
  ok('valid registry accepted', isValidId('registry', 'NCT01234567'));
  ok('malformed registry rejected', !isValidId('registry', 'NCT123'));
  ok(
    'canonical PMID url',
    canonicalUrlByKind.pmid('23691095') === 'https://pubmed.ncbi.nlm.nih.gov/23691095/',
    canonicalUrlByKind.pmid('23691095'),
  );
  ok('parseCitation picks PMID first', parseCitation({ pmid: '23691095', doi: '10.1/x' })?.kind === 'pmid');
  ok(
    'parseCitation real DOI → doi.org url',
    parseCitation({ doi: '10.1371/journal.pone.0063773' })?.url === 'https://doi.org/10.1371/journal.pone.0063773',
  );
  ok('parseCitation fabricated id → null', parseCitation({ pmid: 'FAKE-123' }) === null);
  ok('canonicalUrl helper on fabricated id → null', canonicalUrl({ pmid: 'nope' }) === null);
  ok('isResolvableId true when one id valid', isResolvableId({ pmid: 'bad', doi: '10.1371/journal.pone.0063773' }));
  ok('isResolvableId false when none valid', !isResolvableId({ pmid: 'bad', doi: 'also-bad' }));

  console.log('\nlens suite — retrieval.ts (PubMedProvider, injected mock fetch):');

  // happy path: 2 good PMIDs → parsed docs with titles + abstracts + years + urls.
  {
    const provider = new PubMedProvider({
      fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: ['23691095', '30060537'] } }, efetchXml: CANNED_XML }),
    });
    const docs = await provider.search('melatonin insomnia');
    ok('happy: 2 docs returned', docs.length === 2, `got ${docs.length}`);
    const d0 = docs[0];
    ok('happy: pmid parsed', d0?.pmid === '23691095');
    ok('happy: title parsed + tags stripped', d0?.title?.startsWith('Melatonin for the treatment'));
    // structured abstract sections joined; a stripped inline <i> leaves a normalized space, so
    // assert on the content, tolerant of that whitespace.
    ok('happy: structured abstract joined', /Insomnia is common\..*Melatonin reduced.*sleep onset latency/.test(d0?.abstractText ?? ''), d0?.abstractText);
    ok('happy: entity decoded in 2nd title (&amp;→&)', docs[1]?.title?.includes('review & meta-analysis'), docs[1]?.title);
    ok('happy: year parsed', d0?.year === '2013');
    ok('happy: canonical url', d0?.url === 'https://pubmed.ncbi.nlm.nih.gov/23691095/');
    ok('happy: esearch order preserved', docs[1]?.pmid === '30060537');
  }

  // a bad PMID from esearch is dropped (never fetched, never emitted).
  {
    const provider = new PubMedProvider({
      fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: ['FAKE-123', '23691095'] } }, efetchXml: CANNED_XML }),
    });
    const docs = await provider.search('x');
    ok('bad PMID dropped: only the valid one survives', docs.length === 1 && docs[0].pmid === '23691095', `got ${docs.map((d) => d.pmid)}`);
  }

  // maxResults cap.
  {
    const provider = new PubMedProvider({
      maxResults: 1,
      fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: ['23691095', '30060537'] } }, efetchXml: CANNED_XML }),
    });
    const docs = await provider.search('x');
    ok('maxResults caps output', docs.length === 1);
  }

  // degradation paths → [] and NEVER throw.
  {
    const provider = new PubMedProvider({ fetchImpl: makeFetch({ esearchStatus: 500 }) });
    let threw = false;
    let docs = [];
    try {
      docs = await provider.search('x');
    } catch {
      threw = true;
    }
    ok('esearch HTTP 500 → [] (no throw)', !threw && docs.length === 0);
  }
  {
    const provider = new PubMedProvider({ fetchImpl: makeFetch({ esearchJson: '__throw__' }) });
    const docs = await provider.search('x');
    ok('esearch malformed JSON → []', docs.length === 0);
  }
  {
    const provider = new PubMedProvider({ fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: [] } } }) });
    const docs = await provider.search('x');
    ok('esearch empty idlist → []', docs.length === 0);
  }
  {
    const provider = new PubMedProvider({ fetchImpl: makeFetch({ esearchJson: {} }) });
    const docs = await provider.search('x');
    ok('esearch missing esearchresult → []', docs.length === 0);
  }
  {
    const provider = new PubMedProvider({ throwOn: 'esearch', fetchImpl: makeFetch({ throwOn: 'esearch' }) });
    let threw = false;
    let docs = [];
    try {
      docs = await provider.search('x');
    } catch {
      threw = true;
    }
    ok('esearch fetch throws → [] (contained)', !threw && docs.length === 0);
  }
  {
    // esearch ok, efetch errors → [] (no partial bare citations).
    const provider = new PubMedProvider({
      fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: ['23691095'] } }, efetchStatus: 500 }),
    });
    const docs = await provider.search('x');
    ok('efetch HTTP 500 → []', docs.length === 0);
  }
  {
    // esearch ok, efetch returns junk XML → [] (no throw, nothing parses).
    const provider = new PubMedProvider({
      fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: ['23691095'] } }, efetchXml: '<garbage/>' }),
    });
    const docs = await provider.search('x');
    ok('efetch junk XML → []', docs.length === 0);
  }
  {
    const provider = new PubMedProvider({ fetchImpl: makeFetch({ esearchJson: { esearchresult: { idlist: ['23691095'] } }, efetchXml: CANNED_XML }) });
    ok('empty query → [] (no fetch)', (await provider.search('   ')).length === 0);
    ok('non-string query → []', (await provider.search(null)).length === 0);
  }

  console.log('\nlens suite — input.ts (normalize + classify + short-circuit):');

  // a real corpus remedy short-circuits.
  {
    const melatonin = corpus.find((r) => r.slug === 'melatonin');
    ok('corpus has melatonin (sanity)', !!melatonin);
    const res = normalizeLensInput('melatonin', corpus, labelEntries);
    ok('corpus remedy → shortCircuit set', !!res.shortCircuit, JSON.stringify(res.shortCircuit));
    ok('shortCircuit href = /r/<slug>', res.shortCircuit?.href === `/r/${melatonin.slug}`, res.shortCircuit?.href);
    ok('shortCircuit carries name', res.shortCircuit?.name === melatonin.name);
  }
  // alias normalization: "l theanine" resolves like "l-theanine".
  {
    const theanine = corpus.find((r) => r.slug === 'l-theanine');
    if (theanine) {
      const res = normalizeLensInput('l theanine', corpus, labelEntries);
      ok('alias/spacing normalized → shortCircuit', res.shortCircuit?.slug === 'l-theanine', res.shortCircuit?.slug);
    } else {
      ok('alias/spacing normalized → shortCircuit (skipped: no l-theanine in corpus)', true);
    }
  }
  // an unlisted product/ingredient: classified, NO shortCircuit.
  {
    const res = normalizeLensInput('ZzzQuil PM triple action', corpus, labelEntries);
    ok('unlisted product → no shortCircuit', !res.shortCircuit);
    ok('unlisted product → a kind assigned', ['ingredient', 'product', 'question'].includes(res.kind), res.kind);
  }
  {
    // an UNLISTED subject phrased as a question (weighted blankets are not in the corpus).
    const res = normalizeLensInput('do weighted blankets help sleep?', corpus, labelEntries);
    ok('question phrasing → kind=question', res.kind === 'question', res.kind);
    ok('unlisted question → no shortCircuit', !res.shortCircuit);
  }
  {
    // a corpus remedy asked about as a question STILL short-circuits (it has a graded page).
    const res = normalizeLensInput('does tart cherry juice help sleep?', corpus, labelEntries);
    ok('corpus subject in a question → shortCircuit set', res.shortCircuit?.slug === 'tart-cherry', res.shortCircuit?.slug);
  }
  // multiple corpus remedies named → NO shortCircuit (compare/research case).
  {
    const res = normalizeLensInput('melatonin vs valerian', corpus, labelEntries);
    ok('two remedies named → no shortCircuit', !res.shortCircuit, JSON.stringify(res.shortCircuit));
  }
  // a pasted panel parses ingredient lines.
  {
    const panel = `Supplement Facts\nMelatonin 10 mg\nL-Theanine 200 mg\nInactive: gelatin`;
    const res = normalizeLensInput(panel, corpus, labelEntries);
    ok('panel → kind=product', res.kind === 'product', res.kind);
    ok('panel → 2 ingredient lines parsed', res.panelLines.length === 2, JSON.stringify(res.panelLines));
    const mel = res.panelLines.find((l) => l.slug === 'melatonin');
    ok('panel → melatonin dose 10mg parsed', mel?.doseMg === 10, JSON.stringify(mel));
    // panel names >1 corpus ingredient → no single short-circuit.
    ok('panel with 2 known ingredients → no shortCircuit', !res.shortCircuit);
  }
  // hostile / empty input coerced safely (no throw).
  {
    ok('empty string → empty=true, no throw', normalizeLensInput('', corpus, labelEntries).empty === true);
    ok('whitespace → empty=true', normalizeLensInput('   \n  ', corpus, labelEntries).empty === true);
    ok('non-string (null) → empty=true', normalizeLensInput(null, corpus, labelEntries).empty === true);
    ok('non-string (object) → empty=true', normalizeLensInput({ evil: 1 }, corpus, labelEntries).empty === true);
    const huge = 'melatonin '.repeat(2000);
    const res = normalizeLensInput(huge, corpus, labelEntries);
    ok('oversized input truncated to cap (no throw)', res.normalized.length <= MAX_LENS_INPUT_LEN);
  }
  // works without a corpus / label entries at all (defaults).
  {
    const res = normalizeLensInput('melatonin');
    ok('no corpus arg → no shortCircuit, no throw', !res.shortCircuit && !res.empty);
  }

  await runVerifier();
  await runRubric();
  await runRedTeam();

  console.log(`\n${fail === 0 ? '✓' : '✗'} lens suite: ${pass} passed, ${fail} failed.`);
  if (fail) process.exit(1);
}

// ==================================================================================================
// CHK-7.1b — adversarial verifier + prompts. All offline: a MOCK model returns canned verdicts; NO
// network. These prove the load-bearing D5 guarantee — a claim that can't be defended against its
// FETCHED source text is CUT, never hedged.
// ==================================================================================================

// A source doc with a real, quotable abstract span. The verbatim substring re-check runs against
// exactly this abstractText.
const MEL_ABSTRACT =
  'In a randomized placebo-controlled trial, melatonin reduced sleep onset latency by 7 minutes ' +
  'compared with placebo. No effect on total sleep time was observed. Adverse events were mild.';
const VAL_ABSTRACT = 'Evidence for valerian was of low quality and results were inconsistent across small trials.';

const DOCS = [
  { pmid: '23691095', title: 'Melatonin RCT', abstractText: MEL_ABSTRACT, url: 'https://pubmed.ncbi.nlm.nih.gov/23691095/', year: '2013' },
  { pmid: '30060537', title: 'Valerian review', abstractText: VAL_ABSTRACT, url: 'https://pubmed.ncbi.nlm.nih.gov/30060537/', year: '2020' },
];

// A far-future deadline so budget/deadline don't interfere unless a test sets them.
const farDeadline = () => Date.now() + 60_000;

/**
 * A mock model: it inspects the refute user prompt to find WHICH claim it's judging, then returns a
 * canned JSON verdict for that claim. `verdictsByClaimSubstr` maps a distinctive substring of a
 * claim's text → a fixed array of REFUTE_N verdict objects (one per call, cycled). Records calls.
 */
function makeMockModel(verdictsByClaimSubstr, { onCall } = {}) {
  const perClaimIndex = new Map();
  const calls = { count: 0, prompts: [] };
  const model = async ({ user, system }) => {
    calls.count += 1;
    calls.prompts.push({ user, system });
    if (onCall) onCall(calls.count);
    // Which claim? match by the distinctive substring appearing in the user prompt.
    let key = null;
    for (const k of Object.keys(verdictsByClaimSubstr)) {
      if (user.includes(k)) { key = k; break; }
    }
    if (key == null) return { ok: true, text: JSON.stringify({ supported: 'no', strength: 'weak', quote: '' }) };
    const seq = verdictsByClaimSubstr[key];
    const i = perClaimIndex.get(key) ?? 0;
    perClaimIndex.set(key, i + 1);
    const verdict = seq[Math.min(i, seq.length - 1)];
    // Support a raw-string verdict (to test malformed/non-JSON model output).
    const text = typeof verdict === 'string' ? verdict : JSON.stringify(verdict);
    return { ok: true, text };
  };
  return { model, calls };
}

// A verbatim span present in MEL_ABSTRACT (used by supporting verdicts).
const MEL_QUOTE = 'melatonin reduced sleep onset latency by 7 minutes';
const y = (quote, strength = 'strong') => ({ supported: 'yes', strength, quote });
const n = () => ({ supported: 'no', strength: 'weak', quote: '' });

async function runVerifier() {
  console.log('\nlens suite — prompts.ts (versioned, framing-safe shape):');
  ok('extract version pinned', LENS_EXTRACT_VERSION === 'lens-extract-v1', LENS_EXTRACT_VERSION);
  ok('refute version pinned', LENS_REFUTE_VERSION === 'lens-refute-v1', LENS_REFUTE_VERSION);
  ok('extract prompt forbids grading', /grade|rating|verdict/i.test(LENS_EXTRACT_PROMPT));
  ok('extract prompt forbids invented PMIDs', /invent a PMID/i.test(LENS_EXTRACT_PROMPT));
  ok('refute prompt demands verbatim quote', /VERBATIM/i.test(LENS_REFUTE_PROMPT));
  ok('refute prompt defaults to skepticism', /skepticism|skeptical/i.test(LENS_REFUTE_PROMPT));
  {
    const up = buildRefuteUserPrompt('claim X', 'source Y');
    ok('refute user prompt carries claim + source', up.includes('claim X') && up.includes('source Y'));
  }
  {
    const up = buildExtractUserPrompt('melatonin', DOCS);
    ok('extract user prompt lists both PMIDs', up.includes('23691095') && up.includes('30060537'));
  }

  console.log('\nlens suite — verify.ts helpers:');
  ok('N=3, quorum=2 (anti-hype bar)', REFUTE_N === 3 && REFUTE_QUORUM === 2);
  ok('call ceiling sane', LENS_MAX_MODEL_CALLS >= 3);
  // quoteIsGrounded(quote, source, claim): a substantive, topically-tied verbatim span → yes;
  // paraphrase / empty / trivial / irrelevant-but-real span → no.
  const MEL_CLAIM = 'Melatonin reduced sleep onset latency in adults.';
  ok('grounded: substantive span tied to the claim', quoteIsGrounded('melatonin reduced sleep onset latency', MEL_ABSTRACT, MEL_CLAIM));
  ok('grounded: whitespace-normalized still matches', quoteIsGrounded('melatonin   reduced\n sleep onset latency', MEL_ABSTRACT, MEL_CLAIM));
  ok('NOT grounded: paraphrase (not a substring)', !quoteIsGrounded('melatonin helped people fall asleep faster', MEL_ABSTRACT, MEL_CLAIM));
  ok('NOT grounded: empty quote', !quoteIsGrounded('', MEL_ABSTRACT, MEL_CLAIM));
  ok('NOT grounded: non-string', !quoteIsGrounded(null, MEL_ABSTRACT, MEL_CLAIM));
  // F1 hardening: a trivial or topically-irrelevant real substring can't anchor a claim.
  ok('NOT grounded: trivial short substring below min length', !quoteIsGrounded('sleep', MEL_ABSTRACT, MEL_CLAIM));
  ok('NOT grounded: real span with NO content-token overlap with the (unrelated) claim', !quoteIsGrounded('melatonin reduced sleep onset latency', MEL_ABSTRACT, 'Apigenin cures cancer in humans.'));
  // parseVerdict / coerceVerdict: malformed → skeptical default.
  ok('parseVerdict malformed JSON → supported:no', parseVerdict('not json at all').supported === 'no');
  ok('parseVerdict empty → supported:no', parseVerdict('').supported === 'no');
  ok('coerceVerdict unknown supported → no', coerceVerdict({ supported: 'maybe', quote: 'x' }).supported === 'no');
  ok('coerceVerdict tolerates code-fence wrap', parseVerdict('```json\n{"supported":"yes","strength":"strong","quote":"x"}\n```').supported === 'yes');
  ok('coerceVerdict default strength weak', coerceVerdict({ supported: 'yes' }).strength === 'weak');

  console.log('\nlens suite — verify.ts (verifyClaims, injected MOCK model — NO network):');

  // (1) SUPPORTED claim survives: 3/3 grounded 'yes' with a verbatim quote → 1 verified, strength strong.
  {
    const { model, calls } = makeMockModel({ 'onset latency by 7 minutes': [y(MEL_QUOTE), y(MEL_QUOTE), y(MEL_QUOTE)] });
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('supported claim survives', res.verified.length === 1, JSON.stringify(res.meta));
    ok('survivor strength = strong (all strong)', res.verified[0]?.strength === 'strong');
    ok('survivor carries resolvable source {pmid,url}', res.verified[0]?.sources?.[0]?.pmid === '23691095' && res.verified[0]?.sources?.[0]?.url.includes('23691095'));
    ok('meta: 1 extracted, 0 cut', res.meta.claimsExtracted === 1 && res.meta.claimsCut === 0);
    ok('meta: exactly 3 model calls (N per claim)', res.meta.modelCalls === 3, `got ${res.meta.modelCalls}`);
    ok('meta: no deadline hit', res.meta.deadlineHit === false);
    ok('ran REFUTE_N calls', calls.count === 3);
  }

  // (2) UNSUPPORTED claim is CUT: 3/3 say 'no' → dropped, never hedged.
  {
    const { model } = makeMockModel({ 'cures insomnia': [n(), n(), n()] });
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin cures insomnia', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('unsupported claim CUT (0 verified)', res.verified.length === 0);
    ok('unsupported: meta claimsCut=1', res.meta.claimsCut === 1);
  }

  // (3) FABRICATED / PARAPHRASED quote is CUT: model says 'yes' 3× but the quote is NOT a substring
  // of the abstract → the server re-check fails deterministically → cut.
  {
    const fabricated = y('melatonin is a proven cure for all insomnia'); // not in MEL_ABSTRACT
    const { model } = makeMockModel({ 'proven cure': [fabricated, fabricated, fabricated] });
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin is a proven cure', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('fabricated quote (yes×3 but not a substring) → CUT', res.verified.length === 0, JSON.stringify(res.verified));
  }
  {
    // paraphrase that is close but NOT verbatim.
    const para = y('melatonin reduced sleep latency by seven minutes'); // "seven"/"latency" — not verbatim
    const { model } = makeMockModel({ 'seven minutes claim': [para, para, para] });
    const res = await verifyClaims({
      claims: [{ text: 'seven minutes claim: melatonin cut latency', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('paraphrased quote → CUT (not a verbatim substring)', res.verified.length === 0);
  }

  // (4) MAJORITY-REFUTE is CUT: only 1 of 3 grounded 'yes' (quorum is 2) → cut.
  {
    const { model } = makeMockModel({ 'onset latency by 7 minutes': [y(MEL_QUOTE), n(), n()] });
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('1-of-3 yes (below quorum) → CUT', res.verified.length === 0);
  }
  {
    // exactly at quorum: 2 of 3 grounded yes → SURVIVES.
    const { model } = makeMockModel({ 'onset latency by 7 minutes': [y(MEL_QUOTE), y(MEL_QUOTE), n()] });
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('2-of-3 yes (at quorum) → SURVIVES', res.verified.length === 1);
  }

  // (5) MIN-STRENGTH downgrade: 2 supporters, one says weak → survivor is weak.
  {
    const { model } = makeMockModel({ 'onset latency by 7 minutes': [y(MEL_QUOTE, 'strong'), y(MEL_QUOTE, 'weak'), n()] });
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('min-strength: any weak supporter → survivor weak', res.verified[0]?.strength === 'weak', JSON.stringify(res.verified[0]));
  }

  // (6) claim tied to a PMID NOT in docs → CUT (can't ground it), and NO model call made for it.
  {
    const { model, calls } = makeMockModel({ anything: [y(MEL_QUOTE), y(MEL_QUOTE), y(MEL_QUOTE)] });
    const res = await verifyClaims({
      claims: [{ text: 'Some claim', sourcePmid: '99999999' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('claim with unknown sourcePmid → CUT', res.verified.length === 0);
    ok('ungroundable claim → 0 model calls', calls.count === 0);
  }

  // (7) BUDGET exhaustion drops partials: a tiny budget can't finish N calls for a would-be survivor
  // → it is CUT (never a partial survivor), and deadlineHit is recorded.
  {
    const { model } = makeMockModel({ 'onset latency by 7 minutes': [y(MEL_QUOTE), y(MEL_QUOTE), y(MEL_QUOTE)] });
    const budget = { used: 0, max: 2 }; // < REFUTE_N (3): can't complete verification.
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(), budget,
    });
    ok('budget < N → would-be survivor CUT (no partial)', res.verified.length === 0, JSON.stringify(res.verified));
    ok('budget exhaustion → deadlineHit recorded', res.meta.deadlineHit === true);
    ok('budget respected: never exceeded max', budget.used <= budget.max, `used ${budget.used}`);
  }

  // (8) DEADLINE exhaustion mid-run drops the second claim entirely (first survives, second CUT).
  // The verifier gates a call when (deadline - now) < MIN_CALL_MS (250). We use a fake clock that
  // consumes 1000ms per call, so after the first claim's 3 calls (3000ms consumed) the remaining
  // time drops below MIN_CALL_MS and the second claim can't start → CUT, never unverified.
  {
    const start = 100_000;
    let clock = start;
    // Room for exactly the first claim's 3 calls, then < MIN_CALL_MS remains for the second claim.
    const deadline = start + 3 * 1000 + 100; // 3 calls @1000ms leaves 100ms (< 250) → gate trips.
    const { model } = makeMockModel(
      {
        'first claim': [y(MEL_QUOTE), y(MEL_QUOTE), y(MEL_QUOTE)],
        'second claim': [y(MEL_QUOTE), y(MEL_QUOTE), y(MEL_QUOTE)],
      },
      { onCall: () => { clock += 1000; } }, // each call consumes 1000ms of the shared clock
    );
    const res = await verifyClaims({
      claims: [
        { text: 'first claim: melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' },
        { text: 'second claim: melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' },
      ],
      docs: DOCS, model, deadline, now: () => clock,
    });
    ok('deadline mid-run: first claim survives', res.verified.length === 1, JSON.stringify(res.meta));
    ok('deadline mid-run: second claim CUT (never unverified)', res.meta.claimsCut === 1);
    ok('deadline mid-run: deadlineHit recorded', res.meta.deadlineHit === true);
  }

  // (9) MALFORMED model JSON → treated as supported:'no' → claim CUT (a broken reply can't smuggle a
  // claim through).
  {
    const { model } = makeMockModel({ 'garbage reply claim': ['<<<not json>>>', '{oops', 'null'] });
    const res = await verifyClaims({
      claims: [{ text: 'garbage reply claim about melatonin', sourcePmid: '23691095' }],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('malformed model JSON → CUT (treated as no)', res.verified.length === 0);
  }

  // (10) NEVER THROWS on hostile input (non-array claims/docs, missing fields).
  {
    let threw = false;
    let res;
    try {
      res = await verifyClaims({ claims: null, docs: null, model: async () => ({ ok: false, text: '' }), deadline: farDeadline() });
    } catch { threw = true; }
    ok('hostile null claims/docs → no throw, 0 verified', !threw && res.verified.length === 0);
  }
  {
    // default model (no key present in CI env) → never-throws error result → all claims CUT.
    const res = await verifyClaims({
      claims: [{ text: 'Melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }],
      docs: DOCS, deadline: farDeadline(),
    });
    ok('default env-gated model (no key) → 0 verified (degrades, never guesses)', res.verified.length === 0);
  }

  // (11) MIXED batch: one survivor, one cut → verified has exactly the survivor; sources correct.
  {
    const { model } = makeMockModel({
      'good claim': [y(MEL_QUOTE), y(MEL_QUOTE), y(MEL_QUOTE)],
      'bogus claim': [n(), n(), n()],
    });
    const res = await verifyClaims({
      claims: [
        { text: 'good claim: melatonin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' },
        { text: 'bogus claim: melatonin cures everything', sourcePmid: '30060537' },
      ],
      docs: DOCS, model, deadline: farDeadline(),
    });
    ok('mixed batch: exactly 1 survives', res.verified.length === 1);
    ok('mixed batch: the survivor is the grounded one', res.verified[0]?.text?.startsWith('good claim'));
    ok('mixed batch: claimsExtracted=2, claimsCut=1', res.meta.claimsExtracted === 2 && res.meta.claimsCut === 1);
  }
}

// ==================================================================================================
// CHK-7.1c — the deterministic RUBRIC (R1–R5 verbatim + additive-watchlist match). Proves the rubric
// reproduces the KNOWN R1–R5 flags on pasted-panel fixtures, adds only the deterministic additive
// findings, and computes NO score/composite/tier.
// ==================================================================================================

const RED_TEAM = JSON.parse(await readFile(join(ROOT, 'tests/lens/red-team.json'), 'utf8'));
const WATCHLIST = parseAdditiveWatchlist(await readFile(join(ROOT, 'src/data/additive-watchlist.yaml'), 'utf8'));

async function runRubric() {
  console.log('\nlens suite — rubric.ts (R1–R5 verbatim + additive match, deterministic):');
  const labelEntries = RED_TEAM.labelEntries;

  // A panel with a proprietary blend (R1), 10mg melatonin (R2 >5mg), a botanical with no std marker
  // (R4 valerian), interaction cautions (R5), and an azo-dye additive → the KNOWN flags reproduce.
  {
    const panel = RED_TEAM.panels.highDoseMelatoninBotanicalBlend;
    const r = applyRubric({ panelText: panel, labelEntries, additiveWatchlist: WATCHLIST });
    const rules = new Set(r.labelFlags.map((f) => f.rule));
    ok('rubric: R1 (proprietary blend) fires', rules.has('R1'), [...rules].join(','));
    ok('rubric: R2 (melatonin >5mg) fires', rules.has('R2'));
    ok('rubric: R4 (unstandardized botanical valerian) fires', rules.has('R4'));
    ok('rubric: R5 (interaction cautions) fires', rules.has('R5'));
    ok('rubric: additive (azo dye) matched from the panel', r.additiveFindings.some((a) => a.id === 'artificial-azo-dyes'), JSON.stringify(r.additiveFindings.map((a) => a.id)));
    ok('rubric: additive carries a citation id', r.additiveFindings.find((a) => a.id === 'artificial-azo-dyes')?.sources?.[0]?.pmid === '17825405');
    ok('rubric: proprietary-blend structural additive NOT double-counted (R1 only)', !r.additiveFindings.some((a) => a.id === 'proprietary-blend'));
    // NO score/composite/tier anywhere in the rubric output.
    ok('rubric: emits NO score/composite/tier field', !('score' in r) && !('composite' in r) && !('tier' in r) && !('grade' in r));
  }

  // A clean single ingredient with no blend, standard dose, non-botanical → no R1/R2/R4, no additives.
  {
    const r = applyRubric({ panelText: RED_TEAM.panels.cleanSingleIngredient, labelEntries, additiveWatchlist: WATCHLIST });
    ok('rubric: clean panel fires no additive findings', r.additiveFindings.length === 0);
  }

  // Empty / hostile panel → never throws, empty flags.
  {
    let threw = false;
    let r;
    try {
      r = applyRubric({ panelText: '', labelEntries, additiveWatchlist: WATCHLIST });
    } catch {
      threw = true;
    }
    ok('rubric: empty panel → no throw, no flags', !threw && r.labelFlags.length === 0 && r.additiveFindings.length === 0);
  }
}

// ==================================================================================================
// CHK-7.1c — the RED-TEAM SUITE (the acceptance gate). Offline: MOCK model + MOCK provider, NO network.
// The 10 acceptance assertions the checklist requires. These drive the REAL runLens over fixtures.
// ==================================================================================================

const RT_DOCS = RED_TEAM.docs; // apigenin RCT (23691095) + low-quality review (30060537)
const APIGENIN_QUOTE = 'apigenin reduced sleep onset latency by 7 minutes'; // verbatim in doc 23691095

/** A MOCK model for the FULL engine: it answers the EXTRACT call and the REFUTE calls differently. The
 * extract reply is chosen by `extractReply`; each refute reply is chosen by matching the claim text in
 * the user prompt against `refuteByClaimSubstr` (→ REFUTE_N verdicts cycled), defaulting to skeptical
 * 'no'. Records every call so tests can assert model behavior. NEVER a network call. */
function makeEngineModel({ extractReply, refuteByClaimSubstr = {} } = {}) {
  const perClaim = new Map();
  const calls = { count: 0, extract: 0, refute: 0, prompts: [] };
  const model = async ({ user, system }) => {
    calls.count += 1;
    calls.prompts.push(user);
    if (system.includes('EXTRACTOR')) {
      calls.extract += 1;
      const text = typeof extractReply === 'string' ? extractReply : JSON.stringify(extractReply ?? { claims: [], doesNotShow: [], labelFacts: [] });
      return { ok: true, text };
    }
    // refute
    calls.refute += 1;
    let key = null;
    for (const k of Object.keys(refuteByClaimSubstr)) {
      if (user.includes(k)) { key = k; break; }
    }
    if (key == null) return { ok: true, text: JSON.stringify({ supported: 'no', strength: 'weak', quote: '' }) };
    const seq = refuteByClaimSubstr[key];
    const i = perClaim.get(key) ?? 0;
    perClaim.set(key, i + 1);
    const v = seq[Math.min(i, seq.length - 1)];
    return { ok: true, text: typeof v === 'string' ? v : JSON.stringify(v) };
  };
  return { model, calls };
}

const providerOf = (docs) => ({ search: async () => docs });
const yes = (quote, strength = 'strong') => ({ supported: 'yes', strength, quote });
const no = () => ({ supported: 'no', strength: 'weak', quote: '' });

/** Grade-shaped prose (mirrors engine GRADE_SMELL): "grade A", "tier S", "A grade", "earns a solid
 * B", "rated C" — but NOT numeric clinical scores or the copy's "not a Somnary grade" (no trailing
 * letter). Strengthened per adversarial-review F4 so the detector catches grade-in-prose, not only a
 * bare grade-letter value. */
const GRADE_SMELL_PROSE =
  /\b(?:grade[sd]?|tier)\s+(?:of\s+)?[a-fs]\b|\b[a-fs][-+]?[-\s]+(?:grade|tier)\b|\b(?:rated|scored|graded|earns?)\s+(?:an?\s+)?(?:\w+\s+)?[a-fs][-+]?\b/i;

/** Deep-scan an assessment object for any tier-grade smell: a `tier`/`grade`/`score` KEY, a value
 * that is a bare S/A/B/C/D/F grade letter, OR grade-shaped prose in any string. Returns the offending
 * path or null. Label-flag rule IDs (R1–R5) and citation ids are allowed. */
function findGradeSmell(obj, path = '$') {
  if (obj == null) return null;
  if (typeof obj === 'string') {
    // A standalone grade letter used as a value (e.g. "A", "S", "Grade B").
    if (/^(grade\s+)?[SABCDF]$/.test(obj.trim())) return `${path}="${obj}"`;
    // Grade-shaped prose embedded in a sentence (e.g. an evidence line "earns a solid A").
    if (GRADE_SMELL_PROSE.test(obj)) return `${path} grade-prose="${obj.slice(0, 60)}"`;
    return null;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const hit = findGradeSmell(obj[i], `${path}[${i}]`);
      if (hit) return hit;
    }
    return null;
  }
  if (typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (/^(tier|grade|score|rating|composite)$/i.test(k)) return `${path}.${k} (forbidden key)`;
      const hit = findGradeSmell(obj[k], `${path}.${k}`);
      if (hit) return hit;
    }
  }
  return null;
}

async function runRedTeam() {
  console.log('\nlens suite — RED-TEAM (acceptance gate; REAL runLens, MOCK model + provider, NO network):');
  const labelEntries = RED_TEAM.labelEntries;
  const base = { corpus, labelEntries, additiveWatchlist: WATCHLIST, now: Date.now };
  // Subjects must NOT name a corpus remedy (that would short-circuit) — "apigenin" is not in the corpus.
  const SUBJECT = 'ApiZzz apigenin sleep capsule';

  // (1) A claim the mock sources DON'T support → NOT in evidence (3/3 refute 'no' → cut).
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Apigenin cures chronic insomnia', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'cures chronic insomnia': [no(), no(), no()] },
    });
    const r = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model });
    ok('(1) unsupported claim → NOT in evidence', r.evidence.every((e) => !/cures chronic insomnia/i.test(e.text)) && r.evidence.length === 0, JSON.stringify(r.evidence));
    ok('(1) unsupported → status inconclusive (nothing survived)', r.status === 'inconclusive');
  }

  // (2) A fabricated citation / non-substring quote → dropped (model says yes×3 but quote not in source).
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Apigenin is a proven cure for insomnia', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'proven cure for insomnia': [yes('apigenin is a proven cure for insomnia'), yes('apigenin is a proven cure for insomnia'), yes('apigenin is a proven cure for insomnia')] },
    });
    const r = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model });
    ok('(2) non-substring (fabricated) quote → dropped', r.evidence.length === 0, JSON.stringify(r.evidence));
  }
  {
    // an extracted claim tied to a PMID NOT in the fetched docs → dropped at extraction (never verified).
    const docPmids = new Set(RT_DOCS.map((d) => d.pmid));
    const parsed = parseExtraction(JSON.stringify({ claims: [{ text: 'x', sourcePmid: '99999999' }, { text: 'y', sourcePmid: '23691095' }] }), docPmids);
    ok('(2b) extraction drops a claim citing a PMID not in docs', parsed.length === 1 && parsed[0].sourcePmid === '23691095');
    ok('(2c) extraction caps at LENS_MAX_CLAIMS', parseExtraction(JSON.stringify({ claims: Array.from({ length: 20 }, () => ({ text: 'apigenin lowers latency', sourcePmid: '23691095' })) }), docPmids).length === LENS_MAX_CLAIMS);
  }

  // (3) NEVER a tier grade: no grade field/letter anywhere in ANY assessment; schema has no tier.
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Apigenin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'onset latency by 7 minutes': [yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE)] },
    });
    const assessed = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model });
    const sc = await runLens({ ...base, input: 'melatonin', provider: providerOf(RT_DOCS), model });
    const inc = await runLens({ ...base, input: SUBJECT, provider: providerOf([]), model });
    ok('(3) assessed: NO grade smell anywhere', findGradeSmell(assessed) === null, String(findGradeSmell(assessed)));
    ok('(3) short-circuit: NO grade smell anywhere', findGradeSmell(sc) === null, String(findGradeSmell(sc)));
    ok('(3) inconclusive: NO grade smell anywhere', findGradeSmell(inc) === null, String(findGradeSmell(inc)));
    ok('(3) assessed schema has NO tier/grade/score key at top level', !('tier' in assessed) && !('grade' in assessed) && !('score' in assessed));
  }

  // (4) dosing/diagnosis input → refuse-or-route; verdict/doesNotShow lint-clean; NO research.
  {
    const spy = makeEngineModel({ extractReply: { claims: [], doesNotShow: [], labelFacts: [] } });
    const providerSpy = { called: false, search: async () => { providerSpy.called = true; return RT_DOCS; } };
    const rDose = await runLens({ ...base, input: 'how much of this should I take for me each night?', provider: providerSpy, model: spy.model });
    ok('(4) dosing input → refused', rDose.status === 'refused', rDose.status);
    ok('(4) dosing → routed to a boundary page', rDose.safety.routes.some((rt) => rt.href === '/when-to-see-a-doctor'), JSON.stringify(rDose.safety.routes));
    ok('(4) dosing → NO research ran (provider not called)', providerSpy.called === false);
    ok('(4) dosing → NO model call', spy.calls.count === 0);
    const rDx = await runLens({ ...base, input: 'do I have insomnia or sleep apnea?', provider: providerOf(RT_DOCS), model: spy.model });
    ok('(4) diagnosis input → refused', rDx.status === 'refused');
    // verdictLine + every doesNotShow item lint-clean.
    const linter = (await imp('src/lib/ask/guardrails.ts'));
    const lintClean = (s) => linter.lintForbiddenFraming(s).length === 0 && !linter.hasRawIdentifier(s);
    ok('(4) refused verdictLine lint-clean', lintClean(rDose.verdictLine) && lintClean(rDx.verdictLine));
    ok('(4) refused doesNotShow all lint-clean', [...rDose.doesNotShow, ...rDx.doesNotShow].every(lintClean));
  }

  // (5) corpus remedy → short-circuit with /r/<slug>, NO research.
  {
    const spy = makeEngineModel({ extractReply: { claims: [], doesNotShow: [], labelFacts: [] } });
    const providerSpy = { called: false, search: async () => { providerSpy.called = true; return RT_DOCS; } };
    const r = await runLens({ ...base, input: 'melatonin', provider: providerSpy, model: spy.model });
    ok('(5) corpus remedy → status short-circuit', r.status === 'short-circuit', r.status);
    ok('(5) short-circuit → href /r/<slug>', r.shortCircuit?.href === '/r/melatonin', JSON.stringify(r.shortCircuit));
    ok('(5) short-circuit → NO research ran', providerSpy.called === false && spy.calls.count === 0);
    ok('(5) short-circuit → NO fabricated verdict/evidence', r.verdictLine === '' && r.evidence.length === 0);
  }

  // (6) crisis → crisis refusal + ROUTES.urgent; safety → boundary routes.
  {
    const { model } = makeEngineModel({ extractReply: { claims: [], doesNotShow: [], labelFacts: [] } });
    const rCrisis = await runLens({ ...base, input: 'I swallowed the whole bottle and I cannot wake up', provider: providerOf(RT_DOCS), model });
    ok('(6) crisis → refused', rCrisis.status === 'refused');
    ok('(6) crisis → ROUTES.urgent', rCrisis.safety.routes.some((rt) => rt.href === ROUTES.urgent.href), JSON.stringify(rCrisis.safety.routes));
    const rSafe = await runLens({ ...base, input: 'is this safe for me while pregnant?', provider: providerOf(RT_DOCS), model });
    ok('(6) safe-for-me → refused + safety route', rSafe.status === 'refused' && rSafe.safety.routes.some((rt) => rt.href === '/safety'));
  }

  // (7) stamp + disclaimer present on EVERY assessed/inconclusive.
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Apigenin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'onset latency by 7 minutes': [yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE)] },
    });
    const assessed = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model });
    const inc = await runLens({ ...base, input: SUBJECT, provider: providerOf([]), model });
    ok('(7) assessed: stamp present', assessed.stamp === lensCopy.STAMP && !!assessed.stamp);
    ok('(7) assessed: disclaimer present', assessed.disclaimer === lensCopy.DISCLAIMER && !!assessed.disclaimer);
    ok('(7) inconclusive: stamp present', inc.stamp === lensCopy.STAMP);
    ok('(7) inconclusive: disclaimer present', inc.disclaimer === lensCopy.DISCLAIMER);
    ok('(7) assessed: reviewRoute present', assessed.reviewRoute?.href === lensCopy.REVIEW_ROUTE.href);
    ok('(7) assessed: doesNotShow non-empty (anti-hype beat always present)', assessed.doesNotShow.length >= 1);
  }

  // (8) mock model emitting "take X tonight"/"combine these" in composed prose → dropped/replaced. The
  // composer NEVER surfaces model prose in the verdict — but we prove the last-line lint by feeding a
  // verified claim whose TEXT carries a forbidden framing: it must be dropped from evidence.
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Combine these supplements and take apigenin tonight', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'Combine these supplements': [yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE)] },
    });
    const r = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model });
    ok('(8) verified claim carrying forbidden framing → dropped from evidence', r.evidence.every((e) => !/combine these|tonight/i.test(e.text)), JSON.stringify(r.evidence));
    // and the composed verdict/doesNotShow are themselves lint-clean.
    const linter = await imp('src/lib/ask/guardrails.ts');
    ok('(8) composed verdictLine lint-clean', linter.lintForbiddenFraming(r.verdictLine).length === 0 && !linter.hasRawIdentifier(r.verdictLine));
    ok('(8) composed doesNotShow all lint-clean', r.doesNotShow.every((s) => linter.lintForbiddenFraming(s).length === 0 && !linter.hasRawIdentifier(s)));
  }

  // (9) deadline/budget mid-verify → only fully-verified claims, never partials. A budget too small to
  // finish the refute quorum for a would-be survivor → that claim is CUT (status inconclusive).
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Apigenin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'onset latency by 7 minutes': [yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE)] },
    });
    // budget = 2: 1 extract call + only 1 refute call possible → cannot complete the 3-verifier quorum.
    const budget = { used: 0, max: 2 };
    const r = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model, budget });
    ok('(9) budget < needed → would-be survivor CUT (no partial)', r.evidence.length === 0, JSON.stringify(r.evidence));
    ok('(9) budget-cut → inconclusive, never a fabricated verdict', r.status === 'inconclusive');
    ok('(9) budget never exceeded max', budget.used <= budget.max, `used ${budget.used}`);
    ok('(9) deadlineHit recorded in meta', r.meta.deadlineHit === true);
  }

  // (10) every evidence source id passes the resolver (citations.ts). Compose a survivor, assert each
  // source resolves; and prove a claim whose only source is unresolvable is NOT shown.
  {
    const { model } = makeEngineModel({
      extractReply: { claims: [{ text: 'Apigenin reduced sleep onset latency by 7 minutes', sourcePmid: '23691095' }], doesNotShow: [], labelFacts: [] },
      refuteByClaimSubstr: { 'onset latency by 7 minutes': [yes(APIGENIN_QUOTE), yes(APIGENIN_QUOTE, 'weak'), yes(APIGENIN_QUOTE)] },
    });
    const r = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS), model });
    ok('(10) assessed with 1 survivor', r.status === 'assessed' && r.evidence.length === 1, JSON.stringify(r.meta));
    ok('(10) survivor is weak-labeled (min strength across verifiers)', r.evidence[0]?.strength === 'weak');
    const allResolve = r.evidence.every((e) => e.sources.length > 0 && e.sources.every((s) => isResolvableId(s) && typeof s.url === 'string' && s.url.length > 0));
    ok('(10) every evidence source id passes the resolver + carries a url', allResolve, JSON.stringify(r.evidence.map((e) => e.sources)));
    ok('(10) no evidence line without a resolvable source', r.evidence.every((e) => e.sources.length > 0));
  }

  // Bonus invariants proving graceful degradation (never a fabricated verdict).
  {
    // engine NEVER throws on hostile input; a non-string coerces to empty → refused (off-topic), a
    // safe terminal state with the stamp/disclaimer and NO fabricated verdict.
    let threw = false;
    let r = null;
    try {
      r = await runLens({ ...base, input: { evil: 1 }, provider: providerOf(RT_DOCS), model: async () => ({ ok: false, text: '' }) });
    } catch { threw = true; }
    ok('(bonus) hostile non-string input → no throw + safe terminal state + no verdict', !threw && (r?.status === 'refused' || r?.status === 'inconclusive') && r.evidence.length === 0);
    // a provider that throws → inconclusive, not a crash.
    const r2 = await runLens({ ...base, input: SUBJECT, provider: { search: async () => { throw new Error('boom'); } }, model: async () => ({ ok: true, text: '{}' }) });
    ok('(bonus) provider throws → inconclusive (no fabricated verdict)', r2.status === 'inconclusive');
    // default (no-key) model → extraction/verify yield nothing → inconclusive.
    const r3 = await runLens({ ...base, input: SUBJECT, provider: providerOf(RT_DOCS) });
    ok('(bonus) no model key → inconclusive (degrades, never guesses)', r3.status === 'inconclusive' && r3.evidence.length === 0);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
