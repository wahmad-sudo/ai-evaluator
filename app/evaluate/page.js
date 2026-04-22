"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

export default function Evaluate() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", run_id)
      .order("position");

    setItems(data || []);
  }

  async function saveResponse(value) {
    await supabase.from("responses").insert({
      run_id,
      item_id: items[index]?.id,
      helpfulness: value,
      status: "completed",
    });
  }

  if (!items.length) return <div>Loading...</div>;

  const item = items[index];

  return (
    <div style={{ padding: 20 }}>
      <h2>Progress: {index + 1} / {items.length}</h2>

      <h3>{item.input}</h3>
      <p>{item.ai_output}</p>

      <button onClick={() => saveResponse("Very Helpful")}>
        Helpful
      </button>

      <button onClick={() => saveResponse("Not Helpful")}>
        Not Helpful
      </button>

      <br /><br />

      <button onClick={() => setIndex(index - 1)} disabled={index === 0}>
        Prev
      </button>

      <button onClick={() => setIndex(index + 1)} disabled={index === items.length - 1}>
        Next
      </button>
    </div>
  );
}
