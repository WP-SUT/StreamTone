"use client";

import { Camera, Save, X } from "lucide-react";

import type { User } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AvatarSectionProps {
  viewedUser: User;
  isOwnProfile: boolean;
  editing: boolean;
  draftAvatarUrl: string;
  onToggleEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

export function AvatarSection({
  viewedUser,
  isOwnProfile,
  editing,
  draftAvatarUrl,
  onToggleEditing,
  onSave,
  onCancel,
  onChange,
}: AvatarSectionProps) {
  const isBasic = viewedUser.subscriptionTier === "basic";

  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile picture</CardTitle>
          <CardDescription>
            {isOwnProfile && isBasic ? "Basic users cannot upload/change profile picture in phase 2" : "Update avatar URL"}
          </CardDescription>
        </div>
        {isOwnProfile && (
          <Button variant="outline" size="sm" disabled={isBasic} onClick={onToggleEditing}>
            <Camera className="mr-1 size-4" />
            {editing ? "Close" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <Input
          placeholder="https://..."
          value={draftAvatarUrl}
          onChange={(e) => onChange(e.target.value)}
          disabled={!editing || isBasic}
        />
      </CardContent>

      {isOwnProfile && editing && !isBasic && (
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
