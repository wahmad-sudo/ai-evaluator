"use client";
import { useEffect, useMemo, useState } from "react";
import { listRuns, listItems, listResponses, submitResponse } from "@/lib/api/evaluator";
import type { EvaluatorRun, EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

const ORG_NAME = process.env.NEXT_PUBLIC_EVALUATOR_ORG_ID ?? "Nexus";
const USER_NAME = typeof window !== "undefined"
  ? (localStorage.getItem("user_name") ?? "Evaluator")
  : "Evaluator";

type ActivityFilter = "all" | "low" | "high";

export default function EvaluatorPage() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [runId, setRunId] = useState<string>("");
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [responses, setResponses] = useState<EvaluatorResponse[]>([]);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listRuns()
      .then((r) => {
        setRuns(r);
        const defaultId = process.env.NEXT_PUBLIC_EVALUATOR_RUN_ID ?? (r[0]?.id ?? "");
        setRunId(defaultId);
      })
      .catch(() => setError("Failed to load runs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!runId) return;
    loadRunData(runId);
  }, [runId]);

  async function loadRunData(id: string) {
    try {
      const [itemsData, respData] = await Promise.all([listItems(id), listResponses(id)]);
      setItems(itemsData);
      setResponses(respData);
    } catch {
      setError("Failed to load run data");
    }
  }

  async function save(itemId: string, score: number) {
    const existing = responses.find((r) => r.item_id === itemId && r.evaluator_name === USER_NAME);
    if (existing) return;
    await submitResponse({ run_id: runId, item_id: itemId, score, evaluator_name: USER_NAME, organization_name: ORG_NAME });
    loadRunData(runId);
  }

  const itemScoreMap: Record<string, number> = {};
  responses.forEach((r) => { if (!(r.item_id in itemScoreMap)) itemScoreMap[r.item_id] = r.score; });

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg = responses.length > 0
    ? (responses.reduce((a, b) => a + (b.score ?? 0), 0) / responses.length).toFixed(2)
    : "0.00";
  const lowCount = responses.filter((r) => (r.score ?? 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score ?? 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const activity = useMemo(() => {
    if (activityFilter === "low") return responses.filter((r) => (r.score ?? 0) <= 2);
    if (activityFilter === "high") return responses.filter((r) => (r.score ?? 0) >= 4);
    return responses;
  }, [responses, activityFilter]);

  const activeRun = runs.find((r) => r.id === runId);

  const stats = [
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "Avg Score", value: avg },
    { label: "High Scores", value: highCount },
    { label: "Low Scores", value: lowCount },
  ];

  const inputCls = "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading evaluator…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Evaluator</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {ORG_NAME}
              {activeRun && <> · <span className="text-zinc-300">{activeRun.name}</span></>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-red-400">{error}</span>}
            <select
              className={inputCls}
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
            >
              {runs.length === 0 && <option value="">No runs found</option>}
              {runs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.cadence})
                </option>
              ))}
            </select>
            <a
              href="/evaluator/runs"
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              Manage Runs
            </a>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {!runId ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            Select or create a run to start evaluating.
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            No items in this run yet.{" "}
            <a href="/evaluator/runs" className="text-blue-400 hover:underline">Add tasks</a>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_360px] gap-5">
            <div className="space-y-4">
              {items.map((item, i) => {
                const savedScore = itemScoreMap[item.id] ?? null;
                const done = !!savedScore;
                return (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-zinc-200">
                        {item.title ?? `Task ${i + 1}`}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          done ? "bg-green-900/40 text-green-400" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {done ? "Completed" : "Pending Review"}
                      </span>
                    </div>
                    {(item.input || item.ai_output) && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {item.input && (
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="text-xs text-zinc-500 mb-1">Input</div>
                            <div className="text-sm text-zinc-300">{item.input}</div>
                          </div>
                        )}
                        {item.ai_output && (
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="text-xs text-zinc-500 mb-1">AI Output</div>
                            <div className="text-sm text-zinc-300">{item.ai_output}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-xs text-zinc-500 mb-3">{item.description}</p>
                    )}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => save(item.id, s)}
                          disabled={done}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                            savedScore === s
                              ? "bg-blue-600 text-white"
                              : done
                              ? "bg-zinc-800/40 text-zinc-600 cursor-not-allowed"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-sm font-semibold text-white mb-3">Live Widgets</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Completed", value: completed, filter: "all" as ActivityFilter },
                    { label: "Avg Score", value: avg, filter: null },
                    { label: "High Scores", value: highCount, filter: "high" as ActivityFilter },
                    { label: "Low Scores", value: lowCount, filter: "low" as ActivityFilter },
                  ].map(({ label, value, filter }) => (
                    <div key={label} className="bg-zinc-800 rounded-lg p-3">
                      <div className="text-xs text-zinc-500 mb-1">{label}</div>
                      <div className="text-lg font-bold text-white">{value}</div>
                      {filter && (
                        <button
                          className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                          onClick={() => setActivityFilter(filter)}
                        >
                          Filter
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-sm font-semibold text-white mb-3">Recent Activity</div>
                <div className="space-y-2">
                  {activity.length === 0 ? (
                    <div className="text-xs text-zinc-500">No activity in this filter.</div>
                  ) : (
                    activity.map((r, idx) => (
                      <div key={idx} className="bg-zinc-800 rounded-lg px-3 py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-zinc-300">
                            {r.evaluator_name ?? USER_NAME}
                          </span>
                          <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                            {r.score} / 5
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          Item {String(r.item_id).slice(0, 8)}… · {ORG_NAME}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href="/evaluator/analytics"
                  className="flex-1 text-center py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  Analytics
                </a>
                <a
                  href="/evaluator/runs"
                  className="flex-1 text-center py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  Runs
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
