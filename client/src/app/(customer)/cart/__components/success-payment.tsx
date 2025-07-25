import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  HomeIcon,
} from "lucide-react";
import { BookingDetails } from "../page";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SuccessfulPaymentProps {
  bookingDetails: BookingDetails;
  paymentMethod: string;
}

function SuccessfulPayment({
  bookingDetails,
  paymentMethod,
}: SuccessfulPaymentProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <CheckCircle2Icon className="h-20 w-20 text-green-500 mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your motorcycle rental has been successfully booked. You'll
                receive a confirmation email shortly.
              </p>
            </div>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col justify-between items-center">
                    <span className="font-medium">Booking ID:</span>
                    <span className="font-bold text-green-600">
                      #{bookingDetails.bookingId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Amount Paid:</span>
                    <span className="font-bold">
                      ₹{bookingDetails.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Type:</span>
                    <span className="font-bold">
                      {bookingDetails.paymentMethod}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booked Motorcycles</h3>
              <div className="space-y-3">
                {bookingDetails.motorcycles.map((motorcycle, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-6 justify-between items-center">
                          <p className="font-semibold">
                            {motorcycle.make} {motorcycle.model}
                          </p>
                          X{" "}
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {motorcycle.duration}
                          </span>
                          X <span>{motorcycle.quantity} N</span>
                        </div>
                        <Badge variant="secondary">Confirmed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {paymentMethod === "partial" && (
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                        Remaining Payment Required
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Please pay the remaining amount of at the time of
                        pickup.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-yellow-primary text-white hover:bg-primary/90"
              >
                <Link href="/my-bookings">
                  View My Bookings
                  <ArrowRightIcon />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/motorcycles">
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Continue Browsing
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SuccessfulPayment;
