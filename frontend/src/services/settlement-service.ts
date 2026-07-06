import { storage } from "@/lib/storage";
import type { ArtistSettlement } from "@/types/models";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const settlementService = {
  async getAll(): Promise<ArtistSettlement[]> {
    await delay();
    return storage.settlements.getAll();
  },

  async markSettled(id: string): Promise<ArtistSettlement> {
    await delay(300);
    const item = storage.settlements.getAll().find((s) => s.id === id);
    if (!item) throw new Error("Settlement not found");

    const updated: ArtistSettlement = {
      ...item,
      paymentStatus: "settled",
    };
    storage.settlements.upsert(updated);
    return updated;
  },
};
