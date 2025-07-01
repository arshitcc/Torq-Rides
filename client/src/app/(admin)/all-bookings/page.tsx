"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Edit,
  X,
  Loader2Icon,
  CalendarIcon,
  UsersIcon,
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

export default function AllBookingsPage() {
  const {
    bookings,
    loading,
    error,
    getAllBookings,
    modifyBooking,
    cancelBooking,
  } = useBookingStore();
  const { user, isAuthenticated } = useAuthStore();

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== UserRolesEnum.ADMIN) {
      toast.error("Access Denied");
      router.push("/");
      return;
    }

    // Fetch all bookings
    getAllBookings();
  }, [user, getAllBookings, router, toast]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.motorcycle?.make
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.motorcycle?.vehicleModel
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      await modifyBooking(selectedBooking._id, { status: newStatus });
      toast.success("Booking Updated Successfully");
      setSelectedBooking(null);
      setNewStatus("");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response.data.message ?? "Failed to update booking status."
      );
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking Cancelled Successfully");
    } catch (error: AxiosError | any) {
      toast.error(error?.response.data.message ?? "Failed to cancel booking.");
    }
  };

  if (!user || user.role !== UserRolesEnum.ADMIN) {
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
            <CalendarIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            All Bookings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all motorcycle rental bookings
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-yellow-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {bookings.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-emerald-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {bookings.filter((b) => b.status === "CONFIRMED").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-yellow-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {bookings.filter((b) => b.status === "PENDING").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Filter className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {bookings.filter((b) => b.status === "COMPLETED").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-yellow-200 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-yellow-500" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 bg-yellow-50 rounded-lg px-3 py-2">
                <Filter className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-700 font-medium">
                  Showing {filteredBookings.length} of {bookings.length}{" "}
                  bookings
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-yellow-200 shadow-lg py-0 gap-0">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-t-lg p-4">
            <CardTitle className="text-xl h-full">
              Bookings ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-yellow-50 hover:bg-yellow-50">
                    <TableHead className="font-semibold text-yellow-800">
                      Booking ID
                    </TableHead>
                    <TableHead className="font-semibold text-yellow-800">
                      Customer
                    </TableHead>
                    <TableHead className="font-semibold text-yellow-800">
                      Motorcycle
                    </TableHead>
                    <TableHead className="font-semibold text-yellow-800">
                      Dates
                    </TableHead>
                    <TableHead className="font-semibold text-yellow-800">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-yellow-800">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-yellow-800">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking, index) => (
                    <TableRow
                      key={booking._id}
                      className={`hover:bg-yellow-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white/50" : "bg-yellow-25/30"
                      }`}
                    >
                      <TableCell className="font-mono text-sm font-medium text-yellow-700">
                        #{booking._id?.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.customer?.fullname || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer?.email || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.motorcycle?.make}{" "}
                            {booking.motorcycle?.vehicleModel}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {booking.quantity}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {format(
                              new Date(booking.startDate),
                              "MMM dd, yyyy"
                            )}
                          </div>
                          <div className="text-gray-500">
                            to{" "}
                            {format(new Date(booking.endDate), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-yellow-700 text-lg">
                        ₹{booking.totalCost}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            booking.status
                          )} border font-medium`}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {booking.status !== "CANCELLED" &&
                            booking.status !== "COMPLETED" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setNewStatus(booking.status);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="border-yellow-200">
                                  <DialogHeader>
                                    <DialogTitle className="text-yellow-800">
                                      Update Booking Status
                                    </DialogTitle>
                                    <DialogDescription>
                                      Change the status of booking #
                                      {booking._id?.slice(-8).toUpperCase()}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <Select
                                      value={newStatus}
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger className="border-yellow-200 focus:border-yellow-400">
                                        <SelectValue placeholder="Select new status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PENDING">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                          Confirmed
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedBooking(null)}
                                      className="border-gray-300"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleUpdateStatus}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                    >
                                      Update Status
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          {booking.status !== "CANCELLED" &&
                            booking.status !== "COMPLETED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking._id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No bookings found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
