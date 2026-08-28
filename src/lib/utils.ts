import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Progress weights
export const specWeights: Record<string, number> = {
  'FROZEN_FOR_V1': 100,
  'CONFIRMED': 90,
  'FROZEN_CORE': 85,
  'BASELINE_CONFIRMED': 80,
  'PARTIAL': 50,
  'NEEDS_DECISION': 20,
  'NEEDS_EVIDENCE': 20,
  'DEFERRED_TO_PROTOTYPE_REVIEW': 25,
  'BLOCKED': 0,
  'NOT_STARTED': 0,
};

export const uiWeights: Record<string, number> = {
  'FROZEN_FOR_PROTOTYPE_V0': 100,
  'FROZEN_FOR_CUSTOMER_DEMO': 100,
  'UI_REVIEW_PASS': 100,
  'READY_TO_FREEZE': 75,
  'READY_TO_PROTOTYPE': 70,
  'IN_PROGRESS': 55,
  'READY_FOR_REVIEW': 50,
  'DEFERRED_TO_PROTOTYPE_REVIEW': 25,
  'SPEC_REOPEN_REQUIRED': 25,
  'UI_PENDING': 20,
  'PLACEHOLDER': 15,
  'NOT_STARTED': 0,
};

export function calculateProgress(status: string, type: 'spec' | 'ui'): number {
  if (type === 'spec') return specWeights[status] || 0;
  return uiWeights[status] || 0;
}
