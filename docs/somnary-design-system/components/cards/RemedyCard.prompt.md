One ingredient in a grid: name, research-filter thumb, verdict badge + sentence. Whole card is a link. Names are sentence case except scientific convention (L-theanine, 5-HTP, GABA, CBD, vitamin D).

```jsx
<RemedyCard name="Melatonin" bucket="works" meta="14 papers"
  research={{ counts: { cited: 14, sleep: 9, verifiable: 5 } }} href="/remedies/melatonin" />
<RemedyCard name="Kava" bucket="avoid" safetyFlag="[Placeholder — serious safety concern wording, pending sourcing]"
  research={{ counts: { cited: 5, sleep: 1, verifiable: 1 } }} />
```
