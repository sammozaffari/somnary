import React from 'react';

const SHAPES = {
  works: (sw) => (
    <circle cx="8" cy="8" r="6.5" fill="currentColor" />
  ),
  maybe: (sw) => (
    <g>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth={sw} />
      <path d="M2 8 a6 6 0 0 0 12 0 z" fill="currentColor" />
    </g>
  ),
  unknown: (sw) => (
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth={sw} />
  ),
  avoid: (sw) => (
    <g>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth={sw} />
      <line x1="3.8" y1="12.2" x2="12.2" y2="3.8" stroke="currentColor" strokeWidth={sw} />
    </g>
  ),
};

/** The shared bucket glyph: disc / half disc / ring / struck ring. Colour comes from currentColor. */
export function BucketShape({ bucket = 'unknown', size = 16, strokeWidth = 1.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" style={{ flex: 'none', display: 'block', ...style }}>
      {(SHAPES[bucket] || SHAPES.unknown)(strokeWidth)}
    </svg>
  );
}
