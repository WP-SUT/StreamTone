import { storage } from "@/lib/storage";
import type { AppNotification } from "@/types/models";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const notificationService = {
  async getForUser(userId: string): Promise<AppNotification[]> {
    await delay();
    return storage.notifications
      .getAll()
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getUnreadCount(userId: string): Promise<number> {
    const items = await this.getForUser(userId);
    return items.filter((n) => !n.isRead).length;
  },

  async markAsRead(id: string): Promise<void> {
    await delay(200);
    const item = storage.notifications.findById(id);
    if (!item) return;
    storage.notifications.upsert({ ...item, isRead: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay(200);
    const all = storage.notifications.getAll();
    storage.notifications.setAll(
      all.map((n) => (n.recipientId === userId ? { ...n, isRead: true } : n))
    );
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    storage.notifications.remove(id);
  },
};
