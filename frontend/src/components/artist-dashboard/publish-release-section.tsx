"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Music2, Plus, Upload, X } from "lucide-react";

import type { PublishPayload, PublishTrackPayload, ReleaseType } from "@/components/artist-dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrackDraft {
  id: string;
  title: string;
  lyrics: string;
  collaboratorsText: string;
  duration: string;
  audioFile: File | null;
}

interface PublishReleaseSectionProps {
  disabled?: boolean;
  onPublish: (payload: PublishPayload) => void;
}

const SUPPORTED_AUDIO_EXTENSIONS = ["mp3", "wav", "flac"];
const SUPPORTED_AUDIO_MIME_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/flac", "audio/x-flac"];
const SUPPORTED_COVER_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const SUPPORTED_COVER_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

function buildTrackDraft(seed = Date.now()): TrackDraft {
  return {
    id: `trk_${seed}_${Math.random().toString(16).slice(2, 8)}`,
    title: "",
    lyrics: "",
    collaboratorsText: "",
    duration: "",
    audioFile: null,
  };
}

export function PublishReleaseSection({ disabled = false, onPublish }: PublishReleaseSectionProps) {
  const [releaseType, setReleaseType] = useState<ReleaseType>("single");
  const [releaseTitle, setReleaseTitle] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [releaseYear, setReleaseYear] = useState(String(new Date().getFullYear()));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [tracks, setTracks] = useState<TrackDraft[]>([buildTrackDraft()]);

  const totalDuration = useMemo(
    () => tracks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0),
    [tracks]
  );

  const updateTrack = (trackId: string, updater: (draft: TrackDraft) => TrackDraft) => {
    setTracks((prev) => prev.map((t) => (t.id === trackId ? updater(t) : t)));
  };

  const handleReleaseTypeChange = (value: ReleaseType) => {
    setReleaseType(value);
    if (value === "single") {
      setTracks((prev) => [prev[0] ?? buildTrackDraft()]);
      setReleaseTitle("");
    }
  };

  const addTrack = () => setTracks((prev) => [...prev, buildTrackDraft()]);
  const removeTrack = (trackId: string) => setTracks((prev) => prev.filter((t) => t.id !== trackId));

  const resetForm = () => {
    setReleaseType("single");
    setReleaseTitle("");
    setGenre("Pop");
    setReleaseYear(String(new Date().getFullYear()));
    setCoverFile(null);
    setTracks([buildTrackDraft()]);
  };

  const submit = () => {
    if (disabled) return;

    const parsedYear = Number(releaseYear);
    if (!Number.isInteger(parsedYear) || parsedYear < 1950 || parsedYear > new Date().getFullYear() + 1) {
      toast.error("Release year is invalid");
      return;
    }

    if (releaseType === "album" && !releaseTitle.trim()) {
      toast.error("Album title is required");
      return;
    }

    if (!genre.trim()) {
      toast.error("Genre is required");
      return;
    }

    const hasInvalidTrack = tracks.some((track) => !track.title.trim() || !track.audioFile);
    if (hasInvalidTrack) {
      toast.error("Each track must have title and audio file");
      return;
    }

    const hasUnsupportedAudio = tracks.some((track) => {
      if (!track.audioFile) return true;

      const lowerName = track.audioFile.name.toLowerCase();
      const extension = lowerName.includes(".") ? lowerName.split(".").pop() : "";
      const mimeType = track.audioFile.type.toLowerCase();

      const extensionOk = !!extension && SUPPORTED_AUDIO_EXTENSIONS.includes(extension);
      const mimeOk = !mimeType || SUPPORTED_AUDIO_MIME_TYPES.includes(mimeType);

      return !(extensionOk && mimeOk);
    });

    if (hasUnsupportedAudio) {
      toast.error("Only MP3 / WAV / FLAC audio files are supported");
      return;
    }

    if (coverFile) {
      const lowerName = coverFile.name.toLowerCase();
      const extension = lowerName.includes(".") ? lowerName.split(".").pop() : "";
      const mimeType = coverFile.type.toLowerCase();

      const extensionOk = !!extension && SUPPORTED_COVER_EXTENSIONS.includes(extension);
      const mimeOk = !mimeType || SUPPORTED_COVER_MIME_TYPES.includes(mimeType);

      if (!(extensionOk && mimeOk)) {
        toast.error("Cover image must be JPG / PNG / WEBP");
        return;
      }
    }

    const publishTracks: PublishTrackPayload[] = tracks.map((track) => ({
      title: track.title.trim(),
      audioFile: track.audioFile as File,
      lyrics: track.lyrics.trim(),
      collaborators: track.collaboratorsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      duration: Number(track.duration) || 0,
    }));

    onPublish({
      releaseType,
      releaseTitle: releaseType === "single" ? publishTracks[0].title : releaseTitle.trim(),
      genre: genre.trim(),
      releaseYear: parsedYear,
      coverFile,
      tracks: publishTracks,
    });

    toast.success("Release published successfully");
    resetForm();
  };

  return (
    <Card className="border border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-4" />
          Release Publisher
        </CardTitle>
        <CardDescription>
          Upload MP3 / WAV / FLAC tracks, set cover, release type, and metadata including lyrics.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Release type</Label>
            <Select value={releaseType} onValueChange={(v) => handleReleaseTypeChange(v as ReleaseType)} disabled={disabled}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="album">Album</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{releaseType === "single" ? "Single title (optional)" : "Album title"}</Label>
            <Input
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              placeholder={releaseType === "single" ? "Defaults to track title" : "My New Album"}
              disabled={disabled || releaseType === "single"}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover image</Label>
            <Input
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Pop" disabled={disabled} />
          </div>

          <div className="space-y-2">
            <Label>Release year</Label>
            <Input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              disabled={disabled}
              min={1950}
              max={new Date().getFullYear() + 1}
            />
          </div>

          <div className="md:col-span-2 flex items-end gap-2">
            <Badge variant="outline">Tracks: {tracks.length}</Badge>
            <Badge variant="outline">Total duration: {totalDuration}s</Badge>
            {coverFile && <Badge>{coverFile.name}</Badge>}
          </div>
        </div>

        {coverFile && (
          <p className="text-xs text-muted-foreground">Selected cover: {coverFile.name} (JPG / PNG / WEBP)</p>
        )}

        <div className="space-y-4">
          {tracks.map((track, index) => (
            <div key={track.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Music2 className="size-4" />
                  Track {index + 1}
                </h4>
                {releaseType === "album" && tracks.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => removeTrack(track.id)} disabled={disabled}>
                    <X className="size-4" /> Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Track title</Label>
                  <Input
                    value={track.title}
                    onChange={(e) => updateTrack(track.id, (t) => ({ ...t, title: e.target.value }))}
                    placeholder="Song title"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audio file (MP3/WAV/FLAC)</Label>
                  <Input
                    type="file"
                    accept=".mp3,.wav,.flac,audio/mpeg,audio/wav,audio/flac"
                    disabled={disabled}
                    onChange={(e) => updateTrack(track.id, (t) => ({ ...t, audioFile: e.target.files?.[0] ?? null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={track.duration}
                    onChange={(e) => updateTrack(track.id, (t) => ({ ...t, duration: e.target.value }))}
                    placeholder="240"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Collaborators (comma separated)</Label>
                  <Input
                    value={track.collaboratorsText}
                    onChange={(e) => updateTrack(track.id, (t) => ({ ...t, collaboratorsText: e.target.value }))}
                    placeholder="Artist A, Artist B"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lyrics</Label>
                <textarea
                  value={track.lyrics}
                  onChange={(e) => updateTrack(track.id, (t) => ({ ...t, lyrics: e.target.value }))}
                  rows={4}
                  disabled={disabled}
                  className="w-full rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
                  placeholder="Song lyrics..."
                />
              </div>

              {track.audioFile && <Badge variant="secondary">{track.audioFile.name}</Badge>}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-zinc-800 pt-4">
        {releaseType === "album" && (
          <Button variant="outline" onClick={addTrack} disabled={disabled}>
            <Plus className="mr-1 size-4" /> Add track
          </Button>
        )}
        <Button onClick={submit} disabled={disabled}>
          Publish release
        </Button>
      </CardFooter>
    </Card>
  );
}
