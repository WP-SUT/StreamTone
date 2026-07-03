import { storage } from "@/lib/storage";
import type { Playlist } from "@/types/models";

export const playlistService = {
  getById(playlistId: string): Playlist | undefined {
    return storage.playlists.findById(playlistId);
  },

  getByOwner(ownerId: string): Playlist[] {
    return storage.playlists.findByOwnerId(ownerId);
  },

  create(data: { ownerId: string; title: string; coverUrl?: string }): Playlist {
    const now = new Date().toISOString();

    const playlist: Playlist = {
      id: `pl_${Date.now()}`,
      title: data.title.trim(),
      ownerId: data.ownerId,
      coverUrl: data.coverUrl,
      songIds: [],
      createdAt: now,
      updatedAt: now,
    };

    storage.playlists.upsert(playlist);

    // Sync the playlist id into the owner's playlistIds
    const owner = storage.users.findById(data.ownerId);
    if (owner && !owner.playlistIds.includes(playlist.id)) {
      storage.users.upsert({
        ...owner,
        playlistIds: [...owner.playlistIds, playlist.id],
      });
    }

    return playlist;
  },

  rename(playlistId: string, newTitle: string): Playlist {
    const playlist = storage.playlists.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    const updated: Playlist = {
      ...playlist,
      title: newTitle.trim(),
      updatedAt: new Date().toISOString(),
    };

    storage.playlists.upsert(updated);
    return updated;
  },

  updateCover(playlistId: string, coverUrl: string): Playlist {
    const playlist = storage.playlists.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    const updated: Playlist = {
      ...playlist,
      coverUrl,
      updatedAt: new Date().toISOString(),
    };

    storage.playlists.upsert(updated);
    return updated;
  },

  delete(playlistId: string): void {
    const playlist = storage.playlists.findById(playlistId);
    if (!playlist) return;

    storage.playlists.remove(playlistId);

    // Remove the id from the owner's playlistIds
    const owner = storage.users.findById(playlist.ownerId);
    if (owner) {
      storage.users.upsert({
        ...owner,
        playlistIds: owner.playlistIds.filter((id) => id !== playlistId),
      });
    }
  },

  addSong(playlistId: string, songId: string): Playlist {
    const playlist = storage.playlists.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    // Verify the song exists
    const song = storage.songs.findById(songId);
    if (!song) throw new Error("Song not found");

    // Deduplicate
    if (playlist.songIds.includes(songId)) return playlist;

    const updated: Playlist = {
      ...playlist,
      songIds: [...playlist.songIds, songId],
      updatedAt: new Date().toISOString(),
    };

    storage.playlists.upsert(updated);
    return updated;
  },

  removeSong(playlistId: string, songId: string): Playlist {
    const playlist = storage.playlists.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    const updated: Playlist = {
      ...playlist,
      songIds: playlist.songIds.filter((id) => id !== songId),
      updatedAt: new Date().toISOString(),
    };

    storage.playlists.upsert(updated);
    return updated;
  },

  reorderSongs(playlistId: string, orderedSongIds: string[]): Playlist {
    const playlist = storage.playlists.findById(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    // Ensure only songs already in the playlist are accepted
    const valid = orderedSongIds.filter((id) => playlist.songIds.includes(id));

    const updated: Playlist = {
      ...playlist,
      songIds: valid,
      updatedAt: new Date().toISOString(),
    };

    storage.playlists.upsert(updated);
    return updated;
  },
};
