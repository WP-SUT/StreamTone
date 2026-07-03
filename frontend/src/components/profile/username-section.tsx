"use client";

import { Pencil, RefreshCcw, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UsernameSectionProps {
  isOwnProfile: boolean;
  editing: boolean;
  draftUsername: string;
  onToggleEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  onRegenerate: () => void;
}

export function UsernameSection({
  isOwnProfile,
  editing,
  draftUsername,
  onToggleEditing,
  onSave,
  onCancel,
  onChange,
  onRegenerate,
}: UsernameSectionProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System username</CardTitle>
          <CardDescription>Assigned by the platform, but can be regenerated or updated</CardDescription>
        </div>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={onToggleEditing}>
            <Pencil className="mr-1 size-4" />
            {editing ? "Close" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <Input value={draftUsername} onChange={(e) => onChange(e.target.value)} disabled={!editing} />
        {isOwnProfile && editing && (
          <Button variant="secondary" size="sm" onClick={onRegenerate}>
            <RefreshCcw className="mr-1 size-4" /> Regenerate username
          </Button>
        )}
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
