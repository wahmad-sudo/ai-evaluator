"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const ORG_ID = "70386368-862f-4f4d-a2bd-ecff976756d3";

export default function Evaluate() {

  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);
  const [evaluator, setEvaluator] = useState("");

  // Load runs
  useEffect(() => {
    loadRuns();
  }, []);

  async function loadRuns() {
    const { data } = await supabase
      .from("runs")
      .select("*")
      .eq("org_id", ORG_ID);

    setRuns(data || []);

    if (data && data.length > 0) {
      setRunId(data[0].id);
    }
  }

  // Load items + responses
  useEffect(() => {
    if (runId) {
      loadItems();
      loadResponses();
    }
  }, [runId]);

  async function loadItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", runId);

    setItems(data || []);
  }

  async function loadResponses() {
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", runId)
      .eq("org_id", ORG_ID);

    setResponses(data || []);
  }

  async function save(score) {
    const item = items[index];

    // DEDUPE
    const already = responses.find(
      r => r.item_id === item.id && r.evaluator_name === evaluator
    );

    if (already) {
      alert("Already scored by you");
      setIndex(index + 1);
      return;
    }

    await supabase.from("responses").insert({
      run_id: runId,
      item_id: item.id,
      score: score,
      evaluator_name: evaluator,
      org_id: ORG_ID
    });

    loadResponses();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) return <div style={{padding:40}}>Loading...</div>;

  const item = items[index];

  const completed = new Set(responses.map(r => r.item_id)).size;

  const avg =
    responses.length > 0
      ? (responses.reduce((a,b)=>a+(b.score||0),0)/responses.length).toFixed(2)
      : 0;

  return (
    <div style={{padding:40}}>

      <h2>Evaluator</h2>

      {/* RUN SELECTOR */}
      <select value={runId} onChange={(e)=>setRunId(e.target.value)}>
        {runs.map(r => (
          <option key={r.id} value={r.id}>
            {r.name} ({r.cadence})
          </option>
        ))}
      </select>

      <br/><br/>

      {/* USER */}
      <input
        placeholder="Your Name"
        value={evaluator}
        onChange={(e)=>setEvaluator(e.target.value)}
      />

      <h3>Task {index+1}/{items.length}</h3>

      <div style={{background:"#eee",padding:10}}>
        {item.input}
      </div>

      <div style={{background:"#eee",padding:10,marginTop:10}}>
        {item.ai_output}
      </div>

      <div style={{marginTop:10}}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={()=>save(s)}>
            {s}★
          </button>
        ))}
      </div>

      <hr/>

      <h3>Dashboard</h3>
      <p>Completed: {completed}</p>
      <p>Avg Score: {avg}</p>

      <h4>History</h4>
      {responses.map((r,i)=>(
        <div key={i}>
          {r.evaluator_name} → {r.score}
        </div>
      ))}

    </div>
  );
}
