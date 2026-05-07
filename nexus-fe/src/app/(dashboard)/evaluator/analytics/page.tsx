"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { EvaluatorKPIBar, EvaluatorChartsPanel, EvaluatorInsightsPanel } from "@/components/evaluator";
import type { EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

const RUN_ID = process.env.NEXT_PUBLIC_EVALUATOR_RUN_ID ?? "f4790bd3-210e-4657-847d-cf4e619b1d98";

export default function EvaluatorAnalyticsPage() {
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [responses, setResponses] = useState<EvaluatorResponse[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: itemData } = await supabase.from("items").select("*").eq("run_id", RUN_ID).order("position");
    const { data: respData } = await supabase.from("responses").select("*").eq("run_id", RUN_ID);
    const enriched = ((itemData as EvaluatorItem[]) ?? []).map((item) => {
      const resp = (respData as EvaluatorResponse[])?.find((r) => r.item_id === item.id);
      return { ...item, score: resp?.score ?? item.score };
    });
    setItems(enriched);
    setResponses((respData as EvaluatorResponse[]) ?? []);
  }

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg = responses.length > 0
    ? (responses.reduce((a, b) => a + (b.score ?? 0), 0) / responses.length).toFixed(2)
    : "0.00";
  const lowCount = responses.filter((r) => (r.score ?? 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score ?? 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const alerts = lowCount === 0
    ? [{ title: "No critical alerts", body: "No low-score evaluations in the current run." }]
    : responses.filter((r) => (r.score ?? 0) <= 2).map((r) => ({
        title: "Low-score evaluation",
        body: `Item ${String(r.item_id).slice(0, 8)}… scored ${r.score}/5`,
      }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Evaluator Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">Score distribution, activity, and run-level health · Run ID {RUN_ID.slice(0, 8)}…</p>
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
                  <div key={i} className={`text-xs rounded-lg px-3 py-2 ${lowCount === 0 ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
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
