import type { ArtistSettlement } from "@/types/models";

export const mockSettlements: ArtistSettlement[] = [
  {
    id: "set1",
    artistId: "a1",
    artistName: "Dariush",
    month: "2026-06",
    uniqueListeners: 45200,
    totalStreams: 1280000,
    rewardAmount: 8_500_000,
    paymentStatus: "pending",
  },
  {
    id: "set2",
    artistId: "a1",
    artistName: "Dariush",
    month: "2026-05",
    uniqueListeners: 38900,
    totalStreams: 1100000,
    rewardAmount: 7_200_000,
    paymentStatus: "settled",
  },
];
