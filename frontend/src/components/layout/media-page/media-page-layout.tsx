"use client";

import { ArrowLeft, Music2, Play } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MediaPageLayoutProps {
  onBack: () => void;
  coverUrl?: string;
  coverAlt: string;
  label: string;
  title: string;
  metadata: React.ReactNode;
  onPlayAll: () => void;
  disablePlay?: boolean;
  /** Extra action buttons placed after the play button (e.g. the ⋮ menu) */
  actions?: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

export default function MediaPageLayout({
  onBack,
  coverUrl,
  coverAlt,
  label,
  title,
  metadata,
  onPlayAll,
  disablePlay = false,
  actions,
  isEmpty,
  emptyMessage,
  children,
}: MediaPageLayoutProps) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-zinc-400 hover:text-white transition"aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Cover + info */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg shadow-2xl overflow-hidden flex items-center justify-center bg-zinc-800 flex-shrink-0">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={coverAlt}
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/10">
              <Music2 className="h-10 w-10 text-white/30" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 md:space-y-3">
          <p className="text-xs md:text-sm font-semibold uppercase text-zinc-400">
            {label}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold break-words">{title}</h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-base text-zinc-400">
            {metadata}
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Play all"
          onClick={onPlayAll}
          disabled={disablePlay}
          className="
            flex items-center justify-center
            w-12 h-12 md:w-14 md:h-14 rounded-full
            bg-primary text-white shadow-lg
            hover:scale-110 active:scale-95
            disabled:bg-zinc-700 disabled:text-zinc-500 disabled:hover:scale-100
            transition-transform duration-150
          "
        >
          <Play size={20} fill="currentColor" />
        </button>
        {actions}
      </div>

      {/* Song list */}
      <div className="space-y-2">
        {isEmpty ? (
          <div className="text-center py-12 text-zinc-400">{emptyMessage}</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
