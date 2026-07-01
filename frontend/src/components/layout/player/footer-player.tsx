// src/components/layout/player/footer-player.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";
import { usePlayerStore } from "@/store/player-store";


// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function darken(hex: string, amount = 0.3): string {
  if (hex.startsWith("hsl")) return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
  const b = Math.max(0, (num & 0xff) * (1 - amount));
  return `rgb(${r},${g},${b})`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FooterPlayer() {
  // Zustand store
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    repeatMode,
    isShuffle,
    play,
    pause,
    next,
    prev,
    seek,
    setVolume,
    setProgress,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  // Local state
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Brand purple as fallback
  const clicked = "hsl(263, 85%, 65%)";
  const accent = currentSong?.dominantColor ?? "hsl(263, 46%, 19%)";
  const bgColor = darken(accent, 0.55);

  // Simulated playback tick
  useEffect(() => {
    if (isPlaying && duration > 0) {
      tickRef.current = setInterval(() => {
        setProgress(Math.min(progress + 1, duration));
        
        // Auto-advance when song ends
        if (progress >= duration - 1) {
          if (repeatMode === "one") {
            setProgress(0);
          } else {
            next();
          }
        }
      }, 1000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isPlaying, progress, duration, repeatMode, next, setProgress]);

  // Reset progress on song change
  useEffect(() => {
    setProgress(0);
  }, [currentSong?.id, setProgress]);

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * duration;
    seek(newProgress);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
    setMuted(false);
  };

  const handleMuteToggle = () => {
    if (muted) {
      setMuted(false);
    } else {
      setMuted(true);
    }
  };

  // Get repeat icon
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== "off";

  // If no song, render minimal placeholder
  if (!currentSong) {
    return (
      <footer
        className="fixed bottom-0 inset-x-0 z-50 text-white shadow-lg"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-center justify-center px-6 py-4">
          <span className="text-sm text-white/50">No song playing</span>
        </div>
      </footer>
    );
  }

  // ── Shared JSX pieces ──────────────────────────────────────────────────────
  const Cover = (
    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-white/10">
      {currentSong.coverUrl ? (
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/30">
          <ListMusic className="w-5 h-5" />
        </div>
      )}
    </div>
  );

  const SongMeta = (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-sm font-medium text-white truncate">
        {currentSong.title}
      </span>
      <span className="text-xs text-white/60 truncate">
        {currentSong.artistName}
      </span>
    </div>
  );

  const LikeBtn = (
    <button
      onClick={() => setLiked((p) => !p)}
      aria-label={liked ? "Unlike" : "Like"}
      className="p-1 shrink-0 transition"
      style={{ color: liked ? clicked : "rgba(255,255,255,0.5)" }}
    >
      <Heart className="w-4 h-4" fill={liked ? clicked : "none"} />
    </button>
  );

  const PlayBtn = (
    <button
      onClick={() => (isPlaying ? pause() : play())}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition hover:scale-105"
      style={{ backgroundColor: clicked }}
    >
      {isPlaying ? (
        <Pause className="w-4 h-4 text-white" />
      ) : (
        <Play className="w-4 h-4 text-white" />
      )}
    </button>
  );

  const ProgressBar = (
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs text-white/50 w-8 text-right tabular-nums">
        {formatTime(progress)}
      </span>
      <div
        className="relative flex-1 h-1 rounded-full bg-white/20 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${progressPercent}%`, backgroundColor: clicked }}
        />
      </div>
      <span className="text-xs text-white/50 w-8 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-50 text-white shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Mobile layout (< md) ─────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col px-3 pt-3 pb-2 gap-2">
        {/* Row 1: cover + meta + like + prev/play/next */}
        <div className="flex items-center gap-3">
          {Cover}
          {SongMeta}
          {LikeBtn}
          <button
            aria-label="Previous"
            className="p-1 text-white/70 hover:text-white transition shrink-0"
            onClick={prev}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          {PlayBtn}
          <button
            aria-label="Next"
            className="p-1 text-white/70 hover:text-white transition shrink-0"
            onClick={next}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Row 2: progress bar */}
        {ProgressBar}

        {/* Row 3: shuffle + repeat */}
        <div className="flex items-center justify-center gap-6 pb-1">
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle"
            className="p-1 transition"
            style={{ color: isShuffle ? clicked : "rgba(255,255,255,0.5)" }}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={toggleRepeat}
            aria-label="Repeat"
            className="p-1 transition"
            style={{ color: repeatActive ? clicked : "rgba(255,255,255,0.5)" }}
          >
            <RepeatIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Desktop layout (≥ md) ─────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-4 px-6 py-3">
        {/* Left: cover + meta + like */}
        <div className="flex items-center gap-3 w-64 shrink-0">
          {Cover}
          {SongMeta}
          {LikeBtn}
        </div>

        {/* Center: controls + progress */}
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              aria-label="Shuffle"
              className="p-1 transition"
              style={{ color: isShuffle ? clicked : "rgba(255,255,255,0.5)" }}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              aria-label="Previous"
              className="p-1 text-white/70 hover:text-white transition"
              onClick={prev}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            {PlayBtn}
            <button
              aria-label="Next"
              className="p-1 text-white/70 hover:text-white transition"
              onClick={next}
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={toggleRepeat}
              aria-label="Repeat"
              className="p-1 transition"
              style={{ color: repeatActive ? clicked : "rgba(255,255,255,0.5)" }}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          </div>
          {ProgressBar}
        </div>

        {/* Right: volume */}
        <div className="flex items-center gap-2 w-36 shrink-0 justify-end">
          <button
            onClick={handleMuteToggle}
            aria-label={muted ? "Unmute" : "Mute"}
            className="p-1 text-white/70 hover:text-white transition"
          >
            {muted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-24"
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
