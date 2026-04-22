export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">AI Evaluator</h1>
        <p className="text-gray-500">Enterprise Evaluation Platform</p>

        <div className="flex gap-4 justify-center">
          <a href="/evaluate">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Open Evaluator
            </button>
          </a>

          <a href="/dashboard">
            <button className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
              Dashboard
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
