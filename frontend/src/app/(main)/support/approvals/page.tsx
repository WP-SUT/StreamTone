import { ApprovalsContent } from "@/components/admin/approvals-content";

export default function SupportApprovalsPage() {
  return <ApprovalsContent allowedRoles={["support"]} />;
}
