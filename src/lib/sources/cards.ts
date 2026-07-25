/**
 * Shared card mappers — one per remedy. Extracted from the /sources pages so the per-product
 * detail routes (/sources/<remedy>/<slug>/) reuse EXACTLY the same mapping as the grid cards.
 */
import type { ScorecardCardData, Chip, DetailLine } from '../../data/source-scorecards/card';
import type { MagProduct } from '../../data/source-scorecards/magnesium';
import type { AshProduct } from '../../data/source-scorecards/ashwagandha';
import type { GlyProduct } from '../../data/source-scorecards/glycine';
import type { ValProduct } from '../../data/source-scorecards/valerian';
import type { SourceProduct } from '../../data/source-scorecards/melatonin';

export function toMagCard(p: MagProduct): ScorecardCardData {
  const chips: Chip[] = [];
  if (p.b6) chips.push({ label: '⚠ Contains B6', kind: 'warn', note: p.b6.note });
  if (p.certVerified) chips.push({ label: '✓ Third-party tested', kind: 'good', note: p.certSummary });

  const detailLines: DetailLine[] = [];
  if (p.b6) detailLines.push({ tag: 'Safety', note: p.b6.note, kind: 'safety' });

  return {
    slug: p.slug,
    brand: p.brand,
    productName: p.productName,
    specLines: [`${p.elementalMg} mg elemental`, p.form],
    metaLine: `${p.ausL ? `AUST L ${p.ausL}` : (p.channel.includes('import') ? 'Not TGA-listed (import)' : 'AUST L — unconfirmed')} · ${p.channel}`,
    certSummary: p.certSummary,
    certVerified: p.certVerified,
    imagePath: p.imagePath,
    bottomLine: p.bottomLine,
    chips,
    scores: p.scores,
    verdict: p.verdict,
    detailLines,
    heldItems: p.heldItems,
    hasB6: !!p.b6,
  };
}

export function toAshCard(p: AshProduct): ScorecardCardData {
  const chips: Chip[] = [];
  if (p.trialFlag) chips.push({ label: '🔬 Used in trials', kind: 'good', note: p.trialFlag.note });
  if (p.rootPart === 'root+leaf')
    chips.push({ label: '🍃 Root + leaf', kind: 'good', note: 'Made from root and leaf — the plant part under extra liver scrutiny.' });
  if (p.b6) chips.push({ label: '⚠ Contains B6', kind: 'warn', note: p.b6.note });
  if (p.importSafety) chips.push({ label: '⚠ Import — no AU warning', kind: 'warn', note: p.importSafety.note });

  const detailLines: DetailLine[] = [];
  if (p.b6) detailLines.push({ tag: 'Safety', note: p.b6.note, kind: 'safety' });
  if (p.importSafety) detailLines.push({ tag: 'Safety', note: p.importSafety.note, kind: 'safety' });
  if (p.trialFlag) detailLines.push({ tag: 'Used in trials', note: p.trialFlag.note, kind: 'trial' });

  return {
    slug: p.slug,
    brand: p.brand,
    productName: p.productName,
    specLines: [p.strength, p.form],
    metaLine: `${p.regulated === 'medicine' && p.ausL ? `AUST L ${p.ausL}` : 'Food · not TGA-listed (import)'} · ${p.channel}`,
    certSummary: p.certSummary,
    certVerified: p.certVerified,
    imagePath: p.imagePath,
    bottomLine: p.bottomLine,
    chips,
    scores: p.scores,
    verdict: p.verdict,
    detailLines,
    heldItems: p.heldItems,
    hasB6: !!p.b6,
  };
}

export function toGlyCard(p: GlyProduct): ScorecardCardData {
  const chips: Chip[] = [
    p.doseReach.reaches
      ? { label: '✓ Reaches the studied 3 g', kind: 'good', note: p.doseReach.note }
      : { label: '⚠ Below the studied 3 g', kind: 'warn', note: p.doseReach.note },
  ];

  const detailLines: DetailLine[] = [
    { tag: 'Dose', note: p.doseReach.note, kind: p.doseReach.reaches ? 'trial' : 'safety' },
  ];

  return {
    slug: p.slug,
    brand: p.brand,
    productName: p.productName,
    specLines: [p.dose, p.form],
    metaLine: `${p.regulated === 'medicine' && p.ausL ? `AUST L ${p.ausL}` : 'Food · not TGA-listed'} · ${p.channel}`,
    certSummary: p.certSummary,
    certVerified: p.certVerified,
    imagePath: p.imagePath,
    bottomLine: p.bottomLine,
    chips,
    scores: p.scores,
    verdict: p.verdict,
    detailLines,
    heldItems: p.heldItems,
    hasB6: false,
  };
}

export function toValCard(p: ValProduct): ScorecardCardData {
  const chips: Chip[] = [];
  if (p.trialFlag) chips.push({ label: '🔬 Used in trials', kind: 'good', note: p.trialFlag.note });
  if (p.importSafety) chips.push({ label: '⚠ Import — no AU warning', kind: 'warn', note: p.importSafety.note });

  const detailLines: DetailLine[] = [];
  if (p.importSafety) detailLines.push({ tag: 'Safety', note: p.importSafety.note, kind: 'safety' });
  if (p.trialFlag) detailLines.push({ tag: 'Used in trials', note: p.trialFlag.note, kind: 'trial' });

  return {
    slug: p.slug,
    brand: p.brand,
    productName: p.productName,
    specLines: [p.strength, p.form],
    metaLine: `${p.ausL ? `AUST L ${p.ausL}` : 'Not TGA-listed (import)'} · ${p.channel}`,
    certSummary: p.certSummary,
    certVerified: p.certVerified,
    imagePath: p.imagePath,
    bottomLine: p.bottomLine,
    chips,
    scores: p.scores,
    verdict: p.verdict,
    detailLines,
    heldItems: p.heldItems,
    hasB6: false,
  };
}

export function toMelCard(p: SourceProduct): ScorecardCardData {
  const chips: Chip[] = [];
  if (p.certVerified)
    chips.push({ label: '✓ Third-party verified', kind: 'good', note: p.certSummary });

  const detailLines: DetailLine[] = [];

  return {
    slug: p.slug,
    brand: p.brand,
    productName: p.productName,
    specLines: [`${p.doseMg} mg`, p.form],
    metaLine: `${p.market} · ${p.singleOrCombo}`,
    certSummary: p.certSummary,
    certVerified: p.certVerified,
    imagePath: p.imagePath,
    bottomLine: p.bottomLine,
    chips,
    scores: p.scores,
    verdict: p.verdict,
    detailLines,
    heldItems: p.heldItems,
    hasB6: false,
  };
}
