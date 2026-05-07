"use client";

interface Props {
  queries: string[];
  label?: string;
}

export function SniperQueryPreview({ queries, label = "Queries" }: Props) {
  if (!queries.length) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs text-zinc-500">{label}</p>
      {queries.map((q, i) => (
        <div key={i} className="text-xs font-mono text-zinc-300 bg-zinc-900 rounded px-2 py-1 truncate">{q}</div>
      ))}
    </div>
  );
}
