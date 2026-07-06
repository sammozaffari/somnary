# Somnary HTML Prototype Design Review

## Inputs Checked

- Current live screenshots: home, tier board, melatonin remedy page, sleep-quality outcome page, and doctor-boundary page.
- Strategy docs: master strategy, IA/content roadmap, audience needstates, and decision frameworks.
- User-provided reference board: used as structural direction, not copied as a palette.
- ImageGen reference: `../design-reference/reimagined-key-pages.png`.

## Current UI Findings

1. Homepage has strong editorial voice but weak product action. The user sees credibility before they see what to do.
2. Tier board is useful but reads as a long ranking page rather than a decision map.
3. Remedy detail page has excellent evidence depth, but the decision summary is too easy to miss.
4. Outcome pages rank remedies but need clearer “how to decide” framing.
5. Doctor-boundary page is strategically important but should feel like a safety router, not a context article.

## Prototype Decisions

- Homepage uses a large remedy-check search bar as the hero action.
- Homepage hero now uses a bold primary-color background, because the user specifically wanted the main first-screen surface to carry the brand color rather than sit on a pale neutral background.
- Needstate route cards map to the recommended audience journeys: melatonin, sleep blend, fall asleep faster, wake at night, medications, child safety.
- Tier board has a grade legend, comparison table, and “not sure where to start” side path.
- Remedy page leads with grade, best-for, not-for, biggest risk, studied dose, then claim-vs-data.
- Outcome page translates grades into decision meaning.
- Safety page is a grid of medical-boundary routes.
- Label checker is a real tool surface with paste/upload area and red-flag results.

## Palette Revision

The revised palette uses a bold evidence-teal primary system:

- Primary: deep teal for the hero, CTAs, filled B/A grade blocks, and evidence UI.
- Action: bright citron only for the primary hero CTA and high-salience verification moments.
- Safety: vermilion only for warnings and urgent safety states.
- Background: cool off-white and pale green-gray, avoiding beige wellness, generic clinical blue, and dark mode.

Rationale:

- The audience is evidence-seeking and safety-conscious, so the primary color must feel calm and health-adjacent, but strong enough to support an evidence product.
- The palette stays intentionally small: primary teal, action citron, safety red, and neutral surfaces. This supports visual hierarchy and avoids the “many colors competing” problem.
- Filled grade components use large letters, labels, and contrast, not color alone, so the grade remains understandable for people with color-vision differences.
- The typography was updated to use Archivo for large, heavy headings and grade numerals, preserving IBM Plex Sans for calm body reading.

## IA Pass Applied Across Key Pages

This revision applies the accepted bold-primary approach across the full IA set, not only the homepage:

- `index.html`: Start Here / remedy checker. Primary hero search, situation routes, trust stack, grading model, updates.
- `tiers.html`: Remedies overview. Primary hero with evidence metrics, S-F legend, remedy comparison table, evidence trust panel.
- `remedy-melatonin.html`: Remedy detail. Primary hero decision summary, filled `A` grade component, best-for/not-for/risk/dose modules, claim-vs-data table.
- `outcome-fall-asleep.html`: Goal page. Primary hero for the user goal, top ranked options, decision translation for grades.
- `safety.html`: Safety router. Primary hero with urgent boundary metrics, grid routes for apnea/chronic insomnia/medications/children/urgent states.
- `label-checker.html`: Label checker tool. Primary hero for the tool, paste/upload surface, red-flag results, and label-integrity checks.

Although the user referred to five key pages, the Label Checker is included because the strategy docs make it a primary IA route and product differentiator.

## Alignment With Strategy Docs

- Decision-first IA: implemented in nav and homepage route cards.
- Fast time-to-understanding: hero headline + search/check bar + trust stack.
- Safety before optimization: safety nav, safety page, warning chips, medication/child routes.
- Label reality: label checker page and homepage route.
- Better than generic AI: source-checked, no-affiliate, no-brand-money, evidence-first trust stack.
- Avoid supplement marketing: no product cards, no bottles, no affiliate CTA, no wellness imagery.

## Remaining Product Notes

- In production, the search/check bar should connect to the remedy index.
- Label checker should begin as a static rules-based MVP before AI parsing.
- AI assistant should be scoped to reviewed Somnary corpus only.
- Remedy pages should preserve full citations below the prototype sections.
