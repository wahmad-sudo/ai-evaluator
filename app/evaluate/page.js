"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import AnalyticsPanel from "../components/AnalyticsPanel";
import FilterBar from "../components/FilterBar";
import Timeline from "../components/Timeline";
import ChartsPanel from "../components/ChartsPanel";
import InsightsPanel from "../components/InsightsPanel";
import RunTaskManager from "../components/RunTaskManager";

export default function Evaluate() {
  const [runs, setRuns] = useState([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRuns();
  }, []);

  useEffect(() => {
    if (runId) loadItems();
  }, [runId]);

  async function loadRuns() {
    const { data } = await supabase
      .from("runs")
      .select("*")
      .order("start_date", { ascending: false });

    setRuns(data || []);
    if (data?.length && !runId) setRunId(data[0].id);
  }

  async function loadItems() {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("run_id", runId);

    setItems(data || []);

    if (data?.length) {
      const openItem = data[0];
      setSelected(openItem);

      await supabase
        .from("items")
        .update({
          started_at: openItem.started_at || new Date().toISOString(),
          last_opened_at: new Date().toISOString(),
          open_count: (openItem.open_count || 0) + 1,
          task_status: openItem.task_status === "pending" ? "in_progress" : openItem.task_status
        })
        .eq("id", openItem.id);
    }
  }

  function setScore(itemId, value) {
    setScores((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  }

  async function save() {
    if (!selected) return;

    const score = scores[selected.id];
    if (!score) return;

    await supabase.from("responses").insert({
      item_id: selected.id,
      run_id: runId,
      score
    });

    await supabase
      .from("items")
      .update({
        score,
        task_status: "completed",
        ended_at: new Date().toISOString(),
        feedback:
          score >= 4
            ? "Strong response quality. Keep this structure."
            : score === 3
            ? "Average result. Improve clarity and actionability."
            : "Needs improvement. Add empathy, detail, and next steps."
      })
      .eq("id", selected.id);

    await loadItems();

    const remaining = filteredItems(
      items.map((i) =>
        i.id === selected.id
          ? { ...i, task_status: "completed", score }
          : i
      ),
      filter
    );

    if (remaining.length > 0) {
      setSelected(remaining[0]);
    } else {
      setSelected(null);
    }
  }

  function filteredItems(sourceItems = items, currentFilter = filter) {
    let list = sourceItems;

    list = list.filter((i) => i.task_status !== "completed");

    if (currentFilter === "pending") {
      return list.filter((i) => i.task_status === "pending");
    }

    if (currentFilter === "high") {
      return list.filter((i) => i.priority === "high");
    }

    if (currentFilter === "in_progress") {
      return list.filter((i) => i.task_status === "in_progress");
    }

    return list;
  }

  const visibleItems = filteredItems();

  return (
    <div className="container">
      <div className="header">
        <h2>Evaluator</h2>

        <select value={runId} onChange={(e) => setRunId(e.target.value)}>
          {runs.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <FilterBar setFilter={setFilter} />

      <div className="grid">
        <div className="card-list">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={`card ${selected?.id === item.id ? "active" : ""}`}
              onClick={async () => {
                setSelected(item);

                await supabase
                  .from("items")
                  .update({
                    started_at: item.started_at || new Date().toISOString(),
                    last_opened_at: new Date().toISOString(),
                    open_count: (item.open_count || 0) + 1,
                    task_status: item.task_status === "pending" ? "in_progress" : item.task_status
                  })
                  .eq("id", item.id);

                await loadItems();
              }}
            >
              <div className="title">{item.title}</div>
              <div className="sub">{item.description}</div>

              <div className="meta">Assigned: {item.assigned_to || "Unassigned"}</div>
              <div className="meta">Priority: {item.priority}</div>
              <div className="meta">Status: {item.task_status}</div>
              <div className="meta">Opened: {item.open_count || 0}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="detail">
            {selected ? (
              <>
                <h3>{selected.title}</h3>

                <div className="ai-box">{selected.description}</div>

                <div className="stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={s <= (scores[selected.id] || 0) ? "star active" : "star"}
                      onClick={() => setScore(selected.id, s)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="meta">Assigned: {selected.assigned_to || "Unassigned"}</div>
                <div className="meta">Priority: {selected.priority}</div>
                <div className="meta">Started: {selected.started_at || "—"}</div>
                <div className="meta">Last Opened: {selected.last_opened_at || "—"}</div>

                <button className="button" onClick={save}>
                  Save Evaluation
                </button>

                {selected.feedback && (
                  <div className="ai-box" style={{ marginTop: 16 }}>
                    <b>AI Feedback</b>
                    <div style={{ marginTop: 8 }}>{selected.feedback}</div>
                  </div>
                )}
              </>
            ) : (
              <div>No active task selected.</div>
            )}
          </div>

          <AnalyticsPanel items={items} />
          <ChartsPanel items={items} />
          <InsightsPanel items={items} />
          <Timeline item={selected} />
          <RunTaskManager
            runs={runs}
            reloadRuns={loadRuns}
            activeRunId={runId}
            reloadItems={loadItems}
          />
        </div>
      </div>
    </div>
  );
}
