"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", run_id);

    setResponses(data || []);
  }

  const total = responses.length;
  const avg =
    responses.length > 0
      ? (responses.reduce((a, b) => a + (b.score || 0), 0) / responses.length).toFixed(2)
      : "0.00";

  const distribution = [1, 2, 3, 4, 5].map((s) => ({
    score: s,
    count: responses.filter((r) => r.score === s).length,
  }));

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>Total Evaluations: {total}</p>
      <p>Average Score: {avg}</p>

      <h3>Score Distribution</h3>
      {distribution.map((d) => (
        <div key={d.score}>
          {d.score}★ : {d.count}
        </div>
      ))}

      <h3 style={{ marginTop: 30 }}>History</h3>
      {responses.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: 10, marginTop: 8 }}>
          Score: {r.score} | Item: {r.item_id}
        </div>
      ))}
    </div>
  );
}
