/* @ds-bundle: {"format":4,"namespace":"SomnaryDesignSystem_d2f73f","components":[{"name":"BrandMark","sourcePath":"components/cards/BrandMark.jsx"},{"name":"BrandResultRow","sourcePath":"components/cards/BrandResultRow.jsx"},{"name":"ProductCard","sourcePath":"components/cards/ProductCard.jsx"},{"name":"VerdictPill","sourcePath":"components/cards/ProductListRow.jsx"},{"name":"ProductListRow","sourcePath":"components/cards/ProductListRow.jsx"},{"name":"RemedyCard","sourcePath":"components/cards/RemedyCard.jsx"},{"name":"WhereToBuyRow","sourcePath":"components/cards/WhereToBuyRow.jsx"},{"name":"Breadcrumb","sourcePath":"components/chrome/Breadcrumb.jsx"},{"name":"SafetyMark","sourcePath":"components/chrome/SafetyCallout.jsx"},{"name":"SafetyCallout","sourcePath":"components/chrome/SafetyCallout.jsx"},{"name":"LastChecked","sourcePath":"components/chrome/SafetyCallout.jsx"},{"name":"DisclaimerBand","sourcePath":"components/chrome/SafetyCallout.jsx"},{"name":"SearchField","sourcePath":"components/chrome/SearchField.jsx"},{"name":"Wordmark","sourcePath":"components/chrome/Wordmark.jsx"},{"name":"LabelVsStudies","sourcePath":"components/evidence/LabelVsStudies.jsx"},{"name":"PlainStat","sourcePath":"components/evidence/PlainStat.jsx"},{"name":"StudyChip","sourcePath":"components/evidence/StudyChip.jsx"},{"name":"StudyField","sourcePath":"components/evidence/StudyField.jsx"},{"name":"BUCKETS","sourcePath":"components/verdicts/BucketBadge.jsx"},{"name":"BucketBadge","sourcePath":"components/verdicts/BucketBadge.jsx"},{"name":"BucketShape","sourcePath":"components/verdicts/BucketShape.jsx"},{"name":"PairedVerdict","sourcePath":"components/verdicts/PairedVerdict.jsx"},{"name":"CRITERIA","sourcePath":"components/verdicts/ProductScoreBadge.jsx"},{"name":"PASSES_THRESHOLD","sourcePath":"components/verdicts/ProductScoreBadge.jsx"},{"name":"ProductScoreBadge","sourcePath":"components/verdicts/ProductScoreBadge.jsx"},{"name":"BrandPage","sourcePath":"ui_kits/site/BrandPage.jsx"},{"name":"GradePage","sourcePath":"ui_kits/site/GradePage.jsx"},{"name":"HomePage","sourcePath":"ui_kits/site/HomePage.jsx"},{"name":"ProblemPage","sourcePath":"ui_kits/site/ProblemPage.jsx"},{"name":"ProductPage","sourcePath":"ui_kits/site/ProductPage.jsx"},{"name":"ProductsPage","sourcePath":"ui_kits/site/ProductsPage.jsx"},{"name":"RemediesPage","sourcePath":"ui_kits/site/RemediesPage.jsx"},{"name":"RemedyTemplate","sourcePath":"ui_kits/site/RemedyPage.jsx"},{"name":"RemedyPage","sourcePath":"ui_kits/site/RemedyPage.jsx"},{"name":"SafetyPage","sourcePath":"ui_kits/site/SafetyPage.jsx"}],"sourceHashes":{"components/cards/BrandMark.jsx":"ccc64953252a","components/cards/BrandResultRow.jsx":"049893942aef","components/cards/ProductCard.jsx":"dd4a7c1daba0","components/cards/ProductListRow.jsx":"d5d8d11d9b49","components/cards/RemedyCard.jsx":"acb3339c164c","components/cards/WhereToBuyRow.jsx":"800adcc4be2f","components/cards/demo.jsx":"252172d329e3","components/chrome/Breadcrumb.jsx":"9eabb60e6099","components/chrome/SafetyCallout.jsx":"9c92f925fe2f","components/chrome/SearchField.jsx":"8987efba801a","components/chrome/Wordmark.jsx":"5230e329474f","components/chrome/demo.jsx":"1fc31505a40a","components/evidence/LabelVsStudies.jsx":"3adacfcae786","components/evidence/PlainStat.jsx":"62dd7d98929a","components/evidence/StudyChip.jsx":"b71c697d85c9","components/evidence/StudyField.jsx":"1d8e54edce65","components/evidence/demo.jsx":"3a5a9d27b8a1","components/evidence/filter-variants.demo.jsx":"e2fca9a58cf0","components/verdicts/BucketBadge.jsx":"8654c5acda83","components/verdicts/BucketShape.jsx":"d724fc8f98e7","components/verdicts/PairedVerdict.jsx":"8f65a28db034","components/verdicts/ProductScoreBadge.jsx":"59cd5130109e","components/verdicts/demo.jsx":"a365ace374fd","ds-loader.js":"5dd56bd6d342","ui_kits/site/BrandPage.jsx":"5d0cb29d43be","ui_kits/site/GradePage.jsx":"cabfdaa71428","ui_kits/site/HomePage.jsx":"496f4ee9487e","ui_kits/site/ProblemPage.jsx":"2a495a8a5b94","ui_kits/site/ProductPage.jsx":"e0210a38791f","ui_kits/site/ProductsPage.jsx":"0cc83f365793","ui_kits/site/RemediesPage.jsx":"72badf5e588b","ui_kits/site/RemedyPage.jsx":"25aae82b97f3","ui_kits/site/SafetyPage.jsx":"8cd217203371","ui_kits/site/app.jsx":"7e7cc1437b5b"},"inlinedExternals":[],"unexposedExports":[{"name":"mountCardsDemo","sourcePath":"components/cards/demo.jsx"},{"name":"mountChromeDemo","sourcePath":"components/chrome/demo.jsx"},{"name":"mountEvidenceDemo","sourcePath":"components/evidence/demo.jsx"},{"name":"mountFilterVariantsDemo","sourcePath":"components/evidence/filter-variants.demo.jsx"},{"name":"mountSite","sourcePath":"ui_kits/site/app.jsx"},{"name":"mountVerdictsDemo","sourcePath":"components/verdicts/demo.jsx"}]} */

(() => {

const __ds_ns = (window.SomnaryDesignSystem_d2f73f = window.SomnaryDesignSystem_d2f73f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/BrandMark.jsx
try { (() => {
/** The image placeholder as a first-class component: a typographic mark — the brand's
    initial on a neutral ground. Most products will never have an image; this is the
    common case. Pass src when a real image exists. */
function BrandMark({
  name = '?',
  src,
  size = 40,
  radius = 'var(--radius-sm)',
  style
}) {
  if (src) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      width: size,
      height: size,
      style: {
        flex: 'none',
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: radius,
        border: 'var(--border-w) solid var(--border-hairline)',
        background: 'var(--surface-sunken)',
        ...style
      }
    });
  }
  const initial = String(name).trim().charAt(0).toUpperCase() || '?';
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: 'none',
      width: size,
      height: size,
      borderRadius: radius,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-sunken)',
      border: 'var(--border-w) solid var(--border-hairline)',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-strong)',
      fontSize: Math.round(size * 0.45),
      lineHeight: 1,
      ...style
    }
  }, initial);
}
Object.assign(__ds_scope, { BrandMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/BrandMark.jsx", error: String((e && e.message) || e) }); }

// components/cards/WhereToBuyRow.jsx
try { (() => {
/** Where to buy — retailer, price if known, outbound link. Deliberately identical on a
    well-scoring product and on one the site advises against: same component, same weight.
    One-line disclosure sits beneath. */
function WhereToBuyRow({
  retailer,
  price,
  url = '#',
  disclosure,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: url,
    target: "_blank",
    rel: "noopener",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minHeight: 'var(--hit-target)',
      padding: 'var(--space-3) var(--space-4)',
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-sm)',
      transition: 'border-color var(--dur-fast) var(--ease-settle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 'var(--text-base)',
      fontWeight: 500,
      color: 'var(--text-body)'
    }
  }, retailer), price && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-muted)'
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--text-link)',
      fontWeight: 600
    }
  }, "\u2197")), disclosure && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: '0 var(--space-4)',
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)'
    }
  }, disclosure));
}
Object.assign(__ds_scope, { WhereToBuyRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/WhereToBuyRow.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Breadcrumb.jsx
try { (() => {
/* SYSTEM RULE: breadcrumbs on every page, always — the back affordance, never a
   referrer-dependent "back" link. Desktop: the full trail (Products › Brand › Product),
   current page unlinked. Mobile: truncate to the parent only ("‹ Products").
   trail: [{label, onClick}, ...] parents in order; current: string. */
function Breadcrumb({
  trail,
  current,
  mobile
}) {
  const link = {
    color: 'var(--text-link)',
    fontWeight: 'var(--weight-ui)'
  };
  const parent = trail[trail.length - 1];
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-5) 0',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-ui)',
      color: 'var(--text-muted)'
    }
  }, mobile ? /*#__PURE__*/React.createElement("a", {
    href: "#up",
    onClick: e => {
      e.preventDefault();
      parent.onClick();
    },
    style: link
  }, "\u2039 ", parent.label) : /*#__PURE__*/React.createElement(React.Fragment, null, trail.map(t => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t.label
  }, /*#__PURE__*/React.createElement("a", {
    href: "#up",
    onClick: e => {
      e.preventDefault();
      t.onClick();
    },
    style: link
  }, t.label), ' \u203a ')), /*#__PURE__*/React.createElement("span", null, current)));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/chrome/SafetyCallout.jsx
try { (() => {
/* CONTENT RULE — THE ONE THAT HAS DRIFTED THREE TIMES; enforced here because a comment on
   the component is the mechanism that has actually held. NEVER author a health or safety
   claim in a design file. Drift history: (1) "Linked to serious liver injury in rare
   cases" authored for kava in demo/prompt files at system creation; (2) re-introduced in
   bundle-20 kit data after the first sweep; (3) "Valerian can add to the effect of
   sleeping pills…" authored in this file's own demo. All safety copy in design files is
   "[Placeholder — … pending sourcing/medical review]" — no exceptions for plausible,
   "well-known", or paraphrased claims. */

/* Shape-coded safety mark — caution = outlined triangle, serious = filled triangle:
   legible in greyscale, so colour is never the only signal (same principle as BucketShape). */
function SafetyMark({
  level = 'caution',
  size = 13,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: size,
    height: size,
    viewBox: "0 0 14 14",
    style: {
      flex: 'none',
      display: 'block',
      ...style
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1.8 L13 12.2 H1 Z",
    fill: level === 'serious' ? 'var(--amber)' : 'none',
    stroke: "var(--amber)",
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  }));
}

/** Safety callout — calm, unmissable. Tinted-left-edge on a soft amber ground: the same
    edge language as ingredient "worth knowing / documented concern" flags and failing
    checks — one visual form means "documented concern" everywhere.
    A serious-concern safety flag always outranks any evidence visual. */
/* LAYOUT RULE — the component owns its narrow behaviour. Stacked (label row above
   full-width ink body) is the BASE; the inline side-by-side variant renders only above a
   width threshold measured INSIDE the component, so no container can ever squeeze the body
   into a one-word column. This form broke in three contexts when pages owned the layout. */
function SafetyCallout({
  level = 'caution',
  title,
  children,
  style
}) {
  const [wide, setWide] = React.useState(false);
  const roRef = React.useRef(null);
  /* measure via ref callback, not an effect: it fires the moment the node exists (and again
     on remount), with an immediate synchronous measure plus a ResizeObserver for live
     resizes — the effect-based version silently never ran under the card runtime */
  const attach = React.useCallback(node => {
    if (roRef.current) {
      roRef.current.disconnect();
      roRef.current = null;
    }
    if (!node) return;
    const apply = w => setWide(w >= 480);
    apply(node.getBoundingClientRect().width);
    if (typeof ResizeObserver !== 'undefined') {
      roRef.current = new ResizeObserver(entries => apply(entries[0].contentRect.width));
      roRef.current.observe(node);
    }
  }, []);
  const label = title || (level === 'serious' ? 'Serious concern' : 'Safety concern');
  const labelRow = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      whiteSpace: wide ? 'nowrap' : 'normal'
    }
  }, /*#__PURE__*/React.createElement(SafetyMark, {
    level: level
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--amber)',
      fontWeight: 'var(--weight-strong)'
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", {
    ref: attach,
    role: "note",
    style: {
      background: 'var(--amber-tint)',
      borderLeft: '3px solid var(--amber)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-4) var(--space-5)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      display: wide ? 'grid' : 'flex',
      gridTemplateColumns: 'auto minmax(0, 1fr)',
      flexDirection: 'column',
      gap: wide ? 'var(--space-1) var(--space-4)' : 'var(--space-2)',
      alignItems: 'baseline',
      ...style
    }
  }, labelRow, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, children));
}

/** "Last checked {date}" tag — quiet, tabular figures, human date ("14 July 2026"), never ISO. */
function LastChecked({
  date,
  prefix = 'Last checked',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, prefix, " ", date);
}

/** Disclaimer band — quiet page-bottom strip; states the site's limits without ceremony. */
/* SYSTEM RULE: "How we grade" is not in the nav — it is reached from every bucket badge and
   from the footer; the optional onGrade link here is that footer route on every page. */
function DisclaimerBand({
  children,
  onGrade,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      padding: 'var(--space-4) var(--space-5)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      textAlign: 'center',
      textWrap: 'pretty',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement(React.Fragment, null, "Somnary is a reference, not medical advice. It can't know your health history \u2014 a pharmacist or doctor can. No supplement company pays us, and no brand can influence a score."), onGrade && /*#__PURE__*/React.createElement(React.Fragment, null, ' ', /*#__PURE__*/React.createElement("a", {
    href: "#how-we-grade",
    onClick: e => {
      e.preventDefault();
      onGrade();
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-ui)'
    }
  }, "How we grade")));
}
Object.assign(__ds_scope, { SafetyMark, SafetyCallout, LastChecked, DisclaimerBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/SafetyCallout.jsx", error: String((e && e.message) || e) }); }

// components/chrome/SearchField.jsx
try { (() => {
/** The search field — the site's primary object. Concentric geometry per the nested-radii
    rule: lg = outer --radius-lg + --space-1 padding all round → button --radius-md.
    sm = zero padding, button flush at full height → same radius as the outer (inner =
    outer − padding = outer). Keeps every part of the control at the 44px hit floor. */
function SearchField({
  placeholder = 'A remedy, a product, or a brand',
  value,
  onChange,
  onSubmit,
  size = 'lg',
  autoFocus = false,
  style
}) {
  const [v, setV] = React.useState(value || '');
  const [focus, setFocus] = React.useState(false);
  const big = size === 'lg';
  return /*#__PURE__*/React.createElement("form", {
    role: "search",
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(v);
    },
    style: {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      width: '100%',
      maxWidth: 'var(--search-max)',
      height: big ? 'var(--control-xl)' : 'var(--control-md)',
      padding: big ? 'var(--space-1)' : '0',
      background: 'var(--surface-card)',
      borderRadius: big ? 'var(--radius-lg)' : 'var(--radius-md)',
      border: 'var(--border-w) solid var(--border-strong)',
      outline: focus ? 'var(--focus-ring)' : 'none',
      outlineOffset: 'var(--focus-offset)',
      transition: 'border-color var(--dur-fast) var(--ease-settle)',
      borderColor: focus ? 'var(--ink)' : 'var(--border-input)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    "aria-hidden": "true",
    style: {
      flex: 'none',
      color: 'var(--text-faint)',
      marginLeft: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "5.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12.2",
    y1: "12.2",
    x2: "16",
    y2: "16",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    type: "search",
    value: v,
    autoFocus: autoFocus,
    placeholder: placeholder,
    "aria-label": "Search Somnary",
    onChange: e => {
      setV(e.target.value);
      onChange && onChange(e.target.value);
    },
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: `400 ${big ? 'var(--text-lg)' : 'var(--text-base)'} var(--font-sans)`,
      color: 'var(--text-body)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      boxSizing: 'border-box',
      height: big ? 'var(--control-lg)' : '100%',
      padding: '0 var(--space-5)',
      border: 'none',
      borderRadius: big ? 'var(--radius-md)' : 'var(--radius-md)',
      background: 'var(--ink)',
      color: 'var(--paper)',
      font: '600 var(--text-sm) var(--font-sans)',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, "Look it up"));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Wordmark.jsx
try { (() => {
/** The wordmark: "Somnary" — capitalised, no trailing period. Onest 600. */
function Wordmark({
  size = 28,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--weight-strong)',
      fontSize: size,
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-body)',
      lineHeight: 1,
      ...style
    }
  }, "Somnary");
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/chrome/demo.jsx
try { (() => {
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included.
   CONTENT RULE: safety copy in design files is always a [Placeholder — …] string (see the
   drift history on SafetyCallout). */
const PH = '[Placeholder — interaction wording pending sourcing]';
const PH_SERIOUS = '[Placeholder — serious safety concern wording, pending sourcing]';
function Label({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-faint)'
    }
  }, children);
}
/* the callout at its three legal widths — full (side-by-side renders, self-measured),
   card (~320px, stacks), and the narrowest row context it can appear in (~200px) */
function Callouts() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Safety callout \u2014 full / card / narrowest; caution outline vs serious filled"), /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    level: "caution"
  }, PH), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 320
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    level: "serious"
  }, PH_SERIOUS)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    level: "caution"
  }, PH))));
}
function Demo({
  dusk
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      padding: 'var(--space-5) var(--space-5) 0'
    }
  }, !dusk && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 30
  }), /*#__PURE__*/React.createElement(__ds_scope.LastChecked, {
    date: "1 August 2026"
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, null)), /*#__PURE__*/React.createElement(Callouts, null), !dusk && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Label, null, "The same callouts at dusk"), /*#__PURE__*/React.createElement("iframe", {
    src: "chrome.card.html#dusk",
    title: "Dusk",
    style: {
      width: '100%',
      height: 280,
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    style: {
      margin: '0 calc(-1 * var(--space-5))'
    }
  })));
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
function mountChromeDemo(el) {
  const dusk = window.location.hash.indexOf('dusk') !== -1;
  if (dusk) document.documentElement.setAttribute('data-theme', 'dusk');
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(Demo, {
    dusk: dusk
  }));
}
Object.assign(__ds_scope, { mountChromeDemo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/demo.jsx", error: String((e && e.message) || e) }); }

// components/evidence/StudyChip.jsx
try { (() => {
/** "See the study" chip + its popover: the finding in one plain sentence, how many people,
    what year, a link out, and when Somnary last checked the link works. */
function StudyChip({
  label = 'See the study',
  finding,
  people,
  year,
  url = '#',
  linkText = 'Read the study',
  lastChecked,
  defaultOpen = false,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      position: 'relative',
      display: 'inline-block',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      minHeight: 'var(--space-7)',
      padding: 'var(--space-1) var(--space-3)',
      borderRadius: 'var(--radius-pill)',
      border: 'var(--border-w) solid var(--border-strong)',
      background: open ? 'var(--surface-sunken)' : 'transparent',
      color: 'var(--text-link)',
      font: '600 var(--text-sm) var(--font-sans)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-fast) var(--ease-settle)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 10 10",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "5",
    r: "3.5",
    fill: "currentColor",
    opacity: "0.8"
  })), label), open && /*#__PURE__*/React.createElement("span", {
    role: "dialog",
    "aria-label": "Study details",
    style: {
      position: 'absolute',
      zIndex: 30,
      top: 'calc(100% + var(--space-2))',
      left: 0,
      width: 'var(--popover-w)',
      display: 'block',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-pop)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)'
    }
  }, finding), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-muted)'
    }
  }, people ? `${people.toLocaleString()} people` : null, people && year ? ' · ' : '', year || null), /*#__PURE__*/React.createElement("a", {
    href: url,
    target: "_blank",
    rel: "noopener",
    style: {
      display: 'inline-block',
      marginTop: 'var(--space-3)',
      font: '600 var(--text-sm) var(--font-sans)',
      color: 'var(--text-link)'
    }
  }, linkText, " \u2197"), lastChecked && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 'var(--space-3)',
      paddingTop: 'var(--space-2)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      fontSize: 'var(--text-xs)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-faint)'
    }
  }, "Link last checked ", lastChecked)));
}
Object.assign(__ds_scope, { StudyChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/StudyChip.jsx", error: String((e && e.message) || e) }); }

// components/evidence/LabelVsStudies.jsx
try { (() => {
/** The label-versus-studies row — the site's one choreographed motif. The bottle's claim
    renders first, a line draws through it, what the studies found fades in beneath. */
function LabelVsStudies({
  claim,
  found,
  chip,
  animate = true,
  delay = 300,
  style
}) {
  const [phase, setPhase] = React.useState(animate ? 0 : 2);
  React.useEffect(() => {
    if (!animate) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase(2);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), delay);
    const t2 = setTimeout(() => setPhase(2), delay + 480);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [animate, delay]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "\u201C", claim, "\u201D"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 0,
      top: '55%',
      height: 1.5,
      background: 'var(--bucket-avoid)',
      width: phase >= 1 ? '100%' : 0,
      transition: 'width var(--dur-reveal) var(--ease-settle)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, "The label")), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: phase >= 2 ? 1 : 0,
      transform: phase >= 2 ? 'none' : 'translateY(4px)',
      transition: 'opacity var(--dur-slow) var(--ease-fade), transform var(--dur-slow) var(--ease-settle)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-1) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-ui)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, found), chip && /*#__PURE__*/React.createElement(__ds_scope.StudyChip, chip)));
}
Object.assign(__ds_scope, { LabelVsStudies });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/LabelVsStudies.jsx", error: String((e && e.message) || e) }); }

// components/evidence/PlainStat.jsx
try { (() => {
/** A plain-language statistic at display scale — the finding in everyday words,
    figures in tabular lining figures, provenance in one quiet line beneath. */
/* CASING RULE: the figure carries the sentence's capital ("About 7 minutes"); `text` is a
   lower-case continuation ("faster to sleep, on average") — the two render as ONE sentence.
   A lowercase figure reads as a typo at display scale. */
function PlainStat({
  figure,
  text,
  source,
  chip,
  size = 'md',
  style
}) {
  const fontSize = size === 'lg' ? 'var(--display-lg)' : size === 'sm' ? 'var(--display-sm)' : 'var(--display-md)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize,
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-body)',
      textWrap: 'pretty',
      maxWidth: '24ch'
    }
  }, figure, figure && text ? ' ' : '', text), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-1) var(--space-3)'
    }
  }, source && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-muted)'
    }
  }, source), chip && /*#__PURE__*/React.createElement(__ds_scope.StudyChip, chip)));
}
Object.assign(__ds_scope, { PlainStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/PlainStat.jsx", error: String((e && e.message) || e) }); }

// components/evidence/StudyField.jsx
try { (() => {
const SIZES = {
  hero: {
    bar: 12,
    captionSize: 'var(--text-base)',
    showKey: true,
    gap: 'var(--space-3)'
  },
  thumb: {
    bar: 6,
    captionSize: 'var(--text-xs)',
    showKey: false,
    gap: 'var(--space-2)'
  },
  share: {
    bar: 20,
    captionSize: 'var(--text-lg)',
    showKey: true,
    gap: 'var(--space-4)'
  }
};
const papers = n => `${n} ${n === 1 ? 'paper' : 'papers'}`;

/* Copy is written independently per size — every string must survive being read cold,
   with no surrounding sentence. The noun is always present ("papers", never bare "5 of 14").
   "Verify" copy direction: the paper PUBLISHED results, and WE could VERIFY them. */

function longCaption3(cited, sleep, verifiable, subject) {
  const lead = subject ? `${subject}: ` : '';
  if (sleep === 0) return `${lead}${papers(cited)} on this remedy — none measured sleep.`;
  if (verifiable === 0) return `${lead}Of ${papers(cited)}, ${sleep} measured sleep, but none published results we could verify.`;
  return `${lead}Of ${papers(cited)}, ${sleep} measured sleep, and ${verifiable} published results we could verify.`;
}
function shortCaption3(cited, sleep, verifiable) {
  if (sleep === 0) return `None of ${papers(cited)} measured sleep`;
  if (verifiable === 0) return `${sleep} of ${papers(cited)} measured sleep — none we could verify`;
  return `${sleep} of ${papers(cited)} measured sleep; ${verifiable} we could verify`;
}
function longCaption2(cited, sleep, subject) {
  const lead = subject ? `${subject}: ` : '';
  if (sleep === 0) return `${lead}${papers(cited)} on this remedy — none measured sleep.`;
  return `${lead}${sleep} of ${papers(cited)} measured sleep.`;
}
function shortCaption2(cited, sleep, verifiable) {
  if (sleep === 0) return `None of ${papers(cited)} measured sleep`;
  if (verifiable === 0) return `${sleep} of ${papers(cited)} measured sleep — none we could verify`;
  return `${sleep} of ${papers(cited)} measured sleep; ${verifiable} we could verify`;
}
function verifyDetail(sleep, verifiable) {
  if (sleep === 0) return null;
  if (verifiable === 0) return `None of the ${sleep} published enough detail for us to verify their results.`;
  return `We could verify the results of ${verifiable} of those ${sleep}.`;
}
function directionLine(verifiable, helped) {
  if (helped == null || verifiable === 0) return null;
  if (verifiable === 1) return helped === 1 ? 'The one result we could verify found an improvement.' : `The one result we could verify didn't find an improvement.`;
  const who = helped === verifiable ? `all ${verifiable}` : helped === 0 ? 'none' : `${helped}`;
  return `Of the ${verifiable} results we could verify, ${who} found an improvement.`;
}
function KeyItem({
  swatch,
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-meta)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 12,
      height: 12,
      borderRadius: 'var(--radius-xs)',
      flex: 'none',
      ...swatch
    }
  }), label);
}

/** The research filter — the signature evidence visual. One nested bar; boundaries are
    transparent hairline gaps (structure, not tone). Two variants:
    'three' (default) — full track = papers cited · 35% = measured sleep · solid = published
    results we could verify. The third tier is the integrity promise made visible.
    'two' — bar carries cited / measured sleep only; the verify count moves to an expandable
    detail line beneath.
    Copy is authored per size, standalone; the noun is always present. Direction is one plain
    sentence (`helped`), never a chart. Honest at n=0 and n=20; sparse is the normal case.
    A serious-concern safety flag always outranks the visual. The muted remainder is always
    labelled exactly "didn't measure sleep" — never anything implying weak evidence. */
function StudyField({
  counts = {
    cited: 0,
    sleep: 0,
    verifiable: 0
  },
  helped,
  size = 'hero',
  variant = 'three',
  subject,
  safetyFlag,
  emptyText = 'No published papers yet.',
  style
}) {
  const cfg = SIZES[size] || SIZES.hero;
  const {
    cited = 0,
    sleep = 0,
    verifiable = 0
  } = counts;
  const [showDetail, setShowDetail] = React.useState(false);
  const flag = safetyFlag ? /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'baseline',
      background: 'var(--amber-tint)',
      border: 'var(--border-w) solid var(--amber-line)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-2) var(--space-3)',
      fontFamily: 'var(--font-sans)',
      fontSize: size === 'thumb' ? 'var(--text-xs)' : 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--amber)',
      fontWeight: 'var(--weight-strong)',
      whiteSpace: 'nowrap'
    }
  }, "Safety concern \u2014"), /*#__PURE__*/React.createElement("span", null, safetyFlag)) : null;
  if (cited === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: cfg.gap,
        fontFamily: 'var(--font-sans)',
        ...style
      }
    }, flag, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: cfg.captionSize,
        color: 'var(--text-muted)'
      }
    }, emptyText));
  }
  const two = variant === 'two';
  const pct = n => `${Math.max(n / cited * 100, 0)}%`;
  const ariaLabel = two ? longCaption2(cited, sleep, subject) : longCaption3(cited, sleep, verifiable, subject);
  const caption = size === 'thumb' ? two ? shortCaption2(cited, sleep, verifiable) : shortCaption3(cited, sleep, verifiable) : two ? longCaption2(cited, sleep, subject) : longCaption3(cited, sleep, verifiable, subject);
  const detail = two && size !== 'thumb' ? verifyDetail(sleep, verifiable) : null;
  const dir = size === 'thumb' ? null : directionLine(verifiable, helped);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: cfg.gap,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, flag, /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": ariaLabel,
    style: {
      display: 'flex',
      gap: 'var(--border-w)',
      height: cfg.bar,
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden'
    }
  }, two ? sleep > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: pct(sleep),
      background: 'var(--evidence)'
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, verifiable > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: pct(verifiable),
      background: 'var(--evidence)'
    }
  }), sleep > verifiable && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: pct(sleep - verifiable),
      background: 'var(--evidence)',
      opacity: 0.35
    }
  })), cited > sleep && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: 'var(--surface-sunken)',
      boxShadow: 'inset 0 0 0 var(--border-w) var(--border-hairline)'
    }
  })), cfg.showKey && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-5)'
    }
  }, two ? /*#__PURE__*/React.createElement(KeyItem, {
    swatch: {
      background: 'var(--evidence)'
    },
    label: "Measured sleep"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeyItem, {
    swatch: {
      background: 'var(--evidence)'
    },
    label: "Results we could verify"
  }), /*#__PURE__*/React.createElement(KeyItem, {
    swatch: {
      background: 'var(--evidence)',
      opacity: 0.35
    },
    label: "Measured sleep"
  })), /*#__PURE__*/React.createElement(KeyItem, {
    swatch: {
      background: 'var(--surface-sunken)',
      border: 'var(--border-w) solid var(--border-hairline)'
    },
    label: "Didn't measure sleep"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: cfg.captionSize,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 'var(--leading-snug)',
      color: size === 'thumb' ? 'var(--text-muted)' : 'var(--text-body)',
      maxWidth: '56ch'
    }
  }, caption), detail && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowDetail(d => !d),
    "aria-expanded": showDetail,
    style: {
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      font: 'var(--weight-meta) var(--text-sm) var(--font-sans)',
      color: 'var(--text-link)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, showDetail ? 'Hide how many we could verify' : 'Show how many we could verify'), showDetail && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      maxWidth: '56ch'
    }
  }, detail)), dir && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: cfg.captionSize,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      maxWidth: '56ch'
    }
  }, dir));
}
Object.assign(__ds_scope, { StudyField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/StudyField.jsx", error: String((e && e.message) || e) }); }

// components/evidence/demo.jsx
try { (() => {
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included.
   PlainStat figure carries the sentence's capital (see its CASING RULE). */
function Demo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 'var(--space-5) var(--space-7)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "hero",
    counts: {
      cited: 14,
      sleep: 9,
      verifiable: 5
    },
    helped: 5
  }), /*#__PURE__*/React.createElement(__ds_scope.LabelVsStudies, {
    animate: false,
    claim: "Fall asleep 3\xD7 faster",
    found: "The studies found about 7 minutes, on average.",
    chip: {
      finding: 'People taking melatonin fell asleep about 7 minutes sooner than people taking a placebo.',
      people: 1683,
      year: 2013,
      lastChecked: '1 August 2026'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PlainStat, {
    size: "sm",
    figure: "About 7 minutes",
    text: "faster to sleep, on average",
    source: "From a review of 19 studies covering 1,683 people"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      paddingTop: 'var(--space-1)',
      borderTop: 'var(--border-w) solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: {
      cited: 2,
      sleep: 2,
      verifiable: 1
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: {
      cited: 5,
      sleep: 0,
      verifiable: 0
    },
    safetyFlag: "[Placeholder \u2014 serious safety concern wording, pending sourcing]"
  }), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: {
      cited: 4,
      sleep: 4,
      verifiable: 4
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: {
      cited: 0,
      sleep: 0,
      verifiable: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, "edge cases: sparse \xB7 nothing measured sleep (flag outranks) \xB7 everything measured \xB7 none"))));
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
function mountEvidenceDemo(el) {
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(Demo, null));
}
Object.assign(__ds_scope, { mountEvidenceDemo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/demo.jsx", error: String((e && e.message) || e) }); }

// components/evidence/filter-variants.demo.jsx
try { (() => {
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included. */
const C = {
  melatonin: {
    cited: 14,
    sleep: 9,
    verifiable: 5
  },
  kava: {
    cited: 5,
    sleep: 0,
    verifiable: 0
  },
  sparse: {
    cited: 2,
    sleep: 2,
    verifiable: 1
  },
  all: {
    cited: 9,
    sleep: 9,
    verifiable: 6
  }
};
function Col({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)',
      borderBottom: 'var(--border-w) solid var(--border-hairline)',
      paddingBottom: 'var(--space-2)'
    }
  }, title), children);
}
function Label({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)',
      marginBottom: 'calc(-1 * var(--space-2))'
    }
  }, children);
}
function Demo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-5) var(--space-7)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Col, {
    title: "(a) Three tiers \u2014 the verify count lives in the bar"
  }, /*#__PURE__*/React.createElement(Label, null, "Hero \u2014 melatonin"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    counts: C.melatonin,
    helped: 5
  }), /*#__PURE__*/React.createElement(Label, null, "Thumb (compact, standalone)"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: C.melatonin
  }), /*#__PURE__*/React.createElement(Label, null, "Edge: measured sleep, none verifiable"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: {
      cited: 5,
      sleep: 2,
      verifiable: 0
    }
  })), /*#__PURE__*/React.createElement(Col, {
    title: "(b) Two tiers \u2014 verify count expands beneath"
  }, /*#__PURE__*/React.createElement(Label, null, "Hero \u2014 melatonin"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    variant: "two",
    counts: C.melatonin,
    helped: 5
  }), /*#__PURE__*/React.createElement(Label, null, "Thumb (compact, standalone)"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    variant: "two",
    size: "thumb",
    counts: C.melatonin
  }), /*#__PURE__*/React.createElement(Label, null, "Edge: measured sleep, none verifiable"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    variant: "two",
    size: "thumb",
    counts: {
      cited: 5,
      sleep: 2,
      verifiable: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--space-6)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Edge: none measured sleep (kava) + flag"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: C.kava,
    safetyFlag: "[Placeholder \u2014 serious safety concern wording, pending sourcing]"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Edge: everything measured sleep"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: C.all
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Edge: no papers at all"), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: {
      cited: 0,
      sleep: 0,
      verifiable: 0
    }
  }))));
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
function mountFilterVariantsDemo(el) {
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(Demo, null));
}
Object.assign(__ds_scope, { mountFilterVariantsDemo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/filter-variants.demo.jsx", error: String((e && e.message) || e) }); }

// components/verdicts/BucketShape.jsx
try { (() => {
const SHAPES = {
  works: sw => /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6.5",
    fill: "currentColor"
  }),
  maybe: sw => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 8 a6 6 0 0 0 12 0 z",
    fill: "currentColor"
  })),
  unknown: sw => /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw
  }),
  avoid: sw => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3.8",
    y1: "12.2",
    x2: "12.2",
    y2: "3.8",
    stroke: "currentColor",
    strokeWidth: sw
  }))
};

