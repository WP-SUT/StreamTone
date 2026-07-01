import Image from "next/image";
import Link from "next/link";
import { Music2, Play } from "lucide-react";

interface AlbumCardProps {
  id: string | number;
  title: string;
  artist: string;
  artistId?: string | number;
  cover: string;
  releaseYear?: number | string;
  trackCount?: number;
  href?: string;
}

export default function AlbumCard({
  id,
  title,
  artist,
  artistId,
  cover,
  releaseYear,
  trackCount,
  href,
}: AlbumCardProps) {
  const cardHref = href ?? `/albums/${id}`;

  return (
    <div className="group flex flex-col gap-2 w-36 sm:w-40 md:w-44 shrink-0">
      {/* Cover */}
      <Link href={cardHref} className="relative block rounded-xl overflow-hidden aspect-square bg-neutral-800">
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

        {/* Play button overlay */}
        <div
          className="
            absolute inset-0 flex items-end justify-end p-2
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
            transition-opacity duration-200
          "
        >
          <button
            aria-label={`Play ${title}`}
            onClick={(e) => {
              e.preventDefault();
              // TODO: dispatch play action for this album
            }}
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
          href={cardHref}
          className="text-sm font-semibold text-white truncate hover:underline leading-tight"
          title={title}
        >
          {title}
        </Link>

        <div className="flex items-center gap-1 text-xs text-neutral-400 truncate">
          {artistId ? (
            <Link
              href={`/artists/${artistId}`}
              className="hover:text-white hover:underline truncate"
            >
              {artist}
            </Link>
          ) : (
            <span className="truncate">{artist}</span>
          )}

          {releaseYear && (
            <>
              <span className="shrink-0">·</span>
              <span className="shrink-0">{releaseYear}</span>
            </>
          )}
        </div>

        {trackCount !== undefined && (
          <span className="text-xs text-neutral-500">
            {trackCount} {trackCount === 1 ? "track" : "tracks"}
          </span>
        )}
      </div>
    </div>
  );
}
