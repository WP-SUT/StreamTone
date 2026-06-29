// src/components/layout/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  user?: {
    displayName: string;
    imageUrl?: string;
    role: "listener" | "artist" | "admin";
  };
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    // clear localStorage session
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 w-72 focus-within:ring-2 focus-within:ring-zinc-600 transition">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          className="bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
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
            {/* unread badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-800 border-zinc-700 rounded-xl shadow-xl py-2 z-50">
              <p className="px-4 py-2 text-xs text-zinc-500uppercase tracking-wide">
                Notifications
              </p>
              {/* placeholder items */}
              <div className="px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 cursor-pointer rounded-lg mx-1">
                Your track was approved🎵
              </div>
              <div className="px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-700 cursor-pointer rounded-lg mx-1">
                No more notifications
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
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
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <span className="text-sm text-zinc-200 hidden sm:block max-w-[120px] truncate">
              {user?.displayName ?? "Guest"}
            </span>
            <ChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border-zinc-700 rounded-xl shadow-xl py-1 z-50">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700:text-white transition rounded-lg mx-1"
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
          )}
        </div>
      </div>
    </header>
  );
}
