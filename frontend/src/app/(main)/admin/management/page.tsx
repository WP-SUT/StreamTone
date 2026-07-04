"use client";

import { Construction } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AdminEmptyState } from "@/components/admin/empty-state";
import { useStaffGuard } from "@/hooks/use-staff-guard";

export default function AdminManagementPlaceholder() {
  const { user, loading } = useStaffGuard("admin");

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 md:px-8">
      <PageHeader
        title="Revenue & Subscriptions"
        description="Manage pricing, revenue analytics and platform settings"
      />
      <AdminEmptyState
        icon={Construction}
        title="Coming in Day 3"
        description="Subscription pricing, revenue charts and admin settings will be implemented next."
        className="mt-8"
      />
    </div>
  );
}
