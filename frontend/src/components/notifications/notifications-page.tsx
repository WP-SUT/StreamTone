"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Check, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { storage } from "@/lib/storage";
import type { AppNotification, Artist, User, StaffUser } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function sortByDateDesc(a: AppNotification, b: AppNotification) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export default function NotificationsPage() {
  const session = storage.session.get() as User | Artist | StaffUser | null;

  const [items, setItems] = useState<AppNotification[]>(() => {
    if (!session) return [];
    const role = session.role as User["role"] | Artist["role"] | StaffUser["role"]; 
    if (role !== "listener" && role !== "artist" && role !== "support" && role !== "admin") return [];
    return storage.notifications.findByRecipient(role, session.id).sort(sortByDateDesc);
  });

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  const isListener = session?.role === "listener";
  const isArtist = session?.role === "artist";
  const isStaff = session?.role === "support" || session?.role === "admin";

  type Filter =
    | "all"
    | "unread"
    | "subscription"
    | "releases"
    | "approval"
    | "payouts"
    | "tickets"
    | "verifications";

  const [filter, setFilter] = useState<Filter>("all");

  const predicateByFilter: Record<Filter, (n: AppNotification) => boolean> = {
    all: () => true,
    unread: (n) => !n.isRead,
    subscription: (n) => n.kind === "subscription_expiry",
    releases: (n) => n.kind === "new_release",
    approval: (n) => n.kind === "artist_approval",
    payouts: (n) => n.kind === "monthly_payout",
    tickets: (n) => n.kind === "new_ticket",
    verifications: (n) => n.kind === "new_verification_request",
  };

  const filtered = useMemo(() => items.filter(predicateByFilter[filter]), [items, filter]);

  const countFor = (f: Filter) => items.filter(predicateByFilter[f]).length;

  const kindLabel = (kind: AppNotification["kind"]) => {
    if (kind === "subscription_expiry") return "Subscription";
    if (kind === "new_release") return "New release";
    if (kind === "artist_approval") return "Artist approval";
    if (kind === "monthly_payout") return "Monthly payout";
    if (kind === "new_ticket") return "New ticket";
    if (kind === "new_verification_request") return "Verification request";
    return "General";
  };

  const handleMarkRead = (id: string) => {
    storage.notifications.markAsRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleDelete = (id: string) => {
    storage.notifications.remove(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const handleReadAll = () => {
    if (!session) return;
    const role = session.role as "listener" | "artist" | "support" | "admin";
    if (role !== "listener" && role !== "artist" && role !== "support" && role !== "admin") return;
    storage.notifications.markAllAsReadForRecipient(role, session.id);
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  if (
    !session ||
    (session.role !== "listener" && session.role !== "artist" && session.role !== "support" && session.role !== "admin")
  ) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Notifications unavailable</CardTitle>
            <CardDescription>You need to log in with a listener, artist, support, or admin account.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(isListener || isArtist || isStaff) && (
              <div className="hidden sm:flex items-center gap-1 rounded-3xl bg-zinc-800/60 p-1">
                {(
                  (
                    isListener
                      ? (["all", "unread", "subscription", "releases"]) 
                      : isArtist
                        ? (["all", "unread", "approval", "payouts"]) 
                        : (["all", "unread", "tickets", "verifications"]) 
                  ) as Filter[]
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs rounded-3xl transition ${
                      filter === f ? "bg-zinc-700 text-white" : "text-zinc-300 hover:text-white"
                    }`}
                    aria-pressed={filter === f}
                  >
                    {f === "all" && "All"}
                    {f === "unread" && "Unread"}
                    {f === "subscription" && "Subscription"}
                    {f === "releases" && "Releases"}
                    {f === "approval" && "Approvals"}
                    {f === "payouts" && "Payouts"}
                    {f === "tickets" && "Tickets"}
                    {f === "verifications" && "Verifications"} ({countFor(f)})
                  </button>
                ))}
              </div>
            )}
            <Button variant="outline" onClick={handleReadAll} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
          </div>
        </CardHeader>
      </Card>

      {filtered.length === 0 ? (
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle>No notifications</CardTitle>
            <CardDescription>We will let you know when something new arrives.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={
                n.isRead
                  ? "border border-zinc-800 bg-zinc-900/60"
                  : "border border-blue-500/30 bg-blue-500/5"
              }
            >
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {!n.isRead && <span className="mt-1.5 inline-block size-2 rounded-full bg-blue-500" />}
                  <div>
                    <CardTitle className="text-base">{n.title}</CardTitle>
                    <CardDescription>
                      <span className="mr-2 text-xs text-zinc-400">{new Date(n.createdAt).toLocaleString()}</span>
                      {n.body}
                    </CardDescription>
                    <div className="mt-2">
                      <Badge variant="outline">{kindLabel(n.kind)}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkRead(n.id)}>
                      <Check className="mr-1 size-4" /> Read
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(n.id)}>
                    <Trash2 className="mr-1 size-4" /> Delete
                  </Button>
                </div>
              </CardHeader>
              {n.linkUrl && (
                <CardContent>
                  <Link
                    href={n.linkUrl}
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:underline"
                  >
                    {n.linkLabel ?? (n.kind === "new_release" ? "Open release" : "Open")} <ExternalLink className="size-3.5" />
                  </Link>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
