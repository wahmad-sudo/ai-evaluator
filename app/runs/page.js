"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const ORG_ID = "70386368-862f-4f4d-a2bd-ecff976756d3";

function dateStringToday() {
  return new Date().toISOString().split("T")[0];
}

export default function RunsPage() {
  const [runs, setRuns] = useState([]);
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState("daily");
  const [startDate, setStartDate] = useState(dateStringToday());
  const [endDate, setEndDate] = useState(dateStringToday());
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    loadRuns();
  }, []);

  async function loadRuns() {
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .eq("org_id", ORG_ID)
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setRuns(data || []);
  }

  async function createRun() {
    const label = name || `${cadence.toUpperCase()} Run ${startDate}`;

    const { error } = await supabase.from("runs").insert({
      org_id: ORG_ID,
      name: label,
      cadence,
      run_type: cadence,
      start_date: startDate,
      end_date: cadence === "custom" ? endDate : startDate,
      status: "active",
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Run created");
    setName("");
    loadRuns();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <div className="brand-title">Run Management</div>
            <div className="brand-sub">Daily, weekly, and custom backlog run creation</div>
          </div>
          <div className="top-meta">
            <div className="top-pill">Organization: VectorTechSol</div>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="panel panel-pad">
            <h2 className="section-title">Create Run</h2>

            <div className="task-grid">
              <div>
                <div className="info-label">Run Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="btn"
                  style={{ width: "100%", textAlign: "left" }}
                  placeholder="Optional custom name"
                />
              </div>

              <div>
                <div className="info-label">Cadence</div>
                <select
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value)}
                  className="btn"
                  style={{ width: "100%" }}
                >
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="custom">custom</option>
                </select>
              </div>

              <div>
                <div className="info-label">Start Date</div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="btn"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <div className="info-label">End Date</div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="btn"
                  style={{ width: "100%" }}
                  disabled={cadence !== "custom"}
                />
              </div>
            </div>

            <div className="action-row" style={{ marginTop: 16 }}>
              <button onClick={createRun} className="btn btn-primary">Create Run</button>
            </div>

            <div className="footer-note">Status: {status}</div>
          </div>

          <div className="panel panel-pad">
            <h2 className="section-title">Run Notes</h2>
            <div className="message-list">
              <div className="message-item">
                <div className="message-meta">Daily</div>
                <div>Use for regular operational evaluation batches.</div>
              </div>
              <div className="message-item">
                <div className="message-meta">Weekly</div>
                <div>Use for summary and review cycles.</div>
              </div>
              <div className="message-item">
                <div className="message-meta">Custom</div>
                <div>Use for backlog windows and specific date-bounded review campaigns.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel panel-pad">
          <h2 className="section-title">Existing Runs</h2>
          <div className="run-list">
            {runs.map((r) => (
              <div key={r.id} className="run-item">
                <div className="run-top">
                  <strong>{r.name}</strong>
                  <span className="status-badge status-done">{r.cadence || "custom"}</span>
                </div>
                <div className="run-meta">
                  {r.start_date} → {r.end_date || r.start_date}
                </div>
                <div className="run-meta">Run ID {String(r.id).slice(0, 8)}...</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
