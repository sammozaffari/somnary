/**
 * Ask corpus (CHK-6.3, Layer B data) — the scoped-assistant's retrieval store.
 *
 * The assistant is PAGE-SCOPED: for a given remedy it may answer ONLY from that remedy's own
 * structured fields and its own real sources[]. This module turns one remedy's frontmatter into
 * a list of retrievable `chunks` (each carrying the source footnotes it is backed by) plus the
 * verbatim sources[]. It is the SAME structured content the tier board, compare tool, and search
 * index read (CLAUDE.md "never duplicate content") — nothing is invented here and NO new citation
 * is minted (the resolver stays 66/20).
 *
 * `buildAskCorpus` is a PURE transform (no astro:content, no fs, no network) so three callers can
 * share it byte-for-byte: the build-time endpoint (src/pages/ask-corpus.json.ts, via getCollection),
 * the server route (src/pages/api/ask.ts, via getCollection), and the CI test runner
 * (scripts/test-ask.mjs, via gray-matter over the MDX). Written in erasable TS (types + interfaces
 * only) so Node's type-stripping can import it directly in the test runner.
 */

/** A citation, exactly as stored in the remedy's sources[] — never reshaped, never invented. */
export interface AskSource {
  n: number;
  title: string;
  sourceLine: string;
  finding: string;
  type: string;
  pmid?: string;
  doi?: string;
  registry?: string;
  url?: string;
}

/** One retrievable slice of a remedy page, tagged with the source footnotes that back it. */
export interface AskChunk {
  id: string;
  kind: string; // verdict | claim | dose | safety | risk | pregnancy | interactions | standardization | mechanism | source
  text: string;
  sources: number[]; // → AskSource.n present on THIS page only
}

export interface AskRemedy {
  slug: string;
  name: string;
  tier: string;
  aliases: string[];
  chunks: AskChunk[];
  sources: AskSource[];
}

/** The subset of remedy frontmatter the assistant retrieves over. */
export interface RawRemedy {
  slug: string;
  name: string;
  tier: string;
  aliases?: string[];
  oneLineVerdict?: string;
  verdict?: string;
  keyCompound?: string | null;
  standardization?: string;
  mechanism?: string;
  claims?: Array<{ claimed: string; studiesShow: string | null; sources?: number[] }>;
  doses?: Array<{ form: string; studiedDose: string; timing: string; marketComparison: string }>;
  safety?: {
    severity?: string;
    lead?: string;
    pregnancy?: string;
    risks?: Array<{ category: string; text: string; sources?: number[] }>;
    interactions?: string[];
    interactionsSources?: number[];
  };
  sources?: AskSource[];
}

function clean(refs: number[] | undefined, known: Set<number>): number[] {
  // Defensive: only keep footnotes that really exist in this page's sources[] (schema already
  // guarantees this, but the assistant's whole safety story is "citations are real", so we
  // re-assert it at the data boundary).
  return (refs ?? []).filter((n) => known.has(n));
}

/** Build one remedy's retrieval object. */
export function buildAskRemedy(r: RawRemedy): AskRemedy {
  const sources = (r.sources ?? []).map((s) => ({ ...s }));
  const known = new Set(sources.map((s) => s.n));
  const chunks: AskChunk[] = [];
  const push = (kind: string, text: string | null | undefined, refs?: number[]) => {
    const t = (text ?? '').trim();
    if (t) chunks.push({ id: `${kind}-${chunks.length}`, kind, text: t, sources: clean(refs, known) });
  };

  // Verdict is editorial synthesis of the page's own cited claims — no single footnote, so it
  // carries no sources[] (the assistant cannot cite the verdict, only the evidence rows).
  push('verdict', [r.oneLineVerdict, r.verdict].filter(Boolean).join(' '));

  (r.claims ?? []).forEach((c) => {
    const shown = c.studiesShow ?? 'studies do not show support for this claim.';
    push('claim', `Claim: ${c.claimed} What the studies show: ${shown}`, c.sources);
  });

  (r.doses ?? []).forEach((d) => {
    push('dose', `${d.form}: studied dose ${d.studiedDose}, ${d.timing}. ${d.marketComparison}`);
  });

  if (r.safety) {
    push('safety', r.safety.lead);
    (r.safety.risks ?? []).forEach((risk) => push('risk', `${risk.category}: ${risk.text}`, risk.sources));
    push('pregnancy', r.safety.pregnancy ? `Pregnancy and breastfeeding: ${r.safety.pregnancy}` : '');
    if ((r.safety.interactions ?? []).length) {
      push('interactions', `Interactions: ${(r.safety.interactions ?? []).join('; ')}.`, r.safety.interactionsSources);
    }
  }

  push('standardization', r.standardization);
  push('mechanism', r.mechanism);

  // Each source finding is retrievable and self-cites — a question can bind directly to the
  // evidence that answers it.
  sources.forEach((s) => push('source', `${s.title}. ${s.finding}`, [s.n]));

  return {
    slug: r.slug,
    name: r.name,
    tier: r.tier,
    aliases: r.aliases ?? [],
    chunks,
    sources,
  };
}

/** Build the whole scoped corpus from raw remedy records. */
export function buildAskCorpus(raws: RawRemedy[]): AskRemedy[] {
  return raws.map(buildAskRemedy).sort((a, b) => a.name.localeCompare(b.name));
}
