"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CreditCardIcon,
  PhoneIcon,
  Loader2Icon,
  StarIcon,
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRolesEnum } from "@/types";
import { AxiosError } from "axios";
import { ReviewModal } from "./__components/review-modal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-50 text-green-700 border-green-200";
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function MyBookingsPage() {
  const { bookings, loading, error, getAllBookings, cancelBooking, metadata } =
    useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Redirect logic moved to useEffect to avoid setState in render
  useEffect(() => {
    if (!isAuthenticated) return;

    if (user) {
      if (user.role !== UserRolesEnum.CUSTOMER) {
        toast.error("Access Denied");
        router.push("/");
      } else {
        // Authorized: fetch bookings
        window.scrollTo({ top: 0, behavior: "smooth" });
        getAllBookings({
          customerId: user._id,
          page: currentPage,
          offset: itemsPerPage,
        });
      }
    }
  }, [isAuthenticated, user, currentPage, getAllBookings, router]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to cancel booking. Please try again."
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;
  const currentPageFromMeta = metadata?.page || 1;
  const totalBookings = metadata?.total || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2Icon className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BikeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold dark:text-gray-50 text-gray-900">
              My Bookings
            </h1>
          </div>
          <p className="text-gray-600">
            {totalBookings > 0
              ? `Total ${totalBookings} bookings`
              : "Manage your motorcycle rental bookings"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet. Start exploring our
                motorcycles!
              </p>
              <Button asChild>
                <a href="/motorcycles">Browse Motorcycles</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Booking #{booking._id?.slice(-8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Booked on{" "}
                          {format(
                            new Date(booking.bookingDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          booking.status
                        )} font-medium`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Motorcycle Info */}
                      <div className="lg:col-span-2">
                        <div className="flex gap-4">
                          <div
                            className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/motorcycles/${booking.motorcycle?._id}`
                              )
                            }
                          >
                            <Image
                              src={
                                booking.motorcycle?.image?.url ||
                                "/placeholder.svg?height=80&width=80"
                              }
                              alt={`${booking.motorcycle?.make} ${booking.motorcycle?.vehicleModel}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className="font-semibold text-lg cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() =>
                                router.push(
                                  `/motorcycles/${booking.motorcycle?._id}`
                                )
                              }
                            >
                              {booking.motorcycle?.make}{" "}
                              {booking.motorcycle?.vehicleModel}
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Duration
                                  </p>
                                  <p className="text-sm font-medium">
                                    {format(
                                      new Date(booking.startDate),
                                      "MMM dd"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      new Date(booking.endDate),
                                      "MMM dd"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500">Days</p>
                                  <p className="text-sm font-medium">
                                    {Math.ceil(
                                      (new Date(booking.endDate).getTime() -
                                        new Date(booking.startDate).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) + 1}{" "}
                                    days
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Total Cost</p>
                            <p className="text-lg font-bold text-green-600">
                              ₹{booking.totalCost}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-sm font-medium">
                              {booking.quantity}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {booking.status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cancel Booking
                          </Button>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <div>
                            <Button variant="outline" size="sm">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              Contact Support
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking._id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancel Booking
                            </Button>
                          </div>
                        )}

                        {booking.status === "COMPLETED" && (
                          <>
                            <ReviewModal
                              booking={booking}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <StarIcon className="h-4 w-4 mr-1" />
                                  Rate Experience
                                </Button>
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between mt-8">
                <div className="text-sm text-gray-600">
                  Page {currentPageFromMeta} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPageFromMeta - 1)}
                    disabled={currentPageFromMeta <= 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPageFromMeta <= 3) {
                        pageNum = i + 1;
                      } else if (currentPageFromMeta >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPageFromMeta - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPageFromMeta
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPageFromMeta + 1)}
                    disabled={currentPageFromMeta >= totalPages}
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
