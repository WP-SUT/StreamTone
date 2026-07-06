import type { VerificationRequest } from "@/types/models";

export const mockVerifications: VerificationRequest[] = [
  {
    id: "vr1",
    artistId: "a2",
    artistName: "Pending Artist",
    portfolioUrls: ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"],
    status: "pending",
    submittedAt: "2026-06-01T00:00:00Z",
  },
];
