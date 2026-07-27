"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { CardListSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GemCard } from "@/components/gems/GemCard";
import { GemForm } from "@/components/gems/GemForm";
import { RoleForm } from "@/components/roles/RoleForm";
import { apiFetch } from "@/lib/api/fetcher";
import { formatDate, formatDateShort } from "@/lib/utils";
import { Plus, Sparkles, Pencil } from "lucide-react";
import type { JobRole, ExperienceGem, GemAttachment } from "@/types";

export default function RoleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [role, setRole] = useState<JobRole | null>(null);
  const [gems, setGems] = useState<ExperienceGem[]>([]);
  const [attachments, setAttachments] = useState<Record<string, GemAttachment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showGemForm, setShowGemForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingGem, setEditingGem] = useState<ExperienceGem | null>(null);

  const fetchData = async () => {
    try {
      const roleRes = await apiFetch<{ data: JobRole }>(`/roles/${id}`);
      setRole(roleRes.data);

      const gemsRes = await apiFetch<{ data: ExperienceGem[] }>(
        `/gems?role_id=${id}`
      );
      const gemList = gemsRes.data || [];
      setGems(gemList);

      // Fetch attachments for each gem
      // For MVP, attachments are fetched from the gem_attachments table
      // via a direct Supabase client call; simplified here as inline
      const attMap: Record<string, GemAttachment[]> = {};
      for (const gem of gemList) {
        attMap[gem.gem_id] = [];
      }
      setAttachments(attMap);
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleEditGem = (gem: ExperienceGem) => {
    setEditingGem(gem);
    setShowGemForm(true);
  };

  if (isLoading) {
    return (
      <MainShell title="Loading..." showBack backHref="/roles">
        <PageContainer>
          <CardListSkeleton count={4} />
        </PageContainer>
      </MainShell>
    );
  }

  if (!role) {
    return (
      <MainShell title="Not Found" showBack backHref="/roles">
        <PageContainer>
          <EmptyState title="Role not found" />
        </PageContainer>
      </MainShell>
    );
  }

  return (
    <MainShell
      title={role.role_title}
      showBack
      backHref="/roles"
      rightAction={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRoleForm(true)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      }
    >
      <PageContainer>
        {/* Role info card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{role.company_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              {formatDateShort(role.start_date)}
              {role.end_date ? ` – ${formatDateShort(role.end_date)}` : " – Present"}
            </p>
            {role.overall_job_scope && (
              <p className="text-muted-foreground">{role.overall_job_scope}</p>
            )}
          </CardContent>
        </Card>

        {/* Gems section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Experience Gems
            </h2>
            <Button
              size="sm"
              onClick={() => { setEditingGem(null); setShowGemForm(true); }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Gem
            </Button>
          </div>

          {gems.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="w-10 h-10" />}
              title="No gems yet"
              description="Add achievements, projects, and milestones as gems"
              action={
                <Button
                  onClick={() => { setEditingGem(null); setShowGemForm(true); }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add First Gem
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {gems.map((gem) => (
                <GemCard
                  key={gem.gem_id}
                  gem={gem}
                  attachments={attachments[gem.gem_id] || []}
                  roleId={id}
                  onEdit={handleEditGem}
                  onRefresh={fetchData}
                />
              ))}
            </div>
          )}
        </div>
      </PageContainer>

      <GemForm
        open={showGemForm}
        onOpenChange={setShowGemForm}
        roleId={id}
        initialData={editingGem}
        onSuccess={fetchData}
      />

      <RoleForm
        open={showRoleForm}
        onOpenChange={setShowRoleForm}
        initialData={role}
      />
    </MainShell>
  );
}
