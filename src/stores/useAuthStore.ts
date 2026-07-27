"use client";

import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
      });
    } catch {
      set({ isLoading: false, error: "Failed to initialize auth" });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ session: data.session, user: data.user, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Login failed",
      });
      throw err;
    }
  },

  signup: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      set({ session: data.session, user: data.user, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Signup failed",
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Logout failed",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
