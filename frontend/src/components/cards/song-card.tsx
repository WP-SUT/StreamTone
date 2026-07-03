"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play, MoreHorizontal, Music2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { Song } from "@/types/models";
import { useState } from "react";
import { AddToPlaylistModal } from "@/components/playlist/add-to-playlist-modal";
import { storage } from "@/lib/storage";

interface SongCardProps {
  song: Song;
  index?: number;
  queue?: Song[];
  playlistId?: string;
  onRemoveFromPlaylist?: (songId: string) => void;
}

export default function SongCard({
  song,
  index,
  queue,
  playlistId,
  onRemoveFromPlaylist,
}: SongCardProps) {
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

  const handleRemoveFromPlaylist = () => {
    if (onRemoveFromPlaylist) {
      onRemoveFromPlaylist(song.id);
      setShowMenu(false);
    }
  };

  const { title, artistName, duration, coverUrl, albumId } = song;
  const albumName = storage.albums.findById(albumId as string)?.title;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div
        className={`group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5 cursor-pointer ${isCurrentlyPlaying ? "bg-white/10" : ""
          }`}
        onClick={handlePlay}
      >
        {/* Index or playing indicator */}
        {index !== undefined ? (
          <span className="w-4 text-sm text-gray-400 text-center flex-shrink-0">
            {isCurrentlyPlaying ? (
              <Play size={12} className="text-primary ml-auto" fill="currentColor" />
            ) : (
              index
            )}
          </span>
        ) : null}

        {/* Album cover */}
        <div className="relative flex-shrink-0 w-10 h-10">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full p-3 items-center justify-center bg-white/10">
              <Music2 className="h-10 w-10 text-white/30" />
            </div>
          )}
        </div>

        {/* Title, artist, and album */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium truncate ${isCurrentlyPlaying ? "text-primary" : "text-white"
              }`}
          >
            {title}
          </h4>
          <div className="flex items-center gap-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">{artistName}</p>
            {albumId && albumName && (
              <>
                <span className="text-xs text-gray-600 flex-shrink-0">·</span>
                <Link
                  href={`/albums/${albumId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-gray-400 truncate hover:text-white hover:underline transition-colors"
                >
                  {albumName}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Duration */}
        <span className="text-sm text-gray-400 flex-shrink-0 hidden lg:block">
          {formatDuration(duration)}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            aria-label={`Like ${title}`}
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Heart size={16} />
          </button>

          <div className="relative">
            <button
              aria-label="More options"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 bottom-8 bg-zinc-800 rounded-lg shadow-xl py-2 w-44 z-20 border border-zinc-700">
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
                  {playlistId && onRemoveFromPlaylist && (
                    <button
                      onClick={handleRemoveFromPlaylist}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 transition"
                    >
                      Remove from Playlist
                    </button>
                  )}
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
        userId="u1"
      />
    </>
  );
}
