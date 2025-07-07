import { z } from "zod";

export const addToCartSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pickupDate: z.date({
    required_error: "Pickup date is required",
  }),
  dropoffDate: z.date({
    required_error: " is required",
  }),
  pickupTime: z.string().min(4, "Pickup time is required"),
  dropoffTime: z.string().min(4, "Dropoff time is required"),
});

export type AddToCartFormData = z.infer<typeof addToCartSchema>;
