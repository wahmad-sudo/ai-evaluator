"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  activeRunId: string;
  reloadRuns: () => Promise<void>;
  reloadItems: () => Promise<void>;
}

export function EvaluatorRunTaskManager({ activeRunId, reloadRuns, reloadItems }: Props) {
  const [runName, setRunName] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly" | "custom">("daily");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");

  async function createRun() {
    if (!runName.trim()) return;
    await supabase.from("runs").insert({
      name: runName,
      cadence,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
      status: "active",
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
      task_status: "pending",
    });
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    await reloadItems();
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500";
  const btnClass = "mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-5">
      <div className="text-sm font-semibold text-white">Run & Task Management</div>

      <div className="space-y-2">
        <div className="text-xs text-zinc-400 font-medium">Create a Run</div>
        <input className={inputClass} placeholder="Run name" value={runName} onChange={(e) => setRunName(e.target.value)} />
        <select className={inputClass} value={cadence} onChange={(e) => setCadence(e.target.value as typeof cadence)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>
        <button className={btnClass} onClick={createRun}>Create Run</button>
      </div>

      <div className="border-t border-zinc-800 pt-4 space-y-2">
        <div className="text-xs text-zinc-400 font-medium">Create Task (active run)</div>
        <input className={inputClass} placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        <textarea className={inputClass} placeholder="Description" rows={3} value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
        <select className={inputClass} value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as typeof taskPriority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className={btnClass} onClick={createTask}>Create Task</button>
      </div>
    </div>
  );
}
