import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Artist } from "@/types";

type AuthUser = User | Artist;

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
  set((state) => ({
    user: state.user ? { ...state.user, ...updates } as AuthUser : null,
  })),
    }),
    { name: "streamtone-auth" }
  )
);
