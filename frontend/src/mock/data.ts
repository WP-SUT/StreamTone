import type { User, Artist, Song, Album, Playlist } from "@/types";

export const mockUsers: User[] = [
  {
    id: "u1",
    displayName: "Soroush",
    email: "soroush@example.com",
    dateOfBirth: "1998-05-10",
    gender: "male",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=soroush",
    role: "listener",
    isPremium: false,
    followingArtistIds: ["a1"],
    followerIds: [],
    playlistIds: ["pl1"],
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export const mockArtists: Artist[] = [
  {
    id: "a1",
    artistName: "Dariush",
    email: "dariush@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dariush",
    bio: "Legendary Persian singer.",
    isVerified: true,
    approvalStatus: "approved",
    portfolioUrls: [],
    followerCount: 120000,
    totalStreams: 5000000,
    albumIds: ["alb1"],
    singleIds: ["s2"],
    role: "artist",
    createdAt: "2023-01-01T00:00:00Z",
  },
];

export const mockSongs: Song[] = [
  {
    id: "s1",
    title: "Ey Iran",
    artistId: "a1",
    artistName: "Dariush",
    albumId: "alb1",
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 214,
    genre: "Pop",
    releaseYear: 2022,
    streamCount: 980000,
    isSingle: false,
    createdAt: "2022-06-01T00:00:00Z",
  },
  {
    id: "s2",
    title: "Payam",
    artistId: "a1",
    artistName: "Dariush",
    coverUrl: "",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 187,
    genre: "Pop",
    releaseYear: 2023,
    streamCount: 430000,
    isSingle: true,
    createdAt: "2023-03-15T00:00:00Z",
  },
];

export const mockAlbums: Album[] = [
  {
    id: "alb1",
    title: "Shayad",
    artistId: "a1",
    artistName: "Dariush",
    coverUrl: "",
    releaseYear: 2022,
    genre: "Pop",
    trackIds: ["s1"],
    totalDuration: 214,
    streamCount: 980000,
    createdAt: "2022-06-01T00:00:00Z",
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "pl1",
    title: "My Favorites",
    ownerId: "u1",
    coverUrl: "",
    songIds: ["s1", "s2"],
    isPublic: true,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
];
