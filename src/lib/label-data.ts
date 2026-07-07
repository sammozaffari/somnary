/**
 * Build-time label index (CHK-4.1) — mirrors src/lib/search.ts. Projects the ONE remedy
 * collection down to the fields the label checker needs, deriving the studied-dose floor at build
 * time from the EXISTING `doses[].studiedDose` string fields (no schema change). This module
 * imports astro:content (server-only); the pure rules + dose parser live in ./label-rules so the
 * SAME parser runs at build (here) and in the browser island. The projection ships as a static
 * /label-index.json the client fetches — no content is duplicated into a second store.
 */
import { getCollection } from 'astro:content';
import { contentIndex } from './content-index';
import { parseDoseFloorMg, type LabelEntry } from './label-rules';

export type { LabelEntry } from './label-rules';

const indexBySlug = new Map(contentIndex.map((e) => [e.slug, e]));

/** The single source of label entries — built from the live (non-draft) remedy collection. */
export async function getLabelEntries(): Promise<LabelEntry[]> {
  const remedies = await getCollection('remedies', (e) => !e.data.draft);
  return remedies
    .map((e) => {
      const d = e.data;
      const category = indexBySlug.get(e.id)?.category ?? '';
      // Lowest studied-dose floor across every dose form, plus the verbatim form-string that
      // produced it (used in the R3 message). Unparseable forms are skipped, so the floor stays
      // null when NO form yields a clean mg/g amount — the rule then never fires.
      let floorMg: number | null = null;
      let floorText: string | null = null;
      for (const dose of d.doses) {
        const f = parseDoseFloorMg(dose.studiedDose);
        if (f !== null && (floorMg === null || f < floorMg)) {
          floorMg = f;
          floorText = dose.studiedDose;
        }
      }
      return {
        slug: e.id,
        url: `/r/${e.id}`,
        name: d.name,
        aliases: d.aliases,
        keyCompound: d.keyCompound,
        category,
        isBotanical: /botanical/i.test(category),
        studiedDoseText: floorText,
        studiedDoseFloorMg: floorMg,
        interactions: d.safety.interactions,
        tier: d.tier,
      } satisfies LabelEntry;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
