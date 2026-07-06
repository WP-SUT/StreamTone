"use client";

import { useRouter } from "next/navigation";
import type { Ticket } from "@/types/models";
import { TicketStatusBadge } from "@/components/admin/ticket-status-badge";
import { cn } from "@/lib/utils";

interface TicketTableProps {
  tickets: Ticket[];
  getOpenerName: (id: string) => string;
  basePath: "/admin/tickets" | "/support/tickets";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const categoryLabels: Record<Ticket["category"], string> = {
  technical: "Technical",
  billing: "Billing",
  content: "Content",
  other: "Other",
};

export function TicketTable({ tickets, getOpenerName, basePath }: TicketTableProps) {
  const router = useRouter();

  const openTicket = (id: string) => {
    router.push(`${basePath}/${id}`);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Subject</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              onClick={() => openTicket(ticket.id)}
              className="cursor-pointer border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/60 last:border-0"
            >
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                {ticket.id}
              </td>
              <td className="px-4 py-3 text-zinc-300">
                {getOpenerName(ticket.openedById)}
              </td>
              <td className="px-4 py-3 font-medium text-white">
                {ticket.subject}
              </td>
              <td className="px-4 py-3 text-zinc-400">
                {categoryLabels[ticket.category]}
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {formatDate(ticket.createdAt)}
              </td>
              <td className="px-4 py-3">
                <TicketStatusBadge status={ticket.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TicketFilterTabs({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (value: string) => void;
  counts: Record<string, number>;
}) {
  const tabs = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "in_progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            active === tab.key
              ? "bg-purple-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          )}
        >
          {tab.label}
          <span className="ml-1.5 text-xs opacity-70">({counts[tab.key] ?? 0})</span>
        </button>
      ))}
    </div>
  );
}
