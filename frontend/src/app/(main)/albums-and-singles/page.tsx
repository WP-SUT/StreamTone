// src/pages/AlbumsAndSinglesPage.tsx
"use client";

import { mockAlbums, mockSongs } from "@/mock/data";
import AlbumCard from "@/components/cards/album-card";
import SectionHeader from "@/components/cards/section-header";
import SongCard from "@/components/cards/song-card";
import HorizontalScrollRow from "@/components/cards/horizontal-scroll";

export default function AlbumsAndSinglesPage() {
    const singles = mockSongs.filter((song) => song.isSingle);

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Albums Section */}
            {mockAlbums.length > 0 && (
                <section>
                    <SectionHeader title="Albums" href="/albums" />
                    <HorizontalScrollRow>
                        {mockAlbums.map((album) => (
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

            {/* Singles Section */}
            {singles.length > 0 && (
                <section>
                    <div className="mb-6">
                        <SectionHeader title="Singles" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {singles.map((single) => (
                            <SongCard
                                key={single.id}
                                song={single}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {mockAlbums.length === 0 && singles.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <p className="text-lg text-gray-400">No albums or singles yet</p>
                </div>
            )}
        </div>
    );
}
