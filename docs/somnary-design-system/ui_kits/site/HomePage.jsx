import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { StudyField } from '../../components/evidence/StudyField.jsx';
import { PlainStat } from '../../components/evidence/PlainStat.jsx';
import { RemedyCard } from '../../components/cards/RemedyCard.jsx';
import { BucketBadge, BUCKETS } from '../../components/verdicts/BucketBadge.jsx';
import { BucketShape } from '../../components/verdicts/BucketShape.jsx';
import { BrandMark } from '../../components/cards/BrandMark.jsx';

/* Homepage data — real corpus numbers; ordered by verifiable count so the
   near-empty bars cluster at the end and the row reads as a ranking. */
const REMEDIES = [
  { name: 'Melatonin', bucket: 'works', counts: { cited: 12, sleep: 5, verifiable: 3 }, tags: 'sleep onset jet lag' },
  { name: 'Magnesium', bucket: 'maybe', counts: { cited: 9, sleep: 2, verifiable: 2 }, tags: 'sleep waking' },
  { name: 'L-theanine', bucket: 'maybe', counts: { cited: 8, sleep: 2, verifiable: 2 }, tags: 'sleep calm tea' },
  { name: 'Valerian', bucket: 'unknown', counts: { cited: 11, sleep: 3, verifiable: 1 }, tags: 'sleep sedative herb' },
  { name: 'Chamomile', bucket: 'unknown', counts: { cited: 6, sleep: 2, verifiable: 1 }, tags: 'sleep tea calm' },
  { name: 'Ashwagandha', bucket: 'unknown', counts: { cited: 7, sleep: 1, verifiable: 0 }, tags: 'sleep stress',
    safetyFlag: '[Placeholder — real safety wording pending sourcing]' },
];
/* SCHEMA RULE: product name and strength are separate structured fields — the name never
   contains the dose (see ProductListRow). */
const PRODUCTS = [
  { brand: 'Dreamwell', name: 'Sleep complex', note: 'Label known — not yet assessed', tags: 'sleep blend' },
  { brand: 'Nightcap Co', name: 'Deep sleep drops', note: 'Not in our database yet', tags: 'sleep drops' },
  { brand: 'Somnia Labs', name: 'Melatonin', note: '4 of 4 checks pass', bucket: 'works', tags: 'sleep melatonin' },
];
const BRANDS = [
  { name: 'Somnia Labs', note: '4 products assessed', tags: 'sleep melatonin' },
  { name: 'Dreamwell', note: '2 products assessed', tags: 'sleep blend' },
];
const PROBLEMS = [
  { name: "I can't fall asleep", tags: 'sleep onset' },
  { name: 'I keep waking at 3am', tags: 'sleep waking night' },
];
const SITUATIONS = [
  "I can't fall asleep", 'I keep waking at 3am', "I bought a sleep blend and can't read the label",
  "I'm thinking about melatonin", 'I take medication', 'This is for my child',
];

function match(q, ...fields) {
  const s = q.trim().toLowerCase();
  return s.length >= 3 && fields.some(f => (f || '').toLowerCase().includes(s));
}

/* ---- search resolution — the principle: NEVER SHOW AN ARBITRARY SUBSET OF A LARGE SET.
   A query that resolves to one item returns that item as the answer (tier 1) with related
   routes (tier 2) and everything else collapsed (tier 3). A query that matches a CATEGORY
   returns the category — a count row or a browse route — never a sample of its members.
   Products list individually only when the query names one (brand token, dose, product word). */
