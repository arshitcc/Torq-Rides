"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  CalendarIcon,
  ClockIcon,
  Loader2Icon,
  BikeIcon,
  XIcon,
  StarIcon,
  InfoIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Booking, UserRolesEnum } from "@/types";
import { AxiosError } from "axios";
import {
  getPaymentStatusColor,
  getStatusColor,
  isCancelled,
  isPast,
  isUpcoming,
} from "./filters";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReviewModal } from "./__components/review-modal";
import { BookingDetailsDialog } from "./__components/booking-details-dialog";
import { BookingDetails, PaymentState } from "../cart/page";
import ProcessingPayment from "../cart/__components/processing-payment";
import SuccessfulPayment from "../cart/__components/success-payment";
import FailedPayment from "../cart/__components/failed-payment";
import { CancelBookingDialog } from "./__components/cancel-booking-dialog";

export default function MyBookingsPage() {
  const {
    bookings,
    loading,
    error,
    getAllBookings,
    cancelBooking,
    metadata,
    generateRazorpayOrder,
    verifyRazorpayPayment,
  } = useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("partial");
  const [paymentState, setPaymentState] = useState<PaymentState>("cart");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const itemsPerPage = 10;

  // Redirect logic moved to useEffect to avoid setState in render
  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user || user.role !== UserRolesEnum.CUSTOMER) {
      router.push("/");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    getAllBookings({
      customerId: user?._id,
      page: currentPage,
      offset: itemsPerPage,
    });
  }, [isAuthenticated, user, currentPage, getAllBookings, router]);

  const handleCancelBooking = async (bookingId: string, cancellationReason: string) => {
    try {
      await cancelBooking(bookingId, cancellationReason);
      toast.success("Booking Cancelled successfully");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to cancel booking. Please try again."
      );
    }
  };

  const handlePayment = async (booking: Booking) => {
    try {
      if (!user) return;

      // Set processing state
      setPaymentState("processing");
      setBookingDetails({
        bookingId: booking._id,
        amount: booking.remainingAmount,
        paymentMethod: paymentMethod,
        motorcycles: booking.items.map((item) => ({
          make: item.motorcycle.make,
          model: item.motorcycle.vehicleModel,
          pickupDate: item.pickupDate,
          dropoffDate: item.dropoffDate,
          pickupLocation: item.pickupLocation,
          dropoffLocation: item.dropoffLocation,
          quantity: item.quantity,
          duration: item.duration,
        })),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });

      const amount = booking.remainingAmount;

      const order = (await generateRazorpayOrder(
        paymentMethod === "partial" ? "p" : "f",
        booking._id
      )) as unknown as {
        id: string;
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "TORQ Rides",
        description: "Motorcycle Rental Booking",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;
            const data = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              amount,
            };

            const paymentResponse = await verifyRazorpayPayment(data);
            if (paymentResponse) {
              // Set booking details for success screen
              setBookingDetails({
                bookingId: paymentResponse._id || `BK${Date.now()}`,
                amount: amount,
                paymentMethod:
                  paymentMethod === "partial"
                    ? "Partial Payment"
                    : "Full Payment",
                motorcycles: booking.items.map((item) => ({
                  make: item.motorcycle.make,
                  model: item.motorcycle.vehicleModel,
                  pickupDate: item.pickupDate,
                  dropoffDate: item.dropoffDate,
                  quantity: item.quantity,
                  pickupLocation: item.pickupLocation,
                  dropoffLocation: item.dropoffLocation,
                  duration: item.duration,
                })),
              });

              setBookingDetails(null);
              setPaymentState("success");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            setErrorMessage(error?.message || "Payment verification failed");
            setPaymentState("failed");
          }
        },
        prefill: {
          name: user?.fullname,
          email: user?.email,
        },
        theme: { color: "#F59E0B" },
        modal: {
          ondismiss: () => {
            setPaymentState("cart");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        setErrorMessage(response.error.description || "Payment failed");
        setPaymentState("failed");
      });
      razorpay.open();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to process payment."
      );
      setPaymentState("failed");
    }
  };

  const renderBookingRow = (booking: Booking) => (
    <TableRow key={booking._id}>
      <TableCell className="font-medium">
        #{booking._id.slice(-8).toUpperCase()}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {booking.items.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
              >
                <Image
                  src={item.motorcycle?.images[0]?.url || "/placeholder.svg"}
                  alt={`${item.motorcycle?.make} ${item.motorcycle?.vehicleModel}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {booking.items.length > 2 && (
              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium">
                  +{booking.items.length - 2}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">
              {booking.items[0]?.motorcycle?.make}{" "}
              {booking.items[0]?.motorcycle?.vehicleModel}
            </p>
            {booking.items.length > 1 && (
              <p className="text-sm text-gray-500">
                +{booking.items.length - 1} more
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
          {booking.paymentStatus}
        </Badge>
      </TableCell>
      <TableCell className="font-semibold">
        ₹{booking.discountedTotal.toLocaleString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <BookingDetailsDialog
            booking={booking}
            trigger={
              <Button variant="outline" size="sm">
                <InfoIcon className="h-4 w-4" />
              </Button>
            }
          />

          {(booking.status === "PENDING" || booking.status === "RESERVED") &&
            booking.remainingAmount > 0 && (
              <Button
                onClick={() => {
                  handlePayment(booking);
                }}
              >
                {" "}
                ₹ Pay
              </Button>
            )}

          {(booking.status === "CONFIRMED" ||
            booking.status === "PENDING" ||
            booking.status === "RESERVED") && (
            <CancelBookingDialog
              booking={booking}
              onConfirmCancel={handleCancelBooking}
            >
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </CancelBookingDialog>
          )}

          {booking.status === "COMPLETED" && (
            <ReviewModal
              booking={booking}
              trigger={
                <Button variant="outline" size="sm">
                  <StarIcon className="h-4 w-4" />
                </Button>
              }
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;
  const totalBookings = metadata?.total || 0;

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter(isPast);
  const cancelledBookings = bookings.filter(isCancelled);

  if (paymentState === "processing") {
    return (
      <ProcessingPayment
        paymentMethod={paymentMethod}
        bookingDetails={bookingDetails}
      />
    );
  }

  // Payment Success State
  if (paymentState === "success" && bookingDetails) {
    return (
      <SuccessfulPayment
        bookingDetails={bookingDetails}
        paymentMethod={paymentMethod}
      />
    );
  }

  // Payment Failed State
  if (paymentState === "failed") {
    return <FailedPayment errorMessage={errorMessage} />;
  }

  if (!user || user.role !== UserRolesEnum.CUSTOMER) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2Icon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BikeIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">My Bookings ({totalBookings})</h1>
        </div>
        <p className="text-gray-600">Manage your motorcycle rental bookings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1">
          <TabsTrigger value="all">All ({totalBookings})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {bookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Bookings Found
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't made any bookings yet.
                </p>
                <Button asChild>
                  <a href="/motorcycles">Browse Motorcycles</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Motorcycles</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings && bookings.map(renderBookingRow)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Upcoming Bookings
                </h3>
                <p className="text-gray-600">
                  You don't have any upcoming bookings.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Motorcycles</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map(renderBookingRow)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastBookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Past Bookings</h3>
                <p className="text-gray-600">
                  You don't have any completed bookings.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Motorcycles</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{pastBookings.map(renderBookingRow)}</TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelledBookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <XIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Cancelled Bookings
                </h3>
                <p className="text-gray-600">
                  You don't have any cancelled bookings.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Motorcycles</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cancelledBookings.map(renderBookingRow)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="overflow-x-auto mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {1 + i}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