/** The shared bucket glyph: disc / half disc / ring / struck ring. Colour comes from currentColor. */
function BucketShape({
  bucket = 'unknown',
  size = 16,
  strokeWidth = 1.6,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    "aria-hidden": "true",
    style: {
      flex: 'none',
      display: 'block',
      ...style
    }
  }, (SHAPES[bucket] || SHAPES.unknown)(strokeWidth));
}
Object.assign(__ds_scope, { BucketShape });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/verdicts/BucketShape.jsx", error: String((e && e.message) || e) }); }

// components/verdicts/BucketBadge.jsx
try { (() => {
const BUCKETS = {
  /* Labels name SLEEP explicitly. Bucket 3 says why nobody knows — the remedy hasn't failed,
     the research hasn't been done. Bucket 4 means the research says no; risk is the separate
     safety flag, never implied by the bucket.
     RULE (locked): a bucket describes ONLY what the research shows about effectiveness.
     Safety NEVER moves a bucket, in either direction. "Tested — doesn't seem to help sleep"
     requires papers that measured sleep and found no effect — kava (0 sleep papers, serious
     safety concern) sits in "Not properly tested", with the flag carrying the warning. */
  works: {
    plain: 'Helps most people sleep',
    evidence: 'Strong evidence',
    color: 'var(--bucket-works)',
    tint: 'var(--bucket-works-tint)',
    sentence: 'Solid studies show a real, if modest, benefit for most adults.'
  },
  maybe: {
    plain: 'May help sleep a little',
    evidence: 'Some evidence',
    color: 'var(--bucket-maybe)',
    tint: 'var(--bucket-maybe-tint)',
    sentence: 'A few studies point to a small benefit; it may not do much for you.'
  },
  unknown: {
    plain: 'Not properly tested for sleep',
    evidence: 'Not enough evidence',
    color: 'var(--bucket-unknown)',
    tint: 'var(--bucket-unknown-tint)',
    sentence: "The research hasn't been done — that's a gap in the studies, not a verdict on the remedy."
  },
  avoid: {
    plain: "Tested — doesn't seem to help sleep",
    evidence: 'Avoid',
    color: 'var(--bucket-avoid)',
    tint: 'var(--bucket-avoid-tint)',
    sentence: 'Decent studies looked and found little or no benefit for sleep.'
  }
};

/** Evidence-bucket badge. The explanatory sentence always displays beneath the label
    unless compact (chip-only, for dense rows where the sentence lives nearby). */
function BucketBadge({
  bucket = 'unknown',
  naming = 'plain',
  sentence,
  compact = false,
  style
}) {
  const b = BUCKETS[bucket] || BUCKETS.unknown;
  const chip = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      background: b.tint,
      color: b.color,
      borderRadius: 'var(--radius-pill)',
      padding: 'var(--space-2) var(--space-3)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
    bucket: bucket,
    size: 14
  }), b[naming] || b.plain);
  if (compact) return chip;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--space-2)',
      ...style
    }
  }, chip, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      maxWidth: '46ch'
    }
  }, sentence || b.sentence));
}
Object.assign(__ds_scope, { BUCKETS, BucketBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/verdicts/BucketBadge.jsx", error: String((e && e.message) || e) }); }

// components/cards/BrandResultRow.jsx
try { (() => {
/** Brand result row — a brand in search results: BrandMark, name, how many products assessed,
    and a quiet strip of their products' ingredient buckets. */
function BrandResultRow({
  name,
  image,
  productCount,
  buckets = [],
  href = '#',
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      minHeight: 'var(--hit-target)',
      padding: 'var(--space-3) var(--space-4)',
      textDecoration: 'none',
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--radius-sm)',
      background: hover ? 'var(--surface-card)' : 'transparent',
      transition: 'background var(--dur-fast) var(--ease-settle)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: name,
    src: image,
    size: 36
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, productCount === 0 ? 'No products assessed yet' : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, productCount), " product", productCount === 1 ? '' : 's', " assessed"))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 'var(--space-1)'
    },
    "aria-label": buckets.length ? `Verdicts so far: ${buckets.join(', ')}` : undefined
  }, buckets.slice(0, 6).map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      color: (__ds_scope.BUCKETS[b] || __ds_scope.BUCKETS.unknown).color
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
    bucket: b,
    size: 12
  })))), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--text-faint)',
      fontSize: 'var(--text-sm)'
    }
  }, "\u203A"));
}
Object.assign(__ds_scope, { BrandResultRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/BrandResultRow.jsx", error: String((e && e.message) || e) }); }

// components/cards/RemedyCard.jsx
try { (() => {
/** Remedy card — one ingredient: verdict, its plain sentence, and the research filter thumb.
    A safety flag on the research outranks the visual (rendered first by StudyField). */
/* SYSTEM RULE: every bucket badge links to "How we grade", deep-linked to its bucket section
   — methodology at the moment of doubt. The card is a stretched link (overlay anchor inside
   the title) so the badge's own link nests validly; pass onGrade to enable it. */
function RemedyCard({
  name,
  bucket = 'unknown',
  naming = 'plain',
  sentence,
  research = {
    counts: {
      cited: 0,
      sleep: 0,
      verifiable: 0
    }
  },
  safetyFlag,
  meta,
  href = '#',
  onClick,
  onGrade,
  gradeHref = '#how-we-grade',
  style
}) {
  const [hover, setHover] = React.useState(false);
  const badge = /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: bucket,
    naming: naming,
    sentence: sentence
  });
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      background: 'var(--surface-card)',
      border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--space-5)',
      transition: 'border-color var(--dur-fast) var(--ease-settle)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-strong)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-body)',
      textDecoration: 'none'
    }
  }, name, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-md)'
    }
  })), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap'
    }
  }, meta)), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: research.counts,
    safetyFlag: safetyFlag
  }), onGrade ? /*#__PURE__*/React.createElement("a", {
    href: gradeHref,
    title: "How we grade",
    onClick: e => {
      e.preventDefault();
      e.stopPropagation();
      onGrade(bucket);
    },
    style: {
      position: 'relative',
      zIndex: 1,
      alignSelf: 'flex-start',
      textDecoration: 'none'
    }
  }, badge) : badge);
}
Object.assign(__ds_scope, { RemedyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/RemedyCard.jsx", error: String((e && e.message) || e) }); }

// components/verdicts/ProductScoreBadge.jsx
try { (() => {
const CRITERIA = [{
  key: 'dose',
  label: 'Dose matches what studies used'
}, {
  key: 'tested',
  label: 'Independently tested by a third party'
}, {
  key: 'disclosed',
  label: 'Label discloses everything'
}, {
  key: 'form',
  label: 'The form that was actually studied'
}];

/* PLACEHOLDER RULE — needs an owner. The ONE definition of the product-verdict threshold:
   "passes" = at least this many of the four checks. Criteria are unlikely to be equally
   weighted (dose-match outranks label disclosure). Do not tune in design. Every consumer
   (ProductScoreBadge, VerdictPill in ProductListRow, the product-page verdict line) imports
   this constant — never a second copy. */
const PASSES_THRESHOLD = 3;
function Mark({
  met
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    "aria-hidden": "true",
    style: {
      flex: 'none',
      marginTop: 'var(--space-1)'
    }
  }, met ? /*#__PURE__*/React.createElement("path", {
    d: "M2.5 7.5 L5.5 10.5 L11.5 3.5",
    fill: "none",
    stroke: "var(--sage)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }) : /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "7",
    x2: "11",
    y2: "7",
    stroke: "var(--text-faint)",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }));
}

/** Product score: how many factual checks the bottle passes, with the breakdown visible. */
function ProductScoreBadge({
  criteria = {},
  showBreakdown = true,
  style
}) {
  const met = CRITERIA.filter(c => criteria[c.key]).length;
  const strong = met >= PASSES_THRESHOLD;
  const color = strong ? 'var(--sage-text)' : met >= 2 ? 'var(--bucket-maybe)' : 'var(--bucket-avoid)';
  const tint = strong ? 'var(--sage-tint)' : met >= 2 ? 'var(--bucket-maybe-tint)' : 'var(--bucket-avoid-tint)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 'var(--space-2)',
      background: tint,
      color,
      borderRadius: 'var(--radius-pill)',
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, met, " of ", CRITERIA.length), " checks pass"), showBreakdown && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, CRITERIA.map(c => /*#__PURE__*/React.createElement("li", {
    key: c.key,
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      alignItems: 'flex-start',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)',
      color: criteria[c.key] ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    met: !!criteria[c.key]
  }), /*#__PURE__*/React.createElement("span", null, c.label, !criteria[c.key] && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, " \u2014 no"))))));
}
Object.assign(__ds_scope, { CRITERIA, PASSES_THRESHOLD, ProductScoreBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/verdicts/ProductScoreBadge.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProductCard.jsx
try { (() => {
/** Product card with three completeness states: fully assessed / label known but not yet
    assessed / not in database. Incomplete states are stated plainly, never dressed up.
    A product carries either a strength ("1 mg") or a blend descriptor — on its own line,
    never duplicated into the name. */
function ProductCard({
  name,
  brand,
  strength,
  blend,
  image,
  state = 'assessed',
  bucket,
  criteria = {},
  lastChecked,
  href = '#',
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    textDecoration: 'none',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-5)',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color var(--dur-fast) var(--ease-settle)',
    ...style
  };
  const head = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: brand,
    src: image,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-muted)'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-strong)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-body)',
      lineHeight: 'var(--leading-snug)'
    }
  }, name), (strength || blend) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-meta)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-muted)'
    }
  }, strength || `Blend — ${blend}`)));
  if (state === 'notFound') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...base,
        border: 'var(--border-w) dashed var(--border-strong)',
        boxShadow: 'none',
        background: 'transparent'
      }
    }, head, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-body)',
        color: 'var(--text-muted)'
      }
    }, "We haven't looked at this product yet \u2014 it isn't in our database."), /*#__PURE__*/React.createElement("a", {
      href: href,
      onClick: onClick,
      style: {
        font: '600 var(--text-sm) var(--font-sans)',
        color: 'var(--text-link)'
      }
    }, "Ask us to check it"));
  }
  if (state === 'labelOnly') {
    return /*#__PURE__*/React.createElement("a", {
      href: href,
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        ...base,
        border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
        boxShadow: 'var(--shadow-card)'
      }
    }, head, /*#__PURE__*/React.createElement("span", {
      style: {
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'var(--surface-sunken)',
        color: 'var(--text-muted)',
        borderRadius: 'var(--radius-pill)',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-strong)',
        lineHeight: 1
      }
    }, "Label known \u2014 not yet assessed"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-snug)',
        color: 'var(--text-muted)'
      }
    }, "We know what's on the label, but we haven't checked it against the studies yet."));
  }
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      border: `var(--border-w) solid ${hover ? 'var(--border-strong)' : 'var(--border-hairline)'}`,
      boxShadow: 'var(--shadow-card)'
    }
  }, head, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, bucket && /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: bucket,
    compact: true
  }), /*#__PURE__*/React.createElement(__ds_scope.ProductScoreBadge, {
    criteria: criteria,
    showBreakdown: false
  })), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, __ds_scope.CRITERIA.map(c => /*#__PURE__*/React.createElement("li", {
    key: c.key,
    style: {
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)',
      display: 'flex',
      gap: 'var(--space-2)',
      color: criteria[c.key] ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: criteria[c.key] ? 'var(--sage)' : 'var(--text-faint)',
      fontWeight: 'var(--weight-strong)'
    }
  }, criteria[c.key] ? '✓' : '—'), c.label))), lastChecked && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-meta)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-faint)'
    }
  }, "Last checked ", lastChecked));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProductListRow.jsx
try { (() => {
/* The dense-list product row (C3): 104px square thumbnail · brand / name / strength ·
   the four checks · verdict pill. Hairline-separated rows, no cards. Chosen over an
   image-forward grid because the placeholder is the common case (most products will never
   have photography) and the checks are the reason the page exists.
   The checks are LABELLED IN PLACE at every size — a 2×2 grid of dot + short word — so a
   first-time visitor mid-scroll never needs a legend that has scrolled away.
   On mobile the verdict pill moves BENEATH the name — it is the most important thing in
   the row and must never be what disappears on a phone.
   All four assessment states get identical treatment: failing products are labelled,
   never hidden or visually punished. */

const SHORT = {
  dose: 'Dose',
  tested: 'Tested',
  disclosed: 'Full label',
  form: 'Studied form'
};
function Dot({
  met
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 14 14",
    "aria-hidden": "true",
    style: {
      flex: 'none'
    }
  }, met ? /*#__PURE__*/React.createElement("path", {
    d: "M2.5 7.5 L5.5 10.5 L11.5 3.5",
    fill: "none",
    stroke: "var(--sage)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }) : /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "7",
    x2: "11",
    y2: "7",
    stroke: "var(--text-faint)",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }));
}
function ChecksGrid({
  criteria,
  style
}) {
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-1) var(--space-4)',
      ...style
    }
  }, __ds_scope.CRITERIA.map(c => /*#__PURE__*/React.createElement("li", {
    key: c.key,
    title: c.label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      whiteSpace: 'nowrap',
      color: criteria[c.key] ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Dot, {
    met: !!criteria[c.key]
  }), SHORT[c.key])));
}
function VerdictPill({
  criteria,
  status = 'assessed'
}) {
  const pill = {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 'var(--space-1)',
    borderRadius: 'var(--radius-pill)',
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: 'nowrap'
  };
  if (status === 'label-known') return /*#__PURE__*/React.createElement("span", {
    style: {
      ...pill,
      background: 'var(--surface-sunken)',
      color: 'var(--text-muted)',
      border: 'var(--border-w) solid var(--border-hairline)'
    }
  }, "Not yet assessed");
  if (status === 'not-in-db') return /*#__PURE__*/React.createElement("span", {
    style: {
      ...pill,
      background: 'var(--surface-sunken)',
      color: 'var(--text-muted)',
      border: 'var(--border-w) solid var(--border-hairline)'
    }
  }, "Not in our database");
  const met = __ds_scope.CRITERIA.filter(c => criteria[c.key]).length;
  /* pill colour follows the ONE placeholder threshold — PASSES_THRESHOLD in ProductScoreBadge
     (needs an owner; do not tune in design). The amber/avoid steps below it are demo-only. */
  const color = met >= __ds_scope.PASSES_THRESHOLD ? 'var(--sage-text)' : met >= 2 ? 'var(--bucket-maybe)' : 'var(--bucket-avoid)';
  const tint = met >= __ds_scope.PASSES_THRESHOLD ? 'var(--sage-tint)' : met >= 2 ? 'var(--bucket-maybe-tint)' : 'var(--bucket-avoid-tint)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...pill,
      background: tint,
      color
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, met, " of ", __ds_scope.CRITERIA.length), " checks pass");
}

