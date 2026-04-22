"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [index, setIndex] = useState(0);

  // 🔴 TEMP: use your original working run_id
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: itemsData, error: e1 } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", run_id);

    const { data: respData, error: e2 } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", run_id);

    console.log("items:", itemsData);
    console.log("responses:", respData);

    if (e1 || e2) {
      console.error(e1 || e2);
    }

    setItems(itemsData || []);
    setResponses(respData || []);
  }

  async function save(score) {
    const item = items[index];

    await supabase.from("responses").insert({
      run_id,
      item_id: item.id,
      score
    });

    load();

    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  }

  if (!items.length) {
    return <div style={{padding:40}}>Loading or No Data...</div>;
  }

  const item = items[index];

  return (
    <div style={{padding:40}}>

      <h2>Task {index+1} / {items.length}</h2>

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

    </div>
  );
}
