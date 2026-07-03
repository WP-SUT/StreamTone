"use client";

import { Pencil, Save, X } from "lucide-react";

import type { SubscriptionTier } from "@/components/profile/profile-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionSectionProps {
  isOwnProfile: boolean;
  editing: boolean;
  draftSubscriptionTier: SubscriptionTier;
  onToggleEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: SubscriptionTier) => void;
}

export function SubscriptionSection({
  isOwnProfile,
  editing,
  draftSubscriptionTier,
  onToggleEditing,
  onSave,
  onCancel,
  onChange,
}: SubscriptionSectionProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Select Gold, Silver, or Basic</CardDescription>
        </div>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={onToggleEditing}>
            <Pencil className="mr-1 size-4" />
            {editing ? "Close" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <select
          value={draftSubscriptionTier}
          onChange={(e) => onChange(e.target.value as SubscriptionTier)}
          disabled={!editing}
          className="h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
        >
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="basic">Basic</option>
        </select>
      </CardContent>

      {isOwnProfile && editing && (
        <CardFooter className="gap-2 border-t border-zinc-800 pt-4">
          <Button onClick={onSave}>
            <Save className="mr-1 size-4" /> Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-1 size-4" /> Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
