import { z } from "zod";

const cartItemSchema = z.object({
  motorcycleId: z.string().min(1, "Motorcycle ID is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  pickupDate: z.date().min(new Date(), "Pickup date must be in the future"),
  dropoffDate: z.date().min(new Date(), "Dropoff date must be in the future"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  dropoffTime: z.string().min(1, "Dropoff time is required"),
  pickupLocation: z.string(),
});

const bookingBaseSchema = z.object({
  rentTotal: z.coerce.number().min(0, "Rent total must be positive"),
  securityDepositTotal: z.coerce
    .number()
    .min(0, "Security deposit must be positive"),
  cartTotal: z.coerce.number().min(0, "Cart total must be positive"),
  discountedTotal: z.coerce
    .number()
    .min(0, "Discounted total must be positive"),
  paidAmount: z.coerce.number().min(0, "Paid amount must be positive"),
  remainingAmount: z.coerce
    .number()
    .min(0, "Remaining amount must be positive"),
  cancellationCharge: z.coerce
    .number()
    .min(0, "Cancellation charge must be positive")
    .optional(),
  refundAmount: z.coerce
    .number()
    .min(0, "Refund amount must be positive")
    .optional(),
  couponId: z.string().optional().nullable(),
  coupon: z.object({
    name: z.string().min(1, "Coupon name is required"),
    discountValue: z.number().min(0, "Discount value must be positive"),
  }),
  paymentProvider: z.enum(["RAZORPAY", "UPI", "CASH", "UNKNOWN"]),
  paymentId: z.string().min(1, "Payment ID is required"),
  paymentStatus: z.enum([
    "UNPAID",
    "PARTIAL-PAID",
    "FULLY-PAID",
    "REFUND-INITIATED",
    "REFUNDED",
  ]),
  status: z.enum([
    "PENDING",
    "RESERVED",
    "CONFIRMED",
    "STARTED",
    "CANCELLED",
    "COMPLETED",
  ]),
  cancellationReason: z.string().optional(),
  customer: z
    .object({
      fullname: z.string().min(1, "Customer name is required"),
      email: z.string().email("Invalid email address"),
    })
    .optional(),
  items: z.array(cartItemSchema).min(1, "Booking must have at least one item"),
});

export const addBookingSchema = bookingBaseSchema.extend({
  customer: z
    .object({
      fullname: z.string().min(1, "Customer name is required"),
      email: z.string().email("Invalid email address"),
    })
    .optional(),
});

export const updateBookingSchema = bookingBaseSchema;

export const cancelBookingSchema = z.object({
  cancellationReason: z
    .string()
    .min(1, "A reason for cancellation is required."),
});

export type AddBookingFormData = z.infer<typeof addBookingSchema>;
export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;
export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>;
