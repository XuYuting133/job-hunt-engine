"use client";

import { useEffect, useState } from "react";
import { MainShell } from "@/components/layout/MainShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { CardListSkeleton } from "@/components/shared/LoadingSkeleton";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateForm } from "@/components/templates/TemplateForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/fetcher";
import { toast } from "@/components/ui/use-toast";
import { Plus, FileText } from "lucide-react";
import type { ResumeTemplate } from "@/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResumeTemplate | null>(null);

  const fetchTemplates = async () => {
    try {
      const res = await apiFetch<{ data: ResumeTemplate[] }>("/templates");
      setTemplates(res.data || []);
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (template: ResumeTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (template: ResumeTemplate) => {
    if (!confirm(`Delete "${template.template_name}"?`)) return;
    try {
      await apiFetch(`/templates/${template.template_id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((t) => t.template_id !== template.template_id));
      toast({ title: "Template deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <MainShell title="Templates">
        <PageContainer>
          <CardListSkeleton count={3} />
        </PageContainer>
      </MainShell>
    );
  }

  return (
    <MainShell
      title="Templates"
      rightAction={
        <Button
          size="sm"
          onClick={() => { setEditingTemplate(null); setShowForm(true); }}
          className="h-9"
        >
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      }
    >
      <PageContainer>
        {templates.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No templates"
            description="Create markdown resume templates to use when generating resumes"
            action={
              <Button
                onClick={() => { setEditingTemplate(null); setShowForm(true); }}
              >
                <Plus className="w-4 h-4 mr-2" /> Create Template
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {templates.map((t) => (
              <TemplateCard
                key={t.template_id}
                template={t}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </PageContainer>

      <TemplateForm
        open={showForm}
        onOpenChange={setShowForm}
        initialData={editingTemplate}
      />
    </MainShell>
  );
}
