"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

export function EvidenceGatePanel({ match }: Props) {
  const status = match.evidence_status;
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Evidence Gate</span>
      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        status === "VERIFIED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        status === "HOLD" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        status === "REJECT" ? "border-red-500 text-red-400 bg-red-950/40" :
        "border-zinc-700 text-zinc-500 bg-zinc-900/40"
      )}>
        {status ?? "Pending"}
      </div>
    </div>
  );
}
