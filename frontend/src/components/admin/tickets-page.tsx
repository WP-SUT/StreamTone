"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TicketCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { TicketTable, TicketFilterTabs } from "@/components/admin/ticket-table";
import { AdminEmptyState } from "@/components/admin/empty-state";
import { TableSkeleton } from "@/components/admin/skeleton";
import { useStaffGuard } from "@/hooks/use-staff-guard";
import { ticketService } from "@/services/ticket-service";
import type { Ticket, TicketStatus } from "@/types/models";

interface TicketsPageProps {
  basePath: "/admin/tickets" | "/support/tickets";
  allowedRoles: ("admin" | "support")[];
}

export function TicketsPageContent({ basePath, allowedRoles }: TicketsPageProps) {
  const { user, loading: authLoading } = useStaffGuard(...allowedRoles);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    ticketService.getAll().then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const counts = useMemo(() => {
    const all = tickets.length;
    const byStatus = (s: TicketStatus) =>
      tickets.filter((t) => t.status === s).length;
    return {
      all,
      open: byStatus("open"),
      in_progress: byStatus("in_progress"),
      resolved: byStatus("resolved"),
      closed: byStatus("closed"),
    };
  }, [tickets]);

  const filtered = useMemo(() => {
    if (filter === "all") return tickets;
    return tickets.filter((t) => t.status === filter);
  }, [tickets, filter]);

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
        title="Support Tickets"
        description="Manage and respond to user support requests"
      />

      <TicketFilterTabs active={filter} onChange={setFilter} counts={counts} />

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={TicketCheck}
          title="No tickets found"
          description={
            filter === "all"
              ? "There are no support tickets yet."
              : `No tickets with status "${filter.replace("_", " ")}".`
          }
        />
      ) : (
        <TicketTable
          tickets={filtered}
          getOpenerName={ticketService.getOpenerName}
          basePath={basePath}
        />
      )}
    </div>
  );
}

export function DashboardQuickLink({
  href,
  label,
  count,
}: {
  href: string;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
    >
      <span className="text-sm text-zinc-300">{label}</span>
      <span className="rounded-full bg-purple-600/20 px-2.5 py-0.5 text-sm font-semibold text-purple-400">
        {count}
      </span>
    </Link>
  );
}
