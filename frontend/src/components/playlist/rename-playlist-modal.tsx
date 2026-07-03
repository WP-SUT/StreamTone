// src/components/playlist/rename-playlist-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { playlistService } from "@/services/playlist-service";

interface RenamePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}

export function RenamePlaylistModal({
  isOpen,
  onClose,
  playlistId,
}: RenamePlaylistModalProps) {
  const [title, setTitle] = useState("");
  const getPlaylistById = playlistService.getById;
  
  useEffect(() => {
    if (isOpen) {
      const playlist = getPlaylistById(playlistId);
      setTitle(playlist?.title || "");
    }
  }, [isOpen, playlistId, getPlaylistById]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playlistService.rename(playlistId, title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-lg w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gradient">Rename Playlist</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">
              New Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-500 transition"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-zinc-700/50 disabled:text-zinc-500 rounded-lg transition font-medium glow-primary"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
