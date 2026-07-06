"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ArtistProfileSection } from "@/components/artist-dashboard/artist-profile-section";
import { PublishReleaseSection } from "@/components/artist-dashboard/publish-release-section";
import { PublishedWorksSection } from "@/components/artist-dashboard/published-works-section";
import { WorksAnalyticsSection } from "@/components/artist-dashboard/works-analytics-section";
import type {
  ArtistProfileDraft,
  AlbumEditDraft,
  PublishPayload,
  SongEditDraft,
  WorkMetricRow,
} from "@/components/artist-dashboard/types";
import { storage } from "@/lib/storage";
import type { Album, Artist, Song } from "@/types/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ArtistDashboardState {
  currentArtist: Artist | null;
  artists: Artist[];
  songs: Song[];
  albums: Album[];
}

function buildInitialState(): ArtistDashboardState {
  const session = storage.session.get();
  const artists = storage.artists.getAll();
  const songs = storage.songs.getAll();
  const albums = storage.albums.getAll();

  if (!session || session.role !== "artist") {
    return { currentArtist: null, artists, songs, albums };
  }

  const currentArtist = artists.find((a) => a.id === session.id) ?? null;
  return { currentArtist, artists, songs, albums };
}

function estimateListeners(streamCount: number): number {
  return Math.max(1, Math.round(streamCount * 0.43));
}

function estimateRevenue(streamCount: number): number {
  return Number((streamCount * 0.0032).toFixed(2));
}

