# Label checker state type

The implementation in `src/lib/label-rules.ts` uses a discriminated union. Checked results share a base that requires the exact branded index used to derive the result.

```ts
declare const loadedIndexBrand: unique symbol;

interface LoadedIndex {
  readonly kind: 'loaded_label_index';
  readonly entries: readonly [LabelEntry, ...LabelEntry[]];
  readonly [loadedIndexBrand]: true;
}

interface CheckedStateBase {
  index: LoadedIndex;
  checked: readonly RecognisedItem[];
  doseChecksNotApplied: readonly DoseCheckGap[];
}

type CheckerState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'index_unavailable'; reason: IndexFailureReason }
  | { kind: 'parsing' }
  | { kind: 'parse_failed'; reason: ParseFailureReason }
  | (CheckedStateBase & {
      kind: 'partial';
      checked: readonly [RecognisedItem, ...RecognisedItem[]];
      unrecognised: readonly [string, ...string[]];
      flags: readonly CheckerFlag[];
    })
  | (CheckedStateBase & {
      kind: 'unrecognised';
      checked: readonly [];
      items: readonly [string, ...string[]];
      flags: readonly [];
    })
  | (CheckedStateBase & {
      kind: 'flags_found';
      flags: readonly [CheckerFlag, ...CheckerFlag[]];
    })
  | (CheckedStateBase & {
      kind: 'no_flags_checked';
      checked: readonly [RecognisedItem, ...RecognisedItem[]];
      flags: readonly [];
    });
```

`createLoadedIndex` is the only constructor: it rejects empty or malformed data and applies the private brand. Because error and parse-failure states do not carry `LoadedIndex`, neither can be represented as a checked result without first obtaining a valid index.
