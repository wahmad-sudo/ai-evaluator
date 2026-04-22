"use client";

export default function Timeline({ item }) {

  if (!item) return null;

  return (
    <div className="card">

      <h3>Activity</h3>

      <p>Started: {item.started_at || "—"}</p>
      <p>Completed: {item.ended_at || "—"}</p>
      <p>Opened: {item.open_count}</p>
      <p>Reopened: {item.reopen_count}</p>

    </div>
  );
}
