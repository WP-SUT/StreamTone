import { ApprovalsContent } from "@/components/admin/approvals-content";

export default function AdminApprovalsPage() {
  return <ApprovalsContent allowedRoles={["admin"]} />;
}
