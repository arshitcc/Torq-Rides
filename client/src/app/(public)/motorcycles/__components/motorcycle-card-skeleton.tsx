import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MotorcycleCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md p-0 animate-pulse">
      {/* Image Placeholder */}
      <CardHeader className="p-0">
        <div className="relative h-56 sm:h-64 lg:h-72 bg-gray-300">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      </CardHeader>

      {/* Content Placeholder */}
      <CardContent className="p-4">
        <CardTitle>
          <Skeleton className="w-3/4 h-6 mb-4" />
        </CardTitle>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <Skeleton className="w-10 h-4" />
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-14 h-4" />
        </div>
      </CardContent>

      {/* Footer Placeholder */}
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-center">
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
