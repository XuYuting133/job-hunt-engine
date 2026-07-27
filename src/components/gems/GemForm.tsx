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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api/fetcher";
import { useRoleStore } from "@/stores/useRoleStore";
import { X, Plus } from "lucide-react";
import type { ExperienceGem, CreateGemInput, GemCategory } from "@/types";

const CATEGORIES: { value: GemCategory; label: string }[] = [
  { value: "project", label: "Project" },
  { value: "milestone", label: "Milestone" },
  { value: "award", label: "Award" },
  { value: "optimization", label: "Optimization" },
];

interface GemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
  initialData?: ExperienceGem | null;
  onSuccess?: () => void;
}

export function GemForm({
  open,
  onOpenChange,
  roleId,
  initialData,
  onSuccess,
}: GemFormProps) {
  const isEditing = !!initialData;
  const { addGem, updateGem } = useRoleStore();
  const [form, setForm] = useState<CreateGemInput>({
    role_id: roleId,
    gem_title: "",
    gem_description: "",
    quantified_achievements: "",
    skill_tags: [],
    gem_category: "project",
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentForm, setAttachmentForm] = useState({
    attach_name: "",
    attach_type: "link",
    attach_url: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        role_id: roleId,
        gem_title: initialData?.gem_title || "",
        gem_description: initialData?.gem_description || "",
        quantified_achievements: initialData?.quantified_achievements || "",
        skill_tags: initialData?.skill_tags || [],
        gem_category: initialData?.gem_category || "project",
      });
    }
  }, [open, initialData, roleId]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.skill_tags?.includes(tag)) {
      setForm({ ...form, skill_tags: [...(form.skill_tags || []), tag] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm({
      ...form,
      skill_tags: (form.skill_tags || []).filter((t) => t !== tag),
    });
  };

  const handleSubmit = async () => {
    if (!form.gem_title.trim() || !form.gem_description.trim()) return;
    setIsSubmitting(true);

    try {
      let gem: ExperienceGem;
      if (isEditing && initialData) {
        const res = await apiFetch<{ data: ExperienceGem }>(
          `/gems/${initialData.gem_id}`,
          { method: "PATCH", body: JSON.stringify(form) }
        );
        gem = res.data;
        updateGem(initialData.gem_id, gem);
        toast({ title: "Gem updated" });
      } else {
        const res = await apiFetch<{ data: ExperienceGem }>("/gems", {
          method: "POST",
          body: JSON.stringify(form),
        });
        gem = res.data;
        addGem(roleId, gem);
        toast({ title: "Gem created" });
      }

      // Add attachment if filled
      if (attachmentForm.attach_name && attachmentForm.attach_url) {
        await apiFetch("/attachments", {
          method: "POST",
          body: JSON.stringify({
            gem_id: gem.gem_id,
            ...attachmentForm,
          }),
        }).catch(() => {});
      }

      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast({ title: "Failed to save gem", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] rounded-t-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Gem" : "New Gem"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update this achievement gem" : "Add an achievement gem to this role"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              placeholder="e.g. Migrated auth system to OAuth 2.0"
              value={form.gem_title}
              onChange={(e) => setForm({ ...form, gem_title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe what you did and how you did it..."
              rows={3}
              value={form.gem_description}
              onChange={(e) => setForm({ ...form, gem_description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Quantified Achievement</Label>
            <Textarea
              placeholder="e.g. Reduced API latency by 40%, saving $50K annually"
              rows={2}
              value={form.quantified_achievements || ""}
              onChange={(e) =>
                setForm({ ...form, quantified_achievements: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.value}
                  variant={form.gem_category === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm({ ...form, gem_category: cat.value })}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button variant="outline" size="icon" onClick={addTag} type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {form.skill_tags && form.skill_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.skill_tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="border-t pt-4 space-y-3">
            <Label className="text-sm font-semibold">Attachment (optional)</Label>
            <Input
              placeholder="Name (e.g. Certificate PDF)"
              value={attachmentForm.attach_name}
              onChange={(e) =>
                setAttachmentForm({ ...attachmentForm, attach_name: e.target.value })
              }
            />
            <Input
              placeholder="URL (e.g. https://...)"
              value={attachmentForm.attach_url}
              onChange={(e) =>
                setAttachmentForm({ ...attachmentForm, attach_url: e.target.value })
              }
            />
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
