import { TicketsPageContent } from "@/components/admin/tickets-page";

export default function AdminTicketsPage() {
  return (
    <TicketsPageContent
      basePath="/admin/tickets"
      allowedRoles={["admin"]}
    />
  );
}
