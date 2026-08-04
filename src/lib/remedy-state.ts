export type WorkflowState =
  | 'owner_ratified'
  | 'second_review'
  | 'pending_signoff'
  | 'unreviewed'
  | 'withdrawn';

export type EpistemicState = 'established' | 'provisional' | 'disputed' | 'insufficient';
export type FreshnessState = 'current' | 'review_due' | 'superseded';

export interface RemedyPublicationState {
  workflowState: WorkflowState;
  epistemicState: EpistemicState;
  freshnessState: FreshnessState;
  statusReason?: string;
  reviewDueAt?: string;
  supersededBy?: string;
  validTo?: string;
}

export const WORKFLOW_LABELS: Record<WorkflowState, string> = {
  owner_ratified: 'Review complete',
  second_review: 'Second pass',
  pending_signoff: 'Provisional — final review pending',
  unreviewed: 'First pass only',
  withdrawn: 'Withdrawn',
};

export const EPISTEMIC_LABELS: Record<EpistemicState, string> = {
  established: 'Established evidence',
  provisional: 'Provisional evidence',
  disputed: 'Disputed evidence',
  insufficient: 'Insufficient evidence',
};

export const FRESHNESS_LABELS: Record<FreshnessState, string> = {
  current: 'Current',
  review_due: 'Review due',
  superseded: 'Superseded',
};

export function gradeStampState(state: WorkflowState): {
  label: string;
  prominent: boolean;
} {
  if (state === 'pending_signoff' || state === 'unreviewed') {
    return { label: 'Provisional', prominent: true };
  }
  return { label: WORKFLOW_LABELS[state], prominent: state === 'withdrawn' };
}

export function isDefaultRankingEligible(state: RemedyPublicationState): boolean {
  return state.workflowState === 'owner_ratified' && state.freshnessState === 'current' && !state.validTo;
}

export function isOrdinarySearchEligible(state: RemedyPublicationState): boolean {
  return state.workflowState !== 'withdrawn' && state.freshnessState !== 'superseded' && !state.validTo;
}

export function isArchival(state: RemedyPublicationState): boolean {
  return state.workflowState === 'withdrawn' || state.freshnessState === 'superseded' || Boolean(state.validTo);
}

export function publicationStateProjection(state: RemedyPublicationState) {
  return {
    workflowState: state.workflowState,
    epistemicState: state.epistemicState,
    freshnessState: state.freshnessState,
  };
}
