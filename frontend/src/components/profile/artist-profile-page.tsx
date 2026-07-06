"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Disc3, Headphones, Music2, UserPlus, UserRoundCheck } from "lucide-react";
import { toast } from "sonner";

import { storage } from "@/lib/storage";
import type { Album, Artist, Song, User } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtistProfileState {
  artist: Artist | null;
  songs: Song[];
  albums: Album[];
  users: User[];
}

interface ArtistProfilePageProps {
  artistId: string;
}

function buildInitialArtistProfileState(artistId: string): ArtistProfileState {
  const artists = storage.artists.getAll();

  if (!artistId) {
    return {
      artist: null,
      songs: storage.songs.getAll(),
      albums: storage.albums.getAll(),
      users: storage.users.getAll(),
    };
  }

  return {
    artist: artists.find((a) => a.id === artistId) ?? null,
    songs: storage.songs.getAll(),
    albums: storage.albums.getAll(),
    users: storage.users.getAll(),
  };
}

function toTimeLabel(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function ArtistProfilePage({ artistId }: ArtistProfilePageProps) {
  const [state, setState] = useState<ArtistProfileState>(() => buildInitialArtistProfileState(artistId));
  const [activeViewerId, setActiveViewerId] = useState<string>(() => {
    const session = storage.session.get();
    if (session?.role === "listener") {
      const matched = state.users.find((user) => user.id === session.id);
      if (matched) return matched.id;
    }
    return state.users[0]?.id ?? "";
  });

  const listeners = useMemo(() => state.users, [state.users]);
  const activeViewer = useMemo(
    () => listeners.find((listener) => listener.id === activeViewerId) ?? listeners[0] ?? null,
    [listeners, activeViewerId]
  );

  const artist = state.artist;

  const artistAlbums = useMemo(
    () => (artist ? state.albums.filter((album) => album.artistId === artist.id) : []),
    [artist, state.albums]
  );

  const artistSingles = useMemo(
    () => (artist ? state.songs.filter((song) => song.artistId === artist.id && song.isSingle) : []),
    [artist, state.songs]
  );

  const allArtistSongs = useMemo(
    () => (artist ? state.songs.filter((song) => song.artistId === artist.id) : []),
    [artist, state.songs]
  );

  const totalPublishedWorks = artistAlbums.length + artistSingles.length;
  const computedFollowers = useMemo(() => {
    if (!artist) return 0;
    return state.users.filter((user) => user.followingArtistIds.includes(artist.id)).length;
  }, [artist, state.users]);

  const totalStreams = useMemo(
    () => allArtistSongs.reduce((sum, song) => sum + song.streamCount, 0),
    [allArtistSongs]
  );

  const estimatedListeners = useMemo(() => Math.max(1, Math.round(totalStreams * 0.41)), [totalStreams]);

  const isFollowedByActiveViewer = !!artist && !!activeViewer
    ? activeViewer.followingArtistIds.includes(artist.id)
    : false;

  const toggleFollowByActiveViewer = () => {
    if (!artist || !activeViewer) return;

    const wasFollowing = activeViewer.followingArtistIds.includes(artist.id);

    const nextUsers = state.users.map((user) => {
      if (user.id !== activeViewer.id) return user;

      return {
        ...user,
        followingArtistIds: wasFollowing
          ? user.followingArtistIds.filter((id) => id !== artist.id)
          : [...new Set([...user.followingArtistIds, artist.id])],
      };
    });

    const nextFollowerCount = nextUsers.filter((user) => user.followingArtistIds.includes(artist.id)).length;

    const artists = storage.artists.getAll();
    const nextArtists = artists.map((item) =>
      item.id === artist.id ? { ...item, followerCount: nextFollowerCount } : item
    );

    storage.users.setAll(nextUsers);
    storage.artists.setAll(nextArtists);

    setState((prev) => ({
      ...prev,
      users: nextUsers,
      artist: prev.artist ? { ...prev.artist, followerCount: nextFollowerCount } : prev.artist,
    }));

    toast.success(wasFollowing ? "Artist unfollowed" : "Artist followed");
  };

  if (!artist) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Artist not found</CardTitle>
            <CardDescription>The requested artist profile does not exist.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{artist.artistName}</CardTitle>
                {artist.isVerified && artist.approvalStatus === "approved" && (
                  <Badge className="gap-1">
                    <BadgeCheck className="size-3.5" /> Verified Artist
                  </Badge>
                )}
              </div>
              <CardDescription>{artist.bio?.trim() || "No biography available yet."}</CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Followers: {computedFollowers.toLocaleString()}</Badge>
              <Badge variant="outline">Published works: {totalPublishedWorks}</Badge>
              <Button onClick={toggleFollowByActiveViewer} disabled={!activeViewer}>
                {isFollowedByActiveViewer ? <UserRoundCheck className="size-4" /> : <UserPlus className="size-4" />}
                {isFollowedByActiveViewer ? "Unfollow Artist" : "Follow Artist"}
          </Button>
            </div>
          </div>
        </CardHeader>
      </Card>


      {activeViewer?.subscriptionTier === "gold" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border border-zinc-800 bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Headphones className="size-4" /> Total Listeners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{estimatedListeners.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border border-zinc-800 bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Music2 className="size-4" /> Total Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalStreams.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Disc3 className="size-4" /> Published Albums
            </CardTitle>
            <CardDescription>All released albums by this artist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {artistAlbums.length === 0 && <p className="text-sm text-muted-foreground">No albums released yet.</p>}

            {artistAlbums.map((album) => {
              const trackTitles = album.trackIds
                .map((trackId) => allArtistSongs.find((song) => song.id === trackId)?.title)
                .filter(Boolean) as string[];

              return (
                <div key={album.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-2">
                  <p className="text-sm font-medium">{album.title}</p>
                  <p className="text-xs text-muted-foreground">{album.genre} • {album.releaseYear}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Tracks: {album.trackIds.length}</Badge>
                    <Badge variant="outline">Duration: {toTimeLabel(album.totalDuration)}</Badge>
                  </div>
                  {trackTitles.length > 0 && (
                    <ul className="list-disc pl-5 text-xs text-zinc-300 space-y-0.5">
                      {trackTitles.map((title) => (
                        <li key={`${album.id}_${title}`}>{title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="size-4" /> Published Singles
            </CardTitle>
            <CardDescription>All released single tracks by this artist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {artistSingles.length === 0 && <p className="text-sm text-muted-foreground">No singles released yet.</p>}

            {artistSingles.map((song) => (
              <div key={song.id} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-2">
                <p className="text-sm font-medium">{song.title}</p>
                <p className="text-xs text-muted-foreground">{song.genre} • {song.releaseYear}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Streams: {song.streamCount.toLocaleString()}</Badge>
                  <Badge variant="outline">Duration: {toTimeLabel(song.duration)}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
