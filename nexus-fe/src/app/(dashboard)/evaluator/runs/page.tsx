"use client";
import { useEffect, useState } from "react";
import { listRuns, createRun } from "@/lib/api/evaluator";
import type { EvaluatorRun } from "@/types/evaluator";

const ORG_ID = process.env.NEXT_PUBLIC_EVALUATOR_ORG_ID;

export default function EvaluatorRunsPage() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly" | "custom">("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Ready");

  useEffect(() => { loadRuns(); }, []);

  async function loadRuns() {
    try {
      setRuns(await listRuns(ORG_ID));
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Failed to load runs");
    }
  }

  async function handleCreate() {
    const label = name || `${cadence.toUpperCase()} Run ${startDate}`;
    try {
      await createRun({
        org_id: ORG_ID,
        name: label,
        cadence,
        start_date: startDate,
        end_date: cadence === "custom" ? endDate : startDate,
        status: "active",
      });
      setStatus("Run created");
      setName("");
      loadRuns();
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Failed to create run");
    }
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Run Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Create and manage daily, weekly, and custom evaluation runs</p>
        </div>

        <div className="grid grid-cols-[1.5fr_1fr] gap-5 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-4">Create Run</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Run Name</div>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional custom name" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Cadence</div>
                <select className={inputClass} value={cadence} onChange={(e) => setCadence(e.target.value as typeof cadence)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Start Date</div>
                <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">End Date</div>
                <input type="date" className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={cadence !== "custom"} />
              </div>
            </div>
            <button onClick={handleCreate} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
              Create Run
            </button>
            <div className="mt-2 text-xs text-zinc-500">Status: {status}</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="text-sm font-semibold text-white">Run Notes</div>
            {[
              { label: "Daily", note: "Use for regular operational evaluation batches." },
              { label: "Weekly", note: "Use for summary and review cycles." },
              { label: "Custom", note: "Use for backlog windows and specific date-bounded campaigns." },
            ].map(({ label, note }) => (
              <div key={label} className="bg-zinc-800 rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-zinc-300 mb-0.5">{label}</div>
                <div className="text-xs text-zinc-500">{note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-4">Existing Runs</div>
          <div className="space-y-2">
            {runs.map((r) => (
              <div key={r.id} className="bg-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-200">{r.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{r.start_date} → {r.end_date ?? r.start_date} · ID {String(r.id).slice(0, 8)}…</div>
                </div>
                <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{r.cadence}</span>
              </div>
            ))}
            {runs.length === 0 && <div className="text-xs text-zinc-500">No runs yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
