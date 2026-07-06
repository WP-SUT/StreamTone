import type { User, Artist, Song, Album, Playlist,AppNotification,UserRole, StaffUser, Ticket, VerificationRequest, ArtistSettlement, SubscriptionPricing } from "@/types/models";
import {
  mockUsers,
  mockArtists,
  mockSongs,
  mockAlbums,
  mockPlaylists,
  mockNotifications,
} from "@/mock/data";
import { mockStaff } from "@/mock/staff";
import { mockTickets } from "@/mock/tickets";
import { mockVerifications } from "@/mock/verifications";
import { mockSettlements } from "@/mock/settlements";
import { mockPricing } from "@/mock/pricing";
import { mockNotifications } from "@/mock/notifications";
import type { AppNotification } from "@/types/models";

const KEYS = {
  USERS: "app_users",
  ARTISTS: "app_artists",
  STAFF: "app_staff",
  SONGS: "app_songs",
  ALBUMS: "app_albums",
  PLAYLISTS: "app_playlists",
  TICKETS: "app_tickets",
  VERIFICATIONS: "app_verifications",
  SETTLEMENTS: "app_settlements",
  PRICING: "app_pricing",
  NOTIFICATIONS: "app_notifications",
  SESSION: "app_session",
    NOTIFICATIONS: "app_notifications",
} as const;

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

const STORAGE_VERSION = "4";

export function initStorage(): void {
  if (typeof window === "undefined") return;

  const version = localStorage.getItem("app_storage_version");
  if (version !== STORAGE_VERSION) {
    // Re-seed collections added after initial project setup
    if (!localStorage.getItem(KEYS.STAFF)) set(KEYS.STAFF, mockStaff);
    if (!localStorage.getItem(KEYS.TICKETS)) set(KEYS.TICKETS, mockTickets);
    if (!localStorage.getItem(KEYS.VERIFICATIONS)) set(KEYS.VERIFICATIONS, mockVerifications);
    if (!localStorage.getItem(KEYS.SETTLEMENTS)) set(KEYS.SETTLEMENTS, mockSettlements);
    if (!localStorage.getItem(KEYS.PRICING)) set(KEYS.PRICING, mockPricing);
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) set(KEYS.NOTIFICATIONS, mockNotifications);
    localStorage.setItem("app_storage_version", STORAGE_VERSION);
  }

  if (!localStorage.getItem(KEYS.USERS)) set(KEYS.USERS, mockUsers);
  if (!localStorage.getItem(KEYS.ARTISTS)) set(KEYS.ARTISTS, mockArtists);
  if (!localStorage.getItem(KEYS.STAFF)) set(KEYS.STAFF, mockStaff);
  if (!localStorage.getItem(KEYS.SONGS)) set(KEYS.SONGS, mockSongs);
  if (!localStorage.getItem(KEYS.ALBUMS)) set(KEYS.ALBUMS, mockAlbums);
  if (!localStorage.getItem(KEYS.PLAYLISTS)) set(KEYS.PLAYLISTS, mockPlaylists);
  if (!localStorage.getItem(KEYS.TICKETS)) set(KEYS.TICKETS, mockTickets);
  if (!localStorage.getItem(KEYS.VERIFICATIONS)) set(KEYS.VERIFICATIONS, mockVerifications);
  if (!localStorage.getItem(KEYS.SETTLEMENTS)) set(KEYS.SETTLEMENTS, mockSettlements);
  if (!localStorage.getItem(KEYS.PRICING)) set(KEYS.PRICING, mockPricing);
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) set(KEYS.NOTIFICATIONS, mockNotifications);
}

