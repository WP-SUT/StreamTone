import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "warning" | "success";
  className?: string;
}

const variantStyles = {
  default: "bg-zinc-900 border-zinc-800 text-purple-400",
  warning: "bg-zinc-900 border-zinc-800 text-amber-400",
  success: "bg-zinc-900 border-zinc-800 text-emerald-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors hover:border-zinc-700",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-zinc-500">{trend}</p>
          )}
        </div>
        <div className="rounded-xl bg-zinc-800 p-2.5">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
