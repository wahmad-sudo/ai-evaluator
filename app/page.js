export default function Home() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>AI Evaluator</h1>
      <p>Working evaluation platform</p>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <a href="/evaluate">
          <button>Open Evaluator</button>
        </a>

        <a href="/dashboard">
          <button>Open Dashboard</button>
        </a>
      </div>
    </div>
  );
}
