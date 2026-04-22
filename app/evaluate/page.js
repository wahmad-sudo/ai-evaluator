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
  const [selectedScore, setSelectedScore] = useState(null);
  const [filterLow, setFilterLow] = useState(false);

  // Resume
  useEffect(() => {
    const savedIndex = localStorage.getItem("eval_index");
    const savedName = localStorage.getItem("eval_name");
    if (savedIndex) setIndex(Number(savedIndex));
    if (savedName) setEvaluatorName(savedName);

    fetchItems();
    fetchResponses();
  }, []);

  useEffect(() => {
    localStorage.setItem("eval_index", index);
  }, [index]);

  useEffect(() => {
    localStorage.setItem("eval_name", evaluatorName);
  }, [evaluatorName]);

  async function fetchItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", run_id)
      .order("position");
    setItems(data || []);
  }

  async function fetchResponses() {
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", run_id);
    setResponses(data || []);
  }

  async function save() {
    const item = items[index];

    // 🔒 DEDUPE check
    const already = responses.find(
      r =>
        r.item_id === item.id &&
        r.evaluator_name === evaluatorName
    );

    if (already) {
      alert("Already scored by you");
      setIndex(index + 1);
      return;
    }

    await supabase.from("responses").insert({
      run_id,
      item_id: item.id,
      score: selectedScore,
      evaluator_name: evaluatorName,
      organization_name: organizationName,
      status: "completed"
    });

    await fetchResponses();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) return <div className="p-10">Loading...</div>;

  const item = items[index];

  const completed = new Set(responses.map(r => r.item_id)).size;

  const avg =
    responses.length > 0
      ? (
          responses.reduce((a, b) => a + (b.score || 0), 0) /
          responses.length
        ).toFixed(2)
      : 0;

  const filtered = filterLow
    ? responses.filter(r => r.score <= 2)
    : responses;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT */}
      <div className="w-2/3 p-8 space-y-6">

        <h2 className="text-xl font-semibold">
          Task {index + 1} / {items.length}
        </h2>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <input
            placeholder="Evaluator"
            value={evaluatorName}
            onChange={e => setEvaluatorName(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="Organization"
            value={organizationName}
            onChange={e => setOrganizationName(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <div className="bg-gray-100 p-3 rounded">
            {item.input}
          </div>

          <div className="bg-gray-100 p-3 rounded">
            {item.ai_output}
          </div>

          <div className="flex gap-2">
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onClick={() => setSelectedScore(s)}
                className="px-3 py-2 bg-indigo-600 text-white rounded"
              >
                {s}★
              </button>
            ))}
          </div>

          <button
            onClick={save}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>

        </div>

      </div>

      {/* RIGHT DASHBOARD */}
      <div className="w-1/3 bg-white border-l p-6 space-y-6">

        <h3 className="font-semibold">Dashboard</h3>

        <div>Completed: {completed}</div>
        <div>Avg Score: {avg}</div>

        <button
          onClick={() => setFilterLow(!filterLow)}
          className="bg-red-400 text-white px-2 py-1 rounded"
        >
          Toggle Low Scores
        </button>

        <div className="max-h-64 overflow-auto space-y-2">
          {filtered.map((r,i) => (
            <div key={i} className="border p-2 text-sm">
              {r.evaluator_name} → {r.score}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
