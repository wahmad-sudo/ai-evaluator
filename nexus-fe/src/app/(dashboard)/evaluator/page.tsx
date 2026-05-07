"use client";
import { useEffect, useMemo, useState } from "react";
import { listItems, listResponses, submitResponse } from "@/lib/api/evaluator";
import type { EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

const RUN_ID = process.env.NEXT_PUBLIC_EVALUATOR_RUN_ID ?? "";
const ORG_NAME = "VectorTechSol";
const USER_NAME = "Waqar Ahmad";

type ActivityFilter = "all" | "low" | "high";

export default function EvaluatorPage() {
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [responses, setResponses] = useState<EvaluatorResponse[]>([]);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");

  useEffect(() => { load(); }, []);

  async function load() {
    const [itemsData, respData] = await Promise.all([listItems(RUN_ID), listResponses(RUN_ID)]);
    setItems(itemsData);
    setResponses(respData);
  }

  async function save(itemId: string, score: number) {
    const existing = responses.find((r) => r.item_id === itemId && r.evaluator_name === USER_NAME);
    if (existing) return;
    await submitResponse({ run_id: RUN_ID, item_id: itemId, score, evaluator_name: USER_NAME, organization_name: ORG_NAME });
    load();
  }

  const itemScoreMap: Record<string, number> = {};
  responses.forEach((r) => { if (!(r.item_id in itemScoreMap)) itemScoreMap[r.item_id] = r.score; });

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg = responses.length > 0 ? (responses.reduce((a, b) => a + (b.score ?? 0), 0) / responses.length).toFixed(2) : "0.00";
  const lowCount = responses.filter((r) => (r.score ?? 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score ?? 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const activity = useMemo(() => {
    if (activityFilter === "low") return responses.filter((r) => (r.score ?? 0) <= 2);
    if (activityFilter === "high") return responses.filter((r) => (r.score ?? 0) >= 4);
    return responses;
  }, [responses, activityFilter]);

  const stats = [
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "Avg Score", value: avg },
    { label: "High Scores", value: highCount },
    { label: "Low Scores", value: lowCount },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Evaluator</h1>
          <p className="text-zinc-400 text-sm mt-1">{ORG_NAME} · Run ID {RUN_ID.slice(0, 8)}…</p>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_360px] gap-5">
          <div className="space-y-4">
            {items.map((item, i) => {
              const savedScore = itemScoreMap[item.id] ?? null;
              const done = !!savedScore;
              return (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-zinc-200">Task {i + 1}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${done ? "bg-green-900/40 text-green-400" : "bg-zinc-800 text-zinc-400"}`}>
                      {done ? "Completed" : "Pending Review"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <div className="text-xs text-zinc-500 mb-1">Input</div>
                      <div className="text-sm text-zinc-300">{item.input}</div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <div className="text-xs text-zinc-500 mb-1">AI Output</div>
                      <div className="text-sm text-zinc-300">{item.ai_output}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => save(item.id, s)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${savedScore === s ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"}`}
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
                      <button className="text-xs text-blue-400 hover:text-blue-300 mt-1" onClick={() => setActivityFilter(filter)}>
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
                        <span className="text-xs font-medium text-zinc-300">{r.evaluator_name ?? USER_NAME}</span>
                        <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{r.score} / 5</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">Item {String(r.item_id).slice(0, 8)}… · {ORG_NAME}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <a href="/evaluator/analytics" className="flex-1 text-center py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">Analytics</a>
              <a href="/evaluator/runs" className="flex-1 text-center py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">Runs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
