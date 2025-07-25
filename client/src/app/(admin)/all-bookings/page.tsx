"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { format } from "date-fns";
import {
  EditIcon,
  XIcon,
  Loader2Icon,
  CalendarIcon,
  SearchIcon,
  FilterIcon,
  InfoIcon,
  PlusCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserRolesEnum, Booking } from "@/types";
import { AxiosError } from "axios";
import { BookingDetailsDialog } from "@/app/(customer)/my-bookings/__components/booking-details-dialog";
import { getStatusColor } from "@/app/(customer)/my-bookings/filters";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cancelBookingSchema,
  CancelBookingFormData,
  AddBookingFormData,
  UpdateBookingFormData,
} from "@/schemas/bookings.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UpdateStatusDialog from "./__components/update-status-dialog";

export default function AllBookingsPage() {
  const {
    bookings,
    loading,
    error,
    getAllBookings,
    addBookingByAdmin,
    updateBookingByAdmin,
    cancelBookingByAdmin,
    deleteBookingByAdmin,
    modifyBooking,
    metadata,
  } = useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // State for dialogs
  const [newBookingStatus, setNewBookingStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] =
    useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const cancelForm = useForm<CancelBookingFormData>({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: { cancellationReason: "" },
  });

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role !== UserRolesEnum.ADMIN) {
      toast.warning("Access Denied");
      router.push("/");
      return;
    }
    getAllBookings({ page: currentPage, offset: itemsPerPage });
  }, [user, isAuthenticated, getAllBookings, router, currentPage]);

  const handleAddNewBooking = () => {
    setSelectedBooking(null);
    setIsAddDialogOpen(true);
  };

  const handleUpdateStatus = async (cancellationReason?: string) => {
    if (
      !selectedBooking ||
      !newBookingStatus?.trim() ||
      !newPaymentStatus?.trim()
    )
      return;

    try {
      await modifyBooking(selectedBooking._id, {
        status: newBookingStatus,
        paymentStatus: newPaymentStatus,
        cancellationReason,
      });
      toast.success("Booking Updated Successfully");
      setSelectedBooking(null);
      setNewBookingStatus("");
      setNewPaymentStatus("");
    } catch (error: AxiosError | any) {
      toast.error(
        error?.response.data.message ?? "Failed to update booking status."
      );
    }
  };

  const handleUpdateBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsUpdateDialogOpen(true);
  };

  const handleOpenCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const handleOpenDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBooking) return;
    try {
      await deleteBookingByAdmin(selectedBooking._id);
      toast.success("Booking permanently deleted");
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to delete booking.");
    }
  };

  const handleAddSubmit = async (data: AddBookingFormData) => {
    try {
      await addBookingByAdmin(data);
      toast.success("New booking added successfully!");
      setIsAddDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add booking.");
    }
  };

  const handleUpdateSubmit = async (data: UpdateBookingFormData) => {
    if (!selectedBooking) return;
    try {
      await updateBookingByAdmin(selectedBooking._id, data);
      toast.success("Booking updated successfully!");
      setIsUpdateDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update booking.");
    }
  };

  const handleConfirmCancel = async (data: CancelBookingFormData) => {
    if (!selectedBooking) return;
    try {
      await cancelBookingByAdmin(selectedBooking._id, data);
      toast.success("Booking cancelled successfully");
      setIsCancelDialogOpen(false);
      setSelectedBooking(null);
      cancelForm.reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to cancel booking.");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      booking._id?.toLowerCase().includes(searchLower) ||
      booking.customer?.fullname?.toLowerCase().includes(searchLower) ||
      booking.customer?.email?.toLowerCase().includes(searchLower);
    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && !bookings.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="h-16 w-16 text-yellow-500 animate-spin" />
      </div>
    );
  }

  const totalPages = Math.ceil(metadata?.total / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              All Bookings
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage all customer bookings.
            </p>
          </div>
          {/* <Button onClick={handleAddNewBooking}>
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Booking
          </Button> */}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {[
                    "PENDING",
                    "CONFIRMED",
                    "COMPLETED",
                    "CANCELLED",
                    "STARTED",
                    "RESERVED",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-mono text-sm">
                          #{booking._id?.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {booking.customer?.fullname || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.customer?.email || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(booking.bookingDate),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          ₹{booking.discountedTotal.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {booking.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-2 justify-end">
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateBooking(booking)}
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button> */}
                            <UpdateStatusDialog
                              booking={booking}
                              selectedBooking={selectedBooking}
                              open={isUpdateStatusDialogOpen}
                              setOpen={setIsUpdateStatusDialogOpen}
                              handleUpdateStatus={handleUpdateStatus}
                              newBookingStatus={newBookingStatus}
                              setNewBookingStatus={setNewBookingStatus}
                              newPaymentStatus={newPaymentStatus}
                              setNewPaymentStatus={setNewPaymentStatus}
                              setSelectedBooking={setSelectedBooking}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleOpenCancelDialog(booking)}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleOpenDeleteDialog(booking)}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                            <BookingDetailsDialog
                              booking={booking}
                              trigger={
                                <Button variant="ghost" size="icon">
                                  <InfoIcon className="h-4 w-4" />
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
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

        <AlertDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to cancel?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Please provide a reason for
                cancellation. The cancellation charge is ₹
                {selectedBooking?.cancellationCharge || 0}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...cancelForm}>
              <form
                id="cancel-form"
                onSubmit={cancelForm.handleSubmit(handleConfirmCancel)}
              >
                <FormField
                  control={cancelForm.control}
                  name="cancellationReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Customer request"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => cancelForm.reset()}>
                Back
              </AlertDialogCancel>
              <Button
                type="submit"
                form="cancel-form"
                className="text-white bg-red-600 hover:bg-red-600"
                disabled={loading}
              >
                {loading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Confirm Cancellation"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                booking #{selectedBooking?._id.slice(-8)} and remove its data
                from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Yes, delete it"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
