"use client";
import type { EvaluatorItem } from "@/types/evaluator";

export function EvaluatorTimeline({ item }: { item: EvaluatorItem | null }) {
  if (!item) return null;

  const rows = [
    { label: "Started", value: item.started_at ?? "—" },
    { label: "Completed", value: item.ended_at ?? "—" },
    { label: "Opens", value: item.open_count ?? 0 },
    { label: "Reopens", value: item.reopen_count ?? 0 },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-sm font-semibold text-white mb-3">Activity</div>
      <div className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-zinc-500">{label}</span>
            <span className="text-zinc-200">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
