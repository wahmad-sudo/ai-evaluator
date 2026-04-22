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

  const completed = new Set(responses.map(r=>r.item_id)).size;
  const avg =
    responses.length > 0
      ? (responses.reduce((a,b)=>a+(b.score||0),0)/responses.length).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="w-full bg-white border-b px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">VectorTechSol</h1>
          <p className="text-sm text-gray-500">Daily Evaluation Run</p>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-sm">👤 {user}</span>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Export
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="w-full px-8 py-6 grid grid-cols-4 gap-6">

        {/* TASKS */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {items.map((item, i) => {

            const score = getScore(item.id);

            return (
              <div key={item.id} className="bg-white rounded-xl shadow p-5 border">

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Task {i+1}</span>
                  <span>{score ? "✅ Done" : "Pending"}</span>
                </div>

                <div className="mt-3 font-medium text-gray-800">
                  {item.input}
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  {item.ai_output}
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      onClick={()=>save(item.id, s)}
                      className={`px-3 py-1 rounded text-sm border
                        ${score===s ? "bg-green-500 text-white" : "bg-gray-100"}
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

        {/* SIDE PANEL */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="text-3xl font-bold">{completed}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Average Score</p>
            <h2 className="text-3xl font-bold">{avg}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-sm text-gray-500 mb-2">Recent Activity</p>

            <div className="space-y-1 text-sm max-h-48 overflow-auto">
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
