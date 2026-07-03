"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePlayerStore } from "@/store/player-store";
import { storage } from "@/lib/storage";
import SongCard from "@/components/cards/song-card";
import SongCardList from "@/components/cards/song-card-list";
import MediaPageLayout from "@/components/layout/media-page/media-page-layout";

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;
  const { playSong } = usePlayerStore();

  const album = storage.albums.findById(albumId);

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-zinc-400">Album not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 rounded-full transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const albumSongs = storage.songs.getAll().filter((s) =>
    album.trackIds.includes(s.id)
  );

  const totalDuration = albumSongs.reduce((acc, s) => acc + s.duration, 0);
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const mins = Math.floor((totalDuration % 3600) / 60);
    return hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
  };

  const metadata = (
    <>
      <Link
        href={`/artists/${album.artistId}`}
        className="text-white font-medium hover:underline"
      >
        {album.artistName}
      </Link>
      {album.releaseYear && (
        <>
          <span>•</span>
          <span>{album.releaseYear}</span>
        </>
      )}
      {album.genre && (
        <>
          <span>•</span>
          <span>{album.genre}</span>
        </>
      )}
      {albumSongs.length > 0 && (
        <>
          <span>•</span>
          <span>
            {albumSongs.length} {albumSongs.length === 1 ? "song" : "songs"}
          </span>
          <span>•</span>
          <span>{formatTotalDuration()}</span>
        </>
      )}
    </>
  );

  return (
    <MediaPageLayout
      onBack={() => router.back()}
      coverUrl={album.coverUrl}
      coverAlt={album.title}
      label="Album"
      title={album.title}
      metadata={metadata}
      onPlayAll={() => albumSongs.length > 0 && playSong(albumSongs[0], albumSongs)}
      disablePlay={albumSongs.length === 0}
      isEmpty={albumSongs.length === 0}
      emptyMessage="No songs in this album yet"
    >
      <SongCardList>
        {albumSongs.map((song, index) => (
          <SongCard key={song.id} song={song} index={index + 1} queue={albumSongs} />
        ))}
      </SongCardList>
    </MediaPageLayout>
  );
}
