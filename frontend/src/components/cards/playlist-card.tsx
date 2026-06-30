"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Music2 } from "lucide-react";

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

  return (
    <div className="group flex flex-col gap-2 w-36 sm:w-40 md:w-44 shrink-0">
      {/* Cover */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/10">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Fallback when no cover image */
          <div className="flex h-full w-full items-center justify-center bg-white/10">
            <Music2 className="h-10 w-10 text-white/30" />
          </div>
        )}

        {/* Play overlay */}
        <button
          aria-label={`Play ${title}`}
          onClick={(e) => e.preventDefault()}
          className="
            absolute bottom-2 right-2
            flex items-center justify-center
            h-9 w-9 rounded-full
            bg-purple-600 text-white shadow-lg
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200
          "
        >
          <Play className="h-4 w-4 fill-white" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <Link
          href={destination}
          className="truncate text-sm font-semibold text-white hover:text-purple-400 transition-colors"
        >
          {title}
        </Link>

        <p className="truncate text-xs text-white/50">
          {owner && ownerId ? (
            <Link
              href={`/profile/${ownerId}`}
              className="hover:text-white/80 transition-colors"
            >
              {owner}
            </Link>
          ) : owner ? (
            owner
          ) : null}

          {owner && trackCount != null && (
            <span className="mx-1">·</span>
          )}

          {trackCount != null && (
            <span>{trackCount} tracks</span>
          )}
        </p>
      </div>
    </div>
  );
}
