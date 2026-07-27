"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileNav } from "./MobileNav";
import { MobileHeader } from "./MobileHeader";
import { Loader2 } from "lucide-react";

export function MainShell({
  children,
  title,
  showBack,
  backHref,
  rightAction,
}: {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
}) {
  const { user, isLoading, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <MobileHeader
        title={title}
        showBack={showBack}
        backHref={backHref}
        rightAction={rightAction}
      />
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      <MobileNav />
    </div>
  );
}
