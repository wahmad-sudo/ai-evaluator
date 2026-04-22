"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const RUN_ID = "f4790bd3-210e-4657-847d-cf4e619b1d98";
const RUN_NAME = "Daily Evaluation Run";
const ORG_NAME = "VectorTechSol";
const USER_NAME = "Waqar Ahmad";

export default function Evaluate() {
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [activityFilter, setActivityFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: itemsData } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", RUN_ID)
      .order("position");

    const { data: respData } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", RUN_ID);

    setItems(itemsData || []);
    setResponses(respData || []);
  }

  async function save(itemId, score) {
    const existing = responses.find(
      (r) => r.item_id === itemId && r.evaluator_name === USER_NAME
    );

    if (existing) {
      return;
    }

    await supabase.from("responses").insert({
      run_id: RUN_ID,
      item_id: itemId,
      score,
      evaluator_name: USER_NAME,
      organization_name: ORG_NAME,
    });

    load();
  }

  const itemScoreMap = {};
  responses.forEach((r) => {
    if (!(r.item_id in itemScoreMap)) itemScoreMap[r.item_id] = r.score;
  });

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg =
    responses.length > 0
      ? (responses.reduce((a, b) => a + (b.score || 0), 0) / responses.length).toFixed(2)
      : "0.00";

  const lowCount = responses.filter((r) => (r.score || 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score || 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const activity = useMemo(() => {
    if (activityFilter === "low") {
      return responses.filter((r) => (r.score || 0) <= 2);
    }
    if (activityFilter === "high") {
      return responses.filter((r) => (r.score || 0) >= 4);
    }
    return responses;
  }, [responses, activityFilter]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <div className="brand-title">{ORG_NAME}</div>
            <div className="brand-sub">{RUN_NAME} • Run ID {RUN_ID.slice(0, 8)}...</div>
          </div>

          <div className="top-meta">
            <div className="top-pill">👤 {USER_NAME}</div>
            <div className="top-pill">Contact: ops@vectortechsol.com</div>
            <div className="top-pill">Address: Frisco, Texas</div>
            <button className="btn btn-primary">Export</button>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="run-summary">
          <div className="summary-box">
            <div className="summary-label">Run Name</div>
            <div className="summary-value">{RUN_NAME}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Completed</div>
            <div className="summary-value">{completed}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Pending</div>
            <div className="summary-value">{pending}</div>
          </div>
          <div className="summary-box">
            <div className="summary-label">Average Score</div>
            <div className="summary-value">{avg}</div>
          </div>
        </section>

        <section className="main-grid">
          <div className="stack">
            {items.map((item, i) => {
              const savedScore = itemScoreMap[item.id] || null;
              const done = !!savedScore;

              return (
                <div key={item.id} className="task-card">
                  <div className="task-head">
                    <div className="task-title">Task {i + 1}</div>
                    <div className={`status-badge ${done ? "status-done" : "status-pending"}`}>
                      {done ? "Completed" : "Pending Review"}
                    </div>
                  </div>

                  <div className="task-grid">
                    <div className="info-box">
                      <div className="info-label">Input</div>
                      <div className="info-text">{item.input}</div>
                    </div>

                    <div className="info-box">
                      <div className="info-label">AI Output</div>
                      <div className="info-text">{item.ai_output}</div>
                    </div>
                  </div>

                  <div className="score-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => save(item.id, s)}
                        className={`score-btn ${savedScore === s ? "active" : ""}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="right-col stack">
            <div className="panel panel-pad">
              <h3 className="section-title">Live Widgets</h3>
              <div className="widget-grid">
                <div className="widget">
                  <div className="widget-label">Completed</div>
                  <div className="widget-value">{completed}</div>
                  <div className="widget-link" onClick={() => setActivityFilter("all")}>Show all activity</div>
                </div>

                <div className="widget">
                  <div className="widget-label">Average Score</div>
                  <div className="widget-value">{avg}</div>
                  <div className="widget-link">Run quality snapshot</div>
                </div>

                <div className="widget">
                  <div className="widget-label">High Scores</div>
                  <div className="widget-value">{highCount}</div>
                  <div className="widget-link" onClick={() => setActivityFilter("high")}>Filter 4–5 only</div>
                </div>

                <div className="widget">
                  <div className="widget-label">Low Scores</div>
                  <div className="widget-value">{lowCount}</div>
                  <div className="widget-link" onClick={() => setActivityFilter("low")}>Filter 1–2 only</div>
                </div>
              </div>
            </div>

            <div className="panel panel-pad">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                {activity.length === 0 ? (
                  <div className="activity-item">No activity in this filter.</div>
                ) : (
                  activity.map((r, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-top">
                        <strong>{r.evaluator_name || USER_NAME}</strong>
                        <span className="status-badge">{r.score} / 5</span>
                      </div>
                      <div className="activity-meta">
                        Item {String(r.item_id).slice(0, 8)}... • {ORG_NAME}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="panel panel-pad">
              <h3 className="section-title">Messages</h3>
              <div className="message-list">
                <div className="message-item">
                  <div className="message-meta">Operations</div>
                  <div>Current run is active and all task cards are grouped under the same run summary.</div>
                </div>
                <div className="message-item">
                  <div className="message-meta">Quality</div>
                  <div>Use low-score filter to inspect weaker responses needing attention.</div>
                </div>
                <div className="message-item">
                  <div className="message-meta">Product</div>
                  <div>Dashboard and Runs pages are available from the home control panel.</div>
                </div>
              </div>

              <div className="action-row" style={{ marginTop: 14 }}>
                <a className="btn" href="/dashboard">Open Dashboard</a>
                <a className="btn" href="/runs">Open Runs</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
