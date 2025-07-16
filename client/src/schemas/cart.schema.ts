import { z } from "zod";

export const addToCartSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pickupDate: z.date({
    required_error: "Pickup date is required",
  }),
  dropoffDate: z.date({
    required_error: "Dropoff date is required",
  }),
  pickupTime: z.string().min(4, "Pickup time is required"),
  dropoffTime: z.string().min(4, "Dropoff time is required"),
  pickupLocation: z.string().min(2, "Pickup location is required"),
  dropoffLocation: z.string().min(2, "Dropoff location is required").optional(),
});

export type AddToCartFormData = z.infer<typeof addToCartSchema>;
