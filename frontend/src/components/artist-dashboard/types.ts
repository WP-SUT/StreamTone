import type { Album, Artist, Song } from "@/types/models";

export type ReleaseType = "single" | "album";

export interface PublishTrackPayload {
  title: string;
  audioFile: File;
  lyrics: string;
  collaborators: string[];
  duration: number;
}

export interface PublishPayload {
  releaseType: ReleaseType;
  releaseTitle: string;
  genre: string;
  releaseYear: number;
  coverFile: File | null;
  tracks: PublishTrackPayload[];
}

export interface WorkMetricRow {
  id: string;
  title: string;
  type: "Single" | "Album" | "Track";
  streams: number;
  listeners: number;
  revenue: number;
}

export interface SongEditDraft {
  title: string;
  genre: string;
  releaseYear: number;
  lyrics: string;
  collaboratorsText: string;
  coverUrl: string;
}

export interface AlbumEditDraft {
  title: string;
  genre: string;
  releaseYear: number;
  coverUrl: string;
}

export interface ArtistProfileDraft {
  artistName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  portfolioUrls: string[];
}

export function toSongEditDraft(song: Song): SongEditDraft {
  return {
    title: song.title,
    genre: song.genre,
    releaseYear: song.releaseYear,
    lyrics: song.lyrics ?? "",
    collaboratorsText: (song.collaborators ?? []).join(", "),
    coverUrl: song.coverUrl ?? "",
  };
}

export function toAlbumEditDraft(album: Album): AlbumEditDraft {
  return {
    title: album.title,
    genre: album.genre,
    releaseYear: album.releaseYear,
    coverUrl: album.coverUrl,
  };
}

export function toArtistProfileDraft(artist: Artist): ArtistProfileDraft {
  return {
    artistName: artist.artistName,
    email: artist.email,
    bio: artist.bio ?? "",
    avatarUrl: artist.avatarUrl ?? "",
    portfolioUrls: artist.portfolioUrls ?? [],
  };
}
