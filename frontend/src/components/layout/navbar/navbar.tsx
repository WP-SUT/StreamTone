"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { authService } from "@/services/auth-service";
import { notificationService } from "@/services/notification-service";
import { UserRole } from "@/types/models";
import type { AppNotification } from "@/types/models";

interface NavbarProps {
  user?: {
    id: string;
    displayName: string;
    imageUrl?: string;
    role: UserRole;
  };
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    notificationService.getForUser(user.id).then(setNotifications);
    notificationService.getUnreadCount(user.id).then(setUnreadCount);
  }, [user?.id, notifOpen]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  const profileHref =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "support"
        ? "/support/dashboard"
        : "/profile";

  const handleNotifClick = async (n: AppNotification) => {
    if (!n.isRead) await notificationService.markAsRead(n.id);
    setNotifOpen(false);
    if (n.href) router.push(n.href);
  };

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 flex items-center px-4 md:px-6 gap-3">
      <div className="flex-1" />
      <div className="flex items-center gap-1 sm:gap-3">
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((p) => !p);
              setDropdownOpen(false);
            }}
            className="relative p-2 rounded-full hover:bg-zinc-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-black">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Notifications
                  </p>
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-zinc-500">
                    No notifications
                  </p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`w-full px-4 py-3 text-left text-sm transition rounded-lg mx-1 max-w-[calc(100%-0.5rem)] ${
                        n.isRead
                          ? "text-zinc-400 hover:bg-zinc-700"
                          : "text-zinc-200 bg-purple-500/10 hover:bg-zinc-700"
                      }`}
                    >
                      <p className="font-medium truncate">{n.title}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{n.body}</p>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen((p) => !p);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-800 transition"
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <span className="text-sm text-zinc-200 hidden sm:block max-w-[120px] truncate">
              {user?.displayName ?? "Guest"}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl py-1 z-50">
                <Link
                  href={profileHref}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition rounded-lg mx-1"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition rounded-lg mx-1"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <hr className="border-zinc-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300 transition rounded-lg mx-1"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
