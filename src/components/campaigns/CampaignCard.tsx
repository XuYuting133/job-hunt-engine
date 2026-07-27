"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import type { Campaign } from "@/types";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.campaign_id}`}>
      <Card className="hover:bg-accent/50 transition-colors active:scale-[0.98] cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate">
                {campaign.campaign_name}
              </CardTitle>
              <CardDescription className="truncate">
                {campaign.target_job_title}
              </CardDescription>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent>
          {campaign.prep_deadline && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Deadline: {formatDate(campaign.prep_deadline)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
