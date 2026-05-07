"use client";
import type { WorkflowTimelineStep } from "@/lib/intent-workflow/types";
import { stepStatusColor, stepStatusLabel } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  steps: WorkflowTimelineStep[];
  isPolling?: boolean;
}

export function FulfillmentTimeline({ steps, isPolling }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Fulfillment Timeline
        </span>
        {isPolling && (
          <span className="text-xs text-blue-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-700" />

        {steps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-3 pb-3">
            <div className="relative z-10 mt-0.5">
              <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center", stepStatusColor(step.status))}>
                {step.status === "completed" && <CheckIcon />}
                {step.status === "running" && <SpinIcon />}
                {step.status === "failed" && <XIcon />}
                {(step.status === "pending" || step.status === "hold") && (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between">
                <span className={clsx(
                  "text-sm font-medium",
                  step.status === "completed" ? "text-zinc-200" :
                  step.status === "running" ? "text-blue-300" :
                  step.status === "failed" ? "text-red-400" : "text-zinc-500"
                )}>
                  {step.step_label}
                </span>
                <span className="text-xs text-zinc-600">
                  {step.duration_ms ? `${step.duration_ms}ms` : stepStatusLabel(step.status)}
                </span>
              </div>
              {step.message && (
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{step.message}</p>
              )}
            </div>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="pl-8 text-xs text-zinc-600">Waiting for timeline data...</div>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg className="w-3 h-3 text-white animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
