import type { Gender, User } from "@/types/models";

export type SubscriptionTier = User["subscriptionTier"];

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const tierMeta: Record<SubscriptionTier, { label: string; className: string }> = {
  gold: { label: "Gold", className: "bg-yellow-500/20 text-yellow-300" },
  silver: { label: "Silver", className: "bg-slate-400/20 text-slate-200" },
  basic: { label: "Basic", className: "bg-zinc-500/20 text-zinc-200" },
};

export function normalizeUser(user: User): User {
  return {
    ...user,
    username: user.username ?? `user_${user.id}`,
    subscriptionTier: user.subscriptionTier ?? (user.isPremium ? "gold" : "basic"),
    dailyStreamCount: user.dailyStreamCount ?? 0,
    followingUserIds: user.followingUserIds ?? [],
    followingArtistIds: user.followingArtistIds ?? [],
    followerIds: user.followerIds ?? [],
  };
}

export function formatGender(gender: Gender): string {
  return genderOptions.find((g) => g.value === gender)?.label ?? "Unknown";
}

export function usernameCandidate(seed: string): string {
  const normalized = seed.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${normalized || "user"}_${Math.floor(1000 + Math.random() * 9000)}`;
}
