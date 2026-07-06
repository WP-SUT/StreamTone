import { TicketsPageContent } from "@/components/admin/tickets-page";

export default function SupportTicketsPage() {
  return (
    <TicketsPageContent
      basePath="/support/tickets"
      allowedRoles={["support"]}
    />
  );
}
