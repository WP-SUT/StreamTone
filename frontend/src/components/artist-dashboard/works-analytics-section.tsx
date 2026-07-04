"use client";

import { BarChart3, DollarSign, Headphones, TrendingUp } from "lucide-react";

import type { WorkMetricRow } from "@/components/artist-dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WorksAnalyticsSectionProps {
  rows: WorkMetricRow[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function WorksAnalyticsSection({ rows }: WorksAnalyticsSectionProps) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.streams += row.streams;
      acc.listeners += row.listeners;
      acc.revenue += row.revenue;
      return acc;
    },
    { streams: 0, listeners: 0, revenue: 0 }
  );

  const sortedRows = [...rows].sort((a, b) => b.streams - a.streams);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Headphones className="size-4" /> Total Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totals.streams.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4" /> Unique Listeners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totals.listeners.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="size-4" /> Estimated Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(totals.revenue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-4" /> Work Performance
          </CardTitle>
          <CardDescription>
            Detailed metrics for each released item (single, album, or track), sorted by stream count.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analytics yet. Publish a release to get started.</p>
          ) : (
            <div className="space-y-3">
              {sortedRows.map((row, index) => (
                <div key={row.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">#{index + 1} • {row.title}</p>
                      <Badge variant="outline" className="mt-1">{row.type}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{row.streams.toLocaleString()} streams</p>
                      <p className="text-xs text-muted-foreground">{row.listeners.toLocaleString()} listeners • {formatCurrency(row.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
