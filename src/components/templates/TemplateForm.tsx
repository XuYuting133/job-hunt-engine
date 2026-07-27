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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api/fetcher";
import { useTemplateStore } from "@/stores/useTemplateStore";
import type { ResumeTemplate, CreateTemplateInput } from "@/types";

const DEFAULT_TEMPLATE = `# [Full Name]
[Email] | [Phone] | [Location]

<!-- SUMMARY -->
## Professional Summary

<!-- EXPERIENCE -->
## Experience

## Education

## Skills
`;

interface TemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ResumeTemplate | null;
}

export function TemplateForm({
  open,
  onOpenChange,
  initialData,
}: TemplateFormProps) {
  const isEditing = !!initialData;
  const { addTemplate, updateTemplate } = useTemplateStore();
  const [form, setForm] = useState<CreateTemplateInput>({
    template_name: "",
    markdown_content: DEFAULT_TEMPLATE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        template_name: initialData?.template_name || "",
        markdown_content: initialData?.markdown_content || DEFAULT_TEMPLATE,
      });
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!form.template_name.trim() || !form.markdown_content.trim()) return;
    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        const res = await apiFetch<{ data: ResumeTemplate }>(
          `/templates/${initialData.template_id}`,
          { method: "PATCH", body: JSON.stringify(form) }
        );
        updateTemplate(initialData.template_id, res.data);
        toast({ title: "Template updated" });
      } else {
        const res = await apiFetch<{ data: ResumeTemplate }>("/templates", {
          method: "POST",
          body: JSON.stringify(form),
        });
        addTemplate(res.data);
        toast({ title: "Template created" });
      }
      onOpenChange(false);
    } catch {
      toast({ title: "Failed to save template", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] rounded-t-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Template" : "New Template"}</SheetTitle>
          <SheetDescription>
            Write your resume template in markdown. Use {"<!-- SUMMARY -->"} and {"<!-- EXPERIENCE -->"} as placeholders.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input
              placeholder="e.g. Software Engineer Resume"
              value={form.template_name}
              onChange={(e) =>
                setForm({ ...form, template_name: e.target.value })
              }
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label>Markdown Content</Label>
            <Textarea
              className="min-h-[300px] font-mono text-sm"
              placeholder={DEFAULT_TEMPLATE}
              value={form.markdown_content}
              onChange={(e) =>
                setForm({ ...form, markdown_content: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.markdown_content.length} chars
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t shrink-0">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
