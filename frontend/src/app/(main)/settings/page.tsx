"use client";

import { PageHeader } from "@/components/admin/page-header";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";
import type { StaffUser, User, Artist } from "@/types/models";

export default function SettingsPage() {
  const [user, setUser] = useState<User | Artist | StaffUser | null>(null);

  useEffect(() => {
    setUser(storage.session.get());
  }, []);

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const displayName =
    user.role === "artist"
      ? (user as Artist).artistName
      : (user as User | StaffUser).displayName;

  return (
    <div className="mx-auto max-w-screen-md space-y-6 px-4 py-6 md:px-8">
      <PageHeader title="Settings" description="Account and application preferences" />
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Name</p>
          <p className="text-white font-medium">{displayName}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Email</p>
          <p className="text-zinc-300">{user.email}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Role</p>
          <p className="text-zinc-300 capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
