"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { useStaffGuard } from "@/hooks/use-staff-guard";
import { storage } from "@/lib/storage";

export default function AdminRolesPage() {
  const { user, loading } = useStaffGuard("admin");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (loading || !user || !mounted) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const listeners = storage.users.getAll();
  const artists = storage.artists.getAll();
  const staff = storage.staff.getAll();

  const roleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "border-red-500/30 text-red-400",
      support: "border-blue-500/30 text-blue-400",
      listener: "border-zinc-500/30 text-zinc-400",
      artist: "border-purple-500/30 text-purple-400",
    };
    return (
      <Badge variant="outline" className={styles[role] ?? ""}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-6 md:px-8">
      <PageHeader
        title="Role Management"
        description="Overview of platform users and their access levels"
      />

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Shield className="h-5 w-5 text-purple-400" />
          Staff
        </h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{s.displayName}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.email}</td>
                  <td className="px-4 py-3">{roleBadge(s.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Listeners</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {listeners.map((u) => (
                <tr key={u.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{u.displayName}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {u.isPremium ? "Premium" : "Free"}
                  </td>
                  <td className="px-4 py-3">{roleBadge("listener")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Artists</h2>
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((a) => (
                <tr key={a.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{a.artistName}</td>
                  <td className="px-4 py-3 text-zinc-400">{a.email}</td>
                  <td className="px-4 py-3 text-zinc-400 capitalize">
                    {a.approvalStatus}
                  </td>
                  <td className="px-4 py-3">{roleBadge("artist")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
