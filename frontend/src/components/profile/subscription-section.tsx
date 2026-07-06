"use client";

import { Crown } from "lucide-react";

import type { SubscriptionTier } from "@/components/profile/profile-utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionSectionProps {
  subscriptionTier: SubscriptionTier;
}

function tierLabel(tier: SubscriptionTier): string {
  if (tier === "gold") return "Gold";
  if (tier === "silver") return "Silver";
  return "Basic";
}

export function SubscriptionSection({ subscriptionTier }: SubscriptionSectionProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <div>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan (read-only)</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex items-center gap-2">
        <Crown className="size-4 text-muted-foreground" />
        <Badge variant="outline">{tierLabel(subscriptionTier)}</Badge>
      </CardContent>
    </Card>
  );
}
