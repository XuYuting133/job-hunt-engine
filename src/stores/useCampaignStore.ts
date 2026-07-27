"use client";

import { create } from "zustand";
import type { Campaign } from "@/types";

interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;

  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  setSelected: (campaign: Campaign | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [],
  selectedCampaign: null,
  isLoading: false,
  error: null,

  setCampaigns: (campaigns) => set({ campaigns }),
  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [campaign, ...state.campaigns] })),
  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.campaign_id === id ? { ...c, ...updates } : c
      ),
      selectedCampaign:
        state.selectedCampaign?.campaign_id === id
          ? { ...state.selectedCampaign, ...updates }
          : state.selectedCampaign,
    })),
  removeCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.campaign_id !== id),
      selectedCampaign:
        state.selectedCampaign?.campaign_id === id
          ? null
          : state.selectedCampaign,
    })),
  setSelected: (campaign) => set({ selectedCampaign: campaign }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
