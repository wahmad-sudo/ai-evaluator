"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const RUN_ID = "f4790bd3-210e-4657-847d-cf4e619b1d98";
const RUN_NAME = "Daily Evaluation Run";
const ORG_NAME = "VectorTechSol";

export default function Dashboard() {
  const [responses, setResponses] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: responseData } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", RUN_ID);

    const { data: itemData } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", RUN_ID)
      .order("position");

    setResponses(responseData || []);
    setItems(itemData || []);
  }

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg =
    responses.length > 0
      ? (responses.reduce((a, b) => a + (b.score || 0), 0) / responses.length).toFixed(2)
      : "0.00";
  const lowCount = responses.filter((r) => (r.score || 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score || 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const itemMap = {};
  items.forEach((i) => {
    itemMap[i.id] = i.input;
  });

  const alerts = useMemo(() => {
    const lows = responses.filter((r) => (r.score || 0) <= 2);
    if (lows.length === 0) {
      return [{ title: "No critical alerts", body: "No low-score evaluations in the current run." }];
    }
    return lows.map((r) => ({
      title: "Low-score evaluation",
      body: `${itemMap[r.item_id] || "Unknown task"} scored ${r.score}/5`,
    }));
  }, [responses, itemMap]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <div className="brand-title">Executive Dashboard</div>
            <div className="brand-sub">{ORG_NAME} • {RUN_NAME}</div>
          </div>

          <div className="top-meta">
            <div className="top-pill">Run ID {RUN_ID.slice(0, 8)}...</div>
            <div className="top-pill">Evaluations: {responses.length}</div>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="kpi-grid" style={{ marginTop: 0 }}>
          <div className="kpi-card">
            <div className="kpi-label">Completed</div>
            <div className="kpi-value">{completed}</div>
            <div className="kpi-note">Unique tasks scored in this run</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Pending</div>
            <div className="kpi-value">{pending}</div>
            <div className="kpi-note">Tasks awaiting evaluation</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Average Score</div>
            <div className="kpi-value">{avg}</div>
            <div className="kpi-note">Across all evaluations</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Score Mix</div>
            <div className="kpi-value">{highCount}/{lowCount}</div>
            <div className="kpi-note">High-score vs low-score signals</div>
          </div>
        </section>

        <section className="main-grid" style={{ marginTop: 20 }}>
          <div className="stack">
            <div className="panel panel-pad">
              <h3 className="section-title">Score Distribution</h3>
              <div className="chart-block">
                {[1, 2, 3, 4, 5].map((score) => {
                  const count = responses.filter((r) => r.score === score).length;
                  const width = responses.length ? (count / responses.length) * 100 : 0;

                  return (
                    <div className="chart-row" key={score}>
                      <div>{score}★</div>
                      <div className="chart-bar-wrap">
                        <div className="chart-bar" style={{ width: `${width}%` }} />
                      </div>
                      <div>{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel panel-pad">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                {responses.map((r, idx) => (
                  <div className="activity-item" key={idx}>
                    <div className="activity-top">
                      <strong>{r.evaluator_name || "Waqar Ahmad"}</strong>
                      <span className="status-badge">{r.score}/5</span>
                    </div>
                    <div className="activity-meta">
                      {itemMap[r.item_id] || "Unknown task"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stack">
            <div className="panel panel-pad">
              <h3 className="section-title">Run Summary</h3>
              <div className="run-list">
                <div className="run-item">
                  <div className="run-top">
                    <strong>{RUN_NAME}</strong>
                    <span className="status-badge status-done">Active</span>
                  </div>
                  <div className="run-meta">Run ID {RUN_ID.slice(0, 8)}...</div>
                </div>
              </div>
            </div>

            <div className="panel panel-pad">
              <h3 className="section-title">Message Center</h3>
              <div className="message-list">
                {alerts.map((a, idx) => (
                  <div className="message-item" key={idx}>
                    <div className="message-meta">{a.title}</div>
                    <div>{a.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel panel-pad">
              <h3 className="section-title">Actions</h3>
              <div className="action-row">
                <a href="/evaluate" className="btn btn-primary">Open Evaluator</a>
                <a href="/runs" className="btn">Open Runs</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
