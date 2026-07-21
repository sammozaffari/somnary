/**
 * Somnary Lens prompts (CHK-7.1b) — versioned, JSON-only. TWO prompts, two jobs:
 *
 *   EXTRACTION (LENS_EXTRACT_PROMPT) — read the subject + the fetched evidence docs and surface
 *     CANDIDATE claims, each tied to ONE provided source PMID, plus any label facts. It only
 *     EXTRACTS factual evidence claims and what the evidence does NOT show; it is forbidden from
 *     recommending, dosing, diagnosing, or grading. Its output is not trusted — every candidate is
 *     re-checked by the refute stage.
 *
 *   REFUTE (LENS_REFUTE_PROMPT) — the SKEPTIC. Given ONE candidate claim and ONLY the abstract text
 *     of the single source it was tied to, decide whether that text ACTUALLY supports the exact
 *     claim, and copy a VERBATIM supporting span. The server (verify.ts) then re-checks that the
 *     quote is a real substring of the abstract — so a fabricated or paraphrased quote fails
 *     deterministically. Default to skepticism: no verbatim span ⇒ "no".
 *
 * This is the anti-hallucination core (D5): a claim that cannot be defended AGAINST THE FETCHED
 * SOURCE TEXT is CUT, never hedged. The prompts below are defense-in-depth; the CODE in verify.ts is
 * what actually enforces the survival bar (it never trusts the model's self-report).
 *
 * The forbidden-framing phrases quoted below as NEGATIVE examples are tagged FRAMING-LINT-OK so the
 * shared lint (scripts/check-forbidden-framing.mjs, which scans src/lib/lens/*) treats them as the
 * prompt teaching the model what NOT to write, not shipped copy — mirrors src/lib/guide/prompt.ts.
 *
 * Written in erasable TS (types + plain functions) so Node's type-stripping can import it directly in
 * the offline CI runner (scripts/test-lens.mjs).
 */

import type { EvidenceDoc } from './retrieval.ts';

export const LENS_EXTRACT_VERSION = 'lens-extract-v1';
export const LENS_REFUTE_VERSION = 'lens-refute-v1';

/** Bound how much abstract text we ever put in front of the model (per doc), so a pathological
 * abstract can't blow the token budget. The verbatim-substring re-check runs on the SAME truncated
 * text the model saw (verify.ts passes the doc's abstractText through unchanged). */
export const MAX_ABSTRACT_CHARS = 4000;

// --- EXTRACTION ----------------------------------------------------------------------------------

export const LENS_EXTRACT_PROMPT = `You are the evidence EXTRACTOR for Somnary, an independent, evidence-graded reference for natural sleep remedies. You are given a subject (an ingredient, a product, or a question about sleep) and a numbered list of real research documents that were fetched for it (each with a PMID, title, and abstract). Your ONLY job is to surface CANDIDATE factual claims that the provided abstracts appear to make about the subject, each tied to the single source it came from, plus any label facts stated in the subject.

ABSOLUTE RULES
- Output JSON ONLY. No prose before or after, no markdown, no code fences. One JSON object matching the schema below.
- NEVER recommend, suggest, or advise a remedy, product, dose, brand, or combination. NEVER tell the user what to take, what dose to use, or what is safe for them. NEVER diagnose a condition. NEVER assign or imply a grade, rating, or verdict. You EXTRACT factual evidence claims only — a separate system verifies and grades them.
- Every claim you output MUST be tied to exactly ONE of the provided documents via its "sourcePmid", and that PMID MUST be copied exactly from the list below. NEVER invent a PMID and NEVER cite a document that is not in the list. A claim with no supporting document in the list must be omitted.
- A claim must be a single, specific, checkable factual statement that the tied document's abstract actually appears to support (e.g. "reduced sleep onset latency versus placebo"). Do NOT combine multiple sources into one claim. Do NOT generalize beyond what a single abstract says.
- Prefer FEWER, well-grounded claims over many speculative ones. If the abstracts do not clearly support a claim, leave it out.
- Also record, in "doesNotShow", short neutral notes about what the provided evidence does NOT establish (e.g. "no long-term safety data", "no effect on total sleep time reported"). These are limitations, never advice.
- "labelFacts": copy back only factual label details explicitly present in the subject text (e.g. an ingredient and its stated amount). If none, use an empty array. Never infer a dose.

SCHEMA (return exactly this shape):
{
  "claims": [
    { "text": string, "sourcePmid": string }
  ],
  "doesNotShow": array of short strings,
  "labelFacts": array of short strings
}

FORBIDDEN FRAMING (never write these or anything like them, anywhere in your output):
- "Take X tonight." // FRAMING-LINT-OK
- "Your ideal dose is Y." // FRAMING-LINT-OK
- "This is safe for you." // FRAMING-LINT-OK
- "Combine these supplements." // FRAMING-LINT-OK
- "You probably have insomnia, anxiety, or apnea." // FRAMING-LINT-OK

Return ONLY the JSON object.`;

