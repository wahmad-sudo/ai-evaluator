"use client";
import type { EvaluatorItem } from "@/types/evaluator";

export function EvaluatorKPIBar({ items }: { items: EvaluatorItem[] }) {
  const completed = items.filter((i) => i.task_status === "completed").length;
  const pending = items.filter((i) => i.task_status === "pending").length;
  const avg =
    items.length > 0
      ? (items.reduce((a, b) => a + (b.score ?? 0), 0) / items.length).toFixed(2)
      : "0.00";

  const stats = [
    { label: "Total Tasks", value: items.length },
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "Avg Score", value: avg },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}
