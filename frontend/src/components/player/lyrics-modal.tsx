"use client";

import { X, Music2 } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Mock lyrics — replace with a real API call keyed by song id in production
// ---------------------------------------------------------------------------
const MOCK_LYRICS: Record<string, string[]> = {
  default: [
    "♪ No lyrics available for this track ♪",
    "",
    "Lyrics will appear here once they are added.",
  ],
};

function getLyrics(songId: string): string[] {
  return MOCK_LYRICS[songId] ?? MOCK_LYRICS["default"];
}
// ---------------------------------------------------------------------------

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LyricsModal({ isOpen, onClose }: LyricsModalProps) {
  const { currentSong } = usePlayerStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const lyrics = currentSong ? getLyrics(currentSong.id) : MOCK_LYRICS["default"];

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Lyrics"
    >
      {/* Panel */}
      <div
        className="
          relative w-full max-w-lg
          bg-zinc-900 border border-white/10
          rounded-2xl shadow-2xl
          flex flex-col
          max-h-[80vh]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Cover thumbnail */}
            {currentSong?.coverUrl ? (
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-10 h-10 rounded-md object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-white/40" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">
                {currentSong?.title ?? "No song playing"}
              </span>
              <span className="text-xs text-white/50 truncate">
                {currentSong?.artistName ?? "—"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close lyrics"
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lyrics body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {!currentSong ? (
            <p className="text-white/40 text-sm text-center py-8">
              No song is currently playing.
            </p>
          ) : (
            <div className="space-y-1 text-center">
              {lyrics.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-4" />
                ) : (
                  <p
                    key={i}
                    className="text-white/80 text-[15px] leading-relaxed"
                  >
                    {line}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