/* SCHEMA RULE: name and strength are separate structured fields — the name NEVER contains
   the dose ("Melatonin melts" + "1 mg per melt", never "Melatonin melts 1 mg"). Baking the
   dose into the name renders it twice and breaks form/strength filtering. Drifted twice;
   enforce at the data boundary. */
function ProductListRow({
  brand,
  name,
  strength,
  criteria,
  status = 'assessed',
  src,
  mobile = false,
  onClick
}) {
  const assessed = status === 'assessed';
  const statusLine = status === 'label-known' ? "We have the label, but haven't run the checks yet." : status === 'not-in-db' ? "Not in our database yet — tell us about it and we'll add it." : null;
  const nameBlock = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-muted)'
    }
  }, brand), /*#__PURE__*/React.createElement("a", {
    href: "#product",
    onClick: e => {
      e.preventDefault();
      onClick && onClick();
    },
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-strong)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-body)',
      textDecoration: 'none',
      lineHeight: 'var(--leading-snug)'
    }
  }, name), strength && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, strength), mobile && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement(VerdictPill, {
    criteria: criteria,
    status: status
  })));
  if (mobile) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '104px minmax(0, 1fr)',
        gap: 'var(--space-3) var(--space-4)',
        padding: 'var(--space-4) 0',
        borderTop: 'var(--border-w) solid var(--border-hairline)',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
      name: brand,
      src: src,
      size: 104,
      radius: "var(--radius-md)"
    }), nameBlock, assessed ? /*#__PURE__*/React.createElement(ChecksGrid, {
      criteria: criteria,
      style: {
        gridColumn: '1 / -1'
      }
    }) : /*#__PURE__*/React.createElement("p", {
      style: {
        gridColumn: '1 / -1',
        margin: 0,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, statusLine));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '104px minmax(0, 1fr) 230px 150px',
      alignItems: 'center',
      gap: 'var(--space-5)',
      padding: 'var(--space-4) 0',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: brand,
    src: src,
    size: 104,
    radius: "var(--radius-md)"
  }), nameBlock, assessed ? /*#__PURE__*/React.createElement(ChecksGrid, {
    criteria: criteria
  }) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, statusLine), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'end'
    }
  }, /*#__PURE__*/React.createElement(VerdictPill, {
    criteria: criteria,
    status: status
  })));
}
Object.assign(__ds_scope, { VerdictPill, ProductListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProductListRow.jsx", error: String((e && e.message) || e) }); }

// components/cards/demo.jsx
try { (() => {
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included. */
const melatonin = {
  counts: {
    cited: 14,
    sleep: 9,
    verifiable: 5
  }
};
function Demo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-4)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.RemedyCard, {
    name: "Melatonin",
    bucket: "works",
    meta: "14 sources",
    research: melatonin
  }), /*#__PURE__*/React.createElement(__ds_scope.ProductCard, {
    state: "assessed",
    brand: "Somnia Labs",
    name: "Melatonin gummies",
    strength: "10 mg",
    bucket: "works",
    criteria: {
      dose: false,
      tested: true,
      disclosed: true,
      form: true
    },
    lastChecked: "14 July 2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductCard, {
    state: "labelOnly",
    brand: "Dreamwell",
    name: "Sleep complex",
    blend: "6 ingredients, 2 undisclosed"
  }), /*#__PURE__*/React.createElement(__ds_scope.ProductCard, {
    state: "notFound",
    brand: "Nightcap Co",
    name: "Deep sleep drops"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / 3',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandResultRow, {
    name: "Somnia Labs",
    productCount: 4,
    buckets: ['works', 'maybe', 'unknown', 'avoid']
  }), /*#__PURE__*/React.createElement(__ds_scope.BrandResultRow, {
    name: "Nightcap Co",
    productCount: 0
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.WhereToBuyRow, {
    retailer: "Walgreens",
    price: "$14.99",
    disclosure: "Somnary earns nothing from this link."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: "Somnia Labs"
  }), /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: "Dreamwell"
  }), /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: "Nightcap Co"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, "BrandMark \u2014 the placeholder is the common case"))));
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
function mountCardsDemo(el) {
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(Demo, null));
}
Object.assign(__ds_scope, { mountCardsDemo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/demo.jsx", error: String((e && e.message) || e) }); }

// components/verdicts/PairedVerdict.jsx
try { (() => {
function bottomLine(bucket, met, ingredientName) {
  const name = ingredientName || 'the ingredient';
  const productStrong = met >= 3;
  const ingredientStrong = bucket === 'works';
  if (ingredientStrong && productStrong) return {
    text: `Worth buying — ${name} works, and this bottle gives you what was studied.`,
    color: 'var(--bucket-works)'
  };
  if (productStrong) return {
    text: bucket === 'maybe' ? `A well-made bottle of something that only helps a little.` : bucket === 'avoid' ? `A well-made bottle of something the studies say doesn't help sleep.` : `A well-made bottle of something not properly tested for sleep.`,
    color: 'var(--text-body)'
  };
  if (ingredientStrong) return {
    text: `${name.charAt(0).toUpperCase() + name.slice(1)} works — but this bottle doesn't give you what was studied.`,
    color: 'var(--text-body)'
  };
  return {
    text: bucket === 'avoid' ? 'Skip this one.' : 'Neither the ingredient nor this bottle earns it.',
    color: 'var(--bucket-avoid)'
  };
}

/** The paired verdict: both questions answered side by side, never merged into one score,
    with a one-sentence bottom line. Mismatch states are the point. */
function PairedVerdict({
  bucket = 'unknown',
  criteria = {},
  ingredientName,
  productName,
  naming = 'plain',
  bucketSentence,
  style
}) {
  const met = __ds_scope.CRITERIA.filter(c => criteria[c.key]).length;
  const line = bottomLine(bucket, met, ingredientName);
  const cell = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    minWidth: 0,
    flex: '1 1 220px'
  };
  const q = {
    margin: 0,
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-5) var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cell
  }, /*#__PURE__*/React.createElement("p", {
    style: q
  }, "Does ", ingredientName || 'the ingredient', " work?"), /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: bucket,
    naming: naming,
    sentence: bucketSentence
  })), /*#__PURE__*/React.createElement("div", {
    style: cell
  }, /*#__PURE__*/React.createElement("p", {
    style: q
  }, "Does ", productName ? 'this bottle' : 'the product', " deliver it?"), /*#__PURE__*/React.createElement(__ds_scope.ProductScoreBadge, {
    criteria: criteria
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      paddingTop: 'var(--space-4)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--leading-snug)',
      fontWeight: 'var(--weight-ui)',
      letterSpacing: 'var(--tracking-display)',
      color: line.color,
      textWrap: 'pretty'
    }
  }, line.text));
}
Object.assign(__ds_scope, { PairedVerdict });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/verdicts/PairedVerdict.jsx", error: String((e && e.message) || e) }); }