export function ArtistDashboardPage() {
  const [state, setState] = useState<ArtistDashboardState>(() => buildInitialState());

  const artistSongs = useMemo(
    () => (state.currentArtist ? state.songs.filter((song) => song.artistId === state.currentArtist?.id) : []),
    [state.songs, state.currentArtist]
  );

  const artistAlbums = useMemo(
    () => (state.currentArtist ? state.albums.filter((album) => album.artistId === state.currentArtist?.id) : []),
    [state.albums, state.currentArtist]
  );

  const artistSingles = useMemo(() => artistSongs.filter((song) => song.isSingle), [artistSongs]);
  const totalStreams = useMemo(
    () => artistSongs.reduce((sum, song) => sum + song.streamCount, 0),
    [artistSongs]
  );
  const totalWorks = artistSingles.length + artistAlbums.length;

  const analyticsRows = useMemo<WorkMetricRow[]>(() => {
    const songRows: WorkMetricRow[] = artistSongs.map((song) => ({
      id: `song_${song.id}`,
      title: song.title,
      type: song.isSingle ? "Single" : "Track",
      streams: song.streamCount,
      listeners: estimateListeners(song.streamCount),
      revenue: estimateRevenue(song.streamCount),
    }));

    const albumRows: WorkMetricRow[] = artistAlbums.map((album) => ({
      id: `album_${album.id}`,
      title: album.title,
      type: "Album",
      streams: album.streamCount,
      listeners: estimateListeners(album.streamCount),
      revenue: estimateRevenue(album.streamCount),
    }));

    return [...songRows, ...albumRows];
  }, [artistSongs, artistAlbums]);

  const persistAll = (nextArtists: Artist[], nextSongs: Song[], nextAlbums: Album[], nextCurrentArtist?: Artist | null) => {
    storage.artists.setAll(nextArtists);
    storage.songs.setAll(nextSongs);
    storage.albums.setAll(nextAlbums);

    setState((prev) => ({
      currentArtist: nextCurrentArtist ?? prev.currentArtist,
      artists: nextArtists,
      songs: nextSongs,
      albums: nextAlbums,
    }));

    if (nextCurrentArtist) {
      storage.session.set(nextCurrentArtist);
    }
  };

  const handlePublish = (payload: PublishPayload) => {
    if (!state.currentArtist) return;

    const now = new Date().toISOString();
    const coverUrl = payload.coverFile ? URL.createObjectURL(payload.coverFile) : "/cover/default-cover.jpg";

    const generatedSongs: Song[] = payload.tracks.map((track, index) => {
      const songId = `s_${Date.now()}_${index + 1}`;
      return {
        id: songId,
        title: track.title,
        artistId: state.currentArtist!.id,
        artistName: state.currentArtist!.artistName,
        albumId: undefined,
        coverUrl,
        audioUrl: URL.createObjectURL(track.audioFile),
        dominantColor: "lightpurple",
        duration: track.duration || 180,
        genre: payload.genre,
        releaseYear: payload.releaseYear,
        streamCount: 0,
        lyrics: track.lyrics,
        collaborators: track.collaborators,
        isSingle: payload.releaseType === "single",
        createdAt: now,
      };
    });

    const nextSongs = [...state.songs];
    const nextAlbums = [...state.albums];
    const nextArtists = [...state.artists];

    if (payload.releaseType === "single") {
      nextSongs.push(generatedSongs[0]);
    } else {
      const albumId = `alb_${Date.now()}`;
      const tracks = generatedSongs.map((song) => ({ ...song, albumId, isSingle: false }));
      nextSongs.push(...tracks);

      const album: Album = {
        id: albumId,
        title: payload.releaseTitle,
        artistId: state.currentArtist.id,
        artistName: state.currentArtist.artistName,
        coverUrl,
        releaseYear: payload.releaseYear,
        genre: payload.genre,
        trackIds: tracks.map((song) => song.id),
        totalDuration: tracks.reduce((sum, track) => sum + track.duration, 0),
        streamCount: 0,
        createdAt: now,
      };
      nextAlbums.push(album);
    }

    const updatedArtist: Artist = {
      ...state.currentArtist,
      singleIds: payload.releaseType === "single"
        ? [...new Set([...state.currentArtist.singleIds, generatedSongs[0].id])]
        : state.currentArtist.singleIds,
      albumIds: payload.releaseType === "album"
        ? [...new Set([...state.currentArtist.albumIds, nextAlbums[nextAlbums.length - 1].id])]
        : state.currentArtist.albumIds,
    };

    const artistIndex = nextArtists.findIndex((artist) => artist.id === updatedArtist.id);
    if (artistIndex !== -1) nextArtists[artistIndex] = updatedArtist;

    persistAll(nextArtists, nextSongs, nextAlbums, updatedArtist);
  };

  const handleSaveSingle = (songId: string, draft: SongEditDraft) => {
    if (!state.currentArtist) return;

    const nextSongs = state.songs.map((song) => {
      if (song.id !== songId) return song;
      return {
        ...song,
        title: draft.title.trim() || song.title,
        genre: draft.genre.trim() || song.genre,
        releaseYear: draft.releaseYear,
        lyrics: draft.lyrics,
        collaborators: draft.collaboratorsText
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean),
        coverUrl: draft.coverUrl.trim() || song.coverUrl,
      };
    });

    storage.songs.setAll(nextSongs);
    setState((prev) => ({ ...prev, songs: nextSongs }));
    toast.success("Single updated");
  };

  const handleDeleteSingle = (songId: string) => {
    if (!state.currentArtist) return;

    const nextSongs = state.songs.filter((song) => song.id !== songId);
    const updatedArtist: Artist = {
      ...state.currentArtist,
      singleIds: state.currentArtist.singleIds.filter((id) => id !== songId),
    };
    const nextArtists = state.artists.map((artist) => (artist.id === updatedArtist.id ? updatedArtist : artist));

    persistAll(nextArtists, nextSongs, state.albums, updatedArtist);
    toast.success("Single deleted");
  };

  const handleSaveAlbum = (albumId: string, draft: AlbumEditDraft) => {
    const nextAlbums = state.albums.map((album) => {
      if (album.id !== albumId) return album;
      return {
        ...album,
        title: draft.title.trim() || album.title,
        genre: draft.genre.trim() || album.genre,
        releaseYear: draft.releaseYear,
        coverUrl: draft.coverUrl.trim() || album.coverUrl,
      };
    });

    storage.albums.setAll(nextAlbums);
    setState((prev) => ({ ...prev, albums: nextAlbums }));
    toast.success("Album updated");
  };

  const handleSaveArtistProfile = (draft: ArtistProfileDraft) => {
    if (!state.currentArtist) return;

    const artistName = draft.artistName.trim();
    const email = draft.email.trim().toLowerCase();
    const avatarUrl = draft.avatarUrl.trim();
    const bio = draft.bio.trim();
    const portfolioUrls = draft.portfolioUrls.map((item) => item.trim()).filter(Boolean);

    if (artistName.length < 2) {
      toast.error("Artist name must be at least 2 characters");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Email is invalid");
      return;
    }

    const emailTaken = state.artists.some(
      (artist) => artist.id !== state.currentArtist?.id && artist.email.toLowerCase() === email
    );
    if (emailTaken) {
      toast.error("This email is already used by another artist");
      return;
    }

    const updatedArtist: Artist = {
      ...state.currentArtist,
      artistName,
      email,
      bio,
      avatarUrl: avatarUrl || undefined,
      portfolioUrls,
    };

    const nextArtists = state.artists.map((artist) => (artist.id === updatedArtist.id ? updatedArtist : artist));
    const nextSongs = state.songs.map((song) =>
      song.artistId === updatedArtist.id ? { ...song, artistName: updatedArtist.artistName } : song
    );
    const nextAlbums = state.albums.map((album) =>
      album.artistId === updatedArtist.id ? { ...album, artistName: updatedArtist.artistName } : album
    );

    persistAll(nextArtists, nextSongs, nextAlbums, updatedArtist);
    toast.success("Artist profile updated");
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (!state.currentArtist) return;

    const album = state.albums.find((a) => a.id === albumId);
    if (!album) return;

    const nextAlbums = state.albums.filter((a) => a.id !== albumId);
    const albumTrackSet = new Set(album.trackIds);
    const nextSongs = state.songs.filter((song) => !albumTrackSet.has(song.id));

    const updatedArtist: Artist = {
      ...state.currentArtist,
      albumIds: state.currentArtist.albumIds.filter((id) => id !== albumId),
    };
    const nextArtists = state.artists.map((artist) => (artist.id === updatedArtist.id ? updatedArtist : artist));

    persistAll(nextArtists, nextSongs, nextAlbums, updatedArtist);
    toast.success("Album deleted");
  };

  if (!state.currentArtist) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Artist dashboard unavailable</CardTitle>
            <CardDescription>Please log in with an artist account to manage your works.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (state.currentArtist.approvalStatus !== "approved") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Approval pending</CardTitle>
            <CardDescription>
              This panel is only available for approved artists. Your current status is: {state.currentArtist.approvalStatus}.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <section>
        <h1 className="text-2xl font-semibold">Artist Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full release management: publish tracks/albums, edit or remove released works, and monitor listeners, streams and revenue.
        </p>
      </section>

      <ArtistProfileSection
        artist={state.currentArtist}
        totalWorks={totalWorks}
        totalStreams={totalStreams}
        onSave={handleSaveArtistProfile}
      />

      <PublishReleaseSection onPublish={handlePublish} />

      <PublishedWorksSection
        singles={artistSingles}
        albums={artistAlbums}
        allSongs={artistSongs}
        onSaveSingle={handleSaveSingle}
        onDeleteSingle={handleDeleteSingle}
        onSaveAlbum={handleSaveAlbum}
        onDeleteAlbum={handleDeleteAlbum}
      />

      <WorksAnalyticsSection rows={analyticsRows} />
    </main>
  );
}
