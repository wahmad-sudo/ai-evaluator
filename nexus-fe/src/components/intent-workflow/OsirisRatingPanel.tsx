"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { osirisColor, osirisLabel } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

const DIMENSIONS = [
  { key: "entity_match", label: "Entity Match" },
  { key: "intent_relevance", label: "Intent Relevance" },
  { key: "source_trust", label: "Source Trust" },
  { key: "evidence_strength", label: "Evidence Strength" },
  { key: "freshness", label: "Freshness" },
  { key: "contact_path", label: "Contact Path" },
  { key: "duplicate_risk", label: "Duplicate Risk" },
  { key: "persona_fit", label: "Persona Fit" },
] as const;

export function OsirisRatingPanel({ match }: Props) {
  const verdict = match.osiris_verdict;
  const rating = match.osiris_rating;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Osiris Rating</span>
        <div className="text-right">
          <span className={clsx("text-lg font-bold", osirisColor(verdict))}>{rating.toFixed(0)}</span>
          <span className="text-xs text-zinc-500 ml-1">/ 100</span>
        </div>
      </div>

      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        verdict === "OSIRIS_A_LOCKED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        verdict === "OSIRIS_B_STRONG" ? "border-green-500 text-green-400 bg-green-950/40" :
        verdict === "OSIRIS_C_REVIEW" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        verdict === "OSIRIS_D_WEAK" ? "border-orange-500 text-orange-400 bg-orange-950/40" :
        "border-red-500 text-red-400 bg-red-950/40"
      )}>
        {osirisLabel(verdict)}
      </div>

      <div className="space-y-2">
        {DIMENSIONS.map(({ key, label }) => {
          const raw = (match as Record<string, unknown>)[key];
          const value = typeof raw === "number" ? raw : 0;
          return (
            <div key={key}>
              <div className="flex justify-between text-xs text-zinc-400 mb-0.5">
                <span>{label}</span>
                <span>{value.toFixed(0)}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={clsx("h-full rounded-full transition-all",
                    value >= 85 ? "bg-emerald-500" : value >= 70 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.min(100, value)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
