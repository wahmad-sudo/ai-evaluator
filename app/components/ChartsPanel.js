"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function ChartsPanel({ items }) {
  const scoreData = [1, 2, 3, 4, 5].map((s) => ({
    score: `${s}★`,
    count: items.filter((i) => (i.score || 0) === s).length,
  }));

  const statusData = [
    { name: "Pending", value: items.filter((i) => i.task_status === "pending").length },
    { name: "In Progress", value: items.filter((i) => i.task_status === "in_progress").length },
    { name: "Completed", value: items.filter((i) => i.task_status === "completed").length },
  ];

  const COLORS = ["#f59e0b", "#2563eb", "#16a34a"];

  return (
    <div className="card">
      <h3>Analytics</h3>

      <div style={{ height: 260, marginTop: 12 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData}>
            <XAxis dataKey="score" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 260, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
