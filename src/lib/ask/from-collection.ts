/**
 * Astro-side corpus loader (CHK-6.3) — maps the `remedies` content collection into the pure
 * RawRemedy shape buildAskCorpus() consumes. This is the ONLY place the assistant touches
 * astro:content; the engine and guardrails stay framework-free (and Node-testable). The CI test
 * runner reaches the SAME buildAskCorpus() via gray-matter, so both paths share one transform and
 * neither invents content (the single-structure rule).
 */
import { getCollection } from 'astro:content';
import { buildAskCorpus, type AskRemedy, type RawRemedy } from './corpus.ts';

export async function getAskCorpus(): Promise<AskRemedy[]> {
  const entries = await getCollection('remedies', (e) => !e.data.draft);
  const raws: RawRemedy[] = entries.map((e) => {
    const d = e.data;
    return {
      slug: e.id,
      name: d.name,
      tier: d.tier,
      aliases: d.aliases,
      oneLineVerdict: d.oneLineVerdict,
      verdict: d.verdict,
      keyCompound: d.keyCompound,
      standardization: d.standardization,
      mechanism: d.mechanism,
      claims: d.claims,
      doses: d.doses,
      safety: d.safety,
      sources: d.sources,
    };
  });
  return buildAskCorpus(raws);
}
