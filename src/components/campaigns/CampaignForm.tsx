"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api/fetcher";
import { useCampaignStore } from "@/stores/useCampaignStore";
import type { Campaign, CreateCampaignInput } from "@/types";

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Campaign | null;
}

export function CampaignForm({
  open,
  onOpenChange,
  initialData,
}: CampaignFormProps) {
  const isEditing = !!initialData;
  const { addCampaign, updateCampaign } = useCampaignStore();
  const [form, setForm] = useState<CreateCampaignInput>({
    campaign_name: "",
    target_job_title: "",
    prep_deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        campaign_name: initialData?.campaign_name || "",
        target_job_title: initialData?.target_job_title || "",
        prep_deadline: initialData?.prep_deadline || "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!form.campaign_name.trim() || !form.target_job_title.trim()) return;
    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        const res = await apiFetch<{ data: Campaign }>(
          `/campaigns/${initialData.campaign_id}`,
          { method: "PATCH", body: JSON.stringify(form) }
        );
        updateCampaign(initialData.campaign_id, res.data);
        toast({ title: "Campaign updated" });
      } else {
        const res = await apiFetch<{ data: Campaign }>("/campaigns", {
          method: "POST",
          body: JSON.stringify(form),
        });
        addCampaign(res.data);
        toast({ title: "Campaign created" });
      }
      onOpenChange(false);
    } catch {
      toast({ title: "Failed to save campaign", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85dvh] rounded-t-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Campaign" : "New Campaign"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this job hunt campaign"
              : "Create a new job hunt campaign to organize your preparation"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            <Label htmlFor="cname">Campaign Name</Label>
            <Input
              id="cname"
              placeholder="e.g. 2026 Backend Engineer Hunt"
              value={form.campaign_name}
              onChange={(e) =>
                setForm({ ...form, campaign_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cjob">Target Job Title</Label>
            <Input
              id="cjob"
              placeholder="e.g. Senior Backend Engineer"
              value={form.target_job_title}
              onChange={(e) =>
                setForm({ ...form, target_job_title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cdeadline">Prep Deadline (optional)</Label>
            <Input
              id="cdeadline"
              type="date"
              value={form.prep_deadline || ""}
              onChange={(e) =>
                setForm({ ...form, prep_deadline: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t shrink-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
