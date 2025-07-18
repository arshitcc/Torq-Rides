import { MotorcycleLog } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CheckSquare,
  XSquare,
  Wrench,
  DollarSign,
  Calendar,
  Info,
  Bike,
} from "lucide-react";
import { getStatusColor } from "../utils";

interface MaintenanceInfoDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  log: MotorcycleLog | null;
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-md font-semibold">{value}</p>
      </div>
    </div>
  );
}

function CheckListItem({
  label,
  checked,
  details,
}: {
  label: string;
  checked: boolean;
  details?: string;
}) {
  return (
    <div className="flex items-start">
      {checked ? (
        <CheckSquare className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
      ) : (
        <XSquare className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
      )}
      <div>
        <p className={`font-medium ${checked ? "" : "text-gray-500"}`}>
          {label}
        </p>
        {checked && details && (
          <p className="text-sm text-gray-600 pl-1">- {details}</p>
        )}
      </div>
    </div>
  );
}

export default function MaintenanceInfoDialog({
  open,
  setOpen,
  log,
}: MaintenanceInfoDialogProps) {
  if (!log) return null;

  const { thingsToDo } = log;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Maintenance Log Details</DialogTitle>
          <DialogDescription>Log ID: {log._id}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Motorcycle Info
            </h3>
            <DetailItem
              icon={<Bike className="h-5 w-5" />}
              label="Motorcycle"
              value={`${log.motorcycle?.make} ${log.motorcycle?.vehicleModel}`}
            />
            <DetailItem
              icon={<Info className="h-5 w-5" />}
              label="Status"
              value={
                <Badge className={getStatusColor(log.status)}>
                  {log.status}
                </Badge>
              }
            />
            <DetailItem
              icon={<Calendar className="h-5 w-5" />}
              label="Date In"
              value={
                log.dateIn ? format(new Date(log.dateIn), "PPP") : "Not set"
              }
            />
            <DetailItem
              icon={<Calendar className="h-5 w-5" />}
              label="Date Out"
              value={
                log.dateOut ? format(new Date(log.dateOut), "PPP") : "Not set"
              }
            />
            <DetailItem
              icon={<Wrench className="h-5 w-5" />}
              label="Service Center"
              value={log.serviceCentreName}
            />
            <DetailItem
              icon={<DollarSign className="h-5 w-5" />}
              label="Bill Amount"
              value={`₹${log.billAmount}`}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Service Checklist
            </h3>
            <div className="space-y-3">
              <DetailItem
                icon={<Info className="h-5 w-5" />}
                label="Odometer Reading"
                value={`${thingsToDo.odoReading} km`}
              />
              <CheckListItem
                label="Scheduled Service"
                checked={thingsToDo.scheduledService}
              />
              <CheckListItem
                label="Brake Pads"
                checked={thingsToDo.brakePads}
              />
              <CheckListItem label="Chain Set" checked={thingsToDo.chainSet} />
              <CheckListItem
                label="Damage Repair"
                checked={thingsToDo.damageRepair}
                details={thingsToDo.damageDetails}
              />
              <CheckListItem
                label="Clutch Work"
                checked={thingsToDo.clutchWork}
                details={thingsToDo.clutchDetails}
              />
              <CheckListItem
                label="Other Work"
                checked={thingsToDo.other}
                details={thingsToDo.otherDetails}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
