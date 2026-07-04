import { TicketDetailContent } from "@/components/admin/ticket-detail";

export default function AdminTicketDetailPage() {
  return (
    <TicketDetailContent
      backHref="/admin/tickets"
      allowedRoles={["admin"]}
    />
  );
}
