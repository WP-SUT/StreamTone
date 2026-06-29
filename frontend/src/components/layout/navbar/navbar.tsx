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
  X,
} from "lucide-react";
import { UserRole } from "@/types";

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
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // mobile search overlay

  const closeAll = () => {
    setDropdownOpen(false);
    setNotifOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 flex items-center px-4 md:px-6 gap-3">

      {/* ── Mobile search overlay ────────────────────── */}
      {searchOpen && (
        <div className="absolute inset-0 z-50 bg-zinc-900 flex items-center px-4 gap-3 md:hidden">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search songs, artists, albums..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="p-2 rounded-full hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      )}

      {/* ── Desktop search box ──────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2 w-72 focus-within:ring-2 focus-within:ring-zinc-600 transition">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          className="bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
        />
      </div>

      {/* ── Spacer ──────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right side ──────────────────────────────── */}
      <div className="flex items-center gap-1 sm:gap-3">

        {/* Mobile search icon */}
        <button
          onClick={() => { setSearchOpen(true); closeAll(); }}
          aria-label="Open search"
          className="md:hidden p-2 rounded-full hover:bg-zinc-800 transition"
        >
          <Search className="w-5 h-5 text-zinc-300" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((p) => !p); setDropdownOpen(false); }}
            className="relative p-2 rounded-full hover:bg-zinc-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {notifOpen && (
            <>
              {/* backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl py-2 z-50">
                <p className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wide">
                  Notifications
                </p>
                <div className="px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-700 cursor-pointer rounded-lg mx-1 transition">
                  Your track was approved 🎵
                </div>
                <div className="px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-700 cursor-pointer rounded-lg mx-1 transition">
                  No more notifications
                </div>
              </div>
            </>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen((p) => !p); setNotifOpen(false); }}
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
