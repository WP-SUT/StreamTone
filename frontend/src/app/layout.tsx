// src/app/(main)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "lucide-react";
import { Navbar } from "@/components/layout/navbar/navbar";
import { FooterPlayer } from "@/components/layout/player/footer-player";


interface User {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;
  role: "listener" | "artist" | "admin";
}

interface Song {
  id: string;
  title: string;
  artistName: string;
  coverUrl?: string;
  duration: number;
  dominantColor?: string;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auth guard
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        router.push("/auth/login");
      }
    }
  }, [router]);

  // Mock: load a song for demo (replace with real player state context later)
  useEffect(() => {
    // Simulate loading a song after mount
    const timer = setTimeout(() => {
      setCurrentSong({
        id: "demo-1",
        title: "Neon Lights",
        artistName: "Synthwave Dreams",
        coverUrl: undefined,
        duration: 185,
        dominantColor: "#e74c3c", // red-ish
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    // Show nothing while checking auth
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        userRole={user.role}
        currentPath={pathname}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar user={user} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>
      </div>

      {/* Footer Player */}
      <FooterPlayer currentSong={currentSong} />
    </div>
  );
}
