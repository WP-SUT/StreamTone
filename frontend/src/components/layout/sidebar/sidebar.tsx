"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  ListMusic,
  Disc3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/playlists", label: "Playlists", icon: ListMusic },
  { href: "/albums", label: "Albums & Singles", icon: Disc3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative min-h-screen flex flex-col h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-zinc-800 shrink-0",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        {collapsed ? (
          <Logo size="sm" iconOnly />
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-600">
          StreamTone © 2026
        </div>
      )}
    </aside>
  );
}
