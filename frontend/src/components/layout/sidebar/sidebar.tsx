// src/components/layout/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  ListMusic,
  Disc3,
  User,
  Settings,
  TicketCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

type UserRole = "listener" | "artist" | "support" | "admin";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  userRole?: UserRole;
  currentPath?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  // Listener / Artist
  { label: "Home",              href: "/home",      icon: Home,        roles: ["listener", "artist"] },
  { label: "Search",            href: "/search",    icon: Search,      roles: ["listener", "artist"] },
  { label: "Playlists",         href: "/playlists", icon: ListMusic,   roles: ["listener", "artist"] },
  { label: "Albums & Singles",  href: "/albums",    icon: Disc3,       roles: ["listener", "artist"] },
  { label: "Profile",           href: "/profile",   icon: User,        roles: ["listener", "artist"] },
  { label: "Settings",          href: "/settings",  icon: Settings,    roles: ["listener", "artist"] },

  // Support
  { label: "Tickets",           href: "/support/tickets",  icon: TicketCheck, roles: ["support"] },
  { label: "Settings",          href: "/settings",         icon: Settings,    roles: ["support"] },

  // Admin
  { label: "Tickets",           href: "/admin/tickets",    icon: TicketCheck, roles: ["admin"] },
  { label: "Artist Approvals",  href: "/admin/approvals",  icon: UserCheck,   roles: ["admin"] },
  { label: "Management",        href: "/admin/management", icon: ShieldCheck, roles: ["admin"] },
  { label: "Settings",          href: "/settings",         icon: Settings,    roles: ["admin"] },
];

export function Sidebar({
  collapsed: collapsedProp,
  onToggle,
  userRole = "listener",
  currentPath,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = collapsedProp !== undefined && onToggle !== undefined;

  const collapsed = isControlled ? collapsedProp : internalCollapsed;
  const handleToggle = isControlled
    ? onToggle
    : () => setInternalCollapsed((prev) => !prev);

  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  const isActive = (href: string) =>
    activePath === href || activePath.startsWith(href + "/");

  return (
    <aside
      className={`
        relative flex flex-col min-h-screen
        bg-zinc-900 border-r border-zinc-800
        transition-all duration-300
        ${collapsed ? "w-16" : "w-max min-w-[11rem]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-3 border-b border-zinc-800">
        {collapsed ? (
          <Logo size="sm" iconOnly />
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg
                text-sm font-medium transition-colors
                ${active
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-600 whitespace-nowrap">
          StreamTone © 2026
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={handleToggle}
        className="
          absolute -right-3 top-20
          w-6 h-6 rounded-full
          bg-zinc-800 hover:bg-zinc-700
          border border-zinc-700
          flex items-center justify-center
          text-zinc-400 hover:text-white
          transition-colors z-10
        "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
