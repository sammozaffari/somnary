/**
 * Shared reading-map renderer (CHK-6.9e) — the SINGLE, framework-free place the deterministic reading
 * map is turned into DOM. Both GuidePanel (the live guide island) and /account (the read-only saved-map
 * view) call this, so the SAFETY-CRITICAL render path (adversarial-review P3) lives in exactly one file.
 *
 * THE INVARIANT, ENFORCED HERE:
 *   • Every rendered string is set via `textContent` — NEVER innerHTML, never a template string assigned
 *     as markup. No server, model, or user text is ever injected as HTML.
 *   • Each fragment's `text` is the SERVER-composed narrative sentence (fixed enum→phrase templates +
 *     verbatim corpus fields — see src/lib/guide/router.ts). It is never the model's ack/notes or the
 *     user's raw input.
 *   • Each link is an `<a href>` whose href is a server-authored, `/`-rooted corpus URL and whose visible
 *     text is the server-authored label (textContent). The stored route_plan is re-validated through
 *     validateRoutePlan before it ever reaches here (defense-in-depth), so no external href can appear.
 *   • Fragment order is preserved exactly as the server emitted it (safety-first ordering).
 *   • Tone → a fixed class (`is-crisis` / `is-boundary` / normal). The account view and GuidePanel share
 *     the same `.map-fragment` / `.map-items` styles, so the two surfaces look identical.
 *
 * Erasable TS: types + a plain function, no imports of framework code. GuidePanel imports and uses this
 * so its rendering stays byte-identical to the inlined version it replaced.
 */

export interface RenderRouteItem {
  href: string;
  label: string;
  note?: string;
}

export type RenderFragmentTone = 'crisis' | 'boundary' | 'normal';

export interface RenderSummaryFragment {
  text: string;
  links: RenderRouteItem[];
  tone: RenderFragmentTone;
}

/**
 * The renderer reads ONLY `summary` (the woven narrative — the same field GuidePanel renders). The full
 * RoutePlan carries `stop`/`sections` too; this structural type asks only for what the renderer touches,
 * so any validated RoutePlan is assignable without a clashing index signature.
 */
export interface RenderRoutePlan {
  summary: RenderSummaryFragment[];
}

/** tone → the fixed fragment class (mirrors GuidePanel's FRAGMENT_CLASS). `normal` adds no class. */
const FRAGMENT_CLASS: Record<RenderFragmentTone, string> = {
  crisis: 'is-crisis',
  boundary: 'is-boundary',
  normal: '',
};

/**
 * Render the woven narrative reading map into `container`. Clears the container, then appends one
 * `.map-fragment` per summary fragment (in server order): its `.map-fragment-text` sentence, followed by
 * a `.map-items` list of its links. EVERYTHING is set with textContent / element properties — never
 * innerHTML — so no string is ever interpreted as HTML.
 *
 * The plan MUST already be a validated/sanitized RoutePlan (GuidePanel gets it from /api/guide; the
 * account view re-runs the stored plan through validateRoutePlan first). This function assumes internal
 * hrefs but does no navigation itself — it only builds anchors.
 */
export function renderReadingMap(plan: RenderRoutePlan, container: HTMLElement): void {
  container.innerHTML = ''; // clear only — never used to inject content
  const fragments = Array.isArray(plan?.summary) ? plan.summary : [];
  fragments.forEach((frag) => {
    const toneClass = FRAGMENT_CLASS[frag.tone] ?? '';
    const fragEl = document.createElement('div');
    fragEl.className = 'map-fragment' + (toneClass ? ' ' + toneClass : '');

    const p = document.createElement('p');
    p.className = 'map-fragment-text';
    p.textContent = frag.text; // server-composed, deterministic — never model prose or raw user text
    fragEl.appendChild(p);

    if (Array.isArray(frag.links) && frag.links.length) {
      const list = document.createElement('ul');
      list.className = 'map-items';
      frag.links.forEach((item) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'map-item-link';
        a.href = item.href; // server-authored, real corpus URL (internal, /-rooted)
        a.textContent = item.label; // server-authored
        li.appendChild(a);
        list.appendChild(li);
      });
      fragEl.appendChild(list);
    }
    container.appendChild(fragEl);
  });
}
