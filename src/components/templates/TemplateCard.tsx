"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import type { ResumeTemplate } from "@/types";

interface TemplateCardProps {
  template: ResumeTemplate;
  onEdit: (t: ResumeTemplate) => void;
  onDelete: (t: ResumeTemplate) => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm truncate">
                {template.template_name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 font-mono bg-muted/30 rounded p-2 mt-2">
              {template.markdown_content.slice(0, 200) || "Empty template"}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              Updated {timeAgo(template.updated_at)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(template)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onDelete(template)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
