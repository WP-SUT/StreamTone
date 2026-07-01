"use client";

import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronDown,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Mic2,
  Volume2,
} from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useEffect, useState } from "react";
import QueueDrawer from "@/components/player/queue-drawer";
import LyricsModal from "@/components/player/lyrics-modal";

function darken(hex: string, amount = 0.3): string {
  if (hex.startsWith("hsl")) return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
  const b = Math.max(0, (num & 0xff) * (1 - amount));
  return `rgb(${r},${g},${b})`;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface MiniPlayerProps {
  onExpand?: () => void;
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    repeatMode,
    isShuffle,
    queue,
    play,
    pause,
    next,
    prev,
    seek,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);

  // Lock body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  if (!currentSong) return null;

  const clicked = "hsl(263, 85%, 65%)";
  const accent = currentSong.dominantColor ?? "hsl(263, 46%, 19%)";
  const bgColor = darken(accent, 0.5);
  const bgColorDep = darken(accent, 0.65);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== "off";

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  };

  // ── Full-screen expanded player ────────────────────────────────
  if (expanded) {
    return (
      <>
        <div
          className="fixed inset-0 z-50 flex flex-col text-white md:hidden"
          style={{ backgroundColor: bgColorDep }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-10 pb-4 shrink-0">
            <button
              onClick={() => setExpanded(false)}
              aria-label="Collapse player"
              className="p-2 text-white/70 hover:text-white"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <span className="text-sm font-semibold tracking-wide uppercase text-white/70">
              Now Playing
            </span>
            <button
              onClick={() => setLiked((p) => !p)}
              aria-label={liked ? "Unlike" : "Like"}
              className="p-2 transition"
              style={{ color: liked ? clicked : "rgba(255,255,255,0.5)" }}
            >
              <Heart className="w-5 h-5" fill={liked ? clicked : "none"} />
            </button>
          </div>

          {/* Cover art */}
          <div className="flex-1 flex items-center justify-center px-10 py-4 min-h-0">
            <div
              className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl"
              style={{ maxWidth: "320px" }}
            >
              {currentSong.coverUrl ? (
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <ListMusic className="w-16 h-16 text-white/30" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="px-6 pb-10 shrink-0 flex flex-col gap-4">
            {/* Song info */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 flex-1 mr-3">
                <span className="text-lg font-bold truncate">
                  {currentSong.title}
                </span>
                <span className="text-sm text-white/60 truncate">
                  {currentSong.artistName}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setLyricsOpen((p) => !p)}
                  aria-label="Lyrics"
                  className="p-1 transition"
                  style={{ color: lyricsOpen ? clicked : "rgba(255,255,255,0.5)" }}
                >
                  <Mic2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setQueueOpen(true)}
                  aria-label="Queue"
                  className="p-1 transition relative"
                  style={{ color: queueOpen ? clicked : "rgba(255,255,255,0.5)" }}
                >
                  <ListMusic className="w-5 h-5" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {queue.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1">
              <div
                className="relative w-full h-1.5 rounded-full bg-white/20 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{ width: `${progressPercent}%`, backgroundColor: clicked }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50 tabular-nums">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={toggleShuffle}
                aria-label="Shuffle"
                className="p-2 transition"
                style={{ color: isShuffle ? clicked : "rgba(255,255,255,0.5)" }}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={prev}
                aria-label="Previous"
                className="p-2 text-white/80 hover:text-white"
              >
                <SkipBack className="w-7 h-7" />
              </button>
              <button
                onClick={() => (isPlaying ? pause() : play())}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-16 h-16 rounded-full flex items-center justify-center transition hover:scale-105 shadow-lg"
                style={{ backgroundColor: clicked }}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-white" />
                ) : (
                  <Play className="w-7 h-7 text-white" />
                )}
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="p-2 text-white/80 hover:text-white"
              >
                <SkipForward className="w-7 h-7" />
              </button>
              <button
                onClick={toggleRepeat}
                aria-label="Repeat"
                className="p-2 transition"
                style={{ color: repeatActive ? clicked : "rgba(255,255,255,0.5)" }}
              >
                <RepeatIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-white/50 shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-full"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>

        <QueueDrawer isOpen={queueOpen} onClose={() => setQueueOpen(false)} />
        <LyricsModal isOpen={lyricsOpen} onClose={() => setLyricsOpen(false)} />
      </>
    );
  }

  // ── Compact mini player ────────────────────────────
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
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 rounded-full">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%`, backgroundColor: clicked }}
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

        {/* Meta */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium truncate leading-tight">
            {currentSong.title}
          </span>
          <span className="text-xs text-white/60 truncate leading-tight">
            {currentSong.artistName}
          </span>
        </div>

        {/* Play/Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isPlaying ? pause() : play();
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition hover:scale-105"
          style={{ backgroundColor: clicked }}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-white" />
          ) : (
            <Play className="w-3.5 h-3.5 text-white" />
          )}
        </button>

        {/* Next */}
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
