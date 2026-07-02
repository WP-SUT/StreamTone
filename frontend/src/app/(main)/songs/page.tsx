// src/pages/AlbumsAndSinglesPage.tsx
"use client";

import { mockSongs } from "@/mock/data";
import SectionHeader from "@/components/cards/section-header";
import SongCard from "@/components/cards/song-card";

export default function SongsPage() {
    const singles = mockSongs.filter((song) => song.isSingle);

    return (
        <div className="flex flex-col gap-8 p-6"> 
            {/* Singles Section */}
            {singles.length > 0 && (
                <section>
                    <SectionHeader title="Songs" href="/songs" />
                <ol className="flex flex-col gap-1 mt-3">
                          {mockSongs.map((song, index) => (
                            <SongCard
                              key={song.id}
                              song={song}
                              index={index + 1}
                              queue={mockSongs}
                            />
                          ))}
                        </ol>
                </section>
            )}

            {/* Empty State */}
            {singles.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <p className="text-lg text-gray-400">No albums or singles yet</p>
                </div>
            )}
        </div>
    );
}
