"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { reviewSchema, ReviewFormData } from "@/schemas";
import { useReviewStore } from "@/store/review-store";
import { format } from "date-fns";
import Image from "next/image";
import { CreditCardIcon, MapPinIcon } from "lucide-react";
import { Booking } from "@/types";
import { AxiosError } from "axios";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface ReviewModalProps {
  booking: Booking;
  trigger: React.ReactNode;
}

export function ReviewModal({ booking, trigger }: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const { addNewReviewToBookingId, loading: addReviewLoading } =
    useReviewStore();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  const onSubmit = async (data: ReviewFormData) => {
    const toastId = toast.loading("Submitting review...");
    try {
      await addNewReviewToBookingId(booking._id, data);
      toast.success("Review submitted successfully.", { id: toastId });
      form.reset();
      setOpen(false);
    } catch (err: AxiosError | any) {
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Please share your feedback for{" "}
            {booking.items.length > 0 &&
              booking.items.map((item, idx) => (
                <strong key={idx}>
                  {item.motorcycle.make} {item.motorcycle.vehicleModel}
                </strong>
              ))}
          </DialogDescription>
        </DialogHeader>

        {/* Booking Details */}
        <div className="border p-4 rounded-md mb-4 dark:bg-[#18181B]">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-16 h-16 rounded-md overflow-hidden">
              {booking.items.length > 0 &&
                booking.items.map((item, idx) => (
                  <Image
                    src={
                      item.motorcycle?.images[0]?.url ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    alt={`${item.motorcycle.make} ${item.motorcycle.vehicleModel}`}
                    fill
                    className="object-cover"
                  />
                ))}
            </div>
            <div>
              {booking.items.length > 0 &&
                booking.items.map((item, idx) => (
                  <p className="font-semibold">
                    {item.motorcycle.make} {item.motorcycle.vehicleModel}
                  </p>
                ))}
              {booking.items.length > 0 &&
                booking.items.map((item, idx) => (
                  <p className="text-sm text-gray-600">
                    {format(new Date(item.pickupDate), "MMM dd, yyyy")} -{" "}
                    {format(new Date(item.dropoffDate), "MMM dd, yyyy")}
                  </p>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4 text-gray-500" />
              <span>₹{booking.discountedTotal}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span>{booking.items.length} items</span>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-6 w-6 cursor-pointer  ${
                        field.value >= star
                          ? "text-yellow-400 fill-amber-300"
                          : "text-gray-200"
                      }`}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    placeholder="Write your comments..."
                    {...field}
                    className="resize-none"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={addReviewLoading}
                className="w-full"
              >
                {addReviewLoading ? (
                  <Loader2Icon className="animate-spin h-5 w-5" />
                ) : (
                  "Submit Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
