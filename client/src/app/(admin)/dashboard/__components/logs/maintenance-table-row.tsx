import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MotorcycleLog } from "@/types";
import { getStatusColor, getStatusIcon } from "../utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EditIcon, InfoIcon, Trash2Icon } from "lucide-react";

interface MaintenanceTableRowProps {
  log: MotorcycleLog;
  handleEditLog: (log: MotorcycleLog) => void;
  handleDeleteLog: (logId: string) => void;
  setSelectedLog: (log: MotorcycleLog) => void;
  setIsInfoDialogOpen: (open: boolean) => void;
}

function MaintenanceTableRow({
  log,
  handleEditLog,
  handleDeleteLog,
  setSelectedLog,
  setIsInfoDialogOpen,
}: MaintenanceTableRowProps) {
  return (
    <TableRow key={log._id}>
      <TableCell>
        <div className="font-medium">
          {log.motorcycle?.make} {log.motorcycle?.vehicleModel}
        </div>
        <div className="text-sm text-gray-500">
          ID: {log.motorcycleId?.slice(-8).toUpperCase()}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(log?.status)}>
          {getStatusIcon(log?.status)}
          <span className="ml-1">{log?.status}</span>
        </Badge>
      </TableCell>
      <TableCell>
        {log.dateIn ? format(new Date(log.dateIn), "MMM dd, yyyy") : "N/A"}
      </TableCell>
      <TableCell>
        {log.dateOut ? format(new Date(log.dateOut), "MMM dd, yyyy") : "N/A"}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLog(log);
                    setIsInfoDialogOpen(true);
                  }}
                >
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditLog(log)}
                  className="border-yellow-primary/30 hover:bg-yellow-primary/10 bg-transparent"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update Log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Log Entry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this maintenance log? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteLog(log._id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default MaintenanceTableRow;
