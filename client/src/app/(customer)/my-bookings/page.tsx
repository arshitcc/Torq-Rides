"use client";

import { useEffect } from "react";
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
  DownloadIcon,
  BikeIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRolesEnum } from "@/types";
import { AxiosError } from "axios";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MyBookingsPage() {
  const { bookings, loading, error, getAllBookings, cancelBooking } =
    useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== UserRolesEnum.CUSTOMER) {
      toast.error("Access Denied");
      router.push("/");
      return;
    }

    // Fetch user's bookings
    getAllBookings({ customerId: user._id });
  }, [user, getAllBookings, router, toast]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking Cancelled Successfully");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to cancel booking. Please try again."
      );
    }
  };

  if (!user || user.role !== UserRolesEnum.CUSTOMER) {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2Icon className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
            <BikeIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your motorcycle rental bookings
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <Card className="text-center py-16 bg-white/70 backdrop-blur-sm border-yellow-200 shadow-lg">
            <CardContent>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-10 w-10 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                No Bookings Found
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                You haven't made any bookings yet. Start exploring our amazing
                motorcycles!
              </p>
              <Button
                asChild
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg"
              >
                <a href="/motorcycles">Browse Motorcycles</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="overflow-hidden bg-white/70 backdrop-blur-sm border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 py-0"
              >
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white pb-4 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        Booking #{booking._id?.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-yellow-100 flex items-center mt-1">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Booked on{" "}
                        {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        booking.status
                      )} border font-medium text-sm px-3 py-1`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Motorcycle Details */}
                    <div className="lg:col-span-2">
                      <div className="flex space-x-4">
                        <div
                          className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                          onClick={() =>
                            router.push(
                              `/motorcycles/${booking.motorcycle?._id}`
                            )
                          }
                        >
                          <Image
                            src={
                              booking.motorcycle?.image?.url ||
                              "/placeholder.svg?height=112&width=112" ||
                              "/placeholder.svg"
                            }
                            alt={`${booking.motorcycle?.make} ${booking.motorcycle?.vehicleModel}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="flex-1">
                          <h3
                            className="font-bold text-xl mb-3 cursor-pointer hover:text-yellow-600 transition-colors"
                            onClick={() =>
                              router.push(
                                `/motorcycles/${booking.motorcycle?._id}`
                              )
                            }
                          >
                            {booking.motorcycle?.make}{" "}
                            {booking.motorcycle?.vehicleModel}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 bg-yellow-50 rounded-lg p-3">
                              <CalendarIcon className="h-5 w-5 text-yellow-600" />
                              <div>
                                <p className="text-sm text-gray-600">
                                  Duration
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {format(
                                    new Date(booking.startDate),
                                    "MMM dd"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(booking.endDate),
                                    "MMM dd, yyyy"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3">
                              <ClockIcon className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-600">Days</p>
                                <p className="font-semibold text-gray-800">
                                  {Math.ceil(
                                    (new Date(booking.endDate).getTime() -
                                      new Date(booking.startDate).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  ) + 1}{" "}
                                  days
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-3">
                              <CreditCardIcon className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm text-gray-600">
                                  Total Cost
                                </p>
                                <p className="font-bold text-green-700 text-lg">
                                  ₹{booking.totalCost}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-purple-50 rounded-lg p-3">
                              <MapPinIcon className="h-5 w-5 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-600">
                                  Quantity
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {booking.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3">
                      {booking.status === "PENDING" && (
                        <div className="space-y-3">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800 font-medium">
                              ⏳ Awaiting confirmation
                            </p>
                          </div>
                          <Button
                            disabled={user.role===UserRolesEnum.CUSTOMER}
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-50 hover:bg-red-50 border border-red-200 rounded-lg p-4 text-center cursor-pointer"
                          >
                            <p className="text-sm text-red-800 font-medium">
                              {" "}
                              Cancel Booking
                            </p>
                          </Button>
                        </div>
                      )}

                      {booking.status === "CONFIRMED" && (
                        <div className="space-y-3">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <p className="text-sm text-emerald-800 font-medium">
                              ✅ Booking confirmed!
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                          >
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="w-full"
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      )}

                      {booking.status === "COMPLETED" && (
                        <div className="space-y-3">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800 font-medium">
                              🎉 Trip completed!
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                            onClick={() => router.push(`/motorcycles/${booking.motorcycleId}`)}
                          >
                            <StarIcon className="h-4 w-4 mr-2" />
                            Rate Experience
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
