import { mockUsers, mockArtists } from "@/mock/data";
import type { User, Artist } from "@/types/models";

// Simulate async network delay
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function loginMock(
  email: string,
  _password: string
): Promise<User | Artist> {
  await delay();
  const user = [...mockUsers, ...mockArtists].find((u) => u.email === email);
  if (!user) throw new Error("Invalid email or password.");
  return user;
}

export async function registerUserMock(data: {
  displayName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: User["gender"];
}): Promise<User> {
  await delay();
  const newUser: User = {
    id: `u${Date.now()}`,
    displayName: data.displayName,
    email: data.email,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    role: "listener",
    isPremium: false,
    followingArtistIds: [],
    followerIds: [],
    playlistIds: [],
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
}

export async function registerArtistMock(data: {
  artistName: string;
  email: string;
  password: string;
  portfolioUrls: string[];
}): Promise<Artist> {
  await delay();
  const newArtist: Artist = {
    id: `a${Date.now()}`,
    artistName: data.artistName,
    email: data.email,
    role: "artist",
    isVerified: false,
    approvalStatus: "pending",
    portfolioUrls: data.portfolioUrls,
    followerCount: 0,
    totalStreams: 0,
    albumIds: [],
    singleIds: [],
    createdAt: new Date().toISOString(),
  };
  mockArtists.push(newArtist);
  return newArtist;
}

export async function forgotPasswordMock(email: string): Promise<void> {
  await delay();
  const exists = [...mockUsers, ...mockArtists].some((u) => u.email === email);
  if (!exists) throw new Error("No account found with that email.");
  // In phase 1, just simulate success
}
