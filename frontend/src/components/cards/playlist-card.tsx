"use client";

import Link from "next/link";
import { storage } from "@/lib/storage";
import { usePlayerStore } from "@/store/player-store";
import { playlistService } from "@/services/playlist-service";
import { PlayButton } from "@/components/ui/play-button";
import { AddButton } from "@/components/ui/add-button";
import MediaCard from "@/components/cards/media-card";

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

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    const playlist = playlistService.getById(id);
    if (!playlist) return;
    const songs = storage.songs.getAll().filter((s) => playlist.songIds.includes(s.id));
    if (songs.length > 0) playSong(songs[0], songs);
  };

  const overlay = (
    <>
      <AddButton href="/albums-and-singles" ariaLabel={`Add songs to ${title}`} />
      <PlayButton onClick={handlePlay} ariaLabel={`Play ${title}`} />
    </>
  );

  const subtitle = (
    <>
      {owner && ownerId ? (
        <Link href={`/profile/${ownerId}`} className="hover:text-white hover:underline truncate">
          {owner}
        </Link>
      ) : owner ? (
        <span className="truncate">{owner}</span>
      ) : null}

      {owner && trackCount != null && <span className="shrink-0">·</span>}

      {trackCount != null && (
        <span className="shrink-0">
          {trackCount} {trackCount === 1 ? "track" : "tracks"}
        </span>
      )}
    </>
  );

  return (
    <MediaCard
      href={destination}
      cover={cover}
      coverAlt={title}
      title={title}
      overlay={overlay}
      subtitle={subtitle}
    />
  );
}
