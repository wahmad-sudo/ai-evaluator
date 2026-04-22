"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

// ✅ ADD THIS
const ORG_ID = "70386368-862f-4f4d-a2bd-ecff976756d3";

export default function Evaluate() {
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchRuns();
  }, []);

  async function fetchRuns() {
    const { data } = await supabase.from("runs").select("*").eq("org_id", ORG_ID);
    if (data && data.length > 0) {
      setRunId(data[0].id);
    }
  }

  useEffect(() => {
    if (runId) {
      fetchItems();
      fetchResponses();
    }
  }, [runId]);

  async function fetchItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", runId);

    setItems(data || []);
  }

  async function fetchResponses() {
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", runId)
      .eq("org_id", ORG_ID);

    setResponses(data || []);
  }

  async function save(score) {
    const item = items[index];

    await supabase.from("responses").insert({
      run_id: runId,
      item_id: item.id,
      score: score,
      org_id: ORG_ID
    });

    fetchResponses();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) return <div className="p-10">Loading...</div>;

  const item = items[index];

  return (
    <div className="p-10">

      <h2>Task {index + 1} / {items.length}</h2>

      <div className="bg-gray-100 p-3 my-3">{item.input}</div>
      <div className="bg-gray-100 p-3 my-3">{item.ai_output}</div>

      <div className="flex gap-2">
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => save(s)}>
            {s}★
          </button>
        ))}
      </div>

    </div>
  );
}
