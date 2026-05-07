"use client";
import type { WorkflowStatus } from "@/lib/intent-workflow/types";
import { clsx } from "clsx";

const FLOW_STEPS = [
  "Current Object",
  "Signal Extraction",
  "Intent Sniper Queries",
  "Matching Objects",
  "Osiris Rating",
  "Magic Script",
  "Action",
];

interface Props {
  status: WorkflowStatus;
  currentStep?: string;
}

function getActiveIndex(status: WorkflowStatus): number {
  if (status === "idle") return -1;
  if (status === "pending") return 0;
  if (status === "completed") return FLOW_STEPS.length - 1;
  if (status === "failed") return -1;
  return 2;
}

export function UniversalMatchFlow({ status, currentStep: _ }: Props) {
  const active = getActiveIndex(status);

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-2">
      {FLOW_STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
              i < active ? "bg-emerald-600 border-emerald-600 text-white" :
              i === active ? "bg-blue-600 border-blue-600 text-white animate-pulse" :
              "bg-zinc-900 border-zinc-700 text-zinc-500"
            )}>
              {i + 1}
            </div>
            <span className={clsx(
              "text-xs text-center leading-tight max-w-[72px]",
              i <= active ? "text-zinc-300" : "text-zinc-600"
            )}>
              {step}
            </span>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className={clsx(
              "h-px w-6 shrink-0 transition-all",
              i < active ? "bg-emerald-600" : "bg-zinc-700"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