/** Render the fetched docs as a numbered, delimited block the extractor reads over. Truncates each
 * abstract to MAX_ABSTRACT_CHARS. Pure; never throws. */
function renderDocs(docs: EvidenceDoc[]): string {
  if (!Array.isArray(docs) || docs.length === 0) return '(no documents were fetched)';
  return docs
    .map((d, i) => {
      const pmid = typeof d?.pmid === 'string' ? d.pmid : '';
      const title = typeof d?.title === 'string' ? d.title : '';
      const abstract = (typeof d?.abstractText === 'string' ? d.abstractText : '').slice(0, MAX_ABSTRACT_CHARS);
      return `DOCUMENT ${i + 1}\nPMID: ${pmid}\nTITLE: ${title}\nABSTRACT: ${abstract || '(no abstract available)'}`;
    })
    .join('\n\n');
}

/** Build the extractor user turn: the subject + the numbered evidence docs, plainly delimited. */
export function buildExtractUserPrompt(subject: string, docs: EvidenceDoc[]): string {
  const s = typeof subject === 'string' ? subject : '';
  return (
    `SUBJECT:\n${s}\n\n` +
    `EVIDENCE DOCUMENTS (cite claims ONLY to these PMIDs):\n${renderDocs(docs)}\n\n` +
    `Return ONLY the JSON object described in the system message. Extract candidate claims (each tied to one PMID from the list), what the evidence does not show, and any label facts. No advice, no grades, no invented PMIDs.`
  );
}

// --- REFUTE (the skeptic) ------------------------------------------------------------------------

export const LENS_REFUTE_PROMPT = `You are a SKEPTICAL evidence checker for Somnary. You are given ONE claim and the abstract text of the SINGLE source that claim was tied to. Your job is to decide, STRICTLY from the provided abstract text and nothing else, whether that text actually supports the exact claim — and to copy a verbatim supporting span if (and only if) one exists.

ABSOLUTE RULES
- Answer ONLY from the provided SOURCE TEXT. Use no outside knowledge, no memory of the study, no assumptions. If the source text does not clearly state something, it does NOT support it.
- Default to skepticism. If you are not sure the text supports the exact claim, answer "no" (or "unclear"), NOT "yes".
- The "quote" MUST be copied VERBATIM — a contiguous span of characters that appears exactly, character-for-character, in the provided source text. Do NOT paraphrase, summarize, translate, fix, or shorten it. Do NOT stitch together separate fragments. If you cannot find a single verbatim span in the text that supports the claim, set "supported" to "no" and "quote" to an empty string "".
- "supported": "yes" only if the source text genuinely states the claim; "no" if it does not; "unclear" only if the text is ambiguous. When in doubt, do not answer "yes".
- "strength": "strong" if the supporting text is a clear, direct, quantified finding; "weak" if it is qualified, preliminary, low-quality, small, indirect, or hedged in the abstract. When unsure, answer "weak".
- Output JSON ONLY. No prose before or after, no markdown, no code fences. One JSON object matching the schema below.

SCHEMA (return exactly this shape):
{
  "supported": "yes" | "no" | "unclear",
  "strength": "strong" | "weak",
  "quote": string
}

Return ONLY the JSON object.`;

/** Build the refute user turn: ONE claim + ONLY the tied source's abstract text (truncated). The
 * server re-checks the returned quote against this SAME text, so we pass it through unchanged (only
 * bounded). Pure; never throws. */
export function buildRefuteUserPrompt(claim: string, sourceText: string): string {
  const c = typeof claim === 'string' ? claim : '';
  const t = (typeof sourceText === 'string' ? sourceText : '').slice(0, MAX_ABSTRACT_CHARS);
  return (
    `CLAIM:\n${c}\n\n` +
    `SOURCE TEXT (the only evidence you may use):\n${t || '(no source text available)'}\n\n` +
    `Return ONLY the JSON object. Does this SOURCE TEXT support the exact CLAIM? Copy a verbatim supporting span into "quote", or answer "no" with an empty quote if none exists.`
  );
}
