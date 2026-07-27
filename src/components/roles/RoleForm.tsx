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
import { useRoleStore } from "@/stores/useRoleStore";
import type { JobRole, CreateRoleInput } from "@/types";

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: JobRole | null;
}

export function RoleForm({ open, onOpenChange, initialData }: RoleFormProps) {
  const isEditing = !!initialData;
  const { addRole, updateRole } = useRoleStore();
  const [form, setForm] = useState<CreateRoleInput>({
    role_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    overall_job_scope: "",
    is_archived: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        role_title: initialData?.role_title || "",
        company_name: initialData?.company_name || "",
        start_date: initialData?.start_date || "",
        end_date: initialData?.end_date || "",
        overall_job_scope: initialData?.overall_job_scope || "",
        is_archived: initialData?.is_archived || false,
      });
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!form.role_title.trim() || !form.company_name.trim() || !form.start_date) return;
    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        const res = await apiFetch<{ data: JobRole }>(
          `/roles/${initialData.role_id}`,
          { method: "PATCH", body: JSON.stringify(form) }
        );
        updateRole(initialData.role_id, res.data);
        toast({ title: "Role updated" });
      } else {
        const res = await apiFetch<{ data: JobRole }>("/roles", {
          method: "POST",
          body: JSON.stringify(form),
        });
        addRole(res.data);
        toast({ title: "Role created" });
      }
      onOpenChange(false);
    } catch {
      toast({ title: "Failed to save role", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85dvh] rounded-t-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Role" : "New Role"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update this job role" : "Add a job role to build your experience repository"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            <Label htmlFor="rtitle">Role Title *</Label>
            <Input
              id="rtitle"
              placeholder="e.g. Senior Software Engineer"
              value={form.role_title}
              onChange={(e) => setForm({ ...form, role_title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rcompany">Company *</Label>
            <Input
              id="rcompany"
              placeholder="e.g. Acme Corp"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rstart">Start Date *</Label>
              <Input
                id="rstart"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rend">End Date</Label>
              <Input
                id="rend"
                type="date"
                value={form.end_date || ""}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rscope">Overall Scope</Label>
            <Textarea
              id="rscope"
              placeholder="Briefly describe your overall responsibilities..."
              rows={3}
              value={form.overall_job_scope || ""}
              onChange={(e) => setForm({ ...form, overall_job_scope: e.target.value })}
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
