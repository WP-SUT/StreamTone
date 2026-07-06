"use client";

import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { CreatePlaylistModal } from "./create-playlist-modal";
import { storage } from "@/lib/storage";
import { User } from "@/types/models";
import { playlistService } from "@/services/playlist-service";

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
  const [, setUpdateTrigger] = useState(0);
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null);

  const currentUser = storage.session.get() as User;
  const userPlaylists = playlistService.getByOwner(currentUser.id);

  if (!isOpen) return null;

  const handleToggle = (playlistId: string, isAdded: boolean) => {
    if (isAdded) {
      playlistService.removeSong(playlistId, songId);
    } else {
      playlistService.addSong(playlistId, songId);
    }
    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="glass rounded-lg w-full max-w-md p-6 shadow-2xl max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gradient">Add to Playlist</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition mb-4 glow-primary"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white">
              <Plus size={16} />
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
                const isHovered = hoveredPlaylist === playlist.id;
                return (
                  <button
                    key={playlist.id}
                    onClick={() => handleToggle(playlist.id, alreadyAdded)}
                    onMouseEnter={() => setHoveredPlaylist(playlist.id)}
                    onMouseLeave={() => setHoveredPlaylist(null)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition glow-secondary relative"
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
                      <>
                        <Check size={20} className="text-emerald-500" />
                        {isHovered && (
                          <span className="absolute right-12 bg-zinc-900/95 text-zinc-200 text-xs px-2 py-1 rounded whitespace-nowrap">
                            Remove from playlist
                          </span>
                        )}
                      </>
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
