// Per-remedy Open Graph image (CHK-2.2). Build-time generated: satori turns a flexbox card into
// SVG, resvg rasterizes to PNG, one static image per remedy at /r/{slug}/og.png. Branded with the
// real design tokens (DESIGN_SYSTEM v3 warm/oxblood: warm paper base, filled grade badge with white
// letter, Instrument Sans display + body). Shared card machinery lives in ../../../lib/og.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { TierId } from '../../../lib/tiers';
import { gradeStampState, type WorkflowState } from '../../../lib/remedy-state';
import { GRADE, INK, MUTED, PAPER, PRIMARY_DEEP, OG_TAGLINE, SOFT, h, toPng, wordmark } from '../../../lib/og';

export const prerender = true;

function card(name: string, tier: TierId, workflowState: WorkflowState, dek: string) {
  const g = GRADE[tier];
  const state = gradeStampState(workflowState);
  return h(
    {
      width: '1200px',
      height: '630px',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: PAPER,
      padding: '68px 76px',
      fontFamily: 'Instrument Sans',
    },
    [
      // top row: wordmark + grade badge (filled, white letter)
      h({ justifyContent: 'space-between', alignItems: 'flex-start' }, [
        wordmark('36px'),
        h({ flexDirection: 'column', alignItems: 'center' }, [
          h(
            {
              width: '150px',
              height: '150px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '20px',
              background: `linear-gradient(145deg, ${g.fill}, ${g.anchor})`,
            },
            h({ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '104px', color: '#ffffff', lineHeight: 1, letterSpacing: '-0.06em' }, tier),
          ),
          h(
            {
              fontSize: state.prominent ? '28px' : '22px',
              fontWeight: state.prominent ? 700 : 600,
              color: state.prominent ? PRIMARY_DEEP : MUTED,
              marginTop: '14px',
            },
            state.label,
          ),
        ]),
      ]),
      // middle: name + verdict
      h({ flexDirection: 'column' }, [
        h({ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '96px', color: INK, lineHeight: 1.0, letterSpacing: '-0.05em' }, name),
        h(
          { fontSize: '34px', color: MUTED, lineHeight: 1.4, marginTop: '26px', maxWidth: '960px' },
          dek,
        ),
      ]),
      // bottom strip: the disavowal tagline
      h({ fontSize: '22px', color: SOFT, letterSpacing: '0.02em' }, OG_TAGLINE),
    ],
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const remedies = await getCollection('remedies', (e) => !e.data.draft);
  return remedies.map((e) => ({
    params: { slug: e.id },
    props: {
      name: e.data.name,
      tier: e.data.tier,
      workflowState: e.data.workflowState,
      dek: e.data.oneLineVerdict,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { name, tier, workflowState, dek } = props as {
    name: string;
    tier: TierId;
    workflowState: WorkflowState;
    dek: string;
  };
  const png = await toPng(card(name, tier, workflowState, dek));
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
