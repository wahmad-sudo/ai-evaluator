"use client";

type Filter = "all" | "pending" | "completed" | "high";

export function EvaluatorFilterBar({ setFilter }: { setFilter: (f: Filter) => void }) {
  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Not Started", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "High Priority", value: "high" },
  ];

  return (
    <div className="flex gap-2 mb-5">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
