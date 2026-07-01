"use client"

import AlbumCard from "@/components/cards/album-card";
import CardList from "@/components/cards/card-list";
import SectionHeader from "@/components/cards/section-header";
import { mockAlbums } from "@/mock/data";

export default function Albums() {

    return (
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <SectionHeader title="Albums" />
          </div>
    
          {/* Playlists Flex Wrap */}
          {mockAlbums.length > 0 ? (
            <CardList>
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
            </CardList> 
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-neutral-400 mb-4">No playlists yet</p>
            </div>
          )}
        </div>
      );
}