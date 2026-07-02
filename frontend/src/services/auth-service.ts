import { storage } from "@/lib/storage";
import type { User, Artist } from "@/types/models";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

export const authService = {
  async login(email: string, _password: string): Promise<User | Artist> {
    await delay();
    const account =
      storage.users.findByEmail(email) ?? storage.artists.findByEmail(email);
    if (!account) throw new Error("Invalid email or password.");
    storage.session.set(account);
    return account;
  },

  async registerUser(data: {
    displayName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    gender: User["gender"];
  }): Promise<User> {
    await delay();
    const exists =
      storage.users.findByEmail(data.email) ??
      storage.artists.findByEmail(data.email);
    if (exists) throw new Error("An account with this email already exists.");

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

    storage.users.upsert(newUser);
    storage.session.set(newUser);
    return newUser;
  },

  async registerArtist(data: {
    artistName: string;
    email: string;
    password: string;
    portfolioUrls: string[];
  }): Promise<Artist> {
    await delay();
    const exists =
      storage.users.findByEmail(data.email) ??
      storage.artists.findByEmail(data.email);
    if (exists) throw new Error("An account with this email already exists.");

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

    storage.artists.upsert(newArtist);
    storage.session.set(newArtist);
    return newArtist;
  },

  async forgotPassword(email: string): Promise<void> {
    await delay();
    const exists =
      storage.users.findByEmail(email) ?? storage.artists.findByEmail(email);
    if (!exists) throw new Error("No account found with that email.");
  },

  getCurrentUser(): User | Artist | null {
    return storage.session.get();
  },

  logout(): void {
    storage.session.clear();
  },

  isLoggedIn(): boolean {
    return storage.session.get() !== null;
  },

  isArtist(user: User | Artist | null): user is Artist {
    return user?.role === "artist";
  },

  isListener(user: User | Artist | null): user is User {
    return user?.role === "listener";
  },
};
