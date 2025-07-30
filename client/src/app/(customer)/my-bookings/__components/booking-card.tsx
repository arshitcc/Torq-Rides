import { Card, CardContent } from "@/components/ui/card";
import { Booking, CartItem } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { getPaymentStatusColor, getStatusColor } from "../filters";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditIcon, InfoIcon, StarIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { ReviewModal } from "./review-modal";

function BookingCard({
  booking,
  showActions,
  setSelectedBooking,
  handleCancelBooking,
}: {
  booking: Booking;
  showActions: string[];
  setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
  handleCancelBooking: (bookingId: string) => Promise<void>;
}) {
  const router = useRouter();

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Booking ID */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                #{booking._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
              </p>
            </div>

            {/* Motorcycle Images */}
            <div className="flex space-x-2">
              {booking.items?.slice(0, 3).map((item: any, index: number) => (
                <div
                  key={index}
                  className="relative w-12 h-12 rounded-lg overflow-hidden"
                >
                  <Image
                    src={item.motorcycle?.images[0]?.url || "/placeholder.svg"}
                    alt={`${item.motorcycle?.make} ${item.motorcycle?.vehicleModel}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {booking.items?.length > 3 && (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{booking.items.length - 3}
                  </span>
                </div>
              )}
            </div>

            {/* Booking Amount */}
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                ₹{booking.discountedTotal}
              </p>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 ml-4">
            {showActions.includes("details") && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                      Booking #{booking._id?.slice(-8).toUpperCase()}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Booking Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Booking Date
                        </p>
                        <p className="text-sm">
                          {format(new Date(booking.bookingDate), "PPP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Payment Status
                        </p>
                        <Badge
                          className={getPaymentStatusColor(
                            booking.paymentStatus
                          )}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Payment Provider
                        </p>
                        <p className="text-sm">{booking.paymentProvider}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Booked Items
                      </h4>
                      <div className="space-y-3">
                        {booking.items?.map((item: CartItem, index: number) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={
                                      item.motorcycle?.images[0]?.url ||
                                      "/placeholder.svg"
                                    }
                                    alt={`${item.motorcycle?.make} ${item.motorcycle?.vehicleModel}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold">
                                    {item.motorcycle?.make}{" "}
                                    {item.motorcycle?.vehicleModel}
                                  </h5>
                                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                                    <div>
                                      <p>
                                        Pickup:{" "}
                                        {format(
                                          new Date(item.pickupDate),
                                          "PPP"
                                        )}
                                      </p>
                                      <p>
                                        Return:{" "}
                                        {format(
                                          new Date(item.dropoffDate),
                                          "PPP"
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <p>Quantity: {item.quantity}</p>
                                      <p>
                                        Rate: W/D ₹
                                        {item.motorcycle?.pricePerDayMonThu},
                                        W/E ₹
                                        {item.motorcycle?.pricePerDayFriSun}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 dark:bg-[#18181B] p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3">
                        Pricing Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Rent Total</span>
                          <span>₹{booking.rentTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Deposit</span>
                          <span>₹{booking.securityDepositTotal}</span>
                        </div>
                        {booking.discountedTotal !== booking.cartTotal && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount Applied</span>
                            <span>
                              -₹
                              {booking.cartTotal - booking.discountedTotal}
                            </span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Amount</span>
                          <span>₹{booking.discountedTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {showActions.includes("edit") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/booking/${booking._id}/modify`)}
              >
                <EditIcon className="h-4 w-4" />
              </Button>
            )}

            {booking.status === "COMPLETED" && (
              <>
                <ReviewModal
                  booking={booking}
                  trigger={
                    <Button variant="outline" size="sm">
                      <StarIcon className="h-4 w-4" />
                      Rate Experience
                    </Button>
                  }
                />
              </>
            )}

            {showActions.includes("cancel") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to cancel this booking?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Your booking will be
                      cancelled and you may be eligible for a refund based on
                      our cancellation policy.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleCancelBooking(booking._id.toString())
                      }
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingCard;
