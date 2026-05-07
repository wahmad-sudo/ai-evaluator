"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import type { EvaluatorItem } from "@/types/evaluator";

const PIE_COLORS = ["#f59e0b", "#2563eb", "#16a34a"];

export function EvaluatorChartsPanel({ items }: { items: EvaluatorItem[] }) {
  const scoreData = [1, 2, 3, 4, 5].map((s) => ({
    score: `${s}★`,
    count: items.filter((i) => (i.score ?? 0) === s).length,
  }));

  const statusData = [
    { name: "Pending", value: items.filter((i) => i.task_status === "pending").length },
    { name: "In Progress", value: items.filter((i) => i.task_status === "in_progress").length },
    { name: "Completed", value: items.filter((i) => i.task_status === "completed").length },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="text-sm font-semibold text-white">Score Distribution</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData}>
            <XAxis dataKey="score" stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff" }} />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm font-semibold text-white">Status Breakdown</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
              {statusData.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
