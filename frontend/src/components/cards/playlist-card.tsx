"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Music2, Plus } from "lucide-react";
import { storage } from "@/lib/storage";
import { usePlayerStore } from "@/store/player-store";
import { playlistService } from "@/services/playlist-service";

interface PlaylistCardProps {
  id: string;
  title: string;
  owner?: string;
  ownerId?: string;
  cover?: string;
  trackCount?: number;
  href?: string;
}

export default function PlaylistCard({
  id,
  title,
  owner,
  ownerId,
  cover,
  trackCount,
  href,
}: PlaylistCardProps) {
  const destination = href ?? `/playlists/${id}`;
  const playSong = usePlayerStore((s) => s.playSong);

  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.preventDefault();

    const playlist = playlistService.getById(id);
    if (!playlist) return;

    const songs = storage.songs
      .getAll()
      .filter((s) => playlist.songIds.includes(s.id));

    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  return (
    <div className="group flex flex-col gap-2 w-36 sm:w-40 md:w-44 shrink-0">
      {/* Cover */}
      <Link href={destination} className="relative block rounded-xl overflow-hidden aspect-square bg-neutral-800">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/10">
            <Music2 className="h-10 w-10 text-white/30" />
          </div>
        )}

        {/* Button overlay */}
        <div
          className="
            absolute inset-0 flex items-end justify-end p-2 gap-2
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
            transition-opacity duration-200
          "
        >
          {/* Add button */}
          <Link
            href="/albums-and-singles"
            aria-label={`Add songs to ${title}`}
            onClick={(e) => e.stopPropagation()}
            className="
              flex items-center justify-center
              w-9 h-9 rounded-full
              bg-primary text-white shadow-lg
              hover:scale-110 active:scale-95
              transition-transform duration-150
            "
          >
            <Plus size={16} />
          </Link>

          {/* Play button */}
          <button
            aria-label={`Play ${title}`}
            onClick={handlePlayPlaylist}
            className="
              flex items-center justify-center
              w-9 h-9 rounded-full
              bg-primary text-white shadow-lg
              hover:scale-110 active:scale-95
              transition-transform duration-150
            "
          >
            <Play size={16} fill="currentColor" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <Link
          href={destination}
          className="text-sm font-semibold text-white truncate hover:underline leading-tight"
          title={title}
        >
          {title}
        </Link>

        <div className="flex items-center gap-1 text-xs text-neutral-400 truncate">
          {owner && ownerId ? (
            <Link
              href={`/profile/${ownerId}`}
              className="hover:text-white hover:underline truncate"
            >
              {owner}
            </Link>
          ) : owner ? (
            <span className="truncate">{owner}</span>
          ) : null}

          {owner && trackCount != null && (
            <span className="shrink-0">·</span>
          )}

          {trackCount != null && (
            <span className="shrink-0">{trackCount} {trackCount === 1 ? "track" : "tracks"}</span>
          )}
        </div>
      </div>
    </div>
  );
}
