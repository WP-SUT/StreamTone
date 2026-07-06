"use client";

import type { User } from "@/types/models";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PeopleSwitcherSectionProps {
  users: User[];
  activeProfileId: string;
  viewedGenderLabel: string;
  onSelectProfile: (id: string) => void;
}

export function PeopleSwitcherSection({ users, activeProfileId, viewedGenderLabel, onSelectProfile }: PeopleSwitcherSectionProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <CardTitle>People</CardTitle>
        <CardDescription>Open another listener profile to test follow/unfollow behavior</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {users.map((user) => (
          <Button key={user.id} variant={activeProfileId === user.id ? "default" : "outline"} onClick={() => onSelectProfile(user.id)}>
            {user.displayName}
          </Button>
        ))}
      </CardContent>
      <CardFooter className="text-sm text-zinc-400">Current gender: {viewedGenderLabel}</CardFooter>
    </Card>
  );
}
