The ingredient verdict: bucket chip (shape + colour + label) with its one plain sentence always beneath — never make the reader find a legend.

```jsx
<BucketBadge bucket="works" />
<BucketBadge bucket="maybe" naming="evidence" />
<BucketBadge bucket="avoid" compact /> // dense rows only
```

Buckets: `works` / `maybe` / `unknown` / `avoid`. `naming="evidence"` switches to the "Strong evidence…" wording variant. Exports `BUCKETS` (labels, colours, default sentences) for composition.
