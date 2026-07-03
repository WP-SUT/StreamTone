"use client";

import { useParams, useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { usePlayerStore } from "@/store/player-store";
import { storage } from "@/lib/storage";
import { playlistService } from "@/services/playlist-service";
import { RenamePlaylistModal } from "@/components/playlist/rename-playlist-modal";
import { DeletePlaylistModal } from "@/components/playlist/delete-playlist-modal";
import SongCard from "@/components/cards/song-card";
import SongCardList from "@/components/cards/song-card-list";
import MediaPageLayout from "@/components/layout/media-page/media-page-layout";
import { AddButton } from "@/components/ui/add-button";

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const playlist = playlistService.getById(playlistId);
  const { playSong } = usePlayerStore();

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-zinc-400">Playlist not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 rounded-full transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const playlistSongs = storage.songs.getAll().filter((s) => playlist.songIds.includes(s.id));

  const totalDuration = playlistSongs.reduce((acc, s) => acc + s.duration, 0);
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const mins = Math.floor((totalDuration % 3600) / 60);
    return hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
  };

  const metadata = (
    <>
      <span>
        {playlistSongs.length} {playlistSongs.length === 1 ? "song" : "songs"}
      </span>
      {totalDuration > 0 && (
        <>
          <span>•</span>
          <span>{formatTotalDuration()}</span>
        </>
      )}
    </>
  );

  const actions = (
    <div className="flex items-center gap-2">
      <AddButton
        href="/albums-and-singles"
        ariaLabel="Add songs to playlist"
        className="w-9 h-9 md:w-10 md:h-10"
      />
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 text-zinc-400 hover:text-white transition flex items-center justify-center"
          aria-label="Playlist options"
        >
          <MoreVertical size={24} />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute top-12 left-4 bg-zinc-800 rounded-lg shadow-xl py-2 w-48 z-20 border border-zinc-700">
              <button
                onClick={() => { setShowRenameModal(true); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition"
              >
                Rename Playlist
              </button>
              <button
                onClick={() => { setShowDeleteModal(true); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 text-red-400 transition"
              >
                Delete Playlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <MediaPageLayout
        onBack={() => router.back()}
        coverUrl={playlist.coverUrl}
        coverAlt={playlist.title}
        label="Playlist"
        title={playlist.title}
        metadata={metadata}
        onPlayAll={() => playlistSongs.length > 0 && playSong(playlistSongs[0], playlistSongs)}
        disablePlay={playlistSongs.length === 0}
        actions={actions}
        isEmpty={playlistSongs.length === 0}
        emptyMessage="No songs in this playlist yet"
      >
        <SongCardList>
          {playlistSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              index={index + 1}
              queue={playlistSongs}
              playlistId={playlist.id}
              onRemoveFromPlaylist={(songId) =>
                playlistService.removeSong(playlistId, songId)
              }
            />
          ))}
        </SongCardList>
      </MediaPageLayout>
      
      <RenamePlaylistModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        playlistId={playlist.id}
      />
      <DeletePlaylistModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        playlistId={playlist.id}
      />
    </>
  );
}
