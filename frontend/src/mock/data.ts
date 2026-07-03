import type { User, Artist, Song, Album, Playlist } from "@/types/models";

export const mockUsers: User[] = [
  {
    id: "u1",
    displayName: "Soroush",
    password: "11111111",
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
    password: "11111111",
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
    title: "Boghz",
    artistId: "a1",
    artistName: "Dariush",
    albumId: "alb1",
    coverUrl: "/cover/Dariush-Boghz.jpg",
    audioUrl: "/music/Dariush - Boghz.mp3",
    dominantColor: "brown",
    duration: 511,
    genre: "Pop",
    releaseYear: 2022,
    streamCount: 980000,
    isSingle: false,
    createdAt: "2022-06-01T00:00:00Z",
  },
  {
    id: "s2",
    title: "Sohbat",
    artistId: "a1",
    artistName: "Dariush",
    coverUrl: "/cover/sohbat.webp",
    audioUrl: "/music/03 Sohbat (feat. Ramesh & Faramarz Aslani).mp3",
    dominantColor: "lightpurple",
    duration: 229,
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
    trackIds: ["s1","s2"],
    totalDuration: 214,
    streamCount: 980000,
    createdAt: "2022-06-01T00:00:00Z",
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: "pl1",
    title: "My Favorites",
    ownerId: "u1",
    coverUrl: "",
    songIds: ["s1", "s2"],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  }
];
