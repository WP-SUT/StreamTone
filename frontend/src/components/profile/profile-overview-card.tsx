import { UserPlus, UserRoundMinus } from "lucide-react";

import type { User } from "@/types/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { tierMeta } from "@/components/profile/profile-utils";

interface ProfileOverviewCardProps {
  viewedUser: User;
  isOwnProfile: boolean;
  isFollowingViewedUser: boolean;
  followerCount: number;
  followingCount: number;
  onToggleFollow: () => void;
}

export function ProfileOverviewCard({
  viewedUser,
  isOwnProfile,
  isFollowingViewedUser,
  followerCount,
  followingCount,
  onToggleFollow,
}: ProfileOverviewCardProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardContent className="flex flex-col gap-5 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-24">
            <AvatarImage src={viewedUser.avatarUrl} alt={viewedUser.displayName} />
            <AvatarFallback>{viewedUser.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <p className="text-2xl font-semibold">{viewedUser.displayName}</p>
            <p className="text-sm text-zinc-400">@{viewedUser.username}</p>
            <Badge className={tierMeta[viewedUser.subscriptionTier].className}>
              {tierMeta[viewedUser.subscriptionTier].label} Subscription
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isOwnProfile && (
            <Button onClick={onToggleFollow}>
              {isFollowingViewedUser ? <UserRoundMinus className="mr-1 size-4" /> : <UserPlus className="mr-1 size-4" />}
              {isFollowingViewedUser ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-1 gap-3 border-t border-zinc-800 pt-4 text-sm md:grid-cols-3">
        <div className="rounded-2xl bg-zinc-800/70 p-3">
          <p className="text-zinc-400">Followers</p>
          <p className="mt-1 text-xl font-semibold">{followerCount}</p>
        </div>
        <div className="rounded-2xl bg-zinc-800/70 p-3">
          <p className="text-zinc-400">Following</p>
          <p className="mt-1 text-xl font-semibold">{followingCount}</p>
        </div>
        <div className="rounded-2xl bg-zinc-800/70 p-3">
          <p className="text-zinc-400">Daily streamed songs</p>
          <p className="mt-1 text-xl font-semibold">{viewedUser.dailyStreamCount}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
