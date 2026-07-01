// src/components/song/song-card.tsx
"use client";

import Image from "next/image";
import { Heart, Play, MoreHorizontal } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { Song } from "@/types/models";
import { useState } from "react";
import { AddToPlaylistModal } from "@/components/playlist/add-to-playlist-modal";

interface SongCardProps {
  song: Song;
  index?: number;
  queue?: Song[];
}

export default function SongCard({ song, index, queue }: SongCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const playSong = usePlayerStore((state) => state.playSong);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const currentSongId = usePlayerStore((state) => state.currentSong?.id);
  const storeIsPlaying = usePlayerStore((state) => state.isPlaying);

  const isCurrentlyPlaying = currentSongId === song.id && storeIsPlaying;

  const handlePlay = () => {
    playSong(song, queue ?? [song]);
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    setShowMenu(false);
  };

  const { title, artistName, duration, coverUrl } = song;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div
        className={`group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5 ${
          isCurrentlyPlaying ? "bg-white/10" : ""
        }`}
      >
        {/* Index or playing indicator */}
        {index !== undefined ? (
          <span className="w-4 text-sm text-gray-400 text-center flex-shrink-0">
            {isCurrentlyPlaying ? (
              <Play
                size={12}
                className="text-primary ml-auto"
                fill="currentColor"
              />
            ) : (
              index
            )}
          </span>
        ) : null}

        {/* Album cover */}
        <div className="relative flex-shrink-0 w-10 h-10">
          <Image
            src={coverUrl as string}
            alt={`${title} cover`}
            width={40}
            height={40}
            className="rounded object-cover"
          />
        </div>

        {/* Title and artist */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium truncate ${
              isCurrentlyPlaying ? "text-primary" : "text-white"
            }`}
          >
            {title}
          </h4>
          <p className="text-xs text-gray-400 truncate">{artistName}</p>
        </div>

        {/* Duration */}
        <span className="text-sm text-gray-400 flex-shrink-0 hidden lg:block">
          {formatDuration(duration)}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            aria-label={`Like ${title}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Heart size={16} />
          </button>
          
          <button
            aria-label={`Play ${title}`}
            onClick={handlePlay}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Play size={14} fill="currentColor" />
          </button>

          <div className="relative">
            <button
              aria-label="More options"
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                
                {/* Menu dropdown */}
                <div className="absolute right-0 top-6 bg-zinc-800 rounded-lg shadow-xl py-2 w-44 z-20 border border-zinc-700">
                  <button
                    onClick={handleAddToQueue}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition"
                  >
                    Add to Queue
                  </button>
                  <button
                    onClick={() => {
                      setShowAddToPlaylist(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition"
                  >
                    Add to Playlist
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AddToPlaylistModal
        isOpen={showAddToPlaylist}
        onClose={() => setShowAddToPlaylist(false)}
        songId={song.id}
        userId="u1" // TODO: Replace with actual user ID from auth context
      />
    </>
  );
}
