
import React, { memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TaskChart({ tasks = [] }) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const data = [
    { name: "Completed", value: completedCount },
    { name: "Pending", value: pendingCount },
  ];

  if (tasks.length === 0) {
    return (
      <div style={{ width: "100%", height: 100, textAlign: "center", paddingTop: "20px" }}>
        <h3>Task Status Overview</h3>
        <p>No tasks available to display chart.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>Task Status Overview</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
          >
            <Cell fill="#22c55e" />
            <Cell fill="#f59e0b" />
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(TaskChart);