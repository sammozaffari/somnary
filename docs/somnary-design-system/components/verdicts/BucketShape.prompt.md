The shared bucket glyph (disc / half disc / ring / struck ring) — use it anywhere a bucket is referenced so shape coding stays identical everywhere.

```jsx
<span style={{ color: 'var(--bucket-works)' }}>
  <BucketShape bucket="works" size={16} />
</span>
```

Colour comes from `currentColor` — always pair with the matching `--bucket-*` token.
