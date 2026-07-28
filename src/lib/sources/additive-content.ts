/**
 * Rich, human-facing parser for the additive watchlist YAML (src/data/additive-watchlist.yaml),
 * for the /sources/additives education page. SEPARATE from the Lens rubric parser
 * (src/lib/lens/additive-watchlist.ts), which projects only the fields the scoring engine needs
 * (id/names/severity/structural/sources) and ignores `not_flagged`. This one additionally captures
 * `class` + the folded `rationale` prose + the `not_flagged` section, so the page can teach.
 *
 * Hand-written to match THIS file's fixed shape — the repo deliberately avoids a YAML dependency.
 * Pure; never throws — anything unparseable is skipped.
 */

export interface AdditiveSource {
  ref: string; // "PMID 29090120" or "DOI 10.2903/j.efsa.2018.5088"
  url: string; // resolvable link
  title: string;
  year: string;
  type: string;
}

export interface AdditiveContentEntry {
  id: string;
  /** Display name — the first, plainest name in `names`. */
  name: string;
  /** All names/synonyms to spot on a label. */
  names: string[];
  class: string; // colorant | preservative | filler | structural | excipient
  severity: 'flag' | 'concern' | null; // null for not-flagged
  structural: boolean;
  rationale: string;
  sources: AdditiveSource[];
}

export interface AdditiveContent {
  flagged: AdditiveContentEntry[];
  notFlagged: AdditiveContentEntry[];
}

function unquote(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseFlowList(raw: string): string[] {
  const inner = raw.trim().replace(/^\[/, '').replace(/\]$/, '');
  if (!inner.trim()) return [];
  const out: string[] = [];
  let buf = '';
  let q: string | null = null;
  for (const ch of inner) {
    if (q) {
      if (ch === q) q = null;
      else buf += ch;
    } else if (ch === '"' || ch === "'") q = ch;
    else if (ch === ',') {
      out.push(buf.trim());
      buf = '';
    } else buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.map((s) => s.trim()).filter(Boolean);
}

function sourceRefUrl(s: Record<string, string>): { ref: string; url: string } {
  if (s.pmid) return { ref: `PMID ${s.pmid}`, url: `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/` };
  if (s.doi) return { ref: `DOI ${s.doi}`, url: `https://doi.org/${s.doi}` };
  if (s.registry) return { ref: s.registry, url: s.registry };
  return { ref: '', url: '' };
}

/** Parse ONE `flagged:` / `not_flagged:` block (the lines between its header and the next). */
function parseBlock(lines: string[], start: number, end: number, defaultSeverityNull: boolean): AdditiveContentEntry[] {
  const entries: AdditiveContentEntry[] = [];
  let cur: Partial<AdditiveContentEntry> & { _rat?: string[] } | null = null;
  let inSources = false;
  let curSource: Record<string, string> | null = null;
  let inRationale = false;

  const flushSource = () => {
    if (cur && curSource && Object.keys(curSource).length) {
      const { ref, url } = sourceRefUrl(curSource);
      if (ref) (cur.sources ??= []).push({ ref, url, title: curSource.title ?? '', year: curSource.year ?? '', type: curSource.type ?? '' });
    }
    curSource = null;
  };
  const flush = () => {
    if (cur && cur.id) {
      flushSource();
      entries.push({
        id: cur.id,
        name: cur.name ?? (cur.names?.[0] ?? cur.id),
        names: cur.names ?? [],
        class: cur.class ?? 'excipient',
        severity: defaultSeverityNull ? null : (cur.severity === 'concern' ? 'concern' : 'flag'),
        structural: cur.structural === true,
        rationale: (cur._rat ?? []).join(' ').replace(/\s+/g, ' ').trim(),
        sources: cur.sources ?? [],
      });
    }
  };

  for (let i = start; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();

    // folded rationale continuation: deeper-indented, not a new key/list
    if (inRationale) {
      if (indent >= 6 && !/^-\s/.test(line) && !/^(names|class|severity|structural|rationale|sources|id):/.test(line)) {
        (cur!._rat ??= []).push(line);
        continue;
      }
      inRationale = false;
    }

    if (/^- id:/.test(line)) {
      flush();
      cur = { id: unquote(line.replace(/^- id:/, '')) };
      inSources = false;
      curSource = null;
      continue;
    }
    if (!cur) continue;

    if (inSources) {
      if (/^-\s/.test(line)) {
        flushSource();
        curSource = {};
        const m = line.replace(/^-\s*/, '').match(/^(\w+):\s*(.*)$/);
        if (m) curSource[m[1]] = unquote(m[2]);
        continue;
      }
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m && curSource) {
        curSource[m[1]] = unquote(m[2]);
        continue;
      }
      // fell out of sources
      inSources = false;
    }

    if (/^names:/.test(line)) cur.names = parseFlowList(line.replace(/^names:/, ''));
    else if (/^name:/.test(line)) cur.name = unquote(line.replace(/^name:/, ''));
    else if (/^class:/.test(line)) cur.class = unquote(line.replace(/^class:/, ''));
    else if (/^severity:/.test(line)) cur.severity = unquote(line.replace(/^severity:/, '')) as 'flag' | 'concern';
    else if (/^structural:/.test(line)) cur.structural = /true/.test(line);
    else if (/^rationale:\s*>/.test(line)) {
      cur._rat = [];
      inRationale = true;
    } else if (/^sources:/.test(line)) {
      inSources = true;
    }
  }
  flush();
  return entries;
}

export function parseAdditiveContent(yamlText: string): AdditiveContent {
  if (typeof yamlText !== 'string' || !yamlText) return { flagged: [], notFlagged: [] };
  const lines = yamlText.split(/\r?\n/);
  let fStart = -1,
    nfStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^flagged:\s*$/.test(lines[i])) fStart = i + 1;
    else if (/^not_flagged:\s*$/.test(lines[i])) nfStart = i + 1;
  }
  const flagged = fStart >= 0 ? parseBlock(lines, fStart, nfStart >= 0 ? nfStart - 1 : lines.length, false) : [];
  const notFlagged = nfStart >= 0 ? parseBlock(lines, nfStart, lines.length, true) : [];
  return { flagged, notFlagged };
}
