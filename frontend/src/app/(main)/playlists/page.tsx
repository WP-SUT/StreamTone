"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlaylistCard from "@/components/cards/playlist-card";
import SectionHeader from "@/components/cards/section-header";
import CardList from "@/components/cards/playlist-card-list";
import { storage } from "@/lib/storage";
import { playlistService } from "@/services/playlist-service";
import { User } from "@/types/models";
import { CreatePlaylistModal } from "@/components/playlist/create-playlist-modal";

export default function PlaylistsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentUser = storage.session.get() as User;
  const playlists = playlistService.getByOwner(currentUser.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionHeader title="Playlists" />
        {playlists.length > 0 && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Playlist
          </Button>
        )}
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
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create your first playlist
          </Button>
        </div>
      )}<CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={currentUser.id}
      />
    </div>
  );
}
