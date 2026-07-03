"use client";

import { playlistService } from "@/services/playlist-service";
import { X, AlertTriangle } from "lucide-react";

interface DeletePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}

export function DeletePlaylistModal({
  isOpen,
  onClose,
  playlistId,
}: DeletePlaylistModalProps) {
  if (!isOpen) return null;

  const playlist = playlistService.getById(playlistId);

  const handleDelete = () => {
    playlistService.delete(playlistId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-md p-6 shadow-2xl glow-primary">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            <span className="text-gradient">Delete Playlist</span>
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-zinc-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">"{playlist?.title}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/30 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
