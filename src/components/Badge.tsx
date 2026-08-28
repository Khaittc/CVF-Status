import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

export function Badge({ status, className, ...props }: BadgeProps) {
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';

  // Green statuses
  if (['FROZEN_FOR_V1', 'FROZEN_FOR_PROTOTYPE_V0', 'FROZEN_FOR_CUSTOMER_DEMO', 'CONFIRMED', 'BASELINE_CONFIRMED', 'FROZEN_CORE', 'FROZEN', 'UI_REVIEW_PASS', 'APPROVED_FOR_BUILD', 'PASS'].includes(status)) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } 
  // Blue statuses
  else if (['READY_TO_PROTOTYPE', 'READY_TO_FREEZE', 'READY_FOR_REVIEW', 'READY'].includes(status)) {
    colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
  }
  // Yellow/Orange statuses
  else if (['PARTIAL', 'IN_PROGRESS', 'IN_REVIEW', 'IN_BUILD', 'UI_PENDING', 'WORK_ORDER_REQUIRED'].includes(status)) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }
  // Red statuses
  else if (['NEEDS_DECISION', 'NEEDS_EVIDENCE', 'BLOCKED', 'SPEC_REOPEN_REQUIRED'].includes(status)) {
    colorClass = 'bg-red-50 text-red-700 border-red-200';
  }
  // Gray/Neutral (Default) DEFERRED, PLACEHOLDER, NOT_STARTED, NOT_AUTHORIZED
  else if (['DEFERRED_TO_PROTOTYPE_REVIEW', 'DEFERRED', 'PLACEHOLDER', 'NOT_STARTED', 'NOT_AUTHORIZED'].includes(status)) {
    colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span 
      className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium border inline-flex items-center whitespace-nowrap", colorClass, className)}
      {...props}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
