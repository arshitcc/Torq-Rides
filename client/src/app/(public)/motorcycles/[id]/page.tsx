"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import {
  bookingSchema,
  reviewSchema,
  type BookingFormData,
  type ReviewFormData,
} from "@/schemas";
import {
  ArrowLeft,
  Star,
  CreditCard,
  Smartphone,
  Building,
  Bitcoin,
  Loader2Icon,
  CalendarIcon,
  CheckIcon,
  CheckCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { UserRolesEnum } from "@/types";
import { useMotorcycleStore } from "@/store/motorcycle-store";
import { useReviewStore } from "@/store/review-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useBookingStore } from "@/store/booking-store";
import { AxiosError } from "axios";

export default function MotorcycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { motorcycles, loading, getMotorcycleById } = useMotorcycleStore();

  const { reviews, getAllReviewsOfMotorcycleById, addNewReviewToBookingId } =
    useReviewStore();

  const { createBooking, error: bookingErrors } = useBookingStore();

  const { user, isAuthenticated } = useAuthStore();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const bookingForm = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (id) {
      getMotorcycleById(id.toString());
      getAllReviewsOfMotorcycleById(id.toString());
    }
  }, [id, user]);

  const onBookingSubmit = async (data: BookingFormData) => {
    try {
      const response = await createBooking({
        ...data,
        motorcycleId: motorcycles[0]?._id,
        quantity: 1,
      });

      if (response) {
        toast.success("Booking successful!");
      } else {
        toast.error(bookingErrors);
      }
    } catch (error: AxiosError | any) {
      toast.error(
        error.response.data.message ??
          "Failed to process booking. Please try again."
      );
    }
  };

  const calculateTotalCost = () => {
    const startDate = bookingForm.watch("startDate");
    const endDate = bookingForm.watch("endDate");

    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      return days >= 0 ? (days + 1) * motorcycles[0]?.pricePerDay : 0;
    }
    return 0;
  };

  if (!user || user.role !== UserRolesEnum.CUSTOMER) {
    return null;
  }

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed. You will receive a confirmation
              email shortly.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2Icon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/motorcycles">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Motorcycles
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-0 group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-80 md:h-120 overflow-hidden">
                <Image
                  src={motorcycles[0]?.image?.url || "/placeholder.svg"}
                  alt={`${motorcycles[0]?.make} ${motorcycles[0]?.vehicleModel}`}
                  fill
                  className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4" variant="secondary">
                  {motorcycles[0]?.category}
                </Badge>
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {motorcycles[0]?.make} {motorcycles[0]?.vehicleModel}
                </h1>
                <p className="text-gray-600 mb-4">
                  {motorcycles[0]?.description}
                </p>
                <div className="text-3xl font-bold text-primary">
                  ₹{motorcycles[0]?.pricePerDay}/day
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {motorcycles[0]?.specs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(motorcycles[0].specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2 border-b border-primary-200 dark:border-primary-700"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5" />
                        <span className="font-medium ">
                          {key[0].toUpperCase() + key.slice(1)}
                        </span>
                      </div>
                      <span className="">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 lg:bg-gray/45 border-2 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < reviews[currentReviewIndex].rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">
                        {reviews[currentReviewIndex].customer.fullname}
                      </span>
                      <span className="ml-auto text-sm text-gray-500">
                        {format(
                          reviews[currentReviewIndex].createdAt,
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      {reviews[currentReviewIndex].comment}
                    </p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentReviewIndex
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentReviewIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Booking Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Book This Motorcycle</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...bookingForm}>
                <form
                  onSubmit={bookingForm.handleSubmit(onBookingSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={bookingForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "MMM dd, yyyy")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />

                                {field.value
                                  ? format(field.value, "MMM dd, yyyy")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const start = bookingForm.watch("startDate");
                                  return date < (start || new Date());
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {calculateTotalCost() > 0 && (
                    <div className="p-4 dark:bg-transparent border-2 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Cost:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{calculateTotalCost()}
                        </span>
                      </div>
                      <p className="text-sm dark:text-gray-600 mt-1">
                        {differenceInDays(
                          bookingForm.watch("endDate") || new Date(),
                          bookingForm.watch("startDate") || new Date()
                        ) + 1}{" "}
                        days × ₹{motorcycles[0]?.pricePerDay}/day
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-yellow-primary cursor-pointer"
                    size="lg"
                  >
                    <CheckCircleIcon /> Book Now
                  </Button>
                </form>
              </Form>

              {/* Payment Methods unchanged */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Accepted Payment Methods</h4>
                <div className="flex justify-around text-xs text-gray-500 mt-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <span>Cards</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    {" "}
                    <Smartphone className="w-8 h-8 text-gray-400" />{" "}
                    <span>UPI</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Building className="w-8 h-8 text-gray-400" />
                    <span>Net Banking</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Bitcoin className="w-8 h-8 text-gray-400" />
                    <span>Crypto</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
