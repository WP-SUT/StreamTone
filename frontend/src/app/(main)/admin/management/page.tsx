"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatCardsSkeleton } from "@/components/admin/skeleton";
import { RevenueCharts } from "@/components/admin/revenue-charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStaffGuard } from "@/hooks/use-staff-guard";
import { revenueService } from "@/services/revenue-service";
import { settlementService } from "@/services/settlement-service";
import type { ArtistSettlement, RevenueOverview, SubscriptionPricing } from "@/types/models";
import { cn } from "@/lib/utils";

type Tab = "revenue" | "pricing" | "settlements";

export default function AdminManagementPage() {
  const { user, loading: authLoading } = useStaffGuard("admin");
  const [tab, setTab] = useState<Tab>("revenue");
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [pricing, setPricing] = useState<SubscriptionPricing | null>(null);
  const [settlements, setSettlements] = useState<ArtistSettlement[]>([]);
  const [silver, setSilver] = useState("");
  const [gold, setGold] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const load = async () => {
    const [ov, pr, st] = await Promise.all([
      revenueService.getOverview(),
      revenueService.getPricing(),
      settlementService.getAll(),
    ]);
    setOverview(ov);
    setPricing(pr);
    setSilver(String(pr.silverMonthly));
    setGold(String(pr.goldMonthly));
    setSettlements(st);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSavePricing = async () => {
    const s = Number(silver);
    const g = Number(gold);
    if (!s || !g || s <= 0 || g <= 0) {
      toast.error("Enter valid prices");
      return;
    }
    setSaving(true);
    try {
      const updated = await revenueService.updatePricing(s, g);
      setPricing(updated);
      toast.success("Prices updated across the platform");
    } finally {
      setSaving(false);
    }
  };

  const handleSettle = async (id: string) => {
    setSettlingId(id);
    try {
      await settlementService.markSettled(id);
      toast.success("Payment marked as settled");
      await load();
    } finally {
      setSettlingId(null);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "revenue", label: "Revenue" },
    { key: "pricing", label: "Pricing" },
    { key: "settlements", label: "Settlements" },
  ];

  if (authLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6 md:px-8">
      <PageHeader
        title="Management"
        description="Revenue analytics, subscription pricing and artist settlements"
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-purple-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <StatCardsSkeleton count={3} />
      ) : (
        <>
          {tab === "revenue" && overview && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Total Revenue"
                  value={revenueService.formatCurrency(overview.totalRevenue)}
                  icon={DollarSign}
                />
                <StatCard
                  label="This Month"
                  value={revenueService.formatCurrency(overview.monthlyRevenue)}
                  icon={TrendingUp}
                  variant="success"
                />
                <StatCard
                  label="Paid Subscribers"
                  value={
                    overview.subscriptionBreakdown.silver +
                    overview.subscriptionBreakdown.gold
                  }
                  icon={Users}
                />
              </div>
              <RevenueCharts data={overview} />
            </div>
          )}

          {tab === "pricing" && pricing && (
            <div className="max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <p className="text-sm text-zinc-400">
                Last updated: {new Date(pricing.updatedAt).toLocaleString()}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Silver (monthly, Toman)
                  </label>
                  <Input
                    type="number"
                    value={silver}
                    onChange={(e) => setSilver(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-zinc-400">
                    Gold (monthly, Toman)
                  </label>
                  <Input
                    type="number"
                    value={gold}
                    onChange={(e) => setGold(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <Button onClick={handleSavePricing} disabled={saving} className="w-full">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update Prices"
                  )}
                </Button>
              </div>
            </div>
          )}

          {tab === "settlements" && (
            <div className="overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
                    <th className="px-4 py-3">Artist</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Listeners</th>
                    <th className="px-4 py-3">Streams</th>
                    <th className="px-4 py-3">Reward</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-zinc-800/50 last:border-0"
                    >
                      <td className="px-4 py-3 text-white">{s.artistName}</td>
                      <td className="px-4 py-3 text-zinc-400">{s.month}</td>
                      <td className="px-4 py-3 text-zinc-400">
                        {s.uniqueListeners.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {s.totalStreams.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {revenueService.formatCurrency(s.rewardAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={
                            s.paymentStatus === "settled"
                              ? "border-emerald-500/30 text-emerald-400"
                              : "border-amber-500/30 text-amber-400"
                          }
                        >
                          {s.paymentStatus === "settled" ? "Settled" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {s.paymentStatus === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSettle(s.id)}
                            disabled={settlingId === s.id}
                          >
                            {settlingId === s.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Confirm"
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
