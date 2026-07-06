import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 py-16 px-6 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
        <Icon className="h-7 w-7 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-200">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
