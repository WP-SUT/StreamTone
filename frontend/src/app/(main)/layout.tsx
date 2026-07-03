// src/app/(main)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { Navbar } from "@/components/layout/navbar/navbar";
import FooterPlayer from "@/components/layout/player/footer-player";

import type { User, Artist, StaffUser } from "@/types/models";
import MiniPlayer from "@/components/layout/player/mini-player";
import { storage } from "@/lib/storage";

// Any logged-in user can be one of these three shapes
type AuthedUser = User | Artist | StaffUser;

// Helper to extract a display name from any user shape
function getDisplayName(u: AuthedUser): string {
  if (u.role === "artist") return (u as Artist).artistName;
  return (u as User | StaffUser).displayName;
}

function getAvatarUrl(u: AuthedUser): string | undefined {
  return u.avatarUrl;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthedUser | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auth guard
  useEffect(() => {
    const storedUser = storage.session.get();
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      setUser(storedUser as AuthedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        userRole={user.role}
        currentPath={pathname}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          user={{
            displayName: getDisplayName(user),
            imageUrl: getAvatarUrl(user),
            role: user.role,
          }}
        />

        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>
      </div>
      <MiniPlayer />
      <FooterPlayer />
    </div>
  );
}
