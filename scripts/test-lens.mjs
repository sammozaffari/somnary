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
  // quoteIsGrounded: verbatim (ws-normalized) yes; paraphrase no; empty no.
  ok('grounded: exact substring', quoteIsGrounded('sleep onset latency', MEL_ABSTRACT));
  ok('grounded: whitespace-normalized still matches', quoteIsGrounded('melatonin   reduced\n sleep onset latency', MEL_ABSTRACT));
  ok('NOT grounded: paraphrase (not a substring)', !quoteIsGrounded('melatonin helped people fall asleep faster', MEL_ABSTRACT));
  ok('NOT grounded: empty quote', !quoteIsGrounded('', MEL_ABSTRACT));
  ok('NOT grounded: non-string', !quoteIsGrounded(null, MEL_ABSTRACT));
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

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
