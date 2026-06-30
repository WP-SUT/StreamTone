// app/(main)/search/page.tsx

"use client";

import { useState, useMemo } from "react";
import { Search, Music, User } from "lucide-react";
import { mockSongs, mockArtists, mockAlbums } from "@/mock/data";
import SectionHeader from "@/components/cards/section-header";
import SongCard from "@/components/cards/song-card";
import AlbumCard from "@/components/cards/album-card";



type SearchMode = "track" | "artist";
type SortKey = "listeners" | "release";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<SearchMode>("track");
    const [sort, setSort] = useState<SortKey>("listeners");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        if (mode === "track") {
            const filtered = mockSongs.filter((s) =>
                s.title.toLowerCase().includes(q)
            );
            return sort === "listeners"
                ? [...filtered].sort((a, b) => b.streamCount - a.streamCount)
                : [...filtered].sort(
                    (a, b) =>
                        new Date(b.releaseYear).getTime() -
                        new Date(a.releaseYear).getTime()
                );
        }

        // artist mode → collect albums whose artist matches the query
        const matchedArtistIds = mockArtists
            .filter((a) => a.artistName.toLowerCase().includes(q))
            .map((a) => a.id);

        const filtered = mockAlbums.filter((al) =>
            matchedArtistIds.includes(al.artistId)
        );

        return sort === "listeners"
            ? [...filtered].sort((a, b) => b.streamCount - a.streamCount)
            : [...filtered].sort(
                (a, b) =>
                    new Date(b.releaseYear).getTime() -
                    new Date(a.releaseYear).getTime()
            );
    }, [query, mode, sort]);

    const hasQuery = query.trim().length > 0;

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-4 py-8 sm:px-8 lg:px-16">
            {/* ── Page Title ── */}
            <SectionHeader title="Search & Discovery" />

            {/* ── Controls Bar ── */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">

                {/* Search Input */}
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        size={18}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                            mode === "track" ? "Search by track name…" : "Search by artist name…"
                        }
                        className="w-full rounded-xl bg-neutral-800 py-3 pl-10 pr-4 text-sm
                       placeholder-neutral-500 outline-none ring-1 ring-transparent
                       transition focus:ring-purple-500"
                    />
                </div>

                {/* Mode Toggle */}
                <div className="flex shrink-0 rounded-xl bg-neutral-800 p-1">
                    <ModeButton
                        active={mode === "track"}
                        icon={<Music size={14} />}
                        label="By Track"
                        onClick={() => setMode("track")}
                    />
                    <ModeButton
                        active={mode === "artist"}
                        icon={<User size={14} />}
                        label="By Artist"
                        onClick={() => setMode("artist")}
                    />
                </div>

                {/* Sort Selector */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="shrink-0 rounded-xl bg-neutral-800 px-4 py-3 text-sm
                     text-white outline-none ring-1 ring-transparent
                     transition focus:ring-purple-500 cursor-pointer"
                >
                    <option value="listeners">Sort: Most Listeners</option>
                    <option value="release">Sort: Latest Release</option>
                </select>
            </div>

            {/* ── Results ── */}
            <section className="mt-10">
                {!hasQuery && <EmptyState type="idle" />}

                {hasQuery && results.length === 0 && <EmptyState type="no-results" query={query} />}

                {hasQuery && results.length > 0 && (
                    <>
                        <p className="mb-4 text-sm text-neutral-400">
                            {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                            <span className="text-white">"{query}"</span>
                        </p>

                        {mode === "track" ? (
                            <div className="flex flex-col gap-2">
                                {(results as typeof mockSongs).map((song, idx) => (
                                    <SongCard
                                        key={song.id}
                                        song={song}
                                        index={idx + 1}
                                        onPlay={() => console.log("play", song.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {(results as typeof mockAlbums).map((album) => (
                                    <AlbumCard key={album.id}
                                        id={album.id}
                                        title={album.title}
                                        artist={album.artistName}
                                        artistId={album.artistId}
                                        cover={album.coverUrl} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

// ── Sub-components ────────────────────────────────────────────────

function ModeButton({
    active,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium
                  transition-colors duration-150
                  ${active
                    ? "bg-purple-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function EmptyState({
    type,
    query,
}: {
    type: "idle" | "no-results";
    query?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={48} className="mb-4 text-neutral-700" />
            {type === "idle" ? (
                <>
                    <p className="text-lg font-semibold text-neutral-300">
                        Find your music
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                        Search by track name or browse by artist.
                    </p>
                </>
            ) : (
                <>
                    <p className="text-lg font-semibold text-neutral-300">
                        No results for "{query}"
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                        Try a different spelling or switch search mode.
                    </p>
                </>
            )}
        </div>
    );
}
