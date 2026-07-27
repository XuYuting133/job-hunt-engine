import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "px-4 py-4 mx-auto w-full max-w-2xl md:px-6 md:py-6 lg:max-w-4xl",
        className
      )}
    >
      {children}
    </div>
  );
}
