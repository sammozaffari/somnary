import React from 'react';

/** The wordmark: "Somnary" — capitalised, no trailing period. Onest 600. */
export function Wordmark({ size = 28, style }) {
  return (
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-strong)', fontSize: size,
      letterSpacing: 'var(--tracking-display)', color: 'var(--text-body)', lineHeight: 1, ...style }}>
      Somnary
    </span>
  );
}
