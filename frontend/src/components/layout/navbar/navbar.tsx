"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { UserRole } from "@/types/models";
import { storage } from "@/lib/storage";

interface NavbarProps {
  user?: {
    displayName: string;
    imageUrl?: string;
    role: UserRole;
  };
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Clear session in our storage as well
    try { storage.session.clear(); } catch {}
    router.push("/login");
  };

  useEffect(() => {
    // compute unread count from storage session
    const session = storage.session.get() as any;
    if (session && ["listener", "artist", "support", "admin"].includes(session.role)) {
      try {
        const list = storage.notifications.findByRecipient(session.role, session.id);
        setUnreadCount(list.filter((n) => !n.isRead).length);
      } catch {
        setUnreadCount(0);
      }
    } else {
      setUnreadCount(0);
    }
  }, []);

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 flex items-center px-4 md:px-6 gap-3">

      {/* ── Spacer ──────────────────────────────── */}
      <div className="flex-1" />
      <div className="flex items-center gap-1 sm:gap-3">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(false); router.push("/notifications"); }}
            className="relative p-2 rounded-full hover:bg-zinc-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen((p) => !p); }}
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
            {/* Name + chevron hidden on very small screens */}
            <span className="text-sm text-zinc-200 hidden sm:block max-w-[120px] truncate">
              {user?.displayName ?? "Guest"}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl py-1 z-50">
                <Link
                  href="/profile"
                onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition rounded-lg mx-1"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition rounded-lg mx-1"
                >
                  <Bell className="w-4 h-4" />
                  Notifications
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
