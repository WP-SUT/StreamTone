// src/app/(main)/playlist/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, MoreVertical, Clock, Album } from "lucide-react";
import { usePlaylistStore } from "@/store/playlist-store";
import { mockAlbums, mockSongs } from "@/mock/data";
import { usePlayerStore } from "@/store/player-store";
import { useState } from "react";
import { RenamePlaylistModal } from "@/components/playlist/rename-playlist-modal";
import { DeletePlaylistModal } from "@/components/playlist/delete-playlist-modal";

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const playlist = usePlaylistStore((s) => s.getPlaylistById(playlistId));
  const removeSongFromPlaylist = usePlaylistStore((s) => s.removeSongFromPlaylist);
  const { playSong, addToQueue } = usePlayerStore();

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-zinc-400">Playlist not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-full transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const playlistSongs = mockSongs.filter((song) =>
    playlist.songIds.includes(song.id)
  );

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const handlePlaySong = (index: number) => {
    playSong(playlistSongs[index], playlistSongs);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = playlistSongs.reduce((acc, song) => acc + song.duration, 0);
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const mins = Math.floor((totalDuration % 3600) / 60);
    if (hours > 0) return `${hours} hr ${mins} min`;
    return `${mins} min`;
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Playlist Info */}
        <div className="flex gap-6 items-end">
          <div className="w-56 h-56 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow-2xl flex items-center justify-center">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-6xl font-bold text-white">
                {playlist.title[0].toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-sm font-semibold uppercase text-zinc-400">
              {playlist.isPublic ? "Public Playlist" : "Private Playlist"}
            </p>
            <h1 className="text-5xl font-bold">{playlist.title}</h1>
            <p className="text-zinc-400">
              {playlistSongs.length} songs • {formatTotalDuration()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayAll}
            disabled={playlistSongs.length === 0}
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
          >
            <Play size={24} fill="currentColor" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 text-zinc-400 hover:text-white transition"
            >
              <MoreVertical size={24} />
            </button>

            {showMenu && (
              <div className="absolute top-12 left-0 bg-zinc-800 rounded-lg shadow-xl py-2 w-48 z-10">
                <button
                  onClick={() => {
                    setShowRenameModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 transition"
                >
                  Rename Playlist
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 text-red-400 transition"
                >
                  Delete Playlist
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Song List */}
        <div className="space-y-2">
          <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div>Date Added</div>
            <div className="flex justify-end">
              <Clock size={16} />
            </div>
          </div>

          {playlistSongs.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              No songs in this playlist yet
            </div>
          ) : (
            playlistSongs.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 rounded-lg hover:bg-zinc-800/50 group transition"
              >
                <button
                  onClick={() => handlePlaySong(index)}
                  className="text-zinc-400 group-hover:text-white text-sm"
                >
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play
                    size={14}
                    fill="currentColor"
                    className="hidden group-hover:block"
                  />
                </button>

                <div className="flex items-center gap-3">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{song.title}</p>
                    <p className="text-sm text-zinc-400">{song.artistName}</p>
                  </div>
                </div>

                <div className="flex items-center text-zinc-400 text-sm">
                  {mockAlbums.find(album => album.id === song.albumId)?.title}
                </div>

                <div className="flex items-center text-zinc-400 text-sm">
                  {new Date(playlist.updatedAt).toLocaleDateString()}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <span className="text-zinc-400 text-sm">
                    {formatDuration(song.duration)}
                  </span>
                  <button
                    onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                    className="text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <RenamePlaylistModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        playlistId={playlist.id}
      />

      <DeletePlaylistModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        playlistId={playlist.id}
      />
    </>
  );
}
