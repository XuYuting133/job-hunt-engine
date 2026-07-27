"use client";

import { useEffect, useState } from "react";
import { MainShell } from "@/components/layout/MainShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { CardListSkeleton } from "@/components/shared/LoadingSkeleton";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/fetcher";
import { Plus, Target } from "lucide-react";
import type { Campaign } from "@/types";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch<{ data: Campaign[] }>("/campaigns");
      setCampaigns(res.data || []);
    } catch {
      // handled by middleware
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (isLoading) {
    return (
      <MainShell title="Campaigns">
        <PageContainer>
          <CardListSkeleton count={4} />
        </PageContainer>
      </MainShell>
    );
  }

  return (
    <MainShell
      title="Campaigns"
      rightAction={
        <Button size="sm" onClick={() => setShowForm(true)} className="h-9">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      }
    >
      <PageContainer>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={<Target className="w-12 h-12" />}
            title="No campaigns"
            description="Create a campaign to start tracking your job hunt preparation"
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.campaign_id} campaign={c} />
            ))}
          </div>
        )}
      </PageContainer>

      <CampaignForm open={showForm} onOpenChange={setShowForm} />
    </MainShell>
  );
}
