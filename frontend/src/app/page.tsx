"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import type { UserRole } from "@/types/models";

const roleHome: Record<UserRole, string> = {
  listener: "/home",
  artist: "/artist/dashboard",
  admin: "/admin/dashboard",
  support: "/support/dashboard",
};

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = storage.session.get();
    if (session) {
      router.replace(roleHome[session.role]);
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
    </div>
  );
}
