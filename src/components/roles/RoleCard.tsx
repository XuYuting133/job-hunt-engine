"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { JobRole } from "@/types";

interface RoleCardProps {
  role: JobRole;
  gemCount?: number;
}

export function RoleCard({ role, gemCount = 0 }: RoleCardProps) {
  return (
    <Link href={`/roles/${role.role_id}`}>
      <Card className="hover:bg-accent/50 transition-colors active:scale-[0.98] cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate">
                {role.role_title}
              </CardTitle>
              <CardDescription className="truncate">
                {role.company_name} · {formatDateShort(role.start_date)}
                {role.end_date ? ` – ${formatDateShort(role.end_date)}` : " – Present"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {gemCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {gemCount} gem{gemCount !== 1 ? "s" : ""}
                </Badge>
              )}
              {role.is_archived && (
                <Badge variant="outline" className="text-xs">
                  Archived
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
