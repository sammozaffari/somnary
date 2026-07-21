/**
 * Shared citation identifier format-check + canonical-URL construction (CHK-7.1a).
 *
 * THE SINGLE SOURCE OF TRUTH for "what is a real, resolvable citation id" across the whole repo.
 * The CI citation resolver (scripts/check-citations.mjs) imports its RE regexes and canonicalUrl
 * map FROM HERE, and so does the Lens engine's retrieval layer (src/lib/lens/retrieval.ts). Both
 * the offline build gate and the model-facing evidence pipeline therefore agree, byte-for-byte, on
 * which identifiers are well-formed — a fabricated or malformed PMID/DOI/registry id is rejected the
 * same way in both places, so the engine can never accept a cite the resolver would reject.
 *
 * The identifier formats MUST stay in lockstep with src/content.config.ts (the schema-level rule).
 *
 * Written in erasable TS (types + plain functions, no runtime-only TS constructs) so Node's
 * type-stripping can import it directly in .mjs CI scripts — the same pattern as ask/corpus.ts.
 * This module is PURE: no I/O, no network, no clock. It NEVER throws.
 */

export type CitationKind = 'pmid' | 'doi' | 'registry';

/** An identifier as stored on a source: exactly one of these should carry a value. */
export interface CitationId {
  pmid?: string | number | null;
  doi?: string | number | null;
  registry?: string | number | null;
}

/**
 * Identifier format regexes — MUST match scripts/check-citations.mjs (which imports these) and
 * src/content.config.ts. A PMID is a bare integer; a DOI is the `10.<registrant>/<suffix>` form; a
 * registry id is a ClinicalTrials.gov NCT number. Anything else is a fabrication/typo and rejected.
 */
export const RE: Record<CitationKind, RegExp> = {
  pmid: /^\d+$/,
  doi: /^10\.\d{4,9}\/\S+$/,
  registry: /^NCT\d{8}$/,
};

/** Canonical, resolvable URL for a validated identifier of each kind. */
export const canonicalUrlByKind: Record<CitationKind, (v: string) => string> = {
  pmid: (v) => `https://pubmed.ncbi.nlm.nih.gov/${v}/`,
  doi: (v) => `https://doi.org/${v}`,
  registry: (v) => `https://clinicaltrials.gov/study/${v}`,
};

const KINDS: CitationKind[] = ['pmid', 'doi', 'registry'];

/** True iff `value` is a well-formed identifier of `kind`. Coerces to a trimmed string first. */
export function isValidId(kind: CitationKind, value: unknown): boolean {
  if (value == null) return false;
  return RE[kind].test(String(value).trim());
}

/**
 * Does this source object carry AT LEAST ONE well-formed, resolvable identifier? Mirrors the
 * resolver's `hasValidId` check: a malformed value for one kind does not count, and an object with
 * no valid id of any kind returns false (so the engine drops it, exactly as the build gate fails it).
 */
export function isResolvableId(id: CitationId): boolean {
  return KINDS.some((kind) => isValidId(kind, id[kind]));
}

export interface ParsedCitation {
  kind: CitationKind;
  value: string;
  url: string;
}

/**
 * Parse the first well-formed identifier on a source into { kind, value, url }, or null if NONE of
 * pmid/doi/registry is well-formed. This is how the engine turns a raw id into a canonical URL while
 * REJECTING a fabricated/malformed id (null ⇒ drop it). PMID is preferred (checked first) because
 * PubMed is the Lens engine's primary evidence provider.
 */
export function parseCitation(id: CitationId): ParsedCitation | null {
  for (const kind of KINDS) {
    const raw = id[kind];
    if (raw == null) continue;
    const value = String(raw).trim();
    if (RE[kind].test(value)) return { kind, value, url: canonicalUrlByKind[kind](value) };
  }
  return null;
}

/** Convenience: the canonical URL for a source, or null if it carries no valid identifier. */
export function canonicalUrl(id: CitationId): string | null {
  return parseCitation(id)?.url ?? null;
}
