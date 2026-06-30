/** @type {import('tailwindcss').Config} */

// somnaryTheme — DESIGN_SYSTEM.md §1b, verbatim. Do not re-derive or "improve" any
// value (see DESIGN_SYSTEM §5 guardrails). Tier triplets are contrast-checked and final.
const somnaryTheme = {
  colors: {
    base: '#F7F5F0', surface: '#FCFBF7', sunken: '#F0EDE4',
    line: { DEFAULT: '#E4DFD3', strong: '#D0C9B9' },
    ink:  { DEFAULT: '#1A1A1F', soft: '#4C4B52', faint: '#726F63' },
    lavender: { DEFAULT: '#8480C4', ink: '#5A549E', tint: '#ECEAF6' }, // DEFAULT = fill/border only
    sage:     { DEFAULT: '#82A088', ink: '#4C6E53', tint: '#E8EFE7' }, // DEFAULT = fill/border only
    tier: {
      s: { DEFAULT: '#3D7A54', ink: '#2E6342', tint: '#E4EEE6' },
      a: { DEFAULT: '#6E8B3F', ink: '#566E2F', tint: '#ECEFDF' },
      b: { DEFAULT: '#94791F', ink: '#75600F', tint: '#F1ECD9' },
      c: { DEFAULT: '#A8682E', ink: '#864F1F', tint: '#F3E8DA' },
      d: { DEFAULT: '#AD5538', ink: '#8C4127', tint: '#F4E3DB' },
      f: { DEFAULT: '#9B5161', ink: '#7C3F4D', tint: '#F1E2E4' },
    },
  },
  fontFamily: {
    display: ['Newsreader', 'Georgia', 'serif'],
    body:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
    mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    display: ['84px',   { lineHeight: '0.98', letterSpacing: '-0.02em', fontWeight: '400' }],
    '3xl':   ['60px',   { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '400' }],
    '2xl':   ['44px',   { lineHeight: '1.05', fontWeight: '400' }],
    xl:      ['32px',   { lineHeight: '1.10', fontWeight: '500' }],
    lg:      ['24px',   { lineHeight: '1.20', fontWeight: '600' }],
    md:      ['21px',   { lineHeight: '1.50', fontWeight: '400' }],
    base:    ['18px',   { lineHeight: '1.62', fontWeight: '400' }],
    sm:      ['15px',   { lineHeight: '1.50', fontWeight: '400' }],
    xs:      ['12.5px', { lineHeight: '1.40', letterSpacing: '0.12em', fontWeight: '500' }],
  },
  spacing: { 1:'4px',2:'8px',3:'12px',4:'16px',5:'24px',6:'32px',7:'48px',8:'64px',9:'96px',10:'128px' },
  borderRadius: { xs:'3px', sm:'6px', md:'10px', lg:'16px', xl:'22px', pill:'999px' },
  boxShadow: {
    sm:   '0 1px 2px rgba(26,26,31,.04), 0 1px 3px rgba(26,26,31,.06)',
    md:   '0 4px 12px -4px rgba(26,26,31,.10)',
    lift: '0 14px 34px -16px rgba(26,26,31,.18)',
    ring: '0 0 0 3px rgba(132,128,196,.40)',
  },
  transitionDuration: { instant:'120ms', fast:'200ms', base:'320ms', slow:'560ms', ambient:'2800ms' },
  transitionTimingFunction: {
    settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
    soft:   'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  screens: { // max-width (use in `max-*` variants)
    'mx-lap': { max: '900px' }, 'mx-tab': { max: '760px' }, 'mx-phone': { max: '640px' },
  },
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: { extend: somnaryTheme },
  plugins: [],
};