// components/verdicts/demo.jsx
try { (() => {
/* SYSTEM RULE: all spacing uses --space-* tokens — no raw pixel spacing, demos included. */
function Demo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4) var(--space-7)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: "works"
  }), /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: "unknown"
  }), /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: "avoid",
    compact: true
  }), /*#__PURE__*/React.createElement(__ds_scope.ProductScoreBadge, {
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: false
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PairedVerdict, {
    bucket: "unknown",
    ingredientName: "valerian",
    productName: "x",
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.PairedVerdict, {
    bucket: "works",
    ingredientName: "melatonin",
    productName: "x",
    criteria: {
      dose: false,
      tested: false,
      disclosed: true,
      form: true
    }
  })));
}
/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
function mountVerdictsDemo(el) {
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(Demo, null));
}
Object.assign(__ds_scope, { mountVerdictsDemo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/verdicts/demo.jsx", error: String((e && e.message) || e) }); }

// ds-loader.js
try { (() => {
/* ds-loader: loads somnary components for card/kit HTMLs.
   Prefers the compiled _ds_bundle.js when present; otherwise fetches the .jsx sources,
   transpiles with Babel standalone, and evaluates the module graph. */
(function () {
  const abs = (p, base) => new URL(p, base || location.href).href;
  async function fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status + ' ' + url);
    return r.text();
  }
  function findNamespace(probe) {
    for (const k of Object.keys(window)) {
      try {
        const v = window[k];
        if (v && typeof v === 'object' && v[probe]) return v;
      } catch (e) {}
    }
    return null;
  }
  window.loadDS = async function (entries, opts) {
    opts = opts || {};
    const probe = opts.probe || 'BucketShape';
    // 1) try the compiled bundle
    const bundleUrl = abs(opts.bundle || (document.currentScript ? '' : '') || '_ds_bundle.js', opts.base || location.href);
    try {
      const code = await fetchText(bundleUrl);
      (0, eval)(code);
      const ns = findNamespace(probe);
      if (ns) return ns;
    } catch (e) {/* no bundle — compile from sources */}
    // 2) compile from sources
    const sources = {};
    const IMP = /import\s+[^'"]*?from\s*['"]([^'"]+)['"];?/g;
    async function collect(url) {
      if (sources[url]) return;
      const src = await fetchText(url);
      const deps = [];
      let m;
      const re = new RegExp(IMP.source, 'g');
      while (m = re.exec(src)) {
        const d = m[1];
        if (d !== 'react' && d !== 'react-dom' && d !== 'react-dom/client') deps.push(abs(d, url));
      }
      sources[url] = {
        src,
        deps
      };
      await Promise.all(deps.map(collect));
    }
    const entryUrls = entries.map(e => abs(e, opts.base || location.href));
    await Promise.all(entryUrls.map(collect));
    const mods = {};
    function evalMod(url) {
      if (mods[url]) return mods[url].exports;
      const code = Babel.transform(sources[url].src, {
        presets: [['env', {
          modules: 'commonjs'
        }], ['react', {
          runtime: 'classic'
        }]],
        filename: url
      }).code;
      const module = {
        exports: {}
      };
      mods[url] = module;
      const req = rel => rel === 'react' ? window.React : rel === 'react-dom' || rel === 'react-dom/client' ? window.ReactDOM : evalMod(abs(rel, url));
      new Function('require', 'module', 'exports', code)(req, module, module.exports);
      return module.exports;
    }
    const DS = {};
    for (const u of entryUrls) Object.assign(DS, evalMod(u));
    return DS;
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-loader.js", error: String((e && e.message) || e) }); }

// ui_kits/site/BrandPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* /brands/dreamwell — one question: "Can I trust this brand's bottles?" — answered the
   Somnary way: DERIVED from the per-product checks, never an editorial opinion or a brand
   score. The counts ARE the sentence; no adjectives ("a good brand", "trusted") anywhere.
   NOT ON THIS PAGE, ever: anything resembling a brand rating, grade, or seal — Somnary
   scores BOTTLES, not companies; a brand page is an aggregation of bottle facts. When most
   products fail, the honest summary carries it — the page never softens it and never
   editorialises beyond the counts.
   Three routes land here: the product breadcrumb, the brand link in the product header,
   and BrandResultRow in search. */

/* SCHEMA RULE: name and strength are separate structured fields — the name never contains
   the dose (see ProductListRow). All entries fictional demo data. */
const BRANDS = {
  dreamwell: {
    key: 'dreamwell',
    name: 'Dreamwell',
    /* brand-wide certification renders ONLY as a fact line with its register link —
       a fact about scope ("every product"), never a seal, badge, or trust graphic */
    certification: {
      text: 'Every Dreamwell product we list has been independently tested by a third party.',
      register: '[Placeholder — testing register link pending verification]'
    },
    labelSource: '[Placeholder — where Dreamwell label data comes from (own labels, retailer listings), pending verification]',
    batchResults: '[Placeholder — whether Dreamwell publishes batch test results, pending verification]',
    recalls: null,
    products: [{
      key: 'dreamwell-melts',
      view: 'melts',
      brand: 'Dreamwell',
      name: 'Melatonin melts',
      strength: '1 mg per melt',
      criteria: {
        dose: true,
        tested: true,
        disclosed: true,
        form: true
      }
    }, {
      key: 'dreamwell-complex',
      view: 'complex',
      brand: 'Dreamwell',
      name: 'Sleep complex',
      strength: 'Blend — 6 ingredients, amounts not disclosed',
      criteria: {
        dose: false,
        tested: true,
        disclosed: false,
        form: true
      }
    }],
    lastChecked: '14 July 2026'
  },
  /* edge state: ONE product — the summary sentence and list must read complete, not broken */
  somnol: {
    key: 'somnol',
    name: 'Somnol',
    certification: null,
    labelSource: '[Placeholder — where Somnol label data comes from, pending verification]',
    batchResults: '[Placeholder — whether Somnol publishes batch test results, pending verification]',
    recalls: null,
    products: [
    /* keys are unique and truthful; `view` names the demo product-page view where one
       exists — only Dreamwell's two products have built pages */
    {
      key: 'somnol-spray',
      brand: 'Somnol',
      name: 'Melatonin spray',
      strength: '[Strength pending assessment]',
      status: 'label-known'
    }],
    lastChecked: '14 July 2026'
  },
  /* edge state: most products fail — the summary carries it ("3 products checked — 0 pass
     every check, 3 we'd tell you to skip"), stated as counts, never softened, no
     editorial beyond them. Also the recall-on-record state: the recalls row renders ONLY
     here; absence of the row is the good state, never "no recalls!" as a boast */
  herbwell: {
    key: 'herbwell',
    name: 'Herbwell',
    certification: null,
    labelSource: '[Placeholder — where Herbwell label data comes from, pending verification]',
    batchResults: '[Placeholder — whether Herbwell publishes batch test results, pending verification]',
    recalls: '[Placeholder — recall or regulatory action on record, with date and regulator link, pending verification]',
    products: [{
      key: 'herbwell-night-blend',
      brand: 'Herbwell',
      name: 'Night blend',
      strength: 'Blend — amounts not disclosed',
      criteria: {
        dose: false,
        tested: false,
        disclosed: false,
        form: false
      }
    }, {
      key: 'herbwell-valerian',
      brand: 'Herbwell',
      name: 'Valerian capsules',
      strength: '400 mg per capsule',
      criteria: {
        dose: false,
        tested: false,
        disclosed: true,
        form: true
      }
    }, {
      key: 'herbwell-chamomile-tea',
      brand: 'Herbwell',
      name: 'Chamomile tea',
      strength: 'Not stated on label',
      criteria: {
        dose: false,
        tested: false,
        disclosed: false,
        form: false
      }
    }],
    lastChecked: '14 July 2026'
  }
};
const met = p => p.criteria ? Object.values(p.criteria).filter(Boolean).length : -1;

/* HONEST SUMMARY LINE — derived from the data, stated as counts, not adjectives.
   Grammar bends to the count: 1 → "1 product checked — it passes every check";
   skip-count appears only when > 0 ("2 we'd tell you to skip"). Assessed = has criteria;
   label-known products are counted as "not yet assessed", never as passes or failures. */
function summaryLine(products) {
  const assessed = products.filter(p => p.criteria);
  const pending = products.length - assessed.length;
  const pass = assessed.filter(p => met(p) === 4).length;
  const skip = assessed.filter(p => met(p) < __ds_scope.PASSES_THRESHOLD).length;
  const n = products.length;
  if (n === 1 && pending === 1) return '1 product on record — not yet assessed.';
  if (n === 1) return `1 product checked — it ${met(assessed[0]) === 4 ? 'passes every check' : met(assessed[0]) >= __ds_scope.PASSES_THRESHOLD ? `passes ${met(assessed[0])} of 4 checks` : "fails our checks; we'd tell you to skip it"}.`;
  let s = `${assessed.length} products checked — ${pass} pass${pass === 1 ? 'es' : ''} every check`;
  if (skip > 0) s += `, ${skip} we'd tell you to skip`;
  if (pending > 0) s += `; ${pending} more on record, not yet assessed`;
  return s + '.';
}
function useDesktop() {
  const [d, setD] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = e => setD(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return d;
}
const body = {
  margin: 0,
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text-body)',
  maxWidth: 'var(--measure)'
};
const muted = {
  ...body,
  color: 'var(--text-muted)'
};
function BrandPage({
  go,
  goProduct,
  goGrade,
  which = 'dreamwell'
}) {
  const desktop = useDesktop();
  const b = BRANDS[which] || BRANDS.dreamwell;
  const sorted = [...b.products].sort((a, c) => met(c) - met(a) || a.name.localeCompare(c.name));
  /* SYSTEM RULE: chrome scales with catalogue size — under ~20 items no filter row, no sort;
     the list is the interface (see ProductsPage). No demo brand is near threshold. */
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 880,
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    mobile: !desktop,
    current: b.name,
    trail: [{
      label: 'Products',
      onClick: () => go('products')
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      alignItems: 'center',
      padding: 'var(--space-2) 0 var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: b.name,
    size: desktop ? 120 : 88,
    radius: "var(--radius-lg)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)'
    }
  }, b.name), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      fontVariantNumeric: 'tabular-nums'
    }
  }, summaryLine(b.products)), b.certification && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, b.certification.text, ' ', /*#__PURE__*/React.createElement("a", {
    href: "#register",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, b.certification.register)))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-1)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)'
    }
  }, "Their products we know about"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, sorted.length === 1 ? 'The one product of theirs in our database.' : 'Most checks passed first — including anything we\'d tell you to skip.'), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: 'var(--border-w) solid var(--border-hairline)'
    }
  }, sorted.map(p =>
  /*#__PURE__*/
  /* rows without a built demo product page are non-links — never route a demo
     product to another product's page */
  React.createElement(__ds_scope.ProductListRow, _extends({
    key: p.key
  }, p, {
    mobile: !desktop,
    onClick: p.view && goProduct ? () => goProduct(p.view) : undefined
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-8)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-4)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)'
    }
  }, "What we know about ", b.name), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, [['Label data', b.labelSource], ['Batch test results', b.batchResults], ...(b.recalls ? [['On record', b.recalls]] : [])].map(([label, text]) => /*#__PURE__*/React.createElement("li", {
    key: label,
    style: {
      display: 'grid',
      gridTemplateColumns: desktop ? '160px minmax(0, 1fr)' : '1fr',
      gap: 'var(--space-1) var(--space-5)',
      padding: 'var(--space-3) 0',
      borderTop: 'var(--border-w) solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, text))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)',
      background: 'var(--surface-sunken)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      maxWidth: 'var(--measure)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Spotted something wrong?"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-1)',
      fontSize: 'var(--text-sm)'
    }
  }, "Brands change hands, formulations, and labels. ", /*#__PURE__*/React.createElement("a", {
    href: "#report",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Tell us"), " and we'll re-check.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LastChecked, {
    date: b.lastChecked,
    prefix: "This page last checked"
  }))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }));
}
Object.assign(__ds_scope, { BrandPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/BrandPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/GradePage.jsx
try { (() => {
/* /how-we-grade — the one page allowed real terminology, each term introduced in plain words
   first: plain on the surface, technical detail behind expandables. Readers arrive mid-question
   from a bucket badge, so the badge meanings sit at the top, before any preamble.
   Deep links: #works #maybe #unknown #avoid #two-questions #product-score #verify #sources
   #recheck #errors #independence. Grading thresholds and ops specifics not yet signed off are
   marked [placeholder] — never invented. */

const body = {
  margin: 0,
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text-body)',
  maxWidth: 'var(--measure)'
};
const muted = {
  ...body,
  color: 'var(--text-muted)'
};
function Disclose({
  label = 'the technical detail',
  children
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      font: 'var(--weight-ui) var(--text-sm) var(--font-sans)',
      color: 'var(--text-link)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, open ? `Hide ${label}` : `Show ${label}`), open && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, children));
}
function H2({
  id,
  children
}) {
  return /*#__PURE__*/React.createElement("h2", {
    id: id,
    style: {
      margin: '0 0 var(--space-4)',
      fontSize: 'var(--display-sm)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)'
    }
  }, children);
}
const BUCKET_EXPLAINERS = [{
  key: 'works',
  plain: 'More than one well-run study measured sleep, we could verify the results, and they point the same way.',
  tech: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "\"Well-run\" means a randomised controlled trial: people are randomly split into a group that gets the remedy and a group that gets a placebo \u2014 a dummy identical in appearance \u2014 so the only difference between groups is the remedy itself. Observational studies can support the middle grades, but only trials can put a remedy here."), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "\"Point the same way\" is about the effect size \u2014 how big the improvement is, not just whether one exists. Small, consistent effects across studies count for more than one dramatic result."), /*#__PURE__*/React.createElement("p", {
    style: muted
  }, "[Placeholder \u2014 exact thresholds (study count, sample size, effect size floor) pending methodology sign-off.]"))
}, {
  key: 'maybe',
  plain: 'Some verified results show a small benefit — but too few, or in too few people, to be confident it would help you.',
  tech: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Typically one or two verifiable studies with small samples, or mixed results where the better-run studies show less. The honest reading of \"statistically significant but small\" is: might help a little."), /*#__PURE__*/React.createElement("p", {
    style: muted
  }, "[Placeholder \u2014 exact thresholds pending methodology sign-off.]"))
}, {
  key: 'unknown',
  plain: "Too few papers measured sleep at all — or none published enough detail to verify. The remedy hasn't failed a test; the test hasn't been run.",
  tech: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Most remedies sit here. A paper \"measures sleep\" when it reports a sleep outcome \u2014 time to fall asleep, time awake at night, total sleep \u2014 rather than stress, mood, or anything else. Papers on other outcomes may be good science; they just can't answer this question."))
}, {
  key: 'avoid',
  plain: 'Decent studies measured sleep and found little or no benefit. This grade is about what the research found — risk is the separate safety flag.',
  tech: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Landing here requires papers that measured sleep and found no meaningful effect. Safety never moves a bucket, in either direction \u2014 a serious concern shows as the separate flag above the grades, whatever the evidence says."))
}];
const CRITERIA_EXPLAINERS = [{
  key: 'dose',
  plain: 'The amount in one serving falls inside the range the studies actually used.',
  tech: 'Compared per serving as the label directs, against the doses used in the verifiable studies. More is not better — a bottle can fail this check from above.'
}, {
  key: 'tested',
  plain: 'An independent laboratory confirmed what the bottle contains.',
  tech: 'Third-party testing means a lab with no stake in sales verified identity and amount. Manufacturers\u2019 own certificates don\u2019t pass this check on their own. [Placeholder — accepted testing organisations pending list.]'
}, {
  key: 'disclosed',
  plain: 'Every ingredient and its amount is on the label.',
  tech: 'A "proprietary blend" is a labelling device that gives a total weight for a mix without the amount of each ingredient — which makes the dose check impossible. Any proprietary blend fails this check.'
}, {
  key: 'form',
  plain: 'The bottle uses the same form of the ingredient the studies used.',
  tech: 'The same ingredient can come as different salts, extracts, or preparations, and the body absorbs them differently — its bioavailability. A studied result only carries to the form that was studied.'
}];
function GradePage({
  go,
  section
}) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = e => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  React.useEffect(() => {
    if (!section) {
      window.scrollTo(0, 0);
      return;
    }
    const t = setTimeout(() => {
      const el = document.getElementById(section);
      if (el) window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 16
      });
    }, 60);
    return () => clearTimeout(t);
  }, [section]);
  const jump = id => e => {
    e.preventDefault();
    if ('#' + id === location.hash) {
      history.replaceState(null, '', '#');
    }
    location.hash = id;
  };
  const sec = {
    paddingTop: 'var(--space-9)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    mobile: !desktop,
    current: "How we grade",
    trail: [{
      label: 'Somnary',
      onClick: () => go('home')
    }]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 'var(--space-1) 0 var(--space-2)',
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)'
    }
  }, "How we grade"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginBottom: 'var(--space-4)'
    }
  }, "You probably tapped a badge. Here's what it means \u2014 the short answer first, the technical detail behind each fold."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--text-sm)'
    }
  }, [['two-questions', 'Two questions'], ['product-score', 'The product score'], ['verify', '"Results we could verify"'], ['flags', 'The ingredient flags'], ['study-types', 'What kinds of studies count'], ['popularity', 'Why popularity isn\u2019t evidence'], ['sources', 'Where information comes from'], ['recheck', 'Rechecking'], ['errors', 'Report an error'], ['independence', 'Independence']].map(([id, label]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: '#' + id,
    onClick: jump(id),
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-ui)'
    }
  }, label))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(H2, {
    id: "badges"
  }, "The four grades"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, BUCKET_EXPLAINERS.map(x => {
    const b = __ds_scope.BUCKETS[x.key];
    return /*#__PURE__*/React.createElement("div", {
      key: x.key,
      id: x.key,
      style: {
        background: 'var(--surface-card)',
        border: 'var(--border-w) solid var(--border-hairline)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        color: b.color,
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--weight-strong)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
      bucket: x.key,
      size: 16
    }), b.plain), /*#__PURE__*/React.createElement("p", {
      style: body
    }, x.plain), /*#__PURE__*/React.createElement(Disclose, null, x.tech));
  }))), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "two-questions"
  }, "Two questions, never one score"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Every page answers two things separately: does the ingredient work, and does this specific bottle give you what was studied. They're kept apart because a true answer to one says nothing about the other \u2014 a well-made bottle of something useless is still useless, and a proven ingredient at the wrong dose is still the wrong bottle."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-3)'
    }
  }, "Safety is a third thing, not part of either. A safety flag isn't a grade \u2014 it's a warning that sits above the grades and outranks them. A remedy can sit in any bucket and still carry one.")), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "product-score"
  }, "The product score, check by check"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginBottom: 'var(--space-4)'
    }
  }, "Four factual checks, each visible on the product's page. No weighting, no hidden formula \u2014 the checks are the score."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, CRITERIA_EXPLAINERS.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.key,
    style: {
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, __ds_scope.CRITERIA[i].label), /*#__PURE__*/React.createElement("p", {
    style: body
  }, c.plain), /*#__PURE__*/React.createElement(Disclose, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, c.tech)))))), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "flags"
  }, "The ingredient flags"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Every ingredient on a product page carries one of three flags. \"No known concern\" \u2014 no documented evidence of harm at the labelled amounts (not a guarantee). \"Worth knowing\" \u2014 something documented is worth your attention before a nightly habit; it includes one standing policy: non-sugar sweeteners are always worth knowing in a daily-use product [placeholder \u2014 WHO 2023 guideline pending verification]. \"Documented concern\" \u2014 published evidence of harm, linked to its paper."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-3)'
    }
  }, "The concern list is editorial, cited, and public \u2014 every flag links to what earned it. The boundary holds both ways: a flag never says \"bad\" or \"avoid\" without a documented concern, for the same reason an untested remedy is never called useless. The verdict follows the evidence in both directions.")), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "verify"
  }, "What \"results we could verify\" means"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "A result counts as verified when the paper published enough detail \u2014 how many people, what was measured, what the numbers were \u2014 that we could check the finding ourselves rather than take the abstract's word for it."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-3)'
    }
  }, "Most papers don't qualify, and the reasons are mundane: roughly half the papers people cite about sleep remedies don't measure sleep at all, and of those that do, about a third don't publish enough detail to check. That's why the evidence bar on every remedy page has three tiers \u2014 and why the solid part is usually short."), /*#__PURE__*/React.createElement(Disclose, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Verification means recomputing the headline result from the published numbers \u2014 group sizes, means and spreads, or event counts \u2014 and checking it against the paper's stated conclusion. Papers behind paywalls are bought, not skipped. A meta-analysis (a study that pools the results of many studies) is verified against its included trials."), /*#__PURE__*/React.createElement("p", {
    style: muted
  }, "[Placeholder \u2014 full verification protocol pending methodology sign-off.]"))), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "study-types"
  }, "What kinds of studies count"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Three kinds of paper can carry evidence here: a trial (people are given the remedy or a placebo, and the difference is measured), a review of several studies pooled together, and an observational study (researchers watch what people already do and what happens to them)."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-3)'
    }
  }, "Observational studies count, and can support the middle grades \u2014 but they can't put a remedy in the top grade on their own. That takes trials. The reason is plain: an observational study shows that two things go together; a trial shows that one causes the other. Sleep is especially prone to the difference, because people who sleep well differ from people who don't in dozens of ways \u2014 anything those people also happen to take will look like it works."), /*#__PURE__*/React.createElement(Disclose, null, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Every paper in a remedy's list is labelled with its kind, in the same plain words, so you can see whether a remedy's evidence is trials or observational at a glance. \"Trial\" here means a randomised controlled trial; \"observational study\" covers cohort and similar designs \u2014 the technical names appear only in the sources list."))), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "popularity"
  }, "Why \u201Ceveryone uses it\u201D doesn't move a grade"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Sleep is unusually good at making inert things look effective, three ways at once. It responds strongly to expectation \u2014 believing you took something that helps genuinely helps, for a while. Bad sleep comes in stretches, so whatever you take on the worst night gets the credit when the stretch ends on its own. And memory of sleep is unreliable \u2014 people are often wrong about how long they slept, in both directions."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-3)'
    }
  }, "Put together, those three can build a convincing consensus around something that does nothing. That's not a flaw in the people reporting \u2014 it's why the grade only moves on studies designed to cancel those effects out.")), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "sources"
  }, "Where the information comes from"), /*#__PURE__*/React.createElement("ul", {
    style: {
      ...body,
      margin: 0,
      paddingLeft: '1.2em',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("li", null, "Government label databases \u2014 what a product legally declares."), /*#__PURE__*/React.createElement("li", null, "Independent testing organisations \u2014 what's actually in the bottle."), /*#__PURE__*/React.createElement("li", null, "Manufacturers' own test results \u2014 used, but never sufficient on their own."), /*#__PURE__*/React.createElement("li", null, "Published research \u2014 the studies every claim links to."))), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "recheck"
  }, "How often it's rechecked"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Every page shows when it was last checked, in plain sight. When an entry goes too long without a recheck, it's flagged as stale on the page itself rather than quietly left standing."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-3)'
    }
  }, "[Placeholder \u2014 recheck cadence and staleness threshold pending operations sign-off.]")), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "errors"
  }, "Report an error"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "If a number, a link, or a claim looks wrong, tell us \u2014 corrections are logged on the page they fix."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-3)'
    }
  }, "[Placeholder \u2014 error-report route pending.]")), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(H2, {
    id: "independence"
  }, "Independence"), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "No supplement company pays Somnary, and no brand can influence a score. Nobody pays us to say any of this; every claim links to the study it came from."))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, null));
}
Object.assign(__ds_scope, { GradePage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/GradePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/HomePage.jsx
try { (() => {
/* Homepage data — real corpus numbers; ordered by verifiable count so the
   near-empty bars cluster at the end and the row reads as a ranking. */
const REMEDIES = [{
  name: 'Melatonin',
  bucket: 'works',
  counts: {
    cited: 12,
    sleep: 5,
    verifiable: 3
  },
  tags: 'sleep onset jet lag'
}, {
  name: 'Magnesium',
  bucket: 'maybe',
  counts: {
    cited: 9,
    sleep: 2,
    verifiable: 2
  },
  tags: 'sleep waking'
}, {
  name: 'L-theanine',
  bucket: 'maybe',
  counts: {
    cited: 8,
    sleep: 2,
    verifiable: 2
  },
  tags: 'sleep calm tea'
}, {
  name: 'Valerian',
  bucket: 'unknown',
  counts: {
    cited: 11,
    sleep: 3,
    verifiable: 1
  },
  tags: 'sleep sedative herb'
}, {
  name: 'Chamomile',
  bucket: 'unknown',
  counts: {
    cited: 6,
    sleep: 2,
    verifiable: 1
  },
  tags: 'sleep tea calm'
}, {
  name: 'Ashwagandha',
  bucket: 'unknown',
  counts: {
    cited: 7,
    sleep: 1,
    verifiable: 0
  },
  tags: 'sleep stress',
  safetyFlag: '[Placeholder — real safety wording pending sourcing]'
}];
/* SCHEMA RULE: product name and strength are separate structured fields — the name never
   contains the dose (see ProductListRow). */
const PRODUCTS = [{
  brand: 'Dreamwell',
  name: 'Sleep complex',
  note: 'Label known — not yet assessed',
  tags: 'sleep blend'
}, {
  brand: 'Nightcap Co',
  name: 'Deep sleep drops',
  note: 'Not in our database yet',
  tags: 'sleep drops'
}, {
  brand: 'Somnia Labs',
  name: 'Melatonin',
  note: '4 of 4 checks pass',
  bucket: 'works',
  tags: 'sleep melatonin'
}];
const BRANDS = [{
  name: 'Somnia Labs',
  note: '4 products assessed',
  tags: 'sleep melatonin'
}, {
  name: 'Dreamwell',
  note: '2 products assessed',
  tags: 'sleep blend'
}];
const PROBLEMS = [{
  name: "I can't fall asleep",
  tags: 'sleep onset'
}, {
  name: 'I keep waking at 3am',
  tags: 'sleep waking night'
}];
const SITUATIONS = ["I can't fall asleep", 'I keep waking at 3am', "I bought a sleep blend and can't read the label", "I'm thinking about melatonin", 'I take medication', 'This is for my child'];
function match(q, ...fields) {
  const s = q.trim().toLowerCase();
  return s.length >= 3 && fields.some(f => (f || '').toLowerCase().includes(s));
}

/* ---- search resolution — the principle: NEVER SHOW AN ARBITRARY SUBSET OF A LARGE SET.
   A query that resolves to one item returns that item as the answer (tier 1) with related
   routes (tier 2) and everything else collapsed (tier 3). A query that matches a CATEGORY
   returns the category — a count row or a browse route — never a sample of its members.
   Products list individually only when the query names one (brand token, dose, product word). */
const SEARCH_INDEX = [...REMEDIES.map(r => ({
  ...r,
  page: {
    Melatonin: 'melatonin',
    Magnesium: 'magnesium',
    Valerian: 'valerian',
    Chamomile: 'chamomile'
  }[r.name]
})), {
  name: 'Kava',
  bucket: 'unknown',
  counts: {
    cited: 5,
    sleep: 0,
    verifiable: 0
  },
  tags: 'stress calm',
  safetyFlag: '[Placeholder — serious safety concern pending sourcing]',
  page: 'kava'
}, {
  name: 'Bacopa',
  bucket: 'unknown',
  counts: {
    cited: 0,
    sleep: 0,
    verifiable: 0
  },
  tags: ''
}, {
  name: 'Taurine',
  bucket: 'unknown',
  counts: {
    cited: 0,
    sleep: 0,
    verifiable: 0
  },
  tags: ''
}];
/* per-remedy product counts — demo values (melatonin's 12/3 from the brief) */
const PRODUCT_COUNTS = {
  Melatonin: {
    checked: 12,
    pass: 3
  }
};
const RELATED_PROBLEMS = {
  Melatonin: ["I can't fall asleep"],
  Magnesium: ['I keep waking at 3am'],
  Valerian: ["I can't fall asleep"]
};
const BROAD = ['sleep', 'insomnia', 'remedy', 'remedies', 'supplement', 'supplements', 'natural'];
const PRODUCT_WORDS = ['drops', 'melts', 'gummies', 'capsules', 'complex', 'blend', 'tea'];
function edit(a, b) {
  /* Levenshtein, for "did you mean" — people type "ashwaganda" and "melatonine" constantly */
  const m = Array.from({
    length: a.length + 1
  }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}
function resolveQuery(qRaw) {
  const q = qRaw.trim().toLowerCase();
  if (q.length < 3) return null;
  if (BROAD.some(t => t === q || t.startsWith(q))) return {
    kind: 'category'
  };
  const starts = SEARCH_INDEX.filter(r => r.name.toLowerCase().startsWith(q));
  const partial = SEARCH_INDEX.filter(r => r.name.toLowerCase().includes(q) || match(q, r.tags));
  const problems = PROBLEMS.filter(p => match(q, p.name, p.tags));
  const namesProduct = /\d+\s*mg\b/.test(q) || PRODUCT_WORDS.some(w => w.startsWith(q) || q.includes(w));
  const brands = BRANDS.filter(b => match(q, b.name));
  const products = namesProduct || brands.length > 0 ? PRODUCTS.filter(p => match(q, p.name, p.brand, p.tags)) : [];
  if (starts.length === 1) {
    const r = starts[0];
    return {
      kind: 'answer',
      remedy: r,
      problems: RELATED_PROBLEMS[r.name] || [],
      more: [...partial.filter(x => x !== r), ...brands.map(b => ({
        brand: b
      }))],
      moreProblems: problems
    };
  }
  if (partial.length + problems.length + brands.length + products.length > 0) return {
    kind: 'list',
    remedies: partial,
    problems,
    brands,
    products
  };
  const best = [...SEARCH_INDEX.map(r => r.name), ...PROBLEMS.map(p => p.name)].map(n => ({
    n,
    d: edit(q, n.toLowerCase())
  })).sort((a, b) => a.d - b.d)[0];
  return {
    kind: 'nomatch',
    suggestion: best && best.d <= Math.max(2, Math.floor(q.length / 4)) ? best.n : null
  };
}

/* ---- result rows — one grid for every row type: 28px lead column (glyph or mark), text
   at a shared left edge, meta right-aligned; hairline above each group label. */
function GroupLabel({
  first,
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: first ? 0 : 'var(--space-2) 0 0',
      padding: 'var(--space-3) var(--space-4) var(--space-1)',
      borderTop: first ? 'none' : 'var(--border-w) solid var(--border-hairline)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-muted)'
    }
  }, children);
}
function ResultRow({
  onClick,
  lead,
  meta,
  strong = false,
  children
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#remedy",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'grid',
      gridTemplateColumns: '28px minmax(0, 1fr) auto',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minHeight: 'var(--control-md)',
      padding: 'var(--space-2) var(--space-4)',
      textDecoration: 'none',
      color: 'var(--text-body)',
      background: hover ? 'var(--surface-sunken)' : 'transparent',
      transition: 'background var(--dur-fast) var(--ease-settle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, lead), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: strong ? 'var(--weight-strong)' : 'var(--weight-ui)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      fontSize: 'var(--text-sm)'
    }
  }, meta, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "\u203A")));
}
function BucketMeta({
  remedy
}) {
  const b = __ds_scope.BUCKETS[remedy.bucket] || __ds_scope.BUCKETS.unknown;
  return /*#__PURE__*/React.createElement(React.Fragment, null, remedy.safetyFlag && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-strong)',
      color: 'var(--amber)',
      whiteSpace: 'nowrap'
    }
  }, "Safety concern"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-strong)',
      color: b.color,
      whiteSpace: 'nowrap'
    }
  }, b.plain));
}
function BrowseAllRow({
  go
}) {
  return /*#__PURE__*/React.createElement(ResultRow, {
    strong: true,
    lead: /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
      bucket: "unknown",
      size: 13
    }),
    onClick: e => {
      e.preventDefault();
      go('remedies');
    }
  }, "Browse all 31 remedies, graded");
}
function SearchResults({
  query,
  go,
  goRemedy,
  goBrand,
  openProblem
}) {
  const res = resolveQuery(query);
  const [showMore, setShowMore] = React.useState(false);
  React.useEffect(() => {
    setShowMore(false);
  }, [query]);
  if (!res) return null;
  const openR = r => e => {
    e.preventDefault();
    goRemedy(r.page || 'melatonin');
  };
  /* brand result rows land on the brand page — one of its three live routes; unbuilt demo
     brands fall back to the dreamwell view inside BrandPage */
  const openB = b => e => {
    e.preventDefault();
    goBrand && goBrand(b.name.split(' ')[0].toLowerCase());
  };
  const panel = {
    position: 'absolute',
    zIndex: 40,
    top: 'calc(100% + var(--space-2))',
    left: 0,
    right: 0,
    background: 'var(--surface-card)',
    border: 'var(--border-w) solid var(--border-hairline)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-pop)',
    overflow: 'hidden',
    paddingBottom: 'var(--space-2)',
    textAlign: 'left'
  };
  if (res.kind === 'category') {
    /* a broad query matches everything we cover — return the category, never a sample */
    return /*#__PURE__*/React.createElement("div", {
      role: "listbox",
      "aria-label": "Search results",
      style: panel
    }, /*#__PURE__*/React.createElement(GroupLabel, {
      first: true
    }, "That matches everything we cover \u2014 start from the problem, or browse"), PROBLEMS.map(p => /*#__PURE__*/React.createElement(ResultRow, {
      key: p.name,
      lead: null,
      onClick: openProblem
    }, p.name)), /*#__PURE__*/React.createElement(BrowseAllRow, {
      go: go
    }));
  }
  if (res.kind === 'nomatch') {
    return /*#__PURE__*/React.createElement("div", {
      role: "listbox",
      "aria-label": "Search results",
      style: panel
    }, /*#__PURE__*/React.createElement(GroupLabel, {
      first: true
    }, "Nothing matches \u201C", query.trim(), "\u201D"), res.suggestion && /*#__PURE__*/React.createElement(ResultRow, {
      strong: true,
      lead: null,
      onClick: e => {
        e.preventDefault();
      }
    }, "Did you mean ", res.suggestion, "?"), /*#__PURE__*/React.createElement(BrowseAllRow, {
      go: go
    }));
  }
  if (res.kind === 'answer') {
    const r = res.remedy;
    const b = __ds_scope.BUCKETS[r.bucket] || __ds_scope.BUCKETS.unknown;
    const pc = PRODUCT_COUNTS[r.name];
    const moreCount = res.more.length + res.moreProblems.length;
    return /*#__PURE__*/React.createElement("div", {
      role: "listbox",
      "aria-label": "Search results",
      style: panel
    }, /*#__PURE__*/React.createElement("a", {
      href: "#remedy",
      onClick: openR(r),
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-4)',
        textDecoration: 'none',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 'var(--space-2) var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--weight-strong)',
        letterSpacing: 'var(--tracking-display)'
      }
    }, r.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-strong)',
        color: b.color
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
      bucket: r.bucket,
      size: 13
    }), b.plain), r.safetyFlag && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-strong)',
        color: 'var(--amber)'
      }
    }, "Safety concern")), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
      size: "thumb",
      counts: r.counts
    }), pc && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, pc.checked, " ", r.name.toLowerCase(), " products checked \u2014 ", pc.pass, " give you what was studied \u2192")), res.problems.length > 0 && /*#__PURE__*/React.createElement(GroupLabel, null, "Related"), res.problems.map(name => /*#__PURE__*/React.createElement(ResultRow, {
      key: name,
      lead: null,
      onClick: openProblem
    }, name)), moreCount > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setShowMore(s => !s),
      "aria-expanded": showMore,
      style: {
        display: 'grid',
        gridTemplateColumns: '28px 1fr',
        alignItems: 'center',
        gap: 'var(--space-3)',
        width: '100%',
        minHeight: 'var(--control-md)',
        padding: 'var(--space-2) var(--space-4)',
        textAlign: 'left',
        border: 'none',
        borderTop: 'var(--border-w) solid var(--border-hairline)',
        background: 'transparent',
        font: 'var(--weight-ui) var(--text-sm) var(--font-sans)',
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        textAlign: 'center'
      }
    }, showMore ? '−' : '+'), showMore ? 'Hide other matches' : `More matches (${moreCount})`), showMore && res.more.map(m => m.brand ? /*#__PURE__*/React.createElement(ResultRow, {
      key: m.brand.name,
      lead: /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
        name: m.brand.name,
        size: 24
      }),
      onClick: openR({}),
      meta: /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, m.brand.note)
    }, m.brand.name) : /*#__PURE__*/React.createElement(ResultRow, {
      key: m.name,
      lead: /*#__PURE__*/React.createElement("span", {
        style: {
          color: (__ds_scope.BUCKETS[m.bucket] || __ds_scope.BUCKETS.unknown).color
        }
      }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
        bucket: m.bucket,
        size: 13
      })),
      onClick: openR(m),
      meta: /*#__PURE__*/React.createElement(BucketMeta, {
        remedy: m
      })
    }, m.name)), showMore && res.moreProblems.map(p => /*#__PURE__*/React.createElement(ResultRow, {
      key: p.name,
      lead: null,
      onClick: openProblem
    }, p.name)));
  }
  /* kind === 'list' — ambiguous query: aligned rows, grouped with hairlines; products only
     because the query named one (brand token, dose, or product word) */
  return /*#__PURE__*/React.createElement("div", {
    role: "listbox",
    "aria-label": "Search results",
    style: panel
  }, res.remedies.length > 0 && /*#__PURE__*/React.createElement(GroupLabel, {
    first: true
  }, "Remedies"), res.remedies.map(r => /*#__PURE__*/React.createElement(ResultRow, {
    key: r.name,
    lead: /*#__PURE__*/React.createElement("span", {
      style: {
        color: (__ds_scope.BUCKETS[r.bucket] || __ds_scope.BUCKETS.unknown).color
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
      bucket: r.bucket,
      size: 13
    })),
    onClick: openR(r),
    meta: /*#__PURE__*/React.createElement(BucketMeta, {
      remedy: r
    })
  }, r.name)), res.products.length > 0 && /*#__PURE__*/React.createElement(GroupLabel, {
    first: res.remedies.length === 0
  }, "Products"), res.products.map(p => /*#__PURE__*/React.createElement(ResultRow, {
    key: p.brand + p.name,
    lead: /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
      name: p.brand,
      bucket: p.bucket,
      size: 24
    }),
    onClick: openR({}),
    meta: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.brand, " \xB7 ", p.note)
  }, p.name)), res.brands.length > 0 && /*#__PURE__*/React.createElement(GroupLabel, {
    first: res.remedies.length + res.products.length === 0
  }, "Brands"), res.brands.map(b => /*#__PURE__*/React.createElement(ResultRow, {
    key: b.name,
    lead: /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
      name: b.name,
      size: 24
    }),
    onClick: openB(b),
    meta: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, b.note)
  }, b.name)), res.problems.length > 0 && /*#__PURE__*/React.createElement(GroupLabel, {
    first: res.remedies.length + res.products.length + res.brands.length === 0
  }, "Problems"), res.problems.map(p => /*#__PURE__*/React.createElement(ResultRow, {
    key: p.name,
    lead: null,
    onClick: openProblem
  }, p.name)));
}
function HomePage({
  go,
  goGrade,
  goRemedy,
  goBrand
}) {
  const [query, setQuery] = React.useState('sleep');
  const open = e => {
    e.preventDefault();
    go('remedy');
  };
  const gR = goRemedy || (() => go('remedy'));
  /* SYSTEM RULE (nav): three items — Remedies · Products · Safety — plus ever-present search.
     Problems are reached by search, the situation cards below, and cross-links from remedy
     pages; How we grade is reached from every bucket badge and the footer. Never re-add
     them to the chrome. Safety points at the Safety page (built next). */
  const nav = ['Remedies', 'Products', 'Safety'];
  const h2 = {
    margin: '0 0 var(--space-4)',
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--weight-heading)',
    letterSpacing: 'var(--tracking-display)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--space-3) var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => e.preventDefault(),
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-1)',
      marginLeft: 'auto'
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: n === 'Remedies' ? '#remedies' : '#',
    onClick: e => {
      e.preventDefault();
      if (n === 'Remedies') go('remedies');else if (n === 'Products') go('products');else if (n === 'Safety') go('safety');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 'var(--control-md)',
      padding: '0 var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      color: 'var(--text-muted)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-ui)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--surface-sunken)';
      e.currentTarget.style.color = 'var(--text-body)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-muted)';
    }
  }, n)))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-6)',
      padding: 'var(--space-10) 0 var(--space-6)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-body)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-body)',
      maxWidth: '44ch',
      textWrap: 'pretty'
    }
  }, "Somnary tells you whether a sleep remedy actually works \u2014 and whether the bottle in your hand delivers it."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 'var(--search-max)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    value: query,
    onChange: setQuery,
    onSubmit: () => go('remedy'),
    autoFocus: true
  }), /*#__PURE__*/React.createElement(SearchResults, {
    query: query,
    go: go,
    goRemedy: gR,
    goBrand: goBrand,
    openProblem: e => {
      e.preventDefault();
      go('problem');
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#safety",
    onClick: e => {
      e.preventDefault();
      go('safety');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      minHeight: 'var(--control-md)',
      padding: 'var(--space-2) var(--space-4)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--amber-tint)',
      border: 'var(--border-w) solid var(--amber-line)',
      textDecoration: 'none',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-ui)',
      color: 'var(--text-body)',
      textAlign: 'left',
      lineHeight: 'var(--leading-snug)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Taking medications, pregnant, or thinking about this for a child?"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-strong)',
      color: 'var(--amber)',
      whiteSpace: 'nowrap'
    }
  }, "Start here \u203A"))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingBottom: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Or start with what's going on"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--space-3)'
    }
  }, SITUATIONS.map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: s === 'I keep waking at 3am' ? '#problem' : '#remedy',
    onClick: s === 'I keep waking at 3am' ? e => {
      e.preventDefault();
      go('problem');
    } : open,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      minHeight: 'var(--control-lg)',
      padding: 'var(--space-3) var(--space-4)',
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-body)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-ui)',
      lineHeight: 'var(--leading-snug)',
      transition: 'border-color var(--dur-fast) var(--ease-settle)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-hairline)';
    }
  }, s, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--text-faint)'
    }
  }, "\u203A"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingBottom: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "The ones people ask about most"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 'var(--space-4)'
    }
  }, REMEDIES.map(r => /*#__PURE__*/React.createElement(__ds_scope.RemedyCard, {
    key: r.name,
    onClick: open,
    name: r.name,
    bucket: r.bucket,
    research: {
      counts: r.counts
    },
    safetyFlag: r.safetyFlag,
    onGrade: goGrade,
    href: "#remedy"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingBottom: 'var(--space-10)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PlainStat, {
    figure: "About 7 minutes",
    text: "faster to sleep, on average \u2014 the best-supported remedy we cover",
    source: "Melatonin, from a review of 19 studies covering 1,683 people",
    chip: {
      finding: 'People taking melatonin fell asleep about 7 minutes sooner, on average, than people taking a placebo.',
      people: 1683,
      year: 2013,
      linkText: 'Read the review (19 studies)',
      lastChecked: '1 August 2026'
    }
  }))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: 'var(--border-w) solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: 'var(--space-7) var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure)'
    }
  }, "Nobody pays us to say any of this. Every claim links to the study it came from."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-5)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#badges",
    onClick: e => {
      e.preventDefault();
      goGrade && goGrade();
    },
    style: {
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-ui)'
    }
  }, "How we grade"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "Last updated 10 August 2026"))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, null)));
}
Object.assign(__ds_scope, { HomePage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/HomePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/ProblemPage.jsx
try { (() => {
/* /problems/waking-at-3am — a Google landing page, not a nav destination. The reader arrives
   at 3am on a phone knowing nothing about Somnary: orientation in one line, answer structure
   immediately, never a diagnosis, never a recommendation. All medical/effectiveness copy is
   [placeholder] pending medical review — the design ships the shape, not the claims. */

const body = {
  margin: 0,
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text-body)',
  maxWidth: 'var(--measure)'
};
const muted = {
  ...body,
  color: 'var(--text-muted)'
};
const h2 = {
  margin: '0 0 var(--space-4)',
  fontSize: 'var(--display-sm)',
  fontWeight: 'var(--weight-heading)',
  letterSpacing: 'var(--tracking-display)',
  lineHeight: 'var(--leading-snug)'
};

/* Audited remedies whose common use covers staying asleep / night waking. None sit in the
   top bucket — the honest order puts that fact first. */
const RELEVANT = [{
  key: 'magnesium',
  name: 'Magnesium',
  bucket: 'maybe',
  counts: {
    cited: 9,
    sleep: 2,
    verifiable: 2
  }
}, {
  key: 'valerian',
  name: 'Valerian',
  bucket: 'unknown',
  counts: {
    cited: 11,
    sleep: 3,
    verifiable: 1
  }
}, {
  key: 'chamomile',
  name: 'Chamomile',
  bucket: 'unknown',
  counts: {
    cited: 6,
    sleep: 2,
    verifiable: 1
  }
}];
function Orientation() {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      maxWidth: '48ch'
    }
  }, "Somnary is an independent reference on sleep remedies \u2014 no company pays us, and every claim links to the study behind it.");
}
function DoctorCard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      maxWidth: 'var(--measure)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "When it's worth seeing a doctor"), /*#__PURE__*/React.createElement("p", {
    style: muted
  }, "[Placeholder \u2014 plain-language list of signs that this is worth a conversation with a doctor, pending medical review. Calm, specific, no urgency theatre.]"));
}
function ProblemPage({
  go,
  goRemedy,
  goGrade,
  preview = false
}) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = e => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const container = {
    flex: 1,
    width: '100%',
    maxWidth: 'var(--page-max)',
    margin: '0 auto',
    padding: '0 var(--space-5) var(--space-9)'
  };
  const top = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go && go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), !preview && /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: '0 var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Breadcrumb, {
    mobile: !desktop,
    current: "I keep waking at 3am",
    trail: [{
      label: 'Problems',
      onClick: () => go && go('home')
    }]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 'var(--space-1) 0 0',
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      textWrap: 'pretty'
    }
  }, "I keep waking up at 3am")), /*#__PURE__*/React.createElement(Orientation, null), /*#__PURE__*/React.createElement(DoctorCard, null), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "[Placeholder \u2014 two short paragraphs on what's usually going on when sleep breaks in the middle of the night: written plainly, pending medical review. No diagnosis; an explanation of a situation.]")));
  if (preview) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, top);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, top, /*#__PURE__*/React.createElement("main", {
    style: container
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "What actually has evidence for this"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginBottom: 'var(--space-4)'
    }
  }, "Ordered by evidence. Nothing sits in the top bucket for this problem \u2014 that's the honest picture."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--space-4)'
    }
  }, RELEVANT.map(r => /*#__PURE__*/React.createElement(__ds_scope.RemedyCard, {
    key: r.key,
    name: r.name,
    bucket: r.bucket,
    research: {
      counts: r.counts
    },
    href: "#remedy",
    onClick: e => {
      e.preventDefault();
      goRemedy(r.key);
    },
    onGrade: goGrade
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Often recommended for this \u2014 and what the studies say"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      maxWidth: 'var(--measure)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LabelVsStudies, {
    claim: "Take melatonin when you wake at 3am",
    found: "[Placeholder \u2014 what the verified studies measured, pending write-up]",
    chip: {
      finding: '[Placeholder — finding pending write-up]',
      linkText: 'Read the study'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.LabelVsStudies, {
    animate: false,
    claim: "A nightcap helps you sleep through",
    found: "[Placeholder \u2014 what the studies found, pending write-up]",
    chip: {
      finding: '[Placeholder — finding pending write-up]',
      linkText: 'Read the study'
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Things that aren't supplements"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginBottom: 'var(--space-4)'
    }
  }, "Some non-supplement approaches have better evidence than most supplements do."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      maxWidth: 'var(--measure)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "CBT-I \u2014 cognitive behavioural therapy for insomnia"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-1)'
    }
  }, "A structured programme for changing how you sleep, usually over a few weeks. [Placeholder \u2014 evidence summary pending write-up.]")), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      fontSize: 'var(--text-sm)'
    }
  }, "[Placeholder \u2014 further non-supplement approaches pending medical review.]"))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 'var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "If you're considering a bottle"), /*#__PURE__*/React.createElement("a", {
    href: "#remedies",
    onClick: e => {
      e.preventDefault();
      go('remedies');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      minHeight: 'var(--control-md)',
      padding: '0 var(--space-5)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-strong)',
      textDecoration: 'none',
      font: 'var(--weight-strong) var(--text-base) var(--font-sans)',
      color: 'var(--text-body)'
    }
  }, "See which products deliver what was studied \u203A"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      fontSize: 'var(--text-sm)',
      marginTop: 'var(--space-3)'
    }
  }, "Every product gets the same four checks \u2014 including the ones we'd tell you to skip.")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-10)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-faint)'
    }
  }, "Share image this page produces (1200 \xD7 630, shown at half scale)"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 600,
      height: 315,
      maxWidth: '100%',
      background: 'var(--paper)',
      border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 18
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 34,
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      maxWidth: '16ch'
    }
  }, "I keep waking up at 3am"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      color: 'var(--text-muted)',
      maxWidth: '38ch'
    }
  }, "What actually has evidence \u2014 every claim linked to its study.")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "An independent reference. No company pays us."))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-faint)'
    }
  }, "Above the fold on a phone (390 \xD7 720) \u2014 how nearly everyone arrives"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      maxWidth: '100%',
      height: 720,
      overflow: 'hidden',
      background: 'var(--surface-page)',
      border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(ProblemPage, {
    preview: true,
    go: go,
    goRemedy: goRemedy,
    goGrade: goGrade
  })))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }));
}
Object.assign(__ds_scope, { ProblemPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/ProblemPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/ProductPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The product page — a DECISION NARRATIVE read top to bottom: no TOC, no sidebar; the
   section order is the argument. The one jump is "Where to buy ↓" in the header (the only
   high-intent jump on the page). "What people report" is deliberately NOT here — anecdote
   at the moment of purchase is where it does most damage; it lives on the remedy page
   behind the firewall. Two datasets: a pass-all product and a failing one (1 of 4) with
   identical structure — failed checks explained as plainly as passes, where-to-buy
   identical. All prices, protocols, certifier details and label notes are placeholders. */

const CHIP_7MIN = {
  finding: 'People taking melatonin fell asleep about 7 minutes sooner, on average, than people taking a placebo.',
  people: 1683,
  year: 2013,
  url: '#',
  linkText: 'Read the review (19 studies)',
  lastChecked: '14 July 2026'
};
const PASSING = {
  /* SCHEMA RULE: product name and strength are separate fields — the name never contains the dose. */
  key: 'melts',
  brand: 'Dreamwell',
  name: 'Melatonin melts',
  strengthLine: '1 mg per melt · Sublingual · 30 melts',
  priceLine: '$19.95 · $0.67 per night · lasts 30 nights',
  criteria: {
    dose: true,
    tested: true,
    disclosed: true,
    form: true
  },
  verdictLine: 'This bottle gives you what was studied.',
  dose: 1,
  dietary: ['Sugar-free', 'Gluten-free', 'Vegan', 'No artificial colours', 'Contains artificial sweeteners'],
  checks: [{
    key: 'dose',
    why: '1 mg sits inside the 0.5–3 mg range the research used. Most melatonin products sell 5–10 mg — more than was ever studied for sleep.',
    chip: CHIP_7MIN
  }, {
    key: 'tested',
    why: 'An independent laboratory confirmed the melatonin content matches the label. [Certifier details placeholder pending verification.]'
  }, {
    key: 'disclosed',
    why: 'Every ingredient and its amount is printed on the label — no proprietary blend hiding the numbers.'
  }, {
    key: 'form',
    why: 'Sublingual melts were used in [placeholder — studied-form citation pending]; this is the form the results describe.',
    chip: {
      finding: '[Placeholder — finding pending write-up]',
      linkText: 'Read the study'
    }
  }],
  ingredients: [{
    name: 'Melatonin',
    role: 'Active ingredient',
    amount: '1 mg',
    note: 'The studied dose range is 0.5–3 mg.',
    flag: 'none'
  }, {
    name: 'Mannitol',
    role: 'Bulking agent',
    amount: null,
    note: '[Placeholder note pending review]',
    flag: 'none'
  },
  /* POLICY (system-wide): non-sugar sweeteners are ALWAYS "Worth knowing" in a
     daily-use product — a stated policy, not a per-product judgement. Basis:
     [placeholder — WHO 2023 guideline on non-sugar sweeteners, pending verification].
     The boundary holds both ways: a flag never says "bad" or "avoid" without a
     documented concern. */
  {
    name: 'Sucralose',
    role: 'Sweetener',
    amount: null,
    note: "Policy: non-sugar sweeteners are always worth knowing about in a product designed to be taken every night — anything in it, you're having daily. [Placeholder — WHO 2023 guideline on non-sugar sweeteners, pending verification.]",
    flag: 'worth'
  }, {
    name: 'Peppermint oil',
    role: 'Flavour',
    amount: null,
    note: '[Placeholder note pending review]',
    flag: 'none'
  }],
  allergens: 'Per the label: no gluten, lactose, soy, nuts, or shellfish.',
  alternatives: [{
    brand: 'Somnia Labs',
    name: 'Melatonin',
    why: 'Cheaper per night',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }, {
    brand: 'Nightcap Co',
    name: 'Melatonin drops',
    why: 'Lower dose',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }],
  retailers: [{
    name: 'ChemistDirect',
    price: '$19.95'
  }, {
    name: 'Wellworth',
    price: '$21.50'
  }, {
    name: '[Retailer placeholder]',
    price: '[price]'
  }],
  lastChecked: '14 July 2026',
  pricesChecked: '1 August 2026'
};
const FAILING = {
  key: 'complex',
  brand: 'Dreamwell',
  name: 'Sleep complex',
  strengthLine: 'Blend — 6 ingredients, amounts not disclosed · Capsules · 60 capsules',
  priceLine: '$34.00 · $1.13 per night · lasts 30 nights',
  criteria: {
    dose: false,
    tested: false,
    disclosed: false,
    form: true
  },
  verdictLine: "This bottle doesn't give you what was studied.",
  dose: null,
  dietary: ['Gluten-free', 'Contains artificial colours'],
  checks: [{
    key: 'dose',
    why: "The label doesn't say how much melatonin is in each capsule, so nobody can check it against the studied 0.5–3 mg range — including you.",
    chip: CHIP_7MIN
  }, {
    key: 'tested',
    why: 'No independent laboratory has verified what these capsules contain. The manufacturer\u2019s own certificate is not a substitute.'
  }, {
    key: 'disclosed',
    why: 'Five of six ingredients hide inside a "proprietary blend" — a total weight with no individual amounts. That single device is what fails this check.'
  }, {
    key: 'form',
    why: 'Capsules match a studied form. This is the one check that passes.'
  }],
  ingredients: [{
    name: 'Proprietary sleep blend',
    role: 'Blend — 6 ingredients',
    amount: '410 mg total',
    note: 'Individual amounts not disclosed; none of the checks below it can be verified.',
    flag: 'worth'
  }, {
    name: 'Melatonin',
    role: 'Active ingredient',
    amount: 'Not disclosed',
    note: 'Inside the blend.',
    flag: 'worth'
  }, {
    name: '[Placeholder ingredient]',
    role: '[Role]',
    amount: null,
    note: '[Placeholder — documented findings summary pending]',
    flag: 'documented'
  }, {
    name: 'Brilliant blue FCF',
    role: 'Colour',
    amount: null,
    note: '[Placeholder note pending review]',
    flag: 'none'
  }],
  allergens: 'Per the label: contains soy. No gluten, lactose, nuts, or shellfish.',
  alternatives: [{
    brand: 'Somnia Labs',
    name: 'Melatonin',
    why: 'Passes every check',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }, {
    brand: 'Dreamwell',
    name: 'Melatonin melts',
    why: 'Same brand, full disclosure',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }],
  retailers: [{
    name: 'ChemistDirect',
    price: '$34.00'
  }, {
    name: 'Wellworth',
    price: '$33.25'
  }],
  lastChecked: '14 July 2026',
  pricesChecked: '1 August 2026'
};
const FLAGS = {
  /* colour states what's DOCUMENTED, nothing more — three states, never a hazard spectrum.
     "No known concern" is neutral, NOT green: green means passes/endorsed, which it doesn't
     claim. Non-neutral rows carry a tinted left edge (the system-wide "concern" signal)
     and their label links to the paper that earned it. */
  none: {
    label: 'No known concern',
    color: 'var(--text-muted)',
    edge: 'transparent',
    tint: 'transparent'
  },
  worth: {
    label: 'Worth knowing',
    color: 'var(--bucket-maybe)',
    edge: 'var(--bucket-maybe)',
    tint: 'var(--bucket-maybe-tint)'
  },
  documented: {
    label: 'Documented concern',
    color: 'var(--bucket-avoid)',
    edge: 'var(--bucket-avoid)',
    tint: 'var(--bucket-avoid-tint)'
  }
};
function useDesktop() {
  const [d, setD] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = e => setD(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return d;
}
const body = {
  margin: 0,
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text-body)',
  maxWidth: 'var(--measure)'
};
const muted = {
  ...body,
  color: 'var(--text-muted)'
};
function Section({
  id,
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      marginTop: 'var(--space-8)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-4)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)'
    }
  }, label), children);
}
function CheckMark({
  met
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 14 14",
    "aria-hidden": "true",
    style: {
      flex: 'none',
      marginTop: 3
    }
  }, met ? /*#__PURE__*/React.createElement("path", {
    d: "M2.5 7.5 L5.5 10.5 L11.5 3.5",
    fill: "none",
    stroke: "var(--sage)",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M3.5 3.5 L10.5 10.5 M10.5 3.5 L3.5 10.5",
    fill: "none",
    stroke: "var(--bucket-avoid)",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }));
}

