"use client";

import Image from "next/image";
import { Heart, Play, MoreHorizontal } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { Song } from "@/types/models";


interface SongCardProps {
  song: Song;
  index?: number;
  queue?: Song[];
}

export default function SongCard({ song, index, queue }: SongCardProps) {
  const playSong = usePlayerStore((state) => state.playSong);
  const currentSongId = usePlayerStore((state) => state.currentSong?.id);
  const storeIsPlaying = usePlayerStore((state) => state.isPlaying);

  // Derive actual playing state from store
  const isCurrentlyPlaying = currentSongId === song.id && storeIsPlaying;

  const handlePlay = () => {
    playSong(song, queue ?? [song]);
  };

  const { title, artistName, duration, coverUrl } = song;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
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

      {/* Album cover with play button overlay */}
      <div className="relative flex-shrink-0 w-10 h-10 group/cover">
        <Image
          src={coverUrl as string}
          alt={`${title} cover`}
          width={40}
          height={40}
          className="rounded object-cover"
        />
        <div
          className={`absolute inset-0 bg-black/40 rounded flex items-center justify-center transition-opacity ${
            isCurrentlyPlaying
              ? "opacity-100"
              : "opacity-0 group-hover/cover:opacity-100"
          }`}
        >
          <button
            aria-label={`Play ${title}`}
            onClick={handlePlay}
            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Play size={12} fill="currentColor" />
          </button>
        </div>
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
      <span className="text-sm text-gray-400 flex-shrink-0">
        {formatDuration(duration)}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          aria-label={`Like ${title}`}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Heart size={16} />
        </button>
        <button
          aria-label="More options"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
