"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlaylistCard from "@/components/cards/playlist-card";
import SectionHeader from "@/components/cards/section-header";
import { usePlaylistStore } from "@/store/playlist-store";
import CardList from "@/components/cards/card-list";

export default function PlaylistsPage() {
  const playlists = usePlaylistStore((state) => state.playlists);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionHeader title="Playlists" />
        <Button asChild>
          <Link href="/new-playlist">
            <Plus className="h-4 w-4 mr-2" />
            New Playlist
          </Link>
        </Button>
      </div>

      {/* Playlists Flex Wrap */}
      {playlists.length > 0 ? (
        <CardList>
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              ownerId={playlist.ownerId}
              cover={playlist.coverUrl}
              trackCount={playlist.songIds.length}
            />
          ))}
        </CardList> 
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-neutral-400 mb-4">No playlists yet</p>
          <Button asChild>
            <Link href="/new-playlist">
              <Plus className="h-4 w-4 mr-2" />
              Create your first playlist
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
