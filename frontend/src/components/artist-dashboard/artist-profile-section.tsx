"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { BadgeCheck, Camera, Edit3, Link as LinkIcon, Save, UserRound, X } from "lucide-react";

import type { ArtistProfileDraft } from "@/components/artist-dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Artist } from "@/types/models";

interface ArtistProfileSectionProps {
  artist: Artist;
  totalWorks: number;
  totalStreams: number;
  onSave: (draft: ArtistProfileDraft) => void;
}

function ensurePortfolioRows(links: string[]): string[] {
  if (!links.length) return [""];
  return links;
}

function toInitialDraft(artist: Artist): ArtistProfileDraft {
  return {
    artistName: artist.artistName,
    email: artist.email,
    bio: artist.bio ?? "",
    avatarUrl: artist.avatarUrl ?? "",
    portfolioUrls: ensurePortfolioRows(artist.portfolioUrls ?? []),
  };
}

export function ArtistProfileSection({ artist, totalWorks, totalStreams, onSave }: ArtistProfileSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ArtistProfileDraft>(() => toInitialDraft(artist));
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  const fallbackInitial = useMemo(() => {
    const label = ((editing ? draft.artistName : artist.artistName) || "A").trim();
    return label.charAt(0).toUpperCase();
  }, [editing, draft.artistName, artist.artistName]);

  const toggleEditing = () => {
    setEditing((prev) => {
      const next = !prev;
      if (next) {
        setDraft(toInitialDraft(artist));
      }
      return next;
    });
  };

  const updatePortfolioRow = (index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      portfolioUrls: prev.portfolioUrls.map((item, i) => (i === index ? value : item)),
    }));
  };

  const addPortfolioRow = () => {
    setDraft((prev) => ({ ...prev, portfolioUrls: [...prev.portfolioUrls, ""] }));
  };

  const removePortfolioRow = (index: number) => {
    setDraft((prev) => {
      const next = prev.portfolioUrls.filter((_, i) => i !== index);
      return {
        ...prev,
        portfolioUrls: next.length ? next : [""],
      };
    });
  };

  const handleCancel = () => {
    setDraft(toInitialDraft(artist));
    setEditing(false);
  };

  const handleSave = () => {
    onSave({
      ...draft,
      portfolioUrls: draft.portfolioUrls.map((item) => item.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, avatarUrl: previewUrl }));

    event.target.value = "";
  };

  const normalizedBio = editing ? draft.bio : artist.bio ?? "";

  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Avatar size="lg" className="size-16">
              <AvatarImage src={(editing ? draft.avatarUrl : artist.avatarUrl) || undefined} alt={artist.artistName} />
              <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl md:text-2xl">{editing ? draft.artistName || "Artist" : artist.artistName}</CardTitle>
                {artist.isVerified && artist.approvalStatus === "approved" && (
                  <Badge className="gap-1">
                    <BadgeCheck className="size-3.5" /> Verified Artist
                  </Badge>
                )}
              </div>

              <CardDescription>
                {normalizedBio.trim() || "A complete artist profile helps listeners and collaborators trust your page more."}
              </CardDescription>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Followers: {artist.followerCount.toLocaleString()}</Badge>
                <Badge variant="outline">Published works: {totalWorks}</Badge>
                <Badge variant="outline">Streams: {totalStreams.toLocaleString()}</Badge>
              </div>
            </div>
          </div>

          <Button variant={editing ? "outline" : "default"} onClick={toggleEditing}>
            <Edit3 className="mr-1 size-4" />
            {editing ? "Close edit" : "Edit profile"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <UserRound className="size-4" /> Artist name
            </Label>
            <Input
              value={editing ? draft.artistName : artist.artistName}
              onChange={(e) => setDraft((prev) => ({ ...prev, artistName: e.target.value }))}
              disabled={!editing}
              placeholder="Artist name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={editing ? draft.email : artist.email}
              onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
              disabled={!editing}
              placeholder="artist@email.com"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">
              <Camera className="size-4" /> Avatar URL
            </Label>
            <Input
              value={editing ? draft.avatarUrl : artist.avatarUrl ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, avatarUrl: e.target.value }))}
              disabled={!editing}
              placeholder="https://..."
            />

            {editing && (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <Button type="button" variant="secondary" onClick={() => avatarFileInputRef.current?.click()}>
                  Upload profile image
                </Button>
                <p className="text-xs text-muted-foreground">JPG / PNG / WEBP</p>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Biography</Label>
            <textarea
              value={editing ? draft.bio : artist.bio ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, bio: e.target.value }))}
              rows={5}
              disabled={!editing}
              className="w-full rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
              placeholder="Tell listeners about your style, background, and achievements..."
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <LinkIcon className="size-4" /> Portfolio links
            </Label>
            {editing && (
              <Button variant="outline" size="sm" onClick={addPortfolioRow}>
                Add link
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {(editing ? draft.portfolioUrls : ensurePortfolioRows(artist.portfolioUrls ?? [])).map((url, index) => (
              <div key={`portfolio_${index}`} className="flex items-center gap-2">
                <Input
                  value={url}
                  onChange={(e) => updatePortfolioRow(index, e.target.value)}
                  disabled={!editing}
                  placeholder="https://soundcloud.com/..."
                />

                {editing && draft.portfolioUrls.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removePortfolioRow(index)} aria-label="Remove link">
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {editing && (
        <CardFooter className="gap-2 border-t border-zinc-800 pt-4">
          <Button onClick={handleSave}>
            <Save className="mr-1 size-4" /> Save profile
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-1 size-4" /> Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
