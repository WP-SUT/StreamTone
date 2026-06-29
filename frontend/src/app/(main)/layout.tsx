// src/app/(main)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { Navbar } from "@/components/layout/navbar/navbar";

import type { User, Artist, StaffUser, Song } from "@/types";
import FooterPlayer from "@/components/layout/player/footer-player";

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
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auth guard
  useEffect(() => {
    const storedUser = {
    id: "u1",
    displayName: "Soroush",
    email: "soroush@example.com",
    dateOfBirth: "1998-05-10",
    gender: "male",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=soroush",
    role: "listener",
    isPremium: false,
    followingArtistIds: ["a1"],
    followerIds: [],
    playlistIds: ["pl1"],
    createdAt: "2024-01-01T00:00:00Z",
  }
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

  // Mock: simulate a song loading (replace with Zustand player state later)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uses the actual Song type — all required fields present
      const demSong: Song = {
        id: "s1",
        title: "Ey Iran",
        artistId: "a1",
        artistName: "Dariush",
        albumId: "alb1",
        coverUrl: "https://picsum.photos/seed/s1/300/300",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 214,
        genre: "Pop",
        releaseYear: 2022,
        streamCount: 980000,
        isSingle: false,
        createdAt: "2022-06-01T00:00:00Z",
      };
      setCurrentSong(demSong);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

      <FooterPlayer currentSong={currentSong} />
    </div>
  );
}
