"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);

  const [evaluatorName, setEvaluatorName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedScore, setSelectedScore] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Ready");

  useEffect(() => {
    const savedEvaluator = window.localStorage.getItem("evaluator_name") || "";
    const savedOrg = window.localStorage.getItem("organization_name") || "";
    const savedIndex = window.localStorage.getItem(`run_${run_id}_index`);

    setEvaluatorName(savedEvaluator);
    setOrganizationName(savedOrg);
    if (savedIndex) setIndex(Number(savedIndex));

    fetchItems();
    fetchResponses();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("evaluator_name", evaluatorName);
  }, [evaluatorName]);

  useEffect(() => {
    window.localStorage.setItem("organization_name", organizationName);
  }, [organizationName]);

  useEffect(() => {
    window.localStorage.setItem(`run_${run_id}_index`, String(index));
  }, [index, run_id]);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", run_id)
      .order("position");

    if (error) {
      setStatusMessage(`Items load failed: ${error.message}`);
      return;
    }

    setItems(data || []);
  }

  async function fetchResponses() {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", run_id)
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMessage(`Responses load failed: ${error.message}`);
      return;
    }

    setResponses(data || []);
  }

  async function saveEvaluation() {
    if (!items[index]) return;
    if (!selectedScore) {
      setStatusMessage("Pick a score first.");
      return;
    }

    setStatusMessage("Saving...");

    const payload = {
      run_id,
      item_id: items[index].id,
      score: selectedScore,
      helpfulness: selectedScore >= 4 ? "Very Helpful" : selectedScore === 3 ? "Moderate" : "Not Helpful",
      status: "completed",
      evaluator_name: evaluatorName || "Anonymous",
      organization_name: organizationName || "Unassigned",
      notes: notes || null,
    };

    const { error } = await supabase.from("responses").insert(payload);

    if (error) {
      setStatusMessage(`Save failed: ${error.message}`);
      return;
    }

    setStatusMessage("Saved");
    setNotes("");
    setSelectedScore(null);

    await fetchResponses();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  function exportCSV() {
    const headers = [
      "created_at",
      "evaluator_name",
      "organization_name",
      "score",
      "helpfulness",
      "status",
      "notes",
      "item_id",
      "run_id",
    ];

    const rows = responses.map((r) =>
      [
        r.created_at || "",
        r.evaluator_name || "",
        r.organization_name || "",
        r.score || "",
        r.helpfulness || "",
        r.status || "",
        (r.notes || "").replaceAll('"', '""'),
        r.item_id || "",
        r.run_id || "",
      ]
    );

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell)}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluation-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentItem = items[index];

  const completedCount = responses.length;
  const avgScore = useMemo(() => {
    if (!responses.length) return "0.00";
    const total = responses.reduce((sum, r) => sum + (r.score || 0), 0);
    return (total / responses.length).toFixed(2);
  }, [responses]);

  const lowScores = responses.filter((r) => (r.score || 0) <= 2).length;
  const highScores = responses.filter((r) => (r.score || 0) >= 4).length;
  const completionPct = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  if (!items.length) {
    return <div className="min-h-screen bg-slate-50 p-10 text-slate-700">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Evaluator</h1>
            <p className="text-sm text-slate-500">One-page evaluation workspace</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Run</div>
            <div className="font-medium">{run_id.slice(0, 8)}...</div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Evaluation</h2>
                <p className="text-sm text-slate-500">
                  Task {index + 1} of {items.length}
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                {completionPct}% complete
              </div>
            </div>

            <div className="mb-5 h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${((index + 1) / items.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Organization</label>
                <input
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Enter organization"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Evaluator</label>
                <input
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  placeholder="Enter evaluator name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Input</label>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 border">
                  {currentItem?.input}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">AI Output</label>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 border">
                  {currentItem?.ai_output}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Score</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const active = selectedScore === score;
                    return (
                      <button
                        key={score}
                        onClick={() => setSelectedScore(score)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-white border border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {score} ★
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add evaluator notes"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-3 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
                  disabled={index === items.length - 1}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-40"
                >
                  Next
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={exportCSV}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
                >
                  Export CSV
                </button>
                <button
                  onClick={saveEvaluation}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Save Evaluation
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-500">Status: {statusMessage}</div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Widgets</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 border">
                <div className="text-xs uppercase tracking-wide text-slate-500">Completed</div>
                <div className="mt-1 text-2xl font-semibold">{completedCount}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border">
                <div className="text-xs uppercase tracking-wide text-slate-500">Avg Score</div>
                <div className="mt-1 text-2xl font-semibold">{avgScore}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border">
                <div className="text-xs uppercase tracking-wide text-slate-500">High Scores</div>
                <div className="mt-1 text-2xl font-semibold">{highScores}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border">
                <div className="text-xs uppercase tracking-wide text-slate-500">Low Scores</div>
                <div className="mt-1 text-2xl font-semibold">{lowScores}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Completed Task History</h3>
            <div className="max-h-72 space-y-2 overflow-auto">
              {responses.length === 0 ? (
                <div className="text-sm text-slate-500">No completed tasks yet.</div>
              ) : (
                responses.map((r, idx) => (
                  <div key={idx} className="rounded-xl border bg-slate-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.evaluator_name || "Anonymous"}</span>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                        {r.score || 0}★
                      </span>
                    </div>
                    <div className="mt-1 text-slate-500">{r.organization_name || "Unassigned"}</div>
                    <div className="mt-1 text-xs text-slate-400">{r.created_at}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold">Logs & Actions</h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border bg-slate-50 p-3">
                <div className="font-medium">Latest status</div>
                <div className="text-slate-500">{statusMessage}</div>
              </div>
              <div className="rounded-xl border bg-slate-50 p-3">
                <div className="font-medium">Evaluator</div>
                <div className="text-slate-500">{evaluatorName || "Not set"}</div>
              </div>
              <div className="rounded-xl border bg-slate-50 p-3">
                <div className="font-medium">Organization</div>
                <div className="text-slate-500">{organizationName || "Not set"}</div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-slate-500">
          <span>AI Evaluator Platform</span>
          <span>One-page workflow • Results on same screen</span>
        </div>
      </footer>
    </div>
  );
}
