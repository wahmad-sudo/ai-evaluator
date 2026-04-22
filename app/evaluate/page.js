"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchResponses();
  }, []);

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

  async function saveResponse(score) {
    const item = items[index];

    await supabase.from("responses").insert({
      run_id,
      item_id: item.id,
      score: score,
      status: "completed",
    });

    fetchResponses();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) return <div className="p-10">Loading...</div>;

  const item = items[index];

  // 📊 Metrics
  const completed = responses.length;
  const avgScore =
    responses.length > 0
      ? (responses.reduce((a, b) => a + (b.score || 0), 0) / responses.length).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* LEFT PANEL */}
      <div className="w-2/3 p-8">

        <h2 className="text-xl font-semibold mb-4">
          Evaluation ({index + 1}/{items.length})
        </h2>

        <div className="bg-white p-6 rounded-xl shadow space-y-6">

          <div>
            <p className="text-sm text-gray-500">Input</p>
            <div className="bg-gray-100 p-3 rounded">{item.input}</div>
          </div>

          <div>
            <p className="text-sm text-gray-500">AI Output</p>
            <div className="bg-gray-100 p-3 rounded">{item.ai_output}</div>
          </div>

          {/* ⭐ SCORING */}
          <div className="flex gap-2 pt-4">
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onClick={() => saveResponse(s)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {s}★
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* RIGHT PANEL (Dashboard) */}
      <div className="w-1/3 bg-white border-l p-6 space-y-6">

        <h3 className="font-semibold">Live Stats</h3>

        {/* Widgets */}
        <div className="space-y-4">

          <div className="p-4 border rounded">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-semibold">{completed}</p>
          </div>

          <div className="p-4 border rounded">
            <p className="text-sm text-gray-500">Avg Score</p>
            <p className="text-xl font-semibold">{avgScore}</p>
          </div>

        </div>

        {/* HISTORY */}
        <div>
          <h4 className="font-medium mb-2">History</h4>

          <div className="space-y-2 max-h-64 overflow-auto">
            {responses.map((r, i) => (
              <div key={i} className="text-sm border p-2 rounded">
                Score: {r.score}
              </div>
            ))}
          </div>
        </div>

        {/* LOGS */}
        <div>
          <h4 className="font-medium mb-2">Logs</h4>
          <div className="text-xs text-gray-500">
            {responses.length} evaluations recorded
          </div>
        </div>

      </div>

    </div>
  );
}
