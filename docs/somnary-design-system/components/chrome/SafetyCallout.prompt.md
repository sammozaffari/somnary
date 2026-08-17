Safety amber, reserved for actual safety. Tinted-left-edge on soft amber ground (the shared "documented concern" edge language); shape-coded mark (outline = caution, filled = serious); stacks itself when narrow — never wrap it in layout that assumes side-by-side. Never author safety copy in a design file — placeholders only. Same file exports `SafetyMark`, `LastChecked` (mono date tag) and `DisclaimerBand` (page-bottom strip with default copy).

```jsx
<SafetyCallout level="caution">[Placeholder — interaction wording pending sourcing]</SafetyCallout>
<SafetyCallout level="serious" title="Serious concern">[Placeholder — serious safety concern wording, pending sourcing]</SafetyCallout>
<LastChecked date="1 August 2026" />
<DisclaimerBand />
```
