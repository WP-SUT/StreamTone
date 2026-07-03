// app/(main)/search/page.tsx

"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { mockSongs, mockArtists, mockAlbums } from "@/mock/data";
import SectionHeader from "@/components/cards/section-header";
import SongCard from "@/components/cards/song-card";
import AlbumCard from "@/components/cards/album-card";
import HorizontalScrollRow from "@/components/cards/horizontal-scroll";
import EmptyState from "@/components/search/empty-state";
import SongCardList from "@/components/cards/song-card-list";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SortKey = "listeners" | "release";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<SortKey>("listeners");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return { songs: [], albums: [] };

        // Simultaneous search by track title and artist name
        const matchedSongs = mockSongs.filter(
            (s) =>
                s.title.toLowerCase().includes(q) ||
                s.artistName.toLowerCase().includes(q)
        );

        const matchedArtistIds = mockArtists
            .filter((a) => a.artistName.toLowerCase().includes(q))
            .map((a) => a.id);

        const matchedAlbums = mockAlbums.filter(
            (al) =>
                al.title.toLowerCase().includes(q) ||
                matchedArtistIds.includes(al.artistId)
        );

        // Sort songs
        const sortedSongs =
            sort === "listeners"
                ? [...matchedSongs].sort((a, b) => b.streamCount - a.streamCount)
                : [...matchedSongs].sort(
                    (a, b) =>
                        new Date(b.releaseYear).getTime() -
                        new Date(a.releaseYear).getTime()
                );

        // Sort albums
        const sortedAlbums =
            sort === "listeners"
                ? [...matchedAlbums].sort((a, b) => b.streamCount - a.streamCount)
                : [...matchedAlbums].sort(
                    (a, b) =>
                        new Date(b.releaseYear).getTime() -
                        new Date(a.releaseYear).getTime()
                );

        return { songs: sortedSongs, albums: sortedAlbums };
    }, [query, sort]);

    const hasQuery = query.trim().length > 0;
    const totalResults = results.songs.length + results.albums.length;

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-4 py-6 md:px-8 sm:px-8 lg:px-8">
            {/* Page Title */}
            <SectionHeader title="Search & Filters" />

            {/* Control Bar */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10"
                        size={18}
                    />ّ
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by track title or artist name..."
                        className="glass w-full rounded-xl pl-10 pr-4 py-3 h-10 border-white/10"
                    />
                </div>

                {/* Sort Selector */}
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger className="glass shrink-0 rounded-xl px-4 py-3 h-auto border-white/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        className="glass border-white/10 rounded-lg [&_[role=option]]:rounded-lg"
                        position="popper"
                        sideOffset={4}
                    >
                        <SelectItem value="listeners">Sort: Most Listeners</SelectItem>
                        <SelectItem value="release">Sort: Latest Release</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results */}
            <section className="mt-8">
                {!hasQuery && <EmptyState type="idle" />}

                {hasQuery && totalResults === 0 && (
                    <EmptyState type="no-results" query={query} />
                )}

                {hasQuery && totalResults > 0 && (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {totalResults} result{totalResults !== 1 ? "s" : ""} for{" "}
                            <span className="text-white">"{query}"</span>
                        </p>

                        <div className="flex flex-col gap-10 px-4 py-6 md:px-2 max-w-screen-xl mx-auto">
                            {/* Albums Section - Horizontal Scroll */}
                            {results.albums.length > 0 && (
                                <section>
                                    <SectionHeader
                                        title={`Albums (${results.albums.length})`}
                                    />
                                    <HorizontalScrollRow>
                                        {results.albums.map((album) => (
                                            <AlbumCard
                                                key={album.id}
                                                id={album.id}
                                                title={album.title}
                                                artist={album.artistName}
                                                artistId={album.artistId}
                                                cover={album.coverUrl}
                                            />
                                        ))}
                                    </HorizontalScrollRow>
                                </section>
                            )}

                            {/* Songs Section - Card List */}
                            {results.songs.length > 0 && (
                                <section>
                                    <SectionHeader
                                        title={`Tracks (${results.songs.length})`}
                                    />
                                    <SongCardList>
                                        {results.songs.map((song, idx) => (
                                            <SongCard
                                                key={song.id}
                                                song={song}
                                                index={idx + 1}
                                            />
                                        ))}
                                    </SongCardList>
                                </section>
                            )}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