/** Dose diagram: this product's dose vs the studied range vs the typical market, one 0–10 mg scale. */
function DoseDiagram({
  dose
}) {
  const W = 100; // percentages
  const x = mg => `${mg / 10 * W}%`;
  /* A11Y RULE: a diagram carries its OWN accessible description (role="img" + label) —
     never rely on nearby caption text to explain a graphic. */
  return /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": `Dose diagram: this product contains ${dose} mg per serving; the studies used 0.5 to 3 mg; typical products on the market contain 5 to 10 mg.`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x(5),
      width: x(5),
      top: 8,
      bottom: 8,
      borderRadius: 'var(--radius-xs)',
      border: 'var(--border-w) solid var(--border-strong)',
      background: 'repeating-linear-gradient(45deg, var(--surface-sunken), var(--surface-sunken) 4px, transparent 4px, transparent 8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x(0.5),
      width: x(2.5),
      top: 8,
      bottom: 8,
      borderRadius: 'var(--radius-xs)',
      background: 'var(--evidence-tint)',
      border: 'var(--border-w) solid var(--evidence-line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 1,
      background: 'var(--border-strong)'
    }
  }), dose != null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: x(dose),
      top: 0,
      bottom: 0,
      width: 3,
      marginLeft: -1.5,
      background: 'var(--evidence)',
      borderRadius: 'var(--radius-pill)'
    }
  }), [0, 5, 10].map(mg => /*#__PURE__*/React.createElement("span", {
    key: mg,
    style: {
      position: 'absolute',
      left: x(mg),
      bottom: -20,
      transform: mg === 0 ? 'none' : mg === 10 ? 'translateX(-100%)' : 'translateX(-50%)',
      whiteSpace: 'nowrap',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, mg, " mg"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-5)',
      paddingTop: 'var(--space-5)'
    }
  }, dose != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      fontWeight: 'var(--weight-meta)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 14,
      background: 'var(--evidence)',
      borderRadius: 'var(--radius-pill)'
    }
  }), "This product"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      fontWeight: 'var(--weight-meta)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 'var(--radius-xs)',
      background: 'var(--evidence-tint)',
      border: 'var(--border-w) solid var(--evidence-line)'
    }
  }), "What studies used (0.5\u20133 mg)"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      fontWeight: 'var(--weight-meta)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 'var(--radius-xs)',
      border: 'var(--border-w) solid var(--border-strong)',
      background: 'repeating-linear-gradient(45deg, var(--surface-sunken), var(--surface-sunken) 3px, transparent 3px, transparent 6px)'
    }
  }), "Typical on the market (5\u201310 mg)")));
}
function ProductPage({
  go,
  goRemedy,
  goGrade,
  goBrand,
  which = 'melts'
}) {
  const desktop = useDesktop();
  const p = which === 'complex' ? FAILING : PASSING;
  const met = __ds_scope.CRITERIA.filter(c => p.criteria[c.key]).length;
  const jumpBuy = e => {
    e.preventDefault();
    if (location.hash === '#buy') history.replaceState(null, '', '#');
    location.hash = 'buy';
  };
  const cluster = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-5) 0 var(--space-5)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-ui)',
      color: 'var(--text-muted)'
    }
  }, desktop ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: "#products",
    onClick: e => {
      e.preventDefault();
      go('products');
    },
    style: {
      color: 'var(--text-link)'
    }
  }, "Products"), ' › ', /*#__PURE__*/React.createElement("a", {
    href: "#brand",
    onClick: e => {
      e.preventDefault();
      goBrand && goBrand(p.brand.toLowerCase());
    },
    style: {
      color: 'var(--text-link)'
    }
  }, p.brand), ' › ', /*#__PURE__*/React.createElement("span", null, p.name)) : /*#__PURE__*/React.createElement("a", {
    href: "#products",
    onClick: e => {
      e.preventDefault();
      go('products');
    },
    style: {
      color: 'var(--text-link)'
    }
  }, "\u2039 Products")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: desktop ? 'row' : 'column',
      gap: 'var(--space-6)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: p.brand,
    size: desktop ? 288 : 160,
    radius: "var(--radius-lg)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cluster
  }, /*#__PURE__*/React.createElement("a", {
    href: "#brand",
    onClick: e => {
      e.preventDefault();
      goBrand && goBrand(p.brand.toLowerCase());
    },
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-link)'
    }
  }, p.brand), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      textWrap: 'pretty'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-3) 0 0',
      fontSize: 'var(--text-base)',
      color: 'var(--text-body)',
      fontWeight: 'var(--weight-ui)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, p.strengthLine), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'var(--space-2) 0 0',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: 'var(--space-1) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, p.priceLine, "*"), /*#__PURE__*/React.createElement("a", {
    href: "#buy",
    onClick: jumpBuy,
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Where to buy \u2193"))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...cluster,
      gap: 'var(--space-2)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.VerdictPill, {
    criteria: p.criteria
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-ui)',
      lineHeight: 'var(--leading-snug)',
      color: met >= __ds_scope.PASSES_THRESHOLD ? 'var(--text-body)' : 'var(--bucket-avoid)'
    }
  }, p.verdictLine)), /*#__PURE__*/React.createElement("div", {
    style: {
      ...cluster,
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)'
    }
  }, "Active ingredient:", ' ', /*#__PURE__*/React.createElement("a", {
    href: "#remedy",
    onClick: e => {
      e.preventDefault();
      goRemedy('melatonin');
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Melatonin"), ' ', /*#__PURE__*/React.createElement("a", {
    href: "#works",
    title: "How we grade",
    onClick: e => {
      e.preventDefault();
      goGrade && goGrade('works');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: __ds_scope.BUCKETS.works.color,
      verticalAlign: 'middle',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
    bucket: "works",
    size: 12
  }), __ds_scope.BUCKETS.works.plain)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)'
    }
  }, p.dietary.map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-pill)',
      padding: 'var(--space-1) var(--space-3)'
    }
  }, d)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "* Price and per-night figures are placeholder values. \xB7 Last checked ", p.lastChecked, " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#report",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-link)'
    }
  }, "Report an error")))), /*#__PURE__*/React.createElement(Section, {
    label: "The four checks"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, p.checks.map((c, i) => ({
    c,
    i,
    met: !!p.criteria[c.key]
  })).sort((a, b) => Number(a.met) - Number(b.met)).map(({
    c,
    i,
    met: ok
  }) => /*#__PURE__*/React.createElement("div", {
    key: c.key,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      borderLeft: ok ? '3px solid transparent' : '3px solid var(--bucket-avoid)',
      paddingLeft: 'var(--space-3)',
      marginLeft: 'calc(-1 * var(--space-3) - 3px)'
    }
  }, /*#__PURE__*/React.createElement(CheckMark, {
    met: ok
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, __ds_scope.CRITERIA[i].label, " \u2014 ", ok ? 'yes' : 'no'), /*#__PURE__*/React.createElement("p", {
    style: muted
  }, c.why), c.chip && /*#__PURE__*/React.createElement(__ds_scope.StudyChip, _extends({}, c.chip, {
    style: {
      marginTop: 'var(--space-1)'
    }
  }))))))), /*#__PURE__*/React.createElement(Section, {
    label: "What's in it"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, p.ingredients.map(ing => {
    const f = FLAGS[ing.flag];
    return /*#__PURE__*/React.createElement("li", {
      key: ing.name,
      style: {
        display: 'grid',
        gridTemplateColumns: desktop ? 'minmax(0, 1fr) auto' : '1fr',
        gap: 'var(--space-1) var(--space-5)',
        padding: 'var(--space-3) var(--space-3)',
        borderTop: 'var(--border-w) solid var(--border-hairline)',
        borderLeft: `3px solid ${f.edge}`,
        background: ing.flag === 'none' ? 'transparent' : f.tint,
        marginLeft: 'calc(-1 * var(--space-3) - 3px)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--weight-strong)'
      }
    }, ing.name, " ", ing.amount && /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--weight-body)',
        color: 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "\xB7 ", ing.amount)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, ing.role, " \xB7 ", ing.note)), /*#__PURE__*/React.createElement("a", {
      href: "#paper",
      onClick: e => e.preventDefault(),
      style: {
        alignSelf: 'center',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-strong)',
        color: f.color,
        whiteSpace: 'nowrap',
        textDecoration: ing.flag === 'none' ? 'none' : 'underline',
        textUnderlineOffset: 3,
        pointerEvents: ing.flag === 'none' ? 'none' : 'auto'
      }
    }, f.label));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      fontSize: 'var(--text-sm)',
      marginTop: 'var(--space-3)'
    }
  }, "We flag only documented concerns \u2014 we don't invent hazard scores. \"No known concern\" means no documented evidence of harm at these amounts, not a guarantee. One standing policy: non-sugar sweeteners are always \"Worth knowing\" in a daily-use product [placeholder \u2014 WHO 2023 guideline pending verification] \u2014 and the boundary holds both ways: a flag never says \"bad\" or \"avoid\" without a documented concern, the same rule that stops us calling an untested remedy useless."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      fontSize: 'var(--text-sm)',
      marginTop: 'var(--space-2)'
    }
  }, p.allergens)), /*#__PURE__*/React.createElement(Section, {
    label: p.dose != null ? `Is ${p.dose} mg enough?` : 'Is the dose enough?'
  }, p.dose != null ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DoseDiagram, {
    dose: p.dose
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-5)'
    }
  }, "More isn't better here: the higher doses on the market weren't the ones studied for sleep, and they're likelier to leave you groggy the next morning. [Placeholder citation.]")) : /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Nobody can say \u2014 the label doesn't disclose the melatonin amount, so there's nothing to place on the scale. That's what the failed dose check means.")), /*#__PURE__*/React.createElement(Section, {
    label: "How to take it"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: desktop ? '1fr 1fr' : '1fr',
      gap: 'var(--space-3)'
    }
  }, [['When', '[Placeholder — timing from the studied protocols]'], ['How', which === 'complex' ? 'Swallow with water.' : 'Dissolve under the tongue — don\u2019t swallow it whole.'], ['With food?', '[Placeholder — pending protocol review]'], ['How long until you know it\u2019s working', '[Placeholder — expected timescale and when to stop, from the studied protocols. No manufacturer prints this.]']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)'
    }
  }, k), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-1)',
      fontSize: 'var(--text-base)'
    }
  }, v)))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      fontSize: 'var(--text-sm)',
      marginTop: 'var(--space-3)'
    }
  }, "Timing comes from the studied protocols, not the manufacturer's marketing.")), /*#__PURE__*/React.createElement(Section, {
    label: "Before you take it"
  }, /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    level: "caution",
    title: "Check with your pharmacist first if any of these apply"
  }, "[Placeholder list \u2014 interaction classes, pregnancy, children \u2014 pending sourcing.]", ' ', "The full safety picture is on the", ' ', /*#__PURE__*/React.createElement("a", {
    href: "#remedy",
    onClick: e => {
      e.preventDefault();
      goRemedy('melatonin');
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "melatonin page"), ' ', "\u2014 it applies to every melatonin product, not just this one.")), /*#__PURE__*/React.createElement(Section, {
    label: "What to expect"
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "A nudge, not a knockout \u2014 in studies people fell asleep about 7 minutes faster, on average. If you're expecting a sleeping pill, this isn't that."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-3)'
    }
  }, which === 'complex' ? 'Because the melatonin amount is undisclosed, there is no way to relate this product to those studies at all.' : 'At 1 mg this sits at the lower end of the studied range — the studies found low doses work about as well as higher ones.', ' ', "[Placeholder pending review.]"), p.dietary.includes('Contains artificial sweeteners') && /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-3)',
      fontSize: 'var(--text-sm)'
    }
  }, "Sweetened with sucralose \u2014 noted under \"What's in it\".")), /*#__PURE__*/React.createElement(Section, {
    label: "If this isn't right for you"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginBottom: 'var(--space-4)'
    }
  }, "Alternatives that also pass every check \u2014 same checks, not recommendations."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, p.alternatives.map(a => /*#__PURE__*/React.createElement("a", {
    key: a.name,
    href: "#product",
    onClick: e => e.preventDefault(),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      color: 'var(--text-body)',
      minHeight: 'var(--control-lg)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BrandMark, {
    name: a.brand,
    size: 44
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, a.brand, " \u2014 ", a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, a.why)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.VerdictPill, {
    criteria: a.criteria
  })))), /*#__PURE__*/React.createElement("a", {
    href: "#products",
    onClick: e => {
      e.preventDefault();
      go('products');
    },
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-link)',
      padding: 'var(--space-2) 0'
    }
  }, "All 12 melatonin products, including the ones we'd skip \u203A"))), /*#__PURE__*/React.createElement(Section, {
    label: "Where this information comes from"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      ...body,
      margin: 0,
      paddingLeft: '1.2em',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("li", null, "Label \u2014 [government label database placeholder]."), /*#__PURE__*/React.createElement("li", null, "Independent testing \u2014 [testing register placeholder]."), /*#__PURE__*/React.createElement("li", null, "Research \u2014 the papers on the ", /*#__PURE__*/React.createElement("a", {
    href: "#remedy",
    onClick: e => {
      e.preventDefault();
      goRemedy('melatonin');
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "melatonin page"), "."), /*#__PURE__*/React.createElement("li", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, "Prices checked ", p.pricesChecked, " \xB7 page last checked ", p.lastChecked, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      background: 'var(--surface-sunken)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      maxWidth: 'var(--measure)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Spotted something wrong?"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      marginTop: 'var(--space-1)',
      fontSize: 'var(--text-sm)'
    }
  }, "Formulations change, and this page is only as good as its last check. ", /*#__PURE__*/React.createElement("a", {
    href: "#report",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Tell us"), " and we'll recheck it."))), /*#__PURE__*/React.createElement(Section, {
    id: "buy",
    label: "Where to buy"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, p.retailers.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#out",
    onClick: e => e.preventDefault(),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      minHeight: 'var(--control-lg)',
      padding: '0 var(--space-4)',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 'var(--text-base)',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--text-muted)'
    }
  }, r.price), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--text-faint)'
    }
  }, "\u2197")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: '0 var(--space-4)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, "[Room for a one-line disclosure]"))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...muted,
      fontSize: 'var(--text-sm)'
    }
  }, "Retailers in no particular order. Somnary earns nothing from these links.")))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }));
}
Object.assign(__ds_scope, { ProductPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/ProductPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/ProductsPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* /remedies/melatonin/products — the full product list, dense-list layout (C3).
   All twelve are fictional demo entries in a realistic mix: pass-all, partial, failing,
   label-known, not-in-database — identical treatment throughout ("we list every product,
   including the ones we advise against" is most visible here).
   FIXED ORDER: checks passed, descending (assessed first, then label-known, then
   not-in-database; ties by brand A–Z). The checks are the reason the page exists, and the
   order is set by our own published criteria — never by anything commercial. */
/* SCHEMA RULE: name and strength are separate structured fields — the name never contains
   the dose (enforced again in ProductListRow). */
const PRODUCTS = [{
  brand: 'Somnia Labs',
  name: 'Melatonin',
  strength: '1 mg per capsule',
  form: 'Capsules',
  src: '../../assets/demo-product-photo-1.png',
  criteria: {
    dose: true,
    tested: true,
    disclosed: true,
    form: true
  }
}, {
  brand: 'Nightcap Co',
  name: 'Melatonin drops',
  strength: '0.5 mg per dropper',
  form: 'Drops',
  criteria: {
    dose: true,
    tested: true,
    disclosed: true,
    form: true
  }
}, {
  brand: 'Dreamwell',
  name: 'Melatonin melts',
  strength: '1 mg per melt',
  form: 'Melts',
  sweetened: true,
  criteria: {
    dose: true,
    tested: true,
    disclosed: true,
    form: true
  }
}, {
  brand: 'PureForm',
  name: 'Melatonin',
  strength: '3 mg per capsule',
  form: 'Capsules',
  criteria: {
    dose: false,
    tested: true,
    disclosed: true,
    form: true
  }
}, {
  brand: 'VitaBasics',
  name: 'Melatonin gummies',
  strength: '5 mg per gummy',
  form: 'Gummies',
  sweetened: true,
  criteria: {
    dose: false,
    tested: true,
    disclosed: true,
    form: false
  }
}, {
  brand: 'Luna Supply',
  name: 'Melatonin',
  strength: '5 mg per capsule',
  form: 'Capsules',
  criteria: {
    dose: false,
    tested: false,
    disclosed: true,
    form: true
  }
}, {
  brand: 'Nightcap Co',
  name: 'Fast melts',
  strength: '10 mg per melt',
  form: 'Melts',
  sweetened: true,
  criteria: {
    dose: false,
    tested: true,
    disclosed: true,
    form: false
  }
}, {
  brand: 'Moonleaf',
  name: 'Sleep tea with melatonin',
  strength: 'Blend — melatonin amount not disclosed',
  form: 'Tea',
  src: '../../assets/demo-product-photo-2.png',
  criteria: {
    dose: false,
    tested: false,
    disclosed: false,
    form: false
  }
}, {
  brand: 'Dreamwell',
  name: 'Sleep complex',
  strength: 'Blend — 6 ingredients, amounts not disclosed',
  form: 'Capsules',
  criteria: {
    dose: false,
    tested: false,
    disclosed: false,
    form: true
  }
}, {
  brand: 'Herbwell',
  name: 'Night blend',
  strength: 'Blend — amounts not disclosed',
  form: 'Capsules',
  criteria: {
    dose: false,
    tested: false,
    disclosed: false,
    form: false
  }
}, {
  brand: 'Somnol',
  name: 'Melatonin spray',
  strength: '[Strength pending assessment]',
  form: 'Spray',
  status: 'label-known'
}, {
  brand: 'Driftwood',
  name: 'Sleep drops',
  strength: null,
  form: 'Drops',
  status: 'not-in-db'
}];

/* MOCK CATALOGUE — ~40 fictional demo entries that exist ONLY to exercise the chrome rule
   above threshold (toggled from the review chrome). Deterministic, clearly fake, never data. */
const BRANDS40 = ['Somnia Labs', 'Nightcap Co', 'Dreamwell', 'PureForm', 'VitaBasics', 'Luna Supply', 'Moonleaf', 'Herbwell', 'Somnol', 'Driftwood'];
const FORMS40 = ['Capsules', 'Tablets', 'Gummies', 'Melts', 'Drops', 'Spray', 'Tea', 'Powder'];
const NAME_BY_FORM = {
  Capsules: 'Melatonin',
  Tablets: 'Melatonin tablets',
  Gummies: 'Melatonin gummies',
  Melts: 'Melatonin melts',
  Drops: 'Melatonin drops',
  Spray: 'Melatonin spray',
  Tea: 'Sleep tea with melatonin',
  Powder: 'Melatonin powder'
};
const PRODUCTS_LARGE = Array.from({
  length: 40
}, (_, i) => {
  /* Powder appears exactly ONCE (its other cycle slots become capsules) so the single-result
     edge state — "The only powder product we've checked · Clear filter" — is reachable
     above the chrome threshold. */
  const cycled = FORMS40[i % FORMS40.length];
  const form = cycled === 'Powder' && i > 7 ? 'Capsules' : cycled;
  return {
    brand: BRANDS40[i % BRANDS40.length],
    name: NAME_BY_FORM[form],
    strength: '[Strength placeholder — fictional entry]',
    form,
    sweetened: ['Gummies', 'Melts', 'Tea'].includes(form),
    criteria: {
      dose: i % 2 === 0,
      tested: i % 3 !== 0,
      disclosed: i % 4 !== 0,
      form: i % 5 !== 0
    }
  };
});

/* SYSTEM RULE — CHROME SCALES WITH CATALOGUE SIZE. Under ~20 items there is NO filter row
   and NO sort control: the list is the interface, its order declared in the intro line.
   Above ~20: one derived "Form" dropdown (options computed from the page's data, with
   counts; zero-result options never render) plus genuine-preference filters
   ("Independently tested", "No artificial sweeteners"), each rendered only when the list
   contains both states. Sort controls never exist at ANY scale — checks-passed is the
   fixed order, set by our published criteria, never by anything commercial. Brand A–Z was
   cut deliberately at every scale AS A CONTROL — someone who knows the brand searches; it
   survives only as the tiebreak WITHIN equal checks-passed (a deterministic, non-commercial
   way to settle ties, not a user-facing sort). */
const CHROME_THRESHOLD = 20;

/* FORM TAXONOMY: tablets, capsules, softgels, gummies, melts, drops, sprays, teas, and
   powders are DISTINCT forms — never merged (a tablet is not a capsule). The filter options
   are derived from the data with per-form counts, so a new form appears automatically and
   an unused one never shows. */
const met = p => p.criteria ? Object.values(p.criteria).filter(Boolean).length : p.status === 'label-known' ? -1 : -2;
function Chip({
  active,
  onClick,
  children
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-pressed": active,
    style: {
      minHeight: 'var(--control-md)',
      padding: '0 var(--space-4)',
      borderRadius: 'var(--radius-pill)',
      border: `var(--border-w) solid ${active ? 'var(--ink)' : 'var(--border-strong)'}`,
      background: active ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: 'var(--text-body)',
      font: `${active ? 'var(--weight-strong)' : 'var(--weight-ui)'} var(--text-sm) var(--font-sans)`,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-fast) var(--ease-settle), border-color var(--dur-fast) var(--ease-settle)'
    }
  }, active && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      marginRight: 'var(--space-2)'
    }
  }, "\u2713"), children);
}
function ProductsPage({
  go,
  goProduct,
  goGrade,
  catalogue = 'melatonin'
}) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 760px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 760px)');
    const f = e => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const list = catalogue === 'large' ? PRODUCTS_LARGE : PRODUCTS;
  const showChrome = list.length > CHROME_THRESHOLD;
  const [form, setForm] = React.useState('');
  const [testedOnly, setTestedOnly] = React.useState(false);
  const [noSweetener, setNoSweetener] = React.useState(false); /* serves the preference without declaring a verdict — same pattern as "Without safety flags" */
  React.useEffect(() => {
    setForm('');
    setTestedOnly(false);
    setNoSweetener(false);
  }, [catalogue]);
  /* derived options: counts computed with the OTHER filters applied; zero-result options never render */
  const base = list.filter(p => (!testedOnly || p.criteria && p.criteria.tested) && (!noSweetener || !p.sweetened));
  const formOptions = [...new Set(list.map(p => p.form))].sort().map(f => ({
    f,
    count: base.filter(p => p.form === f).length
  })).filter(o => o.count > 0);
  const shown = base.filter(p => !form || p.form === form);
  /* genuine-preference filters render only when both states exist in the data */
  const hasTestedBoth = list.some(p => p.criteria && p.criteria.tested) && list.some(p => p.criteria && !p.criteria.tested);
  const hasSweetBoth = list.some(p => p.sweetened) && list.some(p => !p.sweetened);
  /* fixed order: checks passed desc (assessed, then label-known, then not-in-db), ties brand A–Z */
  const sorted = [...shown].sort((a, b) => met(b) - met(a) || a.brand.localeCompare(b.brand));
  const filtering = !!form || testedOnly || noSweetener;
  const passAll = list.filter(p => met(p) === 4).length;
  const clear = e => {
    e.preventDefault();
    setForm('');
    setTestedOnly(false);
    setNoSweetener(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 880,
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    mobile: !desktop,
    current: "Products",
    trail: [{
      label: 'Remedies',
      onClick: () => go('remedies')
    }, {
      label: 'Melatonin',
      onClick: () => go('remedy')
    }]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 'var(--space-1) 0 var(--space-2)',
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)'
    }
  }, "Melatonin products"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-5)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, list.length, " products checked \u2014 ", passAll, " pass every check, listed first. Every product we know about is here, including the ones we'd tell you to skip. Same four checks either way."), showChrome && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-2)',
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-ui)',
      color: 'var(--text-muted)'
    }
  }, "Form", /*#__PURE__*/React.createElement("select", {
    value: form,
    onChange: e => setForm(e.target.value),
    style: {
      minHeight: 'var(--control-md)',
      padding: '0 var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      border: 'var(--border-w) solid var(--border-input)',
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      font: 'var(--weight-ui) var(--text-sm) var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All forms \xB7 ", base.length), formOptions.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.f,
    value: o.f
  }, o.f, " \xB7 ", o.count)))), hasTestedBoth && /*#__PURE__*/React.createElement(Chip, {
    active: testedOnly,
    onClick: () => setTestedOnly(t => !t)
  }, "Independently tested"), hasSweetBoth && /*#__PURE__*/React.createElement(Chip, {
    active: noSweetener,
    onClick: () => setNoSweetener(s => !s)
  }, "No artificial sweeteners")), filtering && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, sorted.length === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "Nothing matches those filters. ", /*#__PURE__*/React.createElement("a", {
    href: "#clear",
    onClick: clear,
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Clear filters")) : sorted.length === 1 && form ? /*#__PURE__*/React.createElement(React.Fragment, null, "The only ", form.toLowerCase(), " product we've checked \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#clear",
    onClick: clear,
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Clear filter")) : sorted.length === 1 ? /*#__PURE__*/React.createElement(React.Fragment, null, "One product matches. ", /*#__PURE__*/React.createElement("a", {
    href: "#clear",
    onClick: clear,
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Clear filters")) : /*#__PURE__*/React.createElement(React.Fragment, null, sorted.length, " of ", list.length, " products match. ", /*#__PURE__*/React.createElement("a", {
    href: "#clear",
    onClick: clear,
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Clear filters"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: sorted.length ? 'var(--border-w) solid var(--border-hairline)' : 'none'
    }
  }, sorted.map((p, i) => /*#__PURE__*/React.createElement(__ds_scope.ProductListRow, _extends({
    key: p.brand + p.name + i
  }, p, {
    mobile: !desktop,
    onClick: () => goProduct && goProduct(p.name === 'Sleep complex' ? 'complex' : 'melts')
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-4) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)'
    }
  }, "All products shown are fictional demo entries. Order is by our published checks \u2014 never by price, brand deals, or anything commercial."), desktop && /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-9)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-muted)'
    }
  }, "The mobile row at 390px \u2014 six rows, mostly placeholders, one photo"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      maxWidth: '100%',
      background: 'var(--surface-page)',
      border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
      padding: '0 var(--space-4)',
      overflow: 'hidden'
    }
  }, list.slice(0, 6).map((p, i) => /*#__PURE__*/React.createElement(__ds_scope.ProductListRow, _extends({
    key: 'm' + p.brand + p.name + i
  }, p, {
    mobile: true,
    onClick: () => {}
  })))))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }));
}
Object.assign(__ds_scope, { ProductsPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/ProductsPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/RemediesPage.jsx
try { (() => {
/* Real audit data only. Bucket-default sentences are system copy; melatonin and kava carry
   their page-derived sentences. Use tags describe common use, never effectiveness; unaudited
   entries are marked placeholder. Bucket totals beyond the entered remedies render as
   dimmed "pending data entry" rows — never invented. */
const ENTRIES = [{
  key: 'melatonin',
  name: 'Melatonin',
  bucket: 'works',
  counts: {
    cited: 12,
    sleep: 5,
    verifiable: 3
  },
  sentence: 'Helps most people fall asleep a little sooner — check your dose against what was studied.',
  uses: ['Falling asleep', 'Jet lag or shift work'],
  page: 'melatonin'
}, {
  key: 'magnesium',
  name: 'Magnesium',
  bucket: 'maybe',
  counts: {
    cited: 9,
    sleep: 2,
    verifiable: 2
  },
  uses: ['Staying asleep'],
  page: 'magnesium'
}, {
  key: 'ltheanine',
  name: 'L-theanine',
  bucket: 'maybe',
  counts: {
    cited: 8,
    sleep: 2,
    verifiable: 2
  },
  uses: ['Stress or racing mind', 'Falling asleep']
}, {
  key: 'valerian',
  name: 'Valerian',
  bucket: 'unknown',
  counts: {
    cited: 11,
    sleep: 3,
    verifiable: 1
  },
  uses: ['Falling asleep'],
  page: 'valerian'
}, {
  key: 'chamomile',
  name: 'Chamomile',
  bucket: 'unknown',
  counts: {
    cited: 6,
    sleep: 2,
    verifiable: 1
  },
  uses: ['Falling asleep', 'Stress or racing mind'],
  page: 'chamomile'
}, {
  key: 'ashwagandha',
  name: 'Ashwagandha',
  bucket: 'unknown',
  counts: {
    cited: 7,
    sleep: 1,
    verifiable: 0
  },
  uses: ['Stress or racing mind'],
  safetyFlag: '[Placeholder — real safety wording pending sourcing]'
}, {
  key: 'bacopa',
  name: 'Bacopa',
  bucket: 'unknown',
  counts: {
    cited: 0,
    sleep: 0,
    verifiable: 0
  },
  uses: []
}, {
  key: 'taurine',
  name: 'Taurine',
  bucket: 'unknown',
  counts: {
    cited: 0,
    sleep: 0,
    verifiable: 0
  },
  uses: []
}, {
  key: 'nopaper3',
  name: '[Placeholder — third no-paper remedy]',
  bucket: 'unknown',
  counts: {
    cited: 0,
    sleep: 0,
    verifiable: 0
  },
  uses: []
}, {
  key: 'kava',
  name: 'Kava',
  bucket: 'unknown',
  counts: {
    cited: 5,
    sleep: 0,
    verifiable: 0
  },
  safetyFlag: '[Placeholder — serious safety concern; final wording pending sourcing]',
  uses: ['Stress or racing mind'],
  page: 'kava'
}];
/* Bucket totals: only "unknown = 16 of 31" is audited; other totals are pending. */
const PENDING = {
  works: '[Placeholder — bucket total pending audit]',
  maybe: '[Placeholder — bucket total pending audit]',
  unknown: shown => `${16 - shown} more remedies sit here — entries pending data entry.`,
  avoid: '[Placeholder — bucket total pending audit]'
};
const FIX_CHIPS = ['Falling asleep', 'Staying asleep', 'Stress or racing mind', 'Jet lag or shift work'];
const BUCKET_ORDER = ['works', 'maybe', 'unknown', 'avoid'];
function Chip({
  active,
  onClick,
  children
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-pressed": active,
    style: {
      minHeight: 'var(--control-md)',
      padding: '0 var(--space-4)',
      borderRadius: 'var(--radius-pill)',
      border: `var(--border-w) solid ${active ? 'var(--ink)' : 'var(--border-strong)'}`,
      background: active ? 'var(--surface-sunken)' : 'var(--surface-card)',
      color: 'var(--text-body)',
      font: `${active ? 'var(--weight-strong)' : 'var(--weight-ui)'} var(--text-sm) var(--font-sans)`,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-fast) var(--ease-settle), border-color var(--dur-fast) var(--ease-settle)'
    }
  }, active && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      marginRight: 'var(--space-2)'
    }
  }, "\u2713"), children);
}
function GradeLink({
  bucket,
  goGrade
}) {
  /* Every bucket badge on this page links to "How we grade" — methodology at the moment of doubt.
     Deep-links to the badge's own section. */
  return /*#__PURE__*/React.createElement("a", {
    href: '#' + bucket,
    onClick: e => {
      e.preventDefault();
      goGrade(bucket);
    },
    title: "How we grade",
    "aria-label": `${(__ds_scope.BUCKETS[bucket] || __ds_scope.BUCKETS.unknown).plain} — how we grade`,
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: bucket,
    compact: true
  }));
}
function Row({
  entry,
  desktop,
  goRemedy,
  goGrade
}) {
  const [hover, setHover] = React.useState(false);
  const b = __ds_scope.BUCKETS[entry.bucket] || __ds_scope.BUCKETS.unknown;
  const open = e => {
    e.preventDefault();
    goRemedy(entry.page || 'melatonin');
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: desktop ? 'grid' : 'flex',
      gridTemplateColumns: desktop ? 'minmax(0, 1fr) 240px' : undefined,
      flexDirection: desktop ? undefined : 'column',
      gap: 'var(--space-3) var(--space-6)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-md)',
      alignItems: desktop ? 'center' : undefined,
      background: hover ? 'var(--surface-card)' : 'transparent',
      border: `var(--border-w) solid ${hover ? 'var(--border-hairline)' : 'transparent'}`,
      transition: 'background var(--dur-fast) var(--ease-settle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#remedy",
    onClick: open,
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-strong)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-body)',
      textDecoration: 'none'
    }
  }, entry.name), /*#__PURE__*/React.createElement(GradeLink, {
    bucket: entry.bucket,
    goGrade: goGrade
  }), entry.safetyFlag && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--amber)'
    }
  }, "Safety concern")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      maxWidth: '56ch'
    }
  }, entry.sentence || b.sentence), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, entry.uses.length ? `Mainly used for: ${entry.uses.join(' · ').toLowerCase()}` : 'Mainly used for: [placeholder — common uses pending audit]')), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "thumb",
    counts: entry.counts
  }));
}
function ShareImage() {
  /* 1200×630 share image, shown at half scale. Only audited figures appear. */
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 600,
      height: 315,
      maxWidth: '100%',
      background: 'var(--paper)',
      border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 18
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 30,
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      maxWidth: '18ch',
      textWrap: 'pretty'
    }
  }, "Natural sleep remedies, graded by the evidence"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "16 of 31 remedies: not properly tested for sleep.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-5)'
    }
  }, BUCKET_ORDER.map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: __ds_scope.BUCKETS[k].color
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
    bucket: k,
    size: 13
  }), __ds_scope.BUCKETS[k].plain))));
}
function RemediesPage({
  go,
  goRemedy,
  goGrade
}) {
  const [desktop, setDesktop] = React.useState(() => window.matchMedia('(min-width: 980px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 980px)');
    const f = e => setDesktop(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const [fixes, setFixes] = React.useState([]);
  const [hideFlagged, setHideFlagged] = React.useState(false);
  const [view, setView] = React.useState('grouped');
  const toggleFix = f => setFixes(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  const shown = ENTRIES.filter(e => (fixes.length === 0 || e.uses.some(u => fixes.includes(u))) && (!hideFlagged || !e.safetyFlag));
  /* within a bucket the order is fixed: most evidence first (verifiable, then cited) —
     the grouping IS the primary order, so there is no sort control */
  const sorted = list => [...list].sort((a, b) => b.counts.verifiable - a.counts.verifiable || b.counts.cited - a.counts.cited);
  const filtering = fixes.length > 0 || hideFlagged;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    mobile: !desktop,
    current: "Remedies",
    trail: [{
      label: 'Somnary',
      onClick: () => go('home')
    }]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 'var(--space-1) 0 var(--space-2)',
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)'
    }
  }, "Every remedy, graded by the evidence"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-6)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, "Grouped by what the studies show. The grade is about the ingredient \u2014 whether a specific bottle delivers it is scored on its own page."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-2)',
      paddingBottom: 'var(--space-4)'
    }
  }, FIX_CHIPS.map(f => /*#__PURE__*/React.createElement(Chip, {
    key: f,
    active: fixes.includes(f),
    onClick: () => toggleFix(f)
  }, f)), /*#__PURE__*/React.createElement(Chip, {
    active: hideFlagged,
    onClick: () => setHideFlagged(h => !h)
  }, "Without safety flags"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "View",
    style: {
      display: 'flex',
      border: 'var(--border-w) solid var(--border-strong)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden'
    }
  }, [['grouped', 'Grouped'], ['az', 'A–Z']].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    type: "button",
    onClick: () => setView(v),
    "aria-pressed": view === v,
    style: {
      minHeight: 'calc(var(--control-md) - 2 * var(--border-w))',
      padding: '0 var(--space-4)',
      border: 'none',
      cursor: 'pointer',
      background: view === v ? 'var(--ink)' : 'var(--surface-card)',
      color: view === v ? 'var(--paper)' : 'var(--text-body)',
      font: 'var(--weight-ui) var(--text-sm) var(--font-sans)'
    }
  }, l))))), view === 'az' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'var(--space-3)',
      margin: '0 calc(-1 * var(--space-4))'
    }
  }, [...shown].sort((a, b) => a.name.localeCompare(b.name)).map(e => /*#__PURE__*/React.createElement(Row, {
    key: e.key,
    entry: e,
    desktop: desktop,
    goRemedy: goRemedy,
    goGrade: goGrade
  }))), view === 'grouped' && BUCKET_ORDER.map(bk => {
    const entries = sorted(shown.filter(e => e.bucket === bk));
    const b = __ds_scope.BUCKETS[bk];
    if (filtering && entries.length === 0) return null;
    return /*#__PURE__*/React.createElement("section", {
      key: bk,
      style: {
        paddingTop: 'var(--space-7)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        borderBottom: 'var(--border-w) solid var(--border-hairline)',
        paddingBottom: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: b.color
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.BucketShape, {
      bucket: bk,
      size: 18
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 'var(--display-sm)',
        fontWeight: 'var(--weight-heading)',
        letterSpacing: 'var(--tracking-display)'
      }
    }, b.plain)), bk === 'works' && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 'var(--space-4) 0 0',
        padding: '0 var(--space-4)',
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-body)',
        color: 'var(--text-muted)',
        maxWidth: 'var(--measure)'
      }
    }, "Very few natural sleep remedies have been studied well enough to sit here."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'var(--space-3)',
        margin: '0 calc(-1 * var(--space-4))'
      }
    }, entries.map(e => /*#__PURE__*/React.createElement(Row, {
      key: e.key,
      entry: e,
      desktop: desktop,
      goRemedy: goRemedy,
      goGrade: goGrade
    })), entries.length === 0 && !filtering && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        padding: 'var(--space-4)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-muted)'
      }
    }, "Nothing here yet."), !filtering && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-faint)'
      }
    }, typeof PENDING[bk] === 'function' ? PENDING[bk](entries.length) : PENDING[bk])));
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-7) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)',
      maxWidth: 'var(--measure)'
    }
  }, "\"Mainly used for\" describes common use, not effectiveness. Grades link to ", /*#__PURE__*/React.createElement("a", {
    href: "#badges",
    onClick: e => {
      e.preventDefault();
      goGrade();
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-ui)'
    }
  }, "how we grade"), "."), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-9)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-faint)'
    }
  }, "Share image this page produces (1200 \xD7 630, shown at half scale)"), /*#__PURE__*/React.createElement(ShareImage, null))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }));
}
Object.assign(__ds_scope, { RemediesPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/RemediesPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/RemedyPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* PairedVerdict is deliberately NOT imported: a component answering two questions is
   redundant where one answer IS the page — it never appears on an ingredient's own
   remedy page or its filtered lists (interface-economy rule). */

/* ---- data: real audit figures only; everything else is marked placeholder ----
   EMPTINESS IS DERIVED FROM THE DATA, never hardcoded per remedy:
   · counts.sleep === 0      → the "what does it do" / dose / label sections have nothing
                               evidence-backed to show; each states its absence in one
                               sentence derived from the counts; the TOC keeps the entry, dimmed.
   · counts.verifiable === 0 → "Does it work?" states what that means instead of showing findings.
   · safetySerious === true  → safety is the page's dominant element: the flag renders under the
                               h1 at a larger register, the safety section leads with "Serious
                               safety concern.", and the products list repeats the warning above it.
   · products/papers NEVER disappear — Somnary lists every product, including ones it advises
     against, assessed on the same criteria (locked decision; same reason the where-to-buy row
     is identical on good and bad products). Papers are always listed, grouped by tier.
   · reports.length === 0    → the section states "No accounts collected yet." */
const NOTE_REVIEW = {
  finding: 'People taking melatonin fell asleep about 7 minutes sooner, on average, than people taking a placebo.',
  people: 1683,
  year: 2013,
  url: '#',
  linkText: 'Read the review (19 studies)',
  lastChecked: '14 July 2026',
  id: '[PMID placeholder]'
};
const MELATONIN = {
  key: 'melatonin',
  name: 'Melatonin',
  sub: 'A hormone your body makes in the evening · also sold as a supplement',
  bucket: 'works',
  verdict: 'Helps most people fall asleep a little sooner — check your dose against what was studied.',
  safetyFlag: '[Placeholder — interaction summary pending sourcing]',
  safetySerious: false,
  counts: {
    cited: 12,
    sleep: 5,
    verifiable: 3
  },
  helpedNote: '[Placeholder — of the 3 verified results, how many found an improvement is pending adjudication.]',
  lastChecked: '14 July 2026',
  products: [
  /* [PLACEHOLDER SCORING RULE — NEEDS AN OWNER, do not ship as policy] — the "pass"
     threshold behind these demo entries and the verdict pill is PASSES_THRESHOLD in
     ProductScoreBadge (one definition, both consumers import it); criteria are unlikely
     to be equally weighted. */
  /* SCHEMA RULE: product name and strength are separate fields — the name never contains the dose. */
  {
    brand: 'Somnia Labs',
    product: 'Melatonin',
    strength: '1 mg per capsule',
    src: '../../assets/demo-product-photo-1.png',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }, {
    brand: 'Nightcap Co',
    product: 'Melatonin drops',
    strength: '0.5 mg per dropper',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }, {
    brand: 'Dreamwell',
    product: 'Melatonin melts',
    strength: '1 mg per melt',
    criteria: {
      dose: true,
      tested: true,
      disclosed: true,
      form: true
    }
  }],
  /* demo counts — the section shows only pass-all products and links to the full list */
  productStats: {
    checked: 12,
    pass: 3
  },
  reports: ['[Placeholder — reader account pending collection.]', '[Placeholder — reader account pending collection.]'],
  papers: {
    verified: [{
      type: 'review of several studies',
      finding: NOTE_REVIEW.finding,
      meta: '1,683 people · 2013 · [PMID placeholder]',
      note: NOTE_REVIEW
    }, {
      type: 'trial',
      finding: '[Placeholder — finding pending write-up]',
      meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]'
    }, {
      type: 'observational study',
      finding: '[Placeholder — finding pending write-up]',
      meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]'
    }],
    measuredOnly: [{
      type: 'trial',
      finding: '[Placeholder — finding pending write-up]',
      meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]'
    }, {
      type: 'observational study',
      finding: '[Placeholder — finding pending write-up]',
      meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]'
    }],
    nonSleep: 7
  }
};
const KAVA = {
  key: 'kava',
  name: 'Kava',
  sub: '[Placeholder one-line description]',
  bucket: 'unknown',
  verdict: 'No published paper has measured whether kava helps sleep — and there is a serious safety concern.',
  safetyFlag: '[Placeholder — serious safety concern; final wording pending sourcing]',
  safetySerious: true,
  counts: {
    cited: 5,
    sleep: 0,
    verifiable: 0
  },
  lastChecked: '14 July 2026',
  products: [],
  productStats: {
    checked: 2,
    pass: 0
  },
  reports: [],
  papers: {
    verified: [],
    measuredOnly: [],
    nonSleep: 5
  }
};

