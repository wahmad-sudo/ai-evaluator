export default function Home() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <div className="brand-title">VectorTechSol</div>
            <div className="brand-sub">
              123 Enterprise Drive • Frisco, TX • ops@vectortechsol.com • +1 (555) 210-8899
            </div>
          </div>

          <div className="top-meta">
            <div className="top-pill">👤 Waqar Ahmad</div>
            <div className="top-pill">Organization: VectorTechSol</div>
            <div className="top-pill">Signed in • Enterprise Workspace</div>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="panel panel-pad">
            <h1 className="panel-title">Evaluation Operations Control Panel</h1>
            <div className="panel-sub">
              Manage daily runs, score evaluation tasks, review activity, and monitor enterprise summaries from one workspace.
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Workspace</div>
                <div className="kpi-value">1</div>
                <div className="kpi-note">Enterprise org connected</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Evaluator</div>
                <div className="kpi-value">Waqar</div>
                <div className="kpi-note">Primary reviewer active</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Mode</div>
                <div className="kpi-value">Live</div>
                <div className="kpi-note">Production deployment active</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Status</div>
                <div className="kpi-value">Ready</div>
                <div className="kpi-note">Use evaluator, dashboard, and runs below</div>
              </div>
            </div>
          </div>

          <div className="panel panel-pad">
            <h2 className="section-title">Message Center</h2>
            <div className="message-list">
              <div className="message-item">
                <div className="message-meta">System</div>
                <div>Evaluator deployment is active and ready for scoring tasks.</div>
              </div>
              <div className="message-item">
                <div className="message-meta">Ops Note</div>
                <div>Use the Runs page to manage daily, weekly, and custom backlog groupings.</div>
              </div>
              <div className="message-item">
                <div className="message-meta">Reminder</div>
                <div>Dashboard summarizes score mix, activity, and run-level health.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="nav-card-grid">
          <a href="/evaluate" className="nav-card">
            <div className="nav-icon">🧠</div>
            <div className="nav-title">Evaluator</div>
            <div className="nav-sub">
              Score all cards under the active run, review completion status, and track activity in real time.
            </div>
          </a>

          <a href="/dashboard" className="nav-card">
            <div className="nav-icon">📊</div>
            <div className="nav-title">Dashboard</div>
            <div className="nav-sub">
              Review executive widgets, score distribution, activity, alerts, and run summary panels.
            </div>
          </a>

          <a href="/runs" className="nav-card">
            <div className="nav-icon">📅</div>
            <div className="nav-title">Runs</div>
            <div className="nav-sub">
              Create and manage daily, weekly, and custom backlog runs for organized evaluation workflows.
            </div>
          </a>
        </section>

        <div className="footer-note">
          Enterprise Evaluator Workspace • White theme • Dense layout • Run-aware workflow
        </div>
      </main>
    </div>
  );
}
