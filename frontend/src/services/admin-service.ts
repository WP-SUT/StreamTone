import { storage } from "@/lib/storage";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  pendingArtists: number;
  totalUsers: number;
  totalArtists: number;
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    const tickets = storage.tickets.getAll();
    const artists = storage.artists.getAll();
    const users = storage.users.getAll();

    return {
      openTickets: tickets.filter((t) => t.status === "open").length,
      inProgressTickets: tickets.filter((t) => t.status === "in_progress").length,
      resolvedTickets: tickets.filter((t) =>
        t.status === "resolved" || t.status === "closed"
      ).length,
      pendingArtists: artists.filter((a) => a.approvalStatus === "pending").length,
      totalUsers: users.length,
      totalArtists: artists.length,
    };
  },
};
