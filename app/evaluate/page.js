"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("run_id", run_id)
        .order("position");

      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }
    }

    fetchItems();
  }, []);

  async function saveResponse(value) {
    console.log("Clicked:", value);

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

      <div style={{ marginTop: 20 }}>
        <button onClick={() => saveResponse("Very Helpful")}>
          Helpful
        </button>

        <button onClick={() => saveResponse("Not Helpful")}>
          Not Helpful
        </button>
      </div>

      <br />

      <button onClick={() => setIndex(index - 1)} disabled={index === 0}>
        Prev
      </button>

      <button onClick={() => setIndex(index + 1)} disabled={index === items.length - 1}>
        Next
      </button>
    </div>
  );
}