/* Minimal datasets for the problem-page row — audited counts; all copy placeholder. */
function stub(key, name, bucket, counts, papers) {
  return {
    key,
    name,
    bucket,
    counts,
    papers,
    sub: '[Placeholder one-line description]',
    verdict: '[Placeholder — one-line verdict pending write-up]',
    safetyFlag: null,
    safetySerious: false,
    helpedNote: counts.verifiable > 0 ? '[Placeholder — direction of verified results pending adjudication.]' : null,
    lastChecked: '14 July 2026',
    products: [],
    reports: []
  };
}
const ph = {
  type: '[study type placeholder]',
  finding: '[Placeholder — finding pending write-up]',
  meta: '[People count placeholder] · [year placeholder] · [PMID placeholder]'
};
const MAGNESIUM = stub('magnesium', 'Magnesium', 'maybe', {
  cited: 9,
  sleep: 2,
  verifiable: 2
}, {
  verified: [ph, ph],
  measuredOnly: [],
  nonSleep: 7
});
const VALERIAN = stub('valerian', 'Valerian', 'unknown', {
  cited: 11,
  sleep: 3,
  verifiable: 1
}, {
  verified: [ph],
  measuredOnly: [ph, ph],
  nonSleep: 8
});
const CHAMOMILE = stub('chamomile', 'Chamomile', 'unknown', {
  cited: 6,
  sleep: 2,
  verifiable: 1
}, {
  verified: [ph],
  measuredOnly: [ph],
  nonSleep: 4
});
/* ashwagandha stub so the Safety page's flagged-remedy row lands on the right remedy;
   caution flag restated over the stub's null (real audit counts: 7/1/0) */
