"use client";

import { create } from "zustand";
import type { JobRole, ExperienceGem } from "@/types";

interface RoleState {
  roles: JobRole[];
  gemsByRoleId: Record<string, ExperienceGem[]>;
  selectedRole: JobRole | null;
  isLoading: boolean;
  error: string | null;

  setRoles: (roles: JobRole[]) => void;
  addRole: (role: JobRole) => void;
  updateRole: (id: string, updates: Partial<JobRole>) => void;
  removeRole: (id: string) => void;
  setSelected: (role: JobRole | null) => void;

  setGems: (roleId: string, gems: ExperienceGem[]) => void;
  addGem: (roleId: string, gem: ExperienceGem) => void;
  updateGem: (gemId: string, updates: Partial<ExperienceGem>) => void;
  removeGem: (roleId: string, gemId: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  gemsByRoleId: {},
  selectedRole: null,
  isLoading: false,
  error: null,

  setRoles: (roles) => set({ roles }),
  addRole: (role) => set((state) => ({ roles: [role, ...state.roles] })),
  updateRole: (id, updates) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.role_id === id ? { ...r, ...updates } : r)),
    })),
  removeRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.role_id !== id),
      gemsByRoleId: (() => {
        const { [id]: _, ...rest } = state.gemsByRoleId;
        return rest;
      })(),
    })),
  setSelected: (role) => set({ selectedRole: role }),

  setGems: (roleId, gems) =>
    set((state) => ({
      gemsByRoleId: { ...state.gemsByRoleId, [roleId]: gems },
    })),
  addGem: (roleId, gem) =>
    set((state) => ({
      gemsByRoleId: {
        ...state.gemsByRoleId,
        [roleId]: [gem, ...(state.gemsByRoleId[roleId] || [])],
      },
    })),
  updateGem: (gemId, updates) =>
    set((state) => {
      const newGemsByRoleId = { ...state.gemsByRoleId };
      for (const roleId of Object.keys(newGemsByRoleId)) {
        newGemsByRoleId[roleId] = newGemsByRoleId[roleId].map((g) =>
          g.gem_id === gemId ? { ...g, ...updates } : g
        );
      }
      return { gemsByRoleId: newGemsByRoleId };
    }),
  removeGem: (roleId, gemId) =>
    set((state) => ({
      gemsByRoleId: {
        ...state.gemsByRoleId,
        [roleId]: (state.gemsByRoleId[roleId] || []).filter(
          (g) => g.gem_id !== gemId
        ),
      },
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
