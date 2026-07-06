/** @type {import('tailwindcss').Config} */

// somnaryTheme — DESIGN_SYSTEM.md v2 (evidence-teal), verbatim values. Do not
// re-derive or "improve" any value (DESIGN_SYSTEM §10 guardrails). Grade colors
// and their contrast are ratified and final (§3, §8).
//
const grade = {
  s: { DEFAULT: '#0d4f44', tint: '#e2eae9', anchor: '#08382f' },
  a: { DEFAULT: '#0a6f5c', tint: '#e2eeeb', anchor: '#064d43' },
  b: { DEFAULT: '#006b70', tint: '#e0edee', anchor: '#004c50' },
  c: { DEFAULT: '#b87900', tint: '#f6efe0', anchor: '#8f5e00' },
  d: { DEFAULT: '#b14a2b', tint: '#f6e9e6', anchor: '#8c3a21' },
  f: { DEFAULT: '#b82432', tint: '#f6e5e6', anchor: '#911c27' },
};

const somnaryTheme = {
  colors: {
    // surfaces
    paper: '#f5f7f3', surface: '#ffffff', stone: '#e5ece8', mineral: '#cbd9d3',
    // text
    ink: '#091a18', raisin: '#12302e', muted: '#53635f', soft: '#7a8a86',
    // primary (evidence teal)
    primary: { DEFAULT: '#006b70', deep: '#004c50', soft: '#dff2ee' },
    // action (citron) — hero CTA only
    action: { DEFAULT: '#b8ff5c', ink: '#12220d' },
    // secondary accent
    eucalyptus: '#007f70', pistachio: '#e8f7d8',
    // safety
    vermilion: { DEFAULT: '#e34234', bg: '#fff0ed', ink: '#a02c22' },
    // grades
    grade,
    // borders as color (hairline)
    line: { DEFAULT: 'rgba(9,26,24,0.13)', strong: '#cbd9d3' },
  },
  fontFamily: {
    display: ['Archivo', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
    body:    ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
    mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
  },
  fontSize: {
    display: ['clamp(64px, 8vw, 128px)', { lineHeight: '0.92', letterSpacing: '-0.067em', fontWeight: '900' }],
    '3xl':   ['clamp(38px, 4.3vw, 66px)', { lineHeight: '1.0', letterSpacing: '-0.065em', fontWeight: '900' }],
    '2xl':   ['42px', { lineHeight: '1.05', letterSpacing: '-0.06em', fontWeight: '800' }],
    xl:      ['32px', { lineHeight: '1.10', letterSpacing: '-0.04em', fontWeight: '700' }],
    lg:      ['21px', { lineHeight: '1.20', letterSpacing: '-0.025em', fontWeight: '700' }],
    md:      ['18px', { lineHeight: '1.40', fontWeight: '500' }],
    base:    ['16px', { lineHeight: '1.45', fontWeight: '400' }],
    sm:      ['14px', { lineHeight: '1.50', fontWeight: '400' }],
    xs:      ['12px', { lineHeight: '1.40', letterSpacing: '0.09em', fontWeight: '600' }],
  },
  spacing: { 1:'4px',2:'8px',3:'12px',4:'16px',5:'24px',6:'32px',7:'48px',8:'64px',9:'96px',10:'128px' },
  borderRadius: { xs:'3px', sm:'7px', md:'11px', lg:'16px', xl:'24px', pill:'999px' },
  boxShadow: {
    sm:   '0 1px 2px rgba(0,76,80,.05), 0 1px 3px rgba(0,76,80,.06)',
    md:   '0 18px 60px rgba(0,76,80,.11)',
    lift: '0 28px 90px rgba(0,76,80,.24)',
    ring: '0 0 0 3px rgba(0,107,112,.40)',
  },
  transitionDuration: { instant:'120ms', fast:'160ms', base:'320ms', slow:'560ms', ambient:'2800ms' },
  transitionTimingFunction: {
    settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
    soft:   'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  screens: {
    'mx-lap': { max: '900px' }, 'mx-tab': { max: '760px' }, 'mx-phone': { max: '640px' },
  },
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: { extend: somnaryTheme },
  plugins: [],
};
