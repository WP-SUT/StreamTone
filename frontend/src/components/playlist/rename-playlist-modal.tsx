// src/components/playlist/rename-playlist-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePlaylistStore } from "@/store/playlist-store";

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
  const renamePlaylist = usePlaylistStore((s) => s.renamePlaylist);
  const getPlaylistById = usePlaylistStore((s) => s.getPlaylistById);

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

    renamePlaylist(playlistId, title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Rename Playlist</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              New Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg transition font-medium"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
