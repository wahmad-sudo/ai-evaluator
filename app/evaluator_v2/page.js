"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EvaluatorV2() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});

  useEffect(() => { loadRuns(); }, []);
  useEffect(() => { if (runId) loadItems(); }, [runId]);

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
    if (data?.length) {
      setSelected(data.find(i => i.task_status !== "completed") || data[0]);
    }
  }

  function setScore(itemId, value) {
    setScores(prev => ({ ...prev, [itemId]: value }));
  }

  async function save() {
    if (!selected) return;

    const score = scores[selected.id];
    if (!score) return;

    await supabase.from("responses").insert({
      item_id: selected.id,
      run_id: runId,
      score
    });

    await supabase
      .from("items")
      .update({
        score,
        task_status: "completed",
        ended_at: new Date().toISOString()
      })
      .eq("id", selected.id);

    await loadItems();
  }

  const active = items.filter(i => i.task_status !== "completed");
  const done = items.filter(i => i.task_status === "completed");

  return (
    <div style={{padding:40, background:"#f5f7fb", minHeight:"100vh"}}>

      <h2>Evaluator (Isolated)</h2>

      <select onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <div style={{display:"grid", gridTemplateColumns:"420px 1fr", gap:20, marginTop:20}}>

        {/* LEFT */}
        <div style={{display:"flex", flexDirection:"column", gap:12}}>

          <h4>Active</h4>

          {active.map(i=>(
            <div key={i.id}
              style={{
                background:"#fff",
                padding:12,
                borderRadius:10,
                cursor:"pointer",
                border: selected?.id===i.id ? "2px solid #2563eb" : "1px solid #ddd"
              }}
              onClick={()=>setSelected(i)}
            >
              <b>{i.title}</b>
              <div style={{fontSize:12, color:"#666"}}>{i.description}</div>
            </div>
          ))}

          <h4>Completed</h4>

          {done.map(i=>(
            <div key={i.id} style={{opacity:0.6}}>
              {i.title} (Score: {i.score})
            </div>
          ))}

        </div>

        {/* RIGHT */}
        <div style={{background:"#fff", padding:20, borderRadius:12}}>

          {selected && (
            <>
              <h3>{selected.title}</h3>

              <p>{selected.description}</p>

              <div style={{display:"flex", gap:10}}>
                {[1,2,3,4,5].map(s=>(
                  <span
                    key={s}
                    style={{
                      fontSize:22,
                      cursor:"pointer",
                      color: s <= (scores[selected.id]||0) ? "gold" : "#ccc"
                    }}
                    onClick={()=>setScore(selected.id, s)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <button
                onClick={save}
                style={{
                  marginTop:16,
                  padding:10,
                  background:"#2563eb",
                  color:"#fff",
                  borderRadius:8,
                  border:"none"
                }}
              >
                Save
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
