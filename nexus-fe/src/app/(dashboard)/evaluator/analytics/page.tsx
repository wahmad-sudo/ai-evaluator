"use client";
import { useEffect, useState } from "react";
import { listRuns, listItems, listResponses } from "@/lib/api/evaluator";
import { EvaluatorKPIBar, EvaluatorChartsPanel, EvaluatorInsightsPanel } from "@/components/evaluator";
import type { EvaluatorRun, EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

export default function EvaluatorAnalyticsPage() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [runId, setRunId] = useState<string>("");
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [responses, setResponses] = useState<EvaluatorResponse[]>([]);

  useEffect(() => {
    listRuns().then((r) => {
      setRuns(r);
      const defaultId = process.env.NEXT_PUBLIC_EVALUATOR_RUN_ID ?? (r[0]?.id ?? "");
      setRunId(defaultId);
    });
  }, []);

  useEffect(() => {
    if (!runId) return;
    load(runId);
  }, [runId]);

  async function load(id: string) {
    const [itemData, respData] = await Promise.all([listItems(id), listResponses(id)]);
    const enriched = itemData.map((item) => {
      const resp = respData.find((r) => r.item_id === item.id);
      return { ...item, score: resp?.score ?? item.score };
    });
    setItems(enriched);
    setResponses(respData);
  }

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg = responses.length > 0
    ? (responses.reduce((a, b) => a + (b.score ?? 0), 0) / responses.length).toFixed(2)
    : "0.00";
  const lowCount = responses.filter((r) => (r.score ?? 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score ?? 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const alerts =
    lowCount === 0
      ? [{ title: "No critical alerts", body: "No low-score evaluations in the current run.", isLow: false }]
      : responses.filter((r) => (r.score ?? 0) <= 2).map((r) => ({
          title: "Low-score evaluation",
          body: `Item ${String(r.item_id).slice(0, 8)}… scored ${r.score}/5`,
          isLow: true,
        }));

  const activeRun = runs.find((r) => r.id === runId);
  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Evaluator Analytics</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Score distribution, activity, and run-level health
              {activeRun && <> · <span className="text-zinc-300">{activeRun.name}</span></>}
            </p>
          </div>
          <select
            className={inputCls}
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.length === 0 && <option value="">No runs</option>}
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.cadence})
              </option>
            ))}
          </select>
        </div>

        <EvaluatorKPIBar items={items} />

        <div className="grid grid-cols-[1fr_380px] gap-5">
          <EvaluatorChartsPanel items={items} />

          <div className="space-y-4">
            <EvaluatorInsightsPanel items={items} />

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">Alerts</div>
              <div className="space-y-2">
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded-lg px-3 py-2 ${
                      a.isLow ? "bg-red-900/20 text-red-400" : "bg-green-900/20 text-green-400"
                    }`}
                  >
                    <div className="font-medium">{a.title}</div>
                    <div className="text-zinc-400 mt-0.5">{a.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="text-sm font-semibold text-white">Run Summary</div>
              {[
                { label: "Completed", value: completed },
                { label: "Pending", value: pending },
                { label: "Avg Score", value: avg },
                { label: "High Scores (4–5)", value: highCount },
                { label: "Low Scores (1–2)", value: lowCount },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-500">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
