"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { AdminEmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { notificationService } from "@/services/notification-service";
import type { AppNotification } from "@/types/models";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (uid: string) => {
    const data = await notificationService.getForUser(uid);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    const session = storage.session.get();
    if (!session) {
      router.push("/login");
      return;
    }
    setUserId(session.id);
    load(session.id);
  }, [router]);

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    if (userId) await load(userId);
  };

  const handleMarkAll = async () => {
    if (!userId) return;
    await notificationService.markAllAsRead(userId);
    toast.success("All notifications marked as read");
    await load(userId);
  };

  const handleDelete = async (id: string) => {
    await notificationService.delete(id);
    toast.success("Notification deleted");
    if (userId) await load(userId);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-md space-y-6 px-4 py-6 md:px-8">
      <PageHeader
        title="Notifications"
        description="Stay updated on tickets, verifications and account activity"
        action={
          items.some((n) => !n.isRead) ? (
            <Button variant="outline" size="sm" onClick={handleMarkAll}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <AdminEmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                n.isRead
                  ? "border-zinc-800 bg-zinc-900/30"
                  : "border-purple-500/30 bg-purple-500/5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{n.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{n.body}</p>
                  <p className="mt-2 text-xs text-zinc-600">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {n.linkUrl && (
                      <Link
                        href={n.linkUrl}
                        onClick={() => !n.isRead && handleMarkRead(n.id)}
                        className="text-sm text-purple-400 hover:underline"
                      >
                        View details
                      </Link>
                    )}
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-sm text-zinc-500 hover:text-zinc-300"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                  aria-label="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
