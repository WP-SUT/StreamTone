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
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";

//── Types ─────────────────────────────────────────────────────────────────────
interface Song {
  id: string;
  title: string;
  artistName: string;
  coverUrl?: string;
  duration: number;       // seconds
  dominantColor?: string; // optional — extracted from cover
}

interface FooterPlayerProps {
  currentSong?: Song | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function darken(hex: string, amount = 0.3): string {
  // Simple luminance reduction for non-hsl values; hsl strings pass through
  if (hex.startsWith("hsl")) return hex;
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
  const b = Math.max(0, (num & 0xff) * (1 - amount));
  return `rgb(${r},${g},${b})`;
}

// ── Mock data (no dominantColor — fallback is brand purple) ───────────────────
const MOCK_SONG: Song = {
  id: "mock-1",
  title: "آهنگ نمونه",
  artistName: "هنرمند",
  coverUrl: undefined,
  duration: 210,
};
 // ── Component ─────────────────────────────────────────────────────────────────
export default function FooterPlayer({ currentSong }: FooterPlayerProps) {
  const song = currentSong ?? MOCK_SONG;

  // Brand purple as opaque fallback — matches --color-primary / --color-accent
  const clicked = "hsl(263, 85%, 65%)";
  const accent = song.dominantColor ?? "hsl(263, 46%, 19%)";
  const bgColor = darken(accent, 0.55);

  // ── State ──────────────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);   // 0–100
  const [volume, setVolume]= useState(80);
  const [muted, setMuted]       = useState(false);
  const [liked, setLiked]       = useState(false);
  const [shuffle, setShuffle]   = useState(false);
  const [repeat, setRepeat]     = useState(false);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated playback tick
  useEffect(() => {
    if (isPlaying) {
      tickRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            if (repeat) return 0;
            setIsPlaying(false);
            return 100;
          }
          return p + 100/ song.duration;
        });
      }, 1000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [isPlaying, song.duration, repeat]);

  // Reset on song change
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [song.id]);

  const elapsed = Math.round((progress / 100) * song.duration);

  // ── Shared JSX pieces (reused in both layouts) ─────────────────────────────
  const Cover = (
    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-white/10">
      {song.coverUrl ? (
        <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/30">
          <ListMusic className="w-5 h-5" />
        </div>
      )}
    </div>
  );

  const SongMeta = (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-sm font-medium text-white truncate">{song.title}</span>
      <span className="text-xs text-white/60 truncate">{song.artistName}</span>
    </div>
  );

  const LikeBtn = (
    <button
      onClick={() => setLiked((p) => !p)}
      aria-label={liked ? "Unlike" : "Like"}
      className="p-1 shrink-0 transition"style={{ color: liked ? clicked : "rgba(255,255,255,0.5)" }}
    >
      <Heart className="w-4 h-4" fill={liked ? clicked : "none"} />
    </button>
  );

  const PlayBtn = (
    <button
      onClick={() => setIsPlaying((p) => !p)}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition hover:scale-105"
      style={{ backgroundColor: clicked }}
    >
      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
    </button>
  );

  const ProgressBar = (
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs text-white/50w-8 text-right tabular-nums">{formatTime(elapsed)}</span>
      <div
        className="relative flex-1 h-1 rounded-full bg-white/20 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setProgress(((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: clicked
         }}
        />
      </div>
      <span className="text-xs text-white/50 w-8 tabular-nums">{formatTime(song.duration)}</span>
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
            onClick={() => setProgress(0)}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          {PlayBtn}
          <button
            aria-label="Next"
            className="p-1 text-white/70 hover:text-white transition shrink-0"
            onClick={() => setProgress(0)}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Row 2: progress bar */}
        {ProgressBar}

        {/* Row 3: shuffle + repeat */}
        <div className="flex items-center justify-center gap-6 pb-1">
          <button
            onClick={() => setShuffle((p) => !p)}
            aria-label="Shuffle"
            className="p-1 transition"
            style={{ color: shuffle ? clicked : "rgba(255,255,255,0.5)" }}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRepeat((p) => !p)}
            aria-label="Repeat"
            className="p-1 transition"
            style={{ color: repeat ? clicked : "rgba(255,255,255,0.5)" }}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Desktop layout (≥ md) ─────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-4 px-6 py-3">
        {/* Left: cover + meta + like */}
        <div className="flex items-center gap-3 w-64shrink-0">
          {Cover}
          {SongMeta}
          {LikeBtn}
        </div>

        {/* Center: controls + progress */}
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShuffle((p) => !p)}
              aria-label="Shuffle"
              className="p-1 transition"
              style={{ color: shuffle ? clicked : "rgba(255,255,255,0.5)" }}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              aria-label="Previous"
              className="p-1 text-white/70 hover:text-white transition"
              onClick={() => setProgress(0)}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            {PlayBtn}
            <button
              aria-label="Next"
              className="p-1 text-white/70 hover:text-white transition"
              onClick={() => setProgress(0)}
            >
              <SkipForward className="w-5 h-5" />
            </button><button
              onClick={() => setRepeat((p) => !p)}
              aria-label="Repeat"
              className="p-1 transition"
              style={{ color: repeat ? clicked : "rgba(255,255,255,0.5)" }}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          {ProgressBar}
        </div>

        {/* Right: volume */}
        <div className="flex items-center gap-2 w-36 shrink-0 justify-end">
          <button
            onClick={() => setMuted((p) => !p)}
            aria-label={muted ? "Unmute" : "Mute"}
            className="p-1 text-white/70 hover:text-white transition">
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
            value={muted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setMuted(false);
            }}
            className="w-24 clicked-[--color-primary]"
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
