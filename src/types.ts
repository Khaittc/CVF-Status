export type SpecStatus =
  | 'FROZEN_FOR_V1'
  | 'CONFIRMED'
  | 'BASELINE_CONFIRMED'
  | 'FROZEN_CORE'
  | 'PARTIAL'
  | 'NEEDS_DECISION'
  | 'NEEDS_EVIDENCE'
  | 'DEFERRED_TO_PROTOTYPE_REVIEW'
  | 'BLOCKED'
  | 'NOT_STARTED';

export type UIStatus =
  | 'FROZEN_FOR_PROTOTYPE_V0'
  | 'FROZEN_FOR_CUSTOMER_DEMO'
  | 'READY_TO_PROTOTYPE'
  | 'READY_TO_FREEZE'
  | 'IN_PROGRESS'
  | 'READY_FOR_REVIEW'
  | 'UI_REVIEW_PASS'
  | 'SPEC_REOPEN_REQUIRED'
  | 'PLACEHOLDER'
  | 'UI_PENDING'
  | 'DEFERRED_TO_PROTOTYPE_REVIEW'
  | 'NOT_STARTED';

export type ProductionAuthority =
  | 'NOT_AUTHORIZED'
  | 'WORK_ORDER_REQUIRED'
  | 'PARTIAL_REUSE_CANDIDATE'
  | 'APPROVED_FOR_BUILD'
  | 'IN_BUILD'
  | 'IN_REVIEW'
  | 'FROZEN';

export type RoadmapPhaseStatus =
  | 'NOT_STARTED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'PASS'
  | 'BLOCKED'
  | 'DEFERRED';

export interface SpecDomain {
  id: string;
  domain: string;
  status: SpecStatus;
  summary: string;
  nextAction: string;
}

export interface UIModule {
  id: string;
  module: string;
  status: UIStatus;
  relatedSpec: string;
  customerDemo: string;
  nextAction: string;
}

export interface Decision {
  id: string;
  domain: string;
  question?: string;
  decision?: string;
  status: string;
  impact?: string;
  date?: string;
  relatedUI?: string;
  reviewTrigger?: string;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  status: RoadmapPhaseStatus;
  purpose?: string;
  entryCriteria?: string[];
  exitCriteria?: string[];
  mainOutputs?: string[];
  currentBlockers?: string[];
  nextAllowedMove?: string;
}

export interface ProjectMetadata {
  trackedProject: string;
  projectSubtitle: string;
  trackerVersion: string;
  statusDate: string;
  currentPhase: string;
  currentFocus: string;
  productionAuthority: ProductionAuthority;
  prototypePromotionDefault: string;
}

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  summary: string;
  source: string;
  details: string;
}

export interface AppState {
  metadata: ProjectMetadata;
  specs: SpecDomain[];
  uis: UIModule[];
  decisions: Decision[];
  openItems: Decision[];
  roadmap: RoadmapPhase[];
  changelog: ChangelogEntry[];
}
