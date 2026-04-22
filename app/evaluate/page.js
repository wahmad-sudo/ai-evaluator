"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState(null);
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    loadRuns();
  }, []);

  useEffect(() => {
    if (runId) loadData();
  }, [runId]);

  async function loadRuns() {
    const { data } = await supabase
      .from("runs")
      .select("*")
      .order("start_date", { ascending: false });

    setRuns(data || []);
    if (data?.length) setRunId(data[0].id);
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
    <div style={{padding:20}}>

      <h2>Evaluator</h2>

      {/* RUN SWITCH */}
      <select value={runId || ""} onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <div style={{marginTop:20}}>

        {items.map((item,i)=>{

          const score = getScore(item.id);

          return (
            <div key={item.id} style={{
              border:"1px solid #ccc",
              padding:15,
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
