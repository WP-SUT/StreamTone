import Image from "next/image";
import Link from "next/link";
import { Play, MoreHorizontal } from "lucide-react";
import { Song } from "@/types/models";

interface SongCardProps {
  song: Song;
  index?: number;
  queue?: Song[];
  isPlaying?: boolean;
  onPlay?: (song: Song) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPlays(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`;
  if (plays >= 1_000) return `${(plays / 1_000).toFixed(0)}K`;
  return plays.toString();
}

export default function SongCard({
  song,
  index,
  isPlaying = false,
  onPlay,
}: SongCardProps) {
  const { id, title, artistName, artistId, albumId, coverUrl, duration, streamCount } = song;

  return (
    <div
      className={`
        group flex items-center gap-3 p-2 rounded-xl
        hover:bg-white/5 transition-colors duration-150 cursor-pointer
        ${isPlaying ? "bg-white/10" : ""}
      `}
    >
      {/* Index or cover */}
      {index !== undefined ? (
        <span className="w-6 text-xs text-neutral-500 text-right shrink-0 select-none">
          {isPlaying ? (
            <Play size={12} className="text-primary ml-auto" fill="currentColor" />
          ) : (
            index
          )}
        </span>
      ) : null}

      {/* Cover + play overlay */}
      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-neutral-800">
        <Image
          src={coverUrl as string}
          alt={`${title} cover`}
          fill
          sizes="48px"
          className="object-cover"
        />
        <div
          className={`
            absolute inset-0 flex items-center justify-center bg-black/50
            transition-opacity duration-150
            ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          <button
            aria-label={`Play ${title}`}
            onClick={() => onPlay?.(song)}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white hover:scale-110 active:scale-95 transition-transform duration-150"
          >
            <Play size={12} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Title & artist */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className={`text-sm font-medium truncate leading-tight ${
            isPlaying ? "text-primary" : "text-white"
          }`}
          title={title}
        >
          {title}
        </span>

        <div className="flex items-center gap-1 text-xs text-neutral-400 truncate">
          {artistId ? (
            <Link
              href={`/artists/${artistId}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-white hover:underline truncate"
            >
              {artistName}
            </Link>
          ) : (
            <span className="truncate">{artistName}</span>
          )}

          {albumId && (
            <>
              <span className="shrink-0">·</span>
              <Link
                href={`/albums/${albumId}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-white hover:underline truncate shrink-0"
              >
                Album
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Play count */}
      {streamCount !== undefined && (
        <span className="hidden sm:block text-xs text-neutral-500 shrink-0 w-12 text-right">
          {formatPlays(streamCount)}
        </span>
      )}

      {/* Duration */}
      {duration !== undefined && (
        <span className="text-xs text-neutral-500 shrink-0 w-10 text-right">
          {formatDuration(duration)}
        </span>
      )}

      {/* More options */}
      <button
        aria-label="More options"
        onClick={(e) => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-neutral-400 hover:text-white p-1 rounded shrink-0"
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}
