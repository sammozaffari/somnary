Product score: "3 of 4 checks pass" with the factual breakdown visible (dose / third-party tested / disclosure / studied form). Never a mystery number — the checks ARE the score.

```jsx
<ProductScoreBadge criteria={{ dose: true, tested: true, disclosed: true, form: false }} />
<ProductScoreBadge criteria={{ dose: false, tested: true }} showBreakdown={false} /> // dense rows
```

Exports `CRITERIA` (keys + reader-facing labels). 3–4 met renders sage, 2 ochre, 0–1 clay.
