"use client";

import { create } from "zustand";
import type { ResumeTemplate } from "@/types";

interface TemplateState {
  templates: ResumeTemplate[];
  selectedTemplate: ResumeTemplate | null;
  isLoading: boolean;
  error: string | null;

  setTemplates: (templates: ResumeTemplate[]) => void;
  addTemplate: (template: ResumeTemplate) => void;
  updateTemplate: (id: string, updates: Partial<ResumeTemplate>) => void;
  removeTemplate: (id: string) => void;
  setSelected: (template: ResumeTemplate | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  selectedTemplate: null,
  isLoading: false,
  error: null,

  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) =>
    set((state) => ({ templates: [template, ...state.templates] })),
  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.template_id === id ? { ...t, ...updates } : t
      ),
    })),
  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.template_id !== id),
    })),
  setSelected: (template) => set({ selectedTemplate: template }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
