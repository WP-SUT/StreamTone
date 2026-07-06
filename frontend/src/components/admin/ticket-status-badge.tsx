import type { TicketStatus } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  closed: {
    label: "Closed",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

export function TicketStatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
