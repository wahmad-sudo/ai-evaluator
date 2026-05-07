"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

export function OutreachSpendGatePanel({ match }: Props) {
  const decision = match.spend_gate_decision;
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Outreach Spend Gate</span>
      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        decision === "APPROVED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        decision === "HOLD" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        "border-zinc-700 text-zinc-500 bg-zinc-900/40"
      )}>
        {decision ?? "Pending"}
      </div>
      <p className="text-xs text-zinc-500">
        Gate approves outreach spend based on BANT composite score ≥ 50.
      </p>
    </div>
  );
}
