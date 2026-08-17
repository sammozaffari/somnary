import React from 'react';
import { Wordmark } from '../../components/chrome/Wordmark.jsx';
import { SearchField } from '../../components/chrome/SearchField.jsx';
import { DisclaimerBand } from '../../components/chrome/SafetyCallout.jsx';
import { BucketShape } from '../../components/verdicts/BucketShape.jsx';
import { BUCKETS } from '../../components/verdicts/BucketBadge.jsx';
import { CRITERIA } from '../../components/verdicts/ProductScoreBadge.jsx';
import { Breadcrumb } from '../../components/chrome/Breadcrumb.jsx';

/* /how-we-grade — the one page allowed real terminology, each term introduced in plain words
   first: plain on the surface, technical detail behind expandables. Readers arrive mid-question
   from a bucket badge, so the badge meanings sit at the top, before any preamble.
   Deep links: #works #maybe #unknown #avoid #two-questions #product-score #verify #sources
   #recheck #errors #independence. Grading thresholds and ops specifics not yet signed off are
   marked [placeholder] — never invented. */

const body = { margin: 0, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text-body)', maxWidth: 'var(--measure)' };
const muted = { ...body, color: 'var(--text-muted)' };

function Disclose({ label = 'the technical detail', children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
          font: 'var(--weight-ui) var(--text-sm) var(--font-sans)', color: 'var(--text-link)',
          textDecoration: 'underline', textUnderlineOffset: 3 }}>
        {open ? `Hide ${label}` : `Show ${label}`}
      </button>
      {open && (
        <div style={{ background: 'var(--surface-sunken)', border: 'var(--border-w) solid var(--border-hairline)',
          borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function H2({ id, children }) {
  return <h2 id={id} style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--display-sm)', fontWeight: 'var(--weight-heading)',
    letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-snug)' }}>{children}</h2>;
}

const BUCKET_EXPLAINERS = [
  { key: 'works',
    plain: 'More than one well-run study measured sleep, we could verify the results, and they point the same way.',
    tech: <React.Fragment>
      <p style={body}>"Well-run" means a randomised controlled trial: people are randomly split into a group that gets the remedy and a group that gets a placebo — a dummy identical in appearance — so the only difference between groups is the remedy itself. Observational studies can support the middle grades, but only trials can put a remedy here.</p>
      <p style={body}>"Point the same way" is about the effect size — how big the improvement is, not just whether one exists. Small, consistent effects across studies count for more than one dramatic result.</p>
      <p style={muted}>[Placeholder — exact thresholds (study count, sample size, effect size floor) pending methodology sign-off.]</p>
    </React.Fragment> },
  { key: 'maybe',
    plain: 'Some verified results show a small benefit — but too few, or in too few people, to be confident it would help you.',
    tech: <React.Fragment>
      <p style={body}>Typically one or two verifiable studies with small samples, or mixed results where the better-run studies show less. The honest reading of "statistically significant but small" is: might help a little.</p>
      <p style={muted}>[Placeholder — exact thresholds pending methodology sign-off.]</p>
    </React.Fragment> },
  { key: 'unknown',
    plain: "Too few papers measured sleep at all — or none published enough detail to verify. The remedy hasn't failed a test; the test hasn't been run.",
    tech: <React.Fragment>
      <p style={body}>Most remedies sit here. A paper "measures sleep" when it reports a sleep outcome — time to fall asleep, time awake at night, total sleep — rather than stress, mood, or anything else. Papers on other outcomes may be good science; they just can't answer this question.</p>
    </React.Fragment> },
  { key: 'avoid',
    plain: 'Decent studies measured sleep and found little or no benefit. This grade is about what the research found — risk is the separate safety flag.',
    tech: <React.Fragment>
      <p style={body}>Landing here requires papers that measured sleep and found no meaningful effect. Safety never moves a bucket, in either direction — a serious concern shows as the separate flag above the grades, whatever the evidence says.</p>
    </React.Fragment> },
];

const CRITERIA_EXPLAINERS = [
  { key: 'dose', plain: 'The amount in one serving falls inside the range the studies actually used.',
    tech: 'Compared per serving as the label directs, against the doses used in the verifiable studies. More is not better — a bottle can fail this check from above.' },
  { key: 'tested', plain: 'An independent laboratory confirmed what the bottle contains.',
    tech: 'Third-party testing means a lab with no stake in sales verified identity and amount. Manufacturers\u2019 own certificates don\u2019t pass this check on their own. [Placeholder — accepted testing organisations pending list.]' },
  { key: 'disclosed', plain: 'Every ingredient and its amount is on the label.',
    tech: 'A "proprietary blend" is a labelling device that gives a total weight for a mix without the amount of each ingredient — which makes the dose check impossible. Any proprietary blend fails this check.' },
  { key: 'form', plain: 'The bottle uses the same form of the ingredient the studies used.',
    tech: 'The same ingredient can come as different salts, extracts, or preparations, and the body absorbs them differently — its bioavailability. A studied result only carries to the form that was studied.' },
];

export function GradePage({ go, section }) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = (e) => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  React.useEffect(() => {
    if (!section) { window.scrollTo(0, 0); return; }
    const t = setTimeout(() => {
      const el = document.getElementById(section);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16 });
    }, 60);
    return () => clearTimeout(t);
  }, [section]);
  const jump = (id) => (e) => {
    e.preventDefault();
    if (('#' + id) === location.hash) { history.replaceState(null, '', '#'); }
    location.hash = id;
  };
  const sec = { paddingTop: 'var(--space-9)' };
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', maxWidth: 'var(--page-max)', width: '100%', margin: '0 auto', padding: 'var(--space-4) var(--space-5)' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); go('home'); }} style={{ textDecoration: 'none' }}><Wordmark size={24} /></a>
        <SearchField size="sm" style={{ maxWidth: 320, marginLeft: 'auto' }} onSubmit={() => {}} />
      </header>
      <main style={{ flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 var(--space-5) var(--space-9)' }}>
        {/* SYSTEM RULE: breadcrumbs on every page (root exempt) — the back affordance,
           never referrer-dependent; mobile truncates to "‹ Parent". */}
        <Breadcrumb mobile={!desktop} current="How we grade" trail={[{ label: 'Somnary', onClick: () => go('home') }]} />
        <h1 style={{ margin: 'var(--space-1) 0 var(--space-2)', fontSize: 'var(--display-md)', fontWeight: 'var(--weight-title)',
          letterSpacing: 'var(--tracking-display)', lineHeight: 'var(--leading-tight)' }}>How we grade</h1>
        <p style={{ ...muted, marginBottom: 'var(--space-4)' }}>You probably tapped a badge. Here's what it means — the short answer first, the technical detail behind each fold.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}>
          {[['two-questions', 'Two questions'], ['product-score', 'The product score'], ['verify', '"Results we could verify"'], ['flags', 'The ingredient flags'], ['study-types', 'What kinds of studies count'], ['popularity', 'Why popularity isn\u2019t evidence'], ['sources', 'Where information comes from'], ['recheck', 'Rechecking'], ['errors', 'Report an error'], ['independence', 'Independence']].map(([id, label]) => (
            <a key={id} href={'#' + id} onClick={jump(id)} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-ui)' }}>{label}</a>
          ))}
        </div>

        {/* The badges — the arrival answer, before any preamble */}
        <section style={{ paddingTop: 'var(--space-7)' }}>
          <H2 id="badges">The four grades</H2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {BUCKET_EXPLAINERS.map(x => {
              const b = BUCKETS[x.key];
              return (
                <div key={x.key} id={x.key} style={{ background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
                  borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: b.color,
                    fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-strong)' }}>
                    <BucketShape bucket={x.key} size={16} />{b.plain}
                  </span>
                  <p style={body}>{x.plain}</p>
                  <Disclose>{x.tech}</Disclose>
                </div>
              );
            })}
          </div>
        </section>

        <section style={sec}>
          <H2 id="two-questions">Two questions, never one score</H2>
          <p style={body}>Every page answers two things separately: does the ingredient work, and does this specific bottle give you what was studied. They're kept apart because a true answer to one says nothing about the other — a well-made bottle of something useless is still useless, and a proven ingredient at the wrong dose is still the wrong bottle.</p>
          <p style={{ ...body, marginTop: 'var(--space-3)' }}>Safety is a third thing, not part of either. A safety flag isn't a grade — it's a warning that sits above the grades and outranks them. A remedy can sit in any bucket and still carry one.</p>
        </section>

        <section style={sec}>
          <H2 id="product-score">The product score, check by check</H2>
          <p style={{ ...muted, marginBottom: 'var(--space-4)' }}>Four factual checks, each visible on the product's page. No weighting, no hidden formula — the checks are the score.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {CRITERIA_EXPLAINERS.map((c, i) => (
              <div key={c.key} style={{ borderTop: 'var(--border-w) solid var(--border-hairline)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--weight-strong)' }}>{CRITERIA[i].label}</p>
                <p style={body}>{c.plain}</p>
                <Disclose><p style={body}>{c.tech}</p></Disclose>
              </div>
            ))}
          </div>
        </section>

        <section style={sec}>
          <H2 id="flags">The ingredient flags</H2>
          <p style={body}>Every ingredient on a product page carries one of three flags. "No known concern" — no documented evidence of harm at the labelled amounts (not a guarantee). "Worth knowing" — something documented is worth your attention before a nightly habit; it includes one standing policy: non-sugar sweeteners are always worth knowing in a daily-use product [placeholder — WHO 2023 guideline pending verification]. "Documented concern" — published evidence of harm, linked to its paper.</p>
          <p style={{ ...body, marginTop: 'var(--space-3)' }}>The concern list is editorial, cited, and public — every flag links to what earned it. The boundary holds both ways: a flag never says "bad" or "avoid" without a documented concern, for the same reason an untested remedy is never called useless. The verdict follows the evidence in both directions.</p>
        </section>

        <section style={sec}>
          <H2 id="verify">What "results we could verify" means</H2>
          <p style={body}>A result counts as verified when the paper published enough detail — how many people, what was measured, what the numbers were — that we could check the finding ourselves rather than take the abstract's word for it.</p>
          <p style={{ ...body, marginTop: 'var(--space-3)' }}>Most papers don't qualify, and the reasons are mundane: roughly half the papers people cite about sleep remedies don't measure sleep at all, and of those that do, about a third don't publish enough detail to check. That's why the evidence bar on every remedy page has three tiers — and why the solid part is usually short.</p>
          <Disclose>
            <p style={body}>Verification means recomputing the headline result from the published numbers — group sizes, means and spreads, or event counts — and checking it against the paper's stated conclusion. Papers behind paywalls are bought, not skipped. A meta-analysis (a study that pools the results of many studies) is verified against its included trials.</p>
            <p style={muted}>[Placeholder — full verification protocol pending methodology sign-off.]</p>
          </Disclose>
        </section>

        <section style={sec}>
          <H2 id="study-types">What kinds of studies count</H2>
          <p style={body}>Three kinds of paper can carry evidence here: a trial (people are given the remedy or a placebo, and the difference is measured), a review of several studies pooled together, and an observational study (researchers watch what people already do and what happens to them).</p>
          <p style={{ ...body, marginTop: 'var(--space-3)' }}>Observational studies count, and can support the middle grades — but they can't put a remedy in the top grade on their own. That takes trials. The reason is plain: an observational study shows that two things go together; a trial shows that one causes the other. Sleep is especially prone to the difference, because people who sleep well differ from people who don't in dozens of ways — anything those people also happen to take will look like it works.</p>
          <Disclose>
            <p style={body}>Every paper in a remedy's list is labelled with its kind, in the same plain words, so you can see whether a remedy's evidence is trials or observational at a glance. "Trial" here means a randomised controlled trial; "observational study" covers cohort and similar designs — the technical names appear only in the sources list.</p>
          </Disclose>
        </section>

        <section style={sec}>
          <H2 id="popularity">Why “everyone uses it” doesn't move a grade</H2>
          <p style={body}>Sleep is unusually good at making inert things look effective, three ways at once. It responds strongly to expectation — believing you took something that helps genuinely helps, for a while. Bad sleep comes in stretches, so whatever you take on the worst night gets the credit when the stretch ends on its own. And memory of sleep is unreliable — people are often wrong about how long they slept, in both directions.</p>
          <p style={{ ...body, marginTop: 'var(--space-3)' }}>Put together, those three can build a convincing consensus around something that does nothing. That's not a flaw in the people reporting — it's why the grade only moves on studies designed to cancel those effects out.</p>
        </section>

        <section style={sec}>
          <H2 id="sources">Where the information comes from</H2>
          <ul style={{ ...body, margin: 0, paddingLeft: '1.2em', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>Government label databases — what a product legally declares.</li>
            <li>Independent testing organisations — what's actually in the bottle.</li>
            <li>Manufacturers' own test results — used, but never sufficient on their own.</li>
            <li>Published research — the studies every claim links to.</li>
          </ul>
        </section>

        <section style={sec}>
          <H2 id="recheck">How often it's rechecked</H2>
          <p style={body}>Every page shows when it was last checked, in plain sight. When an entry goes too long without a recheck, it's flagged as stale on the page itself rather than quietly left standing.</p>
          <p style={{ ...muted, marginTop: 'var(--space-3)' }}>[Placeholder — recheck cadence and staleness threshold pending operations sign-off.]</p>
        </section>

        <section style={sec}>
          <H2 id="errors">Report an error</H2>
          <p style={body}>If a number, a link, or a claim looks wrong, tell us — corrections are logged on the page they fix.</p>
          <p style={{ ...muted, marginTop: 'var(--space-3)' }}>[Placeholder — error-report route pending.]</p>
        </section>

        <section style={sec}>
          <H2 id="independence">Independence</H2>
          <p style={body}>No supplement company pays Somnary, and no brand can influence a score. Nobody pays us to say any of this; every claim links to the study it came from.</p>
        </section>
      </main>
      <DisclaimerBand />
    </div>
  );
}
