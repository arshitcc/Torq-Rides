import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Booking, PaymentStatusEnum } from "@/types";
import { differenceInDays, format } from "date-fns";
import { Loader2, ShieldCheck } from "lucide-react";

interface CancelBookingDialogProps {
  booking: Booking;
  onConfirmCancel: (bookingId: string) => Promise<void>;
  children: React.ReactNode;
}

export function CancelBookingDialog({
  booking,
  onConfirmCancel,
  children,
}: CancelBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const minimumBookingDate: Date = booking.items.reduce<Date>(
    (minDate, item) => {
      // ensure both sides are Date objects
      const pd =
        item.pickupDate instanceof Date
          ? item.pickupDate
          : new Date(item.pickupDate);

      return pd < minDate ? pd : minDate;
    },

    booking.items[0].pickupDate instanceof Date
      ? booking.items[0].pickupDate
      : new Date(booking.items[0].pickupDate)
  );

  const daysUntilPickup = differenceInDays(minimumBookingDate, new Date());

  let cancellationChargePercentage = 0;

  if (daysUntilPickup < 3) {
    cancellationChargePercentage = 1; // 100%
  } else if (daysUntilPickup >= 3 && daysUntilPickup <= 7) {
    cancellationChargePercentage = 0.5; // 50%
  } else {
    cancellationChargePercentage = 0; // 0% but minimum cancellation charge will be applied
  }

  let cancellationCharge = 0;

  if (booking.paymentStatus === PaymentStatusEnum.PARTIAL) {
    cancellationCharge = Math.max(
      booking.paidAmount * cancellationChargePercentage,
      Number(process.env.NEXT_PUBLIC_CANCELLATION_CHARGE) || 199
    );
  } else if (booking.paymentStatus === PaymentStatusEnum.FULLY_PAID) {
    cancellationCharge = Math.max(
      booking.rentTotal * cancellationChargePercentage,
      Number(process.env.NEXT_PUBLIC_CANCELLATION_CHARGE) || 199
    );
  }

  let refundableAmount = booking.paidAmount - cancellationCharge;

  if (refundableAmount < 0) {
    refundableAmount = 0;
  }

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await onConfirmCancel(booking._id);
      setIsCancelled(true);
    } catch (error) {
      // Error toast is handled in the parent component
      setIsOpen(false); // Close dialog on error
    } finally {
      setIsCancelling(false);
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    // Use a timeout to allow the dialog to close before resetting state
    setTimeout(() => {
      setIsCancelling(false);
      setIsCancelled(false);
    }, 300);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        {isCancelled ? (
          // Cancellation Success View
          <div className="text-center p-4">
            <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <AlertDialogTitle>Cancellation Confirmed</AlertDialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Your refund of{" "}
              <strong>₹{refundableAmount.toLocaleString()}</strong> will be
              initiated within 3-5 business days.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              We're sorry to see you go and hope to serve you better next time.
            </p>
            <Button onClick={resetAndClose} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          // Cancellation Confirmation View
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
              <div className="text-sm text-gray-600 pt-2 space-y-3">
                <p>
                  You are about to cancel your booking for the{" "}
                  <strong>
                    {booking.items[0].motorcycle.make}{" "}
                    {booking.items[0].motorcycle.vehicleModel}
                  </strong>{" "}
                  from{" "}
                  <strong>{format(minimumBookingDate, "MMM dd, yyyy")}</strong>.
                </p>
                <div className="p-3 bg-gray-50 dark:bg-[#18181B] rounded-lg border space-y-2">
                  <p className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-medium">
                      ₹{booking.paidAmount.toLocaleString()}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Cancellation Charges:</span>
                    <span className="font-medium text-red-600">
                      - ₹{cancellationCharge.toLocaleString()}
                    </span>
                  </p>
                  <hr />
                  <p className="flex justify-between font-bold text-lg">
                    <span>Estimated Refund:</span>
                    <span className="text-green-600">
                      ₹{refundableAmount.toLocaleString()}
                    </span>
                  </p>
                </div>
                <p>Are you sure you want to proceed?</p>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700"
              >
                {isCancelling && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancel Booking
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
