The paired verdict — both questions answered together, never merged into one score. Design intent: the mismatch states (good product / weak ingredient, good ingredient / poor product) are the most common and most useful results.

```jsx
<PairedVerdict bucket="works" ingredientName="melatonin" productName="Somnia 3mg"
  criteria={{ dose: true, tested: true, disclosed: true, form: true }} />
```

Bottom line is computed: "Worth buying" only when bucket is `works` AND ≥3 checks pass.