const SEARCH_INDEX = [
  ...REMEDIES.map(r => ({ ...r, page: { Melatonin: 'melatonin', Magnesium: 'magnesium', Valerian: 'valerian', Chamomile: 'chamomile' }[r.name] })),
  { name: 'Kava', bucket: 'unknown', counts: { cited: 5, sleep: 0, verifiable: 0 }, tags: 'stress calm',
    safetyFlag: '[Placeholder — serious safety concern pending sourcing]', page: 'kava' },
  { name: 'Bacopa', bucket: 'unknown', counts: { cited: 0, sleep: 0, verifiable: 0 }, tags: '' },
  { name: 'Taurine', bucket: 'unknown', counts: { cited: 0, sleep: 0, verifiable: 0 }, tags: '' },
];
/* per-remedy product counts — demo values (melatonin's 12/3 from the brief) */
const PRODUCT_COUNTS = { Melatonin: { checked: 12, pass: 3 } };
const RELATED_PROBLEMS = { Melatonin: ["I can't fall asleep"], Magnesium: ['I keep waking at 3am'], Valerian: ["I can't fall asleep"] };
const BROAD = ['sleep', 'insomnia', 'remedy', 'remedies', 'supplement', 'supplements', 'natural'];
const PRODUCT_WORDS = ['drops', 'melts', 'gummies', 'capsules', 'complex', 'blend', 'tea'];

