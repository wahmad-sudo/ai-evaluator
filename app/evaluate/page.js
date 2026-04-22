"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadRuns();
  }, []);

  useEffect(() => {
    if (runId) loadItems();
  }, [runId]);

  async function loadRuns() {
    const { data } = await supabase.from("runs").select("*");
    setRuns(data || []);
    if (data?.length) setRunId(data[0].id);
  }

  async function loadItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", runId);

    setItems(data || []);
  }

  async function score(itemId, s) {
    await supabase.from("responses").insert({
      item_id: itemId,
      run_id: runId,
      score: s
    });

    loadItems();
  }

  return (
    <div className="container">

      <h2>Evaluator</h2>

      <select onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <div className="grid">

        {items.map(item => (
          <div className="card" key={item.id}>

            <h4>{item.title}</h4>

            <p>{item.description}</p>

            <div>
              {[1,2,3,4,5].map(s=>(
                <button key={s} onClick={()=>score(item.id,s)}>
                  ⭐{s}
                </button>
              ))}
            </div>

            <p>Assigned: {item.assigned_to}</p>
            <p>Status: {item.task_status}</p>
            <p>Priority: {item.priority}</p>

          </div>
        ))}

      </div>

    </div>
  );
}
