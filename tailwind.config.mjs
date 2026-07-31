/** @type {import('tailwindcss').Config} */

// somnaryTheme — DESIGN_SYSTEM.md v3 (warm/oxblood · Instrument Sans), verbatim
// values. Do not re-derive or "improve" any value (DESIGN_SYSTEM §10 guardrails).
// Mirrors the :root token VALUES in src/styles/global.css (names unchanged from v2).
// Grade colors and their contrast are ratified and final (§3, §8).
//
const grade = {
  s: { DEFAULT: '#274B3F', tint: '#E5EBE7', anchor: '#1B3A30' },
  a: { DEFAULT: '#3F6A57', tint: '#E7EEE9', anchor: '#2E5343' },
  b: { DEFAULT: '#47695A', tint: '#E8EDE9', anchor: '#35564A' },
  c: { DEFAULT: '#8F5E12', tint: '#F5EEDD', anchor: '#6E470E' },
  d: { DEFAULT: '#9A4F28', tint: '#F5E8DF', anchor: '#78401F' },
  f: { DEFAULT: '#96323E', tint: '#F5E4E5', anchor: '#77232D' },
};

const somnaryTheme = {
  colors: {
    // surfaces (warm off-whites)
    paper: '#FCFAF2', surface: '#FFFFFF', stone: '#EEE8DA', mineral: '#DBD5CD',
    // text
    ink: '#171512', raisin: '#2B2028', muted: '#5C574F', soft: '#8C867B',
    // primary (oxblood)
    primary: { DEFAULT: '#7E1F2B', deep: '#661722', soft: '#F6E7E3' },
    // action (oxblood) — primary CTA
    action: { DEFAULT: '#7E1F2B', ink: '#FFFFFF' },
    // secondary accent (green)
    eucalyptus: '#3F6A57', pistachio: '#E9F2DB',
    // safety (vermilion) — DISTINCT from oxblood
    vermilion: { DEFAULT: '#E34234', bg: '#FDECE7', ink: '#A02C22' },
    // grades
    grade,
    // borders as color (hairline)
    line: { DEFAULT: 'rgba(23,21,18,0.13)', strong: '#DBD5CD' },
  },
  fontFamily: {
    // "Instrument Sans Variable" is the @font-face family from the self-hosted variable
    // package; listed first so it binds. "Instrument Sans" kept as static fallback.
    display: ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
    body:    ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
    // IBM Plex Mono RETIRED 2026-07-09 — mirror global.css --font-mono, which now aliases the
    // Instrument Sans stack (nothing renders monospace; digits align via .tnum / tabular-nums).
    mono:    ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
  },
  fontSize: {
    // Instrument Sans caps at 700; former Archivo 800/900 display weights map to 700.
    display: ['clamp(64px, 8vw, 128px)', { lineHeight: '0.92', letterSpacing: '-0.067em', fontWeight: '700' }],
    '3xl':   ['clamp(38px, 4.3vw, 66px)', { lineHeight: '1.0', letterSpacing: '-0.065em', fontWeight: '700' }],
    '2xl':   ['42px', { lineHeight: '1.05', letterSpacing: '-0.06em', fontWeight: '700' }],
    // xl retuned to match global.css --tracking-tight (v4, 2026-07-27): the old -0.04em was
    // size-blind. NB: display/3xl/2xl/lg letterSpacing below predate the v4 tracking retune;
    // components apply --tracking-tight/--tracking-display, not these utility values.
    xl:      ['32px', { lineHeight: '1.10', letterSpacing: '-0.02em', fontWeight: '700' }],
    lg:      ['21px', { lineHeight: '1.20', letterSpacing: '-0.025em', fontWeight: '600' }],
    md:      ['18px', { lineHeight: '1.40', fontWeight: '500' }],
    base:    ['16px', { lineHeight: '1.60', fontWeight: '400' }],
    sm:      ['14px', { lineHeight: '1.50', fontWeight: '400' }],
    xs:      ['12px', { lineHeight: '1.40', letterSpacing: '0.09em', fontWeight: '600' }],
  },
  spacing: { 1:'4px',2:'8px',3:'12px',4:'16px',5:'24px',6:'32px',7:'48px',8:'64px',9:'96px',10:'128px' },
  // v4 radius discipline (2026-07-27) — mirror global.css --r-* (4/8/10/12/16), not the old
  // 3/7/11/16/24 spread, so a `rounded-*` utility can never diverge from var(--r-*).
  borderRadius: { xs:'4px', sm:'8px', md:'10px', lg:'12px', xl:'16px', pill:'999px' },
  boxShadow: {
    sm:   '0 1px 2px rgba(23,21,18,.05), 0 1px 3px rgba(23,21,18,.06)',
    md:   '0 18px 60px rgba(23,21,18,.10)',
    lift: '0 24px 70px rgba(23,21,18,.16)',
    ring: '0 0 0 2px var(--surface), 0 0 0 4px var(--primary)', // mirror --focus-ring (A-01 two-tone); old 40%-alpha ring failed 3:1 non-text
  },
  transitionDuration: { instant:'120ms', fast:'160ms', base:'320ms', slow:'560ms', ambient:'2800ms' },
  transitionTimingFunction: {
    settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
    soft:   'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Canonical v4 breakpoints (mobile-first min-width), mirroring --bp-* in global.css §7.
  // Currently no component uses Tailwind responsive utilities (all responsiveness is scoped
  // @media), so this is the documented standard for any future utility use.
  screens: {
    sm: '480px', md: '768px', lg: '1024px', xl: '1440px',
  },
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: { extend: somnaryTheme },
  plugins: [],
};
