"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  FileText,
  Wand2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Target },
  { href: "/generate", label: "Generate", icon: Wand2, accent: true },
  { href: "/roles", label: "Experience", icon: Sparkles },
  { href: "/templates", label: "Templates", icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe h-16">
      {tabs.map((tab) => {
        const isActive = tab.href === "/"
          ? pathname === "/"
          : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-h-touch min-w-[64px] px-2 py-1 rounded-lg transition-colors",
              isActive && "text-primary",
              !isActive && "text-muted-foreground hover:text-foreground",
              tab.accent && isActive && "text-primary font-semibold"
            )}
          >
            <div
              className={cn(
                "relative flex items-center justify-center w-7 h-7",
                tab.accent && isActive && "text-primary"
              )}
            >
              {tab.accent ? (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full",
                    isActive ? "bg-primary/10" : "bg-primary/5"
                  )}
                />
              ) : null}
              <Icon
                className={cn(
                  "w-5 h-5 relative z-10",
                  tab.accent && "w-6 h-6"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span className="text-[10px] leading-tight font-medium">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
