// src/store/playlist-store.ts
import { create } from "zustand";
import type { Playlist } from "@/types/models";
import { mockPlaylists } from "@/mock/data";

interface PlaylistState {
  playlists: Playlist[];
  
  // CRUD operations
  createPlaylist: (title: string, ownerId: string, isPublic?: boolean) => Playlist;
  renamePlaylist: (playlistId: string, newTitle: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  
  // Utilities
  getUserPlaylists: (userId: string) => Playlist[];
  getPlaylistById: (playlistId: string) => Playlist | undefined;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [
    // Mock data - will be replaced with API calls
    ...mockPlaylists
  ],

  createPlaylist: (title, ownerId, isPublic = false) => {
    const newPlaylist: Playlist = {
      id: `pl${Date.now()}`,
      title,
      ownerId,
      songIds: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      playlists: [...state.playlists, newPlaylist],
    }));
    
    return newPlaylist;
  },

  renamePlaylist: (playlistId, newTitle) => {
    set((state) => ({
      playlists: state.playlists.map((pl) =>
        pl.id === playlistId
          ? { ...pl, title: newTitle, updatedAt: new Date().toISOString() }
          : pl
      ),
    }));
  },

  deletePlaylist: (playlistId) => {
    set((state) => ({
      playlists: state.playlists.filter((pl) => pl.id !== playlistId),
    }));
  },

  addSongToPlaylist: (playlistId, songId) => {
    set((state) => ({
      playlists: state.playlists.map((pl) =>
        pl.id === playlistId && !pl.songIds.includes(songId)
          ? {
              ...pl,
              songIds: [...pl.songIds, songId],
              updatedAt: new Date().toISOString(),
            }
          : pl
      ),
    }));
  },

  removeSongFromPlaylist: (playlistId, songId) => {
    set((state) => ({
      playlists: state.playlists.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              songIds: pl.songIds.filter((id) => id !== songId),
              updatedAt: new Date().toISOString(),
            }
          : pl
      ),
    }));
  },

  getUserPlaylists: (userId) => {
    return get().playlists.filter((pl) => pl.ownerId === userId);
  },

  getPlaylistById: (playlistId) => {
    return get().playlists.find((pl) => pl.id === playlistId);
  },
}));
