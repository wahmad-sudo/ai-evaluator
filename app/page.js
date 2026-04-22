export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-[#020617]">
        <h1 className="font-semibold">VectorTechSol Dashboard</h1>
        <span>👤 Waqar</span>
      </div>

      <div className="p-6 grid grid-cols-3 gap-4">

        <a href="/evaluate" className="bg-[#020617] p-6 rounded border border-gray-700 hover:bg-gray-800">
          <h2 className="text-lg">🧠 Evaluator</h2>
          <p className="text-xs text-gray-400">Score tasks</p>
        </a>

        <a href="/dashboard" className="bg-[#020617] p-6 rounded border border-gray-700 hover:bg-gray-800">
          <h2 className="text-lg">📊 Dashboard</h2>
          <p className="text-xs text-gray-400">Analytics</p>
        </a>

        <a href="/runs" className="bg-[#020617] p-6 rounded border border-gray-700 hover:bg-gray-800">
          <h2 className="text-lg">📅 Runs</h2>
          <p className="text-xs text-gray-400">Manage backlog</p>
        </a>

      </div>

    </div>
  );
}
