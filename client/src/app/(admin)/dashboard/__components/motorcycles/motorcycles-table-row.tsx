import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Motorcycle, User, UserRoles, UserRolesEnum } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "../../page";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  EditIcon,
  FileTextIcon,
  InfoIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
  UserCogIcon,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";

interface MotorcyclesTableRowProps {
  motorcycle: Motorcycle;
  handleDeleteMotorcycle: (motorcycleId: string) => void;
  handleToggleAvailability: (motorcycleId: string, isAvailable: boolean) => void;
}

function MotorcyclesTableRow({
  motorcycle,
  handleDeleteMotorcycle,
  handleToggleAvailability,
}: MotorcyclesTableRowProps) {
  return (
    <TableRow key={motorcycle._id} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={
                motorcycle?.images[0]?.url ||
                "/placeholder.svg?height=48&width=48" ||
                "/placeholder.svg"
              }
              alt={`${motorcycle.make} ${motorcycle.vehicleModel}`}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">
              {motorcycle.make} {motorcycle.vehicleModel}
            </div>
            <div className="text-sm text-gray-500">
              {motorcycle.year} • {motorcycle.variant}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="secondary"
          className="bg-yellow-primary/10 text-yellow-primary"
        >
          {motorcycle.category}
        </Badge>
      </TableCell>
      <TableCell>₹{motorcycle.rentPerDay}</TableCell>
      <TableCell>
        <Badge
          className={
            motorcycle.isAvailable
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }
        >
          {motorcycle.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {motorcycle.availableQuantity}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/motorcycles/${motorcycle._id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Motorcycle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/motorcycles/${motorcycle._id}/logs`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                  >
                    <FileTextIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show Logs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                    >
                      {motorcycle.isAvailable ? (
                        <PowerOffIcon className="h-4 w-4" />
                      ) : (
                        <PowerIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Change Availability</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to mark this motorcycle as{" "}
                        {motorcycle.isAvailable ? "unavailable" : "available"}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleToggleAvailability(
                            motorcycle._id,
                            !motorcycle.isAvailable
                          )
                        }
                        className="bg-yellow-primary hover:bg-yellow-600 text-black"
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Availability</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Motorcycle</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this motorcycle? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteMotorcycle(motorcycle._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Motorcycle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default MotorcyclesTableRow;
