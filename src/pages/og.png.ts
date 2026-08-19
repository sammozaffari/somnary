// Site-wide default Open Graph image at /og.png. Every page that does not generate its own share
// card (only remedy pages do — /r/{slug}/og.png) falls back to this in Base.astro, so the homepage,
// guide, outcomes, safety and tools pages render a branded 1200×630 card instead of an imageless
// `summary` twitter card. Copy is the real homepage promise (HeroCarousel), not filler. Shared card
// machinery + brand tokens live in ../lib/og.
import type { APIRoute } from 'astro';
import { INK, MUTED, PAPER, PRIMARY, OG_TAGLINE, SOFT, h, toPng, wordmark } from '../lib/og';

export const prerender = true;

function card() {
  return h(
    {
      width: '1200px',
      height: '630px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      padding: '68px 76px',
      fontFamily: 'Onest',
    },
    [
      // top row: wordmark + the standing promises (mirrors the homepage eyebrow)
      h({ justifyContent: 'space-between', alignItems: 'flex-start' }, [
        wordmark('36px'),
        h(
          { fontSize: '22px', fontWeight: 600, color: PRIMARY, letterSpacing: '0.01em' },
          'Single-author · evidence-graded · reader-funded',
        ),
      ]),
      // middle: the homepage headline + value-prop dek
      h({ flexDirection: 'column' }, [
        h(
          { fontFamily: 'Onest', fontWeight: 700, fontSize: '86px', color: INK, lineHeight: 1.02, letterSpacing: '-0.05em', maxWidth: '1000px' },
          'Check a sleep remedy before you take it',
        ),
        h(
          { fontSize: '34px', color: MUTED, lineHeight: 1.4, marginTop: '28px', maxWidth: '980px' },
          'Every sleep supplement, graded on real science — not the hype on the label.',
        ),
      ]),
      // bottom strip: the disavowal tagline
      h({ fontSize: '22px', color: SOFT, letterSpacing: '0.02em' }, OG_TAGLINE),
    ],
  );
}

export const GET: APIRoute = async () => {
  const png = await toPng(card());
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
