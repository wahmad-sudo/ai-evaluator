"use client";
import type { EvaluatorItem } from "@/types/evaluator";

function getFeedback(score: number): string {
  if (score >= 4) return "Strong response quality. Keep tone and clarity consistent.";
  if (score === 3) return "Decent response, but may need stronger actionability or precision.";
  return "Weak response. Consider improving empathy, specificity, and resolution steps.";
}

export function EvaluatorInsightsPanel({ items }: { items: EvaluatorItem[] }) {
  const highPending = items.filter((i) => i.priority === "high" && i.task_status === "pending");
  const completed = items.filter((i) => i.task_status === "completed");
  const avgScore =
    completed.length > 0
      ? (completed.reduce((s, i) => s + (i.score ?? 0), 0) / completed.length).toFixed(2)
      : "0.00";
  const lowScoreTasks = completed.filter((i) => (i.score ?? 0) <= 2);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white">AI Insights & Alerts</h3>

      <div className="space-y-1 text-sm text-zinc-400">
        <p>Avg completed score: <span className="text-white font-medium">{avgScore}</span></p>
        <p>High-priority pending: <span className="text-white font-medium">{highPending.length}</span></p>
        <p>Low-score tasks: <span className="text-white font-medium">{lowScoreTasks.length}</span></p>
      </div>

      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Alerts</div>
        {highPending.length === 0 ? (
          <p className="text-xs text-zinc-500">No critical pending alerts.</p>
        ) : (
          highPending.slice(0, 5).map((i) => (
            <div key={i.id} className="text-xs bg-zinc-800 rounded-lg px-3 py-2 mb-2 text-amber-400">
              High Priority Pending: {i.title}
            </div>
          ))
        )}
      </div>

      {lowScoreTasks.length > 0 && (
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Per-task Feedback</div>
          {lowScoreTasks.slice(0, 5).map((i) => (
            <div key={i.id} className="text-xs bg-zinc-800 rounded-lg px-3 py-2 mb-2">
              <div className="font-medium text-zinc-200 mb-1">{i.title}</div>
              <div className="text-zinc-400">{getFeedback(i.score ?? 0)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
