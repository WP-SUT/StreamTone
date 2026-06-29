// src/components/layout/footer-player.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
} from "lucide-react";

interface Song {
  id: string;
  title: string;
  artistName: string;
  coverUrl?: string;
  duration: number; // seconds
  dominantColor?: string; // hex, e.g. "#1db954"
}

interface FooterPlayerProps {
  currentSong?: Song | null;
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

/** Darkens a hex color toward black by `amount` (0–1) */
function darken(hex: string, amount = 0.7): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${lerp(r, 0, amount)},${lerp(g, 0, amount)},${lerp(b, 0, amount)})`;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// Fallback mock song for shell testing
const MOCK_SONG: Song = {
  id: "1",
  title: "Mock Track",
  artistName: "Mock Artist",
  coverUrl: undefined,
  duration: 210,
  dominantColor: "#1db954",
};

export function FooterPlayer({ currentSong }: FooterPlayerProps) {
  const song = currentSong ?? MOCK_SONG;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1
  const [volume, setVolume] = useState(0.8); // 0–1
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate playback tick (replace with real audio element later)
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return p +1 / song.duration;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, song.duration]);

  // Reset on song change
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [song.id]);

  const accent = song.dominantColor ?? "#1db954";
  const bgColor = darken(accent, 0.82);
  const elapsed = Math.floor(progress * song.duration);

  return (
    <footer
      className="h-20 fixed bottom-0 left-0 right-0 z-50 flex items-center px-4 gap-4 border-t border-white/10 transition-colors duration-700"
      style={{ backgroundColor: bgColor }}
    >
      {/* Song info */}
      <div className="flex items-center gap-3 w-64 shrink-0">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-700 shrink-0">
          {song.coverUrl ? (
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
              🎵
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{song.title}</p>
          <p className="text-xs text-white/60 truncate">{song.artistName}</p>
        </div>
        <button
          onClick={() => setLiked((p) => !p)}
          className="ml-auto p-1 shrink-0"
          aria-label="Like"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ color: liked ? accent : "rgba(255,255,255,0.5)" }}
            fill={liked ? accent : "none"}
          />
        </button>
      </div>

      {/* Controls + progress */}
      <div className="flex flex-col items-center flex-1 gap-1">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setShuffle((p) => !p)}
            aria-label="Shuffle"
            className="p-1"
            style={{ color: shuffle ? accent : "rgba(255,255,255,0.5)" }}
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
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-900 transition hover:scale-105"
            style={{ backgroundColor: accent }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 translate-x-0.5" />
            )}
          </button>
          <button
            aria-label="Next"
            className="p-1 text-white/70 hover:text-white transition"
            onClick={() => setProgress(0)}
          >
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={() => setRepeat((p) => !p)}
            aria-label="Repeat"
            className="p-1"
            style={{ color: repeat ? accent : "rgba(255,255,0.5)" }}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-xs text-white/50 w-8 text-right tabular-nums">
            {formatTime(elapsed)}
          </span>
          <div
            className="relative flex-1 h rounded-full bg-white/20 cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress((e.clientX - rect.left) / rect.width);
            }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress * 100}%`, backgroundColor: accent }}
            />
            {/* Scrub knob — visible on hover */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
              style={{
                left: `calc(${progress * 100}% - 6px)`,
                backgroundColor: accent,
              }}
            />
          </div>
          <span className="text-xs text-white/50 w-8 tabular-nums">
            {formatTime(song.duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-36 shrink-0 justify-end">
        <button
          onClick={() => setMuted((p) => !p)}
          aria-label="Toggle mute"
          className="text-white/60 hover:text-white transition"
        >
          {muted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <div
          className="relative flex-1 h-1 rounded-full bg-white/20 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
            setMuted(false);
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${(muted ? 0 : volume) * 100}%`,
              backgroundColor: accent,
            }}
          />
        </div>
        <button
          aria-label="Queue"
          className="text-white/60 hover:text-white transition ml-1"
        >
          <ListMusic className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
