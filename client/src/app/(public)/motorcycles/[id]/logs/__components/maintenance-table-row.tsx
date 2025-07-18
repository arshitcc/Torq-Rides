import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { format } from "date-fns";
import { getStatusColor, getStatusIcon } from "../utils";
import { MotorcycleLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import { EditIcon, InfoIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaintenanceTableRowProps {
  log: MotorcycleLog;
  handleEditLog: (log: MotorcycleLog) => void;
  handleDeleteLog: (motorcycleId: string, logId: string) => void;
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
        {log?.dateIn ? format(new Date(log.dateIn), "MMM dd, yyyy") : "N/A"}
      </TableCell>
      <TableCell>
        {log?.dateOut ? format(new Date(log.dateOut), "MMM dd, yyyy") : "N/A"}
      </TableCell>
      <TableCell>{log.serviceCentreName}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(log?.status)}>
          {getStatusIcon(log?.status)}
          <span className="ml-1">{log?.status}</span>
        </Badge>
      </TableCell>
      <TableCell>{log?.thingsToDo?.odoReading.toLocaleString()} km</TableCell>
      <TableCell>
        {log?.billAmount ? `₹${log.billAmount.toLocaleString()}` : "Pending"}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Log</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this maintenance log?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleDeleteLog(log.motorcycle._id, log._id)
                        }
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Log</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default MaintenanceTableRow;
