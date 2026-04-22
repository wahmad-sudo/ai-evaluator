"use client";

export default function AnalyticsPanel({ items }) {

  const total = items.length;

  const completed = items.filter(i => i.task_status === "completed").length;
  const pending = items.filter(i => i.task_status === "pending").length;

  const scores = items.map(i => i.score || 0);
  const avg =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : 0;

  return (
    <div className="card">
      <h3>Analytics</h3>

      <p>Total Tasks: {total}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {pending}</p>
      <p>Avg Score: {avg}</p>
    </div>
  );
}
