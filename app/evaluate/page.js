"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: itemsData } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", run_id);

    const { data: respData } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", run_id);

    setItems(itemsData || []);
    setResponses(respData || []);
  }

  async function save(score) {
    const item = items[index];

    await supabase.from("responses").insert({
      run_id,
      item_id: item.id,
      score
    });

    load();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) {
    return <div className="p-10">No data</div>;
  }

  const item = items[index];

  const completed = new Set(responses.map(r => r.item_id)).size;
  const avg =
    responses.length > 0
      ? (responses.reduce((a, b) => a + (b.score || 0), 0) / responses.length).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* LEFT */}
      <div className="w-2/3 p-8 space-y-6">

        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="text-xl font-semibold">
            Task {index+1} / {items.length}
          </h2>

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
                onClick={()=>save(s)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {s}★
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={()=>setIndex(index-1)}
              disabled={index===0}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Prev
            </button>

            <button
              onClick={()=>setIndex(index+1)}
              disabled={index===items.length-1}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Next
            </button>
          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="w-1/3 bg-white border-l p-6 space-y-4">

        <h3 className="font-semibold">Live Stats</h3>

        <div className="bg-gray-100 p-4 rounded">
          Completed: {completed}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          Avg Score: {avg}
        </div>

        <h4 className="font-medium mt-4">History</h4>

        <div className="max-h-64 overflow-auto space-y-2">
          {responses.map((r,i)=>(
            <div key={i} className="border p-2 rounded text-sm">
              Score: {r.score}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
