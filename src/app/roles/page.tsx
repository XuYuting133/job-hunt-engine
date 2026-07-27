"use client";

import { useEffect, useState } from "react";
import { MainShell } from "@/components/layout/MainShell";
import { PageContainer } from "@/components/shared/PageContainer";
import { CardListSkeleton } from "@/components/shared/LoadingSkeleton";
import { RoleCard } from "@/components/roles/RoleCard";
import { RoleForm } from "@/components/roles/RoleForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api/fetcher";
import { Plus, Sparkles } from "lucide-react";
import type { JobRole, ExperienceGem } from "@/types";

export default function RolesPage() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [gemCounts, setGemCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);

  const fetchRoles = async () => {
    try {
      const res = await apiFetch<{ data: JobRole[] }>("/roles");
      const roleList = res.data || [];
      setRoles(roleList);

      // Fetch gem counts for each role
      const counts: Record<string, number> = {};
      for (const role of roleList) {
        try {
          const gemRes = await apiFetch<{ data: ExperienceGem[] }>(
            `/gems?role_id=${role.role_id}`
          );
          counts[role.role_id] = (gemRes.data || []).length;
        } catch {
          counts[role.role_id] = 0;
        }
      }
      setGemCounts(counts);
    } catch {
      // handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (isLoading) {
    return (
      <MainShell title="Experience">
        <PageContainer>
          <CardListSkeleton count={3} />
        </PageContainer>
      </MainShell>
    );
  }

  return (
    <MainShell
      title="Experience"
      rightAction={
        <Button
          size="sm"
          onClick={() => { setEditingRole(null); setShowForm(true); }}
          className="h-9"
        >
          <Plus className="w-4 h-4 mr-1" /> New Role
        </Button>
      }
    >
      <PageContainer>
        {roles.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-12 h-12" />}
            title="No experience yet"
            description="Add your job roles to start building your experience gem repository"
            action={
              <Button
                onClick={() => { setEditingRole(null); setShowForm(true); }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Role
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {roles.map((r) => (
              <RoleCard key={r.role_id} role={r} gemCount={gemCounts[r.role_id] || 0} />
            ))}
          </div>
        )}
      </PageContainer>

      <RoleForm
        open={showForm}
        onOpenChange={setShowForm}
        initialData={editingRole}
      />
    </MainShell>
  );
}
