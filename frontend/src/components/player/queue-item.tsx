import { Song } from "@/types/models";
import { GripVertical, Play, Trash2 } from "lucide-react";

interface QueueItemProps {
  song: Song;
  index: number;
  isCurrentlyPlaying: boolean;
  onPlay: () => void;
  onRemove: () => void;
  isDraggable: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QueueItem({
  song,
  isCurrentlyPlaying,
  onPlay,
  onRemove,
  isDraggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: QueueItemProps) {
  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`
        group flex items-center gap-3 p-2 rounded-lg
        hover:bg-white/5 transition-colors cursor-pointer
        ${isCurrentlyPlaying ? "bg-white/10" : ""}
      `}
      onClick={onPlay}
    >
      {/* Drag handle */}
      {isDraggable && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-white/30" />
        </div>
      )}

      {/* Cover */}
      <div className="relative w-10 h-10 rounded overflow-hidden bg-neutral-800 shrink-0">
        {song.coverUrl ? (
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Play className="w-4 h-4" />
          </div>
        )}
        {isCurrentlyPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="w-3 h-3 text-primary" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Song info */}
      <div className="flex flex-col min-w-0 flex-1">
        <span
          className={`text-sm truncate ${
            isCurrentlyPlaying ? "text-primary font-medium" : "text-white"
          }`}
          title={song.title}
        >
          {song.title}
        </span>
        <span className="text-xs text-white/50 truncate" title={song.artistName}>
          {song.artistName}
        </span>
      </div>

      {/* Duration */}
      <span className="text-xs text-white/40 shrink-0">
        {formatDuration(song.duration)}
      </span>

      {/* Remove button */}
      {!isCurrentlyPlaying && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove from queue"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-white/50 hover:text-white shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
