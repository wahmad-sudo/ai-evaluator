import type { OsirisVerdict, BANTDecision, TimelineStepStatus, WorkflowStatus } from "./types";
import { clsx } from "clsx";

export function osirisColor(verdict: OsirisVerdict | undefined): string {
  switch (verdict) {
    case "OSIRIS_A_LOCKED": return "text-emerald-400";
    case "OSIRIS_B_STRONG": return "text-green-400";
    case "OSIRIS_C_REVIEW": return "text-yellow-400";
    case "OSIRIS_D_WEAK": return "text-orange-400";
    case "OSIRIS_REJECT": return "text-red-500";
    default: return "text-zinc-400";
  }
}

export function osirisLabel(verdict: OsirisVerdict | undefined): string {
  switch (verdict) {
    case "OSIRIS_A_LOCKED": return "A — Locked";
    case "OSIRIS_B_STRONG": return "B — Strong";
    case "OSIRIS_C_REVIEW": return "C — Review";
    case "OSIRIS_D_WEAK": return "D — Weak";
    case "OSIRIS_REJECT": return "Reject";
    default: return "—";
  }
}

export function bantColor(decision: BANTDecision | undefined): string {
  switch (decision) {
    case "APPROVED": return "text-emerald-400";
    case "HOLD": return "text-yellow-400";
    case "REJECT": return "text-red-500";
    default: return "text-zinc-400";
  }
}

export function stepStatusColor(status: TimelineStepStatus): string {
  switch (status) {
    case "completed": return "bg-emerald-500";
    case "running": return "bg-blue-500 animate-pulse";
    case "failed": return "bg-red-500";
    case "hold": return "bg-yellow-500";
    default: return "bg-zinc-600";
  }
}

export function stepStatusLabel(status: TimelineStepStatus): string {
  switch (status) {
    case "completed": return "Done";
    case "running": return "Running";
    case "failed": return "Failed";
    case "hold": return "Hold";
    default: return "Pending";
  }
}

export function workflowStatusLabel(status: WorkflowStatus): string {
  switch (status) {
    case "running": return "Running";
    case "completed": return "Completed";
    case "failed": return "Failed";
    case "pending": return "Starting";
    default: return "Idle";
  }
}

export function scoreBar(value: number, max: number = 100): string {
  const pct = Math.round((value / max) * 100);
  return clsx(
    "h-1.5 rounded-full",
    pct >= 85 ? "bg-emerald-500" : pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"
  );
}
