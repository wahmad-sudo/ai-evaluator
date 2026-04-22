"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("runs").select("*");
    setRuns(data || []);
  }

  function getColor(status) {
    if (status === "not_started") return "badge red";
    if (status === "completed") return "badge green";
    return "badge yellow";
  }

  return (
    <div className="container">

      <h2>Executive Dashboard</h2>

      <div className="grid">
        {runs.map(r => {

          const total = r.total_tasks || 0;
          const done = r.completed_tasks || 0;
          const pct = total ? (done / total) * 100 : 0;

          return (
            <div className="card" key={r.id}>

              <h3>{r.name}</h3>

              <div className={getColor(r.run_status)}>
                {r.run_status}
              </div>

              <p>Tasks: {total}</p>
              <p>Completed: {done}</p>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: pct + "%" }}
                />
              </div>

              <br />

              <a href="/evaluate">Open Run →</a>

            </div>
          );
        })}
      </div>

    </div>
  );
}
