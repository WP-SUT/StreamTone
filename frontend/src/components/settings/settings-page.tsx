"use client";

import { useState } from "react";
import { Bell, Globe2, ShieldAlert, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { storage } from "@/lib/storage";
import type { User } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type NotificationLimit = "low" | "normal" | "high";
type SystemSound = "soft" | "default" | "cinema";
type AppLanguage = "fa" | "en";

function tierLabel(tier: User["subscriptionTier"]) {
  if (tier === "gold") return "Gold";
  if (tier === "silver") return "Silver";
  return "Basic";
}

export function SettingsPage() {
  const session = storage.session.get() as User | null;
  const [notificationLimit, setNotificationLimit] = useState<NotificationLimit>("normal");
  const [systemSound, setSystemSound] = useState<SystemSound>("default");
  const [language, setLanguage] = useState<AppLanguage>("fa");

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSavePreferences = () => {
    toast.success("Settings saved successfully");
  };

  const handleDeleteAccount = () => {
    if (!session) return;

    if (deleteConfirmText.trim().toLowerCase() !== "delete") {
      toast.error("Type DELETE to confirm account deletion");
      return;
    }

    setIsDeleting(true);
    const allUsers = storage.users.getAll();
    const nextUsers = allUsers.filter((u) => u.id !== session.id);
    storage.users.setAll(nextUsers);
    storage.session.clear();
    toast.success("Your account has been deleted");
    setIsDeleting(false);
    window.location.href = "/login";
  };

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings unavailable</CardTitle>
            <CardDescription>You need to log in first.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage notifications, system sounds, language, subscription, and account options.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Notification Limit</CardTitle>
          </div>
          <CardDescription>Control how many notifications you receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block">Notification level</Label>
          <Select value={notificationLimit} onValueChange={(v) => setNotificationLimit(v as NotificationLimit)}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Select notification level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">System Sound</CardTitle>
          </div>
          <CardDescription>Choose your system and notification sound profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block">Sound profile</Label>
          <Select value={systemSound} onValueChange={(v) => setSystemSound(v as SystemSound)}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Select sound profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soft">Soft</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="cinema">Cinema</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Language</CardTitle>
          </div>
          <CardDescription>Set your preferred application language.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block">App language</Label>
          <Select value={language} onValueChange={(v) => setLanguage(v as AppLanguage)}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fa">Persian</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Subscription Tier</CardTitle>
          </div>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Badge variant="outline">{tierLabel(session.subscriptionTier)}</Badge>
        </CardContent>
      </Card>

      <Card className="border border-red-900/50 bg-red-950/20">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-300">
            <Trash2 className="size-4" />
            <CardTitle className="text-base">Delete Account</CardTitle>
          </div>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="delete-confirm">Type DELETE to confirm account deletion</Label>
          <input
            id="delete-confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="h-10 w-full rounded-2xl border border-input bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            placeholder="DELETE"
          />
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePreferences}>Save settings</Button>
      </div>
    </main>
  );
}
