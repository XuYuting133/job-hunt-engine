"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api/fetcher";
import { useRoleStore } from "@/stores/useRoleStore";
import { ChevronDown, ChevronUp, Pencil, Trash2, Paperclip } from "lucide-react";
import type { ExperienceGem, GemAttachment } from "@/types";

interface GemCardProps {
  gem: ExperienceGem;
  attachments: GemAttachment[];
  roleId: string;
  onEdit: (gem: ExperienceGem) => void;
  onRefresh: () => void;
}

const categoryColors: Record<string, string> = {
  project: "bg-blue-100 text-blue-800 border-blue-200",
  milestone: "bg-green-100 text-green-800 border-green-200",
  award: "bg-yellow-100 text-yellow-800 border-yellow-200",
  optimization: "bg-purple-100 text-purple-800 border-purple-200",
};

export function GemCard({ gem, attachments, roleId, onEdit, onRefresh }: GemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { removeGem } = useRoleStore();

  const handleDelete = async () => {
    if (!confirm("Delete this gem?")) return;
    try {
      await apiFetch(`/gems/${gem.gem_id}`, { method: "DELETE" });
      removeGem(roleId, gem.gem_id);
      toast({ title: "Gem deleted" });
    } catch {
      toast({ title: "Failed to delete gem", variant: "destructive" });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="pb-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-sm font-semibold">
                {gem.gem_title}
              </CardTitle>
              {gem.gem_category && (
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${categoryColors[gem.gem_category] || ""}`}
                >
                  {gem.gem_category}
                </Badge>
              )}
            </div>
            {!expanded && (
              <CardDescription className="line-clamp-2 text-xs">
                {gem.gem_description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); onEdit(gem); }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm">{gem.gem_description}</p>
          {gem.quantified_achievements && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Key Achievement
              </p>
              <p className="text-sm bg-primary/5 rounded-md p-2 border">
                {gem.quantified_achievements}
              </p>
            </div>
          )}
          {gem.skill_tags && gem.skill_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {gem.skill_tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {attachments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Paperclip className="w-3 h-3" /> Attachments
              </p>
              <div className="space-y-1">
                {attachments.map((att) => (
                  <a
                    key={att.attach_id}
                    href={att.attach_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-primary hover:underline py-1"
                  >
                    <Paperclip className="w-3 h-3" />
                    {att.attach_name}
                    <Badge variant="outline" className="text-[10px] px-1">
                      {att.attach_type}
                    </Badge>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
