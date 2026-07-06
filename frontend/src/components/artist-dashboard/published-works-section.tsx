"use client";

import { useMemo, useState } from "react";
import { Disc3, Library, Pencil, Trash2 } from "lucide-react";

import type { Album, Song } from "@/types/models";
import type { AlbumEditDraft, SongEditDraft } from "@/components/artist-dashboard/types";
import { toAlbumEditDraft, toSongEditDraft } from "@/components/artist-dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PublishedWorksSectionProps {
  singles: Song[];
  albums: Album[];
  allSongs: Song[];
  disabled?: boolean;
  onSaveSingle: (songId: string, draft: SongEditDraft) => void;
  onDeleteSingle: (songId: string) => void;
  onSaveAlbum: (albumId: string, draft: AlbumEditDraft) => void;
  onDeleteAlbum: (albumId: string) => void;
}

export function PublishedWorksSection({
  singles,
  albums,
  allSongs,
  disabled = false,
  onSaveSingle,
  onDeleteSingle,
  onSaveAlbum,
  onDeleteAlbum,
}: PublishedWorksSectionProps) {
  const [editingSingleId, setEditingSingleId] = useState<string | null>(null);
  const [singleDraft, setSingleDraft] = useState<SongEditDraft | null>(null);

  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumDraft, setAlbumDraft] = useState<AlbumEditDraft | null>(null);

  const songMap = useMemo(() => {
    const map = new Map<string, Song>();
    allSongs.forEach((song) => map.set(song.id, song));
    return map;
  }, [allSongs]);

  const openSingleDialog = (song: Song) => {
    setEditingSingleId(song.id);
    setSingleDraft(toSongEditDraft(song));
  };

  const openAlbumDialog = (album: Album) => {
    setEditingAlbumId(album.id);
    setAlbumDraft(toAlbumEditDraft(album));
  };

  const requestDeleteSingle = (song: Song) => {
    const confirmed = window.confirm(`Are you sure you want to delete single \"${song.title}\"?`);
    if (!confirmed) return;
    onDeleteSingle(song.id);
  };

  const requestDeleteAlbum = (album: Album) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete album \"${album.title}\" and all of its tracks?`
    );
    if (!confirmed) return;
    onDeleteAlbum(album.id);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Disc3 className="size-4" /> Published Singles
          </CardTitle>
          <CardDescription>Edit or delete published single tracks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {singles.length === 0 && <p className="text-sm text-muted-foreground">No published singles yet.</p>}
          {singles.map((song) => (
            <div key={song.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-medium">{song.title}</h4>
                  <p className="text-xs text-muted-foreground">{song.genre} • {song.releaseYear}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled={disabled} onClick={() => openSingleDialog(song)}>
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" disabled={disabled} onClick={() => requestDeleteSingle(song)}>
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Streams: {song.streamCount.toLocaleString()}</Badge>
                <Badge variant="outline">Duration: {song.duration}s</Badge>
                {(song.collaborators?.length ?? 0) > 0 && (
                  <Badge variant="secondary">Feat. {song.collaborators?.join(", ")}</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="size-4" /> Published Albums
          </CardTitle>
          <CardDescription>Manage album metadata and remove albums when needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {albums.length === 0 && <p className="text-sm text-muted-foreground">No published albums yet.</p>}
          {albums.map((album) => (
            <div key={album.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-medium">{album.title}</h4>
                  <p className="text-xs text-muted-foreground">{album.genre} • {album.releaseYear}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled={disabled} onClick={() => openAlbumDialog(album)}>
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" disabled={disabled} onClick={() => requestDeleteAlbum(album)}>
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Tracks: {album.trackIds.length}</Badge>
                <Badge variant="outline">Streams: {album.streamCount.toLocaleString()}</Badge>
                <Badge variant="outline">Duration: {album.totalDuration}s</Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Track list</p>
                <ul className="list-disc pl-5 text-xs text-zinc-300 space-y-0.5">
                  {album.trackIds.map((trackId) => (
                    <li key={trackId}>{songMap.get(trackId)?.title ?? "Unknown track"}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={!!editingSingleId && !!singleDraft}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSingleId(null);
            setSingleDraft(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Single</DialogTitle>
            <DialogDescription>Update title, metadata, lyrics and collaborators.</DialogDescription>
          </DialogHeader>

          {singleDraft && editingSingleId && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={singleDraft.title} onChange={(e) => setSingleDraft({ ...singleDraft, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Input value={singleDraft.genre} onChange={(e) => setSingleDraft({ ...singleDraft, genre: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Release year</Label>
                  <Input
                    type="number"
                    value={singleDraft.releaseYear}
                    onChange={(e) => setSingleDraft({ ...singleDraft, releaseYear: Number(e.target.value) || singleDraft.releaseYear })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover URL</Label>
                  <Input
                    value={singleDraft.coverUrl}
                    onChange={(e) => setSingleDraft({ ...singleDraft, coverUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Collaborators</Label>
                  <Input
                    value={singleDraft.collaboratorsText}
                    onChange={(e) => setSingleDraft({ ...singleDraft, collaboratorsText: e.target.value })}
                    placeholder="Artist A, Artist B"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lyrics</Label>
                <textarea
                  value={singleDraft.lyrics}
                  onChange={(e) => setSingleDraft({ ...singleDraft, lyrics: e.target.value })}
                  rows={5}
                  className="w-full rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSingleId(null);
                      setSingleDraft(null);
                    }}
                  >
                    Cancel
                  </Button>
                <Button
                  onClick={() => {
                    onSaveSingle(editingSingleId, singleDraft);
                    setEditingSingleId(null);
                      setSingleDraft(null);
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingAlbumId && !!albumDraft}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAlbumId(null);
            setAlbumDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription>Update album title and metadata.</DialogDescription>
          </DialogHeader>

          {albumDraft && editingAlbumId && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={albumDraft.title} onChange={(e) => setAlbumDraft({ ...albumDraft, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Genre</Label>
                <Input value={albumDraft.genre} onChange={(e) => setAlbumDraft({ ...albumDraft, genre: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Release year</Label>
                <Input
                  type="number"
                  value={albumDraft.releaseYear}
                  onChange={(e) => setAlbumDraft({ ...albumDraft, releaseYear: Number(e.target.value) || albumDraft.releaseYear })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover URL</Label>
                <Input
                  value={albumDraft.coverUrl}
                  onChange={(e) => setAlbumDraft({ ...albumDraft, coverUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAlbumId(null);
                    setAlbumDraft(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onSaveAlbum(editingAlbumId, albumDraft);
                    setEditingAlbumId(null);
                    setAlbumDraft(null);
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
