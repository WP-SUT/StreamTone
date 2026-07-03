import { storage } from "@/lib/storage";
import { User, Artist, StaffUser, Gender, VerificationRequest } from "@/types/models";


type Account = User | Artist | StaffUser;

export const authService = {
  async login(email: string, password: string): Promise<Account> {
    await new Promise((res) => setTimeout(res, 800));

    // Check artists
    const artist = storage.artists.findByEmail(email);
    if (artist) {
      if (password !== "") throw new Error("Invalid credentials");
      storage.session.set(artist);
      return artist;
    }

    // Check users (mock seed + any registered via this session)
    const user = storage.users.findByEmail(email);
    if (user) {
      if (password !== user.password) throw new Error("Invalid credentials");
      storage.session.set(user);
      return user;
    }

    throw new Error("No account found with this email");
  },

  async registerListener(data: {
    displayName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    gender: Gender;
  }): Promise<User> {
    await new Promise((res) => setTimeout(res, 800));

    // Check email uniqueness across users and artists
    if (storage.users.findByEmail(data.email) || storage.artists.findByEmail(data.email)) {
      throw new Error("An account with this email already exists");
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      displayName: data.displayName,
      username: `user_${Date.now().toString().slice(-6)}`,
      password: data.password,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      role: "listener",
      isPremium: false,
      subscriptionTier: "basic",
      dailyStreamCount: 0,
      followingUserIds: [],
      followingArtistIds: [],
      followerIds: [],
      playlistIds: [],
      createdAt: new Date().toISOString(),
    };

    storage.users.upsert(newUser);
    storage.session.set(newUser);

    return newUser;
  },

  logout(): void {
    storage.session.clear();
  },

  async registerArtist(data: {
  artistName: string;
  email: string;
  password: string;
  portfolioUrls: string[];
}): Promise<Artist> {
  await new Promise((res) => setTimeout(res, 800));

  // Check email uniqueness
  if (storage.users.findByEmail(data.email) || storage.artists.findByEmail(data.email)) {
    throw new Error("An account with this email already exists");
  }

  const newArtist: Artist = {
    id: `a_${Date.now()}`,
    artistName: data.artistName,
    password: data.password,
    email: data.email,
    isVerified: false,
    approvalStatus: "pending",
    portfolioUrls: data.portfolioUrls,
    followerCount: 0,
    totalStreams: 0,
    albumIds: [],
    singleIds: [],
    role: "artist",
    createdAt: new Date().toISOString(),
  };

  storage.artists.upsert(newArtist);

  // Create verification request
  const verificationRequest: VerificationRequest = {
    id: `vr_${Date.now()}`,
    artistId: newArtist.id,
    artistName: newArtist.artistName,
    portfolioUrls: data.portfolioUrls,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  // storage.verificationRequests.upsert(verificationRequest);

  return newArtist;
},

};
