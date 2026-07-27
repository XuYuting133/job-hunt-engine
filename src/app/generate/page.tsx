"use client";

import { useEffect, useState } from "react";
import { MainShell } from "@/components/layout/MainShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { CardListSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api/fetcher";
import { exportResumePDF } from "@/lib/pdf/export";
import { toast } from "@/components/ui/use-toast";
import {
  Wand2,
  FileText,
  Download,
  Loader2,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type {
  Campaign,
  ResumeTemplate,
  JobJD,
  GenerateResumeResult,
  ResumeVersion,
} from "@/types";

export default function GeneratePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selections
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedJDId, setSelectedJDId] = useState<string>("");
  const [campaignJDs, setCampaignJDs] = useState<JobJD[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [matchedGemIds, setMatchedGemIds] = useState<string[]>([]);
  const [editedMarkdown, setEditedMarkdown] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [savedVersionId, setSavedVersionId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [campRes, tplRes] = await Promise.all([
          apiFetch<{ data: Campaign[] }>("/campaigns"),
          apiFetch<{ data: ResumeTemplate[] }>("/templates"),
        ]);
        setCampaigns(campRes.data || []);
        setTemplates(tplRes.data || []);
      } catch {
        // handled
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Fetch JDs when campaign changes
  useEffect(() => {
    if (!selectedCampaignId) {
      setCampaignJDs([]);
      setSelectedJDId("");
      return;
    }
    const fetchJDs = async () => {
      try {
        const res = await apiFetch<{ data: JobJD[] }>(
          `/jds?campaign_id=${selectedCampaignId}`
        );
        setCampaignJDs(res.data || []);
      } catch {
        setCampaignJDs([]);
      }
    };
    fetchJDs();
  }, [selectedCampaignId]);

  const canGenerate = selectedTemplateId && selectedJDId;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setGeneratedMarkdown(null);

    try {
      const res = await apiFetch<{ data: GenerateResumeResult }>(
        "/ai/generate-resume",
        {
          method: "POST",
          body: JSON.stringify({
            template_id: selectedTemplateId,
            jd_id: selectedJDId,
          }),
        }
      );
      setGeneratedMarkdown(res.data.markdown_content);
      setEditedMarkdown(res.data.markdown_content);
      setMatchedGemIds(res.data.matched_gem_ids);
      setSavedVersionId(null);
      toast({ title: "Resume generated!" });
    } catch {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await apiFetch<{ data: ResumeVersion }>("/resumes", {
        method: "POST",
        body: JSON.stringify({
          campaign_id: selectedCampaignId,
          template_id: selectedTemplateId,
          jd_id: selectedJDId,
          matched_gem_ids: matchedGemIds,
          final_markdown_content: editedMarkdown,
        }),
      });
      setSavedVersionId(res.data.resume_version_id);
      toast({ title: "Resume saved to campaign!" });
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const handleExportPDF = () => {
    exportResumePDF(editedMarkdown || generatedMarkdown || "", "resume.pdf");
    toast({ title: "PDF downloaded" });
  };

  if (isLoading) {
    return (
      <MainShell title="Generate">
        <PageContainer>
          <CardListSkeleton count={3} />
        </PageContainer>
      </MainShell>
    );
  }

  return (
    <MainShell title="Generate Resume">
      <PageContainer>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={<Wand2 className="w-12 h-12" />}
            title="Set up a campaign first"
            description="Create a campaign and add a job description before generating a resume"
            action={
              <a href="/campaigns">
                <Button>
                  <ArrowRight className="w-4 h-4 mr-2" /> Go to Campaigns
                </Button>
              </a>
            }
          />
        ) : templates.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="Create a template first"
            description="You need at least one resume template to generate a resume"
            action={
              <a href="/templates">
                <Button>
                  <ArrowRight className="w-4 h-4 mr-2" /> Go to Templates
                </Button>
              </a>
            }
          />
        ) : (
          <div className="space-y-6">
            {/* Step 1: Selections */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">
                    1
                  </span>
                  Select Campaign, JD & Template
                </h3>

                {/* Campaign */}
                <div className="space-y-2">
                  <Label className="text-xs">Campaign</Label>
                  <div className="flex flex-wrap gap-2">
                    {campaigns.map((c) => (
                      <Button
                        key={c.campaign_id}
                        variant={
                          selectedCampaignId === c.campaign_id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCampaignId(c.campaign_id)}
                      >
                        {c.campaign_name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* JD */}
                {selectedCampaignId && (
                  <div className="space-y-2">
                    <Label className="text-xs">Job Description</Label>
                    {campaignJDs.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No JDs in this campaign.{" "}
                        <a
                          href={`/campaigns/${selectedCampaignId}`}
                          className="text-primary underline"
                        >
                          Add one first
                        </a>
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {campaignJDs.map((jd) => (
                          <Button
                            key={jd.jd_id}
                            variant={
                              selectedJDId === jd.jd_id ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedJDId(jd.jd_id)}
                          >
                            {jd.job_title}
                            {jd.parsed_skills?.skills?.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-1.5 text-[10px]"
                              >
                                {jd.parsed_skills.skills.length} skills
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Template */}
                <div className="space-y-2">
                  <Label className="text-xs">Template</Label>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((t) => (
                      <Button
                        key={t.template_id}
                        variant={
                          selectedTemplateId === t.template_id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedTemplateId(t.template_id)}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        {t.template_name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base"
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: Generated Result */}
            {(isGenerating || generatedMarkdown) && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">
                        2
                      </span>
                      Result
                    </h3>
                    <div className="flex gap-2">
                      {savedVersionId && (
                        <Badge variant="secondary" className="gap-1">
                          <Check className="w-3 h-3" /> Saved
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? "Preview" : "Edit"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportPDF}
                      >
                        <Download className="w-4 h-4 mr-1" /> PDF
                      </Button>
                      {!savedVersionId && (
                        <Button size="sm" onClick={handleSave}>
                          Save
                        </Button>
                      )}
                    </div>
                  </div>

                  {isGenerating ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded animate-pulse w-full" />
                      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  ) : isEditing ? (
                    <Textarea
                      className="min-h-[400px] font-mono text-sm"
                      value={editedMarkdown}
                      onChange={(e) => setEditedMarkdown(e.target.value)}
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none bg-muted/20 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {editedMarkdown}
                      </pre>
                    </div>
                  )}

                  {matchedGemIds.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                      {matchedGemIds.length} experience gem
                      {matchedGemIds.length !== 1 ? "s" : ""} matched from your
                      repository
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </PageContainer>
    </MainShell>
  );
}
