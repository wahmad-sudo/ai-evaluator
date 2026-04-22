"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("run_id", run_id)
        .order("position");

      setItems(data || []);
    }

    fetchItems();
  }, []);

  async function saveResponse(value) {
    await supabase.from("responses").insert({
      run_id,
      item_id: items[index]?.id,
      helpfulness: value,
      status: "completed",
    });

    // auto move next (premium UX)
    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) return <div className="p-10 text-center">Loading...</div>;

  const item = items[index];

  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">AI Evaluator</h1>
        <span className="text-sm text-gray-500">
          {index + 1} / {items.length}
        </span>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex justify-center px-4 py-10">

        <div className="w-full max-w-3xl">

          {/* PROGRESS */}
          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((index + 1) / items.length) * 100}%`,
              }}
            />
          </div>

          {/* CARD */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">

            <div>
              <p className="text-xs text-gray-500 mb-1">Input</p>
              <div className="bg-gray-50 p-3 rounded-md">
                {item.input}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">AI Output</p>
              <div className="bg-gray-50 p-3 rounded-md">
                {item.ai_output}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3 pt-4">

              <button
                onClick={() => saveResponse("Very Helpful")}
                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium transition"
              >
                👍 Helpful
              </button>

              <button
                onClick={() => saveResponse("Not Helpful")}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-medium transition"
              >
                👎 Not Helpful
              </button>

            </div>

          </div>

          {/* NAV */}
          <div className="flex justify-between mt-6">

            <button
              onClick={() => setIndex(index - 1)}
              disabled={index === 0}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-40"
            >
              Prev
            </button>

            <button
              onClick={() => setIndex(index + 1)}
              disabled={index === items.length - 1}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-400 pb-6">
        Built with AI • Evaluation Engine
      </div>

    </div>
  );
}
