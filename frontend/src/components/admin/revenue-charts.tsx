"use client";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import type { RevenueOverview } from "@/types/models";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#a1a1aa" },
    },
  },
  scales: {
    x: {
      ticks: { color: "#a1a1aa" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
    y: {
      ticks: { color: "#a1a1aa" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
};

export function RevenueCharts({ data }: { data: RevenueOverview }) {
  const pieData = {
    labels: ["Free", "Silver", "Gold"],
    datasets: [
      {
        data: [
          data.subscriptionBreakdown.free,
          data.subscriptionBreakdown.silver,
          data.subscriptionBreakdown.gold,
        ],
        backgroundColor: ["#52525b", "#a78bfa", "#fbbf24"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: data.monthlyTrend.map((m) => m.month),
    datasets: [
      {
        label: "Revenue (Toman)",
        data: data.monthlyTrend.map((m) => m.revenue),
        backgroundColor: "#9333ea",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-medium text-zinc-400">Subscription Distribution</h3>
        <div className="h-64">
          <Pie data={pieData} options={{ ...chartOptions, scales: undefined }} />
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-medium text-zinc-400">Monthly Revenue</h3>
        <div className="h-64">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
