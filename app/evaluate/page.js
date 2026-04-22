"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

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
    if (data?.length) setSelected(data[0]);
  }

  async function save() {
    if (!score || !selected) return;

    await supabase.from("responses").insert({
      item_id: selected.id,
      run_id: runId,
      score
    });

    alert("Saved");
  }

  function priorityClass(p) {
    if (p === "high") return "badge high";
    if (p === "low") return "badge low";
    return "badge medium";
  }

  return (
    <div className="container">

      <div className="header">
        <h2>Evaluator</h2>

        <select onChange={(e)=>setRunId(e.target.value)}>
          {runs.map(r=>(
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="grid">

        {/* LEFT: TASK LIST */}
        <div className="card-list">

          {items.map(item => (
            <div
              key={item.id}
              className={`card ${selected?.id === item.id ? "active" : ""}`}
              onClick={()=> {
                setSelected(item);
                setScore(0);
              }}
            >
              <div className="title">{item.title}</div>
              <div className="sub">{item.description?.slice(0,60)}...</div>
            </div>
          ))}

        </div>

        {/* RIGHT: DETAIL PANEL */}
        <div className="detail">

          {selected && (
            <>
              <h3>{selected.title}</h3>

              <div className="ai-box">
                {selected.description}
              </div>

              <div className="stars">
                {[1,2,3,4,5].map(s=>(
                  <span
                    key={s}
                    className={s <= score ? "star active" : "star"}
                    onClick={()=>setScore(s)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="row">
                <span className={priorityClass(selected.priority)}>
                  {selected.priority}
                </span>

                <span className="meta">
                  {selected.task_status}
                </span>
              </div>

              <div className="meta">
                Assigned to: {selected.assigned_to}
              </div>

              <button className="button" onClick={save}>
                Save Evaluation
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
