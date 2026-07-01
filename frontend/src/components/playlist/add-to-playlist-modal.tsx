// src/components/playlist/add-to-playlist-modal.tsx
"use client";

import { X, Plus, Check } from "lucide-react";
import { usePlaylistStore } from "@/store/playlist-store";
import { CreatePlaylistModal } from "./create-playlist-modal";
import { useState } from "react";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  userId: string;
}

export function AddToPlaylistModal({
  isOpen,
  onClose,
  songId,
  userId,
}: AddToPlaylistModalProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const userPlaylists = usePlaylistStore((s) => s.getUserPlaylists(userId));
  const addSongToPlaylist = usePlaylistStore((s) => s.addSongToPlaylist);

  if (!isOpen) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, songId);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 shadow-2xl max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add to Playlist</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition mb-4"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="font-medium">Create New Playlist</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {userPlaylists.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">
                You don't have any playlists yet
              </p>
            ) : (
              userPlaylists.map((playlist) => {
                const alreadyAdded = playlist.songIds.includes(songId);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={alreadyAdded}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                  >
                    <img
                      src={playlist.coverUrl || "https://picsum.photos/seed/default/300"}
                      alt={playlist.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="flex-1 text-left font-medium">
                      {playlist.title}
                    </span>
                    {alreadyAdded && (
                      <Check size={20} className="text-emerald-500" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={userId}
      />
    </>
  );
}
