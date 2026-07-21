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

  console.log(`\n${fail === 0 ? '✓' : '✗'} lens suite: ${pass} passed, ${fail} failed.`);
  if (fail) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
