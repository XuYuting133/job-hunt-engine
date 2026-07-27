"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await apiFetch<{ data: Campaign[] }>("/campaigns");
      setCampaigns(res.data || []);
    } catch {
      // auth handled by middleware
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (isLoading) {
    return (
      <MainShell title="Dashboard">
        <PageContainer>
          <CardListSkeleton count={4} />
        </PageContainer>
      </MainShell>
    );
  }

  const handleFormSuccess = () => {
    fetchCampaigns();
  };

  return (
    <MainShell
      title="Job Hunt"
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
            title="No campaigns yet"
            description="Create your first job hunt campaign to start organizing your preparation"
            action={
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
              Active Campaigns
            </h2>
            {campaigns.map((c) => (
              <CampaignCard key={c.campaign_id} campaign={c} />
            ))}
          </div>
        )}
      </PageContainer>

      <CampaignForm
        open={showForm}
        onOpenChange={setShowForm}
      />
    </MainShell>
  );
}
