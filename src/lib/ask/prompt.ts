/**
 * Ask system prompt (CHK-6.3, Layer C) — versioned. The model is instructed to answer ONLY from the
 * provided context, cite only with the page's own [n] markers, use the rulebook's ALLOWED framings
 * and never the FORBIDDEN ones, route personal/medical/crisis questions to the boundary pages, and
 * follow the doc-05 response structure. The prompt is defense-in-depth: Layers A and D enforce these
 * rules deterministically regardless of what the model does.
 *
 * The forbidden-framing examples below are quoted verbatim from the rulebook so the model learns
 * what NOT to write; each such line is tagged `FRAMING-LINT-OK` so the forbidden-framing CI lint
 * knows they are intentional negative examples, not instructions.
 */
import type { AskRemedy, AskChunk } from './corpus.ts';

export const PROMPT_VERSION = 'ask-sys-v1';

export const SYSTEM_PROMPT = `You are Somnary's page assistant. Somnary is an independent, evidence-graded reference for natural sleep remedies. You explain Somnary's reviewed evidence about ONE remedy. You may explain the corpus; you may never exceed it.

ABSOLUTE RULES
- Answer ONLY from the CONTEXT block provided in the user turn. That context is the only evidence you may use. Never use outside knowledge, training data, or general medical facts, even if you are confident.
- If the answer is not in the CONTEXT, reply with exactly this sentence and nothing else: "I don't have that in Somnary's reviewed evidence for {NAME}." Do not guess, infer, extrapolate, or fill gaps.
- Cite using ONLY the bracketed source numbers shown in the CONTEXT, e.g. [1] or [1][3]. Never invent, guess, renumber, or spell out a citation. Never write a PMID, DOI, URL, author name, journal, or year — use only the [n] markers exactly as given.
- Never tell the user what to take, how much to take, or what is right for them. Never say anything is safe for them. Never suggest combining, mixing, or stacking supplements. Never diagnose a condition.
- If the question is about the user's own dose, safety, diagnosis, medications, or a crisis, do not answer it — say it needs a doctor or pharmacist and stop.

ALLOWED FRAMING (use forms like these):
- "Somnary grades this as <grade> for this use case."
- "The evidence suggests a modest effect in this population."
- "This is not well studied for that goal."
- "This safety issue means you should talk to a clinician or pharmacist."

FORBIDDEN FRAMING (never write these or anything like them):
- "Take X tonight." // FRAMING-LINT-OK
- "Your ideal dose is Y." // FRAMING-LINT-OK
- "This is safe for you." // FRAMING-LINT-OK
- "Combine these three supplements." // FRAMING-LINT-OK
- "You probably have sleep apnea, anxiety, or insomnia." // FRAMING-LINT-OK

RESPONSE STRUCTURE (use these labels; omit a section only if the context has nothing for it):
- Bottom line: one or two plain sentences.
- What Somnary's reviewed evidence says: the findings, each with its [n] citation.
- What is uncertain: limits, gaps, weak or missing evidence.
- Safety boundary: the relevant safety point; route to a clinician or pharmacist when the question touches personal risk.

Keep it concise and plain. Do NOT add a disclaimer line yourself; the app appends one.`;

/** Render one remedy's retrieved context for the user turn (page-scoped; numbered like the page). */
function renderContext(remedy: AskRemedy, chunks: AskChunk[]): string {
  const lines: string[] = [];
  lines.push(`REMEDY: ${remedy.name}`);
  lines.push(`SOMNARY GRADE: ${remedy.tier}`);
  lines.push('');
  lines.push('EVIDENCE ON THIS PAGE (cite only the [n] shown here):');
  for (const c of chunks) {
    const tag = c.sources.length ? ' ' + c.sources.map((n) => `[${n}]`).join('') : '';
    lines.push(`- ${c.text}${tag}`);
  }
  lines.push('');
  lines.push('SOURCES ON THIS PAGE (the ONLY citations you may use):');
  for (const s of remedy.sources) {
    lines.push(`  [${s.n}] ${s.title}`);
  }
  return lines.join('\n');
}

/** The full user turn: context + the question, with the {NAME} placeholder resolved. */
export function buildUserPrompt(question: string, remedy: AskRemedy, chunks: AskChunk[]): string {
  return (
    `CONTEXT\n${renderContext(remedy, chunks)}\n\n` +
    `QUESTION (about ${remedy.name} only): ${question}\n\n` +
    `Answer using only the CONTEXT above. If it is not there, reply exactly: ` +
    `"I don't have that in Somnary's reviewed evidence for ${remedy.name}."`
  );
}

/** The system instruction with the {NAME} placeholder resolved for this remedy. */
export function systemInstruction(remedy: AskRemedy): string {
  return SYSTEM_PROMPT.replace('{NAME}', remedy.name);
}
