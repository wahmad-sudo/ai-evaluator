"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RunTaskManager({ runs, reloadRuns, activeRunId, reloadItems }) {
  const [runName, setRunName] = useState("");
  const [cadence, setCadence] = useState("daily");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");

  async function createRun() {
    if (!runName.trim()) return;

    await supabase.from("runs").insert({
      name: runName,
      cadence,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      status: "active"
    });

    setRunName("");
    await reloadRuns();
  }

  async function createTask() {
    if (!activeRunId || !taskTitle.trim()) return;

    await supabase.from("items").insert({
      run_id: activeRunId,
      title: taskTitle,
      description: taskDescription,
      priority: taskPriority,
      task_status: "pending"
    });

    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    await reloadItems();
  }

  return (
    <div className="card">
      <h3>Run & Task Management</h3>

      <div className="ai-box" style={{ marginTop: 12 }}>
        <div><b>Create a Run</b></div>
        <input
          placeholder="Run name"
          value={runName}
          onChange={(e) => setRunName(e.target.value)}
          style={{ width: "100%", marginTop: 8, padding: 10 }}
        />
        <select
          value={cadence}
          onChange={(e) => setCadence(e.target.value)}
          style={{ width: "100%", marginTop: 8, padding: 10 }}
        >
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="custom">custom</option>
        </select>
        <button className="button" onClick={createRun}>Create Run</button>
      </div>

      <div className="ai-box" style={{ marginTop: 16 }}>
        <div><b>Create a Task under active run</b></div>
        <input
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={{ width: "100%", marginTop: 8, padding: 10 }}
        />
        <textarea
          placeholder="Task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          style={{ width: "100%", marginTop: 8, padding: 10, minHeight: 80 }}
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          style={{ width: "100%", marginTop: 8, padding: 10 }}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button className="button" onClick={createTask}>Create Task</button>
      </div>
    </div>
  );
}
