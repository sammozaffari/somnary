/**
 * The research filter — the signature evidence visual. One nested bar with transparent
 * hairline gaps at segment boundaries. Copy is authored independently per size and always
 * stands alone (noun always present: "5 of 14 papers…", never bare "5 of 14").
 * variant 'three' (ships): track = papers cited · 35% = measured sleep · solid = results we
 * could verify. variant 'two': bar = cited/measured only; verify count in an expandable line.
 * Direction is one plain sentence via `helped` — never a chart. A safetyFlag always outranks
 * the visual. The muted remainder is always labelled exactly "didn't measure sleep".
 * @startingPoint section="Evidence" subtitle="Research filter bar" viewport="660x300"
 */
export interface StudyFieldProps {
  /** The three nested quantities: cited ≥ sleep ≥ verifiable. */
  counts: { cited: number; sleep: number; verifiable: number };
  /** Of the verifiable results, how many found an improvement — renders one plain sentence. */
  helped?: number;
  /** Preset bar height + caption size. Default 'hero'. */
  size?: 'hero' | 'thumb' | 'share';
  /** 'three' (default) or 'two' — see above. */
  variant?: 'three' | 'two';
  /** Remedy name prefix for standalone contexts (share images): "Melatonin: of 14 papers…". */
  subject?: string;
  /** Serious safety concern, one plain sentence — always shown first, outranks everything. */
  safetyFlag?: string;
  /** Empty-state text. Default "No published papers yet." */
  emptyText?: string;
  style?: React.CSSProperties;
}
