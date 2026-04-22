"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    loadRuns();
  }, []);

  useEffect(() => {
    if (runId) loadData();
  }, [runId]);

  async function loadRuns() {
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus("ERROR loading runs: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setStatus("NO RUNS FOUND");
      return;
    }

    setRuns(data);
    setRunId(data[0].id); // always pick latest
    setStatus("Runs loaded");
  }

  async function loadData() {
    const { data: itemsData } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", runId);

    const { data: respData } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", runId);

    setItems(itemsData || []);
    setResponses(respData || []);
    setStatus("Loaded");
  }

  async function save(itemId, score) {
    await supabase.from("responses").insert({
      run_id: runId,
      item_id: itemId,
      score
    });
    loadData();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Evaluator</h2>
      <div>Status: {status}</div>

      <select value={runId} onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <div style={{ marginTop: 20 }}>
        Items: {items.length}
      </div>

      {items.map((item,i)=>(
        <div key={item.id} style={{border:"1px solid #ccc",padding:10,marginTop:10}}>
          <b>Task {i+1}</b>
          <div>{item.input}</div>
          <div style={{color:"#666"}}>{item.ai_output}</div>

          <div style={{marginTop:10}}>
            {[1,2,3,4,5].map(s=>(
              <button key={s} onClick={()=>save(item.id,s)} style={{marginRight:5}}>
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