function edit(a, b) { /* Levenshtein, for "did you mean" — people type "ashwaganda" and "melatonine" constantly */
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

function resolveQuery(qRaw) {
  const q = qRaw.trim().toLowerCase();
  if (q.length < 3) return null;
  if (BROAD.some(t => t === q || t.startsWith(q))) return { kind: 'category' };
  const starts = SEARCH_INDEX.filter(r => r.name.toLowerCase().startsWith(q));
  const partial = SEARCH_INDEX.filter(r => r.name.toLowerCase().includes(q) || match(q, r.tags));
  const problems = PROBLEMS.filter(p => match(q, p.name, p.tags));
  const namesProduct = /\d+\s*mg\b/.test(q) || PRODUCT_WORDS.some(w => w.startsWith(q) || q.includes(w));
  const brands = BRANDS.filter(b => match(q, b.name));
  const products = (namesProduct || brands.length > 0)
    ? PRODUCTS.filter(p => match(q, p.name, p.brand, p.tags)) : [];
  if (starts.length === 1) {
    const r = starts[0];
    return { kind: 'answer', remedy: r, problems: RELATED_PROBLEMS[r.name] || [],
      more: [...partial.filter(x => x !== r), ...brands.map(b => ({ brand: b }))], moreProblems: problems };
  }
  if (partial.length + problems.length + brands.length + products.length > 0)
    return { kind: 'list', remedies: partial, problems, brands, products };
  const best = [...SEARCH_INDEX.map(r => r.name), ...PROBLEMS.map(p => p.name)]
    .map(n => ({ n, d: edit(q, n.toLowerCase()) })).sort((a, b) => a.d - b.d)[0];
  return { kind: 'nomatch', suggestion: best && best.d <= Math.max(2, Math.floor(q.length / 4)) ? best.n : null };
}

/* ---- result rows — one grid for every row type: 28px lead column (glyph or mark), text
   at a shared left edge, meta right-aligned; hairline above each group label. */
function GroupLabel({ first, children }) {
  return <p style={{ margin: first ? 0 : 'var(--space-2) 0 0', padding: 'var(--space-3) var(--space-4) var(--space-1)',
    borderTop: first ? 'none' : 'var(--border-w) solid var(--border-hairline)',
    fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-strong)', color: 'var(--text-muted)' }}>{children}</p>;
}

function ResultRow({ onClick, lead, meta, strong = false, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#remedy" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr) auto', alignItems: 'center',
        gap: 'var(--space-3)', minHeight: 'var(--control-md)', padding: 'var(--space-2) var(--space-4)',
        textDecoration: 'none', color: 'var(--text-body)',
        background: hover ? 'var(--surface-sunken)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-settle)' }}>
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{lead}</span>
      <span style={{ fontSize: 'var(--text-base)', fontWeight: strong ? 'var(--weight-strong)' : 'var(--weight-ui)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
        {meta}<span style={{ color: 'var(--text-faint)' }}>›</span>
      </span>
    </a>
  );
}

function BucketMeta({ remedy }) {
  const b = BUCKETS[remedy.bucket] || BUCKETS.unknown;
  return (
    <React.Fragment>
      {remedy.safetyFlag && <span style={{ fontWeight: 'var(--weight-strong)', color: 'var(--amber)', whiteSpace: 'nowrap' }}>Safety concern</span>}
      <span style={{ fontWeight: 'var(--weight-strong)', color: b.color, whiteSpace: 'nowrap' }}>{b.plain}</span>
    </React.Fragment>
  );
}

function BrowseAllRow({ go }) {
  return (
    <ResultRow strong lead={<BucketShape bucket="unknown" size={13} />} onClick={(e) => { e.preventDefault(); go('remedies'); }}>
      Browse all 31 remedies, graded
    </ResultRow>
  );
}

function SearchResults({ query, go, goRemedy, goBrand, openProblem }) {
  const res = resolveQuery(query);
  const [showMore, setShowMore] = React.useState(false);
  React.useEffect(() => { setShowMore(false); }, [query]);
  if (!res) return null;
  const openR = (r) => (e) => { e.preventDefault(); goRemedy(r.page || 'melatonin'); };
  /* brand result rows land on the brand page — one of its three live routes; unbuilt demo
     brands fall back to the dreamwell view inside BrandPage */
  const openB = (b) => (e) => { e.preventDefault(); goBrand && goBrand(b.name.split(' ')[0].toLowerCase()); };
  const panel = { position: 'absolute', zIndex: 40, top: 'calc(100% + var(--space-2))', left: 0, right: 0,
    background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
    borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-pop)', overflow: 'hidden',
    paddingBottom: 'var(--space-2)', textAlign: 'left' };
  if (res.kind === 'category') {
    /* a broad query matches everything we cover — return the category, never a sample */
    return (
      <div role="listbox" aria-label="Search results" style={panel}>
        <GroupLabel first>That matches everything we cover — start from the problem, or browse</GroupLabel>
        {PROBLEMS.map(p => (
          <ResultRow key={p.name} lead={null} onClick={openProblem}>{p.name}</ResultRow>
        ))}
        <BrowseAllRow go={go} />
      </div>
    );
  }
  if (res.kind === 'nomatch') {
    return (
      <div role="listbox" aria-label="Search results" style={panel}>
        <GroupLabel first>Nothing matches “{query.trim()}”</GroupLabel>
        {res.suggestion && (
          <ResultRow strong lead={null} onClick={(e) => { e.preventDefault(); }}>
            Did you mean {res.suggestion}?
          </ResultRow>
        )}
        <BrowseAllRow go={go} />
      </div>
    );
  }
  if (res.kind === 'answer') {
    const r = res.remedy;
    const b = BUCKETS[r.bucket] || BUCKETS.unknown;
    const pc = PRODUCT_COUNTS[r.name];
    const moreCount = res.more.length + res.moreProblems.length;
    return (
      <div role="listbox" aria-label="Search results" style={panel}>
        {/* tier 1 — the answer */}
        <a href="#remedy" onClick={openR(r)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
          padding: 'var(--space-4)', textDecoration: 'none', color: 'var(--text-body)' }}>
          <span style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-strong)', letterSpacing: 'var(--tracking-display)' }}>{r.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: b.color }}>
              <BucketShape bucket={r.bucket} size={13} />{b.plain}
            </span>
            {r.safetyFlag && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', color: 'var(--amber)' }}>Safety concern</span>}
          </span>
          <StudyField size="thumb" counts={r.counts} />
          {pc && (
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-strong)', fontVariantNumeric: 'tabular-nums' }}>
              {pc.checked} {r.name.toLowerCase()} products checked — {pc.pass} give you what was studied →
            </span>
          )}
        </a>
        {/* tier 2 — related routes */}
        {res.problems.length > 0 && <GroupLabel>Related</GroupLabel>}
        {res.problems.map(name => (
          <ResultRow key={name} lead={null} onClick={openProblem}>{name}</ResultRow>
        ))}
        {/* tier 3 — everything else, collapsed */}
        {moreCount > 0 && (
          <button type="button" onClick={() => setShowMore(s => !s)} aria-expanded={showMore}
            style={{ display: 'grid', gridTemplateColumns: '28px 1fr', alignItems: 'center', gap: 'var(--space-3)',
              width: '100%', minHeight: 'var(--control-md)', padding: 'var(--space-2) var(--space-4)', textAlign: 'left',
              border: 'none', borderTop: 'var(--border-w) solid var(--border-hairline)', background: 'transparent',
              font: 'var(--weight-ui) var(--text-sm) var(--font-sans)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <span aria-hidden="true" style={{ textAlign: 'center' }}>{showMore ? '−' : '+'}</span>
            {showMore ? 'Hide other matches' : `More matches (${moreCount})`}
          </button>
        )}
        {showMore && res.more.map(m => m.brand
          ? <ResultRow key={m.brand.name} lead={<BrandMark name={m.brand.name} size={24} />} onClick={openR({})}
              meta={<span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{m.brand.note}</span>}>{m.brand.name}</ResultRow>
          : <ResultRow key={m.name} lead={<span style={{ color: (BUCKETS[m.bucket] || BUCKETS.unknown).color }}><BucketShape bucket={m.bucket} size={13} /></span>}
              onClick={openR(m)} meta={<BucketMeta remedy={m} />}>{m.name}</ResultRow>)}
        {showMore && res.moreProblems.map(p => (
          <ResultRow key={p.name} lead={null} onClick={openProblem}>{p.name}</ResultRow>
        ))}
      </div>
    );
  }
  /* kind === 'list' — ambiguous query: aligned rows, grouped with hairlines; products only
     because the query named one (brand token, dose, or product word) */
  return (
    <div role="listbox" aria-label="Search results" style={panel}>
      {res.remedies.length > 0 && <GroupLabel first>Remedies</GroupLabel>}
      {res.remedies.map(r => (
        <ResultRow key={r.name} lead={<span style={{ color: (BUCKETS[r.bucket] || BUCKETS.unknown).color }}><BucketShape bucket={r.bucket} size={13} /></span>}
          onClick={openR(r)} meta={<BucketMeta remedy={r} />}>{r.name}</ResultRow>
      ))}
      {res.products.length > 0 && <GroupLabel first={res.remedies.length === 0}>Products</GroupLabel>}
      {res.products.map(p => (
        <ResultRow key={p.brand + p.name} lead={<BrandMark name={p.brand} bucket={p.bucket} size={24} />} onClick={openR({})}
          meta={<span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{p.brand} · {p.note}</span>}>{p.name}</ResultRow>
      ))}
      {res.brands.length > 0 && <GroupLabel first={res.remedies.length + res.products.length === 0}>Brands</GroupLabel>}
      {res.brands.map(b => (
        <ResultRow key={b.name} lead={<BrandMark name={b.name} size={24} />} onClick={openB(b)}
          meta={<span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{b.note}</span>}>{b.name}</ResultRow>
      ))}
      {res.problems.length > 0 && <GroupLabel first={res.remedies.length + res.products.length + res.brands.length === 0}>Problems</GroupLabel>}
      {res.problems.map(p => (
        <ResultRow key={p.name} lead={null} onClick={openProblem}>{p.name}</ResultRow>
      ))}
    </div>
  );
}

export function HomePage({ go, goGrade, goRemedy, goBrand }) {
  const [query, setQuery] = React.useState('sleep');
  const open = (e) => { e.preventDefault(); go('remedy'); };
  const gR = goRemedy || (() => go('remedy'));
  /* SYSTEM RULE (nav): three items — Remedies · Products · Safety — plus ever-present search.
     Problems are reached by search, the situation cards below, and cross-links from remedy
     pages; How we grade is reached from every bucket badge and the footer. Never re-add
     them to the chrome. Safety points at the Safety page (built next). */
  const nav = ['Remedies', 'Products', 'Safety'];
  const h2 = { margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-heading)', letterSpacing: 'var(--tracking-display)' };
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3) var(--space-5)',
        maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginLeft: 'auto' }}>
          {nav.map(n => (
            <a key={n} href={n === 'Remedies' ? '#remedies' : '#'} onClick={(e) => { e.preventDefault(); if (n === 'Remedies') go('remedies'); else if (n === 'Products') go('products'); else if (n === 'Safety') go('safety'); }} style={{ display: 'inline-flex', alignItems: 'center',
              minHeight: 'var(--control-md)', padding: '0 var(--space-3)', borderRadius: 'var(--radius-sm)',
              textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-ui)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; e.currentTarget.style.color = 'var(--text-body)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>{n}</a>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--space-5)' }}>
        {/* Hero — the search field is the page's largest object; no colour, just size and weight */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)',
          padding: 'var(--space-10) 0 var(--space-6)', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-body)', color: 'var(--text-muted)',
            lineHeight: 'var(--leading-body)', maxWidth: '44ch', textWrap: 'pretty' }}>
            Somnary tells you whether a sleep remedy actually works — and whether the bottle in your hand delivers it.
          </h1>
          <div style={{ position: 'relative', width: '100%', maxWidth: 'var(--search-max)' }}>
            <SearchField value={query} onChange={setQuery} onSubmit={() => go('remedy')} autoFocus />
            <SearchResults query={query} go={go} goRemedy={gR} goBrand={goBrand} openProblem={(e) => { e.preventDefault(); go('problem'); }} />
          </div>
        </div>
        {/* Quiet safety route */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 'var(--space-9)' }}>
          <a href="#safety" onClick={(e) => { e.preventDefault(); go('safety'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            minHeight: 'var(--control-md)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)',
            background: 'var(--amber-tint)', border: 'var(--border-w) solid var(--amber-line)', textDecoration: 'none',
            fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-ui)', color: 'var(--text-body)', textAlign: 'left',
            lineHeight: 'var(--leading-snug)' }}>
            <span>Taking medications, pregnant, or thinking about this for a child?</span>
            <span style={{ fontWeight: 'var(--weight-strong)', color: 'var(--amber)', whiteSpace: 'nowrap' }}>Start here ›</span>
          </a>
        </div>
        {/* Situations */}
        <section style={{ paddingBottom: 'var(--space-9)' }}>
          <h2 style={h2}>Or start with what's going on</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
            {SITUATIONS.map(s => (
              <a key={s} href={s === 'I keep waking at 3am' ? '#problem' : '#remedy'}
                onClick={s === 'I keep waking at 3am' ? (e) => { e.preventDefault(); go('problem'); } : open}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)',
                  minHeight: 'var(--control-lg)', padding: 'var(--space-3) var(--space-4)', textDecoration: 'none',
                  background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-body)', fontSize: 'var(--text-base)',
                  fontWeight: 'var(--weight-ui)', lineHeight: 'var(--leading-snug)',
                  transition: 'border-color var(--dur-fast) var(--ease-settle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hairline)'; }}>
                {s}
                <span aria-hidden="true" style={{ color: 'var(--text-faint)' }}>›</span>
              </a>
            ))}
          </div>
        </section>
        {/* Remedies people ask about */}
        <section style={{ paddingBottom: 'var(--space-9)' }}>
          <h2 style={h2}>The ones people ask about most</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {REMEDIES.map(r => (
              <RemedyCard key={r.name} onClick={open} name={r.name} bucket={r.bucket}
                research={{ counts: r.counts }} safetyFlag={r.safetyFlag} onGrade={goGrade} href="#remedy" />
            ))}
          </div>
        </section>
        {/* One honest number */}
        <section style={{ paddingBottom: 'var(--space-10)', borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-8)' }}>
          <PlainStat figure="About 7 minutes" text="faster to sleep, on average — the best-supported remedy we cover"
            source="Melatonin, from a review of 19 studies covering 1,683 people"
            chip={{ finding: 'People taking melatonin fell asleep about 7 minutes sooner, on average, than people taking a placebo.',
              people: 1683, year: 2013, linkText: 'Read the review (19 studies)', lastChecked: '1 August 2026' }} />
        </section>
      </main>
      <footer style={{ borderTop: 'var(--border-w) solid var(--border-hairline)' }}>
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: 'var(--space-7) var(--space-5)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', maxWidth: 'var(--measure)' }}>
            Nobody pays us to say any of this. Every claim links to the study it came from.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-5)', fontSize: 'var(--text-sm)' }}>
            <a href="#badges" onClick={(e) => { e.preventDefault(); goGrade && goGrade(); }} style={{ color: 'var(--text-muted)', fontWeight: 'var(--weight-ui)' }}>How we grade</a>
            <span style={{ color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>Last updated 10 August 2026</span>
          </div>
        </div>
        <DisclaimerBand />
      </footer>
    </div>
  );
}
