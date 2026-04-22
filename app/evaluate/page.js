"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ FIX: score per task (not global)
  const [scores, setScores] = useState({});

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

  // ✅ FIX: per-item score
  function setScore(itemId, value) {
    setScores(prev => ({
      ...prev,
      [itemId]: value
    }));
  }

  async function save() {
    const score = scores[selected.id];

    if (!score) return;

    await supabase.from("responses").insert({
      item_id: selected.id,
      run_id: runId,
      score
    });

    // ✅ FIX: reload after save
    await loadItems();
  }

  function filteredItems() {
    // ✅ REMOVE completed tasks from list
    return items.filter(i => i.task_status !== "completed");
  }

  function priorityClass(p) {
    if (p === "high") return "badge high";
    if (p === "low") return "badge low";
    return "badge medium";
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

        {/* LEFT */}
        <div className="card-list">
          {filteredItems().map(item => (
            <div
              key={item.id}
              className={`card ${selected?.id === item.id ? "active" : ""}`}
              onClick={()=>setSelected(item)}
            >
              <div className="title">{item.title}</div>
              <div className="sub">{item.description}</div>

              <div className="meta">
                Assigned: {item.assigned_to}
              </div>

              <div className="meta">
                Priority: {item.priority}
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="detail">

          {selected && (
            <>
              <h3>{selected.title}</h3>

              <div className="ai-box">
                {selected.description}
              </div>

              {/* ⭐ FIXED STARS */}
              <div className="stars">
                {[1,2,3,4,5].map(s=>(
                  <span
                    key={s}
                    className={s <= (scores[selected.id] || 0) ? "star active" : "star"}
                    onClick={()=>setScore(selected.id, s)}
                  >
                    ★
                  </span>
                ))}
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
