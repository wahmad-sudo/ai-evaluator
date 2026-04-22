"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const RUN_ID = "f4790bd3-210e-4657-847d-cf4e619b1d98";

export default function Evaluate() {

  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [user, setUser] = useState("Waqar");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: itemsData } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", RUN_ID);

    const { data: respData } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", RUN_ID);

    setItems(itemsData || []);
    setResponses(respData || []);
  }

  async function save(itemId, score) {
    await supabase.from("responses").insert({
      run_id: RUN_ID,
      item_id: itemId,
      score,
      evaluator_name: user
    });

    load();
  }

  const getScore = (id) => {
    const r = responses.find(x => x.item_id === id);
    return r ? r.score : null;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-[#020617]">
        <div>
          <h1 className="text-lg font-semibold">VectorTechSol</h1>
          <p className="text-xs text-gray-400">Run: Daily Evaluation</p>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm">👤 {user}</span>
          <button className="bg-indigo-600 px-4 py-1 rounded">Export</button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 grid grid-cols-3 gap-4">

        {/* TASK LIST */}
        <div className="col-span-2 space-y-3">

          {items.map((item, i) => {

            const score = getScore(item.id);

            return (
              <div key={item.id} className="bg-[#020617] border border-gray-700 rounded p-4">

                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Task {i+1}</span>
                  <span className="text-xs">
                    {score ? "✅ Scored" : "⏳ Pending"}
                  </span>
                </div>

                <div className="mt-2 text-sm font-medium">
                  {item.input}
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  {item.ai_output}
                </div>

                {/* SCORE */}
                <div className="mt-3 flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      onClick={()=>save(item.id, s)}
                      className={`px-3 py-1 rounded text-sm
                        ${score===s ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"}
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>

              </div>
            );
          })}

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-4">

          <div className="bg-[#020617] p-4 rounded border border-gray-700">
            <h3 className="text-sm text-gray-400">Completed</h3>
            <h2 className="text-2xl font-bold">
              {new Set(responses.map(r=>r.item_id)).size}
            </h2>
          </div>

          <div className="bg-[#020617] p-4 rounded border border-gray-700">
            <h3 className="text-sm text-gray-400">Average</h3>
            <h2 className="text-2xl font-bold">
              {responses.length > 0
                ? (responses.reduce((a,b)=>a+(b.score||0),0)/responses.length).toFixed(2)
                : 0}
            </h2>
          </div>

          <div className="bg-[#020617] p-4 rounded border border-gray-700">
            <h3 className="text-sm text-gray-400">Activity</h3>

            <div className="mt-2 text-xs space-y-1 max-h-40 overflow-auto">
              {responses.map((r,i)=>(
                <div key={i}>
                  {r.evaluator_name} → {r.score}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
