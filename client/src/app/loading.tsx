// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 bg-background px-4">
      <div className="text-xl font-medium text-muted-foreground">Loading...</div>
      <div className="flex w-full max-w-sm flex-col space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}
