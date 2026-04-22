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
    if (runId) {
      loadData();
    }
  }, [runId]);

  async function loadRuns() {
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      setStatus("ERROR loading runs: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setStatus("NO RUNS FOUND");
      return;
    }

    setRuns(data);
    setRunId(data[0].id);
    setStatus("Runs loaded");
  }

  async function loadData() {
    setStatus("Loading data...");

    const { data: itemsData, error: e1 } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", runId);

    const { data: respData, error: e2 } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", runId);

    if (e1 || e2) {
      setStatus("ERROR loading data");
      console.log(e1, e2);
      return;
    }

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

  const getScore = (id) => {
    const r = responses.find(x => x.item_id === id);
    return r ? r.score : null;
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Evaluator</h2>

      <div style={{ marginBottom: 10 }}>
        <b>Status:</b> {status}
      </div>

      {/* RUN SELECT */}
      <select
        value={runId}
        onChange={(e)=>setRunId(e.target.value)}
      >
        {runs.map(r=>(
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 20 }}>
        <b>Items Count:</b> {items.length}
      </div>

      <div style={{ marginTop: 10 }}>
        {items.length === 0 && (
          <div>⚠️ No items found for this run</div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {items.map((item,i)=>{

          const score = getScore(item.id);

          return (
            <div key={item.id} style={{
              border:"1px solid #ccc",
              padding:10,
              marginBottom:10
            }}>
              <b>Task {i+1}</b>

              <div>{item.input}</div>
              <div style={{color:"#666"}}>{item.ai_output}</div>

              <div style={{marginTop:10}}>
                {[1,2,3,4,5].map(s=>(
                  <button
                    key={s}
                    onClick={()=>save(item.id,s)}
                    style={{
                      marginRight:5,
                      background: score===s ? "green" : "#eee"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
