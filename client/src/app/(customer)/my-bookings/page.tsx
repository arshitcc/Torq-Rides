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
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  CalendarIcon,
  ClockIcon,
  Loader2Icon,
  BikeIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Booking, UserRolesEnum } from "@/types";
import { AxiosError } from "axios";
import BookingCard from "./__components/booking-card";
import { isCancelled, isPast, isUpcoming } from "./filters";

export default function MyBookingsPage() {
  const { bookings, loading, error, getAllBookings, cancelBooking, metadata } =
    useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking Cancelled successfully");
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

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter(isPast);
  const cancelledBookings = bookings.filter(isCancelled);

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
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
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
            <div>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  setSelectedBooking={setSelectedBooking}
                  handleCancelBooking={handleCancelBooking}
                  showActions={["details"]}
                />
              ))}
            </div>
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
            <div>
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  setSelectedBooking={setSelectedBooking}
                  handleCancelBooking={handleCancelBooking}
                  showActions={["details", "edit", "cancel"]}
                />
              ))}
            </div>
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
            <div>
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  setSelectedBooking={setSelectedBooking}
                  handleCancelBooking={handleCancelBooking}
                  showActions={["details", "download"]}
                />
              ))}
            </div>
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
            <div>
              {cancelledBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  setSelectedBooking={setSelectedBooking}
                  handleCancelBooking={handleCancelBooking}
                  showActions={["details"]}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="overflow-x-auto">
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
