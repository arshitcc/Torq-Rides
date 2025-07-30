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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import {
  CalendarIcon,
  CreditCardIcon,
  BikeIcon,
  ClockIcon,
  IndianRupeeIcon,
  UserIcon,
  MailIcon,
  ShieldAlertIcon,
  TagIcon,
} from "lucide-react";
import {
  Booking,
  BookingStatusEnum,
  PaymentStatusEnum,
  UserRolesEnum,
} from "@/types";
import { getBookingPeriod } from "@/lib/utils";
import { getPaymentStatusColor, getStatusColor } from "../filters";

interface BookingDetailsDialogProps {
  booking: Booking;
  trigger: React.ReactNode;
}

export function BookingDetailsDialog({
  booking,
  trigger,
}: BookingDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const isCancelled =
    booking.status === BookingStatusEnum.CANCELLED ||
    booking.status === BookingStatusEnum.CANCELLATION_REQUESTED;

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
              <div className="grid grid-cols-1 justify-items-center gap-4">
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
                  <TagIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Booking Status
                    </p>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
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

          {isCancelled && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Cancellation Information
                </CardTitle>
                <CardDescription>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Cancellation Reason</span>
                    <span className="font-medium text-red-600">
                      {booking.cancellationReason}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Cancelled by :</span>
                    <span className="font-medium text-red-600">
                      {booking.cancelledBy.role}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-800">
                  <ShieldAlertIcon className="h-5 w-5" />
                  Refund Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Paid Amount</span>
                    <span className="font-medium text-green-600">
                      ₹{booking.paidAmount?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Cancellation Charge
                    </span>
                    <span className="font-medium text-red-600">
                      - ₹{booking.cancellationCharge?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>
                      {booking.paymentStatus ===
                      PaymentStatusEnum.FULLY_REFUNDED
                        ? "Amount Refunded"
                        : "Amount to be Refunded"}
                    </span>
                    <span className="text-green-600">
                      ₹{booking.refundAmount?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                          {item.motorcycle?.make}{" "}
                          {item.motorcycle?.vehicleModel}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 mt-3 items-center">
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Pickup Date</p>
                        <p className="font-medium">
                          {format(new Date(item.pickupDate), "PPP")}
                        </p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Pickup Location</p>
                        <p className="font-medium">{item.pickupLocation}</p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Pickup Time</p>
                        <p className="font-medium">{item.pickupTime}</p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Return Date</p>
                        <p className="font-medium">
                          {format(new Date(item.dropoffDate), "PPP")}
                        </p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Return Location</p>
                        <p className="font-medium">{item.dropoffLocation}</p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Return Timing</p>
                        <p className="font-medium">{item.dropoffTime}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 mt-3 items-center">
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{item.duration}</p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{item.quantity} unit(s)</p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Total Rent</p>
                        <p className="font-semibold">₹{item.rentAmount}</p>
                      </div>
                      <div className="w-full text-center">
                        <p className="text-sm text-gray-500">
                          Total Tax ({item.taxPercentage}%)
                        </p>
                        <p className="font-semibold">₹{item.totalTax}</p>
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
                  <span className="text-muted-foreground">Total Rent</span>
                  <span className="font-medium">₹{booking.rentTotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Tax</span>
                  <span className="font-medium">₹{booking.totalTax}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Security Deposit
                  </span>
                  <span className="font-medium">
                    ₹{booking.securityDepositTotal}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cart Total</span>
                  <span className="font-medium">₹{booking.cartTotal}</span>
                </div>
                {booking.discountedTotal !== booking.cartTotal && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount Applied ({booking.coupon?.promoCode})</span>
                    <span className="font-medium">
                      -₹
                      {booking.cartTotal - booking.discountedTotal}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Final Amount</span>
                  <span className="text-green-600">
                    ₹{booking.discountedTotal}
                  </span>
                </div>
                {booking.paidAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Paid Amount</span>
                    <span className="font-medium text-green-600">
                      ₹{booking.paidAmount}
                    </span>
                  </div>
                )}
                {booking.remainingAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Remaining Amount
                    </span>
                    <span
                      className={`font-medium text-red-600 ${
                        booking.status === BookingStatusEnum.CANCELLED
                          ? "line-through"
                          : ""
                      }`}
                    >
                      ₹{booking.remainingAmount}
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
                Payment Attempts
              </h3>
              {booking.payments.filter((b) => b.status !== "unpaid").length >
                0 &&
                booking.payments
                  .filter((b) => b.status !== "unpaid")
                  .map((p) => (
                    <div
                      key={p.paymentId}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-[#302f2f] rounded-lg px-4 py-2 mb-2"
                    >
                      <div>
                        <p className="text-sm text-gray-500">
                          Payment Provider
                        </p>
                        <p className="font-medium">{p.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment ID</p>
                        <p className="font-medium font-mono text-sm">
                          {p.paymentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Amount</p>
                        <p className="font-medium font-mono text-sm">
                          {p.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className="font-medium font-mono text-sm">
                          {p.status}
                        </p>
                      </div>
                    </div>
                  ))}
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