export const storage = {
  users: {
    getAll(): User[] {
      return get<User[]>(KEYS.USERS, []);
    },
    setAll(users: User[]): void {
      set(KEYS.USERS, users);
    },
    findById(id: string): User | undefined {
      return this.getAll().find((u) => u.id === id);
    },
    findByEmail(email: string): User | undefined {
      return this.getAll().find((u) => u.email === email);
    },
    upsert(user: User): void {
      const all = this.getAll();
      const idx = all.findIndex((u) => u.id === user.id);
      if (idx === -1) all.push(user);
      else all[idx] = user;
      this.setAll(all);
    },
    remove(id: string): void {
      this.setAll(this.getAll().filter((u) => u.id !== id));
    },
  },

  artists: {
    getAll(): Artist[] {
      return get<Artist[]>(KEYS.ARTISTS, []);
    },
    setAll(artists: Artist[]): void {
      set(KEYS.ARTISTS, artists);
    },
    findById(id: string): Artist | undefined {
      return this.getAll().find((a) => a.id === id);
    },
    findByEmail(email: string): Artist | undefined {
      return this.getAll().find((a) => a.email === email);
    },
    upsert(artist: Artist): void {
      const all = this.getAll();
      const idx = all.findIndex((a) => a.id === artist.id);
      if (idx === -1) all.push(artist);
      else all[idx] = artist;
      this.setAll(all);
    },
    remove(id: string): void {
      this.setAll(this.getAll().filter((a) => a.id !== id));
    },
  },

  songs: {
    getAll(): Song[] {
      return get<Song[]>(KEYS.SONGS, []);
    },
    setAll(songs: Song[]): void {
      set(KEYS.SONGS, songs);
    },
    findById(id: string): Song | undefined {
      return this.getAll().find((s) => s.id === id);
    },
    findByArtistId(artistId: string): Song[] {
      return this.getAll().filter((s) => s.artistId === artistId);
    },
    upsert(song: Song): void {
      const all = this.getAll();
      const idx = all.findIndex((s) => s.id === song.id);
      if (idx === -1) all.push(song);
      else all[idx] = song;
      this.setAll(all);
    },
  },

  albums: {
    getAll(): Album[] {
      return get<Album[]>(KEYS.ALBUMS, []);
    },
    setAll(albums: Album[]): void {
      set(KEYS.ALBUMS, albums);
    },
    findById(id: string): Album | undefined {
      return this.getAll().find((a) => a.id === id);
    },
    findByArtistId(artistId: string): Album[] {
      return this.getAll().filter((a) => a.artistId === artistId);
    },
    upsert(album: Album): void {
      const all = this.getAll();
      const idx = all.findIndex((a) => a.id === album.id);
      if (idx === -1) all.push(album);
      else all[idx] = album;
      this.setAll(all);
    },
  },

  playlists: {
    getAll(): Playlist[] {
      return get<Playlist[]>(KEYS.PLAYLISTS, []);
    },
    setAll(playlists: Playlist[]): void {
      set(KEYS.PLAYLISTS, playlists);
    },
    findById(id: string): Playlist | undefined {
      return this.getAll().find((p) => p.id === id);
    },
    findByOwnerId(ownerId: string): Playlist[] {
      return this.getAll().filter((p) => p.ownerId === ownerId);
    },
    upsert(playlist: Playlist): void {
      const all = this.getAll();
      const idx = all.findIndex((p) => p.id === playlist.id);
      if (idx === -1) all.push(playlist);
      else all[idx] = playlist;
      this.setAll(all);
    },
    remove(id: string): void {
      this.setAll(this.getAll().filter((p) => p.id !== id));
    },
  },

  staff: {
    getAll(): StaffUser[] {
      return get<StaffUser[]>(KEYS.STAFF, []);
    },
    setAll(staff: StaffUser[]): void {
      set(KEYS.STAFF, staff);
    },
    findById(id: string): StaffUser | undefined {
      return this.getAll().find((s) => s.id === id);
    },
    findByEmail(email: string): StaffUser | undefined {
      return this.getAll().find((s) => s.email === email);
    },
  },

  tickets: {
    getAll(): Ticket[] {
      return get<Ticket[]>(KEYS.TICKETS, []);
    },
    setAll(tickets: Ticket[]): void {
      set(KEYS.TICKETS, tickets);
    },
    findById(id: string): Ticket | undefined {
      return this.getAll().find((t) => t.id === id);
    },
    upsert(ticket: Ticket): void {
      const all = this.getAll();
      const idx = all.findIndex((t) => t.id === ticket.id);
      if (idx === -1) all.push(ticket);
      else all[idx] = ticket;
      this.setAll(all);
    },
  },

  verifications: {
    getAll(): VerificationRequest[] {
      return get<VerificationRequest[]>(KEYS.VERIFICATIONS, []);
    },
    setAll(items: VerificationRequest[]): void {
      set(KEYS.VERIFICATIONS, items);
    },
    findById(id: string): VerificationRequest | undefined {
      return this.getAll().find((v) => v.id === id);
    },
    upsert(item: VerificationRequest): void {
      const all = this.getAll();
      const idx = all.findIndex((v) => v.id === item.id);
      if (idx === -1) all.push(item);
      else all[idx] = item;
      this.setAll(all);
    },
  },

  settlements: {
    getAll(): ArtistSettlement[] {
      return get<ArtistSettlement[]>(KEYS.SETTLEMENTS, []);
    },
    setAll(items: ArtistSettlement[]): void {
      set(KEYS.SETTLEMENTS, items);
    },
    upsert(item: ArtistSettlement): void {
      const all = this.getAll();
      const idx = all.findIndex((s) => s.id === item.id);
      if (idx === -1) all.push(item);
      else all[idx] = item;
      this.setAll(all);
    },
  },

  pricing: {
    get(): SubscriptionPricing {
      return get<SubscriptionPricing>(KEYS.PRICING, mockPricing);
    },
    set(pricing: SubscriptionPricing): void {
      set(KEYS.PRICING, pricing);
    },
  },

  notifications: {
    getAll(): AppNotification[] {
      return get<AppNotification[]>(KEYS.NOTIFICATIONS, []);
    },
    setAll(items: AppNotification[]): void {
      set(KEYS.NOTIFICATIONS, items);
    },
    findById(id: string): AppNotification | undefined {
      return this.getAll().find((n) => n.id === id);
    },
    upsert(item: AppNotification): void {
      const all = this.getAll();
      const idx = all.findIndex((n) => n.id === item.id);
      if (idx === -1) all.push(item);
      else all[idx] = item;
      this.setAll(all);
    },
    remove(id: string): void {
      this.setAll(this.getAll().filter((n) => n.id !== id));
    },
  },

  session: {
    get(): User | Artist | StaffUser | null {
      return get<User | Artist | StaffUser | null>(KEYS.SESSION, null);
    },
    set(user: User | Artist | StaffUser): void {
      set(KEYS.SESSION, user);
    },
    clear(): void {
      remove(KEYS.SESSION);
    },
  },

  notifications: {
    getAll(): AppNotification[] {
      return get<AppNotification[]>(KEYS.NOTIFICATIONS, []);
    },
    setAll(notifications: AppNotification[]): void {
      set(KEYS.NOTIFICATIONS, notifications);
    },
    findByRecipient(recipientRole: Extract<UserRole, "listener" | "artist" | "support" | "admin">, recipientId: string): AppNotification[] {
      return this.getAll().filter((n) => n.recipientRole === recipientRole && n.recipientId === recipientId);
    },
    upsert(notification: AppNotification): void {
      const all = this.getAll();
      const idx = all.findIndex((n) => n.id === notification.id);
      if (idx === -1) all.unshift(notification);
      else all[idx] = notification;
      this.setAll(all);
    },
    remove(id: string): void {
      this.setAll(this.getAll().filter((n) => n.id !== id));
    },
    markAsRead(id: string): void {
      const all = this.getAll();
      const idx = all.findIndex((n) => n.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], isRead: true };
        this.setAll(all);
      }
    },
    markAllAsReadForRecipient(recipientRole: Extract<UserRole, "listener" | "artist" | "support" | "admin">, recipientId: string): void {
      const next = this.getAll().map((n) =>
        n.recipientRole === recipientRole && n.recipientId === recipientId ? { ...n, isRead: true } : n
      );
      this.setAll(next);
    },
  },
};
