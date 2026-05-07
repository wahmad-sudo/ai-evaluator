"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { bantColor } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

export function QualificationScorePanel({ match }: Props) {
  const score = match.bant_score;
  const decision = match.bant_decision;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">BANT Qualification</span>
        <span className={clsx("text-lg font-bold", bantColor(decision))}>{score.toFixed(0)}</span>
      </div>

      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        decision === "APPROVED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        decision === "HOLD" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        "border-red-500 text-red-400 bg-red-950/40"
      )}>
        {decision ?? "—"}
      </div>

      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all",
            score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs text-zinc-500">
        <span>Score: {score.toFixed(0)} / 100</span>
        <span className="text-right">≥70 = Approved</span>
      </div>
    </div>
  );
}
