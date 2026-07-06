// src/components/player/queue-drawer.tsx
"use client";

import { X, GripVertical, Play, Trash2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useState } from "react";
import type { Song } from "@/types/models";
import QueueItem from "./queue-item";

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QueueDrawer({ isOpen, onClose }: QueueDrawerProps) {
  const {
    queue,
    currentIndex,
    currentSong,
    removeFromQueue,
    clearQueue,
    playSong,
    reorderQueue,
  } = usePlayerStore();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    reorderQueue(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const upcomingSongs = queue.slice(currentIndex + 1);
  const previousSongs = queue.slice(0, currentIndex);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-neutral-900 z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Queue</h2>
          <button
            onClick={onClose}
            aria-label="Close queue"
            className="p-2 rounded-full hover:bg-white/10 transition text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue content */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/50 px-6 text-center">
              <Play className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No songs in queue</p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Now Playing */}
              {currentSong && (
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Now Playing
                  </h3>
                  <QueueItem
                    song={currentSong}
                    index={currentIndex}
                    isCurrentlyPlaying={true}
                    onPlay={() => {}}
                    onRemove={() => {}}
                    isDraggable={false}
                  />
                </div>
              )}

              {/* Up Next */}
              {upcomingSongs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Up Next ({upcomingSongs.length})
                    </h3>
                    {upcomingSongs.length > 0 && (
                      <button
                        onClick={clearQueue}
                        className="text-xs text-white/50 hover:text-white transition"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {upcomingSongs.map((song, idx) => {
                      const queueIndex = currentIndex + 1 + idx;
                      return (
                        <QueueItem
                          key={`${song.id}-${queueIndex}`}
                          song={song}
                          index={queueIndex}
                          isCurrentlyPlaying={false}
                          onPlay={() => playSong(song, queue)}
                          onRemove={() => removeFromQueue(queueIndex)}
                          isDraggable={true}
                          onDragStart={(e) => handleDragStart(e, queueIndex)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, queueIndex)}
                          onDragEnd={handleDragEnd}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Previously Played */}
              {previousSongs.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Previously Played ({previousSongs.length})
                  </h3>
                  <div className="space-y-1">
                    {previousSongs.map((song, idx) => (
                      <QueueItem
                        key={`${song.id}-${idx}`}
                        song={song}
                        index={idx}
                        isCurrentlyPlaying={false}
                        onPlay={() => playSong(song, queue)}
                        onRemove={() => removeFromQueue(idx)}
                        isDraggable={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


