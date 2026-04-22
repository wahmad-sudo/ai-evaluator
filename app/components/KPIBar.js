"use client";

export default function KPIBar({ items }) {

  const total = items.length;
  const completed = items.filter(i => i.task_status === "completed").length;
  const pending = items.filter(i => i.task_status === "pending").length;

  const avg =
    items.length > 0
      ? (items.reduce((a,b)=>a+(b.score||0),0)/items.length).toFixed(2)
      : "0.00";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16,
      marginBottom: 20
    }}>

      <div className="card"><b>Total</b><br/>{total}</div>
      <div className="card"><b>Completed</b><br/>{completed}</div>
      <div className="card"><b>Pending</b><br/>{pending}</div>
      <div className="card"><b>Avg Score</b><br/>{avg}</div>

    </div>
  );
}
