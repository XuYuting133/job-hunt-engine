"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { CardListSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/fetcher";
import { formatDate } from "@/lib/utils";
import { Plus, FileText, Briefcase, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "@/components/ui/use-toast";
import type { Campaign, JobJD, ResumeVersion } from "@/types";

// We'll inline the JD form here for brevity
function JDFormSimple({
  open,
  onOpenChange,
  campaignId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  campaignId: string;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      // First create JD, then optionally parse
      const res = await apiFetch<{ data: JobJD }>("/jds", {
        method: "POST",
        body: JSON.stringify({
          campaign_id: campaignId,
          job_title: title,
          jd_raw_content: content,
        }),
      });
      // Trigger parse
      await apiFetch("/ai/parse-jd", {
        method: "POST",
        body: JSON.stringify({ jd_text: content }),
      }).catch(() => {});
      onSuccess();
      onOpenChange(false);
      setTitle("");
      setContent("");
      toast({ title: "JD added" });
    } catch {
      toast({ title: "Failed to add JD", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => onOpenChange(false)}>
      <div
        className="w-full bg-background rounded-t-2xl animate-slide-up flex flex-col"
        style={{ maxHeight: "85dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-1">Add Job Description</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Paste a job description to parse skills and requirements
          </p>
          <input
            className="w-full h-11 rounded-md border px-3 mb-3 text-base"
            placeholder="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-md border px-3 py-2 text-base min-h-[150px] mb-4"
            placeholder="Paste job description here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex gap-3 p-6 pt-3 border-t sticky bottom-0 bg-background">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add JD"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Inline ResumePreview component
function ResumePreviewSimple({
  content,
  onClose,
}: {
  content: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 max-h-[85dvh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Resume Preview</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-sm bg-muted/30 rounded-lg p-4">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [jds, setJds] = useState<JobJD[]>([]);
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showJDForm, setShowJDForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [campRes, jdRes, resRes] = await Promise.all([
        apiFetch<{ data: Campaign }>(`/campaigns/${id}`),
        apiFetch<{ data: JobJD[] }>(`/jds?campaign_id=${id}`),
        apiFetch<{ data: ResumeVersion[] }>(`/resumes?campaign_id=${id}`),
      ]);
      setCampaign(campRes.data);
      setJds(jdRes.data || []);
      setResumes(resRes.data || []);
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await apiFetch(`/campaigns/${id}`, { method: "DELETE" });
      toast({ title: "Campaign deleted" });
      window.location.href = "/campaigns";
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <MainShell title="Loading..." showBack backHref="/campaigns">
        <PageContainer>
          <CardListSkeleton count={3} />
        </PageContainer>
      </MainShell>
    );
  }

  if (!campaign) {
    return (
      <MainShell title="Not Found" showBack backHref="/campaigns">
        <PageContainer>
          <EmptyState title="Campaign not found" />
        </PageContainer>
      </MainShell>
    );
  }

  return (
    <MainShell
      title={campaign.campaign_name}
      showBack
      backHref="/campaigns"
      rightAction={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      }
    >
      <PageContainer>
        {/* Campaign info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{campaign.target_job_title}</CardTitle>
          </CardHeader>
          <CardContent>
            {campaign.prep_deadline && (
              <p className="text-sm text-muted-foreground">
                Prep deadline: {formatDate(campaign.prep_deadline)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* JDs Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Job Descriptions
            </h2>
            <Button size="sm" variant="outline" onClick={() => setShowJDForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add JD
            </Button>
          </div>
          {jds.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No JDs added yet
            </p>
          ) : (
            <div className="space-y-2">
              {jds.map((jd) => (
                <Card key={jd.jd_id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{jd.job_title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {jd.jd_raw_content.slice(0, 120)}...
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 ml-2">
                      {jd.parsed_skills?.skills?.length || 0} skills
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Resumes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Resumes
            </h2>
          </div>
          {resumes.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No resumes generated yet. Go to{" "}
              <a href="/generate" className="text-primary underline">
                Generate
              </a>{" "}
              to create one.
            </p>
          ) : (
            <div className="space-y-2">
              {resumes.map((rv) => (
                <Card key={rv.resume_version_id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Resume v{formatDate(rv.created_at)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rv.matched_gem_ids.length} gems matched
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewContent(rv.final_markdown_content)}
                    >
                      Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageContainer>

      <JDFormSimple
        open={showJDForm}
        onOpenChange={setShowJDForm}
        campaignId={id}
        onSuccess={fetchData}
      />

      {previewContent && (
        <ResumePreviewSimple
          content={previewContent}
          onClose={() => setPreviewContent(null)}
        />
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Campaign"
        description="This will delete the campaign and all associated JDs and resumes. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </MainShell>
  );
}
