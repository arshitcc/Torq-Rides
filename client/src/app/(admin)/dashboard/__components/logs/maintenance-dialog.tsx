import { Motorcycle, MotorcycleLog } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getStatusColor } from "../utils";

interface MaintenanceDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logs: MotorcycleLog[];
  selectedMotorcycle: Motorcycle | null;
}

function MaintenanceDialog({
  open,
  setOpen,
  logs,
  selectedMotorcycle,
}: MaintenanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Maintenance Logs</DialogTitle>
          <DialogDescription>
            View maintenance history for {selectedMotorcycle?.make}{" "}
            {selectedMotorcycle?.vehicleModel}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {logs
            .filter((log) => log.motorcycleId === selectedMotorcycle?._id)
            .map((log) => (
              <div key={log._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                  <span className="text-sm text-gray-500 space-x-3">
                    {log.dateIn &&
                      "Date In" + format(log.dateIn, "MMM dd, yyyy")}
                    {log.dateOut &&
                      "Date Out" + format(log.dateOut, "MMM dd, yyyy")}
                  </span>
                </div>
                {/* <p className="text-sm mb-2">{log.reportMessage}</p> */}
                <p className="text-sm font-semibold">Cost: ₹{log.billAmount}</p>
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MaintenanceDialog;
