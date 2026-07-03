// ─── User roles ───────────────────────────────────────────
export type UserRole = "listener" | "artist" | "support" | "admin";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say"

// ─── Listener (ordinary user) ─────────────────────────────
export interface User {
  id: string;
  displayName: string;
  username: string;
  password: string;
  email: string;
  dateOfBirth: string;       // ISO date string
  gender: Gender;
  avatarUrl?: string;
  role: "listener";
  isPremium: boolean;
  subscriptionTier: "gold" | "silver" | "basic";
  dailyStreamCount: number;
  followingUserIds: string[];
  followingArtistIds: string[];
  followerIds: string[];
  playlistIds: string[];
  createdAt: string;
}

// ─── Artist ───────────────────────────────────────────────
export interface Artist {
  id: string;
  artistName: string;
   password: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  portfolioUrls: string[];   // sample works submitted at registration
  followerCount: number;
  totalStreams: number;
  albumIds: string[];
  singleIds: string[];
  role: "artist";
  createdAt: string;
}

// ─── Support / Admin ──────────────────────────────────────
export interface StaffUser {
  id: string;
  displayName: string;
   password: string;
  email: string;
  role: "support" | "admin";
  avatarUrl?: string;
  createdAt: string;
}

// ─── Song ─────────────────────────────────────────────────
export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  coverUrl: string | undefined;
  audioUrl: string;
  dominantColor: string;
  duration: number;          // seconds
  genre: string;
  releaseYear: number;
  streamCount: number;
  lyrics?: string;
  collaborators?: string[];
  isSingle: boolean;
  createdAt: string;
}

// ─── Album ────────────────────────────────────────────────
export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  trackIds: string[];        // ordered list of Song ids
  totalDuration: number;     // seconds
  streamCount: number;
  createdAt: string;
}

// ─── Playlist ─────────────────────────────────────────────
export interface Playlist {
  id: string;
  title: string;
  ownerId: string;           // User id
  coverUrl?: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Ticket ───────────────────────────────────────────────
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketCategory = "technical" | "billing" | "content" | "other";

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  body: string;
  sentAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  openedById: string;        // User or Artist id
  assignedToId?: string;     // Support staff id
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

// ─── Artist verification request ──────────────────────────
export interface VerificationRequest {
  id: string;
  artistId: string;
  artistName: string;
  portfolioUrls: string[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedById?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// ─── Subscription ─────────────────────────────────────────
export type PlanName = "free" | "premium_monthly" | "premium_yearly";

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanName;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}



