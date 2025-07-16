"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, format } from "date-fns";
import Image from "next/image";
import {
  CalendarIcon,
  CreditCardIcon,
  BikeIcon,
  ClockIcon,
  IndianRupeeIcon,
  UserIcon,
  MailIcon,
} from "lucide-react";
import { Booking } from "@/types";

interface BookingDetailsDialogProps {
  booking: Booking;
  trigger: React.ReactNode;
}

export function BookingDetailsDialog({
  booking,
  trigger,
}: BookingDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "FULLY-PAID":
        return "bg-green-100 text-green-800";
      case "PARTIAL-PAID":
        return "bg-yellow-100 text-yellow-800";
      case "UNPAID":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
      case "FULLY-REFUNDED":
      case "PARTIAL-REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BikeIcon className="h-5 w-5" />
            Booking Details
          </DialogTitle>
          <DialogDescription>
            Booking #{booking._id.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-center">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Booking Date
                    </p>
                    <p className="font-semibold">
                      {format(new Date(booking.bookingDate), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-center">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment Status
                    </p>
                    <Badge
                      className={getPaymentStatusColor(booking.paymentStatus)}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booked Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BikeIcon className="h-5 w-5" />
              Booked Motorcycles ({booking.items.length})
            </h3>
            <div className="space-y-4">
              {booking.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            item.motorcycle?.images[0]?.url ||
                            "/placeholder.svg"
                          }
                          alt={`${item.motorcycle?.make} ${item.motorcycle?.vehicleModel}`}
                          fill
                          className="object-fit"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {item.motorcycle?.make} {item.motorcycle?.vehicleModel}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Pickup Date</p>
                          <p className="font-medium">
                            {format(new Date(item.pickupDate), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Return Date</p>
                          <p className="font-medium">
                            {format(new Date(item.dropoffDate), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">
                            {differenceInDays(
                              new Date(item.dropoffDate),
                              new Date(item.pickupDate)
                            ) + 1}{" "}
                            days
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{item.quantity} unit(s)</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rate per Day</p>
                        <p className="font-medium">
                          ₹{item.motorcycle.rentPerDay.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rent Amount</p>
                        <p className="font-semibold text-green-600">
                          ₹{item.motorcycle.rentPerDay * item.quantity}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IndianRupeeIcon className="h-5 w-5" />
                Payment Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rent Total</span>
                  <span className="font-medium">
                    ₹{booking.rentTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium">
                    ₹{booking.securityDepositTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cart Total</span>
                  <span className="font-medium">
                    ₹{booking.cartTotal.toLocaleString()}
                  </span>
                </div>
                {booking.discountedTotal !== booking.cartTotal && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount Applied ({booking.coupon.promoCode})</span>
                    <span className="font-medium">
                      -₹
                      {(
                        booking.cartTotal - booking.discountedTotal
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Final Amount</span>
                  <span className="text-green-600">
                    ₹{booking.discountedTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="font-medium text-green-600">
                    ₹{booking.paidAmount?.toLocaleString()}
                  </span>
                </div>
                {booking.remainingAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remaining Amount</span>
                    <span className="font-medium text-red-600">
                      ₹{booking.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Provider</p>
                  <p className="font-medium">{booking.paymentProvider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-medium font-mono text-sm">
                    {booking.paymentId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          {booking.customer && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{booking.customer.fullname}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{booking.customer.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
