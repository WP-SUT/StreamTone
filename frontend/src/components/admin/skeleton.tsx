import { cn } from "@/lib/utils";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 flex-1 animate-pulse rounded bg-zinc-800" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-zinc-800/50 px-4 py-4 last:border-0"
        >
          {[1, 2, 3, 4, 5].map((j) => (
            <div
              key={j}
              className={cn(
                "h-4 animate-pulse rounded bg-zinc-800/80",
                j === 1 ? "w-16" : "flex-1"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
        />
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[true, false, true, false].map((isStaff, i) => (
        <div
          key={i}
          className={cn("flex", isStaff ? "justify-end" : "justify-start")}
        >
          <div
            className={cn(
              "h-16 w-2/3 max-w-md animate-pulse rounded-2xl bg-zinc-800",
              isStaff ? "rounded-br-sm" : "rounded-bl-sm"
            )}
          />
        </div>
      ))}
    </div>
  );
}
