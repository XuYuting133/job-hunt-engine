"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function MobileHeader({
  title,
  showBack = false,
  backHref,
  rightAction,
  className,
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-base font-semibold truncate">{title}</h1>
      </div>
      {rightAction && (
        <div className="flex items-center shrink-0">{rightAction}</div>
      )}
    </header>
  );
}