const ASHWAGANDHA = {
  ...stub('ashwagandha', 'Ashwagandha', 'unknown', {
    cited: 7,
    sleep: 1,
    verifiable: 0
  }, {
    verified: [],
    measuredOnly: [ph],
    nonSleep: 6
  }),
  safetyFlag: '[Placeholder — real safety wording pending sourcing]'
};
const TOC = [{
  id: 'work',
  label: 'Does it work?'
}, {
  id: 'does',
  label: 'What does it actually do?'
}, {
  id: 'dose',
  label: "What's a normal dose and when do you take it?"
}, {
  id: 'safety',
  label: 'Is it safe with my medications?'
}, {
  id: 'label',
  label: 'What should I look for on the label?'
}, {
  id: 'products',
  label: 'Which products deliver it?'
}, {
  id: 'popular',
  label: 'Why is this so popular?'
}, {
  id: 'papers',
  label: 'The papers behind this page'
}];

/* ABSENCE COPY — the canonical strings, one place. Transcribe these into the content layer
   verbatim when this gets built; do not reimplement from memory.
   {cited}/{sleep}/{verifiable} interpolate the audit counts.
   section   condition                    sentence
   work      cited === 0                  "We couldn't find any published papers on this remedy — so nobody knows. That is the whole answer."
   work      sleep === 0                  "None of the {cited} papers we found measured sleep — so nobody knows. That is the whole answer."
   work      verifiable === 0             "{sleep} of {cited} papers measured sleep, but none published results we could verify — so we can't say yet."
   does      cited === 0                  "With no papers to draw on, there is nothing to describe yet."
   does      sleep === 0                  "With no sleep findings to explain, there is nothing to describe yet."
   dose      cited === 0 || sleep === 0   "No paper measured sleep, so there is no studied sleep dose to show."
   label     cited === 0 || sleep === 0   "No studied form or dose exists to check a label against."
   reports   reports.length === 0         "No accounts collected yet." (sub-block of "Why is this so popular?")
   products  products.length === 0        "We haven't assessed any {remedy} products yet."
   papers    cited === 0                  "We couldn't find any published papers on this remedy." (intro line)  */
const ABSENCE = {
  workNoPapers: `We couldn't find any published papers on this remedy — so nobody knows. That is the whole answer.`,
  workNoSleep: c => `None of the ${c.cited} papers we found measured sleep — so nobody knows. That is the whole answer.`,
  workNoVerified: c => `${c.sleep} of ${c.cited} papers measured sleep, but none published results we could verify — so we can't say yet.`,
  doesNoPapers: 'With no papers to draw on, there is nothing to describe yet.',
  doesNoSleep: 'With no sleep findings to explain, there is nothing to describe yet.',
  dose: 'No paper measured sleep, so there is no studied sleep dose to show.',
  label: 'No studied form or dose exists to check a label against.',
  reports: 'No accounts collected yet.',
  papersNoPapers: `We couldn't find any published papers on this remedy.`,
  productsNone: name => `We haven't assessed any ${name} products yet.`
};

/* The emptiness rules, implemented once for every remedy. Returns per-section absence
   sentences (from ABSENCE, above) or null when the section has content. */
function deriveEmpty(data) {
  const c = data.counts;
  const noPapers = c.cited === 0;
  const noSleep = c.sleep === 0;
  return {
    work: noPapers ? ABSENCE.workNoPapers : noSleep ? ABSENCE.workNoSleep(c) : c.verifiable === 0 ? ABSENCE.workNoVerified(c) : null,
    does: noPapers ? ABSENCE.doesNoPapers : noSleep ? ABSENCE.doesNoSleep : null,
    dose: noSleep ? ABSENCE.dose : null,
    label: noSleep ? ABSENCE.label : null
  };
}
function useDesktop() {
  const [d, setD] = React.useState(() => window.matchMedia('(min-width: 980px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 980px)');
    const f = e => setD(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return d;
}
function jump(e, id) {
  /* native hash navigation: fires :target (the sidebar's landing feedback) and respects
     the global scroll-margin-top, so the destination never lands under sticky chrome */
  e.preventDefault();
  if ('#' + id === location.hash) {
    history.replaceState(null, '', '#');
  }
  location.hash = id;
}
function MarginNote({
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-3)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-snug)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-ui)',
      color: 'var(--text-body)'
    }
  }, note.finding), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, note.people ? `${note.people.toLocaleString()} people · ` : '', note.year || '', note.id ? ` · ${note.id}` : ''), /*#__PURE__*/React.createElement("a", {
    href: note.url || '#',
    style: {
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-link)',
      fontSize: 'var(--text-sm)'
    }
  }, note.linkText || 'Read the study', " \u2197"), note.lastChecked && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: 'var(--text-xs)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "Link checked ", note.lastChecked));
}

