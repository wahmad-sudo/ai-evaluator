"use client";

export default function InsightsPanel({ items }) {
  const highPending = items.filter(
    (i) => i.priority === "high" && i.task_status === "pending"
  );

  const completed = items.filter((i) => i.task_status === "completed");
  const avgScore =
    completed.length > 0
      ? (
          completed.reduce((sum, i) => sum + (i.score || 0), 0) / completed.length
        ).toFixed(2)
      : "0.00";

  const lowScoreTasks = completed.filter((i) => (i.score || 0) <= 2);

  function getFeedback(item) {
    const score = item.score || 0;
    if (score >= 4) return "Strong response quality. Keep tone and clarity consistent.";
    if (score === 3) return "Decent response, but it may need stronger actionability or precision.";
    return "Weak response. Consider improving empathy, specificity, and resolution steps.";
  }

  return (
    <div className="card">
      <h3>AI Insights & Alerts</h3>

      <div style={{ marginTop: 12 }}>
        <p><b>Average completed score:</b> {avgScore}</p>
        <p><b>High-priority pending tasks:</b> {highPending.length}</p>
        <p><b>Low-score completed tasks:</b> {lowScoreTasks.length}</p>
      </div>

      <div style={{ marginTop: 14 }}>
        <h4 style={{ marginBottom: 8 }}>Alerts</h4>
        {highPending.length === 0 ? (
          <div className="sub">No critical pending alerts.</div>
        ) : (
          highPending.slice(0, 5).map((i) => (
            <div key={i.id} className="ai-box" style={{ marginBottom: 8 }}>
              <b>High Priority Pending:</b> {i.title}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <h4 style={{ marginBottom: 8 }}>Per-task AI Feedback</h4>
        {lowScoreTasks.length === 0 ? (
          <div className="sub">No low-score completed tasks yet.</div>
        ) : (
          lowScoreTasks.slice(0, 5).map((i) => (
            <div key={i.id} className="ai-box" style={{ marginBottom: 8 }}>
              <div><b>{i.title}</b></div>
              <div>{getFeedback(i)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
