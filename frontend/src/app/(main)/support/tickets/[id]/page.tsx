import { TicketDetailContent } from "@/components/admin/ticket-detail";

export default function SupportTicketDetailPage() {
  return (
    <TicketDetailContent
      backHref="/support/tickets"
      allowedRoles={["support"]}
    />
  );
}
