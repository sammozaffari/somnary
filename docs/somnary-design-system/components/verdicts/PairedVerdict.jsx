import React from 'react';
import { BucketBadge, BUCKETS } from './BucketBadge.jsx';
import { ProductScoreBadge, CRITERIA } from './ProductScoreBadge.jsx';

function bottomLine(bucket, met, ingredientName) {
  const name = ingredientName || 'the ingredient';
  const productStrong = met >= 3;
  const ingredientStrong = bucket === 'works';
  if (ingredientStrong && productStrong)
    return { text: `Worth buying — ${name} works, and this bottle gives you what was studied.`, color: 'var(--bucket-works)' };
  if (productStrong)
    return {
      text: bucket === 'maybe' ? `A well-made bottle of something that only helps a little.`
        : bucket === 'avoid' ? `A well-made bottle of something the studies say doesn't help sleep.`
        : `A well-made bottle of something not properly tested for sleep.`,
      color: 'var(--text-body)',
    };
  if (ingredientStrong)
    return { text: `${name.charAt(0).toUpperCase() + name.slice(1)} works — but this bottle doesn't give you what was studied.`, color: 'var(--text-body)' };
  return { text: bucket === 'avoid' ? 'Skip this one.' : 'Neither the ingredient nor this bottle earns it.', color: 'var(--bucket-avoid)' };
}

/** The paired verdict: both questions answered side by side, never merged into one score,
    with a one-sentence bottom line. Mismatch states are the point. */
export function PairedVerdict({ bucket = 'unknown', criteria = {}, ingredientName, productName, naming = 'plain', bucketSentence, style }) {
  const met = CRITERIA.filter(c => criteria[c.key]).length;
  const line = bottomLine(bucket, met, ingredientName);
  const cell = { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minWidth: 0, flex: '1 1 220px' };
  const q = { margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)' };
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: 'var(--surface-card)', border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', ...style }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5) var(--space-7)' }}>
        <div style={cell}>
          <p style={q}>Does {ingredientName || 'the ingredient'} work?</p>
          <BucketBadge bucket={bucket} naming={naming} sentence={bucketSentence} />
        </div>
        <div style={cell}>
          <p style={q}>Does {productName ? 'this bottle' : 'the product'} deliver it?</p>
          <ProductScoreBadge criteria={criteria} />
        </div>
      </div>
      <p style={{ margin: 0, paddingTop: 'var(--space-4)', borderTop: 'var(--border-w) solid var(--border-hairline)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-snug)',
        fontWeight: 'var(--weight-ui)', letterSpacing: 'var(--tracking-display)', color: line.color, textWrap: 'pretty' }}>
        {line.text}
      </p>
    </div>
  );
}
