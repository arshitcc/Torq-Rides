import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Button } from "@/components/ui/button";
import { EditIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import { Motorcycle } from "@/types";
import { getFormattedAmount } from "@/lib/utils";

interface MotorcyclesTableRowProps {
  motorcycle: Motorcycle;
  handleDeleteMotorcycle: (motorcycleId: string) => void;
}

function MotorcyclesTableRow({
  motorcycle,
  handleDeleteMotorcycle,
}: MotorcyclesTableRowProps) {
  return (
    <TableRow key={motorcycle._id} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={
                motorcycle?.images[0]?.url ||
                "/placeholder.svg?height=48&width=48"
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
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p>Mon-Thu: ₹{getFormattedAmount(motorcycle.pricePerDayMonThu)}</p>
          <p>Fri-Sun: ₹{getFormattedAmount(motorcycle.pricePerDayFriSun)}</p>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {motorcycle.availableInCities.reduce(
          (acc, prev) => prev.quantity + acc,
          0
        )}
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
                        className="bg-red-600 hover:bg-red-700 text-white"
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
