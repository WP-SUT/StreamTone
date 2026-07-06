"use client";

import type { Gender } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X } from "lucide-react";
import { genderOptions } from "@/components/profile/profile-utils";

interface PersonalInfoSectionProps {
  isOwnProfile: boolean;
  editing: boolean;
  draftDisplayName: string;
  draftEmail: string;
  draftDateOfBirth: string;
  draftGender: Gender;
  onToggleEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
}

export function PersonalInfoSection({
  isOwnProfile,
  editing,
  draftDisplayName,
  draftEmail,
  draftDateOfBirth,
  draftGender,
  onToggleEditing,
  onSave,
  onCancel,
  onDisplayNameChange,
  onEmailChange,
  onDateOfBirthChange,
  onGenderChange,
}: PersonalInfoSectionProps) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Name, email, birthday and gender</CardDescription>
        </div>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={onToggleEditing}>
            <Pencil className="mr-1 size-4" />
            {editing ? "Close" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Display name</Label>
          <Input value={draftDisplayName} onChange={(e) => onDisplayNameChange(e.target.value)} disabled={!editing} className="mt-2" />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={draftEmail} onChange={(e) => onEmailChange(e.target.value)} disabled={!editing} className="mt-2" />
        </div>
        <div>
          <Label>Date of birth</Label>
          <Input
            type="date"
            value={draftDateOfBirth}
            onChange={(e) => onDateOfBirthChange(e.target.value)}
            disabled={!editing}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Gender</Label>
          <select
            value={draftGender}
            onChange={(e) => onGenderChange(e.target.value as Gender)}
            disabled={!editing}
            className="mt-2 h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            {genderOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
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
