"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { osirisColor, osirisLabel, bantColor } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  matches: MatchedObject[];
  selected?: MatchedObject | null;
  onSelect: (match: MatchedObject) => void;
}

export function MatchedTargetsTable({ matches, selected, onSelect }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        No matches yet. Run the sniper to see results.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60">
            {["Type", "Name", "Location", "Intent", "Osiris", "BANT", "Evidence", "Spend Gate", "Action"].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs text-zinc-500 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr
              key={m.id}
              onClick={() => onSelect(m)}
              className={clsx(
                "border-b border-zinc-800/50 cursor-pointer transition-colors",
                selected?.id === m.id ? "bg-blue-950/40" : "hover:bg-zinc-800/40"
              )}
            >
              <td className="px-3 py-2">
                <span className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                  {m.match_type ?? m.source_type ?? "—"}
                </span>
              </td>
              <td className="px-3 py-2 font-medium text-zinc-200 max-w-[160px] truncate">{m.name ?? "—"}</td>
              <td className="px-3 py-2 text-zinc-400 max-w-[140px] truncate">{m.location ?? "—"}</td>
              <td className="px-3 py-2 text-zinc-400 max-w-[140px] truncate">{m.intent ?? "—"}</td>
              <td className="px-3 py-2">
                <span className={clsx("font-semibold", osirisColor(m.osiris_verdict))}>
                  {osirisLabel(m.osiris_verdict)}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className={clsx("font-semibold", bantColor(m.bant_decision))}>
                  {m.bant_score.toFixed(0)}
                </span>
              </td>
              <td className="px-3 py-2">
                <EvidenceBadge status={m.evidence_status} />
              </td>
              <td className="px-3 py-2">
                <SpendBadge decision={m.spend_gate_decision} />
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(m); }}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EvidenceBadge({ status }: { status?: string | null }) {
  const cls = status === "VERIFIED" ? "bg-emerald-900 text-emerald-300" :
    status === "HOLD" ? "bg-yellow-900 text-yellow-300" :
    status === "REJECT" ? "bg-red-900 text-red-300" :
    "bg-zinc-800 text-zinc-400";
  return <span className={clsx("text-xs px-1.5 py-0.5 rounded", cls)}>{status ?? "—"}</span>;
}

function SpendBadge({ decision }: { decision?: string | null }) {
  const cls = decision === "APPROVED" ? "bg-emerald-900 text-emerald-300" :
    decision === "HOLD" ? "bg-yellow-900 text-yellow-300" :
    "bg-zinc-800 text-zinc-400";
  return <span className={clsx("text-xs px-1.5 py-0.5 rounded", cls)}>{decision ?? "—"}</span>;
}
