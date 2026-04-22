"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import AnalyticsPanel from "../components/AnalyticsPanel";
import FilterBar from "../components/FilterBar";
import Timeline from "../components/Timeline";

export default function Evaluate() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [filter, setFilter] = useState("all");

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

  function filteredItems() {
    if (filter === "pending") return items.filter(i => i.task_status === "pending");
    if (filter === "completed") return items.filter(i => i.task_status === "completed");
    if (filter === "high") return items.filter(i => i.priority === "high");
    return items;
  }

  return (
    <div className="container">

      <h2>Evaluator</h2>

      <select onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <FilterBar setFilter={setFilter} />

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
              <div className="sub">{item.description?.slice(0,60)}...</div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div style={{display:"flex", flexDirection:"column", gap:20}}>

          {/* DETAIL */}
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

                <button className="button" onClick={save}>
                  Save Evaluation
                </button>
              </>
            )}
          </div>

          {/* ANALYTICS */}
          <AnalyticsPanel items={items} />

          {/* TIMELINE */}
          <Timeline item={selected} />

        </div>

      </div>

    </div>
  );
}
