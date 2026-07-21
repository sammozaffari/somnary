/**
 * Additive-watchlist reader for the Lens rubric (CHK-7.1c).
 *
 * The Source Scorecard additive watchlist (src/data/additive-watchlist.yaml) is a CITED list of
 * formulation ingredients that, when present in a pasted label, are worth surfacing (a colorant with
 * a withdrawn regulatory approval, a preservative flagged in an RCT, a proprietary-blend transparency
 * defect). The Lens applies the DETERMINISTIC part of that list: does the pasted panel NAME a flagged
 * additive? If so, surface a neutral, cited note. It NEVER computes the scorecard's numeric score —
 * that composite/rubric is itself a not-in-force human gate (per the build spec) — so no severity is
 * summed, ranked, or turned into a grade here.
 *
 * NO NEW DEPENDENCY: the file has a small, fixed shape, so parseAdditiveWatchlist() is a purpose-built
 * line parser over the `flagged:` block (id / names / class / severity / structural / sources). It is
 * PURE and never throws; a malformed block yields fewer entries, never a crash. The `not_flagged:`
 * block is intentionally ignored (those are benign excipients the watchlist explicitly does NOT flag).
 *
 * Every source id on a surfaced entry is re-validated by the engine through citations.ts before it
 * reaches a card, so a malformed id in the YAML can never become a citation.
 *
 * Erasable TS so the offline CI runner imports it directly. The server-only file-loading half
 * (getAdditiveWatchlist) is split out to keep this module fs-free and Node-testable.
 */

import type { CitationId } from './citations.ts';

export type AdditiveSeverity = 'flag' | 'concern';

/** One flagged additive, projected to the fields the rubric needs. `sources` carry the raw id fields
 * (pmid/doi) exactly as stored; the engine validates them. `structural` entries (proprietary blend)
 * carry no external citation — that transparency defect is already covered by label rule R1. */
export interface AdditiveEntry {
  id: string;
  names: string[];
  severity: AdditiveSeverity;
  structural: boolean;
  sources: CitationId[];
}

/** Strip surrounding quotes/whitespace from a scalar value. */
function unquote(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Parse a `["a", "b", ...]` inline flow list into trimmed, unquoted strings. */
function parseFlowList(raw: string): string[] {
  const inner = raw.trim().replace(/^\[/, '').replace(/\]$/, '');
  if (!inner.trim()) return [];
  const out: string[] = [];
  // Split on commas that are not inside quotes (the names here have no escaped quotes/commas).
  let buf = '';
  let inQuote: string | null = null;
  for (const ch of inner) {
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
      else buf += ch;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === ',') {
      out.push(buf.trim());
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out.map((s) => s.trim()).filter(Boolean);
}

/**
 * Parse the watchlist YAML text into the flagged AdditiveEntry[]. Purpose-built for THIS file's fixed
 * shape (a top-level `flagged:` sequence of maps, then a `not_flagged:` sequence we ignore). Pure;
 * never throws — anything it can't parse is skipped.
 */
export function parseAdditiveWatchlist(yamlText: string): AdditiveEntry[] {
  if (typeof yamlText !== 'string' || !yamlText) return [];
  const lines = yamlText.split(/\r?\n/);

  // Find the `flagged:` block and stop at `not_flagged:` (or EOF).
  let start = -1;
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^flagged:\s*$/.test(lines[i])) start = i + 1;
    else if (start >= 0 && /^not_flagged:\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start < 0) return [];

  const entries: AdditiveEntry[] = [];
  let cur: Partial<AdditiveEntry> | null = null;
  let inSources = false;
  let curSource: Record<string, string> | null = null;

  const flush = () => {
    if (cur && typeof cur.id === 'string' && cur.id) {
      if (curSource && Object.keys(curSource).length) {
        (cur.sources ??= []).push(curSource as CitationId);
        curSource = null;
      }
      entries.push({
        id: cur.id,
        names: cur.names ?? [],
        severity: cur.severity === 'concern' ? 'concern' : 'flag',
        structural: cur.structural === true,
        sources: cur.sources ?? [],
      });
    }
    curSource = null;
  };

  for (let i = start; i < end; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // New list item: "  - id: <slug>"
    const itemMatch = /^\s*-\s+id:\s*(.+)$/.exec(line);
    if (itemMatch) {
      flush();
      cur = { id: unquote(itemMatch[1]), names: [], sources: [] };
      inSources = false;
      curSource = null;
      continue;
    }
    if (!cur) continue;

    if (/^\s*sources:\s*$/.test(line)) {
      inSources = true;
      curSource = null;
      continue;
    }

    if (inSources) {
      // A source list item may start on the "- pmid: X" line, then continue with "title:"/"year:".
      const srcStart = /^\s*-\s+(pmid|doi|registry):\s*(.+)$/.exec(line);
      if (srcStart) {
        if (curSource && Object.keys(curSource).length) (cur.sources ??= []).push(curSource as CitationId);
        curSource = { [srcStart[1]]: unquote(srcStart[2]) };
        continue;
      }
      const srcCont = /^\s+(pmid|doi|registry):\s*(.+)$/.exec(line);
      if (srcCont && curSource) {
        curSource[srcCont[1]] = unquote(srcCont[2]);
        continue;
      }
      // title/year/type continuation lines are ignored (the rubric only needs the id).
      continue;
    }

    // Scalar fields on the entry.
    const namesMatch = /^\s+names:\s*(\[.*\])\s*$/.exec(line);
    if (namesMatch) {
      cur.names = parseFlowList(namesMatch[1]);
      continue;
    }
    const sevMatch = /^\s+severity:\s*(\S+)\s*$/.exec(line);
    if (sevMatch) {
      cur.severity = unquote(sevMatch[1]) === 'concern' ? 'concern' : 'flag';
      continue;
    }
    const structMatch = /^\s+structural:\s*(true|false)\s*$/.exec(line);
    if (structMatch) {
      cur.structural = structMatch[1] === 'true';
      continue;
    }
  }
  flush();
  return entries;
}
