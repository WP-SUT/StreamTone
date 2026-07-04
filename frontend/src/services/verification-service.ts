import { storage } from "@/lib/storage";
import type { VerificationRequest } from "@/types/models";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const verificationService = {
  async getAll(): Promise<VerificationRequest[]> {
    await delay();
    return storage.verifications.getAll();
  },

  async getPending(): Promise<VerificationRequest[]> {
    await delay();
    return storage.verifications.getAll().filter((v) => v.status === "pending");
  },

  async getById(id: string): Promise<VerificationRequest | undefined> {
    await delay();
    return storage.verifications.findById(id);
  },

  async approve(id: string, reviewerId: string): Promise<VerificationRequest> {
    await delay(300);
    const request = storage.verifications.findById(id);
    if (!request) throw new Error("Request not found");

    const updated: VerificationRequest = {
      ...request,
      status: "approved",
      reviewedById: reviewerId,
      reviewedAt: new Date().toISOString(),
    };
    storage.verifications.upsert(updated);

    const artist = storage.artists.findById(request.artistId);
    if (artist) {
      storage.artists.upsert({
        ...artist,
        approvalStatus: "approved",
        isVerified: true,
      });
    }

    return updated;
  },

  async reject(id: string, reviewerId: string, reason: string): Promise<VerificationRequest> {
    await delay(300);
    const request = storage.verifications.findById(id);
    if (!request) throw new Error("Request not found");

    const updated: VerificationRequest = {
      ...request,
      status: "rejected",
      rejectionReason: reason,
      reviewedById: reviewerId,
      reviewedAt: new Date().toISOString(),
    };
    storage.verifications.upsert(updated);

    const artist = storage.artists.findById(request.artistId);
    if (artist) {
      storage.artists.upsert({
        ...artist,
        approvalStatus: "rejected",
        isVerified: false,
      });
    }

    return updated;
  },

  getArtistEmail(artistId: string): string {
    return storage.artists.findById(artistId)?.email ?? "—";
  },
};
