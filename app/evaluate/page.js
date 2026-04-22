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

  if (!items.length) return <div style={{ padding: 40 }}>Loading...</div>;

  const item = items[index];

  return (
    <div style={{ fontFamily: "Inter, Arial", background: "#f8fafc", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{
        background: "white",
        padding: "16px 32px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2 style={{ margin: 0 }}>AI Evaluator</h2>
        <div>Task {index + 1} / {items.length}</div>
      </div>

      {/* MAIN */}
      <div style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20
      }}>

        {/* PROGRESS BAR */}
        <div style={{
          height: 8,
          background: "#e5e7eb",
          borderRadius: 6,
          marginBottom: 30
        }}>
          <div style={{
            width: `${((index + 1) / items.length) * 100}%`,
            height: "100%",
            background: "#6366f1",
            borderRadius: 6
          }} />
        </div>

        {/* CARD */}
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>

          {/* INPUT */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: "#6b7280" }}>Input</label>
            <div style={{
              marginTop: 6,
              padding: 12,
              background: "#f9fafb",
              borderRadius: 8
            }}>
              {item.input}
            </div>
          </div>

          {/* OUTPUT */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: "#6b7280" }}>AI Output</label>
            <div style={{
              marginTop: 6,
              padding: 12,
              background: "#f9fafb",
              borderRadius: 8
            }}>
              {item.ai_output}
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{
            display: "flex",
            gap: 12,
            marginTop: 20
          }}>
            <button
              onClick={() => saveResponse("Very Helpful")}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: "none",
                background: "#10b981",
                color: "white",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              👍 Helpful
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
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              👎 Not Helpful
            </button>
          </div>

        </div>

        {/* NAV */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 30
        }}>
          <button
            onClick={() => setIndex(index - 1)}
            disabled={index === 0}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "white",
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
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer"
            }}
          >
            Next
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: "center",
        padding: 20,
        color: "#9ca3af"
      }}>
        © AI Evaluator • Built for fast evaluation workflows
      </div>

    </div>
  );
}
