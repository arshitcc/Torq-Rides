import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircleIcon,
  ClockIcon,
  WrenchIcon,
  AlertTriangleIcon,
  XCircleIcon,
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "DUE-SERVICE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "IN-SERVICE":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "IN-REPAIR":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "OK":
      return <CheckCircleIcon className="h-4 w-4" />;
    case "DUE-SERVICE":
      return <ClockIcon className="h-4 w-4" />;
    case "IN-SERVICE":
      return <WrenchIcon className="h-4 w-4" />;
    case "IN-REPAIR":
      return <AlertTriangleIcon className="h-4 w-4" />;
    default:
      return <XCircleIcon className="h-4 w-4" />;
  }
};

export function UsersTableRowSkeleton() {
  return (
    <TableRow>
      {/* User Info Cell */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>

      {/* Email Cell */}
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>

      {/* Role Cell */}
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>

      {/* Verification Status Cell */}
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      {/* Joined Date Cell */}
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>

      {/* Actions Cell */}
      <TableCell>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * Loading skeleton for the Motorcycles table row.
 * Mimics the structure of MotorcyclesTableRow.tsx.
 */
export function MotorcyclesTableRowSkeleton() {
  return (
    <TableRow>
      {/* Motorcycle Info Cell */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
      </TableCell>

      {/* Rent Cell */}
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>

      {/* Quantity Cell */}
      <TableCell className="text-center">
        <Skeleton className="h-4 w-8 mx-auto" />
      </TableCell>

      {/* Actions Cell */}
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * Loading skeleton for the Coupons table row.
 * Mimics the structure of CouponsTableRow.tsx.
 */
export function CouponsTableRowSkeleton() {
  return (
    <TableRow>
      {/* Coupon Name Cell */}
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>

      {/* Promo Code Cell */}
      <TableCell>
        <Skeleton className="h-6 w-24 rounded" />
      </TableCell>

      {/* Discount Cell */}
      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>

      {/* Status Cell */}
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>

      {/* Actions Cell */}
      <TableCell>
        <div className="flex gap-4 items-center">
          <Skeleton className="h-6 w-11 rounded-full" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * Loading skeleton for the Maintenance table row.
 * Mimics the structure of MaintenanceTableRow.tsx.
 */
export function MaintenanceTableRowSkeleton() {
  return (
    <TableRow>
      {/* Motorcycle Info Cell */}
      <TableCell>
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </TableCell>

      {/* Status Cell */}
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-full" />
      </TableCell>

      {/* Date In Cell */}
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>

      {/* Date Out Cell */}
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>

      {/* Actions Cell */}
      <TableCell>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export { getStatusColor, getStatusIcon };
