"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import KPIBar from "../components/KPIBar";

export default function Evaluate() {

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
    if (data?.length) setSelected(data[0]);
  }

  function setScore(itemId, value) {
    setScores(prev => ({ ...prev, [itemId]: value }));
  }

  async function save() {
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

  const visibleItems = items.filter(i => i.task_status !== "completed");

  const highPending = items.filter(
    i => i.priority === "high" && i.task_status === "pending"
  ).length;

  const lowScore = items.filter(
    i => (i.score || 0) <= 2 && i.task_status === "completed"
  ).length;

  return (
    <div className="container">

      <h2>Evaluator</h2>

      <select onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      {/* KPI BAR */}
      <KPIBar items={items} />

      <div className="grid">

        {/* LEFT LIST */}
        <div className="card-list">
          {visibleItems.map(item => (
            <div
              key={item.id}
              className={`card ${selected?.id === item.id ? "active" : ""}`}
              onClick={()=>setSelected(item)}
            >
              <div className="title">{item.title}</div>
              <div className="sub">{item.description}</div>
              <div className="meta">Assigned: {item.assigned_to}</div>
              <div className="meta">Priority: {item.priority}</div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
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

              {/* INLINE INSIGHTS */}
              <div className="ai-box" style={{marginTop:16}}>
                <b>Insights</b>
                <div>High priority pending: {highPending}</div>
                <div>Low score tasks: {lowScore}</div>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
