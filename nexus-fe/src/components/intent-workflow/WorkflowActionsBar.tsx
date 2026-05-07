"use client";
import type { MatchedObject, SniperRunResponse } from "@/lib/intent-workflow/types";

interface Props {
  run?: SniperRunResponse | null;
  selectedMatch?: MatchedObject | null;
  onAction: (type: string, matchId?: number) => void;
  loading?: boolean;
}

const ACTIONS = [
  { key: "save_as_lead", label: "Save as Lead", color: "bg-emerald-700 hover:bg-emerald-600" },
  { key: "attach_to_existing_lead", label: "Attach to Lead", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "create_follow_up_task", label: "Follow-Up Task", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "export_json", label: "Export JSON", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "export_csv", label: "Export CSV", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "export_pdf", label: "Export PDF", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "open_audit", label: "Audit Trail", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "trigger_webhook", label: "Webhook", color: "bg-purple-800 hover:bg-purple-700" },
] as const;

export function WorkflowActionsBar({ run, selectedMatch, onAction, loading }: Props) {
  if (!run) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map(({ key, label, color }) => (
        <button
          key={key}
          disabled={loading}
          onClick={() => onAction(key, selectedMatch?.id)}
          className={`text-xs text-white px-3 py-1.5 rounded disabled:opacity-50 transition-colors ${color}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
