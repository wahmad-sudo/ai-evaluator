"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Evaluate() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";

  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("run_id", run_id)
        .order("position");

      setItems(data || []);
    }

    fetchItems();
  }, []);

  async function saveResponse(value) {
    await supabase.from("responses").insert({
      run_id,
      item_id: items[index]?.id,
      helpfulness: value,
      status: "completed",
    });
  }

  if (!items.length) return <div style={{padding:40}}>Loading...</div>;

  const item = items[index];

  return (
    <div style={{
      maxWidth: 800,
      margin: "40px auto",
      padding: 20,
      fontFamily: "Arial"
    }}>
      
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20
      }}>
        <h2>AI Evaluator</h2>
        <div>
          {index + 1} / {items.length}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div style={{
        height: 6,
        background: "#eee",
        borderRadius: 4,
        marginBottom: 30
      }}>
        <div style={{
          width: `${((index + 1) / items.length) * 100}%`,
          height: "100%",
          background: "#4f46e5",
          borderRadius: 4
        }} />
      </div>

      {/* CARD */}
      <div style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 20,
        marginBottom: 30
      }}>
        <h4 style={{marginBottom:10}}>Input</h4>
        <p style={{marginBottom:20}}>{item.input}</p>

        <h4 style={{marginBottom:10}}>AI Output</h4>
        <p>{item.ai_output}</p>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{
        display: "flex",
        gap: 10,
        marginBottom: 30
      }}>
        <button
          onClick={() => saveResponse("Very Helpful")}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 8,
            border: "none",
            background: "#4f46e5",
            color: "white",
            cursor: "pointer"
          }}
        >
          Helpful
        </button>

        <button
          onClick={() => saveResponse("Not Helpful")}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 8,
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer"
          }}
        >
          Not Helpful
        </button>
      </div>

      {/* NAVIGATION */}
      <div style={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <button
          onClick={() => setIndex(index - 1)}
          disabled={index === 0}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer"
          }}
        >
          Prev
        </button>

        <button
          onClick={() => setIndex(index + 1)}
          disabled={index === items.length - 1}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>

    </div>
  );
}
