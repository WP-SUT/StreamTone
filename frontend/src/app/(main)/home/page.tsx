"use client"

import { mockAlbums, mockPlaylists, mockSongs, mockUsers } from "@/mock/data";
import SectionHeader from "@/components/cards/section-header";
import HorizontalScrollRow from "@/components/cards/horizontal-scroll";
import PlaylistCard from "@/components/cards/playlist-card";
import AlbumCard from "@/components/cards/album-card";

import GoldEarlyAccess from "@/components/home/gold-early-access";
import SongCard from "@/components/cards/song-card";
import SongCardList from "@/components/cards/song-card-list";
import { storage } from "@/lib/storage";


const currentUser = mockUsers[0];

export default function HomePage() {
  const recentPlaylists = storage.playlists.getAll();
  const latestAlbums = storage.albums.getAll();
  const topSongs = mockSongs
    .slice()
    .sort((a, b) => (b.streamCount ?? 0) - (a.streamCount ?? 0))
    .slice(0, 10);

  return (
    <main className="flex flex-col gap-10 px-4 py-6 md:px-8 max-w-screen-xl mx-auto">

      <section>
        <SectionHeader title="Latest Playlists" href="/playlists" />
        <HorizontalScrollRow>
          {recentPlaylists.map((pl) => (
            <PlaylistCard
              key={pl.id}
              id={pl.id}
              title={pl.title}
              owner={"owner"}
              ownerId={pl.ownerId}
              cover={pl.coverUrl}
              trackCount={pl.songIds.length}
            />
          ))}
        </HorizontalScrollRow>
      </section>

      <section>
        <SectionHeader title="Latest Albums" href="/albums" />
        <HorizontalScrollRow>
          {latestAlbums.map((album) => (
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

      <section>
        <SectionHeader title="Most Played Songs" href="/songs"/>
        <SongCardList>
          {topSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              index={index + 1}
              queue={topSongs}
            />
          ))}
        </SongCardList>
      </section>

      <GoldEarlyAccess isGold={currentUser?.isPremium} />
    </main>
  );
}
