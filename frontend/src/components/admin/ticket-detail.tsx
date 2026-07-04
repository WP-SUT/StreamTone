"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { TicketStatusBadge } from "@/components/admin/ticket-status-badge";
import { TicketChat } from "@/components/admin/ticket-chat";
import { ChatSkeleton } from "@/components/admin/skeleton";
import { Button } from "@/components/ui/button";
import { useStaffGuard } from "@/hooks/use-staff-guard";
import { ticketService } from "@/services/ticket-service";
import { storage } from "@/lib/storage";
import type { Ticket, TicketStatus, UserRole } from "@/types/models";

interface TicketDetailProps {
  backHref: string;
  allowedRoles: ("admin" | "support")[];
}

export function TicketDetailContent({ backHref, allowedRoles }: TicketDetailProps) {
  const params = useParams();
  const ticketId = params.id as string;
  const { user, loading: authLoading } = useStaffGuard(...allowedRoles);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTicket = useCallback(async () => {
    const data = await ticketService.getById(ticketId);
    setTicket(data ?? null);
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const getSenderName = (id: string, role: UserRole) => {
    if (role === "support" || role === "admin") {
      const staff = storage.staff.findById(id);
      return staff?.displayName ?? "Staff";
    }
    return ticketService.getOpenerName(id);
  };

  const handleSendMessage = async (body: string) => {
    if (!user || !ticket) return;
    await ticketService.sendMessage(ticket.id, user.id, user.role, body);
    await loadTicket();
    toast.success("Message sent");
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket) return;
    await ticketService.updateStatus(ticket.id, status);
    await loadTicket();
    toast.success(`Ticket marked as ${status.replace("_", " ")}`);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-lg space-y-6 px-4 py-6 md:px-8">
        <ChatSkeleton />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-screen-lg px-4 py-6 md:px-8">
        <p className="text-zinc-400">Ticket not found.</p>
        <Link href={backHref} className="mt-4 text-purple-400 hover:underline">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-lg space-y-6 px-4 py-6 md:px-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tickets
      </Link>

      <PageHeader
        title={ticket.subject}
        description={`Opened by ${ticketService.getOpenerName(ticket.openedById)} · ${ticket.id}`}
        action={<TicketStatusBadge status={ticket.status} />}
      />

      {ticket.status !== "closed" && (
        <div className="flex flex-wrap gap-2">
          {ticket.status !== "resolved" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("resolved")}
            >
              <CheckCircle className="mr-1.5 h-4 w-4" />
              Mark Resolved
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("closed")}
          >
            <XCircle className="mr-1.5 h-4 w-4" />
            Close Ticket
          </Button>
        </div>
      )}

      <TicketChat
        ticket={ticket}
        currentUserId={user.id}
        currentUserRole={user.role}
        getSenderName={getSenderName}
        onSendMessage={handleSendMessage}
        disabled={ticket.status === "closed"}
      />
    </div>
  );
}
