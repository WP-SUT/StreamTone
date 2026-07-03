import Link from "next/link";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { storage } from "@/lib/storage";
import MediaCard from "@/components/cards/media-card";

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
  const playSong = usePlayerStore((s) => s.playSong);

  const handlePlayAlbum = (e: React.MouseEvent) => {
    e.preventDefault();
    const album = storage.albums.findById(id.toString());
    if (!album) return;
    const albumSongs = storage.songs.getAll().filter((s) => album.trackIds.includes(s.id));
    if (albumSongs.length > 0) playSong(albumSongs[0], albumSongs);
  };

  const overlay = (
    <button
      aria-label={`Play ${title}`}
      onClick={handlePlayAlbum}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
    >
      <Play size={16} fill="currentColor" />
    </button>
  );

  const subtitle = (
    <>
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
    </>
  );

  const extra = trackCount !== undefined ? (
    <span className="text-xs text-neutral-500">
      {trackCount} {trackCount === 1 ? "track" : "tracks"}
    </span>
  ) : undefined;

  return (
    <MediaCard
      href={cardHref}
      cover={cover}
      coverAlt={title}
      title={title}
      overlay={overlay}
      subtitle={subtitle}
      extra={extra}
    />
  );
}
