import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SortBySkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-2/5 bg-gray-200 dark:bg-[#27272A] rounded-md animate-pulse"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-[#27272A] animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-[#27272A] rounded-md animate-pulse"></div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const LocationsSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-2/5 bg-gray-200 dark:bg-[#27272A] rounded-md animate-pulse"></div>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-5 w-5 rounded-sm bg-gray-200 dark:bg-[#27272A] animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-[#27272A] rounded-md animate-pulse"></div>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Skeleton loader for the main "Filters" card
const FiltersSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-24 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-[#27272A] rounded animate-pulse" />
      </div>
      <div className="flex flex-col-reverse gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-[#27272A]">
        <div className="h-10 w-full bg-gray-300 dark:bg-[#27272A] rounded-lg animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

export { LocationsSkeleton, FiltersSkeleton, SortBySkeleton };
