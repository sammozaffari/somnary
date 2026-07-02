/**
 * Structured data for remedy pages — CHK-2.2 (PLAN §4 block 12; schema.org MedicalWebPage + FAQ).
 * Emitted as JSON-LD in the remedy route <head> so search engines get the graded, cited content as
 * machine-readable data. The FAQ is built from the real claims-vs-data (each "what's claimed → what
 * studies show" row becomes a Q&A), and every source is attached as a citation — reinforcing that
 * the page is cited, not asserted. OG/Twitter meta tags live in Base.astro; the generated per-remedy
 * OG *image* is a separate follow-up.
 */
import type { CollectionEntry } from 'astro:content';
import { sourceUrl } from './cite';

type RemedyData = CollectionEntry<'remedies'>['data'];

export function remedyJsonLd(data: RemedyData, url: string, site: string): object {
  const mainEntity: object[] = [
    {
      '@type': 'Question',
      name: data.seo.questionTitle,
      acceptedAnswer: { '@type': 'Answer', text: data.verdict },
    },
  ];
  for (const c of data.claims) {
    if (!c.studiesShow) continue;
    const claim = c.claimed.replace(/[.\s]+$/, '');
    mainEntity.push({
      '@type': 'Question',
      name: `Is it true that ${claim}?`,
      acceptedAnswer: { '@type': 'Answer', text: c.studiesShow },
    });
  }

  const citation = data.sources.map((s) => ({
    '@type': 'MedicalScholarlyArticle',
    name: s.title,
    sameAs: sourceUrl(s),
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        name: data.seo.questionTitle,
        url,
        description: data.oneLineVerdict,
        about: { '@type': 'DietarySupplement', name: data.name },
        isPartOf: { '@type': 'WebSite', name: 'somnary', url: site },
        ...(citation.length ? { citation } : {}),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity,
      },
    ],
  };
}
