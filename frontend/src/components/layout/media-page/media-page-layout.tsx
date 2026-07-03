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
    <div className="p-4 md:p-6 space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-zinc-400 hover:text-white transition"
        aria-label="Go back"
      >
        <ArrowLeft size={22} />
      </button>

      {/* Cover + info */}
      <div className="flex flex-col md:flex-row gap-5 items-start md:items-end">
        {/* Cover: w-32 h-32 on mobile, w-40 h-40 on desktop */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-md shadow-xl overflow-hidden flex items-center justify-center bg-zinc-800 flex-shrink-0">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={coverAlt}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/10">
              <Music2 className="h-8 w-8 text-white/30" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1.5 md:space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          <h1 className="text-2xl md:text-4xl font-bold break-words">{title}</h1>
          {/* Metadata: smaller, muted */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs md:text-sm text-zinc-500">
            {metadata}
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Play all"
          onClick={onPlayAll}
          disabled={disablePlay}
          className="
            flex items-center justify-center
            w-9 h-9 md:w-10 md:h-10 rounded-full
            bg-primary text-white shadow-md
            hover:scale-110 active:scale-95
            disabled:bg-zinc-700 disabled:text-zinc-500 disabled:hover:scale-100
            transition-transform duration-150
          "
        >
          <Play size={15} fill="currentColor" />
        </button>
        {actions}
      </div>

      {/* Song list */}
      <div className="space-y-1">
        {isEmpty ? (
          <div className="text-center py-12 text-sm text-zinc-500">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
