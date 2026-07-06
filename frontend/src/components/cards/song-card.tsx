"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play, MoreHorizontal, Music2, ListPlus, ListX, ListEnd } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { Song } from "@/types/models";
import { useState } from "react";
import { AddToPlaylistModal } from "@/components/playlist/add-to-playlist-modal";
import { storage } from "@/lib/storage";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  };

  const handleRemoveFromPlaylist = () => {
    if (onRemoveFromPlaylist) {
      onRemoveFromPlaylist(song.id);
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
          <span className="w-4 text-sm text-gray-400text-center flex-shrink-0">
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
          </button><DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              className="glass border-zinc-700/30min-w-44"
            >
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddToQueue; }}>
                <ListEnd size={14} />
                Add to Queue
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); setShowAddToPlaylist(true); }}
              >
                <ListPlus size={14} />
                Add to Playlist
              </DropdownMenuItem>

              {playlistId && onRemoveFromPlaylist && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => { e.stopPropagation(); handleRemoveFromPlaylist; }}>
                    <ListX size={14} />
                    Remove from Playlist
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