/** Section: h2 as a question; empty sections state their absence plainly — never hidden. */
function Section({
  id,
  label,
  desktop,
  notes = [],
  empty,
  children
}) {
  /* Section rhythm: hairline above each section (structure, not just space), then
     --space-8 down to the heading and --space-4 heading-to-content — a 2:1 ratio so
     each heading owns what follows it. Question headings sit at --text-xl, a clear
     step below the h1: long questions wrap without outweighing their content. */
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: {
      marginTop: 'var(--space-8)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: desktop ? {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 220px',
      gap: 'var(--space-6)'
    } : undefined
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-4)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)',
      color: empty ? 'var(--text-muted)' : 'var(--text-body)'
    }
  }, label), empty ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, empty) : children), desktop && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      paddingTop: 'var(--space-2)'
    }
  }, notes.map((n, i) => /*#__PURE__*/React.createElement(MarginNote, {
    key: i,
    note: n
  })))));
}
function Contents({
  desktop,
  empties
}) {
  const [open, setOpen] = React.useState(false);
  const list = /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Contents",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, TOC.map(t => /*#__PURE__*/React.createElement("a", {
    key: t.id,
    href: '#' + t.id,
    onClick: e => {
      jump(e, t.id);
      setOpen(false);
    },
    style: {
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-ui)',
      lineHeight: 'var(--leading-snug)',
      color: empties[t.id] ? 'var(--text-faint)' : 'var(--text-muted)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--surface-sunken)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, t.label)));
  if (desktop) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 'var(--space-4)',
        alignSelf: 'start'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 var(--space-2)',
        padding: '0 var(--space-3)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-strong)',
        color: 'var(--text-muted)'
      }
    }, "On this page"), list);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(o => !o),
    "aria-expanded": open,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minHeight: 'var(--control-md)',
      padding: '0 var(--space-4)',
      border: 'none',
      background: 'transparent',
      font: 'var(--weight-strong) var(--text-sm) var(--font-sans)',
      color: 'var(--text-body)',
      cursor: 'pointer'
    }
  }, "On this page ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, open ? '−' : '+')), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-2) var(--space-2)'
    }
  }, list));
}
function PaperRow({
  swatch,
  statusLabel,
  type,
  finding,
  meta,
  note,
  desktop
}) {
  /* `type` is the plain-words study type — "trial", "review of several studies",
     "observational study" — never "RCT" or "cohort" in the interface. It renders beside
     the tier label so a reader can see that one remedy's evidence is trials and
     another's is observational: that difference is why one can reach the top bucket. */
  return /*#__PURE__*/React.createElement("li", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      padding: 'var(--space-3) 0',
      borderTop: 'var(--border-w) solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 12,
      height: 12,
      borderRadius: 'var(--radius-xs)',
      flex: 'none',
      marginTop: 4,
      ...swatch
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: 'var(--space-1) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)'
    }
  }, statusLabel), type && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, type)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-body)'
    }
  }, finding), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, meta), !desktop && note && /*#__PURE__*/React.createElement(__ds_scope.StudyChip, _extends({}, note, {
    style: {
      marginTop: 'var(--space-1)'
    }
  }))));
}
function RemedyTemplate({
  data,
  go,
  goGrade
}) {
  const desktop = useDesktop();
  const empties = deriveEmpty(data);
  const serious = !!data.safetySerious;
  const ingredient = data.name.toLowerCase();
  const swV = {
    background: 'var(--evidence)'
  };
  const swM = {
    background: 'var(--evidence)',
    opacity: 0.35
  };
  const swN = {
    background: 'var(--surface-sunken)',
    border: 'var(--border-w) solid var(--border-hairline)'
  };
  const [showNonSleep, setShowNonSleep] = React.useState(data.counts.sleep === 0);
  const body = {
    margin: 0,
    fontSize: 'var(--text-base)',
    lineHeight: 'var(--leading-body)',
    maxWidth: 'var(--measure)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 1120,
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 1120,
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)',
      display: desktop ? 'grid' : 'flex',
      gridTemplateColumns: desktop ? '200px minmax(0, 1fr)' : undefined,
      flexDirection: desktop ? undefined : 'column',
      gap: desktop ? 'var(--space-8)' : 'var(--space-5)'
    }
  }, desktop && /*#__PURE__*/React.createElement(Contents, {
    desktop: true,
    empties: empties
  }), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      paddingTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    trail: [{
      label: 'Remedies',
      onClick: () => go && go('remedies')
    }],
    current: data.name,
    mobile: !desktop
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 'var(--space-1) 0 0',
      fontSize: 'var(--display-lg)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)'
    }
  }, data.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-1) 0 0',
      fontSize: 'var(--text-base)',
      color: 'var(--text-muted)'
    }
  }, data.sub)), data.safetyFlag && /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    title: serious ? 'Serious safety concern.' : 'Safety.',
    style: serious ? {
      fontSize: 'var(--text-lg)'
    } : undefined
  }, data.safetyFlag), /*#__PURE__*/React.createElement("a", {
    href: "#how-we-grade",
    title: "How we grade",
    onClick: e => {
      e.preventDefault();
      goGrade ? goGrade(data.bucket) : go('grade');
    },
    style: {
      textDecoration: 'none',
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: data.bucket,
    sentence: data.bucketSentence
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-ui)',
      lineHeight: 'var(--leading-snug)',
      maxWidth: 'var(--measure)',
      textWrap: 'pretty'
    }
  }, data.verdict), /*#__PURE__*/React.createElement(__ds_scope.StudyField, {
    size: "hero",
    counts: data.counts
  }), data.helpedNote && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, data.helpedNote), /*#__PURE__*/React.createElement(__ds_scope.LastChecked, {
    date: data.lastChecked,
    prefix: "Last checked"
  }), !desktop && /*#__PURE__*/React.createElement(Contents, {
    empties: empties
  })), /*#__PURE__*/React.createElement(Section, {
    id: "work",
    label: "Does it work?",
    desktop: desktop,
    notes: empties.work ? [] : [NOTE_REVIEW],
    empty: empties.work
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PlainStat, {
    size: "sm",
    figure: "About 7 minutes",
    text: "faster to sleep, on average",
    source: "From a review of 19 studies covering 1,683 people",
    chip: desktop ? undefined : {
      ...NOTE_REVIEW,
      defaultOpen: false
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LabelVsStudies, {
    claim: "Fall asleep 3\xD7 faster",
    found: "The studies found about 7 minutes, on average.",
    chip: desktop ? undefined : NOTE_REVIEW
  }), /*#__PURE__*/React.createElement(__ds_scope.LabelVsStudies, {
    animate: false,
    claim: "Wake refreshed",
    found: "[Placeholder \u2014 finding pending write-up]",
    chip: desktop ? undefined : {
      finding: '[Placeholder — finding pending write-up]',
      linkText: 'Read the study'
    }
  })))), /*#__PURE__*/React.createElement(Section, {
    id: "does",
    label: "What does it actually do?",
    desktop: desktop,
    empty: empties.does
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "[Placeholder \u2014 plain-language explanation pending medical review.]")), /*#__PURE__*/React.createElement(Section, {
    id: "dose",
    label: "What's a normal dose and when do you take it?",
    desktop: desktop,
    empty: empties.dose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: desktop ? '1fr 1fr' : '1fr',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)'
    }
  }, "What the studies used"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-2) 0 0',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "[Placeholder]"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-1) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "[Placeholder \u2014 timing pending audit]")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)'
    }
  }, "What bottles typically contain"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-2) 0 0',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-strong)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "[Placeholder]"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-1) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "[Placeholder \u2014 market survey pending]")))), /*#__PURE__*/React.createElement(Section, {
    id: "safety",
    label: "Is it safe with my medications?",
    desktop: desktop
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    level: serious ? 'serious' : 'caution',
    title: serious ? 'Serious safety concern' : 'Check with your pharmacist first'
  }, "[Placeholder \u2014 safety copy pending sourcing. Written by a person, checked against the papers, never generated.]"), !serious && /*#__PURE__*/React.createElement("p", {
    style: body
  }, "[Placeholder \u2014 common side effects, plain language, pending sourcing.]"))), /*#__PURE__*/React.createElement(Section, {
    id: "label",
    label: "What should I look for on the label?",
    desktop: desktop,
    empty: empties.label
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "[Placeholder \u2014 label guidance pending audit: studied form, studied dose, third-party testing, full disclosure.]")), /*#__PURE__*/React.createElement(Section, {
    id: "products",
    label: "Which products deliver it?",
    desktop: desktop,
    empty: !data.productStats && data.products.length === 0 ? ABSENCE.productsNone(ingredient) : null
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, serious && data.safetyFlag && /*#__PURE__*/React.createElement(__ds_scope.SafetyCallout, {
    title: "Read this before the list."
  }, data.safetyFlag), data.productStats && data.productStats.pass > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "Showing ", data.productStats.pass, " of ", data.productStats.checked, " that pass every check \u2014", ' ', /*#__PURE__*/React.createElement("a", {
    href: "#products-index",
    onClick: e => {
      e.preventDefault();
      go('products');
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "see all ", data.productStats.checked, ", including the ones we'd skip \u203A")), data.productStats && data.productStats.pass === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "None of the ", data.productStats.checked, " ", ingredient, " products we checked passes every check.", ' ', /*#__PURE__*/React.createElement("a", {
    href: "#products-index",
    onClick: e => {
      e.preventDefault();
      go('products');
    },
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "See all ", data.productStats.checked, ", and why \u203A")), data.products.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: 'var(--border-w) solid var(--border-hairline)'
    }
  }, data.products.map(p => /*#__PURE__*/React.createElement(__ds_scope.ProductListRow, {
    key: p.product,
    brand: p.brand,
    name: p.product,
    strength: p.strength,
    src: p.src,
    criteria: p.criteria,
    mobile: !desktop,
    onClick: () => go && go('product')
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)'
    }
  }, "Products shown are fictional demo entries; counts are demo values."))), /*#__PURE__*/React.createElement(Section, {
    id: "popular",
    label: "Why is this so popular?",
    desktop: desktop
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)'
    }
  }, "None of this is evidence, and none of it affects the grade above."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Traditional use"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-1)',
      color: 'var(--text-muted)'
    }
  }, "[Placeholder \u2014 how long and where it has been used for sleep, pending write-up.]")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "A plausible mechanism"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginTop: 'var(--space-1)',
      color: 'var(--text-muted)'
    }
  }, "[Placeholder \u2014 why it could work in principle, in plain words, pending medical review.]")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-sunken)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "What people report"), (data.reports || []).length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      color: 'var(--text-muted)'
    }
  }, ABSENCE.reports) : (data.reports || []).map((r, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      ...body,
      color: 'var(--text-muted)'
    }
  }, "\"", r, "\"")))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "Widespread use doesn't move a grade \u2014 ", /*#__PURE__*/React.createElement("a", {
    href: "#popularity",
    onClick: e => e.preventDefault(),
    style: {
      color: 'var(--text-link)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "here's why \u203A")))), /*#__PURE__*/React.createElement(Section, {
    id: "papers",
    label: "The papers behind this page",
    desktop: desktop
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      marginBottom: 'var(--space-4)',
      color: 'var(--text-muted)'
    }
  }, data.counts.cited === 0 ? ABSENCE.papersNoPapers : data.counts.sleep === 0 ? `All ${data.counts.cited} papers cited for ${ingredient} are listed below. None measured sleep.` : `Every paper we cite, with what it found and whether we could verify it.`), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, data.papers.verified.map((p, i) => /*#__PURE__*/React.createElement(PaperRow, {
    key: 'v' + i,
    swatch: swV,
    statusLabel: "Result we could verify",
    type: p.type,
    finding: p.finding,
    meta: p.meta,
    note: p.note,
    desktop: desktop
  })), data.papers.measuredOnly.map((p, i) => /*#__PURE__*/React.createElement(PaperRow, {
    key: 'm' + i,
    swatch: swM,
    statusLabel: "Measured sleep \u2014 we couldn't verify the result",
    type: p.type,
    finding: p.finding,
    meta: p.meta,
    desktop: desktop
  }))), data.papers.nonSleep > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-3)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowNonSleep(s => !s),
    "aria-expanded": showNonSleep,
    style: {
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      font: 'var(--weight-ui) var(--text-sm) var(--font-sans)',
      color: 'var(--text-link)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 12,
      height: 12,
      borderRadius: 'var(--radius-xs)',
      textDecoration: 'none',
      ...swN
    }
  }), showNonSleep ? `Hide the ${data.papers.nonSleep} papers that didn't measure sleep` : `Show the ${data.papers.nonSleep} papers that didn't measure sleep`), showNonSleep && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, Array.from({
    length: data.papers.nonSleep
  }, (_, i) => /*#__PURE__*/React.createElement(PaperRow, {
    key: 'n' + i,
    swatch: swN,
    statusLabel: "Didn't measure sleep",
    finding: "[Placeholder \u2014 paper title and topic pending write-up]",
    meta: "[Details placeholder]",
    desktop: desktop
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LastChecked, {
    date: data.lastChecked,
    prefix: "This page last checked"
  })))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }));
}
const REMEDY_DATA = {
  melatonin: MELATONIN,
  kava: KAVA,
  magnesium: MAGNESIUM,
  valerian: VALERIAN,
  chamomile: CHAMOMILE,
  ashwagandha: ASHWAGANDHA
};
function RemedyPage({
  go,
  goGrade,
  which = 'melatonin'
}) {
  const data = REMEDY_DATA[which] || MELATONIN;
  return /*#__PURE__*/React.createElement(RemedyTemplate, {
    key: data.key,
    data: data,
    go: go,
    goGrade: goGrade
  });
}
Object.assign(__ds_scope, { RemedyTemplate, RemedyPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/RemedyPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/SafetyPage.jsx
try { (() => {
/* /safety — the page the whole site routes vulnerable readers to ("Taking medications,
   pregnant, or thinking about this for a child? Start here"). Read in worried moments,
   often at night, often as someone's first page — MOBILE FIRST, single column, calm.
   Register: a careful pharmacist, not a warning label. Warm, never alarming, never vague.
   COLOUR RULE: amber = the safety register ONLY; every other interface colour is ink.
   All medical content is [Placeholder — pending sourcing/medical review]; this ships the shape. */

/* Derived corpus view — the tri-state safety flag (none / caution / serious) made browsable.
   SAFETY NEVER MOVES A BUCKET, in either direction: kava is "Not properly tested for sleep"
   AND a serious concern — two separate facts, shown separately. REAL flags only: kava
   (serious) and ashwagandha (caution); the rest of the corpus is pending audit, and the
   pending state is shown, never hidden. */
const FLAGGED = [{
  key: 'kava',
  name: 'Kava',
  bucket: 'unknown',
  level: 'serious',
  line: '[Placeholder — serious safety concern; final wording pending sourcing]'
}, {
  key: 'ashwagandha',
  name: 'Ashwagandha',
  bucket: 'unknown',
  level: 'caution',
  line: '[Placeholder — real safety wording pending sourcing]'
}];
const SITUATIONS = [{
  id: 'medications',
  title: 'I take medications',
  why: '[Placeholder — why remedies and medications can interact, in plain words: same body, same pathways. Pending medical review.]',
  concerns: ['[Placeholder — interaction class: blood thinners, pending sourcing]', '[Placeholder — interaction class: antidepressants, pending sourcing]', '[Placeholder — interaction class: sedatives and sleeping pills, pending sourcing]']
}, {
  id: 'pregnancy',
  title: "I'm pregnant or breastfeeding",
  why: '[Placeholder — why the evidence bar is higher here: most remedies are never tested in pregnancy, so "no known concern" means less. Pending medical review.]',
  concerns: ['[Placeholder — concern class: hormones and hormone-like remedies, pending sourcing]', '[Placeholder — concern class: herbs with no pregnancy data, pending sourcing]']
}, {
  id: 'child',
  title: 'This is for a child',
  why: '[Placeholder — why child dosing is not scaled-down adult dosing, and why "natural" does not mean "gentle". Pending medical review.]',
  concerns: ['[Placeholder — concern class: melatonin and developing sleep rhythms, pending sourcing]', '[Placeholder — concern class: sweetened nightly products, pending sourcing]']
}, {
  id: 'condition',
  title: 'I have a health condition',
  why: '[Placeholder — why liver, kidney, heart, and autoimmune conditions change what is safe. Pending medical review.]',
  concerns: ['[Placeholder — concern class: liver conditions, pending sourcing]', '[Placeholder — concern class: autoimmune conditions, pending sourcing]']
}];
const SEE_DOCTOR = ['[Placeholder — sign: sleeplessness lasting beyond a stated stretch, pending medical review]', '[Placeholder — sign: snoring with gasping or long pauses, pending medical review]', '[Placeholder — sign: daytime symptoms that suggest something underlying, pending medical review]', '[Placeholder — sign: sleep problems alongside new medication, pending medical review]'];
function useDesktop() {
  const [d, setD] = React.useState(() => window.matchMedia('(min-width: 720px)').matches);
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 720px)');
    const f = e => setD(e.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return d;
}

/* native hash navigation — fires :target and respects the global scroll-margin-top,
   so a triage tap never lands the heading under sticky chrome */
function jump(e, id) {
  e.preventDefault();
  if ('#' + id === location.hash) {
    history.replaceState(null, '', '#');
  }
  location.hash = id;
}
const body = {
  margin: 0,
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text-body)',
  maxWidth: 'var(--measure)'
};
const muted = {
  ...body,
  color: 'var(--text-muted)'
};

/* Compact flagged-remedy row: name · bucket badge · flag label · one line, linking to the
   remedy's own safety section. The bucket badge and the flag sit side by side UNMERGED —
   the visual restatement that safety never moves a bucket. Hit area ≥ --control-md. */
function FlaggedRow({
  r,
  goRemedy
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#remedy-safety",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: e => {
      e.preventDefault();
      goRemedy && goRemedy(r.key); /* should land on the remedy page's #safety section */
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      minHeight: 'var(--control-md)',
      justifyContent: 'center',
      padding: 'var(--space-3) var(--space-3)',
      margin: '0 calc(-1 * var(--space-3))',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      color: 'var(--text-body)',
      background: hover ? 'var(--surface-sunken)' : 'transparent',
      transition: 'background var(--dur-fast) var(--ease-settle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--space-2) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)'
    }
  }, r.name), /*#__PURE__*/React.createElement(__ds_scope.BucketBadge, {
    bucket: r.bucket,
    compact: true
  }), r.level === 'serious' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--amber)',
      whiteSpace: 'nowrap',
      background: 'var(--amber-tint)',
      border: 'var(--border-w) solid var(--amber-line)',
      borderRadius: 'var(--radius-pill)',
      padding: 'var(--space-1) var(--space-3)',
      lineHeight: 1.2
    }
  }, "Serious concern") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--amber)',
      whiteSpace: 'nowrap'
    }
  }, "Caution"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      marginLeft: 'auto',
      color: 'var(--text-faint)'
    }
  }, "\u203A")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-snug)'
    }
  }, r.line));
}
function FlaggedList({
  goRemedy
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-body)'
    }
  }, "Remedies on this site with safety flags"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-1)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "[Placeholder \u2014 which flags are relevant to this situation is pending medical review; until then, every flagged remedy is listed.]"), FLAGGED.map(r => /*#__PURE__*/React.createElement(FlaggedRow, {
    key: r.key,
    r: r,
    goRemedy: goRemedy
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)'
    }
  }, "[Placeholder \u2014 remaining corpus flags pending audit.]"));
}
function SafetyPage({
  go,
  goRemedy,
  goGrade
}) {
  const desktop = useDesktop();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      maxWidth: 'var(--page-max)',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 24
  })), /*#__PURE__*/React.createElement(__ds_scope.SearchField, {
    size: "sm",
    style: {
      maxWidth: 320,
      marginLeft: 'auto'
    },
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--space-5) var(--space-9)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Breadcrumb, {
    mobile: !desktop,
    current: "Safety",
    trail: [{
      label: 'Somnary',
      onClick: () => go('home')
    }]
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 'var(--space-1) 0 var(--space-3)',
      fontSize: 'var(--display-md)',
      fontWeight: 'var(--weight-title)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-tight)',
      textWrap: 'pretty'
    }
  }, "Is it safe for you?"), /*#__PURE__*/React.createElement("p", {
    style: muted
  }, "Whether a sleep remedy is safe depends on who's taking it \u2014 medications, pregnancy, age, and health conditions all change the answer. Start from your situation."), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Start here",
    style: {
      display: 'grid',
      gridTemplateColumns: desktop ? '1fr 1fr' : '1fr',
      gap: 'var(--space-3)',
      padding: 'var(--space-6) 0 var(--space-4)'
    }
  }, SITUATIONS.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.id,
    href: '#' + s.id,
    onClick: e => jump(e, s.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      minHeight: 'var(--control-xl)',
      padding: 'var(--space-3) var(--space-4)',
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-body)',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)',
      lineHeight: 'var(--leading-snug)',
      transition: 'border-color var(--dur-fast) var(--ease-settle)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-hairline)';
    }
  }, s.title, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: 'var(--text-faint)'
    }
  }, "\u2193")))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "None of these fit? Every remedy page has its own safety section."), SITUATIONS.map(s => /*#__PURE__*/React.createElement("section", {
    key: s.id,
    id: s.id,
    style: {
      marginTop: 'var(--space-8)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-4)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)'
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, s.why), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-1)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Worth checking in this situation"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, s.concerns.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      padding: 'var(--space-3) 0',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, c)))), /*#__PURE__*/React.createElement(FlaggedList, {
    goRemedy: goRemedy
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-8)',
      background: 'var(--amber-tint)',
      border: 'var(--border-w) solid var(--amber-line)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--amber)'
    }
  }, "See a doctor rather than a supplement aisle if\u2026"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, SEE_DOCTOR.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      maxWidth: 'var(--measure)'
    }
  }, t))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-3) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)'
    }
  }, "None of this is a diagnosis \u2014 it's the short list of moments where a professional beats a bottle.")), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-8)',
      borderTop: 'var(--border-w) solid var(--border-hairline)',
      paddingTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 var(--space-4)',
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-heading)',
      letterSpacing: 'var(--tracking-display)',
      lineHeight: 'var(--leading-snug)'
    }
  }, "How safety works on Somnary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, "Every remedy carries one of three safety states, separate from its evidence grade:"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      ...body,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-body)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "No known flag"), " \u2014 nothing documented at normal amounts. Not a guarantee."), /*#__PURE__*/React.createElement("li", {
    style: {
      ...body,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--amber)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Caution"), " \u2014 something documented is worth knowing before you start; the flag links to it."), /*#__PURE__*/React.createElement("li", {
    style: {
      ...body,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--amber)',
      fontWeight: 'var(--weight-strong)'
    }
  }, "Serious concern"), " \u2014 documented risk of real harm. It renders above everything else on that remedy's page.")), /*#__PURE__*/React.createElement("p", {
    style: body
  }, "A safety flag never changes an evidence grade, in either direction. Kava is the example: it's \"Not properly tested for sleep\" ", /*#__PURE__*/React.createElement("em", null, "and"), " it carries a serious concern \u2014 two separate facts, and each would be wrong to fold into the other."), /*#__PURE__*/React.createElement("a", {
    href: "#how-we-grade",
    onClick: e => {
      e.preventDefault();
      goGrade && goGrade();
    },
    style: {
      alignSelf: 'flex-start',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--text-link)'
    }
  }, "The full method, in How we grade \u203A")))), /*#__PURE__*/React.createElement(__ds_scope.DisclaimerBand, {
    onGrade: goGrade
  }, "Somnary is a reference, not medical advice. It can't know your health history or what else you take \u2014 a pharmacist or doctor can, so bring your situation to them rather than deciding from this page alone."));
}
Object.assign(__ds_scope, { SafetyPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/SafetyPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/app.jsx
try { (() => {
function Chrome({
  theme,
  setTheme,
  screen,
  which,
  setWhich,
  product,
  setProduct,
  catalogue,
  setCatalogue,
  brand,
  setBrand
}) {
  const dusk = theme === 'dusk';
  const btn = {
    minHeight: 36,
    padding: '0 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border-strong)',
    background: 'var(--surface-card)',
    color: 'var(--text-muted)',
    font: '600 12px var(--font-sans)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 14,
      right: 14,
      zIndex: 50,
      display: 'flex',
      gap: 8
    }
  }, screen === 'remedy' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setWhich(which === 'kava' ? 'melatonin' : 'kava'),
    style: btn
  }, which === 'kava' ? 'View: Kava (worst case)' : 'View: Melatonin'), screen === 'product' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProduct(product === 'complex' ? 'melts' : 'complex'),
    style: btn
  }, product === 'complex' ? 'View: Failing (1 of 4)' : 'View: Passing (4 of 4)'), screen === 'brand' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setBrand(brand === 'dreamwell' ? 'somnol' : brand === 'somnol' ? 'herbwell' : 'dreamwell'),
    style: btn
  }, brand === 'dreamwell' ? 'View: Somnol (1 product)' : brand === 'somnol' ? 'View: Herbwell (recall)' : 'View: Dreamwell (2 products)'), screen === 'products' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCatalogue(catalogue === 'large' ? 'melatonin' : 'large'),
    style: btn
  }, catalogue === 'large' ? 'View: Melatonin (12 — no chrome)' : 'View: ~40-product mock (chrome)'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTheme(dusk ? 'day' : 'dusk'),
    "aria-pressed": dusk,
    style: btn
  }, dusk ? 'day' : 'dusk'));
}
function App() {
  const [screen, setScreen] = React.useState('home');
  const [which, setWhich] = React.useState('melatonin');
  const [product, setProduct] = React.useState('melts');
  const [catalogue, setCatalogue] = React.useState('melatonin');
  const [brand, setBrand] = React.useState('dreamwell');
  const [gradeSection, setGradeSection] = React.useState(null);
  const [theme, setTheme] = React.useState('day');
  React.useEffect(() => {
    if (theme === 'dusk') document.documentElement.setAttribute('data-theme', 'dusk');else document.documentElement.removeAttribute('data-theme');
  }, [theme]);
  React.useEffect(() => {
    if (screen !== 'grade') window.scrollTo(0, 0);
  }, [screen, which]);
  /* one section-aware grade route, shared by every badge and footer link */
  const goGrade = s => {
    setGradeSection(s || null);
    setScreen('grade');
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Chrome, {
    theme: theme,
    setTheme: setTheme,
    screen: screen,
    which: which,
    setWhich: setWhich,
    product: product,
    setProduct: setProduct,
    catalogue: catalogue,
    setCatalogue: setCatalogue,
    brand: brand,
    setBrand: setBrand
  }), screen === 'remedy' ? /*#__PURE__*/React.createElement(__ds_scope.RemedyPage, {
    go: setScreen,
    goGrade: goGrade,
    which: which
  }) : screen === 'remedies' ? /*#__PURE__*/React.createElement(__ds_scope.RemediesPage, {
    go: setScreen,
    goRemedy: w => {
      setWhich(w);
      setScreen('remedy');
    },
    goGrade: goGrade
  }) : screen === 'grade' ? /*#__PURE__*/React.createElement(__ds_scope.GradePage, {
    go: setScreen,
    section: gradeSection
  }) : screen === 'problem' ? /*#__PURE__*/React.createElement(__ds_scope.ProblemPage, {
    go: setScreen,
    goRemedy: w => {
      setWhich(w);
      setScreen('remedy');
    },
    goGrade: goGrade
  }) : screen === 'products' ? /*#__PURE__*/React.createElement(__ds_scope.ProductsPage, {
    go: setScreen,
    goProduct: p => {
      setProduct(p);
      setScreen('product');
    },
    goGrade: goGrade,
    catalogue: catalogue
  }) : screen === 'product' ? /*#__PURE__*/React.createElement(__ds_scope.ProductPage, {
    go: setScreen,
    goRemedy: w => {
      setWhich(w);
      setScreen('remedy');
    },
    goGrade: goGrade,
    goBrand: k => {
      setBrand(k);
      setScreen('brand');
    },
    which: product
  }) : screen === 'brand' ? /*#__PURE__*/React.createElement(__ds_scope.BrandPage, {
    go: setScreen,
    goProduct: p => {
      setProduct(p);
      setScreen('product');
    },
    goGrade: goGrade,
    which: brand
  }) : screen === 'safety' ? /*#__PURE__*/React.createElement(__ds_scope.SafetyPage, {
    go: setScreen,
    goRemedy: w => {
      setWhich(w);
      setScreen('remedy');
    },
    goGrade: goGrade
  }) : /*#__PURE__*/React.createElement(__ds_scope.HomePage, {
    go: setScreen,
    goGrade: goGrade,
    goRemedy: w => {
      setWhich(w);
      setScreen('remedy');
    },
    goBrand: k => {
      setBrand(k);
      setScreen('brand');
    }
  }));
}

/* unique export name: sibling demo modules may not all export `mount` (bundler collision rule) */
function mountSite(el) {
  ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(App, null));
}
Object.assign(__ds_scope, { mountSite });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BrandMark = __ds_scope.BrandMark;

__ds_ns.BrandResultRow = __ds_scope.BrandResultRow;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.VerdictPill = __ds_scope.VerdictPill;

__ds_ns.ProductListRow = __ds_scope.ProductListRow;

__ds_ns.RemedyCard = __ds_scope.RemedyCard;

__ds_ns.WhereToBuyRow = __ds_scope.WhereToBuyRow;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.SafetyMark = __ds_scope.SafetyMark;

__ds_ns.SafetyCallout = __ds_scope.SafetyCallout;

__ds_ns.LastChecked = __ds_scope.LastChecked;

__ds_ns.DisclaimerBand = __ds_scope.DisclaimerBand;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.LabelVsStudies = __ds_scope.LabelVsStudies;

__ds_ns.PlainStat = __ds_scope.PlainStat;

__ds_ns.StudyChip = __ds_scope.StudyChip;

__ds_ns.StudyField = __ds_scope.StudyField;

__ds_ns.BUCKETS = __ds_scope.BUCKETS;

__ds_ns.BucketBadge = __ds_scope.BucketBadge;

__ds_ns.BucketShape = __ds_scope.BucketShape;

__ds_ns.PairedVerdict = __ds_scope.PairedVerdict;

__ds_ns.CRITERIA = __ds_scope.CRITERIA;

__ds_ns.PASSES_THRESHOLD = __ds_scope.PASSES_THRESHOLD;

__ds_ns.ProductScoreBadge = __ds_scope.ProductScoreBadge;

__ds_ns.BrandPage = __ds_scope.BrandPage;

__ds_ns.GradePage = __ds_scope.GradePage;

__ds_ns.HomePage = __ds_scope.HomePage;

__ds_ns.ProblemPage = __ds_scope.ProblemPage;

__ds_ns.ProductPage = __ds_scope.ProductPage;

__ds_ns.ProductsPage = __ds_scope.ProductsPage;

__ds_ns.RemediesPage = __ds_scope.RemediesPage;

__ds_ns.RemedyTemplate = __ds_scope.RemedyTemplate;

__ds_ns.RemedyPage = __ds_scope.RemedyPage;

__ds_ns.SafetyPage = __ds_scope.SafetyPage;

})();
