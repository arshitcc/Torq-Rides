import { Card, CardContent } from "@/components/ui/card";
import { Booking, Cart } from "@/types";
import { CreditCardIcon, Loader2Icon } from "lucide-react";
import { BookingDetails } from "../page";

interface ProcessingPaymentProps {
  paymentMethod?: string;
  calculateAdvancePayment?: () => number;
  cart?: Cart | null;
  bookingDetails?: BookingDetails | null;
}

function ProcessingPayment({
  paymentMethod,
  calculateAdvancePayment,
  cart,
  bookingDetails,
}: ProcessingPaymentProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="relative">
              <Loader2Icon className="h-16 w-16 text-primary mx-auto animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCardIcon className="h-8 w-8 text-primary/60" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we process your payment. Do not close this
                window.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-semibold">
                  ₹
                  {bookingDetails
                    ? bookingDetails.amount
                    : paymentMethod === "partial" && calculateAdvancePayment
                    ? calculateAdvancePayment()
                    : cart?.discountedTotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Type:</span>
                <span className="font-semibold">
                  {paymentMethod === "partial"
                    ? "Partial Payment"
                    : "Full Payment"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProcessingPayment;
