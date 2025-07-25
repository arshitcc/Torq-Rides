import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AvailableBookingStatus,
  AvailablePaymentStatus,
  Booking,
} from "@/types";
import { EditIcon } from "lucide-react";
import { useState } from "react";

interface UpdateStatusDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  booking: Booking;
  selectedBooking: Booking | null;
  setSelectedBooking: (booking: Booking | null) => void;
  newBookingStatus: string;
  newPaymentStatus: string;
  setNewBookingStatus: (status: string) => void;
  setNewPaymentStatus: (status: string) => void;
  handleUpdateStatus: (cancellationReason?: string) => Promise<void>;
}

function UpdateStatusDialog({
  open,
  setOpen,
  booking,
  selectedBooking,
  setSelectedBooking,
  newBookingStatus,
  setNewBookingStatus,
  newPaymentStatus,
  setNewPaymentStatus,
  handleUpdateStatus,
}: UpdateStatusDialogProps) {
  const [cancellationReason, setCancellationReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
          onClick={() => {
            setSelectedBooking(booking);
            setNewBookingStatus(booking.status);
            setNewPaymentStatus(booking.paymentStatus);
          }}
        >
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-yellow-200">
        <DialogHeader>
          <DialogTitle className="text-yellow-800">
            Update Booking Status
          </DialogTitle>
          <DialogDescription>
            Change the status of booking #
            {selectedBooking?._id?.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex gap-4">
          <div className="space-y-2">
            <Label>Booking Status</Label>
            <Select
              value={newBookingStatus}
              onValueChange={setNewBookingStatus}
            >
              <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {AvailableBookingStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select
              value={newPaymentStatus}
              onValueChange={setNewPaymentStatus}
            >
              <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {AvailablePaymentStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {newBookingStatus === "CANCELLED" && (
          <div className="space-y-2">
            <Label>Cancellation Reason</Label>
            <Input
              value={cancellationReason}
              placeholder="Mention the reason for cancellation.(Minimum 5 characters)"
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <DialogClose
            onClick={() => setSelectedBooking(null)}
            className="border-gray-300 outline-2 px-2 py-1 rounded-md"
          >
            Cancel
          </DialogClose>
          <Button
            onClick={() => {
              setOpen(false);
              const reason = cancellationReason;
              setCancellationReason("");
              handleUpdateStatus(reason);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateStatusDialog;
