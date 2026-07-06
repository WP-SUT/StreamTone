"use client";

import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  ListMusic,
  Mic2,
  Volume2,
} from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { formatTime, darkenColor } from "@/lib/player/utils";
import QueueDrawer from "@/components/player/queue-drawer";
import LyricsModal from "@/components/player/lyrics-modal";
import ProgressBar from "./progress-bar";

interface FullPlayerProps {
  onCollapse: () => void;
}

export default function FullPlayer({ onCollapse }: FullPlayerProps) {
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

  const [liked, setLiked] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);

  if (!currentSong) return null;

  const accentColor = "hsl(263, 85%, 65%)";
  const bgColor = darkenColor(currentSong.dominantColor ?? "hsl(263, 46%, 19%)", 0.65);
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;
  const isRepeatActive = repeatMode !== "off";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex flex-col text-white md:hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-10 pb-4 shrink-0">
          <button
            onClick={onCollapse}
            aria-label="Collapse player"
            className="p-2 text-white/70 hover:text-white transition"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <span className="text-sm font-semibold tracking-wide uppercase text-white/70">
            Now Playing
          </span>
          <button
            onClick={() => setLiked((prev) => !prev)}
            aria-label={liked ? "Unlike" : "Like"}
            className="p-2 transition"
            style={{ color: liked ? accentColor : "rgba(255,255,255,0.5)" }}
          >
            <Heart className="w-5 h-5" fill={liked ? accentColor : "none"} />
          </button>
        </div>

        {/* Cover Art */}
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
                style={{ backgroundColor: darkenColor(bgColor, 0.3) }}
              >
                <ListMusic className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pb-10 shrink-0 flex flex-col gap-4">
          {/* Song Info */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 flex-1 mr-3">
              <span className="text-lg font-bold truncate">{currentSong.title}</span>
              <span className="text-sm text-white/60 truncate">{currentSong.artistName}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLyricsOpen((prev) => !prev)}
                aria-label="Lyrics"
                className="p-1 transition"
                style={{ color: lyricsOpen ? accentColor : "rgba(255,255,255,0.5)" }}
              >
                <Mic2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setQueueOpen(true)}
                aria-label="Queue"
                className="p-1 transition relative"
                style={{ color: queueOpen ? accentColor : "rgba(255,255,255,0.5)" }}
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

          {/* Progress */}
          <div className="flex flex-col gap-1"><ProgressBar
              current={progress}
              total={duration}
              onSeek={seek}
              accentColor={accentColor}/>
            <div className="flex justify-between text-xs text-white/50 tabular-nums">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleShuffle}
              aria-label="Shuffle"
              className="p-2 transition"
              style={{ color: isShuffle ? accentColor : "rgba(255,255,255,0.5)" }}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={prev}
              aria-label="Previous"
              className="p-2 text-white/80 hover:text-white transition"
            >
              <SkipBack className="w-7 h-7" />
            </button>
            <button
              onClick={() => (isPlaying ? pause() : play())}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-16 h-16 rounded-full flex items-center justify-center transition hover:scale-105 shadow-lg"
              style={{ backgroundColor: accentColor }}
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
              className="p-2 text-white/80 hover:text-white transition"
            >
              <SkipForward className="w-7 h-7" />
            </button>
            <button
              onClick={toggleRepeat}
              aria-label="Repeat"
              className="p-2 transition"
              style={{ color: isRepeatActive ? accentColor : "rgba(255,255,255,0.5)" }}
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
