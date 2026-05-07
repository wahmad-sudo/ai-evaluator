"use client";
import { useEffect, useState } from "react";
import { listRuns, listItems, submitResponse } from "@/lib/api/evaluator";
import { EvaluatorTimeline } from "@/components/evaluator";
import type { EvaluatorRun, EvaluatorItem } from "@/types/evaluator";

export default function EvaluatorV2Page() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [selected, setSelected] = useState<EvaluatorItem | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => { loadRuns(); }, []);
  useEffect(() => { if (runId) loadItems(); }, [runId]);

  async function loadRuns() {
    const data = await listRuns();
    setRuns(data);
    if (data.length) setRunId(data[0].id);
  }

  async function loadItems() {
    const data = await listItems(runId);
    setItems(data);
    if (data.length) setSelected(data.find((i) => i.task_status !== "completed") ?? data[0]);
  }

  async function save() {
    if (!selected) return;
    const score = scores[selected.id];
    if (!score) return;
    await submitResponse({ item_id: selected.id, run_id: runId, score });
    await loadItems();
  }

  const active = items.filter((i) => i.task_status !== "completed");
  const done = items.filter((i) => i.task_status === "completed");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Evaluator V2</h1>
            <p className="text-zinc-400 text-sm mt-1">Isolated per-run evaluation with star scoring</p>
          </div>
          <select
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200"
            onChange={(e) => setRunId(e.target.value)}
            value={runId}
          >
            {runs.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-[380px_1fr] gap-5">
          <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Active ({active.length})</div>
            {active.map((i) => (
              <div
                key={i.id}
                onClick={() => setSelected(i)}
                className={`cursor-pointer rounded-xl p-3 border transition-colors ${selected?.id === i.id ? "border-blue-500 bg-blue-950/30" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"}`}
              >
                <div className="text-sm font-medium text-zinc-200">{i.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{i.description}</div>
              </div>
            ))}
            {done.length > 0 && (
              <>
                <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium mt-4">Completed ({done.length})</div>
                {done.map((i) => (
                  <div key={i.id} className="rounded-xl p-3 border border-zinc-800 bg-zinc-900/50 opacity-60">
                    <div className="text-sm text-zinc-400">{i.title} · Score {i.score}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="space-y-4">
            {selected ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="text-lg font-semibold text-white mb-1">{selected.title}</div>
                <div className="text-sm text-zinc-400 mb-5">{selected.description}</div>
                <div className="flex gap-3 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScores((prev) => ({ ...prev, [selected.id]: s }))}
                      className="text-3xl transition-colors"
                      style={{ color: s <= (scores[selected.id] ?? 0) ? "#f59e0b" : "#3f3f46" }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <button onClick={save} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
                  Save Score
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-500 text-sm">Select a task to score.</div>
            )}
            <EvaluatorTimeline item={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}
