// Plain-word labels for the product form fields. Extracted at CHK-B6 from
// src/pages/products/[id].astro (CHK-B3), which now imports them — one map, two consumers,
// and CHK-B7 makes it three. A second copy is how a controlled vocabulary drifts.
//
// RULES.md Products: "Form is a controlled vocabulary (tablet ≠ capsule)" and "Delivery form ≠
// release profile — two fields". These maps only RE-WORD the enum; they never merge two values
// and never invent one. A product whose label could not be mapped has `deliveryForm: null`
// (`formStatus: 'needs-review'`) — see UNRECORDED_FORM below, never a guessed form.
//
// Sentence case (RULES.md Identity) — these are UI labels, so first word capitalised only.

export const FORM_LABEL = {
  tablet: 'Tablet',
  capsule: 'Capsule',
  softgel: 'Softgel',
  gummy: 'Gummy',
  'melt-lozenge': 'Melt or lozenge',
  'liquid-drops': 'Liquid or drops',
  spray: 'Spray',
  tea: 'Tea',
  powder: 'Powder',
  patch: 'Patch',
} as const;

export const RELEASE_LABEL = {
  immediate: 'Immediate release',
  'slow-release': 'Slow release',
  'not-stated': 'Release not stated',
} as const;

/** What a `deliveryForm: null` product says. It is a statement about OUR record, not about the
 *  product — the label wording exists (`rawFormLabel`), we just haven't mapped it into the
 *  vocabulary yet. Never "unknown form", never a guess. */
export const UNRECORDED_FORM = 'Form not recorded yet';

export function formLabel(form: string | null | undefined): string {
  return form ? (FORM_LABEL[form as keyof typeof FORM_LABEL] ?? UNRECORDED_FORM) : UNRECORDED_FORM;
}
