"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TicketCheck,
  Clock,
  CheckCircle,
  Users,
  Music,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatCardsSkeleton } from "@/components/admin/skeleton";
import { DashboardQuickLink } from "@/components/admin/tickets-page";
import { useStaffGuard } from "@/hooks/use-staff-guard";
import { adminService } from "@/services/admin-service";
import type { DashboardStats } from "@/services/admin-service";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useStaffGuard("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (authLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-6 md:px-8">
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome back, ${user.displayName}`}
        action={
          <Link
            href="/admin/tickets"
            className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
          >
            View Tickets
          </Link>
        }
      />

      {loading || !stats ? (
        <StatCardsSkeleton count={6} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Open Tickets"
            value={stats.openTickets}
            icon={TicketCheck}
            variant="warning"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgressTickets}
            icon={Clock}
          />
          <StatCard
            label="Resolved"
            value={stats.resolvedTickets}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            label="Pending Artists"
            value={stats.pendingArtists}
            icon={UserCheck}
            variant="warning"
          />
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={Users}
          />
          <StatCard
            label="Total Artists"
            value={stats.totalArtists}
            icon={Music}
          />
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardQuickLink
            href="/admin/tickets"
            label="Open tickets"
            count={stats?.openTickets ?? 0}
          />
          <DashboardQuickLink
            href="/admin/approvals"
            label="Pending artist approvals"
            count={stats?.pendingArtists ?? 0}
          />
          <DashboardQuickLink
            href="/admin/management"
            label="Revenue & subscriptions"
            count={0}
          />
        </div>
      </section>
    </div>
  );
}
