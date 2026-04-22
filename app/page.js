export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white border-b px-8 py-4 flex justify-between">
        <h1 className="font-semibold text-lg">VectorTechSol Platform</h1>
        <span>👤 Waqar</span>
      </div>

      <div className="px-8 py-6 grid grid-cols-3 gap-6">

        <a href="/evaluate" className="bg-white p-6 rounded-xl shadow border hover:shadow-md">
          <h2 className="text-lg font-semibold">🧠 Evaluator</h2>
          <p className="text-sm text-gray-500">Evaluate tasks</p>
        </a>

        <a href="/dashboard" className="bg-white p-6 rounded-xl shadow border hover:shadow-md">
          <h2 className="text-lg font-semibold">📊 Dashboard</h2>
          <p className="text-sm text-gray-500">Analytics</p>
        </a>

        <a href="/runs" className="bg-white p-6 rounded-xl shadow border hover:shadow-md">
          <h2 className="text-lg font-semibold">📅 Runs</h2>
          <p className="text-sm text-gray-500">Manage runs</p>
        </a>

      </div>

    </div>
  );
}
