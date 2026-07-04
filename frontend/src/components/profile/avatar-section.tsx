"use client";

import { useRef, type ChangeEvent } from "react";
import { Camera, Save, X } from "lucide-react";

import type { User } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    onChange(previewUrl);
    event.target.value = "";
  };

  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile picture</CardTitle>
          <CardDescription>
            {isOwnProfile && isBasic
              ? "Basic users cannot upload/change profile picture in phase 2"
              : "Upload image file for your profile picture"}
          </CardDescription>
        </div>
        {isOwnProfile && (
          <Button variant="outline" size="sm" disabled={isBasic} onClick={onToggleEditing}>
            <Camera className="mr-1 size-4" />
            {editing ? "Close" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" disabled={!editing || isBasic} onClick={() => fileInputRef.current?.click()}>
            Select profile image
          </Button>
          <p className="text-xs text-muted-foreground">JPG / PNG / WEBP</p>
        </div>

        {draftAvatarUrl ? (
          <p className="text-xs text-muted-foreground">Image selected and ready to save.</p>
        ) : (
          <p className="text-xs text-muted-foreground">No image selected yet.</p>
        )}
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
