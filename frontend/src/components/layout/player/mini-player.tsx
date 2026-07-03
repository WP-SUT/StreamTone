"use client";

import { useEffect, useState } from "react";
import { Play, Pause, SkipForward } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { darkenColor, calculateProgress } from "@/lib/player/utils";
import FullPlayer from "./full-player";

export default function MiniPlayer() {
  const { currentSong, isPlaying, progress, duration, play, pause, next } = usePlayerStore();
  const [expanded, setExpanded] = useState(false);

  // Lock body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  if (!currentSong) return null;

  if (expanded) {
    return <FullPlayer onCollapse={() => setExpanded(false)} />;
  }

  const accentColor = "hsl(263, 85%, 65%)";
  const bgColor = darkenColor(currentSong.dominantColor ?? "hsl(263, 46%, 19%)", 0.5);
  const progressPercent = calculateProgress(progress, duration);

  return (
    <div
      className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none md:hidden"
      aria-label="Mini player"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 w-full max-w-sm rounded-2xl px-3 py-2 shadow-2xl border border-white/10 text-white overflow-hidden relative cursor-pointer"
        style={{ backgroundColor: bgColor }}
        onClick={() => setExpanded(true)}
      >
        {/* Progress Indicator */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 rounded-full">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
          />
        </div>

        {/* Cover */}
        <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 bg-white/10">
          {currentSong.coverUrl ? (
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/10" />
          )}
        </div>

        {/* Song Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium truncate leading-tight">
            {currentSong.title}
          </span>
          <span className="text-xs text-white/60 truncate leading-tight">
            {currentSong.artistName}
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isPlaying ? pause() : play();
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition hover:scale-105"
          style={{ backgroundColor: accentColor }}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-white" />
          ) : (
            <Play className="w-3.5 h-3.5 text-white" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next track"
          className="p-1 text-white/70 hover:text-white transition shrink-0"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
