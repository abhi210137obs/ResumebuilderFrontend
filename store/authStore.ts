import { create } from "zustand";
import { authApi } from "@/lib/api";
import type { User } from "@/lib/types";
import type { LoginValues, RegisterValues } from "@/lib/validators";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  init: () => Promise<void>;
  login: (values: LoginValues) => Promise<User>;
  register: (values: RegisterValues) => Promise<User>;
  logout: () => Promise<void>;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "idle",
  init: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    try {
      const user = await authApi.me();
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },
  login: async (values) => {
    const user = await authApi.login(values);
    set({ user, status: "authenticated" });
    return user;
  },
  register: async (values) => {
    const user = await authApi.register(values);
    set({ user, status: "authenticated" });
    return user;
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },
  clear: () => set({ user: null, status: "unauthenticated" }),
}));
