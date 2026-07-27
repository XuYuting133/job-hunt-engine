import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  lines?: number;
}

export function LoadingSkeleton({ lines = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
